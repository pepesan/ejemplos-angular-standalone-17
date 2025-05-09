import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-radios',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './radios.component.html',
    styleUrls: ['./radios.component.sass']
})
export class RadiosComponent implements OnInit {
  public opciones: any[] = [];
  public gender: string;
  constructor() {
    // seleccionamos un valor por defecto
    this.gender = "other";
    this.opciones.push({
      name: "Masculino",
      id: "male",
      value: "male",
      disabled: false,
      checked: true
    });
    this.opciones.push({
      name: "Femenino",
      id: "female",
      value: "female",
      disabled: false,
      checked: false
    });
    this.opciones.push({
      name: "No binario",
      id: "no-binary",
      value: "no-binary",
      disabled: false,
      checked: false

    });
    this.opciones.push({
      name: "Other",
      id: "other",
      value: "other",
      disabled: false,
      checked: false

    });

  }

  ngOnInit(): void {
  }

}
