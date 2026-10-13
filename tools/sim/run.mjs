// Balance reports. Usage:
//   node tools/sim/run.mjs pace [players] [days]    how fast simulated players clear the campaign
//   node tools/sim/run.mjs heroes [stage] [fights]  how much each hero is worth at equal investment
//   node tools/sim/run.mjs curve                    the level a plain team needs to win each stage
import { loadGame } from './load.mjs';

const [mode = 'pace', a1, a2] = process.argv.slice(2);
const pad = (v, n) => String(v).padStart(n);
const HOUR = 3600e3;

/** Play styles: [name, sessions per day, minutes per session]. */
const STYLES = [['casual', 2, 10], ['regular', 2, 20], ['keen', 3, 30]];

function pace(players = 6, days = 35) {
  console.log(`Days of daily play to clear each chapter (median of ${players} players), and minutes played by then.\n`);
  for (const [name, sessions, minutes] of STYLES) {
    const done = [[], [], [], [], []], mins = [[], [], [], [], []], lvl = [[], [], [], [], []], end = [], stall = [];
    for (let p = 0; p < players; p++) {
      const g = loadGame({ seed: 1000 + p });
      g.run('simNew()');
      let played = 0, last = 0, run = 0, worst = 0;
      for (let d = 1; d <= days; d++) {
        for (let s = 0; s < sessions; s++) {
          g.clock.now += (24 / sessions) * HOUR;
          const before = g.run('save.cleared');
          played += g.run(`simSession(${minutes})`) / 60;
          const after = g.run('save.cleared');
          for (let c = 0; c < 5; c++) if (before < (c + 1) * 10 && after >= (c + 1) * 10) { done[c][p] = d; mins[c][p] = Math.round(played); lvl[c][p] = g.run('plv()'); }
        }
        // days in a row without clearing a new stage (while there is one left to clear)
        const now = g.run('save.cleared');
        run = now === last && now < 50 ? run + 1 : 0; worst = Math.max(worst, run); last = now;
      }
      stall.push(worst);
      end.push(g.run('({c:save.cleared,l:plv(),lv:save.team.map(r=>save.lv[r]),own:HIDS.filter(isOwned).length,pw:save.team.reduce((a,r)=>a+powerOf(r),0)})'));
    }
    const med = a => { const v = a.filter(x => x !== undefined).sort((x, y) => x - y); return v.length > players / 2 ? v[Math.floor(v.length / 2)] : '-'; };
    console.log(`${name} (${sessions} x ${minutes} min/day)`);
    console.log('  chapter   ' + [1, 2, 3, 4, 5].map(c => pad(c, 6)).join(''));
    console.log('  day       ' + done.map(a => pad(med(a), 6)).join(''));
    console.log('  minutes   ' + mins.map(a => pad(med(a), 6)).join(''));
    console.log('  level     ' + lvl.map(a => pad(med(a), 6)).join(''));
    console.log(`  longest wait on one stage: ${med(stall)} days (worst player ${Math.max(...stall)})`);
    const e = end[0];
    console.log(`  after ${days} days: stage ${end.map(x => x.c).join('/')} · player level ${e.l} · team levels ${e.lv.join(',')} · heroes ${e.own}/12\n`);
  }
}

/** Every hero at the same level, weapon, gear and a full auto-assigned tree. */
function account(g, lv, wlv, tier) {
  g.run(`simNew();HIDS.forEach(k=>{save.own[k]=1;save.lv[k]=${lv};save.wlv[k]=${wlv};});save.xp=20*${lv + 1}*${lv}+1;
    HIDS.forEach(k=>{SLOTS.forEach(s=>{const it=newItem(${tier},s,PREF[k],1);save.eq[k][s]=it.id;});skAuto(k);});`);
}

/**
 * A hero's strength index: how much stronger than normal (health and attack both multiplied) the stage's monsters
 * can be before a team with that hero wins only half its fights. Baseline team = 1.00 by construction of the account.
 */
function heroes(stage = 25, fights = 60) {
  const g = loadGame({ seed: 7 });
  const lv = Math.round(6 + stage * .45);
  account(g, lv, Math.min(12, 2 + Math.floor(lv / 3)), Math.min(3, Math.floor(lv / 10)));
  const wins = (team, f) => g.run(`(()=>{save.team=${JSON.stringify(team)};save.form={};fixForm();let w=0;for(let i=0;i<${fights};i++){const ms=monSpecs(stageList(${stage}),${stage});ms.forEach(m=>{m.hp=Math.round(m.hp*${f});m.atk=Math.round(m.atk*${f});});if(runBattle(heroSpecs(save.team,save.form),ms,{seed:i*7919+13}).win)w++;}return w/${fights};})()`);
  const index = team => { let lo = .2, hi = 4; for (let i = 0; i < 9; i++) { const mid = Math.sqrt(lo * hi); if (wins(team, mid) >= .5) lo = mid; else hi = mid; } return Math.sqrt(lo * hi); };
  const base = ['tank', 'dps', 'malaguti', 'rubens'];
  const ref = index(base);
  console.log(`Stage ${stage}: every hero level ${lv}, equal gear, full auto-assigned tree. Index = how much stronger the monsters can be\nbefore the team wins half its fights, relative to the baseline team (Jack, Daniel, Malaguti, Rubens = 1.00).\nTanks replace Jack; everyone else replaces Malaguti, so the team always keeps a tank and a healer.\n`);
  const H = g.run('HEROES'), ids = g.run('HIDS');
  const rows = ids.map(id => {
    const team = base.slice();
    if (!team.includes(id)) { if (H[id].cls === 'tank') team[0] = id; else team[2] = id; }
    return { n: H[id].n, sub: H[id].sub, v: index(team) / ref };
  });
  // the heroes of the baseline team are measured by taking them out: Daniel and Rubens against a second Malaguti-class pick
  rows.sort((x, y) => x.sub.localeCompare(y.sub) || y.v - x.v);
  for (const r of rows) console.log(`  ${r.sub.padEnd(11)} ${r.n.padEnd(9)} ${r.v.toFixed(2)}  ${'#'.repeat(Math.round(r.v * 20))}`);
  console.log(`\n  baseline team beats monsters x${ref.toFixed(2)} at this level`);
}

function curve() {
  const g = loadGame({ seed: 3 });
  console.log('Lowest level at which a plain team (no gear, weapon level 1, no skills) wins a stage 6 times out of 10.\n');
  const out = [];
  for (let n = 1; n <= 50; n++) {
    let lv = 1;
    for (; lv < 400; lv++) {
      const w = g.run(`(()=>{simNew();save.own.malaguti=1;save.team=['tank','dps','malaguti','rubens'];save.form={};fixForm();save.team.forEach(k=>save.lv[k]=${lv});let w=0;for(let i=0;i<10;i++)if(runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(${n}),${n}),{seed:i*31+5}).win)w++;return w;})()`);
      if (w >= 6) break;
    }
    out.push(lv);
  }
  for (let c = 0; c < 5; c++) console.log(`  chapter ${c + 1}: ` + out.slice(c * 10, c * 10 + 10).map(v => pad(v, 4)).join(''));
}

({ pace: () => pace(+a1 || 6, +a2 || 35), heroes: () => heroes(+a1 || 25, +a2 || 60), curve })[mode]();
