# language: es
Característica: CRUD de usuarios con navegación entre listado, alta y edición

  Antecedentes:
    Dado que el backend de usuarios responde con datos de ejemplo
    Y que abro la aplicación
    Y abro "V2 · CRUD con navegación: listado, alta y edición por rutas (borrado en modal)" desde la unidad "6. Routing, Guards y Lazy Loading"

  Escenario: Hay que iniciar sesión para ver los usuarios
    Entonces veo el encabezado "Inicia sesión"
    Y no veo el enlace "Nuevo usuario"

  Escenario: Una dirección protegida sin sesión lleva al login y recuerda a dónde se quería ir
    Cuando abro directamente la dirección "/v2/usuarios-navegacion/nuevo"
    Entonces veo el encabezado "Inicia sesión"
    Y la dirección contiene "returnUrl"

  Escenario: Un administrador crea un usuario desde la pantalla de alta y vuelve al listado
    Cuando inicio sesión como "admin"
    Entonces veo el usuario "Ana López" en la lista
    Cuando pulso el enlace "Nuevo usuario"
    Y completo el formulario con nombre "Eva Gil" y email "eva@example.com"
    Entonces veo el aviso "Usuario «Eva Gil» creado."
    Y veo el usuario "Eva Gil" en la lista

  Escenario: Un alumno solo puede consultar
    Cuando inicio sesión como "alumno"
    Entonces veo el usuario "Ana López" en la lista
    Y no veo el enlace "Nuevo usuario"
