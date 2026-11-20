import { Component, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmedValidator} from "../../../validators/ConfirmedValidator";
import {ConfirmedControlValidator} from "../../../validators/ConfirmedControlValidator";
import {PasswordsForm, PasswordsValue} from "./passwords-form.model";



@Component({
    selector: 'app-form-validate-passwords',
    imports: [ReactiveFormsModule],
    templateUrl: './form-validate-passwords.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./form-validate-passwords.component.css']
})
export class FormValidatePasswordsComponent {
  // Opción 1: ConfirmedValidator recibe el NOMBRE del campo con el que comparar (asíncrono, necesita FormGroup padre).
  myForm: PasswordsForm;
  // Opción 2: ConfirmedControlValidator recibe el FormControl (síncrono, no depende del FormGroup).
  controlesForm: PasswordsForm;

  constructor(private fb: FormBuilder) {
    // `nonNullable.group` con la sintaxis de array crea FormControl<string> y encaja con PasswordsForm.
    this.myForm = this.fb.nonNullable.group({
      password: ['',[Validators.required]],
      repeatedPassword: ['',Validators.required, ConfirmedValidator('password')],
    });

    // FormBuilder tipado: `nonNullable` evita que `reset()` deje `null` y los controles quedan como FormControl<string>.
    // Los controles se crean antes que el grupo porque el validador necesita la referencia a `password`.
    const password = fb.nonNullable.control('', Validators.required);
    const repeatedPassword = fb.nonNullable.control('', [Validators.required, ConfirmedControlValidator(password)]);
    this.controlesForm = fb.nonNullable.group({ password, repeatedPassword });
    // Angular solo revalida el control que cambia: si se edita la contraseña después, se revalida la repetida a mano.
    password.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => repeatedPassword.updateValueAndValidity());
  }

  ngOnInit() {
  }

  onSubmit() {
    const valor: PasswordsValue = this.myForm.getRawValue();
    console.log(valor);
    console.log(this.myForm);
    console.log(this.myForm.errors);
    console.log("repeated: "+ this.myForm.errors?.['repeatedPassword']);
    console.log("required"+ this.myForm.errors?.['repeatedPassword']?.required);
    console.log("confirmedValidator" + this.myForm.errors?.['repeatedPassword']?.confirmedValidator);
  }
}


