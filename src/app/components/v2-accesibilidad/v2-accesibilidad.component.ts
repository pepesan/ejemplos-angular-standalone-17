import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-v2-accesibilidad', standalone: true, imports: [FormsModule],
  templateUrl: './v2-accesibilidad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2AccesibilidadComponent {
  enviado = false;
  nombreValue = '';
  guardar(): void { this.enviado = true; }
}
