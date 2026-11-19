import { NOMBRES_SEMILLA } from '../data/datos-demo.mjs';
import { ROLES } from '../validators/usuario.validator.mjs';

/** Email de ejemplo a partir del primer nombre, sin tildes: «Ana López» → ana@example.com. */
const emailDe = (nombre) =>
  `${nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ')[0].toLowerCase()}@example.com`;

/** Inserta los usuarios de ejemplo a través del repositorio (los roles se reparten en rotación). */
export function sembrarUsuarios(repositorio) {
  NOMBRES_SEMILLA.forEach((nombre, i) => repositorio.crear({ nombre, email: emailDe(nombre), rol: ROLES[i % ROLES.length] }));
}
