import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ciclo-de-vida',
  imports: [],
  templateUrl: './ciclo-de-vida.component.html',
  styleUrl: './ciclo-de-vida.component.css'
})
export class CicloDeVidaComponent implements OnInit, OnDestroy{

  public propiedad: string;

  constructor() {
    console.log('Ciclo de vida: constructor');
    this.propiedad = 'partidos';
  }

  ngOnInit(): void {
    console.log('Ciclo de vida: ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Ciclo de vida: ngOnDestroy');
  }

}
