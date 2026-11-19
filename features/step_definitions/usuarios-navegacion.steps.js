const assert = require('node:assert/strict');
const { When, Then } = require('@cucumber/cucumber');

// Pasos propios del CRUD con navegación: aquí «Nuevo usuario» y «Editar» son ENLACES (rutas), no botones.
When('pulso el enlace {string}', async function (nombre) {
  await this.page.getByRole('link', { name: nombre, exact: true }).click();
});

When('completo el formulario con nombre {string} y email {string}', async function (nombre, email) {
  await this.page.getByLabel('Nombre', { exact: true }).fill(nombre);
  await this.page.getByLabel('Email', { exact: true }).fill(email);
  await this.page.getByRole('button', { name: 'Crear usuario', exact: true }).click();
});

When('abro directamente la dirección {string}', async function (ruta) {
  // Una recarga completa pierde la sesión (el JWT vive en memoria): es justo lo que prueba el escenario.
  await this.page.goto(ruta);
});

Then('no veo el enlace {string}', async function (nombre) {
  assert.equal(await this.page.getByRole('link', { name: nombre, exact: true }).count(), 0);
});

Then('la dirección contiene {string}', async function (texto) {
  await this.page.waitForURL((url) => url.href.includes(texto));
});
