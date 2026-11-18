import { expect, test } from './fixtures';

// Comportamiento de los ejemplos V2 de servicios, estado, autenticación, búsqueda y comunicación.

test.describe('Servicios (unidad 4)', () => {
  test('servicio básico con @Service(): muestra los valores y enlaza al siguiente ejemplo', async ({ page }) => {
    await page.goto('/servicio-basico');
    await expect(page.getByRole('heading', { name: /Servicio básico con @Service\(\) e inject\(\)/ })).toBeVisible();
    await expect(page.getByText('Dato básico')).toBeVisible();
    await page.getByRole('link', { name: /@Injectable con constructor frente a inject/ }).click();
    await expect(page).toHaveURL(/\/v2\/servicio-injectable$/);
  });

  test('@Injectable: A y B comparten instancia (singleton) y C tiene la suya', async ({ page }) => {
    await page.goto('/v2/servicio-injectable');
    const tarjeta = (letra: string) => page.locator('section, article, div').filter({ has: page.getByRole('button', { name: `Incrementar desde ${letra}` }) }).last();
    await expect(tarjeta('A')).toContainText('Instancia del servicio: #1');
    await expect(tarjeta('B')).toContainText('Instancia del servicio: #1');
    await expect(tarjeta('C')).toContainText('Instancia del servicio: #2');

    await page.getByRole('button', { name: 'Incrementar desde A' }).click();
    await expect(tarjeta('A')).toContainText('Valor: 1');
    await expect(tarjeta('B')).toContainText('Valor: 1'); // la misma instancia
    await expect(tarjeta('C')).toContainText('Valor: 0'); // otra instancia

    await page.getByRole('button', { name: 'Incrementar desde C' }).click();
    await expect(tarjeta('C')).toContainText('Valor: 1');
    await expect(tarjeta('A')).toContainText('Valor: 1');
  });

  test('servicio sin decorador: cada visita crea un contador nuevo', async ({ page }) => {
    await page.goto('/v2/servicio-sin-injectable');
    const valor = page.getByText(/^Valor: \d+$/);
    await expect(valor).toHaveText('Valor: 0');
    await page.getByRole('button', { name: 'Incrementar' }).click();
    await page.getByRole('button', { name: 'Incrementar' }).click();
    await expect(valor).toHaveText('Valor: 2');
    await page.getByRole('button', { name: 'Reiniciar' }).click();
    await expect(valor).toHaveText('Valor: 0');
    await page.getByRole('button', { name: 'Incrementar' }).click();
    // Al volver a abrir la página el componente se crea de nuevo y con él su instancia del servicio.
    await page.goto('/v2/servicio-sin-injectable');
    await expect(valor).toHaveText('Valor: 0');
  });

  test('estado compartido: los componentes hermanos ven el mismo estado', async ({ page }) => {
    await page.goto('/v2/estado-compartido');
    const resumen = page.locator('app-contador-resumen');
    await page.getByRole('button', { name: 'Incrementar' }).click();
    await page.getByRole('button', { name: 'Incrementar' }).click();
    await expect(resumen).toContainText('2');
    await expect(resumen).toContainText('Valor derivado (doble): 4');
    await page.getByRole('button', { name: 'Decrementar' }).click();
    await expect(resumen).toContainText('Valor derivado (doble): 2');
    await page.getByRole('button', { name: 'Reiniciar' }).click();
    await expect(resumen).toContainText('Valor derivado (doble): 0');
  });
});

test.describe('Autenticación con JWT (V2)', () => {
  test('inicia sesión con las credenciales de demostración y cierra sesión', async ({ page }) => {
    await page.goto('/v2/autenticacion');
    await page.getByRole('button', { name: 'Iniciar sesión y consultar perfil' }).click();
    await expect(page.getByText('Alumno de demostración')).toBeVisible();
    await expect(page.getByText('900 segundos')).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page.getByRole('button', { name: 'Iniciar sesión y consultar perfil' })).toBeVisible();
  });

  test('rechaza credenciales incorrectas', async ({ page }) => {
    await page.goto('/v2/autenticacion');
    await page.locator('#demo-password').fill('mal');
    await page.getByRole('button', { name: 'Iniciar sesión y consultar perfil' }).click();
    await expect(page.locator('app-v2-auth').getByRole('alert')).toContainText('No se pudo iniciar sesión');
  });

  test('el interceptor global muestra el error HTTP del backend', async ({ page }) => {
    await page.goto('/v2/autenticacion');
    await page.getByRole('button', { name: 'Probar error HTTP global' }).click();
    await expect(page.getByText(/Error HTTP 503/)).toBeVisible();
  });
});

test.describe('Búsqueda reactiva y comunicación (V2)', () => {
  test('la búsqueda consulta al backend y lista los cursos', async ({ page }) => {
    await page.goto('/v2/busqueda-reactiva');
    await page.locator('#curso-query').fill('angular');
    await expect(page.locator('#busqueda-resultados')).toContainText('Angular moderno');
    await page.locator('#curso-query').fill('zzzz');
    await expect(page.locator('#busqueda-resultados li')).toHaveCount(0);
  });

  test('comunicación: el botón del hijo emite un evento al padre y el botón extra se puede ocultar', async ({ page }) => {
    await page.goto('/v2/comunicacion');
    await page.getByRole('button', { name: 'Botón consultado por ViewChildren' }).click();
    await expect(page.getByRole('status')).toContainText('El padre recibió: Botón consultado por ViewChildren');
    const antes = await page.getByText(/Instancias Signal consultadas/).innerText();
    await page.getByRole('button', { name: 'Mostrar u ocultar el botón extra' }).click();
    await expect(page.getByText(/Instancias Signal consultadas/)).not.toHaveText(antes);
    await page.getByRole('button', { name: 'Enfocar con @ViewChild' }).click();
    await expect(page.locator('#comunicacion-nombre')).toBeFocused();
  });

  test('fundamentos: los avisos de versión se ven como texto, sin etiquetas literales', async ({ page }) => {
    await page.goto('/v2/fundamentos');
    await expect(page.getByRole('heading', { name: 'Fundamentos de Angular' })).toBeVisible();
    await expect(page.locator('aside[role="note"]').first()).toBeVisible();
    await expect(page.locator('app-v2-fundamentos')).not.toContainText('<code>');
  });

  test('internacionalización: cambiar el idioma cambia el texto', async ({ page }) => {
    await page.goto('/v2/i18n');
    await expect(page.locator('#i18n-heading')).toBeVisible();
    const antes = await page.locator('#i18n-heading').innerText();
    await page.locator('#locale').selectOption('en-GB');
    await expect(page.locator('#i18n-heading')).not.toHaveText(antes);
    await expect(page.locator('#i18n-heading')).toHaveText('Internationalization and formats');
  });
});
