# language: es
Característica: Lista de tareas
  Escenario: Navegar a tareas desde el menú
    Dado que abro la aplicación
    Cuando navego a "Todos" desde el menú "Componentes"
    Entonces veo el encabezado "App Todo"
    Y veo la tarea "Hacer la compra"

  Escenario: Añadir una tarea
    Dado que abro la aplicación
    Cuando navego a "Todos" desde el menú "Componentes"
    Y añado la tarea "Preparar la merienda"
    Entonces veo la tarea "Preparar la merienda"
