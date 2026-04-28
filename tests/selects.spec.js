import { test, expect } from '@playwright/test';

test.describe('Division and Device selects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();
  });

  test('division select updates the heraldry', async ({ page }) => {
    const select = page.locator('#ctrl-shape');

    // Establish a known starting state
    await select.selectOption('barry');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    const svgBefore = await page.locator('#heraldry').innerHTML();

    const beforeShot = await page.screenshot();
    await test.info().attach('division-barry', { body: beforeShot, contentType: 'image/png' });

    // Click to open the native OS dropdown, then screenshot it while open
    await select.click();
    await page.waitForTimeout(300); // native OS picker renders outside the DOM
    const openShot = await page.screenshot();
    await test.info().attach('division-dropdown-open', { body: openShot, contentType: 'image/png' });

    // Select a different division (closes the dropdown and fires change)
    await select.selectOption('chevron');
    await expect(page.locator('#heraldry svg')).toBeVisible();

    const afterShot = await page.screenshot();
    await test.info().attach('division-chevron', { body: afterShot, contentType: 'image/png' });
    const svgAfter = await page.locator('#heraldry').innerHTML();

    expect(svgAfter).not.toBe(svgBefore);
  });

  test('device select updates the heraldry when charges are shown', async ({ page }) => {
    // Charges must be > 0 for device to appear in the SVG
    await page.locator('#ctrl-count').selectOption('1');
    await expect(page.locator('#heraldry svg')).toBeVisible();

    const select = page.locator('#ctrl-device');

    await select.selectOption('annulet');
    await expect(page.locator('#heraldry svg')).toBeVisible();
    const svgBefore = await page.locator('#heraldry').innerHTML();

    const beforeShot = await page.screenshot();
    await test.info().attach('device-annulet', { body: beforeShot, contentType: 'image/png' });

    // Click to open the native OS dropdown, then screenshot it while open
    await select.click();
    await page.waitForTimeout(300); // native OS picker renders outside the DOM
    const openShot = await page.screenshot();
    await test.info().attach('device-dropdown-open', { body: openShot, contentType: 'image/png' });

    await select.selectOption('billet');
    await expect(page.locator('#heraldry svg')).toBeVisible();

    const afterShot = await page.screenshot();
    await test.info().attach('device-billet', { body: afterShot, contentType: 'image/png' });
    const svgAfter = await page.locator('#heraldry').innerHTML();

    expect(svgAfter).not.toBe(svgBefore);
  });

  test('device select has no effect when charge count is zero', async ({ page }) => {
    await page.locator('#ctrl-count').selectOption('0');
    await page.locator('#ctrl-device').selectOption('annulet');
    const svgBefore = await page.locator('#heraldry').innerHTML();

    await page.locator('#ctrl-device').selectOption('billet');
    const svgAfter = await page.locator('#heraldry').innerHTML();

    expect(svgAfter).toBe(svgBefore);
  });
});
