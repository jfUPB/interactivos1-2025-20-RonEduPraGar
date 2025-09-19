
# Evidencias de la unidad 5
## Actividad 1
### Describe cómo se están comunicando el micro:bit y el sketch de p5.js. ¿Qué datos envía el micro:bit?
Envia los datos de su posicion en los ejes X y Y obtenidos por sus componentes (giroscopio), y la actividad de los botones A y B.
### ¿Cómo es la estructura del protocolo ASCII usado?

### Muestra y explica la parte del código de p5.js donde lee los datos del micro:bit y los transforma en coordenadas de la pantalla.

``` ruby
  //******************************************
  if (!port.opened()) {
    connectBtn.html("Connect to micro:bit");
    microBitConnected = false;
  } else {
    microBitConnected = true;
    connectBtn.html("Disconnect");

    if (port.opened() && !connectionInitialized) {
      port.clear();
      connectionInitialized = true;
    }

    if (port.availableBytes() > 0) {
      let data = port.readUntil("\n");
      if (data) {
        data = data.trim();
        let values = data.split(",");
        if (values.length == 4) {
          microBitX = int(values[0]) + windowWidth / 2;
          microBitY = int(values[1]) + windowHeight / 2;
          microBitAState = values[2].toLowerCase() === "true";
          microBitBState = values[3].toLowerCase() === "true";
          updateButtonStates(microBitAState, microBitBState);
        } else {
          print("No se están recibiendo 4 datos del micro:bit");
        }
      }
    }
  }
  //*******************************************
```
En esta seccion, el codigo, ademas de asegurarse que los 4 datos esten siendo registrados de forma correcta para su funcionamiento, utiliza la informacion adquirida del micro:bit y la reinterpreta para el entorno donde son recibidos (que en este caso es la ventana del proyecto) siendo estos centrados dentro de la ventana despues de asegurar su estado como variables de enteros y sumando el valor medio de la pantalla en los ejes X y Y.

### ¿Cómo se generan los eventos A pressed y B released que se generan en p5.js a partir de los datos que envía el micro:bit?
Estos eventos se generan en la funcion de "updateButtonStates" que como su nombre indica, busca actualizar el estado de uso de estos 2 botones dentro del programa despues de recibir la informacion del micro:bit.

```ruby
function updateButtonStates(newAState, newBState) {
  // Generar eventos de keypressed
  if (newAState === true && prevmicroBitAState === false) {
    // create a new random color and line length
    lineModuleSize = random(50, 160);
    // remember click position
    clickPosX = microBitX;
    clickPosY = microBitY;
    print("A pressed");
  }
  // Generar eventos de key released
  if (newBState === false && prevmicroBitBState === true) {
    c = color(random(255), random(255), random(255), random(80, 100));
    print("B released");
  }

  prevmicroBitAState = newAState;
  prevmicroBitBState = newBState;
}
```
Esta misma funcion se puede usar para los estados opuestos de cada boton en caso de ser necesario si se invierten los valores de las declaraciones if.
  
### Capturas de pantalla de los algunos dibujos que hayas hecho con el sketch.

## Seek
## Actividad 2
El código completo quedaría así:

```ruby
# Imports go at the top
from microbit import *
import struct
uart.init(115200)
display.set_pixel(0,0,9)

while True:
    xValue = accelerometer.get_x()
    yValue = accelerometer.get_y()
    aState = button_a.is_pressed()
    bState = button_b.is_pressed()
    data = struct.pack('>2h2B', xValue, yValue, int(aState), int(bState))
    uart.write(data)
    sleep(100) # Envia datos a 10 Hz
```
¿Pero cómo se ven esos datos binarios? Para averiguarlo, vas a usar la aplicación SerialTerminal que usaste en la unidad anterior.

Abre la aplicación, configura el puerto, deja los valores por defecto y presiona Conectar. Selecciona el puerto del micro:bit (mbed Serial port) y presiona Conectar. Luego, en la sección de Recepción de Datos, en Mostrar datos como, selecciona Texto.

