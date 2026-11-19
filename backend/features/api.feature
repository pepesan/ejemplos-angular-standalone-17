# language: es
Característica: API del backend didáctico

  Escenario: El servidor responde a la comprobación de salud
    Cuando hago una petición GET a "/api/health"
    Entonces la respuesta tiene el estado 200
    Y el cuerpo tiene la propiedad "status" con el valor "ok"

  Escenario: Un usuario con credenciales correctas recibe un token
    Cuando inicio sesión como "admin" con la contraseña "angular"
    Entonces la respuesta tiene el estado 200
    Y el cuerpo tiene un token de acceso

  Escenario: Una contraseña incorrecta no inicia sesión
    Cuando inicio sesión como "admin" con la contraseña "otra"
    Entonces la respuesta tiene el estado 401
    Y el error es "invalid_credentials"
    Y el mensaje es "Usuario o contraseña incorrectos."

  Escenario: Sin token no se puede consultar el listado
    Cuando hago una petición GET a "/api/usuarios"
    Entonces la respuesta tiene el estado 401
    Y el error es "unauthorized"

  Escenario: Un alumno puede consultar el listado pero no crear usuarios
    Cuando hago una petición GET a "/api/usuarios" como "alumno"
    Entonces la respuesta tiene el estado 200
    Cuando hago una petición POST a "/api/usuarios" como "alumno" con el cuerpo:
      """
      {"nombre": "Eva Gil", "email": "eva@example.com", "rol": "alumno"}
      """
    Entonces la respuesta tiene el estado 403
    Y el error es "forbidden"

  Escenario: Un administrador crea, edita y borra un usuario
    Cuando hago una petición POST a "/api/usuarios" como "admin" con el cuerpo:
      """
      {"nombre": "Eva Gil", "email": "eva@example.com", "rol": "profesor"}
      """
    Entonces la respuesta tiene el estado 201
    Y el cuerpo tiene la propiedad "nombre" con el valor "Eva Gil"
    Y el total de usuarios es 24
    Cuando hago una petición PUT a "/api/usuarios/24" como "admin" con el cuerpo:
      """
      {"nombre": "Eva Gil Pérez", "email": "eva@example.com", "rol": "admin"}
      """
    Entonces la respuesta tiene el estado 200
    Y el cuerpo tiene la propiedad "rol" con el valor "admin"
    Cuando hago una petición DELETE a "/api/usuarios/24" como "admin"
    Entonces la respuesta tiene el estado 204
    Y el total de usuarios es 23

  Escenario: Un email repetido se rechaza con el error junto al campo
    Cuando hago una petición POST a "/api/usuarios" como "admin" con el cuerpo:
      """
      {"nombre": "Otra Ana", "email": "ANA@example.com", "rol": "alumno"}
      """
    Entonces la respuesta tiene el estado 409
    Y el error es "conflict"
    Y el error del campo "email" es "Ese email ya está en uso."

  Escenario: Los datos inválidos devuelven un mensaje por campo
    Cuando hago una petición POST a "/api/usuarios" como "admin" con el cuerpo:
      """
      {"nombre": "x", "email": "no-es-email", "rol": "dios"}
      """
    Entonces la respuesta tiene el estado 400
    Y el error es "validation"
    Y los errores de validación incluyen "nombre"
    Y los errores de validación incluyen "email"
    Y los errores de validación incluyen "rol"

  Escenario: El listado se filtra y se pagina en el servidor
    Cuando hago una petición GET a "/api/usuarios?q=a&size=2&page=1" como "admin"
    Entonces la respuesta tiene el estado 200
    Y la lista tiene 2 usuarios
    Y el cuerpo tiene la propiedad "size" con el valor "2"

  Escenario: Una ruta que no existe devuelve 404 y un método no admitido devuelve 405
    Cuando hago una petición GET a "/api/no-existe"
    Entonces la respuesta tiene el estado 404
    Cuando hago una petición DELETE a "/api/health"
    Entonces la respuesta tiene el estado 405
    Y la cabecera "allow" vale "GET"

  Escenario: Las respuestas JSON no se cachean y evitan la detección de tipo
    Cuando hago una petición GET a "/api/health"
    Entonces la cabecera "cache-control" vale "no-store"
    Y la cabecera "x-content-type-options" vale "nosniff"

  Escenario: Sin datos de ejemplo la base de datos empieza vacía
    Dado que el servidor arranca sin datos de ejemplo
    Entonces el total de usuarios es 0

  Escenario: Los datos guardados en un fichero sobreviven al reinicio
    Dado que la base de datos está en un fichero
    Cuando hago una petición POST a "/api/usuarios" como "admin" con el cuerpo:
      """
      {"nombre": "Persistente Pérez", "email": "persistente@example.com", "rol": "alumno"}
      """
    Entonces la respuesta tiene el estado 201
    Cuando reinicio el servidor
    Entonces el listado de usuarios incluye a "Persistente Pérez"
    Y el total de usuarios es 24
