import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { V2BusquedaComponent } from './v2-busqueda.component';

describe('V2BusquedaComponent', () => {
  it('espera el debounce y presenta los resultados HTTP', async () => {
    TestBed.configureTestingModule({ imports: [V2BusquedaComponent], providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(V2BusquedaComponent);
    fixture.detectChanges();
    fixture.componentInstance.termino.set('angular');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 20));
    http.expectNone('/api/cursos');
    await new Promise((resolve) => setTimeout(resolve, 280));
    http.expectOne((request) => request.url === '/api/cursos' && request.params.get('q') === 'angular')
      .flush([{ id: 1, nombre: 'Angular moderno' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Angular moderno');
    http.verify();
  });

  it('cancela la petición obsoleta al cambiar el término', async () => {
    TestBed.configureTestingModule({ imports: [V2BusquedaComponent], providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(V2BusquedaComponent);
    fixture.detectChanges();
    fixture.componentInstance.termino.set('ang');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 280));
    const anterior = http.expectOne((request) => request.params.get('q') === 'ang');
    fixture.componentInstance.termino.set('angular');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 280));
    expect(anterior.cancelled).toBe(true);
    http.expectOne((request) => request.params.get('q') === 'angular').flush([]);
    http.verify({ ignoreCancelled: true });
  });
});
