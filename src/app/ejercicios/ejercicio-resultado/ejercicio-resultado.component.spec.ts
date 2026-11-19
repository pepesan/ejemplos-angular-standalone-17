import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EstadoResultados } from './resultado';
import { EjercicioResultadoComponent } from './ejercicio-resultado.component';
import { ResultadoService } from './resultado.service';

// El componente se prueba con un servicio falso: solo debe pintar el estado que recibe.
function crear(estado: EstadoResultados) {
  TestBed.configureTestingModule({
    imports: [EjercicioResultadoComponent],
    providers: [{ provide: ResultadoService, useValue: { estado: () => of(estado) } }],
  });
  const fixture = TestBed.createComponent(EjercicioResultadoComponent);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('EjercicioResultadoComponent', () => {
  it('pinta nombre, diputados e imagen con texto alternativo', () => {
    const el = crear({ status: 'success', items: [{ nombre: 'PP', dipu: 137, imagen: 'pp.png' }] });
    expect(el.querySelector('.listado-partidos')?.textContent).toContain('PP: 137');
    expect(el.querySelector('.listado-partidos img')?.getAttribute('alt')).toBe('Logo partido PP');
  });

  it('muestra el mensaje de lista vacía', () => {
    expect(crear({ status: 'success', items: [] }).textContent).toContain('No hay resultados disponibles');
  });

  it('muestra un aviso accesible si la petición falla, sin lista', () => {
    const el = crear({ status: 'error', mensaje: 'No se pudieron cargar los resultados.' });
    expect(el.querySelector('.alert[role="alert"]')?.textContent).toContain('No se pudieron cargar');
    expect(el.querySelector('.listado-partidos')).toBeNull();
  });
});
