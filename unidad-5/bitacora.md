
# Evidencias de la unidad 5
## Actividad 1
### Describe cómo se están comunicando el micro:bit y el sketch de p5.js. ¿Qué datos envía el micro:bit?

### ¿Cómo es la estructura del protocolo ASCII usado?

### Muestra y explica la parte del código de p5.js donde lee los datos del micro:bit y los transforma en coordenadas de la pantalla.

### ¿Cómo se generan los eventos A pressed y B released que se generan en p5.js a partir de los datos que envía el micro:bit?

### Capturas de pantalla de los algunos dibujos que hayas hecho con el sketch.

## Seek
## Actividad 2
El código completo quedaría así:

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

¿Pero cómo se ven esos datos binarios? Para averiguarlo, vas a usar la aplicación SerialTerminal que usaste en la unidad anterior.

Abre la aplicación, configura el puerto, deja los valores por defecto y presiona Conectar. Selecciona el puerto del micro:bit (mbed Serial port) y presiona Conectar. Luego, en la sección de Recepción de Datos, en Mostrar datos como, selecciona Texto.

### Captura el resultado del experimento anterior. ¿Por qué se ve este resultado?

Ahora cambia la opción de Mostrar datos como a Todo en Hex y vuelve a capturar el resultado.

### Captura el resultado del experimento anterior. Lo que ves ¿Cómo está relacionado con esta línea de código?

### ¿Qué ventajas y desventajas ves en usar un formato binario en lugar de texto en ASCII?

Ahora te voy a proponer un experimento que te permitirá ver mejor los datos. Cambia el código del micro:bit por este:

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

### Captura el resultado del experimento. ¿Cuántos bytes se están enviando por mensaje? ¿Cómo se relaciona esto con el formato '>2h2B'? ¿Qué significa cada uno de los bytes que se envían?

### Recuerda de la unidad anterior que es posible enviar números positivos y negativos para los valores de xValue y yValue. ¿Cómo se verían esos números en el formato '>2h2B'?

Ahora realiza el siguiente experimento para comparar el envío de datos en ASCII y en binario.

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

### Captura el resultado del experimento. ¿Qué diferencias ves entre los datos en ASCII y en binario? ¿Qué ventajas y desventajas ves en usar un formato binario en lugar de texto en ASCII? ¿Qué ventajas y desventajas ves en usar un formato ASCII en lugar de binario?

## Actividad 3
Ahora vamos a modificar el código de p5.js para soportar la lectura de datos en formato binario.

### Explica por qué en la unidad anterior teníamos que enviar la información delimitada y además marcada con un salto de línea y ahora no es necesario.

### Compara el código de la unidad anterior relacionado con la recepción de los datos seriales que ves ahora. ¿Qué cambios observas?

Te voy mostrar por ejemplo un resultado que obtuve al ejecutar el código de p5.js:

Connected to serial port
A pressed
microBitX: 500 microBitY: 524 microBitAState: true microBitBState: false

Microbit ready to draw
92 microBitX: 500 microBitY: 524 microBitAState: true microBitBState: false

microBitX: 500 microBitY: 513 microBitAState: false microBitBState: false

222 microBitX: 3073 microBitY: 1 microBitAState: false microBitBState: false

### ¿Qué ves en la consola? ¿Por qué crees que se produce este error?

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


## Actividad 5
