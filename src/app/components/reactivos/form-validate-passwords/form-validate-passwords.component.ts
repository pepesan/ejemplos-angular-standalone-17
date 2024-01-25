import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {ConfirmedValidator} from "../../../validators/ConfirmedValidator";



@Component({
  selector: 'app-form-validate-passwords',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-validate-passwords.component.html',
  styleUrls: ['./form-validate-passwords.component.css']
})
export class FormValidatePasswordsComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      repeatedPassword: ['',Validators.required, ConfirmedValidator('password')],
      password: ['',[Validators.required]]
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


