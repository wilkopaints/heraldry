import { test, expect } from '@playwright/test';

async function snap(page, name) {
  const path = test.info().outputPath(`${name}.png`);
  await page.screenshot({ path });
  await test.info().attach(name, { path, contentType: 'image/png' });
}

test.describe('Division and Device selects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();
  });

  test('division select updates the heraldry', async ({ page }) => {
    const select = page.locator('#ctrl-shape');

    await select.selectOption('barry');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    const svgBefore = await page.locator('#heraldry').innerHTML();
    await snap(page, 'division-barry');

    await select.click();
    await page.waitForTimeout(300); // native OS picker renders outside the DOM
    await snap(page, 'division-dropdown-open');

    await select.selectOption('chevron');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    await snap(page, 'division-chevron');

    expect(await page.locator('#heraldry').innerHTML()).not.toBe(svgBefore);
  });

  test('device select updates the heraldry when charges are shown', async ({ page }) => {
    await page.locator('#ctrl-count').selectOption('1');
    await expect(page.locator('#heraldry svg')).toBeVisible();

    const select = page.locator('#ctrl-device');

    await select.selectOption('annulet');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    const svgBefore = await page.locator('#heraldry').innerHTML();
    await snap(page, 'device-annulet');

    await select.click();
    await page.waitForTimeout(300); // native OS picker renders outside the DOM
    await snap(page, 'device-dropdown-open');

    await select.selectOption('billet');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    await snap(page, 'device-billet');

    expect(await page.locator('#heraldry').innerHTML()).not.toBe(svgBefore);
  });

  test('device select has no effect when charge count is zero', async ({ page }) => {
    await page.locator('#ctrl-count').selectOption('0');
    await page.locator('#ctrl-device').selectOption('annulet');
    const svgBefore = await page.locator('#heraldry').innerHTML();

    await page.locator('#ctrl-device').selectOption('billet');

    expect(await page.locator('#heraldry').innerHTML()).toBe(svgBefore);
  });
});
