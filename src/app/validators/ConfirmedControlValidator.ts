import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Exige que el control validado tenga el mismo valor que otro control, que se le pasa por REFERENCIA.
 *
 * Diferencias con `ConfirmedValidator` (que recibe el NOMBRE del control hermano):
 *  - No necesita que el control validado tenga un `FormGroup` padre: compara con la referencia que recibe, así que
 *    funciona al construir el control, en un `FormControl` suelto y aunque los dos controles estén en grupos distintos.
 *  - Es síncrono: comparar dos valores no necesita un Observable.
 *  - Devuelve el mismo error (`confirmedValidator` con `{value, confirmed}`) y las plantillas existentes sirven igual.
 *
 * Limitación: Angular solo revalida un control cuando cambia el propio control. Si el usuario edita después el otro
 * control, el validado no se entera. Para revalidarlo:
 *   `otro.valueChanges.subscribe(() => repetido.updateValueAndValidity());`
 * (con `takeUntilDestroyed()` en un componente, para no dejar la suscripción abierta).
 *
 * Uso:
 *   const password = new FormControl('', Validators.required);
 *   const repetida = new FormControl('', [Validators.required, ConfirmedControlValidator(password)]);
 */
export function ConfirmedControlValidator(otro: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    // Se lee `otro.value` en cada validación (no al crear el validador), para comparar siempre con el valor actual.
    control.value !== otro.value
      ? {confirmedValidator: {value: control.value, confirmed: otro.value}}
      : null;
}
