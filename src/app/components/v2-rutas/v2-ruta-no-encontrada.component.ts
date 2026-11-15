import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v2-ruta-no-encontrada', standalone: true, imports: [RouterLink],
  template: '<section class="container py-3"><h1>Ruta no encontrada</h1><p>Comprueba la URL o vuelve al ejemplo de routing.</p><a routerLink="/v2/rutas">Volver</a></section>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2RutaNoEncontradaComponent {}
