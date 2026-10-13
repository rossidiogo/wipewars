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

const HOUR = 3600e3;

describe('levelUp', () => {
  it('refuses when the hero is already at the player level', () => {
    const g = fresh();
    expect(g.run('plv()')).toBe(1);
    expect(g.run('levelUp("tank")')).toBe(false);
    expect(g.run('save.lv.tank')).toBe(1);
  });

  it('costs the old level in gold, and refuses without enough gold', () => {
    const g = fresh();
    g.run('save.xp=40'); // player level 2
    const cost = g.run('ECON.heroLvCost(save.lv.tank)');
    const gold = g.run('save.gold');
    expect(g.run('levelUp("tank")')).toBe(true);
    expect(g.run('save.lv.tank')).toBe(2);
    expect(g.run('save.gold')).toBe(gold - cost);
    g.run('save.gold=0');
    expect(g.run('levelUp("dps")')).toBe(false);
    expect(g.run('save.lv.dps')).toBe(1);
  });
});

describe('wepUp', () => {
  it('raises the weapon level and costs the old level', () => {
    const g = fresh();
    const cost = g.run('wepCost(wlvOf("tank"))');
    const gold = g.run('save.gold');
    expect(g.run('wepUp("tank")')).toBe(true);
    expect(g.run('save.wlv.tank')).toBe(2);
    expect(g.run('save.gold')).toBe(gold - cost);
  });

  it('stops at WEP_MAX', () => {
    const g = fresh();
    g.run('save.wlv.tank=WEP_MAX;save.gold=1e9');
    expect(g.run('wepUp("tank")')).toBe(false);
    expect(g.run('save.wlv.tank')).toBe(g.run('WEP_MAX'));
  });
});

describe('fuse', () => {
  it('two identical items become one of the next level', () => {
    const g = fresh();
    const n = js(g, `(()=>{const a=newItem(0,'helm',0,0),b=newItem(0,'helm',0,0);const r=fuse(a,b);
      return {tier:r.tier,star:r.star,items:save.items.length};})()`);
    expect(n).toEqual({ tier: 0, star: 1, items: 1 });
  });

  it('a star 2 item rolls over to the next tier at star 0', () => {
    const g = fresh();
    const n = js(g, `(()=>{const a=newItem(0,'helm',0,2),b=newItem(0,'helm',0,2);const r=fuse(a,b);
      return {tier:r.tier,star:r.star};})()`);
    expect(n).toEqual({ tier: 1, star: 0 });
  });

  it('fuseEverything on four identical commons leaves one item with star 2', () => {
    const g = fresh();
    const r = js(g, `(()=>{for(let i=0;i<4;i++)newItem(0,'armor',1,0);const n=fuseEverything();
      return {n,items:save.items.map(i=>({tier:i.tier,star:i.star}))};})()`);
    expect(r.n).toBe(3);
    expect(r.items).toEqual([{ tier: 0, star: 2 }]);
  });
});

describe('give', () => {
  it('adds each reward to the save and returns what it granted', () => {
    const g = fresh();
    const before = js(g, '({gold:save.gold,gems:save.gems,tix:save.tix,b:save.keys.b,xp:save.xp,items:save.items.length})');
    const out = js(g, 'give({gold:5,gems:7,tix:2,keys:{b:2},tiers:[0,1],xp:10})');
    const after = js(g, '({gold:save.gold,gems:save.gems,tix:save.tix,b:save.keys.b,xp:save.xp,items:save.items.length})');
    expect(after.gold - before.gold).toBe(5);
    expect(after.gems - before.gems).toBe(7);
    expect(after.tix - before.tix).toBe(2);
    expect(after.b - before.b).toBe(2);
    expect(after.xp - before.xp).toBe(10);
    expect(after.items - before.items).toBe(2);
    expect(out.gold).toBe(5);
    expect(out.gems).toBe(7);
    expect(out.tix).toBe(2);
    expect(out.keys).toEqual({ b: 2 });
    expect(out.items.length).toBe(2);
  });
});

describe('stageWin', () => {
  it('a first clear sets the stage, pays first-clear gems and tickets', () => {
    const g = fresh();
    const before = js(g, '({gems:save.gems,tix:save.tix})');
    const r = js(g, 'stageWin(1)');
    expect(g.run('save.cleared')).toBe(1);
    expect(r.first).toBe(true);
    expect(r.out.gems).toBe(g.run('ECON.firstClearGems'));
    expect(g.run('save.gems') - before.gems).toBe(g.run('ECON.firstClearGems'));
    expect(g.run('save.tix') - before.tix).toBe(g.run('ECON.firstClearTix'));
  });

  it('a replay pays no gems and less gold than the first clear', () => {
    const g = fresh();
    const first = js(g, 'stageWin(1)');
    const again = js(g, 'stageWin(1)');
    expect(again.first).toBe(false);
    expect(again.out.gems).toBe(0);
    expect(again.out.gold).toBeLessThan(first.out.gold);
  });
});

describe('idle claims', () => {
  it('returns nothing right after a claim', () => {
    const g = fresh();
    g.clock.now += 2 * HOUR;
    expect(js(g, 'claimIdle()')).not.toBeNull();
    expect(js(g, 'claimIdle()')).toBeNull();
  });

  it('pays two hours of idle gold', () => {
    const g = fresh();
    g.clock.now += 2 * HOUR;
    const r = js(g, 'claimIdle()');
    expect(r.out.gold).toBe(Math.floor(120 * g.run('rate()')));
  });

  it('caps the stored idle time at ECON.idleCapMin (8 hours)', () => {
    const g = fresh();
    g.clock.now += 20 * HOUR;
    const r = js(g, 'claimIdle()');
    expect(g.run('ECON.idleCapMin')).toBe(480);
    expect(r.m).toBe(480);
    expect(r.out.gold).toBe(Math.floor(480 * g.run('rate()')));
  });
});

describe('pullOne', () => {
  it('always returns a hero id from HIDS', () => {
    const g = fresh(9);
    const ids: string[] = js(g, '(()=>{const a=[];for(let i=0;i<30;i++)a.push(pullOne().id);return a;})()');
    const hids: string[] = js(g, 'HIDS');
    expect(ids.length).toBe(30);
    for (const id of ids) expect(hids).toContain(id);
  });

  it('gains a new hero within ECON.pityNew pulls of a fresh save', () => {
    const g = fresh(4);
    const owned = () => g.run('HIDS.filter(k=>save.own[k]).length');
    const before = owned();
    g.run('for(let i=0;i<ECON.pityNew;i++)pullOne();');
    expect(owned()).toBeGreaterThan(before);
  });
});

describe('save', () => {
  it('keeps the language setting of a new save', () => {
    const g = fresh();
    expect(g.run('DEF().lang')).toBe('en');
  });
});
