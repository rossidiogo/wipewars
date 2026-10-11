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

/** twelve purchases spread over three nodes: enough (12 points in the tree) to open a keystone */
const TWELVE = ['t_hp', 't_hp', 't_hp', 't_dr', 't_dr', 't_dr', 't_regen', 't_regen', 't_regen', 't_atk', 't_atk', 't_atk'];

describe('skill points', () => {
  it('a level 1 hero without stars has no points', () => {
    const g = fresh();
    expect(g.run('skTotal("tank")')).toBe(0);
  });

  it('one point per level after the first, two per star', () => {
    const g = fresh();
    g.run('save.lv.tank=5');
    expect(g.run('skTotal("tank")')).toBe(4);
    g.run('save.stars.tank=1');
    expect(g.run('skTotal("tank")')).toBe(6);
  });
});

describe('skill nodes', () => {
  it('skBuy fails with no points and succeeds with one', () => {
    const g = fresh();
    expect(g.run('skBuy("tank","t_hp")')).toBe(false);
    g.run('save.lv.tank=2');
    expect(g.run('skBuy("tank","t_hp")')).toBe(true);
    expect(g.run('skRank("tank","t_hp")')).toBe(1);
    expect(g.run('skSpent("tank")')).toBe(1);
  });

  it('the second node of a branch is locked until the first has two ranks', () => {
    const g = fresh();
    g.run('save.lv.tank=10');
    expect(g.run('skBlock("tank","t_dr")')).toBe('locked');
    g.run('skBuy("tank","t_hp")');
    expect(g.run('skBlock("tank","t_dr")')).toBe('locked');
    g.run('skBuy("tank","t_hp")');
    expect(g.run('skBlock("tank","t_dr")')).toBe('');
  });

  it('a node cannot go past three ranks', () => {
    const g = fresh();
    g.run('save.lv.tank=30');
    for (let i = 0; i < 3; i++) expect(g.run('skBuy("tank","t_hp")')).toBe(true);
    expect(g.run('skBlock("tank","t_hp")')).toBe('max');
    expect(g.run('skBuy("tank","t_hp")')).toBe(false);
    expect(g.run('skRank("tank","t_hp")')).toBe(3);
  });
});

describe('keystones', () => {
  it('is locked until 12 points are spent in nodes, then costs 2 points', () => {
    const g = fresh();
    g.run('save.lv.tank=30');
    expect(g.run('skKeyBlock("tank","jack_showdown")')).toBe('locked');
    g.run(`[${TWELVE.map(id => `"${id}"`).join(',')}].forEach(id=>skBuy("tank",id))`);
    expect(g.run('skSpent("tank")')).toBe(12);
    const freeBefore = g.run('skFree("tank")');
    expect(g.run('skKeyBlock("tank","jack_showdown")')).toBe('');
    expect(g.run('skPickKey("tank","jack_showdown")')).toBe(true);
    expect(g.run('skFree("tank")')).toBe(freeBefore - 2);
  });

  it('picking the other keystone swaps it without changing points spent', () => {
    const g = fresh();
    g.run('save.lv.tank=30');
    g.run(`[${TWELVE.map(id => `"${id}"`).join(',')}].forEach(id=>skBuy("tank",id))`);
    g.run('skPickKey("tank","jack_showdown")');
    const spent = g.run('skSpent("tank")');
    expect(g.run('skPickKey("tank","jack_whiplash")')).toBe(true);
    expect(g.run('skKey("tank")')).toBe('jack_whiplash');
    expect(g.run('skSpent("tank")')).toBe(spent);
  });
});

describe('reset and mods', () => {
  it('skReset refunds every point, nodes and keystone', () => {
    const g = fresh();
    g.run('save.lv.tank=30');
    g.run(`[${TWELVE.map(id => `"${id}"`).join(',')}].forEach(id=>skBuy("tank",id))`);
    g.run('skPickKey("tank","jack_showdown")');
    g.run('skReset("tank")');
    expect(g.run('skSpent("tank")')).toBe(0);
    expect(g.run('skFree("tank")')).toBe(g.run('skTotal("tank")'));
  });

  it('skMods and heroStats reflect the ranks bought', () => {
    const g = fresh();
    g.run('save.lv.tank=3');
    const hpBefore = g.run('heroStats("tank").hp');
    g.run('skBuy("tank","t_hp")');
    g.run('skBuy("tank","t_hp")');
    expect(g.run('skMods("tank").hp')).toBeCloseTo(0.12);
    expect(g.run('heroStats("tank").hp')).toBeGreaterThan(hpBefore);
  });

  it('skAuto spends every point of a hero up to level 30 and picks a keystone', () => {
    const g = fresh();
    g.run('save.lv.tank=30');
    g.run('skAuto("tank")');
    expect(g.run('skFree("tank")')).toBe(0);
    expect(g.run('skSpent("tank")')).toBe(29);
    expect(g.run('skKey("tank")')).not.toBeNull();
  });

  it('an old save without a sk field does not break skMods', () => {
    const g = fresh();
    g.run('save.sk=undefined');
    expect(g.run('skMods("tank").hp')).toBe(0);
  });
});

describe('tree data', () => {
  it('every hero has two keystones and a tree of three branches of three nodes', () => {
    const g = fresh();
    const shape = js<{ k: string; keys: number; branches: number; nodes: number[] }[]>(g,
      'HIDS.map(k=>({k,keys:KEYSTONES[k].length,branches:skTree(k).length,nodes:skTree(k).map(b=>b.nodes.length)}))');
    expect(shape.length).toBe(12);
    for (const s of shape) {
      expect(s.keys, s.k).toBe(2);
      expect(s.branches, s.k).toBe(3);
      expect(s.nodes, s.k).toEqual([3, 3, 3]);
    }
  });

  it('node ids are unique within each class tree and every node changes a known stat', () => {
    const g = fresh();
    const zeroKeys: string[] = js(g, 'Object.keys(SK_ZERO())');
    const trees = js<Record<string, { ids: string[]; ms: string[] }>>(g,
      'Object.fromEntries(Object.keys(SKTREE).map(c=>[c,{ids:SKTREE[c].flatMap(b=>b.nodes.map(n=>n.id)),ms:SKTREE[c].flatMap(b=>b.nodes.map(n=>n.m))}]))');
    for (const [cls, t] of Object.entries(trees)) {
      expect(new Set(t.ids).size, cls).toBe(t.ids.length);
      for (const m of t.ms) expect(zeroKeys, `${cls}.${m}`).toContain(m);
    }
  });

  it('does not count points a full tree cannot absorb as spendable', () => {
    const g = fresh();
    g.run(`save.lv.tank=21;save.stars.tank=5;skAuto('tank')`);
    expect(g.run(`skFree('tank')`)).toBeGreaterThan(0);
    expect(g.run(`skCanSpend('tank')`)).toBe(false);
    g.run(`skReset('tank')`);
    expect(g.run(`skCanSpend('tank')`)).toBe(true);
  });
});
