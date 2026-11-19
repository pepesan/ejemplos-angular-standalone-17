import { expect, test } from './fixtures';

// Las APIs externas (pactometro y JSONPlaceholder) se simulan con page.route: los tests son deterministas
// y no dependen de la red.
const PACTOMETRO = '**/resultados.json';
const POSTS = '**/jsonplaceholder.typicode.com/posts';
const partidos = [
  { nombre: 'B', dipu: 25, imagen: '' },
  { nombre: 'A', dipu: 75, imagen: '' },
  { nombre: 'Sin escaños', dipu: 0, imagen: '' },
];

test.describe('Consumo de API V1 (pactometro)', () => {
  test('pactometro pinta los partidos recibidos', async ({ page }) => {
    await page.route(PACTOMETRO, (route) => route.fulfill({ json: partidos }));
    await page.goto('/pactometro');
    await expect(page.getByText('A: 75')).toBeVisible();
    await expect(page.locator('app-pactometro').getByRole('alert')).toHaveCount(0);
  });

  test('si la petición falla, el servicio devuelve datos de respaldo y se avisa', async ({ page }) => {
    await page.route(PACTOMETRO, (route) => route.abort());
    await page.goto('/pactometro');
    await expect(page.locator('app-pactometro').getByRole('alert')).toContainText('datos de respaldo');
    await expect(page.getByText('PP: 137')).toBeVisible();
  });

  test('pactometro-procesado ordena, descarta partidos sin escaños y calcula el porcentaje', async ({ page }) => {
    await page.route(PACTOMETRO, (route) => route.fulfill({ json: partidos }));
    await page.goto('/pactometro-procesado');
    const filas = page.locator('tbody tr');
    await expect(filas).toHaveCount(2);
    await expect(filas.nth(0)).toContainText('A');
    await expect(filas.nth(0)).toContainText('75 %');
    await expect(page.getByText('Sin escaños')).toHaveCount(0);
  });

  test('pactometro-avisos avisa de cada reintento y termina con datos de respaldo', async ({ page }) => {
    await page.route(PACTOMETRO, (route) => route.abort());
    await page.goto('/pactometro-avisos');
    await expect(page.getByText(/Reintento 1 de 2/)).toBeVisible();
    await expect(page.getByText(/Reintento 2 de 2/)).toBeVisible();
    await expect(page.locator('app-pactometro-avisos').getByRole('alert')).toContainText('datos de respaldo');
  });

  test('pactometro-avisos avisa del éxito cuando un reintento funciona', async ({ page }) => {
    let peticiones = 0;
    await page.route(PACTOMETRO, (route) => (++peticiones === 1 ? route.abort() : route.fulfill({ json: partidos })));
    await page.goto('/pactometro-avisos');
    await expect(page.getByText(/se cargaron tras reintentar/)).toBeVisible();
    await expect(page.getByText('A: 75')).toBeVisible();
  });
});

test.describe('Petición POST sencilla', () => {
  test('envía el POST y muestra la respuesta del servidor', async ({ page }) => {
    let cuerpo: unknown;
    await page.route(POSTS, (route) => {
      cuerpo = route.request().postDataJSON();
      return route.fulfill({ status: 201, json: { ...(cuerpo as object), id: 101 } });
    });
    await page.goto('/envio-post');
    await page.getByRole('button', { name: 'Enviar POST' }).click();
    await expect(page.locator('pre')).toContainText('"id": 101');
    expect(cuerpo).toEqual({ title: 'Hola', body: 'Mi primer POST desde Angular', userId: 1 });
  });

  test('muestra un error si el POST falla', async ({ page }) => {
    await page.route(POSTS, (route) => route.fulfill({ status: 500, body: 'fallo' }));
    await page.goto('/envio-post');
    await page.getByRole('button', { name: 'Enviar POST' }).click();
    await expect(page.locator('app-envio-post').getByRole('alert')).toContainText('No se pudo enviar el POST.');
  });
});

test.describe('Ejercicio de consulta HTTP (toSignal y servicio)', () => {
  const URL_JSON = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  test('pinta los partidos que entrega el servicio', async ({ page }) => {
    await page.route(URL_JSON, (route) => route.fulfill({ json: [{ nombre: 'Partido de ejemplo', dipu: 3, imagen: 'x.png' }] }));
    await page.route('**/img/**', (route) => route.fulfill({ status: 200, contentType: 'image/png', body: '' }));
    await page.goto('/ejercicio-resultado');
    await expect(page.getByText('Partido de ejemplo: 3')).toBeVisible();
  });

  test('muestra un aviso accesible si la petición falla', async ({ page }) => {
    await page.route(URL_JSON, (route) => route.abort());
    await page.goto('/ejercicio-resultado');
    await expect(page.getByRole('alert').filter({ hasText: 'No se pudieron cargar los resultados' })).toBeVisible();
  });
});
