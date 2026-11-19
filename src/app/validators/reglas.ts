/**
 * Reglas de validación como FUNCIONES PURAS: reciben valores y devuelven un booleano.
 * No dependen de ninguna API de formularios, así que las usan por igual:
 *  - los formularios reactivos, dentro de un `ValidatorFn` (ver `contrasena.validators.ts`), y
 *  - Signal Forms, dentro de `validate()` (ver `V2FormularioAltaSignalComponent`).
 * Un `ValidatorFn` recibe un `AbstractControl` y no puede pasarse a `form()`; una regla pura sí se comparte.
 */

export const contieneNumero = (valor: string): boolean => /\d/.test(valor);
export const contieneMinuscula = (valor: string): boolean => /\p{Ll}/u.test(valor);
export const contieneMayuscula = (valor: string): boolean => /\p{Lu}/u.test(valor);
// Símbolo: cualquier carácter que no sea letra, número ni espacio.
export const contieneSimbolo = (valor: string): boolean => /[^\p{L}\p{N}\s]/u.test(valor);

/**
 * Dos valores coinciden. Si alguno está vacío no opina (devuelve `true`): de eso se encarga la regla de
 * «obligatorio» de cada campo, para no duplicar avisos.
 */
export const coincidenSiHayValor = (a: string, b: string): boolean => !a || !b || a === b;
