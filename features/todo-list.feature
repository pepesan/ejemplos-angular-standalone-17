# language: es
Característica: Lista de tareas
  Escenario: Navegar a tareas desde el menú
    Dado que abro la aplicación
    Cuando navego a "Lista de tareas" desde el menú "V2 · Angular moderno"
    Entonces veo el encabezado "App Todo"
    Y veo la tarea "Hacer la compra"

  Escenario: Añadir una tarea
    Dado que abro la aplicación
    Cuando navego a "Lista de tareas" desde el menú "V2 · Angular moderno"
    Y añado la tarea "Preparar la merienda"
    Entonces veo la tarea "Preparar la merienda"

  Escenario: Mostrar errores accesibles en el formulario tipado V2
    Dado que abro la aplicación
    Cuando navego a "Formulario tipado" desde el menú "V2 · Angular moderno"
    Y envío el formulario vacío
    Entonces veo el mensaje de error "Escribe tu nombre."

  Escenario: Confirmar una inscripción válida en V2
    Dado que abro la aplicación
    Cuando navego a "Formulario tipado" desde el menú "V2 · Angular moderno"
    Y completo el formulario con nombre "Ana Pérez" y correo "ana@example.com"
    Entonces veo la confirmación para "Ana Pérez"
