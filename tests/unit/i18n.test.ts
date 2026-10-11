import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadGame } from '../../tools/sim/load.mjs';

/**
 * The game writes English and js/lang.js translates it to Portuguese at the DOM level, by exact string or
 * by pattern. A string with no entry silently stays English, so every string a player can read is listed
 * here (straight from the data where possible) and must come back changed.
 */
const g = loadGame({ extra: ['lang'], player: false });
g.run(`LANG='pt'`);
const pt = (s: string): string => g.run(`t(${JSON.stringify(s)})`);
const data = <T>(expr: string): T => JSON.parse(g.run(`JSON.stringify(${expr})`));

/** Names that are the same in both languages. */
const SAME = new Set(['Tempo', 'Combo Breaker', 'Fanfarra!', 'Root Access', 'Tornado Shot', 'Perfect!', 'Hotbox', 'Fork Bomb']);

function untranslated(strings: string[]): string[] {
  return [...new Set(strings)].filter(s => !SAME.has(s) && pt(s) === s);
}

describe('Portuguese', () => {
  it('translates every skill tree branch, node and keystone', () => {
    const tree = data<{ n: string; nodes: { n: string; d: string }[] }[][]>('Object.values(SKTREE)');
    const keys = data<{ n: string; d: string }[][]>('Object.values(KEYSTONES)');
    const all = [
      ...tree.flat().flatMap(b => [b.n, ...b.nodes.flatMap(n => [n.n, n.d])]),
      ...keys.flat().flatMap(k => [k.n, k.d]),
    ];
    expect(untranslated(all)).toEqual([]);
  });

  it('translates every ultimate, hero role and weapon', () => {
    const ults = data<{ n: string; d: string }[]>('Object.values(ULT)');
    const roles = data<string[]>('Object.values(HEROES).flatMap(h=>[h.role,h.sub])');
    const weps = data<{ n: string; d: string }[]>('Object.values(WEAPONS)');
    // an ultimate's description is shown with its mana cost appended (ui/heroes.js); the description itself must have an entry
    const all = [...ults.flatMap(u => [u.n, u.d, `${u.d} Needs 60 mana.`]), ...roles, ...weps.flatMap(w => [w.n, w.d])];
    expect(untranslated(all)).toEqual([]);
  });

  it('translates chapters, monsters, tasks and achievements', () => {
    const all = data<string[]>(`[...ECON.chapters.flatMap(c=>[c.n,c.sub]),...Object.values(KINDS).map(k=>k.n).filter(n=>n!=='Bottle'&&n!=='Boss'),
      ...ECON.tasks.map(t=>t.n),...ECON.achievements.flatMap(a=>[a.n,a.d]),...ECON.chests.flatMap(c=>[c.name,c.blurb])]`);
    expect(untranslated(all)).toEqual([]);
  });

  it('translates the skill tree screen', () => {
    expect(untranslated([
      'Skill tree', 'Skill Tree', 'Maxed', 'No skill points left', 'Learn', 'Active', 'Activate', 'Switch to this keystone',
      'Keystone', 'Keystones', 'point to spend', 'points to spend', 'Tap a skill to see what it does.', 'Auto-assign', 'Reset',
      'Points assigned', 'Skill points reset', 'Heroes earn 1 skill point per level-up and 2 per star. Resetting is free.',
      'Previous hero', 'Next hero',
      // built from numbers and names
      'Rank 2 / 3', 'Needs 2 ranks of Thick Skin', 'Spend 12 points in the tree first (4 / 12)', 'Needs 2 skill points',
      '4 / 13 spent', 'Keystones unlock at 12 points (4 / 12)',
    ])).toEqual([]);
  });

  it('translates a name inside a pattern, not only the words around it', () => {
    expect(pt('Needs 2 ranks of Thick Skin')).toContain(pt('Thick Skin'));
  });

  it('translates the battle, its result and the scouting report', () => {
    expect(untranslated([
      'Dodge', 'Enraged!', 'Scouting report', 'Win chance 85%',
      'Should be a clean win', 'You have the edge', 'Could go either way', 'A long shot',
      'Hopeless for now. Level up, upgrade gear or spend skill points.',
      'Time ran out. Bring more damage: level your damage dealers or upgrade their weapons.',
      'You have unspent skill points. Open a hero’s skill tree and spend them.',
      'You can afford to level up a hero. Do that and try again.',
      'Your team was wiped out. Level up your heroes or equip better gear.',
      // the one-time mail a save from before the rebalance receives (state.js)
      'The Great Rebalance',
      'Heroes now have skill trees, and gear and monsters were rebalanced. Every level you already earned is a skill point waiting to be spent. Here is something to get you going again.',
    ])).toEqual([]);
  });

  it('translates every tutorial line', () => {
    // TIPS lives in ui/tutorial.js, which needs a page to load; its literal is plain strings, so read it from the source
    const src = readFileSync(new URL('../../js/ui/tutorial.js', import.meta.url), 'utf8');
    const literal = src.match(/const TIPS=(\{[\s\S]*?\n\});/);
    expect(literal).not.toBeNull();
    const tips = Function(`return ${literal![1]}`)() as Record<string, string[]>;
    expect(Object.keys(tips)).toContain('skills');
    expect(untranslated(Object.values(tips).flat())).toEqual([]);
  });

  it('leaves English alone when the language is English', () => {
    g.run(`LANG='en'`);
    expect(pt('Skill tree')).toBe('Skill tree');
    g.run(`LANG='pt'`);
  });
});
