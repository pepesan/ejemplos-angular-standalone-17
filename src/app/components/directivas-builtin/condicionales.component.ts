import { Component } from '@angular/core';
import {CommonModule,
  NgIf,
  NgSwitch,
  NgClass,
  NgSwitchCase,
  NgSwitchDefault,
  NgForOf} from "@angular/common";

@Component({
    selector: 'app-directivas-builtin',
    imports: [
        //CommonModule,
        NgIf,
        NgSwitch,
        NgClass,
        NgSwitchCase,
        NgSwitchDefault,
        NgForOf
    ],
    templateUrl: './condicionales.component.html',
    styleUrl: './condicionales.component.css'
})
export class CondicionalesComponent {
  public booleano = true;
  currentItem: string = "stin";

  isSpecial: boolean = true;

  datos: any []= [
    {"text": "valor 1"},
    {"text": "valor 2"},
    {"text": "valor 3"},
    {"text": "valor 4"},

  ];
}
