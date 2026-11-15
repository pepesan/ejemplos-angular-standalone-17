import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v2-editor-ruta',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './v2-editor-ruta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2EditorRutaComponent {
  borrador = '';
  guardado = true;

  actualizarBorrador(value: string): void {
    this.borrador = value;
    this.guardado = false;
  }

  guardar(): void {
    this.guardado = true;
  }

  confirmarSalida(): boolean {
    return this.guardado || window.confirm('Hay cambios sin guardar. ¿Quieres abandonar el editor?');
  }
}
