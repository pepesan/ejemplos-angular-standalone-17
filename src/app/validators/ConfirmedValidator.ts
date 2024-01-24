import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, of} from "rxjs";

export function ConfirmedValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    console.log("ConfirmedValidator:"+ controlName)
    const matchingControl = (control.parent as FormGroup).controls[controlName];
    console.log("Repeatedpassword Value: "+control.value);
    console.log("Password Value: "+matchingControl.value);
    return control.value !== matchingControl.value ? of({confirmedValidator: {value: control.value, confirmed: matchingControl.value}}) : of(null);
  };
}
