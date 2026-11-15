import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Todo} from "../todos/todo";

@Component({
    selector: 'app-control-flow',
    imports: [],
    templateUrl: './control-flow.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './control-flow.component.css'
})
export class ControlFlowComponent {
  public a: number = 3;
  public b: number = 2;
  public todos: Todo[]=[
    { id: 1, text:"Hacer la compra"},
    { id: 2, text: "Revisar el coche"},
    new Todo(3, "Llevar al niño a Karate")
  ];
  public condicion: string = "C";
}

