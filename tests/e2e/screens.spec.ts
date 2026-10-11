import { test, expect, boot, freezeSprites, run } from './fixtures';

// Pixel parity gate for the migration. Snapshots are machine-specific, so this runs locally only.
test.skip(!!process.env.CI, 'screenshot snapshots are generated locally');

const shots: [name: string, setup: string][] = [
  ['campaign', `openScreen('campaign')`],
  ['prep', `openPrep(1)`],
  ['recruit', `openScreen('recruit')`],
  ['heroes', `openScreen('heroes')`],
  ['bag', `openScreen('bag')`],
  ...['deals', 'chests', 'gold', 'gems'].map(t => [`shop-${t}`, `shopTab='${t}';openScreen('shop')`] as [string, string]),
  ...['daily', 'ach'].map(t => [`tasks-${t}`, `taskTab='${t}';openScreen('tasks')`] as [string, string]),
  ['cal', `openScreen('cal')`],
  ['mail', `openScreen('mail')`],
  ['guild', `openScreen('guild')`],
  ['friends', `openScreen('friends')`],
  ['settings', `openScreen('settings')`],
];

for (const [name, setup] of shots) {
  test(name, async ({ page }) => {
    const errors = await boot(page);
    await run(page, setup);
    await page.waitForTimeout(400);
    await freezeSprites(page);
    await expect(page).toHaveScreenshot(`${name}.png`);
    expect(errors).toEqual([]);
  });
}
