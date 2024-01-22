import { Component } from '@angular/core';
import {Todo} from "./todo";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {
  todo: Todo;
  todos: Todo[];

  constructor() {
    this.todo = new Todo(0 , "Nahuel");
    this.todos=[
      { id: 1, text:"Hacer la compra"},
      { id: 2, text: "Revisar el coche"},
      new Todo(3, "Llevar al niño a Karate")
    ];
  }
  ngOnInit(): void {
    console.log("componente cargado");
  }

  addTodo(){
    let mitodo=new Todo(this.todos.length, this.todo.text);
    this.todos.push(mitodo);
    this.todo=new Todo();
  }
  deleteTodo(texto: string){
    for(let i=0; i<this.todos.length; i++){
      const todo = this.todos[i];
      if(todo.text==texto){
        this.todos.splice(i,1);
      }
    }
  }

}
