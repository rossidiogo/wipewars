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

    test('skill tree: learn a skill, take a keystone, reset', async ({ page }) => {
      const errors = await boot(page, lang);
      // level 15 = 14 points: enough for the 12 a keystone needs, plus its cost of 2
      await run(page, `save.xp=20*16*15;save.lv.tank=15;selHero='tank';persist()`);
      await open(page, 'heroes');
      await expect(page.locator('#heroBody .sktbtn .skbdg')).toHaveText('14');
      await page.locator('#heroBody .sktbtn').click();
      await expect(page.locator('#skills')).toHaveClass(/\bon\b/);

      const first = page.locator('#skillBody .sknode').first();
      await first.click();
      const learn = page.locator('#skillBody .skdet .btn');
      await expect(learn).toHaveText(lang === 'pt' ? 'Aprender' : 'Learn');
      await learn.click();
      expect(await run<number>(page, `skRank('tank','t_hp')`)).toBe(1);
      await expect(page.locator('#skillBody .skpts b')).toHaveText('13');
      // the second node of the branch stays locked until the first has two ranks
      await expect(page.locator('#skillBody .sknode').nth(1)).toHaveClass(/\blocked\b/);
      await learn.click();
      await expect(page.locator('#skillBody .sknode').nth(1)).not.toHaveClass(/\blocked\b/);

      // auto-assign spends the rest and takes a keystone
      await page.locator('#skillBody .rbtns .btn').first().click();
      await expect(page.locator('#skillBody .skpts b')).toHaveText('0');
      await expect(page.locator('#skillBody .skkey.on')).toHaveCount(1);
      const hp = await run<number>(page, `heroStats('tank').hp`);

      await page.locator('#skillBody .rbtns .btn').nth(1).click();
      await expect(page.locator('#skillBody .skpts b')).toHaveText('14');
      await expect(page.locator('#skillBody .skkey.on')).toHaveCount(0);
      expect(await run<number>(page, `heroStats('tank').hp`)).toBeLessThan(hp);
      expect(errors).toEqual([]);
    });

    test('formation shows a scouting report for the stage', async ({ page }) => {
      const errors = await boot(page, lang);
      await run(page, `openPrep(1)`);
      await expect(page.locator('#prepOdds b')).toHaveText(lang === 'pt' ? 'Chance de vitória 100%' : 'Win chance 100%');
      await run(page, `save.cleared=49;openPrep(50)`);
      await expect(page.locator('#prepOdds b')).toHaveText(lang === 'pt' ? 'Chance de vitória 0%' : 'Win chance 0%');
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
      // Welcome mail 5000 + tester mail 1000 (state.js sendMail calls).
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

test('battle units rescale when the window is resized mid-battle', async ({ page }) => {
  const errors = await boot(page);
  await run(page, `startStage(1)`);
  const ratio = () => run<number>(page, `parseFloat(getComputedStyle(document.querySelector('#field .unit')).scale)*FS*320/$('field').clientWidth`);
  expect(await ratio()).toBeCloseTo(1, 2);
  const before = await run<number>(page, `$('field').clientWidth`);
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect.poll(() => run<number>(page, `$('field').clientWidth`)).not.toBe(before);
  await expect.poll(ratio).toBeCloseTo(1, 2);
  expect(errors).toEqual([]);
});

test('a new player gets from the title screen to a first victory', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.addInitScript(() => { (window as any).NOCUT = 1; });
  await page.goto('/');
  await page.locator('#tName').fill('Rookie');
  await page.locator('#tGo').click();
  // Julia's tutorial opens on the home screen; skip it
  await page.locator('#tip .jskip').click();
  await page.locator('#go').click();
  await page.locator('#campBody .node.cur').click();
  await page.locator('#tip .jskip').click({ timeout: 3000 }).catch(() => {});
  await expect(page.locator('#prepOdds b')).toHaveText('Win chance 100%');
  await page.locator('#prepGo').click();
  await page.locator('#tip .jskip').click({ timeout: 3000 }).catch(() => {});
  await page.locator('#spd').click();
  await expect(page.locator('#result .rtitle.win')).toBeVisible({ timeout: 90_000 });
  // the result breaks the fight down by hero
  await expect(page.locator('#result .bstat')).toHaveCount(3);
  expect(await run<number>(page, `save.cleared`)).toBe(1);
  expect(errors).toEqual([]);
});

test('the chosen language survives a reload', async ({ page }) => {
  const errors = await boot(page);
  await run(page, `setLang('pt')`);
  await page.reload();
  await open(page, 'settings');
  expect(await run<string>(page, `LANG`)).toBe('pt');
  await expect(page.locator('#settings .htitle')).toHaveText('Configurações');
  expect(errors).toEqual([]);
});

// Three teams of four cover the whole roster. In the Lab nobody dies and mana is always full, so every hero
// casts over and over, and the boss lives long enough to telegraph and land its slam.
for (const team of [['tank', 'rafinha', 'lucao', 'dps'], ['chavoso', 'copello', 'glem', 'malaguti'], ['samuel', 'rubens', 'ze', 'donnie']]) {
  test(`every ultimate plays without errors: ${team.join(', ')}`, async ({ page }) => {
    const errors = await boot(page);
    await run(page, `save.autoUlt=true;window.LAB={team:${JSON.stringify(team)},mons:['tp','clorox','boss'],chap:0,stg:1,god:true,immortal:true,mana:true};openScreen('fight');setup();speed=2`);
    await expect.poll(() => run<number>(page, `Math.min(...units.filter(u=>u.side==='h').map(u=>u.st.casts))`), { timeout: 20_000 }).toBeGreaterThanOrEqual(2);
    await expect.poll(() => run<number>(page, `BT.t`), { timeout: 20_000 }).toBeGreaterThan(11);
    expect(errors).toEqual([]);
  });
}
