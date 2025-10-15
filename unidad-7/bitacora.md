
# Evidencias de la unidad 7
  
## Actividad 01
  
### 🎯 Enunciado
  
Vamos a configurar y ejecutar el caso de estudio base. El objetivo es lograr que la interacción táctil en una página web abierta en tu celular controle en tiempo real un círculo en una página web abierta en el navegador de tu computador. Usaremos Node.js como intermediario y VS Code Dev Tunnels para hacer posible la conexión entre ambas aplicaciones.
  
### 🧐🧪✍️ Reporta en tu bitácora
  
#### ¿Qué URL de Dev Tunnels obtuviste? ¿Por qué crees que necesitamos usar esta URL en lugar de http://localhost:3000 o la IP local de tu computador para que el celular se conecte?
  
#### Describe brevemente qué hace npm install y npm start.
  
#### ¿Qué mensajes observaste en la terminal del servidor al conectar el cliente de escritorio y el cliente móvil? ¿Eran diferentes los mensajes o identificadores?
  
#### Describe el comportamiento observado: ¿Funcionó la interacción? ¿Hubo algún retraso (latencia)?
  
  
  
## Actividad 02
  
### 🎯 Enunciado

Antes de analizar el código línea por línea, vamos a clarificar los conceptos nuevos o críticos específicos de esta unidad que permiten la comunicación entre tu celular y tu computador a través de Internet.
  
### 🧐🧪✍️ Reporta en tu bitácora
  
#### Explica con tus propias palabras: ¿Por qué es necesario Dev Tunnels en este escenario y cómo funciona conceptualmente?
  
#### Describe la función de touchMoved() y por qué se usa la variable threshold en el cliente móvil.
  
#### Compara brevemente Dev Tunnels con simplemente usar la IP local. ¿Cuáles son las ventajas y desventajas de cada uno?
  
#### Coloca en tu bitácora capturas de pantalla del sistema completo funcionando. Esto lo puedes hacer abriendo tanto el mobile como el desktop en tu computador y tomando una captura de pantalla de todos los involucrados (celular, computador y terminal).
  

## Actividad 03
### 🎯 Enunciado
  
Vamos a analizar el código server.js. Este script actúa como un repetidor simple pero esencial, recibiendo mensajes del cliente móvil y retransmitiéndolos al cliente de escritorio.
  
### 🧐🧪✍️ Reporta en tu bitácora
  
#### ¿Cuál es la función principal de express.static(‘public’) en este servidor? ¿Cómo se compara con el uso de app.get(‘/ruta’, …) del servidor de la Unidad 6?
  
#### Explica detalladamente el flujo de un mensaje táctil: ¿Qué evento lo envía desde el móvil? ¿Qué evento lo recibe el servidor? ¿Qué hace el servidor con él? ¿Qué evento lo envía el servidor al escritorio? ¿Por qué se usa socket.broadcast.emit en lugar de io.emit o socket.emit en este caso?
  
#### Si conectaras dos computadores de escritorio y un móvil a este servidor, y movieras el dedo en el móvil, ¿Quién recibiría el mensaje retransmitido por el servidor? ¿Por qué?
  
#### ¿Qué información útil te proporcionan los mensajes console.log en el servidor durante la ejecución?
  

## Actividad 04
  
### 🎯 Enunciado
  
Ahora analizaremos el código que corre en los navegadores: el cliente móvil que captura el toque (mobile/sketch.js) y el cliente de escritorio que recibe la información y dibuja (desktop/sketch.js). Veremos cómo usan Socket.IO para comunicarse con el servidor.
  
### 🧐🧪✍️ Reporta en tu bitácora
  
#### Realiza un diagrama donde muestres el flujo completo de datos y eventos entre los tres componentes: móvil, servidor y escritorio. Puedes ilustrar con un ejemplo de coordenadas táctiles (x, y) y cómo viajan a través del sistema.
  
  
  
## Actividad 05
  
### Aplica lo aprendido
### 🎯 Enunciado
  
Ahora que comprendes cómo funciona el sistema base, es tu turno de CREAR
  
### 🧐🧪✍️ Reporta en tu bitácora
  
#### Diseña una aplicación interactiva que use el touch del móvil para controlar una visuales de tema musical de tu elección. Las visuales correrán en una aplicación de escritorio (desktop). Recuerda que ambas aplicaciones las construirás usando p5.js y utilizando el servidor Node.js como puente.
#### Implementa tu diseño. Puedes usar IA generativa para ayudarte a escribir el código, pero primero debes hacer el diseño de lo que quieres.
#### Incluye todos los códigos (servidor y clientes) en tu bitácora.