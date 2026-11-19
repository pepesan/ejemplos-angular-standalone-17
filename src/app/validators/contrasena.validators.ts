import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { conMensaje } from './validador-con-mensaje';

export const LONGITUD_MINIMA_CONTRASENA = 20;

/** Validador propio reutilizable: falla (con la clave dada) si el valor no contiene nada que cumpla el patrón. */
function debeContener(clave: string, patron: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = String(control.value ?? '');
    // Valor vacío: lo comprueba `required`, para no mostrar todos los errores a la vez.
    return valor === '' || patron.test(valor) ? null : { [clave]: true };
  };
}

export const tieneNumero = debeContener('numero', /\d/);
export const tieneMinuscula = debeContener('minuscula', /\p{Ll}/u);
export const tieneMayuscula = debeContener('mayuscula', /\p{Lu}/u);
// Símbolo: cualquier carácter que no sea letra, número ni espacio.
export const tieneSimbolo = debeContener('simbolo', /[^\p{L}\p{N}\s]/u);

/** Requisitos de la contraseña, en el orden en que se enseñan al usuario. La clave coincide con la del error. */
export const REQUISITOS_CONTRASENA = [
  { clave: 'minlength', texto: `Al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.` },
  { clave: 'numero', texto: 'Al menos un número.' },
  { clave: 'minuscula', texto: 'Al menos una letra minúscula.' },
  { clave: 'mayuscula', texto: 'Al menos una letra mayúscula.' },
  { clave: 'simbolo', texto: 'Al menos un símbolo (por ejemplo ! ? # $ %).' },
] as const;

/**
 * Pila de validadores de un campo de contraseña: uno predefinido de Angular para «obligatorio», otro para la
 * longitud y cuatro propios. Cada uno es independiente y lleva su mensaje; se aplica igual a «contraseña» y
 * «repite contraseña».
 */
export function validadoresContrasena(): ValidatorFn[] {
  const texto = (clave: string) => REQUISITOS_CONTRASENA.find((r) => r.clave === clave)!.texto;
  return [
    conMensaje(Validators.required, 'Escribe la contraseña.'),
    conMensaje(Validators.minLength(LONGITUD_MINIMA_CONTRASENA), texto('minlength')),
    conMensaje(tieneNumero, texto('numero')),
    conMensaje(tieneMinuscula, texto('minuscula')),
    conMensaje(tieneMayuscula, texto('mayuscula')),
    conMensaje(tieneSimbolo, texto('simbolo')),
  ];
}

/**
 * Validador de GRUPO: compara dos campos. El error se guarda en el grupo (no en un campo), porque depende de
 * ambos. Si alguno está vacío no opina: de eso se encarga `required` de cada campo.
 */
export function coinciden(campo: string, repetido: string): ValidatorFn {
  return conMensaje((grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(repetido)?.value;
    return a && b && a !== b ? { noCoinciden: true } : null;
  }, 'Las contraseñas no coinciden.');
}
