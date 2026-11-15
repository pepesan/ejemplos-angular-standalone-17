import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

import {ListadoService} from "../../services/listado.service";
@Component({
    selector: 'app-listado',
    imports: [
    RouterLink,
    RouterLinkActive
],
    templateUrl: './listado.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
