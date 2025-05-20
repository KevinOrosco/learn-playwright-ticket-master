import { test, expect } from '@playwright/test';

test('Flujo de pago exitoso y confirmación', async ({ page }) => {
  await page.route('/api/purchases', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ purchaseId: 'mocked-purchase-id' }),
    })
  );

  await page.goto('http://localhost:3000/checkout?concertId=2&quantity=1');

  // Llenar el formulario de pago
  await page.getByRole('textbox', { name: 'Nombre del titular' }).fill('Kevin Test');
  await page.getByRole('textbox', { name: 'Número de tarjeta' }).fill('1234567812345678');

  // Abre el dropdown del mes
  await page.getByRole('combobox', { name: 'Mes' }).click();

  // Haz clic en la opción visible "05"
  await page.getByRole('option', { name: '05' }).click();

  // Repetir para el año
  await page.getByRole('combobox', { name: 'Año' }).click();
  await page.getByRole('option', { name: '2030' }).click();
  
  await page.getByRole('textbox', { name: 'CVC' }).fill('321');
  await page.getByRole('textbox', { name: 'Email para recibir las' }).fill('kevin@gmail.com');
  
  // Simular el click en "Completar compra"
  await page.getByRole('button', { name: 'Completar compra' }).click();

  await expect(page).toHaveURL(/\/confirmation\?concertId=.*&quantity=\d+/);
  await expect(page.getByRole('heading', { name: '¡Compra exitosa!' })).toBeVisible();

});
