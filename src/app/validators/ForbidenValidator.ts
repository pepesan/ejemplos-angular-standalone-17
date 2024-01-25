/** A hero's name can't match the given regular expression */
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

// funcion que define una función validador
export function ForbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  // devolvemos una función que recibe un control y devuelve un objeto de error o null
  return (control: AbstractControl): ValidationErrors | null => {
    // comprobamos si cumple la expresión regular
    const forbidden = nameRe.test(control.value);
    // devolvemos un objeto de error o null si cumple o no la expresión regula
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}
