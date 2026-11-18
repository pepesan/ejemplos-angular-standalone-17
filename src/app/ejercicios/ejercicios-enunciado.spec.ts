import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EjercicioCondicionalesComponent } from './ejercicio-condicionales/ejercicio-condicionales.component';
import { EjercicioEventosComponent } from './ejercicio-eventos/ejercicio-eventos.component';
import { EjercicioInputComponent } from './ejercicio-input/ejercicio-input.component';
import { EjercicioListadoComponent } from './ejercicio-listado/ejercicio-listado.component';
import { EjercicioMisClientesComponent } from './ejercicio-mis-clientes/ejercicio-mis-clientes.component';
import { EjercicioResultadoComponent } from './ejercicio-resultado/ejercicio-resultado.component';
import { EjercicioServiciosComponent } from './ejercicio-servicios/ejercicio-servicios.component';
import { EjercicioSignalsComponent } from './ejercicio-signals/ejercicio-signals.component';
import { EjercicioTuberiasComponent } from './ejercicio-tuberias/ejercicio-tuberias.component';
import { FormulariosComponent } from './formularios/formularios.component';
import { FormulariosReactivosComponent } from './formularios-reactivos/formularios-reactivos.component';

const EJERCICIOS: [string, Type<unknown>][] = [
  ['condicionales', EjercicioCondicionalesComponent],
  ['eventos', EjercicioEventosComponent],
  ['input', EjercicioInputComponent],
  ['listado', EjercicioListadoComponent],
  ['mis clientes', EjercicioMisClientesComponent],
  ['resultado', EjercicioResultadoComponent],
  ['servicios', EjercicioServiciosComponent],
  ['signals', EjercicioSignalsComponent],
  ['tuberías', EjercicioTuberiasComponent],
  ['formularios de plantilla', FormulariosComponent],
  ['formularios reactivos', FormulariosReactivosComponent],
];

describe('Ejercicios: enunciado antes de la posible solución', () => {
  for (const [nombre, componente] of EJERCICIOS) {
    it(`el ejercicio de ${nombre} muestra un enunciado y después la solución`, () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(componente);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;

      const enunciado = el.querySelector('.enunciado');
      const solucion = el.querySelector('.solucion');
      expect(enunciado, 'falta el bloque de enunciado').toBeTruthy();
      expect(solucion, 'falta el bloque de solución').toBeTruthy();
      expect(enunciado!.textContent!.trim().length).toBeGreaterThan(80);
      expect(enunciado!.compareDocumentPosition(solucion!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(solucion!.textContent!.trim().length).toBeGreaterThan(0);
    });
  }
});
