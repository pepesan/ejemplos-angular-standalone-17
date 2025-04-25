import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import {CommonModule} from "@angular/common";
@Component({
    selector: 'app-form-builder-basico',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './form-builder-basico.component.html',
    styleUrls: ['./form-builder-basico.component.css']
})
export class FormBuilderBasicoComponent implements OnInit {

  public profileForm: UntypedFormGroup;
  //public typedProfileForm: FormGroup;


  constructor(private fb: UntypedFormBuilder, private tfb: FormBuilder) {
    this.profileForm= this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ],
      lastName: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      }),
    });
    // lo marcamos como no tocado
    this.profileForm.markAsUntouched();
    // lo marcamos como prístino
    this.profileForm.markAsPristine();

    // // Typed
    // this.typedProfileForm= this.tfb.group({
    //   firstName: [
    //     '',
    //     [Validators.required,Validators.minLength(4)]
    //   ],
    //   lastName: [''],
    //   address: this.fb.group({
    //     street: [''],
    //     city: [''],
    //     state: [''],
    //     zip: ['']
    //   }),
    // });
    // // lo marcamos como no tocado
    // this.typedProfileForm.markAsUntouched();
    // // lo marcamos como prístino
    // this.typedProfileForm.markAsPristine();
  }

  ngOnInit(): void {
  }

  cambia() {

  }

  onSubmit() {
    console.warn(this.profileForm.value);
    console.log(this.profileForm);
    // reseteamos los datos
    this.profileForm.reset();
    // lo marcamos como no tocado
    this.profileForm.markAsUntouched();
    // lo marcamos como prístino
    this.profileForm.markAsPristine();
  }

  muestra() {
    //console.log(this.profileForm.controls['firstName']);
    //console.log(this.profileForm.get('firstName'));
    console.log(this.profileForm.controls['firstName']?.errors);
    if(this.profileForm.controls['firstName'].errors!= null){
      console.log(this.profileForm.controls['firstName']?.errors['required']);
    }
  }
}
