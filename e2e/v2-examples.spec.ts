import { expect, test } from '@playwright/test';

test('consume una respuesta HTTP local controlada y muestra el estado vacío', async ({ page }) => {
  await page.route('**/api/resultados', (route) => route.fulfill({ json: [] }));
  await page.goto('/v2/consumo-api');
  await expect(page.getByRole('heading', { name: 'Consumo de API (V2)' })).toBeVisible();
  await expect(page.getByText('No hay resultados disponibles.')).toBeVisible();
});

test('presenta los resultados recibidos desde el backend local', async ({ page }) => {
  await page.route('**/api/resultados', (route) => route.fulfill({ json: [
    { nombre: 'Partido de ejemplo', dipu: 3, imagen: 'partido.png' },
  ] }));
  await page.goto('/v2/consumo-api');
  await expect(page.getByText('Partido de ejemplo: 3 escaños')).toBeVisible();
});

test('navega al detalle con parámetro y muestra el error para ruta inexistente', async ({ page }) => {
  await page.goto('/v2/rutas');
  await page.getByRole('link', { name: 'Abrir detalle del recurso 42' }).click();
  await expect(page.getByText('Recurso 42 (id: 42, desde backend local)')).toBeVisible();
  await page.goto('/v2/rutas/ruta-inexistente');
  await expect(page.getByRole('heading', { name: 'Ruta no encontrada' })).toBeVisible();
});

test('anuncia errores de validación del formulario accesible', async ({ page }) => {
  await page.goto('/v2/accesibilidad');
  await page.getByLabel('Nombre').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toContainText('El nombre es obligatorio');
});

test('valida un Signal Form estable y confirma el envío válido', async ({ page }) => {
  await page.goto('/v2/signal-forms');
  await page.getByRole('button', { name: 'Guardar contacto' }).click();
  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
  await page.getByLabel('Nombre').fill('Lucía');
  await page.getByLabel('Correo electrónico').fill('lucia@example.com');
  await page.getByRole('button', { name: 'Guardar contacto' }).click();
  await expect(page.getByRole('status')).toContainText('Lucía');
});

test('cancela consultas obsoletas y deja cargar el bloque diferido', async ({ page }) => {
  await page.route('**/api/cursos?q=angular', (route) => route.fulfill({ json: [
    { id: 1, nombre: 'Angular moderno' },
  ] }));
  await page.goto('/v2/busqueda-reactiva');
  await page.getByLabel('Buscar cursos').fill('angular');
  await expect(page.getByText('Angular moderno')).toBeVisible();

  await page.goto('/v2/estado');
  await page.getByRole('button', { name: 'Cargar resumen de rendimiento' }).click();
  await expect(page.getByLabel('Resumen de rendimiento')).toBeVisible();
});

test('cambia idioma y demuestra la sanitización HTML', async ({ page }) => {
  await page.goto('/v2/i18n');
  await page.getByLabel('Idioma y formato regional').selectOption('en-GB');
  await expect(page.getByRole('heading', { name: 'Internationalization and formats' })).toBeVisible();
  await expect(page.getByText('£1,234.50')).toBeVisible();

  await page.goto('/v2/seguridad');
  await expect(page.locator('.border img')).toHaveCount(1);
  await expect(page.locator('.border img')).not.toHaveAttribute('onerror', /.+/);
});
