import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL, ErrorApi, UsuariosApiService } from './usuarios-api.service';

describe('UsuariosApiService', () => {
  let servicio: UsuariosApiService;
  let http: HttpTestingController;
  const consulta = { q: '', page: 1, size: 5, sort: 'id' as const, dir: 'asc' as const };
  const nuevo = { nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' as const };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(UsuariosApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('usa la URL base inyectable y envía filtro, orden y paginación como parámetros', () => {
    servicio.listar({ q: 'ana', page: 2, size: 10, sort: 'nombre', dir: 'desc' }).subscribe();
    const peticion = http.expectOne((r) => r.url === '/api/usuarios');
    expect(peticion.request.method).toBe('GET');
    expect(peticion.request.params.get('q')).toBe('ana');
    expect(peticion.request.params.get('page')).toBe('2');
    expect(peticion.request.params.get('size')).toBe('10');
    expect(peticion.request.params.get('sort')).toBe('nombre');
    expect(peticion.request.params.get('dir')).toBe('desc');
    peticion.flush({ items: [], total: 0, page: 2, size: 10 });
  });

  it('no envía q cuando el filtro está vacío', () => {
    servicio.listar({ q: '', page: 1, size: 5, sort: 'id', dir: 'asc' }).subscribe();
    const peticion = http.expectOne((r) => r.url === '/api/usuarios');
    expect(peticion.request.params.has('q')).toBe(false);
    peticion.flush({ items: [], total: 0, page: 1, size: 5 });
  });

  it('permite cambiar la URL base con el token', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_BASE_URL, useValue: 'https://api.test' }],
    });
    TestBed.inject(UsuariosApiService).listar(consulta).subscribe();
    TestBed.inject(HttpTestingController).expectOne((r) => r.url === 'https://api.test/usuarios').flush({ items: [], total: 0, page: 1, size: 5 });
  });

  it('crea, actualiza y elimina con el método HTTP y la URL correctos', () => {
    servicio.crear(nuevo).subscribe();
    const post = http.expectOne('/api/usuarios');
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual(nuevo);
    post.flush({ id: 4, ...nuevo }, { status: 201, statusText: 'Created' });

    servicio.actualizar(4, nuevo).subscribe();
    const put = http.expectOne('/api/usuarios/4');
    expect(put.request.method).toBe('PUT');
    put.flush({ id: 4, ...nuevo });

    servicio.eliminar(4).subscribe();
    const borrado = http.expectOne('/api/usuarios/4');
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('traduce un 409 a ErrorApi con el mensaje y los errores por campo', () => {
    let error: ErrorApi | undefined;
    servicio.crear(nuevo).subscribe({ error: (e) => (error = e) });
    http.expectOne('/api/usuarios').flush(
      { message: 'Ya existe un usuario con ese email.', errores: { email: 'Ese email ya está en uso.' } },
      { status: 409, statusText: 'Conflict' },
    );
    expect(error).toBeInstanceOf(ErrorApi);
    expect(error?.estado).toBe(409);
    expect(error?.message).toBe('Ya existe un usuario con ese email.');
    expect(error?.errores.email).toBe('Ese email ya está en uso.');
  });

  it('traduce un fallo de red y un 500 a mensajes legibles', () => {
    const mensajes: string[] = [];
    servicio.listar(consulta).subscribe({ error: (e: ErrorApi) => mensajes.push(e.message) });
    http.expectOne((r) => r.url === '/api/usuarios').error(new ProgressEvent('error'));
    servicio.listar(consulta).subscribe({ error: (e: ErrorApi) => mensajes.push(e.message) });
    http.expectOne((r) => r.url === '/api/usuarios').flush('x', { status: 500, statusText: 'Server Error' });
    expect(mensajes[0]).toContain('No hay conexión');
    expect(mensajes[1]).toContain('El servidor ha fallado');
  });
});
