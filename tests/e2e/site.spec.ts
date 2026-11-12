import {expect, test} from '@playwright/test';

test('homepage is French only and publishes one clear H1 with French canonical metadata', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','fr');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Votre partenaire pour vos événements au Maroc');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.79events.test');
  await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute('href','https://www.79events.test');
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Voir le site en français'})).toHaveCount(0);
});

test('English routes and language switch are unavailable', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('link',{name:'English'})).toHaveCount(0);
  await expect(page.locator('a[href^="/en"]')).toHaveCount(0);
  const response = await page.request.get('/en');
  expect(response.status()).toBe(404);
});

test('mobile navigation opens and reaches a French service page', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  await page.getByRole('button',{name:'Ouvrir la navigation'}).click();
  const navigation = page.getByRole('navigation',{name:'Navigation principale'});
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link',{name:'Des événements d’entreprise avec un plan de réalisation clair'}).click();
  await expect(page).toHaveURL(/\/evenements\/evenements-entreprise$/,{timeout:20_000});
  await expect(page.locator('html')).toHaveAttribute('lang','fr');
  await expect(page.locator('h1')).toContainText('Des événements d’entreprise');
});

test('proposal form validates in French and reports missing delivery setup', async ({page}) => {
  await page.goto('/demander-une-proposition');
  await page.getByRole('button',{name:'Envoyer la demande'}).click();
  await expect(page.locator('#fullName')).toHaveAttribute('aria-invalid','true');

  await page.locator('#fullName').fill('Camille Martin');
  await page.locator('#company').fill('Groupe Atlas');
  await page.locator('#workEmail').fill('camille@example.org');
  await page.locator('#phone').fill('+212 600 000 000');
  await page.locator('#country').fill('Maroc');
  await page.locator('#eventType').selectOption({label:'Événement d’entreprise'});
  await page.locator('#city').selectOption({label:'Marrakech'});
  await page.getByLabel('Planification et gestion').check();
  await page.getByLabel(/J’accepte que mes informations/).check();
  await page.getByRole('button',{name:'Envoyer la demande'}).click();
  await expect(page.locator('.form-result-error[role="alert"]')).toContainText('Le service de demande n’est pas encore configuré');
  await expect(page.getByText('Votre demande a bien été envoyée')).toHaveCount(0);
});

test('layout does not overflow at required view widths', async ({page}) => {
  for (const width of [375,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(width);
  }
});

test('unapproved portfolio and legal draft are excluded from indexing', async ({page}) => {
  await page.goto('/realisations');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  const sitemapResponse = await page.request.get('/sitemap.xml');
  expect(sitemapResponse.ok()).toBeTruthy();
  const sitemap = await sitemapResponse.text();
  expect(sitemap).not.toContain('/realisations');
  expect(sitemap).not.toContain('/politique-de-confidentialite');
  expect(sitemap).not.toContain('/fr/');
  expect(sitemap).not.toContain('/en/');
});
