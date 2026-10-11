import { test as base, expect, type Page } from '@playwright/test';

export type Lang = 'en' | 'pt';

// Screens reachable with openScreen(id). 'prep' and 'fight' need a stage, see open().
export const SCREENS = ['home', 'campaign', 'recruit', 'heroes', 'skills', 'bag', 'shop', 'tasks', 'cal', 'mail', 'guild', 'friends', 'settings'] as const;

/** Boots the game past the title with a fixed clock, seeded randomness and a known save. */
export async function boot(page: Page, lang: Lang = 'en'): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  // Web fonts come from the network; serve nothing so both builds fall back identically.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00'));
  await page.addInitScript(() => {
    let a = 1;
    Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    (window as any).NOCUT = 1;
  });
  await page.goto('/?skiptitle');
  // save/TIPS/persist are global lexical bindings of the legacy script, not window properties.
  await run(page, `save.name='Tester';save.tut=Object.fromEntries(Object.keys(TIPS).map(k=>[k,1]));save.cleared=3;save.gold=50000;save.gems=2000;persist();`);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  // Switched after load, the way a player does it in Settings.
  if (lang !== 'en') await run(page, `setLang(${JSON.stringify(lang)})`);
  return errors;
}

/** Runs legacy code in the page's global scope (where `save`, `openScreen`, ... live). */
export const run = <T = unknown>(page: Page, code: string) => page.evaluate(c => (0, eval)(c), code) as Promise<T>;

export async function open(page: Page, id: string) {
  await run(page, `openScreen(${JSON.stringify(id)})`);
  await page.waitForTimeout(400);
}

/**
 * Sprites cycle idle frames on a 210 ms timer (art.js). Pin every sprite canvas to frame 0 and
 * mark it busy, which the timer skips, so a screenshot does not depend on when it is taken.
 */
export async function freezeSprites(page: Page) {
  await page.waitForFunction(() => (0, eval)(`Object.values(SP).every(s=>s.idle[0].complete)`));
  await run(page, `document.querySelectorAll('canvas.monc').forEach(c=>{c.dataset.busy=1;drawFrame(c,SP[c.dataset.k].idle[0]);})`);
}

export const test = base;
export { expect };
