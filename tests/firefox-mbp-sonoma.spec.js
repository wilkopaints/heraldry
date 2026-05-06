import { test, expect } from '@playwright/test';

test.describe('2020 MacBook Pro / Sonoma 14.6.1 / Firefox 149.0.2 regression', () => {
  let consoleErrors;
  let pageErrors;

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    pageErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      if (/ServiceWorker|sw\.js/i.test(err.message)) return;
      pageErrors.push(err.message);
    });

    await page.goto('/');
    await expect(page.locator('#heraldry > svg')).toBeVisible();
  });

  test('initial render has no JS errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    expect(pageErrors, `pageerrors: ${pageErrors.join('\n')}`).toEqual([]);
    const appErrors = consoleErrors.filter(e => !/sw\.js|service ?worker|gtag|googletag/i.test(e));
    expect(appErrors, `console errors: ${appErrors.join('\n')}`).toEqual([]);
  });

  test('randomise produces a fresh SVG', async ({ page }) => {
    const before = await page.locator('#heraldry').innerHTML();
    await page.locator('input[type="submit"]').click();
    await expect(page.locator('#heraldry > svg')).toBeVisible();
    const after = await page.locator('#heraldry').innerHTML();
    expect(after).not.toBe(before);
  });

  test('controls panel opens and selects are populated', async ({ page }) => {
    await page.click('details summary');
    const shape = page.locator('#ctrl-shape');
    await expect(shape).toBeVisible();
    const optionCount = await shape.locator('option').count();
    expect(optionCount).toBeGreaterThan(1);
  });

  test('save PNG triggers a download with non-empty file', async ({ page }) => {
    await page.click('details summary');
    await page.locator('#ctrl-count').selectOption('1');
    await page.locator('#ctrl-device').selectOption('annulet');
    await expect(page.locator('#heraldry > svg')).toBeVisible();

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await page.locator('#save-png').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/i);
    const path = await download.path();
    expect(path).toBeTruthy();

    const fs = await import('node:fs');
    const stats = fs.statSync(path);
    expect(stats.size).toBeGreaterThan(1000);

    expect(pageErrors, `pageerrors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('page declares color-scheme so native macOS dropdown is readable', async ({ page }) => {
    const scheme = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement).colorScheme,
      body: getComputedStyle(document.body).colorScheme,
    }));
    const declared = [scheme.html, scheme.body].some(v => v && v !== 'normal');
    expect(
      declared,
      `color-scheme must be declared on :root or body (got html="${scheme.html}", body="${scheme.body}"). Without it, Firefox on macOS Sonoma renders the native <select> popup with the OS light theme while inheriting white text from page CSS, producing unreadable white-on-white options.`,
    ).toBe(true);
  });

  test('select option contrast is safe (either color-scheme or explicit option colors)', async ({ page }) => {
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();

    const result = await page.evaluate(() => {
      const parse = c => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const parts = m[1].split(',').map(s => parseFloat(s.trim()));
        return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
      };
      const rootScheme = getComputedStyle(document.documentElement).colorScheme;
      const opts = Array.from(document.querySelectorAll('#ctrl-shape option, #ctrl-device option')).slice(0, 6);
      const samples = opts.map(o => {
        const cs = getComputedStyle(o);
        return { color: parse(cs.color), bg: parse(cs.backgroundColor), raw: { color: cs.color, bg: cs.backgroundColor } };
      });
      return { rootScheme, samples };
    });

    // If color-scheme advertises dark, the native popup themes itself - inline option colors don't matter.
    if (result.rootScheme && /\bdark\b/.test(result.rootScheme)) return;

    const nearWhite = c => c && c.r > 240 && c.g > 240 && c.b > 240;
    const lowAlpha = c => c && c.a < 0.2;
    for (const s of result.samples) {
      const collision = nearWhite(s.color) && (lowAlpha(s.bg) || nearWhite(s.bg));
      expect(
        collision,
        `No color-scheme declared and option text ${s.raw.color} on background ${s.raw.bg} will collapse to white-on-white in the native macOS Firefox dropdown.`,
      ).toBe(false);
    }
  });

  test('select does not inherit a webfont (avoids Firefox/macOS Wingdings glitch)', async ({ page }) => {
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();

    const families = await page.evaluate(() => {
      const sel = getComputedStyle(document.querySelector('#ctrl-shape')).fontFamily;
      const opt = getComputedStyle(document.querySelector('#ctrl-shape option')).fontFamily;
      return { sel, opt };
    });

    const webfontPattern = /Source Sans Pro|Roboto Slab|Open Sans|Lato|Montserrat/i;
    for (const [where, family] of Object.entries(families)) {
      expect(
        family,
        `<${where === 'sel' ? 'select' : 'option'}> computed font-family "${family}" includes a webfont. Firefox on macOS Sonoma fails to pass loaded webfonts to the native popup widget, rendering garbled Wingdings-like glyphs. Use a system font stack instead of inheriting from body.`,
      ).not.toMatch(webfontPattern);
    }
  });

  test('opened dropdown screenshot for visual regression', async ({ page }) => {
    await page.click('details summary');
    const select = page.locator('#ctrl-shape');
    await expect(select).toBeVisible();

    await select.evaluate(el => {
      el.dataset.sizeBak = el.size;
      el.size = Math.min(el.options.length, 8);
      el.style.height = 'auto';
    });
    const path = test.info().outputPath('dropdown-open.png');
    await select.screenshot({ path });
    await test.info().attach('dropdown-open', { path, contentType: 'image/png' });
    await select.evaluate(el => {
      el.size = parseInt(el.dataset.sizeBak) || 1;
      el.style.height = '';
      delete el.dataset.sizeBak;
    });
  });

  test('viewport and device pixel ratio match target environment', async ({ page }) => {
    const dims = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio,
      ua: navigator.userAgent,
    }));
    expect(dims.width).toBe(1440);
    expect(dims.height).toBe(900);
    expect(dims.dpr).toBe(2);
    expect(dims.ua).toContain('Firefox/149.0');
    expect(dims.ua).toContain('Mac OS X');
  });
});
