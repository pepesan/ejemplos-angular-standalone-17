import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-v2-detalle-ruta', standalone: true, imports: [RouterLink],
  template: '<section class="container py-3"><h1>Detalle de ruta</h1><p>Identificador: {{ id }}</p><a routerLink="/v2/rutas">Volver a routing moderno</a></section>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2DetalleRutaComponent {
  readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? 'acceso permitido';
}
