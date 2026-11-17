import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { NavGroup } from '../temario-menu';
import { TemarioDropdownComponent } from '../temario-dropdown/temario-dropdown.component';

/**
 * Cabecera principal: marca, navegación de escritorio, cambio de tema y botón del menú móvil.
 * El estado (unidad activa, menú abierto) lo gestiona el padre; este componente solo emite eventos.
 */
@Component({
  selector: 'app-site-header',
  imports: [RouterModule, TemarioDropdownComponent],
  templateUrl: './site-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  readonly themeService = inject(ThemeService);

  readonly units = input.required<NavGroup[]>();
  readonly activeUnit = input.required<NavGroup>();
  readonly menuOpen = input(false);

  readonly unitSelect = output<NavGroup>();
  readonly menuToggle = output<void>();
}
