import assert from 'node:assert/strict';
import { join } from 'node:path';
import { Given, Then, When } from '@cucumber/cucumber';

// --- Preparación ---
Given('que el servidor arranca sin datos de ejemplo', async function () {
  this.env.DB_SEED = 'false';
  await this.arrancar();
});

Given('que la base de datos está en un fichero', async function () {
  this.env.DB_FILE = join(this.carpetaTemporal(), 'usuarios.sqlite');
  await this.arrancar();
});

When('reinicio el servidor', async function () {
  await this.arrancar();
});

// --- Peticiones ---
When('hago una petición {word} a {string}', async function (metodo, ruta) {
  await this.peticion(metodo, ruta);
});

When('hago una petición {word} a {string} como {string}', async function (metodo, ruta, usuario) {
  await this.peticion(metodo, ruta, { token: await this.tokenDe(usuario) });
});

When('hago una petición {word} a {string} como {string} con el cuerpo:', async function (metodo, ruta, usuario, cuerpo) {
  await this.peticion(metodo, ruta, { token: await this.tokenDe(usuario), cuerpo: JSON.parse(cuerpo) });
});

When('hago una petición {word} a {string} con el cuerpo:', async function (metodo, ruta, cuerpo) {
  await this.peticion(metodo, ruta, { cuerpo: JSON.parse(cuerpo) });
});

When('inicio sesión como {string} con la contraseña {string}', async function (usuario, clave) {
  await this.peticion('POST', '/api/auth/login', { cuerpo: { username: usuario, password: clave } });
});

// --- Comprobaciones ---
Then('la respuesta tiene el estado {int}', function (estado) {
  assert.equal(this.respuesta.estado, estado, `cuerpo: ${JSON.stringify(this.respuesta.datos)}`);
});

Then('el error es {string}', function (codigo) {
  assert.equal(this.respuesta.datos.error, codigo);
});

Then('el mensaje es {string}', function (mensaje) {
  assert.equal(this.respuesta.datos.message, mensaje);
});

Then('el cuerpo tiene la propiedad {string} con el valor {string}', function (propiedad, valor) {
  assert.equal(String(this.respuesta.datos[propiedad]), valor);
});

Then('el cuerpo tiene un token de acceso', function () {
  assert.equal(this.respuesta.datos.accessToken.split('.').length, 3);
  assert.equal(this.respuesta.datos.expiresInSeconds, 900);
});

Then('el total de usuarios es {int}', async function (total) {
  const token = await this.tokenDe('admin');
  const r = await this.peticion('GET', '/api/usuarios', { token });
  assert.equal(r.datos.total, total);
});

Then('el listado de usuarios incluye a {string}', async function (nombre) {
  const token = await this.tokenDe('admin');
  const r = await this.peticion('GET', `/api/usuarios?q=${encodeURIComponent(nombre)}`, { token });
  assert.ok(r.datos.items.some((u) => u.nombre === nombre), `no aparece ${nombre}`);
});

Then('la lista tiene {int} usuarios', function (cantidad) {
  assert.equal(this.respuesta.datos.items.length, cantidad);
});

Then('los errores de validación incluyen {string}', function (campo) {
  assert.ok(campo in this.respuesta.datos.errores, `faltan errores de ${campo}`);
});

Then('el error del campo {string} es {string}', function (campo, mensaje) {
  assert.equal(this.respuesta.datos.errores[campo], mensaje);
});

Then('la cabecera {string} vale {string}', function (cabecera, valor) {
  assert.equal(this.respuesta.cabeceras.get(cabecera), valor);
});
