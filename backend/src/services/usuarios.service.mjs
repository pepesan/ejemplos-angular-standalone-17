import { conflicto, noEncontrado, validacion } from '../errores.mjs';
import { validarUsuario } from '../validators/usuario.validator.mjs';

/**
 * Reglas del CRUD de usuarios: validar, comprobar que existe y traducir el «email repetido» de la base de datos a
 * un 409 con el error del campo. Los controladores no conocen SQL ni validaciones.
 */
export function crearUsuariosService({ repositorio }) {
  const traducirDuplicado = (operacion) => {
    try {
      return operacion();
    } catch (error) {
      if (String(error?.message).includes('UNIQUE')) {
        throw conflicto('Ya existe un usuario con ese email.', { email: 'Ese email ya está en uso.' });
      }
      throw error;
    }
  };

  const existente = (id) => {
    const usuario = repositorio.obtener(id);
    if (!usuario) throw noEncontrado('No existe ese usuario.');
    return usuario;
  };

  const validados = (cuerpo) => {
    const { datos, errores } = validarUsuario(cuerpo);
    if (errores) throw validacion(errores);
    return datos;
  };

  return {
    listar: (consulta) => repositorio.listar(consulta),
    obtener: (id) => existente(id),
    crear: (cuerpo) => traducirDuplicado(() => repositorio.crear(validados(cuerpo))),
    actualizar(id, cuerpo) {
      // Orden: primero los datos (400), después la existencia (404), al final la escritura (409 si el email choca).
      const datos = validados(cuerpo);
      existente(id);
      return traducirDuplicado(() => repositorio.actualizar(id, datos));
    },
    borrar(id) {
      if (!repositorio.borrar(id)) throw noEncontrado('No existe ese usuario.');
    },
  };
}
