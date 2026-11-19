import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { After, Before, World, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { arrancar, tokenDe } from '../../test/ayudas.mjs';

setDefaultTimeout(15_000);

/**
 * Estado de cada escenario. Cada escenario arranca su PROPIO servidor con base de datos en memoria y datos de
 * ejemplo, así no se contaminan entre sí. Los pasos pueden reiniciarlo con otra configuración.
 */
class MundoBackend extends World {
  constructor(opciones) {
    super(opciones);
    this.env = {};
    this.app = null;
    this.base = null;
    this.tokens = {};
    this.respuesta = null;
    this.carpetas = [];
  }

  /** Arranca (o reinicia) el servidor con la configuración actual de `this.env`. */
  async arrancar() {
    await this.cerrarServidor();
    const app = await arrancar({ env: this.env });
    this.app = app;
    this.base = app.base;
    this.tokens = {};
    return app;
  }

  async cerrarServidor() {
    if (this.app) await this.app.cerrar();
    this.app = null;
  }

  /** Carpeta temporal para una base de datos en fichero; se borra al terminar el escenario. */
  carpetaTemporal() {
    const carpeta = mkdtempSync(join(tmpdir(), 'backend-bdd-'));
    this.carpetas.push(carpeta);
    return carpeta;
  }

  /** Hace una petición HTTP y guarda la respuesta (estado y cuerpo JSON cuando lo hay). */
  async peticion(metodo, ruta, { token, cuerpo } = {}) {
    const respuesta = await fetch(`${this.base}${ruta}`, {
      method: metodo,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(cuerpo !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      body: cuerpo !== undefined ? (typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo)) : undefined,
    });
    const texto = await respuesta.text();
    let datos = null;
    try {
      datos = texto ? JSON.parse(texto) : null;
    } catch {
      datos = texto;
    }
    this.respuesta = { estado: respuesta.status, datos, cabeceras: respuesta.headers };
    return this.respuesta;
  }

  async tokenDe(usuario) {
    if (!this.tokens[usuario]) this.tokens[usuario] = await tokenDe(this.base, usuario);
    return this.tokens[usuario];
  }
}

setWorldConstructor(MundoBackend);

Before(async function () {
  await this.arrancar();
});

After(async function () {
  await this.cerrarServidor();
  for (const carpeta of this.carpetas) rmSync(carpeta, { recursive: true, force: true });
});
