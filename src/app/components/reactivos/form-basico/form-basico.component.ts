import { Component, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule, UntypedFormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-form-basico',
  imports: [ReactiveFormsModule],
    templateUrl: './form-basico.component.html',
    styleUrls: ['./form-basico.component.css']
})
export class FormBasicoComponent implements OnInit {

  public name: UntypedFormControl;
  public nameString: FormControl<string | null>;
  constructor() {
    this.name = new UntypedFormControl('Valor inicial');
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
