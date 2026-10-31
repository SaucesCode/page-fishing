const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/CARE MBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path'), {pathToFileURL} = require('node:url'), assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({headless: true, channel: 'msedge'});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 800}});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(pathToFileURL(path.resolve(__dirname, '../demo.html')).href);
    await page.waitForTimeout(400);

    const root = page.locator('#page-fishing-root');
    assert.equal(await root.count(), 1, 'Page fishing mounted');

    // 1. Initial Light Mode Check
    assert.equal(await root.getAttribute('data-dark'), 'false', 'Initial state is light mode');

    // 2. Switch page to Dark Mode via background & text color
    await page.evaluate(() => {
      document.body.style.background = '#121614';
      document.body.style.color = '#f0f5f2';
    });
    await page.waitForTimeout(200);

    assert.equal(await root.getAttribute('data-dark'), 'true', 'Dynamic dark mode detected from dark body styling');

    // 3. Pause & Catch fish in Dark Mode
    await page.locator('.pause').click();
    const fish = page.locator('.swimmer:not(.shark)').first();
    await fish.press('Enter');
    await page.waitForFunction(() => {
      const r = document.querySelector('#page-fishing-root').shadowRoot;
      return r.querySelector('.count').textContent === '1';
    }, {timeout: 8000});

    // Check Toast colors in Dark Mode
    const toastStrong = page.locator('.toast strong');
    assert.ok(await toastStrong.isVisible(), 'Toast strong is visible');
    const strongColor = await toastStrong.evaluate(el => getComputedStyle(el).color);
    assert.equal(strongColor, 'rgb(255, 255, 255)', 'Toast strong title is pure white in dark mode');

    const toastSpan = page.locator('.toast span').first();
    const spanColor = await toastSpan.evaluate(el => getComputedStyle(el).color);
    assert.equal(spanColor, 'rgb(197, 236, 227)', 'Toast detail text is luminous mint in dark mode');

    const hint = page.locator('.hint');
    const hintColor = await hint.evaluate(el => getComputedStyle(el).color);
    assert.equal(hintColor, 'rgb(224, 244, 238)', 'Hint text is luminous high-contrast teal in dark mode');

    const tool = page.locator('.lid .tool').first();
    const toolBg = await tool.evaluate(el => getComputedStyle(el).backgroundColor);
    assert.equal(toolBg, 'rgb(22, 43, 36)', 'Tool button has dark surface styling in dark mode');

    // 4. Test Catch Streak: Catch a second fish within 20s
    const secondFish = page.locator('.swimmer:not(.shark)').first();
    await secondFish.press('Enter');
    await page.waitForFunction(() => {
      const r = document.querySelector('#page-fishing-root').shadowRoot;
      return r.querySelector('.count').textContent === '2';
    }, {timeout: 8000});

    const streakPill = page.locator('.toast .streak-pill');
    assert.ok(await streakPill.isVisible(), 'Catch streak pill appears on second catch');
    const streakText = await streakPill.innerText();
    assert.match(streakText, /2x Streak!/i, 'Displays 2x streak text');

    // 5. Check Bucket for Habitat Badges
    await page.locator('.bucket').click();
    await page.waitForTimeout(200);

    const habitatBadges = page.locator('.entry .habitat-badge');
    assert.ok(await habitatBadges.count() >= 2, 'Habitat badges rendered on caught fish entries');
    const habText = await habitatBadges.first().innerText();
    assert.ok(habText.length > 0, 'Habitat badge contains habitat location text');

    // 6. Check Fish Index Field Guide Filter Chips
    await page.locator('.index-tab').click();
    await page.waitForTimeout(200);

    const filterBtns = page.locator('.book-filter-btn');
    assert.equal(await filterBtns.count(), 4, '4 field guide filter buttons: All, Discovered, Missing, Legendary');

    // Test Legendary filter
    const legendaryFilter = page.locator('.book-filter-btn:has-text("Legendary")');
    await legendaryFilter.click();
    await page.waitForTimeout(200);

    const specimens = page.locator('.specimen');
    assert.equal(await specimens.count(), 3, 'Legendary filter displays all 3 apex legendary species');
    const tierLabels = await page.locator('.specimen .rarity').allInnerTexts();
    assert.ok(tierLabels.every(t => t === 'Legendary'), 'All filtered specimens belong to Legendary tier');

    // Return to All filter
    const allFilter = page.locator('.book-filter-btn:has-text("All")');
    await allFilter.click();
    await page.waitForTimeout(200);
    assert.equal(await specimens.count(), 4, 'All filter displays first 4 species on spread');

    assert.deepEqual(errors, []);
    console.log('PASS: dynamic dark mode contrast, catch streak bonus, habitat badges, and field guide filter chips.');
  } finally {
    await browser.close();
  }
})();
