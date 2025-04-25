import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-formularios-reactivos',
  imports: [ReactiveFormsModule],
  templateUrl: './formularios-reactivos.component.html',
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

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      gender: ['male', Validators.required],
      orientation: ['hetero', Validators.required],
      relationType: [3, Validators.required],
      conditions: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('repeatPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      // Aquí realizas el envío al backend
      this.formulario.reset();
    }
  }
}
