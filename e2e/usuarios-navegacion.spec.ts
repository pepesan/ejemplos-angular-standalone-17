import { expect, test, type Page } from '@playwright/test';

const BASE = '/v2/usuarios-navegacion';

async function entrar(page: Page, usuario = 'admin', url = BASE) {
  await page.goto(url);
  await page.getByLabel('Usuario', { exact: true }).fill(usuario);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.getByText('Sesión:')).toBeVisible();
}

test.describe('CRUD con navegación (backend local)', () => {
  test('recorrido completo: login, alta, edición y borrado en modal, todo por rutas', async ({ page }) => {
    const email = `e2e-nav-${Date.now()}@example.com`;
    await entrar(page);
    await expect(page).toHaveURL(new RegExp(`${BASE}$`));
    await expect(page.locator('tbody tr')).toHaveCount(5);
    await expect(page).toHaveTitle(/Usuarios/);

    // Alta: es una ruta propia, con su título y su URL.
    await page.getByRole('link', { name: 'Nuevo usuario' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}/nuevo$`));
    await expect(page).toHaveTitle(/Nuevo usuario/);
    await page.getByLabel('Nombre', { exact: true }).fill('Usuario Nav');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByRole('button', { name: 'Crear usuario' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}$`));
    await expect(page.getByText('«Usuario Nav» creado.')).toBeVisible();

    // Filtro: viaja en la URL y sobrevive a una navegación atrás/adelante.
    await page.getByLabel('Buscar por nombre o email').fill(email);
    await expect(page).toHaveURL(new RegExp(`q=`));
    await expect(page.locator('tbody tr')).toHaveCount(1);

    // Edición: la ruta lleva el id, el resolver precarga el usuario.
    await page.getByRole('link', { name: 'Editar Usuario Nav' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}/\\d+/editar$`));
    await expect(page.getByRole('heading', { name: /Editar usuario #\d+/ })).toBeVisible();
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Usuario Nav');
    await page.getByLabel('Nombre', { exact: true }).fill('Usuario Nav Editado');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByText('«Usuario Nav Editado» actualizado.')).toBeVisible();

    // Borrado: confirmación en un modal.
    await page.getByLabel('Buscar por nombre o email').fill(email);
    await page.getByRole('button', { name: 'Eliminar Usuario Nav Editado' }).click();
    const modal = page.getByRole('dialog', { name: 'Eliminar usuario' });
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Usuario Nav Editado');
    await modal.getByRole('button', { name: 'Eliminar' }).click();
    await expect(page.getByText('«Usuario Nav Editado» eliminado.')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByText(/Ningún usuario coincide/)).toBeVisible();
  });

  test('una URL protegida sin sesión lleva al login y, tras entrar, vuelve a ella', async ({ page }) => {
    await page.goto(`${BASE}/nuevo`);
    await expect(page).toHaveURL(/login\?returnUrl=/);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}/nuevo$`));
    await expect(page.getByRole('heading', { name: 'Nuevo usuario' })).toBeVisible();
  });

  test('un alumno solo consulta: no ve acciones y «nuevo» le devuelve al listado con el motivo', async ({ page }) => {
    await entrar(page, 'alumno');
    await expect(page.getByRole('link', { name: 'Nuevo usuario' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /^Editar/ })).toHaveCount(0);
    await expect(page.getByText(/solo permite consultar/)).toBeVisible();
    // Navegar a la URL «a mano» recarga la aplicación y se pierde la sesión; se vuelve a entrar con returnUrl.
    await page.goto(`${BASE}/nuevo`);
    await page.getByLabel('Usuario', { exact: true }).fill('alumno');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}\\?denegado=1$`));
    await expect(page.getByText(/requiere el rol/)).toBeVisible();
  });

  test('un usuario que no existe lleva a «no encontrado»', async ({ page }) => {
    await entrar(page, 'admin', `${BASE}/9999/editar`);
    await expect(page).toHaveURL(new RegExp(`${BASE}/no-encontrado$`));
    await expect(page.getByRole('heading', { name: 'No encontrado' })).toBeVisible();
  });

  test('con cambios sin guardar pregunta antes de salir', async ({ page }) => {
    await entrar(page, 'admin', `${BASE}/nuevo`);
    await page.getByLabel('Nombre', { exact: true }).fill('Alguien');
    const mensajes: string[] = [];
    // Primera pregunta: se cancela y se queda; segunda: se acepta y sale.
    page.once('dialog', (dialogo) => { mensajes.push(dialogo.message()); void dialogo.dismiss(); });
    await page.getByRole('link', { name: 'Listado' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}/nuevo$`));
    page.once('dialog', (dialogo) => { mensajes.push(dialogo.message()); void dialogo.accept(); });
    await page.getByRole('link', { name: 'Listado' }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE}$`));
    expect(mensajes).toHaveLength(2);
    expect(mensajes[0]).toContain('cambios sin guardar');
  });

  test('el modal de borrado se cierra con Esc y «Cancelar» sin borrar nada', async ({ page }) => {
    await entrar(page);
    // `entrar` solo espera a la sesión: se espera a que cargue la tabla antes de contar las filas.
    await expect(page.locator('tbody tr')).toHaveCount(5);
    const filas = await page.locator('tbody tr').count();
    await page.getByRole('button', { name: /^Eliminar / }).first().click();
    await expect(page.getByRole('dialog', { name: 'Eliminar usuario' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: /^Eliminar / }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('tbody tr')).toHaveCount(filas);
  });

  test('la paginación son enlaces que cambian ?page y se puede volver atrás', async ({ page }) => {
    await entrar(page);
    await page.getByRole('link', { name: 'Siguiente' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText(/Página 2 de/)).toBeVisible();
    await page.goBack();
    await expect(page.getByText(/Página 1 de/)).toBeVisible();
  });

  test('avisa de arrancar el backend si no hay conexión', async ({ page }) => {
    await page.route('**/api/auth/login', (route) => route.abort());
    await page.goto(`${BASE}/login`);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'npm run backend' })).toBeVisible();
    await expect(page.getByText('incorrectos')).toHaveCount(0);
  });
});
