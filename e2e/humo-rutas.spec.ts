import { expect, test } from './fixtures';
import { TEMARIO_UNITS } from '../src/app/navigation/temario-menu';

/**
 * Test de humo: abre CADA ruta del menú y comprueba que la página carga sin errores de ejecución.
 * Las rutas salen de `temario-menu.ts`, así que un ejemplo nuevo entra solo en este recorrido.
 * Las peticiones a APIs externas se cortan para que el resultado no dependa de la red.
 */
const rutas = TEMARIO_UNITS.flatMap((unidad) => unidad.items.map((item) => ({ unidad: unidad.label, ...item })));

for (const { unidad, path, label } of rutas) {
  test(`carga ${path} (${unidad})`, async ({ page }) => {
    const errores: string[] = [];
    page.on('pageerror', (error) => errores.push(`Excepción no controlada: ${error.message}`));
    page.on('console', (mensaje) => {
      // Errores de Angular (NG0…) o de ejecución; los fallos de red esperados al cortar APIs externas no cuentan.
      if (mensaje.type() === 'error' && /NG0\d+|ExpressionChanged|Uncaught|TypeError|ReferenceError/.test(mensaje.text())) {
        errores.push(`Error en consola: ${mensaje.text().slice(0, 200)}`);
      }
    });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (ruta) =>
      ruta.request().resourceType() === 'document' ? ruta.continue() : ruta.abort(),
    );

    await page.goto(path);

    // La ruta existe (no cae en la página de «ruta no encontrada») y el contenido principal se ha pintado.
    // Una ruta protegida por guarda de sesión acaba en su `/login?returnUrl=...` (la redirección es asíncrona),
    // así que se aceptan ambas URLs: comprobar solo la original dependía de quién ganaba la carrera.
    await expect(page).toHaveURL(new RegExp(`${path.replace(/[/-]/g, '\\$&')}(/login\\?returnUrl=.*)?$`));
    await expect(page.getByRole('heading', { name: 'Ruta no encontrada' })).toHaveCount(0);
    await expect(page.locator('main, app-root').first()).toContainText(/\S{3,}/);
    await expect(page.locator('app-root')).toBeVisible();
    expect(errores, `Etiqueta del menú: ${label}`).toEqual([]);
  });
}
