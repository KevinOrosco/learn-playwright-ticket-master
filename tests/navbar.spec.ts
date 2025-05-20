import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/conciertos/2');
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await page.getByRole('link', { name: 'Conciertos', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3000/concerts');
});