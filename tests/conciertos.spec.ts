import { test, expect } from '@playwright/test';

test('Pagina de conciertos muestra todos los conciertos', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ver todos los conciertos' }).click();
  await page.waitForURL('**/concerts');

  // Título principal
  await expect(page.getByRole('heading', { name: 'Todos los conciertos' })).toBeVisible();
  
  // Al menos una tarjeta de concierto visible
  const concertCards = page.locator('.overflow-hidden');
  await expect(concertCards.first()).toBeVisible();

  const cardCount = await concertCards.count();
  await expect(cardCount).toBeGreaterThan(0);

  for (let i = 0; i < cardCount; i++) {
    const card = concertCards.nth(i);
    await expect(card.locator('h3')).toBeVisible();
    await expect(card.locator('img')).toBeVisible();
    await expect(card.locator('div.font-bold')).toBeVisible();
    await expect(card.locator('a', { hasText: 'Ver detalles' })).toBeVisible();
  }
});
