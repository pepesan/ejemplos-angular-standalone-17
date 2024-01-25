import { Component, OnInit, OnDestroy } from '@angular/core';
import {Event} from "@angular/router";

@Component({
  selector: 'app-principal-eventos',
  standalone: true,
  imports: [],
  templateUrl: './principal-eventos.component.html',
  styleUrls: ['./principal-eventos.component.sass']
})
export class PrincipalEventosComponent implements OnInit, OnDestroy {

  public value: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  clicked(event: MouseEvent) {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    let htmlButtonElement = event.target as HTMLButtonElement;
    htmlButtonElement = <HTMLButtonElement>event.target;
    console.log(htmlButtonElement.id);
    let htmlElement = event.target as HTMLElement;
    let element = event.target as Element;
    console.log("pulsado");
  }

  onInput(miInput: HTMLInputElement) {
    console.log(miInput);
    console.log(miInput.id);
  }

  onEnter(value: string) {
    this.value = value;
    console.log(this.value);
  }

  // onEnterKeyBoard(event: Event) {
  //   let kbEvent = event as KeyboardEvent;
  //   // this.value = event.value;
  //   console.log(this.value);
  // }

  onEnterKeyBoard2(elemento: HTMLInputElement) {
    // this.value = event.value;
    console.log(this.value);
  }

  ngOnDestroy(): void {
  }


}
