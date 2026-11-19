import {expect, test} from '@playwright/test';

test('Dakhla homepage uses the copied imagery and page sections', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('h1')).toHaveText("L'Art de l'Exclusivité");
  await expect(page.locator('.dh-hero-slide')).toHaveCount(6);
  await expect(page.locator('.dh-service-card')).toHaveCount(4);
  await expect(page.locator('.dh-gallery-item')).toHaveCount(6);
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^(https:\/\/www\.79events\.test|http:\/\/localhost:3000)$/);
});

test('carousel, mobile navigation and gallery respond to controls', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await page.getByRole('button', {name: 'Afficher l’image 2'}).click();
  await expect(page.locator('.dh-hero-slide').nth(1)).toHaveClass(/is-active/);
  await page.getByRole('button', {name: 'Ouvrir le menu'}).click();
  await page.getByRole('navigation', {name: 'Navigation principale'}).getByRole('link', {name: 'Services'}).click();
  await expect(page).toHaveURL(/#services$/);
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await page.locator('.dh-gallery-item').first().click({force: true});
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('page stays within mobile and desktop viewports', async ({page}) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('contact form exposes source options and contact methods', async ({page}) => {
  await page.goto('/#contact');
  await expect(page.getByRole('combobox', {name: 'Type d’événement'})).toContainText('Incentive & Team Building');
  await expect(page.getByRole('combobox', {name: 'Budget approximatif'})).toContainText('100 000 – 300 000 MAD');
  await expect(page.getByRole('link', {name: 'contact@79events.com'})).toHaveAttribute('href', 'mailto:contact@79events.com');
});
