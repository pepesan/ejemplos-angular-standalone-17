import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Todo} from "../todo-class/todo";
import {TodoDetalleComponent} from "../todo-detalle/todo-detalle.component";


@Component({
    selector: 'app-todo-listado',
    imports: [
    TodoDetalleComponent
],
    templateUrl: './todo-listado.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './todo-listado.component.css'
})
export class TodoListadoComponent {

  public listado: Todo[]

  constructor() {
    this.listado = [
      new Todo(1, "Mar"),
      new Todo(2, "Rubén"),
      new Todo(3, "Miguel Ángel"),
    ];
  }

}
