/** Rechaza los nombres que coinciden con la expresión regular proporcionada. */
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

// Un validador síncrono devuelve el error inmediatamente, sin crear un Observable.
export function ForbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // La clave del error permite a la plantilla identificar este caso concreto.
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}