### Captura el resultado del experimento anterior. ¿Por qué se ve este resultado?
![en Texto](<evidencias/imagen (2).png>)
Se encuentra completamente ilegible, probablemente debido a que los datos no se estan enviando directamente en un formato de caracteres basico, cosa que confunde al traductor cuando intenta buscar los identificadores que lo lleven a descifrar el mensaje.  
  
  
Ahora cambia la opción de Mostrar datos como a Todo en Hex y vuelve a capturar el resultado.

### Captura el resultado del experimento anterior. Lo que ves ¿Cómo está relacionado con esta línea de código?
![alt text](<evidencias/imagen (1).png>)
Es posible observar que no solo se vuelve legible la informacion (incluso si no tenemos conocimiento de que significa aun) sino que tambien queda organizada en 4 grupos de informacion, los cuales corresponden a cada variable enviada en el paquete de datos, siendo organizados en orden de tamaño (> big endian, donde se organiza con base en los bytes mas grandes o, en otras palabras, de mayor a menor) con 2 enteros con signo (2h, cada uno ocupa 2 bytes) y 2 enteros sin signo (2b, cada uno ocupa 1 byte), generando un paquete con tamaño total de 6 bytes.  
  
### ¿Qué ventajas y desventajas ves en usar un formato binario en lugar de texto en ASCII?
La accesibilidad a un formato inmediato puede tener sus ventajas dentro de envios de datos previamente limitados, el tamaño siendo exacto tambien optimiza la velocidad de transferencia en cuanto a la cantidad de datos que se requieren para formar un mensaje especifico ASCII transfiere muchos mas datos dentro del mismo tiempo, pero termina siendo menor cantidad traducida.
En cuanto a sus desventajas, requerir un paso extra de traduccion puede ser algo que no se requiera dependiendo de la situacion, ademas de que su requerimiento de formato y organizacion directa puede poner en riesgo la integridad de la informacion si no se implementa de la forma correcta.

Ahora te voy a proponer un experimento que te permitirá ver mejor los datos. Cambia el código del micro:bit por este:

```ruby
# Imports go at the top
from microbit import *
import struct
uart.init(115200)
display.set_pixel(0,0,9)

while True:
    if accelerometer.was_gesture('shake'):
        xValue = accelerometer.get_x()
        yValue = accelerometer.get_y()
        aState = button_a.is_pressed()
        bState = button_b.is_pressed()
        data = struct.pack('>2h2B', xValue, yValue, int(aState), int(bState))
        uart.write(data)
```
### Captura el resultado del experimento. ¿Cuántos bytes se están enviando por mensaje? ¿Cómo se relaciona esto con el formato '>2h2B'? ¿Qué significa cada uno de los bytes que se envían?
Se envian 6 bytes estan organizados por tamaño de mayor a menor(>) siendo 2 bytes con signo(2h) y 2 sin signo(2b), con valor de 2 (total 4) y 1 (total 2) bytes respectivamente.

### Recuerda de la unidad anterior que es posible enviar números positivos y negativos para los valores de xValue y yValue. ¿Cómo se verían esos números en el formato '>2h2B'?
En el lector HEX, estos numeros se ven en los bytes que tienen 4 digitos "00ff". 
  
  
Ahora realiza el siguiente experimento para comparar el envío de datos en ASCII y en binario.

```ruby
# Imports go at the top
from microbit import *
import struct
uart.init(115200)
display.set_pixel(0,0,9)

while True:
    if accelerometer.was_gesture('shake'):
        xValue = accelerometer.get_x()
        yValue = accelerometer.get_y()
        aState = button_a.is_pressed()
        bState = button_b.is_pressed()
        data = struct.pack('>2h2B', xValue, yValue, int(aState), int(bState))
        uart.write(data)
        uart.write("ASCII:\n")
        data = "{},{},{},{}\n".format(xValue, yValue, aState,bState)
        uart.write(data)
```
### Captura el resultado del experimento. ¿Qué diferencias ves entre los datos en ASCII y en binario? ¿Qué ventajas y desventajas ves en usar un formato binario en lugar de texto en ASCII? ¿Qué ventajas y desventajas ves en usar un formato ASCII en lugar de binario?
![En Texto](<evidencias/imagen (6).png>)
![En Mixto](<evidencias/imagen (7).png>)
![En HEX](<evidencias/imagen (8).png>)
Primero
## Actividad 3
Ahora vamos a modificar el código de p5.js para soportar la lectura de datos en formato binario.

