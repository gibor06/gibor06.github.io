import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.securityViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      window.securityViolations.push(`${event.effectiveDirective}: ${event.blockedURI}`);
    });
    localStorage.setItem('gibor_lang', 'en');
  });
});

for (const route of ['/', '/vi/', '/work/', '/vi/work/', '/about/', '/resume/', '/credentials/', '/research/', '/work/markai/', '/work/uniwallet/', '/404.html']) {
  test(`CSP permits the production page ${route}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);
    expect(await page.evaluate(() => window.securityViolations)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('injected inline JavaScript is blocked', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.unapprovedScriptRan = true';
    document.body.append(script);
  });
  expect(await page.evaluate(() => window.unapprovedScriptRan)).toBeUndefined();
  await expect.poll(() => page.evaluate(() => window.securityViolations.length)).toBeGreaterThan(0);
});

test('mobile menu and photo/evidence controls work under CSP', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vi/', { waitUntil: 'networkidle' });
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.story-dot').nth(1).click();
  await expect(page.locator('.story-dot').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-evidence]').first().click();
  await expect(page.locator('.evidence-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.evidence-dialog')).not.toBeVisible();
  expect(await page.evaluate(() => window.securityViolations)).toEqual([]);
});

test('theme selection remains functional', async ({ page }) => {
  await page.goto('/about/', { waitUntil: 'networkidle' });
  await page.locator('[data-set-theme="cobalt"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cobalt');
  expect(await page.evaluate(() => window.securityViolations)).toEqual([]);
});
