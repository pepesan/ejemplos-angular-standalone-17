import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { RouterLink } from "@angular/router";

/**
 * ENFOQUE LEGADO: `*ngIf`, `*ngFor` y `*ngSwitch` están obsoletos (deprecados) desde Angular v20.
 * Se conservan para comparar. Alternativa recomendada: control flow integrado
 * (`@if`, `@for`, `@switch`), ver `components/control-flow`.
 */
@Component({
    selector: 'app-directivas-builtin',
    imports: [
    NgClass,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    RouterLink
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

  trackByText(_index: number, item: { text: string }): string {
    return item.text;
  }
}
