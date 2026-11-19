import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Error de validación que lleva su propio mensaje: el validador y su texto viajan juntos. */
export interface ErrorConMensaje<T = unknown> {
  detalle: T;
  mensaje: string;
}

/**
 * Envuelve un validador (predefinido o propio) para que su error incluya el mensaje que debe mostrarse.
 * El nombre del error no cambia (`required`, `minlength`...), así que `hasError('required')` sigue funcionando.
 * El mensaje puede ser un texto fijo o una función del detalle del error (p. ej. `requiredLength` de `minLength`).
 */
export function conMensaje<T = unknown>(validador: ValidatorFn, mensaje: string | ((detalle: T) => string)): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errores = validador(control);
    if (!errores) return null;
    return Object.fromEntries(
      Object.entries(errores).map(([clave, detalle]) => [
        clave,
        { detalle, mensaje: typeof mensaje === 'function' ? mensaje(detalle as T) : mensaje } satisfies ErrorConMensaje,
      ]),
    );
  };
}

function llevaMensaje(error: unknown): error is ErrorConMensaje {
  return typeof error === 'object' && error !== null && typeof (error as ErrorConMensaje).mensaje === 'string';
}

/** Mensajes de todos los errores de un control, en el orden en que se declararon sus validadores. */
export function mensajesDe(errores: ValidationErrors | null): string[] {
  return Object.values(errores ?? {}).map((error) => (llevaMensaje(error) ? error.mensaje : 'El valor no es válido.'));
}
