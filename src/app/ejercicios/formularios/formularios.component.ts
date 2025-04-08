import { Component } from '@angular/core';
import {Formulario} from "./formulario";

import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-formularios',
    imports: [
        FormsModule,
        CommonModule
    ],
    templateUrl: './formularios.component.html',
    styleUrl: './formularios.component.css'
})
export class FormulariosComponent {

  model: Formulario;
  public genders: any[] = [];
  constructor() {
    this.model = new Formulario();
    this.genders.push({
      name: "Masculino",
      id: "male",
      disabled: false,
      checked: true
    });
    this.genders.push({
      name: "Femenino",
      id: "female",
      disabled: false,
      checked: false
    });
    this.genders.push({
      name: "No binario",
      id: "no-binary",
      disabled: false,
      checked: false

    });
    this.genders.push({
      name: "Otro",
      id: "other",
      disabled: false,
      checked: false

    });
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.model);
    this.model = new Formulario();
    // envio de datos al backend
    // sendData(data: any): Observable<any> {
    //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //   return this.http.post<any>(this.apiUrl, data, { headers });
    // }
  }

}
