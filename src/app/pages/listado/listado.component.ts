import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from "@angular/common";
import {ListadoService} from "../../services/listado.service";
@Component({
    selector: 'app-listado',
    imports: [
        NgForOf,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './listado.component.html',
    styleUrl: './listado.component.css'
})
export class ListadoComponent {

  items: any[]
  constructor(
    private router: Router,
    private listadoService: ListadoService
  ) {
    this.items = this.listadoService.items
  }

  viewItemDetails(item: any) {
    this.router.navigate(['/list', item.id]);  // Navigate with item ID
  }
}
