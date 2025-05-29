import { test, expect } from '@playwright/test';

test('La página de confirmación muestra correctamente los detalles de la compra', async ({ page }) => {
  
  await page.goto('http://localhost:3000');
  await page.locator('div').filter({ hasText: /^\$65\.50Ver detalles$/ }).getByRole('link').click();
  
  await expect(page).toHaveURL('http://localhost:3000/concerts/2');
  await page.getByRole('button', { name: 'Comprar entradas' }).click();
  
  await page.goto('http://localhost:3000/confirmation?concertId=2&quantity=1');

  // Verifica el título de éxito
  await expect(page.getByText('¡Compra exitosa!' )).toBeVisible();

  // Verifica el mensaje de confirmación
  await expect(page.getByText(/Tu compra ha sido procesada correctamente/i)).toBeVisible();

  // Verifica que el código de confirmación esté presente
  await expect(page.getByText(/Código de confirmación:/)).toBeVisible();

  // Verifica detalles del concierto
  await expect(page.getByRole('heading', { name: 'Noche de Jazz' })).toBeVisible();
  await expect(page.getByText(/de noviembre de 2023 - 19:30/)).toBeVisible();
  await expect(page.getByText(/Teatro Metropolitan, Ciudad/)).toBeVisible();

  // Verifica los valores de precio, cantidad y total
  await expect(page.getByText(/Precio por entrada:\$/)).toBeVisible();
  await expect(page.getByText('Cantidad:1')).toBeVisible();
  await expect(page.getByText(/Total pagado:\$/)).toBeVisible();

  // Verifica botones
  await expect(page.getByRole('button', { name: 'Descargar entradas' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reenviar al correo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible();
});
