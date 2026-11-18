import {Component, ElementRef, Signal, viewChild, viewChildren, ChangeDetectionStrategy} from '@angular/core';
import {TodosComponent} from "../todos/todos.component";

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
    selector: 'app-signal-queries',
    imports: [
    TodosComponent,
    AvisoApiComponent
  ],
    templateUrl: './signal-queries.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-queries.component.css'
})
// DISPONIBILIDAD: las queries con signals (`viewChild()`, `viewChildren()`, `contentChild()`...) son estables
// desde Angular 19 (según angular.dev). Antes se usaban los decoradores `@ViewChild`/`@ViewChildren`.
export class SignalQueriesComponent {
  divEl: Signal<ElementRef|undefined> = viewChild<ElementRef>('el');
  cmp:Signal<TodosComponent|undefined> = viewChild(TodosComponent);
  show:boolean = true;
  divEls:Signal<ReadonlyArray<ElementRef>> = viewChildren<ElementRef>('el');
  existingEl:Signal<unknown> = viewChild.required('requiredEl');
}
