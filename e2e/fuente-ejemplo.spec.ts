import { expect, test } from './fixtures';
import { FUENTES_EJEMPLO } from '../src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated';

// Nº de ficheros del ejemplo de reactivos: sale de las fuentes generadas para que el test no se rompa al añadir uno.
const FICHEROS_REACTIVOS = FUENTES_EJEMPLO['src/app/pages/reactivos/reactivos.component.ts'].length;

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
  await aviso.getByRole('button', { name: `Mostrar ${FICHEROS_REACTIVOS - 5} más` }).click();
  await expect(aviso.getByRole('listitem')).toHaveCount(FICHEROS_REACTIVOS);
});

test('un ejemplo de rutas muestra su fichero de rutas con la píldora «Rutas»', async ({ page }) => {
  await page.goto('/v2/rutas');
  const aviso = page.getByRole('complementary', { name: /Ficheros? del ejemplo/ });
  const fila = aviso.getByRole('listitem').filter({ hasText: 'rutas-v2.routes.ts' });
  await expect(fila).toBeVisible();
  await expect(fila.getByText('Rutas', { exact: true })).toBeVisible();
});

test('los ejemplos clásicos de navegación muestran app.routes.ts', async ({ page }) => {
  await page.goto('/nav');
  const aviso = page.getByRole('complementary', { name: /Ficheros? del ejemplo/ });
  const fila = aviso.getByRole('listitem').filter({ hasText: 'app.routes.ts' });
  await expect(fila).toBeVisible();
  await expect(fila.getByText('Rutas', { exact: true })).toBeVisible();
});

