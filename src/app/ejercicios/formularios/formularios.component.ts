import { Component } from '@angular/core';
import {Formulario} from "./formulario";

import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './formularios.component.html',
  styleUrl: './formularios.component.css'
})
export class FormulariosComponent {

  model: Formulario;

  constructor() {
    this.model = new Formulario();
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.model);
    this.model = new Formulario();
  }

}
