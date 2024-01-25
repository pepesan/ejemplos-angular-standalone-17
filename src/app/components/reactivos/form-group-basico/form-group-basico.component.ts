import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {NgIf} from "@angular/common";
@Component({
  selector: 'app-form-group-basico',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-group-basico.component.html',
  styleUrls: ['./form-group-basico.component.css']
})
export class FormGroupBasicoComponent implements OnInit {
  public profileForm: UntypedFormGroup;
  //public typedProfileForm: UntypedFormGroup;


  constructor() {
    this.profileForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      lastName: new UntypedFormControl(''),
    });
    // this.typedProfileForm = new FormGroup({
    //   firstName: new FormControl('',[Validators.required,Validators.minLength(4)]),
    //   lastName: new FormControl(''),
    // });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.value.firstName);
  }
  //
  // onSubmitTyped() {
  //   console.warn(this.typedProfileForm.value);
  //   console.warn(this.typedProfileForm.value.firstName);
  // }
}
