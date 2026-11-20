import { email, required, schema, type Schema, type SchemaFn } from '@angular/forms/signals';

/** Modelo del formulario de contacto. `empresa` es opcional: ninguna regla la valida. */
export interface Contacto { nombre: string; correo: string; empresa: string; }

/** Valor inicial del modelo. Se copia al crear el signal para no compartir el objeto entre instancias. */
export const CONTACTO_VACIO: Contacto = { nombre: '', correo: '', empresa: '' };

/**
 * Las reglas de validación, SEPARADAS de los campos: `schema()` devuelve un esquema reutilizable que se pasa a
 * `form(modelo, esquema)`. La función que recibe no es reactiva: solo declara reglas sobre las rutas del modelo.
 * Al vivir fuera del componente, el mismo esquema se puede compartir con otros formularios y probar por sí solo.
 */
export const contactoSchema: Schema<Contacto> = schema<Contacto>((ruta) => {
  required(ruta.nombre, { message: 'Escribe tu nombre.' });
  required(ruta.correo, { message: 'Escribe tu correo.' });
  email(ruta.correo, { message: 'Introduce un correo válido.' });
  // `ruta.empresa` no aparece: el campo existe en el modelo, pero no tiene reglas.
});

/**
 * Otra forma de definir lo mismo: una función `SchemaFn<Contacto>` suelta, sin `schema()`. `form()` acepta
 * las dos (`form(modelo, contactoSchema)` o `form(modelo, contactoSchemaFn)`) y las reglas son idénticas.
 * La diferencia: `schema()` crea un objeto reutilizable con identidad propia; la función es la forma en línea,
 * declarada aparte.
 */
export const contactoSchemaFn: SchemaFn<Contacto> = (ruta) => {
  required(ruta.nombre, { message: 'Escribe tu nombre.' });
  required(ruta.correo, { message: 'Escribe tu correo.' });
  email(ruta.correo, { message: 'Introduce un correo válido.' });
};
