// Loads the game's rules (js/data, state, skills, engine: the files with no DOM) into an isolated
// context, exactly as the browser would run them, plus the simulated player. Nothing is mocked
// except the clock, the random source and the three page hooks the rules touch.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const RULE_FILES = ['data', 'state', 'skills', 'engine'];

function mulberry(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/**
 * @param {{seed?: number, start?: number, player?: boolean}} [o] seed for Math.random, start time in ms
 * @returns {{run: (code: string) => any, clock: {now: number}}} `run` evaluates code among the game's globals
 */
export function loadGame(o = {}) {
  const clock = { now: o.start ?? Date.UTC(2026, 0, 5, 12) };
  class SimDate extends Date {
    constructor(...a) { if (a.length) super(...a); else super(clock.now); }
    static now() { return clock.now; }
  }
  const ctx = vm.createContext({ console, Date: SimDate, window: {}, toast() {}, sfx() {} });
  vm.runInContext('Math.random=__r;', Object.assign(ctx, { __r: mulberry(o.seed ?? 1) }));
  const files = RULE_FILES.map(f => `js/${f}.js`);
  if (o.player !== false) files.push('tools/sim/player.js');
  for (const f of files) vm.runInContext(readFileSync(join(root, f), 'utf8'), ctx, { filename: f });
  return { run: code => vm.runInContext(code, ctx), clock };
}
