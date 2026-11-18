import { ChangeDetectionStrategy, Component } from '@angular/core';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-fundamentos',
  standalone: true,
  templateUrl: './v2-fundamentos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2FundamentosComponent {}
