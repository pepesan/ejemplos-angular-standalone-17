import { Component, OnInit } from '@angular/core';
import {FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-form-group-anidado-basico',
  imports: [ReactiveFormsModule, NgIf],
    templateUrl: './form-group-anidado-basico.component.html',
    styleUrls: ['./form-group-anidado-basico.component.css']
})
export class FormGroupAnidadoBasicoComponent implements OnInit {

  public profileForm: UntypedFormGroup;
  //public typedProfileForm: FormGroup;

  constructor() {
    this.profileForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(
        '',
        [
          Validators.required,
          Validators.minLength(4)]),
      lastName: new UntypedFormControl(''),
      address: new UntypedFormGroup({
        street: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        state: new UntypedFormControl('', [Validators.required]),
        zip: new UntypedFormControl('')
      })
    });
    // this.typedProfileForm = new FormGroup({
    //   firstName: new UntypedFormControl(''),
    //   lastName: new UntypedFormControl(''),
    //   address: new UntypedFormGroup({
    //     street: new UntypedFormControl(''),
    //     city: new UntypedFormControl(''),
    //     state: new UntypedFormControl(''),
    //     zip: new UntypedFormControl('')
    //   })
    // });
  }
  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.value?.firstName);
    console.warn(this.profileForm.value?.address);
    console.warn(this.profileForm.value?.address?.street);
    console.warn(this.profileForm.controls['address']);
    console.log(this.profileForm);
  }

  cambia() {
    this.profileForm.patchValue({
      firstName: 'Nancy',
      address: {
        street: '123 Drew Street'
      }
    });
    console.log(this.profileForm);
  }
}
