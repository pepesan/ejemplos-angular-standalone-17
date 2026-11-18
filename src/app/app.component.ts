import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './services/theme/theme.service';
import { ApiErrorService } from './services/api-error.service';
import { LastVisitedRouteService } from './services/last-visited-route.service';
import { NavGroup, TEMARIO_UNITS } from './navigation/temario-menu';
import { SiteHeaderComponent } from './navigation/site-header/site-header.component';
import { FuenteEjemploComponent } from './navigation/fuente-ejemplo/fuente-ejemplo.component';
import { TemarioMobileMenuComponent } from './navigation/temario-mobile-menu/temario-mobile-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, NgbModule, SiteHeaderComponent, TemarioMobileMenuComponent, FuenteEjemploComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'proyecto';

  readonly themeService = inject(ThemeService);
  readonly apiErrorService = inject(ApiErrorService);
  private readonly router = inject(Router);
  private readonly lastVisitedRoute = inject(LastVisitedRouteService);
  readonly menuOpen = signal(false);

  readonly temarioUnits = TEMARIO_UNITS;
  readonly activeTemarioUnitId = signal(TEMARIO_UNITS[0].id);
  readonly activeTemarioUnit = computed(() =>
    TEMARIO_UNITS.find((unit) => unit.id === this.activeTemarioUnitId()) ?? TEMARIO_UNITS[0],
  );

  constructor() {
    this.selectTemarioUnitForRoute(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.lastVisitedRoute.rememberRoute(event.urlAfterRedirects);
        this.selectTemarioUnitForRoute(event.urlAfterRedirects);
      }
    });
  }

  private selectTemarioUnitForRoute(url: string): void {
    const currentPath = url.split(/[?#]/, 1)[0];
    const matchingUnit = TEMARIO_UNITS.find((unit) =>
      unit.items.some(({ path }) => {
        const itemPath = path.split(/[?#]/, 1)[0];
        return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
      }),
    );

    if (matchingUnit) {
      this.activeTemarioUnitId.set(matchingUnit.id);
    }
  }

  selectTemarioUnit(unit: NavGroup): void {
    this.activeTemarioUnitId.set(unit.id);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
