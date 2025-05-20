import { test, expect } from '@playwright/test';

test('Flujo compra en detalle de concierto', async ({ page }) => {
  await page.goto('http://localhost:3000/concerts/2');


  // Verificar que título del concierto esté visible
  const tituloConcierto = page.locator('h1, h2, h3').first();
  await expect(tituloConcierto).toBeVisible();

  // Validar que se muestre la cantidad de entradas disponibles
  await expect(page.locator('text=Disponibles:')).toBeVisible();

  // Verificar encabezado de comprar entradas
  await expect(page.getByRole('heading', { name: /Comprar Entradas/i })).toBeVisible();

  // Validar que se muestre el precio por entrada
  await expect(page.locator('text=Precio por entrada')).toBeVisible();

  // Interactuar con selector de cantidad (spinbutton)
  const cantidadInput = page.getByRole('spinbutton');
  await expect(cantidadInput).toBeVisible();
  await cantidadInput.fill('2');  // Por ejemplo, seleccionar 2 entradas

  // Verificar que se actualice el total
  await expect(page.locator('text=Total:')).toBeVisible();

  // Click en botón de comprar
  const botonComprar = page.getByRole('button', { name: /Comprar entradas/i });
  await expect(botonComprar).toBeVisible();
  await botonComprar.click();

  // Aquí puedes agregar más validaciones, por ejemplo, que muestre confirmación de compra
});
