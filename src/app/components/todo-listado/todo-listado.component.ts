import { Component } from '@angular/core';
import {Todo} from "../todo-class/todo";
import {TodoDetalleComponent} from "../todo-detalle/todo-detalle.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-todo-listado',
  standalone: true,
  imports: [
    TodoDetalleComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './todo-listado.component.html',
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
