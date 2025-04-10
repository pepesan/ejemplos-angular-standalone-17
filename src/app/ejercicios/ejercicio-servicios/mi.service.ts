import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiService {
  public cadena: string;

  constructor() {
    console.log('MiService');
    this.cadena = 'MiCadena';
  }

  getNumero(): number{
    return 2;
  }
}
