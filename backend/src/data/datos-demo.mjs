/** Datos fijos de la demo (no son usuarios de la base de datos). Contraseña común de las cuentas: `angular`. */
export const CLAVE_DEMO = 'angular';

export const CUENTAS_DEMO = {
  alumno: { sub: 'alumno-1', name: 'Alumno de demostración', role: 'student' },
  admin: { sub: 'admin-1', name: 'Administrador de demostración', role: 'admin' },
};

export const RESULTADOS_DEMO = [
  { nombre: 'Angular', dipu: 8, imagen: '' },
  { nombre: 'TypeScript', dipu: 5, imagen: '' },
  { nombre: 'RxJS', dipu: 3, imagen: '' },
];

export const CURSOS_DEMO = [
  { id: 1, nombre: 'Angular moderno' },
  { id: 2, nombre: 'Routing y Guards' },
  { id: 3, nombre: 'Servicios HTTP y JWT' },
  { id: 4, nombre: 'Signals y RxJS' },
];

/** Nombres de los 23 usuarios de ejemplo de la base de datos (ver `database/semilla.mjs`). */
export const NOMBRES_SEMILLA = ['Ana López', 'Luis Pérez', 'Marta Ruiz', 'Carlos Gil', 'Elena Mora', 'Pablo Sanz', 'Lucía Vega',
  'Diego Ríos', 'Sara Núñez', 'Jorge Cano', 'Irene Prado', 'Hugo Lara', 'Julia Ortega', 'Raúl Soto',
  'Nuria Campos', 'Álvaro Pino', 'Clara Rey', 'Mario Vidal', 'Laura Bravo', 'Iván Herrera',
  'Paula Marín', 'Sergio Cruz', 'Alba Crespo'];
