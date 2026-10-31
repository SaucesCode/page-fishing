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
    assert.equal(await root.count(), 1, 'Page fishing root mounted');

    // 1. Verify weather cycling
    const weatherBtn = page.locator('.tool.weather');
    assert.match(await weatherBtn.getAttribute('title'), /Daylight/);
    assert.equal(await root.getAttribute('data-weather'), 'day');

    await weatherBtn.click();
    assert.match(await weatherBtn.getAttribute('title'), /Moonlit Night/);
    assert.equal(await root.getAttribute('data-weather'), 'night');

    await weatherBtn.click();
    assert.match(await weatherBtn.getAttribute('title'), /Gentle Rain/);
    assert.equal(await root.getAttribute('data-weather'), 'rain');

    await weatherBtn.click();
    assert.match(await weatherBtn.getAttribute('title'), /Daylight/);
    assert.equal(await root.getAttribute('data-weather'), 'day');

    // Keyboard shortcut 'W'
    await page.keyboard.press('w');
    assert.match(await weatherBtn.getAttribute('title'), /Moonlit Night/);
    await page.keyboard.press('w');
    await page.keyboard.press('w');
    assert.match(await weatherBtn.getAttribute('title'), /Daylight/);

    // 2. Catch a fish & verify pearl earnings + attached toast
    await page.locator('.pause').click();
    const swimmer = page.locator('.swimmer:not(.shark)').first();
    await swimmer.press('Enter');
    await page.waitForFunction(() => {
      const r = document.querySelector('#page-fishing-root').shadowRoot;
      return r.querySelector('.count').textContent === '1';
    }, {timeout: 8000});

    const toast = page.locator('.toast');
    assert.ok(await toast.isVisible(), 'Toast visible on catch');
    const toastText = await toast.innerText();
    assert.match(toastText, /pearls/i, 'Toast displays pearl rewards');

    // 3. Open bucket and check all 4 tabs + consistent modal sizing
    await page.locator('.bucket').click();
    await page.waitForTimeout(200);

    const ledger = page.locator('.ledger');
    assert.ok(await ledger.isVisible(), 'Ledger modal open');

    const bucketBox = await ledger.boundingBox();
    assert.ok(bucketBox.width >= 500 && bucketBox.width <= 525, 'Bucket modal width is ~520px');

    // Check tabs
    assert.ok(await page.locator('.bucket-tab').isVisible());
    assert.ok(await page.locator('.index-tab').isVisible());
    assert.ok(await page.locator('.shop-tab').isVisible());
    assert.ok(await page.locator('.rewards-tab').isVisible());

    // Switch to Fish Index
    await page.locator('.index-tab').click();
    await page.waitForTimeout(100);
    const indexBox = await ledger.boundingBox();
    assert.ok(Math.abs(indexBox.width - bucketBox.width) < 1, 'Index modal width matches Bucket modal width');
    assert.ok(Math.abs(indexBox.height - bucketBox.height) < 1, 'Index modal height matches Bucket modal height');

    // Switch to Rewards
    await page.locator('.rewards-tab').click();
    await page.waitForTimeout(100);
    const rewardsBox = await ledger.boundingBox();
    assert.ok(Math.abs(rewardsBox.width - bucketBox.width) < 1, 'Rewards modal width matches Bucket modal width');
    assert.ok(Math.abs(rewardsBox.height - bucketBox.height) < 1, 'Rewards modal height matches Bucket modal height');

    // Switch to Tackle Shop
    await page.locator('.shop-tab').click();
    await page.waitForTimeout(100);
    const shopBox = await ledger.boundingBox();
    assert.ok(Math.abs(shopBox.width - bucketBox.width) < 1, 'Shop modal width matches Bucket modal width');
    assert.ok(Math.abs(shopBox.height - bucketBox.height) < 1, 'Shop modal height matches Bucket modal height');
    assert.ok(await page.locator('.shop-panel').isVisible(), 'Shop panel visible');
    assert.ok(await page.locator('.shop-header').isVisible(), 'Shop header with pearl balance visible');

    // Check filter pills
    const filterBtns = page.locator('.shop-filter-btn');
    assert.equal(await filterBtns.count(), 5, '5 category filter buttons');

    // 4. Test shop interaction: give pearls & buy gear
    await page.evaluate(() => {
      localStorage.setItem('pageFishingPearls', '500');
    });

    // Reload to pick up pearls
    await page.reload();
    await page.locator('.bucket').click();
    await page.locator('.shop-tab').click();

    // Bamboo Cane button should say 'Buy · 40 pearls' and be enabled
    const bambooCard = page.locator('.shop-card:has-text("Bamboo Cane")');
    const bambooBuyBtn = bambooCard.locator('.shop-action-btn');
    assert.ok(await bambooBuyBtn.isEnabled(), 'Can afford Bamboo Cane with 500 pearls');
    await bambooBuyBtn.click();
    assert.equal(await bambooBuyBtn.innerText(), 'Equipped', 'Bamboo cane is now equipped');
    assert.equal(await root.getAttribute('data-skin-rod'), 'rod_bamboo');

    // Buy Glowing Krill bait
    const krillCard = page.locator('.shop-card:has-text("Glowing Krill")');
    const krillBuyBtn = krillCard.locator('.shop-action-btn');
    await krillBuyBtn.click();
    assert.match(await krillBuyBtn.innerText(), /Active/, 'Krill bait is active');
    const baitBadge = page.locator('.bait-badge');
    assert.ok(await baitBadge.isVisible(), 'Active bait badge visible on rig');

    // 5. Test Companion & Polaroid from Bucket tab
    await page.locator('.bucket-tab').click();
    const companionBtn = page.locator('.companion-btn').first();
    assert.ok(await companionBtn.isVisible(), 'Companion button visible on fish card');
    await companionBtn.click();
    assert.equal(await companionBtn.innerText(), 'Following');

    const companionSwimmer = page.locator('.companion-swimmer');
    assert.ok(await companionSwimmer.isVisible(), 'Floating companion swimmer is visible');
    assert.ok(await page.locator('.companion-halo').isVisible(), 'Companion has glowing star halo');

    // Test Polaroid
    const photoBtn = page.locator('.photo-btn').first();
    assert.ok(await photoBtn.isVisible(), 'Photo button visible on fish card');
    await photoBtn.click();

    const polaroid = page.locator('.polaroid-overlay');
    assert.ok(await polaroid.isVisible(), 'Polaroid keepsake overlay open');
    assert.ok(await page.locator('.polaroid-card').isVisible(), 'Polaroid card visible');
    assert.ok(await page.locator('.polaroid-save-btn').isVisible(), 'Download snap button visible');

    // Close polaroid
    await page.locator('.polaroid-close').click();
    assert.equal(await polaroid.isVisible(), false, 'Polaroid overlay closed');

    // 6. Test Free single fish and Release karma bonus
    const freeBtn = page.locator('.single-release').first();
    await freeBtn.click();
    await page.waitForTimeout(300);
    assert.match(await page.locator('.hint').innerText(), /freed \(\+\d+ karma pearls\)/, 'Single release awards karma pearls');

    assert.deepEqual(errors, []);
    console.log('PASS: tackle boutique, pearl economy, skins, weather cycle, companion, and polaroid keepsake.');
  } finally {
    await browser.close();
  }
})();
