import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './services/theme/theme.service';

interface NavLink {
  path: string;
  label: string;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavLink[];
}

const V1_LINKS: NavLink[] = [
  { path: '/props', label: 'Propiedades y binding' },
  { path: '/directivas', label: 'Directivas' },
  { path: '/pipes', label: 'Pipes' },
  { path: '/ciclo', label: 'Ciclo de vida' },
  { path: '/events', label: 'Eventos' },
  { path: '/service', label: 'Servicios y observables' },
  { path: '/partidos', label: 'HTTP · partidos' },
  { path: '/form', label: 'Formularios básicos' },
  { path: '/form-radios', label: 'Formularios con radios' },
  { path: '/reactivos', label: 'Formularios reactivos' },
  { path: '/nav', label: 'Navegación' },
  { path: '/subrutas', label: 'Rutas hijas' },
  { path: '/lazy', label: 'Módulo con carga diferida' },
];

const V1_EXERCISES: NavLink[] = [
  { path: '/ejercicio-componente', label: 'Componentes' },
  { path: '/ejercicio-misclientes', label: 'Listado de clientes' },
  { path: '/ejercicio-condicionales', label: 'Condicionales' },
  { path: '/ejercicio-input', label: 'Inputs' },
  { path: '/ejercicio-tuberias', label: 'Pipes' },
  { path: '/ejercicio-servicios', label: 'Servicios' },
  { path: '/ejercicio-resultado', label: 'HTTP' },
  { path: '/ejercicio-eventos', label: 'Eventos' },
  { path: '/ejercicio-formulario', label: 'Formularios' },
  { path: '/ejercicio-formulario-reactivo', label: 'Formularios reactivos' },
];

const V2_LINKS: NavLink[] = [
  { path: '/v2/signal-forms', label: 'Signal Forms' },
  { path: '/v2/formulario-tipado', label: 'Formulario reactivo tipado' },
  { path: '/v2/consumo-api', label: 'Consumo de API' },
  { path: '/v2/estado', label: 'Rendimiento y estado' },
  { path: '/v2/accesibilidad', label: 'Accesibilidad y calidad' },
  { path: '/v2/rutas', label: 'Routing moderno' },
  { path: '/v2/busqueda-reactiva', label: 'Búsqueda reactiva' },
  { path: '/v2/i18n', label: 'Internacionalización' },
  { path: '/v2/seguridad', label: 'Seguridad en plantillas' },
  { path: '/control-flow', label: 'Control flow integrado' },
  { path: '/signals', label: 'Signals' },
  { path: '/signals-input', label: 'Inputs con Signals' },
  { path: '/signals-model', label: 'Model y two-way binding' },
  { path: '/signals-queries', label: 'Queries con Signals' },
  { path: '/signals-effect', label: 'Effects' },
  { path: '/todos', label: 'Lista de tareas' },
  { path: '/ejercicio-signals', label: 'Ejercicio de Signals' },
];

@Component({
  selector: 'app-root',
  imports: [RouterModule, NgbModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'proyecto';

  readonly themeService = inject(ThemeService);
  readonly menuOpen = signal(false);

  readonly v1Group: NavGroup = {
    id: 'v1',
    label: 'V1 · Clásicos',
    items: V1_LINKS,
  };

  readonly v1Exercises: NavGroup = {
    id: 'v1-exercises',
    label: 'Ejercicios V1',
    items: V1_EXERCISES,
  };

  readonly v2Group: NavGroup = {
    id: 'v2',
    label: 'V2 · Angular moderno',
    items: V2_LINKS,
  };

  readonly groups: NavGroup[] = [this.v1Group, this.v1Exercises, this.v2Group];

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
