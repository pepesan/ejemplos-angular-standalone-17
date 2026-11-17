import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Todo} from "./todo";

import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-todos',
    imports: [
    FormsModule
],
    templateUrl: './todos.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './todos.component.css'
})
export class TodosComponent {
  todo: Todo;
  todos: Todo[];

  constructor() {
    this.todo = new Todo(0 , "Llevar a la perra al veterinario");
    this.todos=[
      { id: 1, text:"Hacer la compra"},
      { id: 2, text: "Revisar el coche"},
      new Todo(3, "Llevar al niño a Karate")
    ];
  }

  ngOnInit(): void {
    console.log("componente cargado");
  }

  addTodo() {
    const nextId = this.todos.reduce((highestId, todo) => Math.max(highestId, todo.id), 0) + 1;
    this.todos.push(new Todo(nextId, this.todo.text));
    this.todo = new Todo();
  }
  deleteTodo(texto: string){
    for(let i=0; i<this.todos.length; i++){
      const todo = this.todos[i];
      if(todo.text==texto){
        this.todos.splice(i,1);
        break;
      }
    }
  }

}
