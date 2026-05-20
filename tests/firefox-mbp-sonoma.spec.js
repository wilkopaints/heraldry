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

  test('select has no letter-spacing (avoids Firefox/macOS Wingdings glitch)', async ({ page }) => {
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();

    const spacing = await page.evaluate(() => {
      const sel = getComputedStyle(document.querySelector('#ctrl-shape'));
      const opt = getComputedStyle(document.querySelector('#ctrl-shape option'));
      return {
        selLetter: sel.letterSpacing,
        selWord: sel.wordSpacing,
        optLetter: opt.letterSpacing,
        optWord: opt.wordSpacing,
      };
    });

    // Firefox/macOS bug (Bugzilla 1822315): any non-zero letter-spacing on <select>
    // makes the native popup render garbled "Wingdings-like" glyphs on Sonoma/Sequoia.
    const isZero = v => v === 'normal' || /^-?0(\.0+)?(px|em|rem|%)?$/.test(v);
    expect(
      isZero(spacing.selLetter),
      `<select> letter-spacing "${spacing.selLetter}" triggers Firefox/macOS native popup garble — set letter-spacing: normal.`,
    ).toBe(true);
    expect(isZero(spacing.optLetter), `<option> letter-spacing "${spacing.optLetter}" must be zero`).toBe(true);
    expect(isZero(spacing.selWord), `<select> word-spacing "${spacing.selWord}" should be zero as a related precaution`).toBe(true);
    expect(isZero(spacing.optWord), `<option> word-spacing "${spacing.optWord}" should be zero as a related precaution`).toBe(true);
  });

  test('custom dropdown click selects an option and updates heraldry', async ({ page }) => {
    await page.click('details summary');
    const wrap = page.locator('#ctrl-shape').locator('..');
    const trigger = wrap.locator('.cs-trigger');
    const listbox = wrap.locator('.cs-listbox');

    const currentValue = await page.locator('#ctrl-shape').inputValue();

    await trigger.click();
    await expect(listbox).toBeVisible();

    const targetValue = await listbox.locator('.cs-option').evaluateAll(
      (opts, current) => {
        const other = opts.find(o => o.dataset.value !== current);
        return other ? other.dataset.value : null;
      },
      currentValue,
    );
    expect(targetValue, 'expected at least two options to choose between').toBeTruthy();

    const before = await page.locator('#heraldry').innerHTML();
    await listbox.locator(`.cs-option[data-value="${targetValue}"]`).click();
    await expect(listbox).toBeHidden();

    expect(await page.locator('#ctrl-shape').inputValue()).toBe(targetValue);
    expect(await page.locator('#heraldry').innerHTML()).not.toBe(before);
  });

  test('custom dropdown keyboard navigation works', async ({ page }) => {
    await page.click('details summary');
    const wrap = page.locator('#ctrl-device').locator('..');
    const trigger = wrap.locator('.cs-trigger');
    const listbox = wrap.locator('.cs-listbox');

    await page.locator('#ctrl-count').selectOption('1');
    await expect(page.locator('#heraldry > svg')).toBeVisible();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();

    const value = await page.locator('#ctrl-device').inputValue();
    expect(value).toBeTruthy();
  });

  test('outside click closes the dropdown', async ({ page }) => {
    await page.click('details summary');
    const wrap = page.locator('#ctrl-shape').locator('..');
    await wrap.locator('.cs-trigger').click();
    await expect(wrap.locator('.cs-listbox')).toBeVisible();

    await page.locator('h1').click();
    await expect(wrap.locator('.cs-listbox')).toBeHidden();
  });

  test('every native select is wrapped by a custom dropdown', async ({ page }) => {
    await page.click('details summary');
    await page.locator('#ctrl-count').selectOption('3');
    await expect(page.locator('#heraldry > svg')).toBeVisible();

    const result = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      return selects.map(s => ({
        id: s.id,
        enhanced: s.dataset.csEnhanced === '1',
        hasTrigger: !!s.parentElement?.querySelector(':scope > .cs-trigger'),
        hasListbox: !!s.parentElement?.querySelector(':scope > .cs-listbox'),
      }));
    });

    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(r.enhanced, `#${r.id} not enhanced`).toBe(true);
      expect(r.hasTrigger, `#${r.id} missing custom trigger`).toBe(true);
      expect(r.hasListbox, `#${r.id} missing custom listbox`).toBe(true);
    }
  });

  test('full-page screenshot of every dropdown opened', async ({ page }) => {
    await page.click('details summary');
    await expect(page.locator('#ctrl-shape')).toBeVisible();

    // Set count > 0 so charge-colour dropdowns and (potentially) the layout dropdown render.
    await page.locator('#ctrl-count').selectOption('3');
    await expect(page.locator('#heraldry > svg')).toBeVisible();

    const selectIds = await page.evaluate(() =>
      Array.from(document.querySelectorAll('select'))
        .map(s => s.id)
        .filter(Boolean),
    );
    expect(selectIds.length, 'expected at least one select on the page').toBeGreaterThan(0);

    for (const id of selectIds) {
      const select = page.locator(`#${id}`);

      // Force the wrapping label visible if it's hidden (e.g. layout dropdown is conditional).
      const labelRestore = await select.evaluate(el => {
        const label = el.closest('label.ctrl-label');
        if (label && getComputedStyle(label).display === 'none') {
          const prev = label.style.display;
          label.style.display = 'flex';
          return { prev, hadLabel: true };
        }
        return { hadLabel: false };
      });

      const trigger = page.locator(`#${id}`).locator('..').locator('.cs-trigger');
      await expect(trigger).toBeVisible();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      await expect(page.locator(`#${id}`).locator('..').locator('.cs-listbox')).toBeVisible();

      const fullPath = test.info().outputPath(`dropdown-${id}-fullpage.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      await test.info().attach(`dropdown-${id}-fullpage`, { path: fullPath, contentType: 'image/png' });

      const cropPath = test.info().outputPath(`dropdown-${id}.png`);
      const wrap = page.locator(`#${id}`).locator('..');
      await wrap.screenshot({ path: cropPath });
      await test.info().attach(`dropdown-${id}`, { path: cropPath, contentType: 'image/png' });

      // Close the dropdown before moving on (Escape key).
      await page.keyboard.press('Escape');

      if (labelRestore.hadLabel) {
        await select.evaluate((el, prev) => {
          const label = el.closest('label.ctrl-label');
          if (label) label.style.display = prev;
        }, labelRestore.prev);
      }
    }
  });

  test('randomiser never pairs colour-on-colour or metal-on-metal field tinctures', async ({ page }) => {
    const metals = new Set(['#d4af34', '#ffffff', '#dbdbdb']); // or, argent, cendree

    for (let i = 0; i < 50; i++) {
      await page.locator('input[type="submit"]').click();
      await expect(page.locator('#heraldry > svg')).toBeVisible();

      const { col1, col2 } = await page.evaluate(() => ({
        col1: document.getElementById('ctrl-col1').value,
        col2: document.getElementById('ctrl-col2').value,
      }));

      const col1IsMetal = metals.has(col1);
      const col2IsMetal = metals.has(col2);
      expect(
        col1IsMetal === col2IsMetal,
        `Iteration ${i}: col1=${col1} and col2=${col2} are both ${col1IsMetal ? 'metals' : 'colours'} — violates rule of tincture`,
      ).toBe(false);
    }
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
