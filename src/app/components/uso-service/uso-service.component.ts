import { Component, ChangeDetectionStrategy } from '@angular/core';
import {TodoService} from "../../services/todo.service";
import { AsyncPipe } from "@angular/common";
import {Partido} from "./partido";

@Component({
    selector: 'app-uso-service',
    imports: [
    AsyncPipe
],
    providers: [TodoService],
    templateUrl: './uso-service.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './uso-service.component.css'
})
export class UsoServiceComponent {
  partidos: Promise<Partido[]>;
  constructor(private _todoService:TodoService) {
    this.partidos = this._todoService.getData().toPromise();
  }
}
