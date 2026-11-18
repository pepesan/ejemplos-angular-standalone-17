# language: es
Característica: Lista de tareas
  Escenario: Navegar a tareas desde el menú
    Dado que abro la aplicación
    Cuando abro "V2 · Lista de tareas con Signals" desde la unidad "2. Componentes, plantillas y Data Binding"
    Entonces veo el encabezado "App Todo"
    Y veo la tarea "Hacer la compra"

  Escenario: Añadir una tarea
    Dado que abro la aplicación
    Cuando abro "V2 · Lista de tareas con Signals" desde la unidad "2. Componentes, plantillas y Data Binding"
    Y añado la tarea "Preparar la merienda"
    Entonces veo la tarea "Preparar la merienda"

  Escenario: Mostrar errores accesibles en el formulario tipado V2
    Dado que abro la aplicación
    Cuando abro "V2 · Formulario reactivo tipado" desde la unidad "5. Eventos y Formularios"
    Y envío el formulario vacío
    Entonces veo el mensaje de error "Escribe tu nombre."

  Escenario: Confirmar una inscripción válida en V2
    Dado que abro la aplicación
    Cuando abro "V2 · Formulario reactivo tipado" desde la unidad "5. Eventos y Formularios"
    Y completo el formulario con nombre "Ana Pérez" y correo "ana@example.com"
    Entonces veo la confirmación para "Ana Pérez"
