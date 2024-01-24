import { Component } from '@angular/core';
import {FormBasicoComponent} from "../../reactivos/form-basico/form-basico.component";
import {FormBuilderBasicoComponent} from "../../reactivos/form-builder-basico/form-builder-basico.component";
import {
  FormGroupAnidadoBasicoComponent
} from "../../reactivos/form-group-anidado-basico/form-group-anidado-basico.component";
import {FormGroupBasicoComponent} from "../../reactivos/form-group-basico/form-group-basico.component";
import {
  FormValidatePasswordsComponent
} from "../../reactivos/form-validate-passwords/form-validate-passwords.component";
import {MyCustomValidationComponent} from "../../reactivos/my-custom-validation/my-custom-validation.component";

@Component({
  selector: 'app-reactivos',
  standalone: true,
  imports: [
    FormBasicoComponent,
    FormBuilderBasicoComponent,
    FormGroupAnidadoBasicoComponent,
    FormGroupBasicoComponent,
    FormValidatePasswordsComponent,
    MyCustomValidationComponent
  ],
  templateUrl: './reactivos.component.html',
  styleUrl: './reactivos.component.css'
})
export class ReactivosComponent {

}
