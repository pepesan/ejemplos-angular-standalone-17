const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

When('pulso el botón {string}', async function (nombre) {
  await this.page.getByRole('button', { name: nombre, exact: true }).click();
});

Then('veo el texto {string}', async function (texto) {
  await this.page.getByText(texto).first().waitFor({ state: 'visible' });
});

// Cada tarjeta del ejemplo de @Injectable lleva su botón «Incrementar desde X»: se localiza por él.
async function tarjeta(page, letra) {
  return page
    .locator('section, article, div')
    .filter({ has: page.getByRole('button', { name: `Incrementar desde ${letra}`, exact: true }) })
    .last();
}

Then('el componente {string} muestra {string} e {string}', async function (letra, valor, instancia) {
  const zona = await tarjeta(this.page, letra);
  await zona.getByText(valor).waitFor({ state: 'visible' });
  await zona.getByText(instancia).waitFor({ state: 'visible' });
});

// --- CRUD de usuarios: el backend se simula en el navegador para que el escenario sea autónomo ---
Given('que el backend de usuarios responde con datos de ejemplo', async function () {
  let siguienteId = 3;
  const usuarios = [
    { id: 1, nombre: 'Ana López', email: 'ana@example.com', rol: 'profesor' },
    { id: 2, nombre: 'Luis Pérez', email: 'luis@example.com', rol: 'alumno' },
  ];
  await this.page.route('**/api/auth/login', async (ruta) => {
    const { username } = ruta.request().postDataJSON();
    this.rol = username === 'admin' ? 'admin' : 'student';
    await ruta.fulfill({ json: { tokenType: 'Bearer', accessToken: 'jwt-de-ejemplo', expiresInSeconds: 900 } });
  });
  await this.page.route('**/api/auth/profile', (ruta) =>
    ruta.fulfill({ json: { id: 'x', name: 'Persona de ejemplo', role: this.rol } }),
  );
  await this.page.route('**/api/usuarios**', async (ruta) => {
    const peticion = ruta.request();
    if (peticion.method() === 'POST') {
      const nuevo = { id: siguienteId++, ...peticion.postDataJSON() };
      usuarios.push(nuevo);
      return ruta.fulfill({ status: 201, json: nuevo });
    }
    return ruta.fulfill({ json: { items: usuarios, total: usuarios.length, page: 1, size: 5 } });
  });
});

When('inicio sesión como {string}', async function (usuario) {
  await this.page.getByLabel('Usuario', { exact: true }).fill(usuario);
  await this.page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await this.page.getByText('Sesión:').waitFor({ state: 'visible' });
});

When('completo el modal con nombre {string} y email {string}', async function (nombre, email) {
  const dialogo = this.page.getByRole('dialog');
  await dialogo.getByLabel('Nombre', { exact: true }).fill(nombre);
  await dialogo.getByLabel('Email', { exact: true }).fill(email);
  await dialogo.getByRole('button', { name: 'Crear usuario', exact: true }).click();
});

Then('veo el usuario {string} en la lista', async function (nombre) {
  const fila = this.page.locator('tbody tr').filter({ hasText: nombre }).first();
  await fila.waitFor({ state: 'visible' });
});

Then('veo el aviso {string}', async function (texto) {
  await this.page.getByText(texto).first().waitFor({ state: 'visible' });
});

Then('no veo el botón {string}', async function (nombre) {
  assert.equal(await this.page.getByRole('button', { name: nombre, exact: true }).count(), 0);
});
