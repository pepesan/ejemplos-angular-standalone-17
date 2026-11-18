import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AvisoApiComponent } from './aviso-api.component';

@Component({
  imports: [AvisoApiComponent],
  template: `
    <app-aviso-api tipo="moderno" titulo="Estable desde Angular 19.">Texto moderno.</app-aviso-api>
    <app-aviso-api tipo="legado" titulo="Enfoque clásico." alternativa="/signals-input" textoAlternativa="ver input()">
      Texto legado.
    </app-aviso-api>
  `,
})
class AnfitrionComponent {}

describe('AvisoApiComponent', () => {
  it('distingue el aviso moderno del legado y enlaza a la alternativa solo en el legado', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.detectChanges();
    const avisos = fixture.nativeElement.querySelectorAll('aside[role="note"]') as NodeListOf<HTMLElement>;

    expect(avisos.length).toBe(2);
    expect(avisos[0].dataset['tipo']).toBe('moderno');
    expect(avisos[0].textContent).toContain('Estable desde Angular 19.');
    expect(avisos[0].querySelector('a')).toBeNull();
    expect(avisos[1].dataset['tipo']).toBe('legado');
    expect(avisos[1].querySelector('a')?.getAttribute('href')).toBe('/signals-input');
    expect(avisos[1].textContent).toContain('ver input()');
  });
});
