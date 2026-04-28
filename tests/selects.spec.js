import { test, expect } from '@playwright/test';

async function snap(page, name) {
  const path = test.info().outputPath(`${name}.png`);
  await page.screenshot({ path });
  await test.info().attach(name, { path, contentType: 'image/png' });
}

async function snapElement(locator, name) {
  const path = test.info().outputPath(`${name}.png`);
  await locator.screenshot({ path });
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

    // Click to focus — the :focus box-shadow confirms the element is receiving clicks.
    // Native OS dropdown popups render outside the browser compositor and cannot be
    // captured by page.screenshot(); the focused state is the closest visible evidence.
    await select.click();
    await snapElement(select, 'division-select-focused');

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
    await snapElement(select, 'device-select-focused');

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
