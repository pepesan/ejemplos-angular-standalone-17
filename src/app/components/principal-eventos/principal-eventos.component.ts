import { Component, OnInit, OnDestroy } from '@angular/core';
import {Event} from "@angular/router";

@Component({
    selector: 'app-principal-eventos',
    imports: [],
    templateUrl: './principal-eventos.component.html',
    styleUrls: ['./principal-eventos.component.sass']
})
export class PrincipalEventosComponent implements OnInit, OnDestroy {

  public value: string = '';

  constructor() { }

  ngOnInit(): void {
    console.log("OnInit");
  }

  clicked(event: MouseEvent) {
    // eliminar el comportamiento por defecto del evento
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    // capturamos el elemento HTML que ha disparado el evento
    // as realizamos un casteo del objeto event.target a HTMLButtonElement
    let htmlButtonElement: HTMLButtonElement = event.target as HTMLButtonElement;
    //htmlButtonElement = <HTMLButtonElement>event.target;
    console.log(htmlButtonElement.id);
    let htmlElement: HTMLElement = event.target as HTMLElement;
    console.log(htmlElement.id);
    let element: Element = event.target as Element;
    console.log(element.id);
    console.log("pulsado");
  }

  onClick($event: MouseEvent) {
    // casting del evento a HTMLImageElement
    let htmlImageElement: HTMLImageElement = $event.target as HTMLImageElement;
    htmlImageElement.id = "MiImagen";
  }



  onEnter(value: string) {
    this.value = value;
    console.log(this.value);
  }

  onKeyup(value: string) {
    console.log(value);
  }


  onInput(miInput: HTMLInputElement) {
    console.log(miInput);
    console.log(miInput.id);
    console.log(miInput.value);
  }
  // onEnterKeyBoard(event: Event) {
  //   let kbEvent = event as KeyboardEvent;
  //   // this.value = event.value;
  //   console.log(this.value);
  // }


  ngOnDestroy(): void {
    console.log("OnDestroy");
  }



}
