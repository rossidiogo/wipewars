import { describe, expect, it } from 'vitest';
import { loadGame } from '../../tools/sim/load.mjs';

/** a new game with a fresh new-player save */
function fresh(seed = 1) {
  const g = loadGame({ seed });
  g.run('simNew()');
  return g;
}

/** evaluates an expression in the game and returns it as plain JSON data */
function js<T = any>(g: ReturnType<typeof loadGame>, expr: string): T {
  return JSON.parse(g.run(`JSON.stringify(${expr})`));
}

describe('battle determinism', () => {
  it('the same seed gives the same fight', () => {
    const g = fresh();
    const fight = () => js(g, `(()=>{const B=runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{seed:42});
      return {win:B.win,t:B.t,dmg:B.units.map(u=>u.st.dmg)};})()`);
    expect(fight()).toEqual(fight());
  });
});

describe('battle outcomes', () => {
  it('a fresh team wins stage 1 and loses stage 50', () => {
    const g = fresh();
    expect(g.run('runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{seed:42}).win')).toBe(true);
    expect(g.run('runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(50),50),{seed:42}).win')).toBe(false);
  });

  it('always ends, by the timeout at the latest', () => {
    const g = fresh();
    const r = js(g, `(()=>{const B=runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(50),50),{seed:42});
      return {over:B.over,t:B.t,timeout:ENG.timeout};})()`);
    expect(r.over).toBe(true);
    expect(r.t).toBeLessThanOrEqual(r.timeout + 1);
  });

  it('god mode: no hero loses health in 30 seconds', () => {
    const g = fresh();
    const ok = g.run(`(()=>{const B=createBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{god:true,seed:5});
      B.step(30);return B.units.filter(u=>u.side==='h').every(u=>u.hp===u.max);})()`);
    expect(ok).toBe(true);
  });

  it('one-hit mode: the battle is won within a few seconds', () => {
    const g = fresh();
    const r = js(g, `(()=>{const B=runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{oneHit:true,seed:5});
      return {win:B.win,t:B.t};})()`);
    expect(r.win).toBe(true);
    expect(r.t).toBeLessThanOrEqual(5);
  });
});

describe('ultimates', () => {
  it('cannot be cast until mana is full', () => {
    const g = fresh();
    const r = js(g, `(()=>{const B=createBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{seed:3,auto:false});
      B.step(2);const u=B.units.find(x=>x.kind==='tank');return {cast:B.cast(u),mana:u.mana,mmax:u.mmax};})()`);
    expect(r.cast).toBe(false);
    expect(r.mana).toBeLessThan(r.mmax);
  });

  it('casts when mana is full and resets it to 0', () => {
    const g = fresh();
    const r = js(g, `(()=>{const B=createBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{seed:3,auto:false,freeMana:true});
      B.step(2);const u=B.units.find(x=>x.kind==='tank');const full=u.mana>=u.mmax;
      const cast=B.cast(u);return {full,cast,mana:u.mana};})()`);
    expect(r.full).toBe(true);
    expect(r.cast).toBe(true);
    expect(r.mana).toBe(0);
  });
});

describe('events', () => {
  it('a few seconds of stage 1 emit attacks and damage with positive integer amounts', () => {
    const g = fresh();
    const r = js(g, `(()=>{const B=createBattle(heroSpecs(save.team,save.form),monSpecs(stageList(1),1),{seed:7});
      B.step(5);return {types:B.ev.map(e=>e.e),dmg:B.ev.filter(e=>e.e==='dmg').map(e=>e.n)};})()`);
    expect(r.types).toContain('atk');
    expect(r.types).toContain('dmg');
    expect(r.dmg.length).toBeGreaterThan(0);
    for (const n of r.dmg) {
      expect(Number.isInteger(n) && n > 0).toBe(true);
    }
  });
});

describe('skill effects', () => {
  it('damage reduction (dr) makes the team survive longer', () => {
    const g = fresh();
    const base = js(g, `(()=>{const B=runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(30),30),{seed:42});
      return {win:B.win,t:B.t};})()`);
    const withDr = js(g, `(()=>{const hs=heroSpecs(save.team,save.form);hs.forEach(h=>h.mods.dr=.5);
      const B=runBattle(hs,monSpecs(stageList(30),30),{seed:42});return {win:B.win,t:B.t};})()`);
    expect(base.win).toBe(false);
    expect(withDr.win).toBe(false);
    expect(withDr.t).toBeGreaterThan(base.t);
  });
});
