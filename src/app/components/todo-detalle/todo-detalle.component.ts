import {Component, Input} from '@angular/core';
import {Todo} from "../todo-class/todo";

@Component({
    selector: 'app-todo-detalle',
    imports: [],
    templateUrl: './todo-detalle.component.html',
    styleUrl: './todo-detalle.component.css'
})
export class TodoDetalleComponent {
  @Input() dato!: Todo;
}