### Explica por qué en la unidad anterior teníamos que enviar la información delimitada y además marcada con un salto de línea y ahora no es necesario.
Debido a la cantidad y el formato de envio de los datos, estos no tienen un tamaño definido en cuanto al tamaño del paquete, pero si en cuanto a lo que define cada caracter dentro de estos, lo cual no permite distinguir donde inicia y donde termina cada paquete.
En cambio, dentro del paquete en binario siempre se esta trabajando bajo un formato especifico con tamaño definido, aunque no garantiza que no existan problemas de lectura.

### Compara el código de la unidad anterior relacionado con la recepción de los datos seriales que ves ahora. ¿Qué cambios observas?
El requerimiento de la traduccion cambia un poco la estructura del codigo,
  
Te voy mostrar por ejemplo un resultado que obtuve al ejecutar el código de p5.js:

```ruby
Connected to serial port
A pressed
microBitX: 500 microBitY: 524 microBitAState: true microBitBState: false

Microbit ready to draw
92 microBitX: 500 microBitY: 524 microBitAState: true microBitBState: false

microBitX: 500 microBitY: 513 microBitAState: false microBitBState: false

222 microBitX: 3073 microBitY: 1 microBitAState: false microBitBState: false
```
### ¿Qué ves en la consola? ¿Por qué crees que se produce este error?
![alt text](<evidencias/imagen (1).png>)

Debido a el proceso de envio de datos, como se puede observar en esta captura, desde los primeros grupos de bytes es posible observar como estos pueden terminar conectados sin intencion del desarrollador, cambiando los valores y el orden de los sucesos y perdiendo seguridad en la transferencia de datos correcta.
Esto puede ser en parte porque no se tiene una velocidad definida de transferencia, lo que puede estar causando problemas cuando varios computadores pueden procesar o transferir datos de maneras diferentes en cuanto a velocidad o metodologia, cualquier cambio en estos parametros, por minimo que sea, puede desviar los resultados de forma permanente.
  
![Ejemplo parte 1](<evidencias/imagen (11).png>)
![Ejemplo parte 2](<evidencias/imagen (12).png>)
  
En este ejemplo inicia bien, pero inmediatamente (tal vez debido a la tasa de actualizacion?) empieza a cambiar los resultados y despues de un minimo tiempo esta completamente fuera de lugar, ya despues de desconectar y reconectar la señal del micro:bit vuelve a leerlos de forma correcta, pero luego termina en un mismo lugar.
![alt text](<evidencias/imagen (13).png>)
  
  
Para implementar la estrategia de framing será necesario modificar el código del micro:bit y el código de p5.js.

En el caso del micro:bit se enviará un paquete de 8 bytes:

Byte 0: Header (0xAA)
Bytes 1-6: Datos (dos enteros de 16 bits y dos bytes para estados)
Byte 7: Checksum (suma de los 6 bytes de datos módulo 256)

### Analiza el código, observa los cambios. Ejecuta y luego observa la consola. ¿Qué ves?

### ¿Qué cambios tienen los programas y ¿Qué puedes observar en la consola del editor de p5.js?

## Apply
## Actividad 4
Vas a modificar la misma aplicación de la fase de aplicación de la unidad anterior para que soporte el protocolo de datos binarios. La aplicación del micro:bit debe ser la misma que usaste en la actividad anterior:

