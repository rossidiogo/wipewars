// Types for load.mjs, the plain-JS loader of the game's rules. The .mjs itself is not type-checked.
export declare const RULE_FILES: string[];

export interface GameOptions {
  /** seed for Math.random inside the game */
  seed?: number;
  /** start time in ms (default 2026-01-05 12:00 UTC) */
  start?: number;
  /** load tools/sim/player.js too (default true) */
  player?: boolean;
  /** extra js/ files to load after the rules; only ones that need no page (e.g. 'lang') */
  extra?: string[];
}

export interface Game {
  /** evaluates code among the game's globals and returns the value */
  run(code: string): any;
  /** fake clock; advance `now` to simulate time passing */
  clock: { now: number };
}

export declare function loadGame(o?: GameOptions): Game;
