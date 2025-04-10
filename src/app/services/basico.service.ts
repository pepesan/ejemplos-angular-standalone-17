import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasicoService {

  public propiedad: string;

  constructor() {
    console.log('BasicoService cargado');
    this.propiedad = "Valor";
  }

  getData(): string{
    return "Dato básico";
  }
}
