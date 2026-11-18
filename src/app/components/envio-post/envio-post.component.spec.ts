import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { EnvioPostComponent } from './envio-post.component';

describe('EnvioPostComponent', () => {
  const url = 'https://jsonplaceholder.typicode.com/posts';

  function crear() {
    TestBed.configureTestingModule({
      imports: [EnvioPostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(EnvioPostComponent);
    fixture.detectChanges();
    return { fixture, http: TestBed.inject(HttpTestingController) };
  }

  it('envía un POST al pulsar el botón y muestra la respuesta', async () => {
    const { fixture, http } = crear();
    fixture.nativeElement.querySelector('button').click();
    const peticion = http.expectOne(url);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ title: 'Hola', body: 'Mi primer POST desde Angular', userId: 1 });
    peticion.flush({ title: 'Hola', body: 'Mi primer POST desde Angular', userId: 1, id: 101 });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('pre').textContent).toContain('"id": 101');
  });

  it('muestra un error si el POST falla', async () => {
    const { fixture, http } = crear();
    fixture.nativeElement.querySelector('button').click();
    http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se pudo enviar');
  });
});
