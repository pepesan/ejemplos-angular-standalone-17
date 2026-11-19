import { expect, test } from './fixtures';

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

test('un ejercicio muestra su enunciado antes de la posible solución', async ({ page }) => {
  await page.goto('/ejercicio-servicios');
  const enunciado = page.getByRole('heading', { name: 'Ejercicio de servicios', level: 1 });
  const solucion = page.getByRole('heading', { name: 'Posible solución' });
  await expect(enunciado).toBeVisible();
  await expect(solucion).toBeVisible();
  await expect(page.getByText('Cadena: MiCadena')).toBeVisible();
  const [yEnunciado, ySolucion] = await Promise.all([
    enunciado.boundingBox().then((b) => b!.y),
    solucion.boundingBox().then((b) => b!.y),
  ]);
  expect(yEnunciado).toBeLessThan(ySolucion);
});

test.describe('CRUD de usuarios con JWT (backend local)', () => {
  test('exige iniciar sesión y permite crear, filtrar, ordenar, paginar y borrar como admin', async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;
    await page.goto('/v2/usuarios-crud');
    await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();

    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByText('Sesión:')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);

    await expect(page.getByRole('dialog')).toHaveCount(0); // cerrado: no está en el árbol de accesibilidad
    await page.getByRole('button', { name: 'Nuevo usuario' }).click();
    await expect(page.getByRole('dialog', { name: 'Nuevo usuario' })).toBeVisible();
    await expect(page.getByLabel('Nombre', { exact: true })).toBeFocused();
    await page.getByLabel('Nombre', { exact: true }).fill('Usuario E2E');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByRole('button', { name: 'Crear usuario' }).click();
    await expect(page.getByText('«Usuario E2E» creado.')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByLabel('Buscar por nombre o email').fill(email);
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('.rango')).toHaveText('1–1 de 1');

    await page.getByRole('button', { name: 'Eliminar Usuario E2E' }).click();
    await page.getByRole('button', { name: 'Confirmar el borrado de Usuario E2E' }).click();
    await expect(page.getByText('«Usuario E2E» eliminado.')).toBeVisible();
    await expect(page.getByText(/Ningún usuario coincide/)).toBeVisible();

    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  });

  test('ordena y pagina en el servidor', async ({ page }) => {
    await page.goto('/v2/usuarios-crud');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.locator('tbody tr').first()).toBeVisible();
    await page.getByRole('button', { name: /^Nombre/ }).click();
    await expect(page.locator('thead th').first()).toHaveAttribute('aria-sort', 'ascending');
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(/Página 2 de/)).toBeVisible();
  });

  test('un alumno solo consulta: sin formulario ni acciones', async ({ page }) => {
    await page.goto('/v2/usuarios-crud');
    await page.getByLabel('Usuario', { exact: true }).fill('alumno');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByText(/solo permite consultar/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nuevo usuario' })).toHaveCount(0);
  });
});

test('el ejemplo con servicio muestra los resultados que entrega ResultadosApiService', async ({ page }) => {
  await page.route('**/api/resultados', (route) => route.fulfill({ json: [
    { nombre: 'Partido de ejemplo', dipu: 3, imagen: 'partido.png' },
  ] }));
  await page.goto('/v2/consumo-api-servicio');
  await expect(page.getByRole('heading', { name: 'Consumo de API con servicio (V2)' })).toBeVisible();
  await expect(page.getByText('Partido de ejemplo: 3 escaños')).toBeVisible();
});

