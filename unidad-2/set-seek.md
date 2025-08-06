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