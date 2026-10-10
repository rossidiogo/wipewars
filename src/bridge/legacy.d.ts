/**
 * Types for the globals defined by the legacy scripts in js/ that src/ is allowed to use.
 * The legacy code runs first as one classic script; these names are its top-level bindings.
 * Declare a global here only when a migrated screen needs it, and list it in REQUIRED_GLOBALS.
 */

interface Rewards {
  gold?: number;
  gems?: number;
  tix?: number;
  xp?: number;
  /** Chest keys by tier: b(ronze), s(ilver), g(old). */
  keys?: Record<string, number>;
  /** One random item per entry, of that tier (0 common .. 3 legendary). */
  tiers?: number[];
}

/** What give() actually granted, in the shape showRewards() displays. */
interface RewardOut {
  gold: number;
  gems: number;
  keys: Record<string, number>;
  items: unknown[];
  xp: number;
  tix?: number;
}

interface Mail {
  id: number;
  /** HTML, written by game code only (sendMail in core.js). */
  title: string;
  /** HTML, written by game code only. */
  body: string;
  rewards: Rewards;
  claimed: boolean;
  /** Sent at, ms since epoch. */
  t: number;
}

/** The player's save (core.js DEF). Only the fields src/ reads are typed so far. */
interface Save {
  gold: number;
  gems: number;
  mail: Mail[];
}

// `let` in core.js: legacy code may replace the whole object (cloud load), so never cache it.
declare let save: Save;
/** Screen id -> redraw function. openScreen(id) calls DRAW[id]. */
declare const DRAW: Record<string, () => void>;
/** Icon name -> data URL. */
declare const ICO: Record<string, string>;
/** Key tier (b/s/g) -> icon name. */
declare const KEYI: Record<string, string>;
/** Formats an integer with thousands separators for the current language. */
declare function comma(n: number): string;
/** Grants rewards to the save and persists it. */
declare function give(r: Rewards): RewardOut;
/** Refreshes currency pills and badges. Legacy code calls it after any visible state change. */
declare var syncCur: () => void;
declare function showRewards(title: string, out: RewardOut, sub?: string): void;
declare function openScreen(id: string): void;
