import { test, expect } from '@playwright/test';

test('Resumen de compra se muestra correctamente en Checkout', async ({ page }) => {
  await page.goto('http://localhost:3000/checkout?concertId=2&quantity=1');

  // Verificar el título de la tarjeta "Resumen de compra"
  await expect(page.locator('text=Resumen de compra')).toBeVisible();
  
  // Verificar los detalles dentro de la tarjeta
  await expect(page.locator('text=Detalles de tu pedido')).toBeVisible();
  await expect(page.locator('h3.font-semibold')).toBeVisible();  // Nombre del concierto
  await expect(page.locator('text=Noche de Jazz')).toBeVisible(); // Ubicación
  await expect(page.locator('text=Precio por entrada:')).toBeVisible();
  await expect(page.locator('text=Cantidad:')).toBeVisible();
  await expect(page.locator('text=Total:')).toBeVisible();
});
