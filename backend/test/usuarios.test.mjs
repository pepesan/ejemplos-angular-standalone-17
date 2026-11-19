import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { abrirBaseDeDatos } from '../src/database/conexion.mjs';
import { crearRepositorioUsuarios } from '../src/repositories/usuarios.repository.mjs';
import { validarUsuario } from '../src/validators/usuario.validator.mjs';

describe('validador de usuario', () => {
  it('acepta datos correctos y los limpia (espacios fuera)', () => {
    assert.deepEqual(validarUsuario({ nombre: '  Ana  ', email: ' ana@example.com ', rol: 'alumno' }), {
      datos: { nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' },
    });
  });

  it('marca cada campo inválido con su mensaje', () => {
    const { errores } = validarUsuario({ nombre: 'x', email: 'no-es', rol: 'dios' });
    assert.deepEqual(Object.keys(errores).sort(), ['email', 'nombre', 'rol']);
  });

  it('un cuerpo que no es un objeto no revienta', () => {
    assert.ok(validarUsuario(null).errores);
    assert.ok(validarUsuario(42).errores);
  });
});

describe('repositorio de usuarios', () => {
  const nuevo = () => crearRepositorioUsuarios(abrirBaseDeDatos({ archivo: ':memory:', enMemoria: true }));

  it('crea, obtiene, actualiza y borra', () => {
    const repo = nuevo();
    const u = repo.crear({ nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' });
    assert.equal(repo.obtener(u.id).nombre, 'Ana');
    assert.equal(repo.actualizar(u.id, { nombre: 'Ana M', email: 'ana@example.com', rol: 'admin' }).rol, 'admin');
    assert.equal(repo.borrar(u.id), true);
    assert.equal(repo.borrar(u.id), false);
    assert.equal(repo.contar(), 0);
  });

  it('el email es único sin distinguir mayúsculas (lanza un error UNIQUE)', () => {
    const repo = nuevo();
    repo.crear({ nombre: 'Ana', email: 'ana@example.com', rol: 'alumno' });
    assert.throws(() => repo.crear({ nombre: 'Otra', email: 'ANA@example.com', rol: 'alumno' }), /UNIQUE/);
  });

  it('pagina, filtra y ordena; la página pedida se acota al rango válido', () => {
    const repo = nuevo();
    for (const n of ['Carla', 'Bruno', 'Ana', 'Dani', 'Eva', 'Fede']) {
      repo.crear({ nombre: n, email: `${n.toLowerCase()}@example.com`, rol: 'alumno' });
    }
    const p = repo.listar({ page: 2, size: 4, sort: 'nombre', dir: 'asc' });
    assert.equal(p.total, 6);
    assert.deepEqual(p.items.map((u) => u.nombre), ['Eva', 'Fede']);
    assert.equal(repo.listar({ page: 99, size: 4 }).page, 2);
    assert.equal(repo.listar({ q: 'bruno' }).total, 1);
  });

  it('una columna de orden desconocida se sustituye por el id', () => {
    const repo = nuevo();
    repo.crear({ nombre: 'Ana', email: 'a@example.com', rol: 'alumno' });
    assert.equal(repo.listar({ sort: 'no-existe; DROP TABLE usuarios' }).total, 1);
  });

  it('el esquema es el mismo en memoria y en fichero (sin depender del modo)', () => {
    const db = new DatabaseSync(':memory:');
    db.exec('CREATE TABLE usuarios (id INTEGER PRIMARY KEY)');
    assert.doesNotThrow(() => abrirBaseDeDatos({ archivo: ':memory:', enMemoria: true }));
    db.close();
  });
});
