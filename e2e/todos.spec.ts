import { expect, test } from '@playwright/test';

test('removes a task from the list', async ({ page }) => {
  await page.goto('/todos');

  await expect(page.getByRole('heading', { name: 'App Todo' })).toBeVisible();
  const todo = page.locator('li').filter({ hasText: 'Hacer la compra' }).first();
  await expect(todo).toBeVisible();
  await todo.getByRole('button', { name: 'Borrar' }).click();

  await expect(page.getByText('Hacer la compra', { exact: true })).toHaveCount(0);
});
