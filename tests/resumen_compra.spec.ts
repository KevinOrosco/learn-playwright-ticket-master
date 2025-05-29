import { test, expect } from '@playwright/test';

test('Resumen de compra se muestra correctamente en Checkout', async ({ page }) => {

  await page.goto('http://localhost:3000');
  await page.locator('div').filter({ hasText: /^\$65\.50Ver detalles$/ }).getByRole('link').click();
  
  await expect(page).toHaveURL('http://localhost:3000/concerts/2');
  await page.getByRole('button', { name: 'Comprar entradas' }).click();
  
  await expect(page).toHaveURL('http://localhost:3000/checkout?concertId=2&quantity=1');

  // Verificar el título de la tarjeta "Resumen de compra"
  await expect(page.getByText('Resumen de compra')).toBeVisible();
  
  // Verificar los detalles dentro de la tarjeta
  await expect(page.getByText('Detalles de tu pedido')).toBeVisible();
  await expect(page.locator('h3.font-semibold')).toBeVisible();  // Nombre del concierto
  await expect(page.getByText('Noche de Jazz')).toBeVisible(); // Ubicación
  await expect(page.getByText('Precio por entrada:')).toBeVisible();
  await expect(page.getByText('Cantidad:')).toBeVisible();
  await expect(page.getByText('Total:')).toBeVisible();
});
