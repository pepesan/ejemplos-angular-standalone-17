import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, of} from "rxjs";

// define una función que devuelva un objeto ValidatorFn
export function ConfirmedValidator(controlName: string): ValidatorFn {
  // define una función que devuelva un Observable de ValidationErrors
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    console.log("ConfirmedValidator:"+ controlName)
    // obtenemos el control de nombre "controlName" del formulario padre (control.parent) y comparamos su valor con el valor del control actual (control.value)
    const matchingControl = (control.parent as FormGroup).controls[controlName];
    console.log("Repeatedpassword Value: "+control.value);
    console.log("Password Value: "+matchingControl.value);
    // si los valores no coinciden, devolvemos un objeto de error con la propiedad "confirmedValidator" y los valores "control.value" y "matchingControl.value"
    return control.value !== matchingControl.value ? of({confirmedValidator: {value: control.value, confirmed: matchingControl.value}}) : of(null);
  };
}
