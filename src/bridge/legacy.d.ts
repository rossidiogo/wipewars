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
  /** HTML, written by game code only (sendMail in state.js). */
  title: string;
  /** HTML, written by game code only. */
  body: string;
  rewards: Rewards;
  claimed: boolean;
  /** Sent at, ms since epoch. */
  t: number;
}

/** The player's save (state.js DEF). Only the fields src/ reads are typed so far. */
interface Save {
  gold: number;
  gems: number;
  mail: Mail[];
  /** Hero ids in the battle team, at most 4. */
  team: string[];
}

/** A playable hero (data.js HEROES). */
interface Hero {
  /** Display name. */
  n: string;
  role: string;
  cls: 'tank' | 'dps' | 'sup';
}

/** One node of a skill tree (skills.js SKTREE). */
interface SkillNode {
  id: string;
  n: string;
  /** What the node changes: a key of SK_ZERO, also the icon name. */
  m: string;
  /** Amount per rank. */
  v: number;
  /** Description, English. */
  d: string;
}
interface SkillBranch {
  n: string;
  /** Branch colour, a CSS colour. */
  col: string;
  nodes: SkillNode[];
}
interface Keystone {
  id: string;
  n: string;
  d: string;
}
/** '' = can be taken now; otherwise the reason it cannot. */
type SkillBlock = '' | 'max' | 'locked' | 'points';
type KeystoneBlock = '' | 'on' | 'locked' | 'points';

// `let` in state.js: legacy code may replace the whole object (cloud load), so never cache it.
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

/** Every hero id, in roster order. */
declare const HIDS: string[];
declare const HEROES: Record<string, Hero>;
declare function isOwned(hero: string): boolean;
/** The hero shown on the Heroes and Skill Tree screens. `let` in ui/heroes.js: assign to change it. */
declare let selHero: string;
/** Draws a sprite into `el`. `m` = CSS px per sprite px; `box` gives the element the sprite's size. */
declare function spriteArt(el: HTMLElement, key: string, m: number, box?: boolean): void;
declare function toast(text: string): void;
declare function sfx(name: string): void;

// Skill trees (skills.js). All rules live there; the screen only calls them.
declare const SK_RANKS: number;
declare const SK_STEP: number;
declare const SK_KEY_REQ: number;
declare const SK_KEY_COST: number;
declare const KEYSTONES: Record<string, Keystone[]>;
declare function skTree(hero: string): SkillBranch[];
declare function skRank(hero: string, node: string): number;
/** The active keystone id, or null. */
declare function skKey(hero: string): string | null;
declare function skTotal(hero: string): number;
declare function skSpent(hero: string): number;
declare function skFree(hero: string): number;
/** Has free points and a node or keystone that can take one. */
declare function skCanSpend(hero: string): boolean;
declare function skBlock(hero: string, node: string): SkillBlock;
declare function skKeyBlock(hero: string, keystone: string): KeystoneBlock;
/** Each returns whether the save changed (it is persisted when it did). */
declare function skBuy(hero: string, node: string): boolean;
declare function skPickKey(hero: string, keystone: string): boolean;
declare function skReset(hero: string): void;
declare function skAuto(hero: string): void;
