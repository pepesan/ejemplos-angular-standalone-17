import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { V2_RUTAS } from './rutas-v2.routes';
import { V2RutasComponent } from './v2-rutas.component';
import { V2DetalleRutaComponent } from './v2-detalle-ruta.component';

describe('rutas V2', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([{ path: 'v2/rutas', children: V2_RUTAS }]),
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('carga la feature y resuelve parámetros', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/v2/rutas');
    expect(harness.routeNativeElement?.textContent).toContain('Routing moderno');
    const navigation = harness.navigateByUrl('/v2/rutas/recurso/42', V2DetalleRutaComponent);
    http.expectOne('/api/recursos/42').flush({ id: '42', title: 'Recurso 42', source: 'backend local' });
    await navigation;
    expect(harness.routeNativeElement?.textContent).toContain('Recurso 42');
  });

  it('redirige el acceso denegado y permite el acceso autorizado', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/v2/rutas/privado');
    expect(harness.routeNativeElement?.textContent).toContain('acceso=permitido');
    await harness.navigateByUrl('/v2/rutas/privado?acceso=permitido', V2DetalleRutaComponent);
    expect(harness.routeNativeElement?.textContent).toContain('acceso permitido');
  });

  it('muestra un estado específico para rutas inexistentes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/v2/rutas/no-existe');
    expect(harness.routeNativeElement?.textContent).toContain('Ruta no encontrada');
  });
});
