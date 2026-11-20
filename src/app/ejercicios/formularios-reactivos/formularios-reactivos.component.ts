import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {NgClass} from "@angular/common";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-formularios-reactivos',
  imports: [
    ReactiveFormsModule,
    NgClass,
    EnunciadoComponent
  ],
  templateUrl: './formularios-reactivos.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './formularios-reactivos.component.css'
})
export class FormulariosReactivosComponent {

  formulario: FormGroup;

  genders = [
    { name: "Masculino", id: "male", icon: "fa-male" },
    { name: "Femenino", id: "female", icon: "fa-female" },
    { name: "No binario", id: "no-binary", icon: "fa-genderless" },
    { name: "Otro", id: "other", icon: "fa-user" }
  ];

  orientations = [
    { name: "Hetero", id: "hetero" },
    { name: "Homo", id: "homo" },
    { name: "Bi", id: "bi" }
  ];

  relationTypes = [
    { id: 1, name: "Amistad" },
    { id: 2, name: "Relación seria" },
    { id: 3, name: "Relación casual" },
    { id: 4, name: "Networking" }
  ];

  // --- Código anterior (enfoque legado), conservado para compararlo con el nuevo ---
  // El validador de grupo recibía `group: FormGroup`. Eso no encaja con `ValidatorFn` (que recibe un
  // `AbstractControl`), así que TypeScript resolvía `fb.group(...)` con el overload ANTIGUO, marcado @deprecated
  // («This API is not typesafe...»), y el IDE subrayaba la llamada.
  //
  // constructor(private fb: FormBuilder) {
  //   this.formulario = this.fb.group({
  //     username: ['', [Validators.required, Validators.minLength(4)]],
  //     password: ['', [Validators.required, Validators.minLength(4)]],
  //     repeatPassword: ['', [Validators.required, Validators.minLength(4)]],
  //     email: ['', [Validators.required, Validators.email]],
  //     gender: ['male', Validators.required],
  //     orientation: ['hetero', Validators.required],
  //     relationType: [3, Validators.required],
  //     conditions: [false, Validators.requiredTrue]
  //   }, { validators: this.passwordMatchValidator });
  // }
  //
  // passwordMatchValidator(group: FormGroup) {
  //   return group.get('password')?.value === group.get('repeatPassword')?.value
  //     ? null : { mismatch: true };
  // }

  // --- Código actual: sin API deprecada ---
  // El validador de grupo se declara como `ValidatorFn` (recibe un `AbstractControl` y devuelve
  // `ValidationErrors | null`). Con ese tipo, `fb.group(controles, { validators })` usa el overload vigente
  // (`AbstractControlOptions`), que sí es seguro con los tipos.
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null =>
    group.get('password')?.value === group.get('repeatPassword')?.value
      ? null : { mismatch: true };

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', Validators.required],
      orientation: ['hetero', Validators.required],
      relationType: [3, Validators.required],
      conditions: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      // Aquí realizas el envío al backend
      this.formulario.reset();
    }
  }
}
