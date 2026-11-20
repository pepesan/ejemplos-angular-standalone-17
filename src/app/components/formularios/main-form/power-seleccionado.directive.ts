import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Validador para formularios por plantilla: el control es inválido si está
 * vacío o si su valor es 0 (la opción «None»). El <select> con [value] emite
 * strings y el modelo inicial es number, por eso se compara con Number().
 */
@Directive({
  selector: '[appPowerSeleccionado]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PowerSeleccionadoDirective, multi: true }
  ]
})
export class PowerSeleccionadoDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    const vacio = valor === null || valor === undefined || valor === '';
    return vacio || Number(valor) === 0 ? { powerRequerido: true } : null;
  }
}
