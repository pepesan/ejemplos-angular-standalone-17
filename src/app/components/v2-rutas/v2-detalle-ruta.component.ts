import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface DemoResource { id: string; title: string; source: string; }

@Component({
  selector: 'app-v2-detalle-ruta', standalone: true, imports: [RouterLink],
  template: '<section class="container py-3"><h1>Detalle de ruta</h1>@if (resource) { <p>{{ resource.title }} (id: {{ resource.id }}, desde {{ resource.source }})</p> } @else { <p>Zona privada de demostración: {{ id }}</p> }<a routerLink="/v2/rutas">Volver a routing moderno</a></section>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2DetalleRutaComponent {
  private readonly route = inject(ActivatedRoute);
  readonly resource = this.route.snapshot.data['recurso'] as DemoResource | undefined;
  readonly id = this.route.snapshot.paramMap.get('id') ?? 'miembros';
}
