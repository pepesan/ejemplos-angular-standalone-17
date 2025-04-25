import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmedValidator} from "../../../validators/ConfirmedValidator";



@Component({
    selector: 'app-form-validate-passwords',
    imports: [ReactiveFormsModule],
    templateUrl: './form-validate-passwords.component.html',
    styleUrls: ['./form-validate-passwords.component.css']
})
export class FormValidatePasswordsComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      password: ['',[Validators.required]],
      repeatedPassword: ['',Validators.required, ConfirmedValidator('password')],
    });

  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.myForm);
    console.log(this.myForm.errors);
    console.log("repeated: "+ this.myForm.errors?.['repeatedPassword']);
    console.log("required"+ this.myForm.errors?.['repeatedPassword']?.required);
    console.log("confirmedValidator" + this.myForm.errors?.['repeatedPassword']?.confirmedValidator);
  }
}


