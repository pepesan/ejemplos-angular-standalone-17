import { expect, test } from './fixtures';

// Contrato de usuario: cada ejemplo avisa de los ficheros que lo implementan, con una píldora por tipo.
test('/pipes lista componente, directiva y pipe antes del ejemplo', async ({ page }) => {
  await page.goto('/pipes');
  const aviso = page.getByRole('complementary', { name: 'Ficheros del ejemplo' });
  await expect(aviso).toBeVisible();
  await expect(aviso.getByRole('listitem')).toHaveCount(3);
  await expect(aviso.getByRole('listitem').filter({ has: page.getByText('Componente', { exact: true }) })).toContainText('uso-pipes.component.ts');
  await expect(aviso.getByRole('listitem').filter({ has: page.getByText('Directiva', { exact: true }) })).toContainText('mia.directive.ts');
  await expect(aviso.getByRole('listitem').filter({ has: page.getByText('Pipe', { exact: true }) })).toContainText('mi-pipe.pipe.ts');
});

test('el aviso se actualiza al navegar y no aparece en Inicio', async ({ page }) => {
  await page.goto('/pipes');
  await expect(page.getByText('Ficheros del ejemplo')).toBeVisible();
  await page.goto('/home');
  await expect(page.getByText(/Ficheros? del ejemplo/)).toHaveCount(0);
});

test('/reactivos pliega la lista larga y permite desplegarla', async ({ page }) => {
  await page.goto('/reactivos');
  const aviso = page.getByRole('complementary', { name: 'Ficheros del ejemplo' });
  await expect(aviso.getByRole('listitem')).toHaveCount(5);
  await aviso.getByRole('button', { name: 'Mostrar 4 más' }).click();
  await expect(aviso.getByRole('listitem')).toHaveCount(9);
});
