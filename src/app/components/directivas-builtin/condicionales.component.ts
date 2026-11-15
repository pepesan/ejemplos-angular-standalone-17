import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";

@Component({
    selector: 'app-directivas-builtin',
    imports: [
    NgClass
],
    templateUrl: './condicionales.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
