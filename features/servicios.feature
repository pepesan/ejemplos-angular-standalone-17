# language: es
Característica: Servicios y estado compartido (unidad 4)

  Escenario: Un servicio singleton se comparte y uno con providers no
    Dado que abro la aplicación
    Cuando abro "V2 · @Injectable: constructor frente a inject(), singleton y límites" desde la unidad "4. Servicios y comunicación HTTP"
    Y pulso el botón "Incrementar desde A"
    Entonces el componente "A" muestra "Valor: 1" e "Instancia del servicio: #1"
    Y el componente "B" muestra "Valor: 1" e "Instancia del servicio: #1"
    Y el componente "C" muestra "Valor: 0" e "Instancia del servicio: #2"

  Escenario: Los componentes hermanos comparten el estado
    Dado que abro la aplicación
    Cuando abro "V2 · Comunicación mediante estado compartido con Signals" desde la unidad "4. Servicios y comunicación HTTP"
    Y pulso el botón "Incrementar"
    Y pulso el botón "Incrementar"
    Entonces veo el texto "Valor derivado (doble): 4"
