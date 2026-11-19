import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Aviso para el alumno cuando el backend didáctico no está arrancado. Es presentacional: solo recibe un
 * `input()` y emite un `output()`; la pantalla que lo usa decide cuándo mostrarlo.
 */
@Component({
  selector: 'app-aviso-sin-backend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './usuarios-navegacion.css',
  template: `
    <div class="nota" role="alert">
      <p><strong>No hay conexión con el backend.</strong> Este ejemplo necesita el servidor didáctico local.</p>
      <p>Ábrelo en otra terminal con <code>npm run backend</code> (escucha en el puerto 3001) y vuelve a intentarlo.</p>
      @if (reintentable()) {
        <button class="boton" type="button" (click)="reintentar.emit()">Reintentar</button>
      }
    </div>
  `,
})
export class AvisoSinBackendComponent {
  /** Muestra el botón «Reintentar» (solo tiene sentido donde se puede repetir la acción sin escribir nada). */
  readonly reintentable = input(false);
  readonly reintentar = output<void>();
}
