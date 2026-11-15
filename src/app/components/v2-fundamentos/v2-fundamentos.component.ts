import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-v2-fundamentos',
  standalone: true,
  templateUrl: './v2-fundamentos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2FundamentosComponent {}
