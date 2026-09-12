/* Run against a local Next preview or its static export. Requires Playwright. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.HISTORY_PREVIEW_URL || 'http://localhost:3021';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [320, 375, 390, 430, 768, 1440, 1920]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      assert.equal((await page.goto(base + '/histoire/')).status(), 200);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://yvexor.com/histoire/');
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://yvexor.com/histoire/');
      assert.equal(await page.title(), 'L’approche YVEXOR — Au-delà du logiciel');
      assert.match(await page.locator('meta[name=description]').getAttribute('content'), /Découvrez l’approche YVEXOR/);
      assert.ok(await page.getByText('L’approche YVEXOR', { exact: true }).isVisible());
      assert.ok(!/noindex/.test(await page.locator('meta[name=robots]').getAttribute('content')));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
      const control = page.getByRole('switch', { name: 'Interrupteur de démonstration' });
      await control.focus();
      await page.keyboard.press('Space');
      await page.waitForFunction(() => document.querySelector('[role=switch]').getAttribute('aria-checked') === 'true');
      assert.equal(await page.locator('output').textContent(), 'État : ACTIVÉ');
      await page.getByRole('button', { name: 'Éteindre depuis l’application' }).click();
      assert.equal(await control.getAttribute('aria-checked'), 'false');
      assert.equal(await page.locator('output').textContent(), 'État : INACTIF');
      const layout = await page.locator('ol').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
      assert.equal(layout, width <= 760 ? 1 : 5);
      if (width <= 820) {
        assert.ok(await page.getByRole('navigation', { name: 'Navigation mobile', exact: true }).isVisible());
        assert.match(await page.locator('.mobile-tabs .is-active').textContent(), /YVEXOR/);
        await page.getByLabel('Menu de navigation').click();
        assert.ok(await page.getByRole('navigation', { name: 'Accès rapides mobile' }).isVisible());
        await page.keyboard.press('Escape');
      } else assert.ok(await page.getByRole('navigation', { name: 'Navigation principale' }).isVisible());
      if (width === 390 || width === 1440) {
        const folder = path.resolve('portal/private'); fs.mkdirSync(folder, { recursive: true });
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: path.join(folder, `history-${width}.png`), fullPage: true });
      }
      assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
      if (width === 390) {
        await page.evaluate(() => document.documentElement.style.fontSize = '200%');
        assert.ok(await page.locator('main').evaluate(main => main.scrollWidth <= main.clientWidth), 'Article overflow at 200% text');
        await page.evaluate(() => document.documentElement.style.fontSize = '');
      }
      const hrefs = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href').split('#')[0]).filter(Boolean))]);
      for (const href of hrefs) assert.equal((await context.request.get(base + href)).status(), 200, href);
      await page.goto(base + '/');
      assert.equal(await page.locator('.solution-doors-list > a').count(), 10);
      const approachCard = page.locator('.solution-doors-list > a').last();
      assert.equal(await approachCard.getAttribute('href'), '/histoire/');
      assert.equal(await approachCard.locator('h3').textContent(), 'Notre approche');
      assert.equal(await approachCard.locator('.solution-door-badge > span').textContent(), '10');
      await approachCard.scrollIntoViewIfNeeded();
      await approachCard.locator('img').evaluate(image => image.decode());
      if (width === 390 || width === 1440) await approachCard.screenshot({ path: path.resolve('portal/private', `approach-card-${width}.png`) });
      const approachLink = page.getByRole('link', { name: 'Découvrir notre approche', exact: true });
      assert.equal(await approachLink.count(), 1);
      assert.equal(await approachLink.getAttribute('href'), '/histoire/');
      assert.equal(await page.getByText('L’histoire YVEXOR', { exact: true }).count(), 0);
      const teaser = page.getByRole('complementary', { name: 'Connecter ce qui ne l’était pas.' });
      assert.equal(await teaser.count(), 1);
      if (width >= 1440) assert.ok((await teaser.boundingBox()).width > 900, 'Editorial entry must span the homepage section');
      assert.ok(await teaser.evaluate(node => node.getBoundingClientRect().top > document.getElementById('exemples').getBoundingClientRect().top && node.getBoundingClientRect().bottom < document.getElementById('projet').getBoundingClientRect().top));
      await teaser.scrollIntoViewIfNeeded();
      assert.ok(await teaser.evaluate(node => node.scrollWidth <= node.clientWidth), `Teaser overflow ${width}`);
      if (width === 390 || width === 1440) await teaser.screenshot({ path: path.resolve('portal/private', `approach-teaser-${width}.png`) });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Home overflow ${width}`);
      await approachLink.click();
      await page.waitForURL(base + '/histoire/');
      assert.deepEqual(errors, []);
      console.log(`PASS layout, keyboard activation, reverse path, reduced motion, navigation and links at ${width}px`);
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', serviceWorkers: 'block' });
    const page = await context.newPage(); await page.goto(base + '/histoire/');
    await page.getByRole('switch').click();
    assert.equal(await page.locator('output').textContent(), 'État : INACTIF');
    await page.waitForFunction(() => document.querySelector('output').textContent === 'État : ACTIVÉ');
    await page.getByRole('button', { name: 'Éteindre depuis l’application' }).click();
    await page.waitForFunction(() => document.querySelector('[role=switch]').getAttribute('aria-checked') === 'false');
    await page.getByRole('heading', { name: 'Une information. Plusieurs usages.' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    assert.equal(await page.locator('[class*=ecosystem]').getAttribute('data-pending'), null);
    await context.close();
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const article = await nojs.newPage(); await article.goto(base + '/histoire/');
    assert.ok(await article.getByRole('heading', { name: 'C’est de cette vision qu’est né YVEXOR.' }).count());
    await nojs.close();
    console.log('PASS animated exchange, scroll connection reveal, readable without JavaScript');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
