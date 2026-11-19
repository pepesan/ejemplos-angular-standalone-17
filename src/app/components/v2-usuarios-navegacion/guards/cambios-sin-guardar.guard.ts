import { InjectionToken, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

/** Lo que debe ofrecer una pantalla para que la guarda sepa si hay cambios sin guardar. */
export interface ConCambiosSinGuardar {
  hayCambios(): boolean;
}

/**
 * Pregunta al usuario. Es un token para poder sustituirlo en las pruebas: `window.confirm` bloquea el navegador
 * y no se puede simular bien. (Un modal propio sería aún más accesible; aquí se mantiene el diálogo nativo.)
 */
export const CONFIRMAR_SALIDA = new InjectionToken<(mensaje: string) => boolean>('CONFIRMAR_SALIDA', {
  providedIn: 'root',
  factory: () => (mensaje) => window.confirm(mensaje),
});

/** Antes de salir de alta o edición, pide confirmación solo si el formulario tiene cambios sin guardar. */
export const cambiosSinGuardarGuard: CanDeactivateFn<ConCambiosSinGuardar> = (pantalla) =>
  !pantalla.hayCambios() || inject(CONFIRMAR_SALIDA)('Tienes cambios sin guardar. ¿Salir de todos modos?');
