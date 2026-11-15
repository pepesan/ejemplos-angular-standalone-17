import { expect, test } from '@playwright/test';

test('removes a task from the list', async ({ page }) => {
  await page.goto('/todos');

  await expect(page.getByRole('heading', { name: 'App Todo' })).toBeVisible();
  const todo = page.locator('li').filter({ hasText: 'Hacer la compra' }).first();
  await expect(todo).toBeVisible();
  await todo.getByRole('button', { name: 'Borrar' }).click();

  await expect(page.getByText('Hacer la compra', { exact: true })).toHaveCount(0);
});

test('navigates through V2 and validates a typed registration form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'V2 · Angular moderno' }).click();
  await page.getByRole('button', { name: 'Formulario tipado' }).click();

  await expect(page).toHaveURL(/\/v2\/formulario-tipado$/);
  await page.getByRole('button', { name: 'Inscribirme' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Escribe tu nombre.' })).toBeVisible();

  await page.getByLabel('Nombre').fill('Ana Pérez');
  await page.getByLabel('Correo electrónico').fill('ana@example.com');
  await page.getByLabel('Acepto la política de privacidad').check();
  await page.getByRole('button', { name: 'Inscribirme' }).click();

  await expect(page.getByRole('status')).toContainText('Inscripción recibida para Ana Pérez.');
});
