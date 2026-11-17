import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavGroup } from '../temario-menu';

/**
 * Acordeón del temario para el menú móvil (offcanvas).
 * Emite `linkSelect` al pulsar un ejemplo para que el padre cierre el menú.
 */
@Component({
  selector: 'app-temario-mobile-menu',
  imports: [RouterModule],
  templateUrl: './temario-mobile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemarioMobileMenuComponent {
  readonly units = input.required<NavGroup[]>();
  readonly linkSelect = output<void>();
}
