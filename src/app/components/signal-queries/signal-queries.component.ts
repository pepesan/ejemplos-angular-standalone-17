import {Component, ElementRef, Signal, viewChild, viewChildren} from '@angular/core';
import {TodosComponent} from "../todos/todos.component";

@Component({
  selector: 'app-signal-queries',
  standalone: true,
  imports: [
    TodosComponent
  ],
  templateUrl: './signal-queries.component.html',
  styleUrl: './signal-queries.component.css'
})
export class SignalQueriesComponent {
  divEl: Signal<ElementRef|undefined> = viewChild<ElementRef>('el');
  cmp:Signal<TodosComponent|undefined> = viewChild(TodosComponent);
  show:boolean = true;
  divEls:Signal<ReadonlyArray<ElementRef>> = viewChildren<ElementRef>('el');
  existingEl:Signal<unknown> = viewChild.required('requiredEl');
}
