import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { CargaConstructorComponent } from './carga-constructor.component';
import { CargaInjectComponent } from './carga-inject.component';
import { CargaPropiaComponent } from './carga-propia.component';

@Component({
  selector: 'app-v2-servicio-injectable',
  imports: [AvisoApiComponent, RouterLink, CargaConstructorComponent, CargaInjectComponent, CargaPropiaComponent],
  templateUrl: './v2-servicio-injectable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ServicioInjectableComponent {}
