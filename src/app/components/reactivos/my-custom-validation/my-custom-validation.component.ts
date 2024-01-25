import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ForbiddenNameValidator} from "../../../directives/forbidden-name.directive";

@Component({
  selector: 'app-my-custom-validation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './my-custom-validation.component.html',
  styleUrls: ['./my-custom-validation.component.css']
})
export class MyCustomValidationComponent implements OnInit {
  public profileForm: UntypedFormGroup;
  constructor() {
    this.profileForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.required,
        ForbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
      ]),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.profileForm.value)
  }

  muestra() {
    //console.log(this.profileForm.controls['firstName']);
    //console.log(this.profileForm.get('firstName'));
    console.log(this.profileForm.value)
    console.log("errores: "+ this.profileForm.controls['name']?.errors);
    console.log("error: require: "+ this.profileForm.controls['name'].errors?.['required']);
    console.log("error: forbiddenName: "+ this.profileForm.controls['name'].errors?.['forbiddenName']);

  }
}
