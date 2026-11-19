export const ROLES = ['alumno', 'profesor', 'admin'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida el cuerpo y devuelve `{ datos }` limpios o `{ errores }` con un mensaje por campo. */
export function validarUsuario(cuerpo) {
  const errores = {};
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email.trim() : '';
  const rol = cuerpo?.rol;
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'El nombre debe tener entre 2 y 80 caracteres.';
  if (!EMAIL.test(email) || email.length > 120) errores.email = 'El email no es válido.';
  if (!ROLES.includes(rol)) errores.rol = `El rol debe ser uno de: ${ROLES.join(', ')}.`;
  return Object.keys(errores).length ? { errores } : { datos: { nombre, email, rol } };
}
