import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { Usuario } from '../../services/usuarios-api.service';

/**
 * Modal de confirmación de borrado con `<dialog>` nativo. Es presentacional: se abre cuando `usuario` tiene valor y
 * avisa con `confirmar` / `cancelar`; quien lo usa hace la petición y le devuelve `eliminando` y `error`.
 * `showModal()` ya da lo que un modal accesible necesita: atrapa el foco, se cierra con Esc, bloquea el resto de la
 * página y al cerrarse devuelve el foco al botón que lo abrió.
 */
@Component({
  selector: 'app-confirmar-borrado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './usuarios-navegacion.css',
  template: `
    <dialog #dialogo class="dlg" aria-labelledby="borrar-titulo" (close)="cancelar.emit()">
      <div class="dlg-form">
        <header class="dlg-cabecera">
          <h2 id="borrar-titulo">Eliminar usuario</h2>
        </header>
        @if (usuario(); as u) {
          <p>¿Eliminar a <strong>{{ u.nombre }}</strong> ({{ u.email }})? Esta acción no se puede deshacer.</p>
        }
        @if (error(); as mensaje) { <p class="error" role="alert">{{ mensaje }}</p> }
        <div class="acciones">
          <button class="boton peligro" type="button" [disabled]="eliminando()" (click)="confirmar.emit()">
            {{ eliminando() ? 'Eliminando…' : 'Eliminar' }}
          </button>
          <button class="boton" type="button" autofocus [disabled]="eliminando()" (click)="cancelar.emit()">Cancelar</button>
        </div>
      </div>
    </dialog>
  `,
})
export class ConfirmarBorradoComponent {
  readonly usuario = input<Usuario | null>(null);
  readonly eliminando = input(false);
  readonly error = input<string | null>(null);
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    // `effect` para sincronizar con una API imperativa del DOM (abrir/cerrar el `<dialog>`): es su caso de uso.
    // (Para valores DERIVADOS de otras signals se usa `computed`, no `effect`.)
    effect(() => {
      const dialogo = this.dialogo().nativeElement;
      const debeEstarAbierto = this.usuario() !== null;
      if (debeEstarAbierto && !dialogo.open) {
        if (dialogo.showModal) dialogo.showModal();
        else dialogo.setAttribute('open', ''); // DOM de pruebas sin soporte de <dialog>
      } else if (!debeEstarAbierto && dialogo.open) {
        if (dialogo.close) dialogo.close();
        else dialogo.removeAttribute('open');
      }
    });
  }
}
