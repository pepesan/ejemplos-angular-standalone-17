import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  constructor(private router: Router) {}

  viewItemDetails(item: any) {
    this.router.navigate(['/list', item.id]);  // Navigate with item ID
  }
}