```ruby
from microbit import *
import struct

uart.init(115200)
display.set_pixel(0, 0, 9)

while True:
    xValue = accelerometer.get_x()
    yValue = accelerometer.get_y()
    aState = button_a.is_pressed()
    bState = button_b.is_pressed()
    data = struct.pack('>2h2B', xValue, yValue, int(aState), int(bState))
    checksum = sum(data) % 256
    packet = b'\xAA' + data + bytes([checksum])
    uart.write(packet)
    sleep(100)
```
Primero que todo, se llevan a cabo los mismos cambios que se hacen con el programa de ejemplo, se convierte la obtencion de datos a binario, y se limita el envio de estos a agitar el micro:bit (cosa que como se podra observar, no beneficia mucho especificamente dentro de este programa)
![Ejemplo funcional](<evidencias/imagen (9).png>)
``` ruby
// P_1_1_2_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


var segmentCount = 360;
var radius = 300;
var sNum = 1;

let serialBuffer = []; // Buffer para almacenar bytes recibidos
let port;
let connectBtn;
let connectionInitialized = false;
let microBitConnected = false;

const STATES = {
  WAIT_MICROBIT_CONNECTION: "WAITMICROBIT_CONNECTION",
  RUNNING: "RUNNING",
};
let appState = STATES.WAIT_MICROBIT_CONNECTION;
let microBitX = 0;
let microBitY = 0;
let microBitAState = false;
let microBitBState = false;
let prevmicroBitAState = false;
let prevmicroBitBState = false;

function setup() {
  createCanvas(800, 800);
  noStroke();

  port = createSerial();
  connectBtn = createButton("Connect to micro:bit");
  connectBtn.position(0, 0);
  connectBtn.mousePressed(connectBtnClick);
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open("MicroPython", 115200);
    connectionInitialized = false;
  } else {
    port.close();
  }
}

function updateButtonStates(newAState, newBState) {
  // Generar eventos de key pressed A
  if (newAState === true && prevmicroBitAState === false) {
    // change segments number
    sNum++;
    if (sNum == 6) sNum = 1;
    print("A pressed");
    print(sNum);
    switch (sNum) {
      case 1:
        segmentCount = 360;
        break;
      case 2:
        segmentCount = 45;
        break;
      case 3:
        segmentCount = 24;
        break;
      case 4:
        segmentCount = 12;
        break;
      case 5:
        segmentCount = 6;
        break;
    }
  }
  // Generar eventos de key pressed B
  if (newBState === true && prevmicroBitBState === false) {
    saveCanvas(gd.timestamp(), "png");
    print("B pressed");
  }

  prevmicroBitAState = newAState;
  prevmicroBitBState = newBState;
}

function readSerialData() {
  // Acumula los bytes recibidos en el buffer
  let available = port.availableBytes();
  if (available > 0) {
    let newData = port.readBytes(available);
    serialBuffer = serialBuffer.concat(newData);
  }

  // Procesa el buffer mientras tenga al menos 8 bytes (tamaño de un paquete)
  while (serialBuffer.length >= 8) {
    // Busca el header (0xAA)
    if (serialBuffer[0] !== 0xaa) {
      serialBuffer.shift(); // Descarta bytes hasta encontrar el header
      continue;
    }

    // Si hay menos de 8 bytes, espera a que llegue el paquete completo
    if (serialBuffer.length < 8) break;

    // Extrae los 8 bytes del paquete
    let packet = serialBuffer.slice(0, 8);
    serialBuffer.splice(0, 8); // Elimina el paquete procesado del buffer

    // Separa datos y checksum
    let dataBytes = packet.slice(1, 7);
    let receivedChecksum = packet[7];
    // Calcula el checksum sumando los datos y aplicando módulo 256
    let computedChecksum = dataBytes.reduce((acc, val) => acc + val, 0) % 256;

    if (computedChecksum !== receivedChecksum) {
      console.log("Checksum error in packet");
      continue; // Descarta el paquete si el checksum no es válido
    }

    // Si el paquete es válido, extrae los valores
    let buffer = new Uint8Array(dataBytes).buffer;
    let view = new DataView(buffer);
    microBitX = view.getInt16(0) + windowWidth / 2;
    microBitY = view.getInt16(2) + windowHeight / 2;
    microBitAState = view.getUint8(4) === 1;
    microBitBState = view.getUint8(5) === 1;
    updateButtonStates(microBitAState, microBitBState);

  }
}

function draw() {
  if (!port.opened()) {
    connectBtn.html("Connect to micro:bit");
    microBitConnected = false;
  } else {
    microBitConnected = true;
    connectBtn.html("Disconnect");

    if (port.opened() && !connectionInitialized) {
      port.clear();
      connectionInitialized = true;
    }

    if (port.availableBytes() > 0) {
      let data = port.readUntil("\n");
      if (data) {
        data = data.trim();
        let values = data.split(",");
        if (values.length == 4) {
          microBitX = int(values[0]) + windowWidth / 2;
          microBitY = int(values[1]) + windowHeight / 2;
          microBitAState = values[2].toLowerCase() === "true";
          microBitBState = values[3].toLowerCase() === "true";
          updateButtonStates(microBitAState, microBitBState);
        } else {
          print("No se están recibiendo 4 datos del micro:bit");
        }
      }
    }
  }
  //*******************************************

  switch (appState) {
    case STATES.WAIT_MICROBIT_CONNECTION:
      // No puede comenzar a dibujar hasta que no se conecte el microbit
      // evento 1:
      if (microBitConnected === true) {
        // Preparo todo para el estado en el próximo frame
        print("Microbit ready to draw");
        noCursor();
        port.clear();
        prevmicroBitAState = false;
        prevmicroBitBState = false;
        appState = STATES.RUNNING;
      }

      break;

    case STATES.RUNNING:
      // EVENTO: estado de conexión del microbit
      if (microBitConnected === false) {
        print("Waiting microbit connection");
        cursor();
        appState = STATES.WAIT_MICROBIT_CONNECTION;
      }
  }
  colorMode(HSB, 360, width, height);
  background(360, 0, height);

  var angleStep = 360 / segmentCount;
  beginShape(TRIANGLE_FAN);
  vertex(width / 2, height / 2);
  for (var angle = 0; angle <= 360; angle += angleStep) {
    var vx = width / 2 + cos(radians(angle)) * radius;
    var vy = height / 2 + sin(radians(angle)) * radius;
    vertex(vx, vy);
    fill(angle, microBitX, microBitY);
  }
  endShape();
}

function keyPressed() {
  if (key == "s" || key == "S") saveCanvas(gd.timestamp(), "png");

  switch (key) {
    case "1":
      segmentCount = 360;
      break;
    case "2":
      segmentCount = 45;
      break;
    case "3":
      segmentCount = 24;
      break;
    case "4":
      segmentCount = 12;
      break;
    case "5":
      segmentCount = 6;
      break;
  }
}
```
Tambien se repara la previa funcion del boton b, con tal de que este funcione como deberia (en presionar el boton, en vez de soltarlo).
Entre otras cosas, el metodo de delimitar la informacion por medio de una accion en el micro:bit limita la funcion de guardado a la imagen previamente dibujada.

