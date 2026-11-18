import { Injectable, Service, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContadorInjectableService } from '../../services/contador-injectable.service';
import { V2ServicioInjectableComponent } from './v2-servicio-injectable.component';

describe('V2ServicioInjectableComponent', () => {
  function crear() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(V2ServicioInjectableComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const tarjeta = (tag: string) => el.querySelector(tag) as HTMLElement;
    const texto = (tag: string) => tarjeta(tag).textContent ?? '';
    const pulsar = (tag: string) => {
      (tarjeta(tag).querySelector('button') as HTMLButtonElement).click();
      fixture.detectChanges();
    };
    const instancia = (tag: string) => /#(\d+)/.exec(texto(tag))![1];
    const valor = (tag: string) => /Valor:\s*(\d+)/.exec(texto(tag))![1];
    return { fixture, pulsar, instancia, valor };
  }

  it('constructor e inject() reciben la MISMA instancia singleton: lo que cambia uno lo ve el otro', () => {
    const { pulsar, instancia, valor } = crear();
    expect(instancia('app-carga-constructor')).toBe(instancia('app-carga-inject'));

    pulsar('app-carga-constructor');
    expect(valor('app-carga-constructor')).toBe('1');
    expect(valor('app-carga-inject')).toBe('1');

    pulsar('app-carga-inject');
    expect(valor('app-carga-constructor')).toBe('2');
    expect(valor('app-carga-inject')).toBe('2');
  });

  it('el componente con providers recibe una instancia distinta e independiente (no singleton)', () => {
    const { pulsar, instancia, valor } = crear();
    expect(instancia('app-carga-propia')).not.toBe(instancia('app-carga-inject'));

    pulsar('app-carga-propia');
    expect(valor('app-carga-propia')).toBe('1');
    expect(valor('app-carga-inject')).toBe('0');
    expect(valor('app-carga-constructor')).toBe('0');
  });

  it('la instancia raíz es la que usan A y B', () => {
    const { fixture, instancia } = crear();
    const raiz = TestBed.inject(ContadorInjectableService);
    expect(String(raiz.id)).toBe(instancia('app-carga-constructor'));
    fixture.destroy();
  });
});

// Comprueba lo que afirma la página sobre los decoradores y las formas de pedir un servicio.
describe('Límites de @Service(), @Injectable() e inject()', () => {
  @Injectable({ providedIn: 'root' })
  class BaseInjectable {
    readonly nombre = 'base';
  }

  @Injectable({ providedIn: 'root' })
  class ConConstructor {
    constructor(readonly base: BaseInjectable) {}
  }

  @Service()
  class ConInject {
    readonly base = inject(BaseInjectable);
  }

  @Injectable()
  class SinProvidedIn {}

  it('@Injectable permite pedir dependencias por constructor', () => {
    expect(TestBed.inject(ConConstructor).base).toBe(TestBed.inject(BaseInjectable));
  });

  it('@Service funciona con inject() y es singleton en la raíz', () => {
    expect(TestBed.inject(ConInject).base).toBe(TestBed.inject(BaseInjectable));
    expect(TestBed.inject(ConInject)).toBe(TestBed.inject(ConInject));
  });

  it('@Injectable() sin providedIn no se registra solo', () => {
    expect(() => TestBed.inject(SinProvidedIn)).toThrow();
  });

  it('inject() fuera de un contexto de inyección lanza un error', () => {
    expect(() => inject(BaseInjectable)).toThrow();
  });
});
