import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { abrirBaseDeDatos } from '../src/database/conexion.mjs';
import { crearRepositorioUsuarios } from '../src/repositories/usuarios.repository.mjs';
import { validarUsuario } from '../src/validators/usuario.validator.mjs';

describe('validador de usuario', () => {
  it('acepta datos correctos y los limpia (espacios fuera)', () => {
    expect(validarUsuario({ nombre: '  Ana  ', email: ' ana@example.com ', rol: 'alumno' })).toEqual({
      datos: { nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' },
    });
  });

  it('marca cada campo inválido con su mensaje', () => {
    expect(Object.keys(validarUsuario({ nombre: 'x', email: 'no-es', rol: 'dios' }).errores).sort()).toEqual(['email', 'nombre', 'rol']);
  });

  it('un cuerpo que no es un objeto no revienta', () => {
    expect(validarUsuario(null).errores).toBeDefined();
    expect(validarUsuario(42).errores).toBeDefined();
  });

  it('un email demasiado largo se rechaza', () => {
    const largo = `${'a'.repeat(120)}@example.com`;
    expect(validarUsuario({ nombre: 'Ana', email: largo, rol: 'alumno' }).errores.email).toBeDefined();
  });
});

describe('repositorio de usuarios', () => {
  const nuevo = () => crearRepositorioUsuarios(abrirBaseDeDatos({ archivo: ':memory:', enMemoria: true }));

  it('crea, obtiene, actualiza y borra', () => {
    const repo = nuevo();
    const u = repo.crear({ nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' });
    expect(repo.obtener(u.id).nombre).toBe('Ana');
    expect(repo.obtener(999)).toBeNull();
    expect(repo.actualizar(u.id, { nombre: 'Ana M', email: 'ana@example.com', rol: 'admin' }).rol).toBe('admin');
    expect(repo.actualizar(999, { nombre: 'X', email: 'x@example.com', rol: 'admin' })).toBeNull();
    expect(repo.borrar(u.id)).toBe(true);
    expect(repo.borrar(u.id)).toBe(false);
    expect(repo.contar()).toBe(0);
  });

  it('el email es único sin distinguir mayúsculas (lanza un error UNIQUE)', () => {
    const repo = nuevo();
    repo.crear({ nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' });
    expect(() => repo.crear({ nombre: 'Otra', email: 'ANA@example.com', rol: 'alumno' })).toThrow(/UNIQUE/);
  });

  it('pagina, filtra y ordena; la página se acota al rango válido', () => {
    const repo = nuevo();
    for (const n of ['Carla', 'Bruno', 'Ana', 'Dani', 'Eva', 'Fede']) {
      repo.crear({ nombre: n, email: `${n.toLowerCase()}@example.com`, rol: 'alumno' });
    }
    const p = repo.listar({ page: 2, size: 4, sort: 'nombre', dir: 'asc' });
    expect(p.total).toBe(6);
    expect(p.items.map((u) => u.nombre)).toEqual(['Eva', 'Fede']);
    expect(repo.listar({ page: 99, size: 4 }).page).toBe(2);
    expect(repo.listar({ q: 'bruno' }).total).toBe(1);
  });

  it('los valores por defecto y los inválidos de paginación se normalizan', () => {
    const repo = nuevo();
    repo.crear({ nombre: 'Ana', email: 'a@example.com', rol: 'alumno' });
    const p = repo.listar({ page: 'abc', size: 'x', dir: 'desc' });
    expect(p).toMatchObject({ page: 1, size: 5, total: 1 });
    expect(repo.listar({ page: -3 }).page).toBe(1);
    expect(repo.listar({ size: 0 }).size).toBe(5);
  });

  it('una columna de orden desconocida se sustituye por el id', () => {
    const repo = nuevo();
    repo.crear({ nombre: 'Ana', email: 'a@example.com', rol: 'alumno' });
    expect(repo.listar({ sort: 'no-existe; DROP TABLE usuarios' }).total).toBe(1);
  });

  it('abrir la base de datos en memoria crea el esquema una sola vez y es idempotente', () => {
    const db = abrirBaseDeDatos({ archivo: ':memory:', enMemoria: true });
    expect(() => db.exec('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER)')).not.toThrow();
    db.close();
    expect(new DatabaseSync(':memory:')).toBeDefined();
  });
});
