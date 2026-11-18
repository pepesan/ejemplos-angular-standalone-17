# language: es
Característica: CRUD de usuarios con sesión JWT

  Antecedentes:
    Dado que el backend de usuarios responde con datos de ejemplo
    Y que abro la aplicación
    Y abro "V2 · CRUD de usuarios y buenas prácticas de acceso a la API (@Service desde v22)" desde la unidad "4. Servicios y comunicación HTTP"

  Escenario: Hay que iniciar sesión para ver los usuarios
    Entonces veo el encabezado "Inicia sesión"
    Y no veo el botón "Nuevo usuario"

  Escenario: Un administrador ve la lista y crea un usuario en el modal
    Cuando inicio sesión como "admin"
    Entonces veo el usuario "Ana López" en la lista
    Cuando pulso el botón "Nuevo usuario"
    Y completo el modal con nombre "Eva Gil" y email "eva@example.com"
    Entonces veo el aviso "Usuario «Eva Gil» creado."
    Y veo el usuario "Eva Gil" en la lista

  Escenario: Un alumno solo puede consultar
    Cuando inicio sesión como "alumno"
    Entonces veo el usuario "Ana López" en la lista
    Y no veo el botón "Nuevo usuario"

  Escenario: Cerrar sesión devuelve al login
    Cuando inicio sesión como "admin"
    Y pulso el botón "Cerrar sesión"
    Entonces veo el encabezado "Inicia sesión"
