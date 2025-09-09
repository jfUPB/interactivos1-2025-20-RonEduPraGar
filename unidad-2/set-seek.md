    # Unidad 2

## 🔎 Fase: Set + Seek  

### Actividad 1
#### Describe detalladamente cómo funciona este ejemplo.  
El programa define una accion asignable a diferentes posiciones del display  
  
#### ¿Cuáles son los estados en el programa?  
2 estados init y waittimeout, (init es pseudoestado). Estados de: espera, accion  
  
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
 

Esencialmente tiene los mismos eventos y estados del punto anterior.
En un semaforo, estados (espera -> tiempo, accion -> cambio color)  
El unico cambio es que en vez de un solo ciclo while, se usan 3 ciclos separados para que no se cruzen los intervalos de los leds, lo cual lleva a que solo funcione una vez el programa debido a mi falta de tiempo y entendimiento del funcionamiento de python para corregir que el programa no ejecute el ultimo ciclo del 3er pixel bajo el ciclo While, cosa que desalinea todo el semaforo.  
  
### Actividad 3
#### Explica por qué decimos que este programa permite realizar de manera concurrente varias tareas.
Este programa realiza tareas de forma concurrente ya que es capaz de continuar su ciclo base entre las expresiones a la vez que permite llamar a los estados que contienen a estas expresiones en cualquier momento, unicamente cambiando el contexto sobre el cual se muestra la expresion opuesta de la que este en display en el momento (feliz -> triste, triste -> feliz y sonrie -> feliz, siendo la excepcion de que cambia al opuesto).  
  
#### Identifica los estados, eventos y acciones en el programa.  
4 Estados. Inicial (STATE_INIT), feliz (STATE_HAPPY), sonrisa (STATE_SMILE) y triste (STATE_SAD).  
2 Eventos. Presionar boton A (if button_a.was_pressed():) y tiempo de espera (if utime.ticks_diff(utime.ticks_ms(), start_time) > interval:).  
3 Acciones. Cambio a feliz (Image.HAPPY), cambio a sonrisa (Image.SMILE) y cambio a triste (Image.SAD).  
#### Describir 3 Vectores de Prueba  
##### 1. Llegar a estado Feliz desde estado Sonrisa  
Inicia en estado "STATE_INIT" y muestra "Image.HAPPY", de aqui pasa a estado "STATE_HAPPY", despues de un determinado tiempo pasa a estado "STATE_SMILE" y muestra "Image.SMILE", desde este estado se ejecuta el evento de "if button_a.was_pressed():", desde el cual pasa a "STATE_HAPPY" y muestra "image.HAPPY".
##### 2. Llegar a estado Sonrisa desde estado Triste  

##### 3. Llegar a estado Triste desde estado Feliz   
