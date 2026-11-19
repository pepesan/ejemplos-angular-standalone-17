import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RUTA_BASE } from './ruta-base';

/** Pantalla para una URL de la feature que no existe o un usuario que no existe (resolver con 404). */
@Component({
  selector: 'app-v2-usuarios-no-encontrado',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './usuarios-navegacion.css',
  template: `
    <h2>No encontrado</h2>
    <p>Este usuario o esta pantalla no existe.</p>
    <a class="boton" [routerLink]="base">Volver al listado</a>
  `,
})
export class V2UsuariosNoEncontradoComponent {
  readonly base = RUTA_BASE;
}
