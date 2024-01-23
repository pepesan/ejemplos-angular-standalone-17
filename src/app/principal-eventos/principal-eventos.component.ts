import { Component, OnInit } from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-principal-eventos',
  standalone: true,
  imports: [],
  templateUrl: './principal-eventos.component.html',
  styleUrls: ['./principal-eventos.component.sass']
})
export class PrincipalEventosComponent implements OnInit {

  public value: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  clicked(event: MouseEvent) {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    console.log("pulsado");
  }

  onEnter(value: string) {
    this.value = value;
    console.log(this.value);
  }

  onEnterKeyBoard(event: Event) {
    let kbEvent = event as KeyboardEvent;
    // this.value = event.value;
    console.log(this.value);
  }

  onEnterKeyBoard2(elemento: HTMLInputElement) {
    // this.value = event.value;
    console.log(this.value);
  }
}
