import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListadoService {
  items: any[]
  constructor() {
    this.items = [
        { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];
  }
  getById(id: number) {
    return this.items.find(item => item.id === id);
  }
}
