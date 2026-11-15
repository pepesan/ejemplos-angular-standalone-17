import { ChangeDetectionStrategy, Component, computed, inject, signal, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-v2-seguridad', standalone: true,
  templateUrl: './v2-seguridad.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2SeguridadComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly contenido = signal('<strong>Texto introducido</strong><img src=x onerror="alert(1)">');
  readonly htmlSeguro = computed(() => this.sanitizer.sanitize(SecurityContext.HTML, this.contenido()) ?? '');
}
