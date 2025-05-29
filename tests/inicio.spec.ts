import { test, expect } from '@playwright/test';

test('Página de inicio muestra secciones y conciertos', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Título principal
  await expect(page.getByRole('heading', { name: 'Conciertos Disponibles' })).toBeVisible();

  // Texto descriptivo (más flexible en el locator)
  await expect(page.locator('text=Encuentra los mejores conciertos')).toBeVisible();

  // Validar que haya al menos una tarjeta de concierto
  const concertCards = page.locator('.overflow-hidden');
  const cardCount = await concertCards.count();
  await expect(cardCount).toBeGreaterThan(0);

  // Recorrer cada tarjeta y validar sus elementos
  for (let i = 0; i < cardCount; i++) {
    const card = concertCards.nth(i);
    await expect(page.getByText('Noche de Jazz')).toBeVisible(); // Nombre del concierto
    await expect(card.locator('img')).toBeVisible(); // Imagen del concierto
    await expect(page.getByText('Una velada elegante con los mejores exponentes del jazz')).toBeVisible(); // Precio del concierto
    await expect(page.locator('text=Ver detalles').first()).toBeVisible(); // Botón "Ver detalles"
  }

  // Sección especial
  await expect(page.getByText('¿Buscas algo especial?')).toBeVisible();
  await expect(page.getByText('Explora nuestra selección completa de eventos')).toBeVisible();

  // Botón y enlace
  const boton = page.getByRole('link', { name: /ver todos los conciertos/i });
  await expect(boton).toBeVisible();
  await expect(boton).toHaveAttribute('href', '/concerts');
});
