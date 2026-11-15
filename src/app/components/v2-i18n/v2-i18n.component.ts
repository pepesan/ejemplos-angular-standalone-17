import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Idioma = 'es-ES' | 'en-GB';

@Component({
  selector: 'app-v2-i18n', standalone: true,
  templateUrl: './v2-i18n.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2I18nComponent {
  readonly idioma = signal<Idioma>('es-ES');
  readonly idiomaNombre = computed(() => this.idioma() === 'es-ES' ? 'Internacionalización y formatos' : 'Internationalization and formats');
  readonly fecha = new Date('2026-11-15T12:00:00Z');
  readonly precio = 1234.5;
  readonly fechaFormateada = computed(() => new Intl.DateTimeFormat(this.idioma(), { dateStyle: 'long', timeZone: 'UTC' }).format(this.fecha));
  readonly precioFormateado = computed(() => new Intl.NumberFormat(this.idioma(), { style: 'currency', currency: this.idioma() === 'es-ES' ? 'EUR' : 'GBP' }).format(this.precio));

  cambiarIdioma(event: Event): void { this.idioma.set((event.target as HTMLSelectElement).value as Idioma); }
}
