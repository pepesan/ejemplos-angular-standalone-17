import { Component } from '@angular/core';
import {TodoService} from "../services/todo.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Partido} from "./partido";

@Component({
  selector: 'app-uso-service',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  providers: [TodoService],
  templateUrl: './uso-service.component.html',
  styleUrl: './uso-service.component.css'
})
export class UsoServiceComponent {
  partidos: Promise<Partido[]> = this._todoService.getData().toPromise();
  constructor(private _todoService:TodoService) {}
}
