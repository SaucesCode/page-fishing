const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/CARE MBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path'), {pathToFileURL} = require('node:url'), assert = require('node:assert/strict');
const out = process.argv[2] || path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({headless: true, channel: 'msedge'});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 800}, reducedMotion: 'reduce'});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      localStorage.setItem('pageFishingCatches', JSON.stringify(Array.from({length: 7}, (_, i) => ({id: String(i), name: ['Mist Silk Guppy', 'Apricot Striped Angelfish', 'Rose Dappled Puffer', 'Lagoon Silk Sea turtle'][i % 4], kind: [0, 1, 2, 12][i % 4], palette: i % 8, pattern: i % 3, size: 18 + i, rarity: i % 3 ? 'Common' : 'Uncommon', site: 'example.com', habitat: 'Bytewater', date: new Date().toISOString()}))));
      localStorage.setItem('pageFishingPearls', '140');
    });
    await page.goto(pathToFileURL(path.resolve(__dirname, '../demo.html')).href);
    await page.locator('.pause').click();
    await page.locator('.bucket').click();
    await page.waitForTimeout(300);

    const ledger = page.locator('.ledger');
    const frame = async () => ledger.evaluate(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, border: s.borderTopColor, radius: s.borderTopLeftRadius, clip: s.clipPath};
    });
    const shots = {};
    for (const tab of ['bucket', 'index', 'shop', 'rewards']) {
      await page.locator(`.${tab}-tab`).click();
      await page.waitForTimeout(150);
      shots[tab] = await frame();
      await ledger.screenshot({path: path.join(out, `modal-${tab}.png`)});
    }
    const base = shots.bucket;
    for (const [tab, f] of Object.entries(shots)) assert.deepEqual(f, base, `${tab} tab frame matches bucket tab frame`);
    assert.equal(base.clip, 'none', 'No tapered clip-path on the frame');

    const close = page.locator('.ledger > .close-book');
    assert.ok(await close.isVisible(), 'Close button is in the top-right of the frame');
    await close.click();
    assert.equal(await ledger.isVisible(), false, 'Close hides the modal');
    await page.locator('.bucket').click();
    assert.ok(await ledger.isVisible(), 'Bucket reopens the modal');
    await page.keyboard.press('Escape');
    assert.equal(await ledger.isVisible(), false, 'Escape hides the modal');

    await page.setViewportSize({width: 390, height: 760});
    await page.locator('.bucket').click();
    await page.waitForTimeout(150);
    const m = await ledger.boundingBox();
    assert.ok(m.x >= 0 && m.x + m.width <= 390, 'Modal fits mobile width');
    await ledger.screenshot({path: path.join(out, 'modal-mobile.png')});

    assert.deepEqual(errors, []);
    console.log('PASS: one shared modal frame across bucket, index, shop and rewards; close button and Escape work; mobile fit.', JSON.stringify(base));
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
