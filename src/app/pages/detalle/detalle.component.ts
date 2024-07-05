import {Component, numberAttribute, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ListadoService} from "../../services/listado.service";
@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit{

  itemId: string | null;
  item: any
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private listadoService: ListadoService
  ) {
    this.itemId  = "";
    this.item = {
      id: 0,
      name: ""
    }
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');  // Get ID from route
    if (this.itemId != null) {
      let number: number = parseInt(this.itemId)
      this.item= this.listadoService.getById(number)
      if (this.item== undefined){
        this.processError();
      }
    }else {
      this.processError();
    }

  }
  processError(){
    // Presentar un error
    this.item = {
      id: 0,
      name: "Not Found"
    }
    // redirigir a un 404 PageNotfound
    // this.router.navigate(['/404']);
    // volver al listado
    // this.salta();

    this.route.params.subscribe(params => {
      console.log(params['id']);
    });
  }

  salta() {
    this.router.navigate(['/list']);
  }

}
