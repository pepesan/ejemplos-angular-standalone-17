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
  public orientations: any[] = [];
  public relationTypes: any[] = [];

  constructor() {
    this.model = new Formulario();
    this.genders.push({
      name: "Masculino",
      id: "male",
      icon: "fa-male",
      disabled: false,
      checked: true
    });
    this.genders.push({
      name: "Femenino",
      id: "female",
      icon: "fa-female",
      disabled: false,
      checked: false
    });
    this.genders.push({
      name: "No binario",
      id: "no-binary",
      icon: "fa-genderless",
      disabled: false,
      checked: false

    });
    this.genders.push({
      name: "Otro",
      id: "other",
      icon: "fa-user",
      disabled: false,
      checked: false

    });
    this.orientations.push({
      name: "Hetero",
      id: "hetero",
      checked: true
    });
    this.orientations.push({
      name: "Homo",
      id: "homo",
      checked: false
    });
    this.orientations.push({
      name: "Bi",
      id: "bi",
      checked: false
    });
    this.relationTypes.push(
      { id: 1, name: "Amistad" },
      { id: 2, name: "Relación seria" },
      { id: 3, name: "Relación casual" }
    );
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
