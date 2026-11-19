import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { EjercicioSignalsComponent } from '../../ejercicios/ejercicio-signals/ejercicio-signals.component';
import { EjercicioInputComponent } from '../../ejercicios/ejercicio-input/ejercicio-input.component';
import { PropsPageComponent } from '../../pages/props-page/props-page.component';
import { SignalsComponent } from '../signals/signals.component';
import { V2AuthComponent } from '../v2-auth/v2-auth.component';
import { V2BusquedaComponent } from '../v2-busqueda/v2-busqueda.component';
import { V2ConsumoApiComponent } from '../v2-consumo-api/v2-consumo-api.component';
import { V2ConsumoApiServicioComponent } from '../v2-consumo-api-servicio/v2-consumo-api-servicio.component';
import { V2EstadoComponent } from '../v2-estado/v2-estado.component';
import { V2FundamentosComponent } from '../v2-fundamentos/v2-fundamentos.component';
import { V2RutasComponent } from '../v2-rutas/v2-rutas.component';
import { V2ServicioSinInjectableComponent } from '../v2-servicio-sin-injectable/v2-servicio-sin-injectable.component';
import { SignalEffectComponent } from '../signal-effect/signal-effect.component';
import { SignalInputPadreComponent } from '../signal-input-padre/signal-input-padre.component';
import { SignalQueriesComponent } from '../signal-queries/signal-queries.component';
import { UseSignalModelComponent } from '../use-signal-model/use-signal-model.component';
import { V2ComunicacionComponent } from '../v2-comunicacion/v2-comunicacion.component';
import { V2SignalFormsComponent } from '../v2-signal-forms/v2-signal-forms.component';

// Cada ejemplo avisa de la disponibilidad de su API (moderna) o de que es el enfoque clásico (legado).
const AVISOS: [string, Type<unknown>, 'moderno' | 'legado', string][] = [
  ['input() (signals)', SignalInputPadreComponent, 'moderno', 'estable desde Angular 19'],
  ['model()', UseSignalModelComponent, 'moderno', 'estable desde Angular 19'],
  ['queries con signals', SignalQueriesComponent, 'moderno', 'estable desde Angular 19'],
  ['effect()', SignalEffectComponent, 'moderno', 'estable desde Angular 20'],
  ['Signal Forms', V2SignalFormsComponent, 'moderno', 'estable desde Angular 22'],
  ['input()/output() frente a @Input/@Output', V2ComunicacionComponent, 'moderno', 'estable desde Angular 19'],
  ['@Service() (22.0)', V2ServicioSinInjectableComponent, 'moderno', 'se introdujo en Angular 22.0'],
  ['@Service() en el servicio de resultados (22.0)', V2ConsumoApiServicioComponent, 'moderno', '@Service() desde Angular 22.0'],
  ['signal()/computed() en estado derivado', V2EstadoComponent, 'moderno', 'estable desde Angular 17'],
  ['introducción a Signals', SignalsComponent, 'moderno', 'estables desde Angular 17'],
  ['ejercicio de Signals', EjercicioSignalsComponent, 'moderno', 'estable desde Angular 17'],
  ['toObservable()/toSignal() en búsqueda', V2BusquedaComponent, 'moderno', 'estable desde Angular 20'],
  ['toSignal() en consumo de API', V2ConsumoApiComponent, 'moderno', 'estable desde Angular 20'],
  ['interceptores funcionales', V2AuthComponent, 'moderno', 'desde Angular 15'],
  ['provideRouter() y guardas funcionales', V2RutasComponent, 'moderno', 'estable desde Angular 15'],
  ['standalone y Eager', V2FundamentosComponent, 'moderno', 'estables desde Angular 15'],
  ['ejercicio de @Input', EjercicioInputComponent, 'legado', 'Desde Angular 19'],
  ['props con @Input', PropsPageComponent, 'legado', 'Desde Angular 19'],
];

describe('Ejemplos: aviso de disponibilidad de la API', () => {
  for (const [nombre, componente, tipo, texto] of AVISOS) {
    it(`${nombre}: muestra un aviso ${tipo}`, () => {
      TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
      const fixture = TestBed.createComponent(componente);
      fixture.detectChanges();
      const aviso = fixture.nativeElement.querySelector(`aside[role="note"][data-tipo="${tipo}"]`) as HTMLElement | null;

      expect(aviso, 'falta el aviso').toBeTruthy();
      expect(aviso!.textContent).toContain(texto);
      // El título del aviso es texto plano: si lleva etiquetas HTML se verían literalmente (p. ej. «<code>»).
      expect(aviso!.textContent).not.toMatch(/<\/?[a-z]+>/i);
      if (tipo === 'legado') {
        expect(aviso!.querySelector('a')?.getAttribute('href')).toBe('/signals-input');
      }
    });
  }
});
