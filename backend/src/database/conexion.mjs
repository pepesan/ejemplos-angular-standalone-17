import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/**
 * Abre SQLite. `archivo: ':memory:'` crea una base en memoria; una ruta crea (o reutiliza) un fichero.
 * El esquema se crea si no existe, así que el mismo código sirve para ambos casos.
 */
export function abrirBaseDeDatos({ archivo, enMemoria }) {
  if (!enMemoria) mkdirSync(dirname(archivo), { recursive: true });
  const db = new DatabaseSync(archivo);
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email  TEXT NOT NULL UNIQUE COLLATE NOCASE,
      rol    TEXT NOT NULL CHECK (rol IN ('alumno', 'profesor', 'admin'))
    )
  `);
  return db;
}
