    # Unidad 2

## 🔎 Fase: Set + Seek

### Actividad 1
#### Describe detalladamente cómo funciona este ejemplo.  
El programa define una accion asignable a diferentes posiciones del display  
  
#### ¿Cuáles son los estados en el programa?  
2 estados init y waittimeout, (init es pseudoestado). Estados de: espera, accion
En un semaforo, estados (espera -> tiempo, accion -> cambio color)  
  
#### ¿Cuáles son los eventos/inputs en el programa?  
Hay un evento en waittimeout (tiempo), cuando se cumple este evento se enciende o se apaga el pixel/led asociado.  
  
#### ¿Cuáles son las acciones en el programa?  
Encender/Apagar el/los led(s) definidos por el programa.  
  
### Actividad 2
#### Escribe el código que soluciona este problema en tu bitácora (Semaforo).
No se como funciona python. Pienso una manera y supera mis expectativas en como no pienso que deberia funcionar.  

from microbit import *
import utime

class Pixel:
    def __init__(self,pixelX,pixelY,initState,interval):
        self.state = "Init"
        self.startTime = 0
        self.interval = interval
        self.pixelX = pixelX
        self.pixelY = pixelY
        self.pixelState = initState

    def update(self):

        if self.state == "Init":
            self.startTime = utime.ticks_ms()
            self.state = "WaitTimeout"
            display.set_pixel(self.pixelX,self.pixelY,self.pixelState)

        elif self.state == "WaitTimeout":
            sleep(self.interval)
            if utime.ticks_diff(utime.ticks_ms(),self.startTime) > self.interval:
                self.startTime = utime.ticks_ms()
                if self.pixelState == 9:
                    self.pixelState = 0
                else:
                    self.pixelState = 9
                display.set_pixel(self.pixelX,self.pixelY,self.pixelState)

pixel1 = Pixel(2,0,0,1000)
pixel2 = Pixel(2,1,0,1000)
pixel3 = Pixel(2,2,0,1000)

for i in range (3):
    pixel1.update()
for i in range (3):
    pixel2.update()  
for i in range (3):
    pixel3.update()    
