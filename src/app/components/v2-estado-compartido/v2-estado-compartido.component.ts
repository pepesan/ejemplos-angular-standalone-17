import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContadorControlesComponent } from './contador-controles.component';
import { ContadorResumenComponent } from './contador-resumen.component';

@Component({
  selector: 'app-v2-estado-compartido',
  imports: [ContadorControlesComponent, ContadorResumenComponent],
  templateUrl: './v2-estado-compartido.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2EstadoCompartidoComponent {}
