import { test, expect } from '@playwright/test';

test('Pagina de conciertos muestra todos los conciertos', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ver todos los conciertos' }).click();
  
  await expect(page).toHaveURL("http://localhost:3000/concerts");

  // Título principal
  await expect(page.getByRole('heading', { name: 'Todos los conciertos' })).toBeVisible();
  
  // Al menos una tarjeta de concierto visible
  const concertCards = page.locator('.overflow-hidden');
  await expect(concertCards.first()).toBeVisible();

  const cardCount = await concertCards.count();
  await expect(cardCount).toBeGreaterThan(0);

  for (let i = 0; i < cardCount; i++) {
    const card = concertCards.nth(i);
    await expect(page.getByText('Noche de Jazz')).toBeVisible(); // Nombre del concierto
    await expect(card.locator('img')).toBeVisible(); // Imagen del concierto
    await expect(page.getByText('Una velada elegante con los mejores exponentes del jazz')).toBeVisible(); // Precio del concierto
    await expect(page.locator('text=Ver detalles').first()).toBeVisible(); // Botón "Ver detalles"
  }
});