![En cuanto a soltar boton](<evidencias/imagen (10).png>)

Tambien, vuelve increiblemente dificil trabajar con funciones de soltar boton, ya que estas deben estar activas durante el proceso de transferencia de datos.

## Autoevaluación
### Nota: 3.6
En los criterios de evaluación:
#### 1. Profundidad de la Indagación
3.8  
Se busca y entiende las razones del por qué funcionan o fallan varios de los aspectos dentro de los programas y se formulan preguntas basicas sobre el funcionamiento de estos, pero no se investiga de forma extensiva por encima de lo requerido,  
llegando a terminos especificos requeridos para el avance de la bitacora (en este caso, el formato de ">2h2b" y lo que implica para la efectividad del protocolo binario), pero no mucho mas alla de eso.
  
#### 2. Calidad de la Experimentación
3.4  Se formulan experimentos durante el proceso de indagar y crear la bitacora, pero estos no son completamente evidenciados aparte de ciertas preguntas donde es ideal probar el comportamiento del codigo para crear un entendimiento de los problemas/soluciones.

#### 3. Análisis y Reflexión
3.9  Se indica la evidencia dentro de la bitacora, mas no se incluye toda evidencia de los procesos a la vez que se encuentran actividades incompletas (act 1 2da pregunta, evidencias dibujos/act 3, ultimas 2 preguntas / act 4, correccion funcion transferencia de datos a ser constante).

#### 4. Apropiación y Articulación de Conceptos
3.2  Se entiende el funcionamiento y se dan evidencias basicas de conocimiento, pero no se dan explicaciones claras de este conocimiento ni claridad sobre los conceptos esperados dentro de la bitacora. Aparte de que no se responden las preguntas directamente relacionadas con estos conceptos (act 3, sobre Framing)

## Actividad 5



