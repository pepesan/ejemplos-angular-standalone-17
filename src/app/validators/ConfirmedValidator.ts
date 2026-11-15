import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import {Observable, of} from "rxjs";

// Se declara como validador asíncrono porque devuelve el resultado envuelto en un Observable.
export function ConfirmedValidator(controlName: string): AsyncValidatorFn {
  // El nombre identifica el control del grupo con el que se compara el valor actual.
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    console.log("ConfirmedValidator:"+ controlName)
    // Este validador debe asociarse a un control hijo de un FormGroup que contenga también el control indicado.
    const matchingControl = (control.parent as FormGroup).controls[controlName];
    console.log("Repeatedpassword Value: "+control.value);
    console.log("Password Value: "+matchingControl.value);
    // Angular recibe null si coinciden o un ValidationErrors con ambos valores si no coinciden.
    return control.value !== matchingControl.value
      ? of({confirmedValidator: {value: control.value, confirmed: matchingControl.value}}) : of(null);
  };
}
