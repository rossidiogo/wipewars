import { signal } from '@preact/signals';

/**
 * Makes Preact screens react to changes made by legacy code. The save is a plain mutable
 * object, so there is nothing to observe; instead every screen that reads it subscribes to
 * `version`, which is bumped whenever legacy code announces a visible change (syncCur).
 */
export const version = signal(0);

/** Re-renders every mounted screen that used useSave(). Call after mutating the save without syncCur(). */
export const touch = () => { version.value++; };

// `typeof` on the bare name, not globalThis[name]: legacy `const`/`let` bindings are not window properties.
const present: Record<string, () => boolean> = {
  save: () => typeof save !== 'undefined',
  DRAW: () => typeof DRAW !== 'undefined',
  ICO: () => typeof ICO !== 'undefined',
  KEYI: () => typeof KEYI !== 'undefined',
  comma: () => typeof comma !== 'undefined',
  give: () => typeof give !== 'undefined',
  syncCur: () => typeof syncCur !== 'undefined',
  showRewards: () => typeof showRewards !== 'undefined',
  openScreen: () => typeof openScreen !== 'undefined',
};
export const REQUIRED_GLOBALS = Object.keys(present);

type Wrapped = (() => void) & { wrapsLegacy?: true };

/** Checks the legacy script loaded and hooks syncCur. Safe to call more than once. */
export function initStore(): void {
  for (const name of REQUIRED_GLOBALS) {
    if (!present[name]()) throw new Error(`Legacy global missing: ${name}`);
  }
  const original: Wrapped = syncCur;
  if (original.wrapsLegacy) return;
  // syncCur is a function declaration, so it is a window property and legacy callers see the wrapper.
  // persist() is deliberately not hooked: it fires many times a second during battles.
  globalThis.syncCur = Object.assign(() => { original(); touch(); }, { wrapsLegacy: true as const });
}

/** The current save, for use while rendering. The component re-renders when legacy code changes it. */
export function useSave(): Save {
  void version.value;
  return save;
}
