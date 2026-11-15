import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-resumen-rendimiento', standalone: true,
  template: '<aside class="alert alert-info" aria-label="Resumen de rendimiento">Este panel se descarga cuando lo solicitas.</aside>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenRendimientoComponent {}
