import { ChangeDetectionStrategy, Component, DestroyRef, InjectionToken, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FUENTES_EJEMPLO } from './fuentes-ejemplo.generated';
import { ElementoFuente, TipoElemento } from './fuente-ejemplo.tipos';

const ETIQUETAS: Record<TipoElemento, string> = {
  page: 'Page',
  componente: 'Componente',
  pipe: 'Pipe',
  directiva: 'Directiva',
  servicio: 'Servicio',
  guarda: 'Guarda',
  modelo: 'Modelo',
  validador: 'Validador',
  modulo: 'Módulo',
  rutas: 'Rutas',
};

/** Con más elementos que este límite, la lista se pliega y el resto se muestra bajo demanda. */
export const LIMITE_VISIBLES = 5;

/** Mapa fichero principal → elementos. Se puede sustituir (p. ej. en Storybook) para mostrar estados concretos. */
export const MAPA_FUENTES = new InjectionToken<Record<string, ElementoFuente[]>>('MAPA_FUENTES', {
  factory: () => FUENTES_EJEMPLO,
});

/** Recorre la jerarquía de rutas activa y devuelve cada `data.fuente` declarado (sin duplicados). */
export function recogerFuentes(raiz: ActivatedRouteSnapshot): string[] {
  const fuentes: string[] = [];
  let ruta: ActivatedRouteSnapshot | null = raiz;
  while (ruta) {
    const fuente = ruta.routeConfig?.data?.['fuente'];
    if (typeof fuente === 'string' && !fuentes.includes(fuente)) {
      fuentes.push(fuente);
    }
    ruta = ruta.firstChild;
  }
  return fuentes;
}

/**
 * Expande cada fichero principal con los elementos que usa (según el mapa generado con `npm run fuentes`).
 * Si no hay entrada en el mapa, se muestra solo el fichero principal como componente.
 */
export function expandirFuentes(
  fuentes: string[],
  mapa: Record<string, ElementoFuente[]> = FUENTES_EJEMPLO,
): ElementoFuente[] {
  const elementos: ElementoFuente[] = [];
  for (const fuente of fuentes) {
    for (const elemento of mapa[fuente] ?? [{ ruta: fuente, tipo: 'componente' as const }]) {
      if (!elementos.some((existente) => existente.ruta === elemento.ruta)) {
        elementos.push(elemento);
      }
    }
  }
  return elementos;
}

/** Muestra, antes del ejemplo, los ficheros que lo implementan, con una píldora por tipo de elemento. */
@Component({
  selector: 'app-fuente-ejemplo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (elementos().length) {
      <aside class="alert alert-secondary py-2 px-3 small mb-3" aria-labelledby="fuente-ejemplo-titulo">
        <p class="fw-semibold mb-1" id="fuente-ejemplo-titulo">
          {{ elementos().length > 1 ? 'Ficheros del ejemplo' : 'Fichero del ejemplo' }}
        </p>
        <ul class="list-unstyled mb-0 d-flex flex-column gap-1">
          @for (elemento of visibles(); track elemento.ruta) {
            <li class="d-flex flex-wrap align-items-baseline gap-2">
              <span class="pildora" [class]="'pildora pildora--' + elemento.tipo">{{ etiqueta(elemento.tipo) }}</span>
              <code class="text-break">{{ elemento.ruta }}</code>
            </li>
          }
        </ul>
        @if (ocultos() > 0 || expandido()) {
          <button type="button" class="btn btn-link btn-sm p-0 mt-2" [attr.aria-expanded]="expandido()" (click)="alternar()">
            {{ expandido() ? 'Mostrar menos' : 'Mostrar ' + ocultos() + ' más' }}
          </button>
        }
      </aside>
    }
  `,
  styles: `
    .pildora {
      display: inline-block;
      min-width: 6.5rem;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      color: #fff;
      background: var(--pildora-fondo, #475569);
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.4;
      text-align: center;
    }
    .pildora--page { --pildora-fondo: #7c3aed; }
    .pildora--componente { --pildora-fondo: #1d4ed8; }
    .pildora--pipe { --pildora-fondo: #b45309; }
    .pildora--directiva { --pildora-fondo: #0f766e; }
    .pildora--servicio { --pildora-fondo: #be123c; }
    .pildora--guarda { --pildora-fondo: #4d7c0f; }
    .pildora--modelo { --pildora-fondo: #475569; }
    .pildora--validador { --pildora-fondo: #a21caf; }
    .pildora--modulo { --pildora-fondo: #9a3412; }
    .pildora--rutas { --pildora-fondo: #0369a1; }
  `,
})
export class FuenteEjemploComponent {
  private readonly router = inject(Router);
  private readonly mapa = inject(MAPA_FUENTES);
  readonly elementos = signal<ElementoFuente[]>(this.leerElementos());
  readonly expandido = signal(false);
  readonly visibles = computed(() => (this.expandido() ? this.elementos() : this.elementos().slice(0, LIMITE_VISIBLES)));
  readonly ocultos = computed(() => Math.max(0, this.elementos().length - LIMITE_VISIBLES));

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => {
        this.elementos.set(this.leerElementos());
        this.expandido.set(false);
      });
  }

  alternar(): void {
    this.expandido.update((v) => !v);
  }

  etiqueta(tipo: TipoElemento): string {
    return ETIQUETAS[tipo];
  }

  private leerElementos(): ElementoFuente[] {
    return expandirFuentes(recogerFuentes(this.router.routerState.snapshot.root), this.mapa);
  }
}
