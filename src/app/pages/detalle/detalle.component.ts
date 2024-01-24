import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent {

  itemId: string | null;

  constructor(private route: ActivatedRoute) {
    this.itemId  = "";
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');  // Get ID from route
  }

}
