import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavGroup } from '../temario-menu';

/**
 * Desplegable de escritorio del temario: a la izquierda las unidades,
 * a la derecha los ejemplos de la unidad activa.
 * El estado de la unidad activa lo gestiona el padre (vía `activeUnit` y `unitSelect`).
 */
@Component({
  selector: 'app-temario-dropdown',
  imports: [RouterModule, NgbModule],
  templateUrl: './temario-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemarioDropdownComponent {
  readonly units = input.required<NavGroup[]>();
  readonly activeUnit = input.required<NavGroup>();
  readonly unitSelect = output<NavGroup>();
}