test('el formulario tipado se vacía tras un envío correcto y mantiene la confirmación', async ({ page }) => {
  await page.goto('/v2/formulario-tipado');
  await page.getByLabel('Nombre').fill('Ana Pérez');
  await page.getByLabel('Correo electrónico').fill('ana@example.com');
  await page.getByLabel('Acepto la política de privacidad').check();
  await page.getByRole('button', { name: 'Inscribirme' }).click();
  await expect(page.getByText('Inscripción recibida para Ana Pérez.')).toBeVisible();
  await expect(page.getByLabel('Nombre')).toHaveValue('');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('');
  await expect(page.getByLabel('Acepto la política de privacidad')).not.toBeChecked();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test.describe('Registro con validadores personalizados', () => {
  const SEGURA = 'Contrasena-Muy-Segura-2026!';

  test('muestra los requisitos pendientes mientras se escribe la contraseña', async ({ page }) => {
    await page.goto('/v2/formulario-registro');
    await page.getByLabel('Contraseña', { exact: true }).fill('abc');
    await expect(page.getByRole('listitem').filter({ hasText: 'Al menos 20 caracteres' })).toContainText('Pendiente');
    await expect(page.getByRole('listitem').filter({ hasText: 'letra minúscula' })).toContainText('Cumplido');
  });

  test('avisa si las contraseñas válidas no coinciden', async ({ page }) => {
    await page.goto('/v2/formulario-registro');
    await page.getByLabel('Contraseña', { exact: true }).fill(SEGURA);
    await page.getByLabel('Repite la contraseña').fill(SEGURA + 'x');
    await page.getByLabel('Repite la contraseña').blur();
    await expect(page.getByRole('alert').filter({ hasText: 'Las contraseñas no coinciden.' })).toBeVisible();
  });

  test('registra y vacía el formulario cuando todo es correcto', async ({ page }) => {
    await page.goto('/v2/formulario-registro');
    await page.getByLabel('Correo electrónico').fill('ana@example.com');
    await page.getByLabel('Contraseña', { exact: true }).fill(SEGURA);
    await page.getByLabel('Repite la contraseña').fill(SEGURA);
    await page.getByRole('button', { name: 'Registrarme' }).click();
    await expect(page.getByText('Registro correcto para ana@example.com.')).toBeVisible();
    await expect(page.getByLabel('Contraseña', { exact: true })).toHaveValue('');
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('el botón Ver muestra y oculta el contenido de cada contraseña', async ({ page }) => {
    await page.goto('/v2/formulario-registro');
    const contrasena = page.getByLabel('Contraseña', { exact: true });
    await contrasena.fill(SEGURA);
    await expect(contrasena).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Ver contraseña' }).click();
    await expect(contrasena).toHaveAttribute('type', 'text');
    await expect(contrasena).toHaveValue(SEGURA);
    await page.getByRole('button', { name: 'Ocultar contraseña' }).click();
    await expect(contrasena).toHaveAttribute('type', 'password');

    const repite = page.getByLabel('Repite la contraseña');
    await page.getByRole('button', { name: 'Ver la repetición de la contraseña' }).click();
    await expect(repite).toHaveAttribute('type', 'text');
    await expect(contrasena).toHaveAttribute('type', 'password');
  });
});

test.describe('Catálogo de validadores predefinidos', () => {
  test('muestra el error real y el mensaje de minLength', async ({ page }) => {
    await page.goto('/v2/validadores-predefinidos');
    await page.getByLabel('Usuario (3 a 12 caracteres)').fill('ab');
    await expect(page.getByText('minlength: {"requiredLength":3,"actualLength":2}')).toBeVisible();
    await expect(page.getByText('Mínimo 3 caracteres.')).toBeVisible();
  });

  test('exigir el teléfono cambia nullValidator por compose en caliente', async ({ page }) => {
    await page.goto('/v2/validadores-predefinidos');
    const telefono = page.getByLabel('Teléfono', { exact: true });
    await telefono.fill('');
    await expect(page.locator('#telefono-estado')).toContainText('Válido');
    await page.getByLabel('Exigir teléfono').check();
    await expect(page.locator('#telefono-estado')).toContainText('Escribe tu teléfono.');
    await telefono.fill('600123456');
    await expect(page.locator('#telefono-estado')).toContainText('Válido');
  });
});

test.describe('Formulario de alta con Signal Forms', () => {
  async function rellenar(page: import('@playwright/test').Page, repite = 'abcd') {
    await page.getByLabel('Username *').fill('anita');
    await page.getByLabel('Password *', { exact: true }).fill('abcd');
    await page.getByLabel('Repeat Password *').fill(repite);
    await page.getByLabel('Email *').fill('ana@example.com');
    await page.getByLabel('Acepto las condiciones *').check();
  }

  test('el botón está deshabilitado hasta que el formulario es válido', async ({ page }) => {
    await page.goto('/v2/formulario-alta-signal');
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled();
    await rellenar(page);
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeEnabled();
  });

  test('avisa si las contraseñas no coinciden', async ({ page }) => {
    await page.goto('/v2/formulario-alta-signal');
    await rellenar(page, 'abce');
    await page.getByLabel('Repeat Password *').blur();
    await expect(page.getByRole('alert').filter({ hasText: 'Las contraseñas no coinciden.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled();
  });

  test('envía, confirma y reinicia el formulario', async ({ page }) => {
    await page.goto('/v2/formulario-alta-signal');
    await rellenar(page);
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByText('Alta recibida para anita.')).toBeVisible();
    await expect(page.getByLabel('Username *')).toHaveValue('');
    await expect(page.getByLabel('Acepto las condiciones *')).not.toBeChecked();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
});
