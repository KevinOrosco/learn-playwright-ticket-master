import { test, expect } from '@playwright/test';

test('Prueba de flujo en la barra de navegacion y muestra el titulo de la pagina correcta', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.getByRole('link', { name: 'Conciertos', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3000/concerts');
  await expect(page.getByText("Todos los conciertos")).toBeVisible();

  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByText("Conciertos Disponibles")).toBeVisible();
});