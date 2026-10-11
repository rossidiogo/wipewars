import { test, expect, boot, open, run, SCREENS, type Lang } from './fixtures';

for (const lang of ['en', 'pt'] as Lang[]) {
  test.describe(lang, () => {
    test('every screen opens without errors', async ({ page }) => {
      const errors = await boot(page, lang);
      for (const id of SCREENS) {
        await open(page, id);
        await expect(page.locator(`#${id}`)).toHaveClass(/\bon\b/);
      }
      await run(page, `openPrep(1)`);
      await expect(page.locator('#prep')).toHaveClass(/\bon\b/);
      expect(errors).toEqual([]);
    });

    test('a stage plays to a result', async ({ page }) => {
      test.setTimeout(120_000);
      const errors = await boot(page, lang);
      await run(page, `startStage(1)`);
      await page.locator('#spd').click();
      await expect(page.locator('#result')).toHaveClass(/\bon\b/, { timeout: 90_000 });
      expect(errors).toEqual([]);
    });

    test('mail: claim one, then claim all', async ({ page }) => {
      const errors = await boot(page, lang);
      await open(page, 'mail');
      const bar = page.locator('#mailBody .bagbar span');
      await expect(bar).toHaveText(lang === 'pt' ? '2 para resgatar' : '2 unclaimed');
      const gold = await run<number>(page, `save.gold`);

      await page.locator('#mailBody .mailr .btn').first().click();
      await expect(page.locator('#modal')).toHaveClass(/\bon\b/);
      await page.locator('#modal .btn.primary').click();
      await expect(bar).toHaveText(lang === 'pt' ? '1 para resgatar' : '1 unclaimed');
      await expect(page.locator('#mailBody .mailr').first()).toHaveClass(/\bdone\b/);
      await expect(page.locator('#mailBody .mailr .btn').first()).toBeDisabled();

      await page.locator('#mailBody .bagbar .btn').click();
      await page.locator('#modal .btn.primary').click();
      await expect(bar).toHaveText(lang === 'pt' ? '0 para resgatar' : '0 unclaimed');
      await expect(page.locator('#mailBody .bagbar .btn')).toBeDisabled();
      // Welcome mail 5000 + tester mail 1000 (core.js sendMail calls).
      expect(await run<number>(page, `save.gold`)).toBe(gold + 6000);
      expect(errors).toEqual([]);
    });
  });
}

test('mail follows a language switch made while it is open', async ({ page }) => {
  const errors = await boot(page);
  await open(page, 'mail');
  const bar = page.locator('#mailBody .bagbar span');
  const claim = page.locator('#mailBody .mailr .btn').first();
  await expect(bar).toHaveText('2 unclaimed');
  await run(page, `setLang('pt')`);
  await expect(bar).toHaveText('2 para resgatar');
  await expect(claim).toHaveText('Resgatar');
  await run(page, `setLang('en')`);
  await expect(bar).toHaveText('2 unclaimed');
  await expect(claim).toHaveText('Claim');
  expect(errors).toEqual([]);
});
