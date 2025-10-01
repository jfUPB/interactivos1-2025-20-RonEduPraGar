# Unidad 1


## 🛠 Fase: Apply

### Actividad 5
#### Explica cómo funciona el sistema físico interactivo que acabamos de crear.
Este sistema funciona con base en la conexion que puede tener el micro:bit directamente con el programa/editor de p5.js, 
con base en esto, se sube una funcionalidad de lectura de las acciones ejectudas en el microbit, 
especificamente la interaccion con el boton A y que hacer cuando se ejecuta cualquier otra accion, una manera primitiva pero que asegura que se tenga acceso a ambos comandos en todo momento,
luego se le pone una pausa para controlar el flujo de datos.
Ya dentro del programa principal se crea una integracion del sistema que permite conectar al microbit con el programa de p5.js desde un boton,  
al confirmar que la conexion esta correctamente establecida, permite acceder a la funcionalidad principal del programa, la cual se resume  
en la muestra de 2 colores con base en el dato enviado por el microbit, verde si se envia "A" y rojo si se envia "N". 

### Actividad 6
####
[Concepto circulo movimiento eje X](https://editor.p5js.org/RonEduPraGar/sketches/yScEosDPS)

  ``` python
    from microbit import *

uart.init(baudrate=115200)

while True:

    if button_a.is_pressed():
        uart.write('A')
    else:
        uart.write('N')

    sleep(100)
  ```

  ``` js
      let port;
  let connectBtn;
  let connectionInitialized = false;
  let x = 0;
  let y = 200;

  function setup() {
    createCanvas(400, 400);
    background(220);
    port = createSerial();
    connectBtn = createButton("Connect to micro:bit");
    connectBtn.position(80, 300);
    connectBtn.mousePressed(connectBtnClick);
  }

  function draw() {
    background(220);

    if (port.opened() && !connectionInitialized) {
      port.clear();
      connectionInitialized = true;
    }

    if (port.availableBytes() > 0) {
      let dataRx = port.read(1);
      if (dataRx == "A") {
        fill("red");
        x++;
      } else if (dataRx == "N") {
        fill("green");
        x--;
      }
    }

    rectMode(CENTER);
    circle(x,y,40);

    if (!port.opened()) {
      connectBtn.html("Connect to micro:bit");
    } else {
      connectBtn.html("Disconnect");
    }
  }

  function connectBtnClick() {
    if (!port.opened()) {
      port.open("MicroPython", 115200);
      connectionInitialized = false;
    } else {
      port.close();
    }
  }
  ```
