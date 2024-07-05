import { Component, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule, UntypedFormControl, Validators} from '@angular/forms';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-form-basico',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './form-basico.component.html',
  styleUrls: ['./form-basico.component.css']
})
export class FormBasicoComponent implements OnInit {

  public name: UntypedFormControl;
  public nameString: FormControl<string | null>;
  constructor() {
    this.name = new UntypedFormControl('');
    this.nameString = new FormControl('', [Validators.required]);
  }

  ngOnInit(): void {
  }

  mostrar() {
    console.log(this.name.value);
  }

  cambia() {
    this.name.setValue("Cambiado")
  }
}
