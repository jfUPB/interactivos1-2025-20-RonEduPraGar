# Unidad 3

## 🔎 Fase: Set + Seek

### Actividad 5
#### Crear una tabla con los vectores de prueba. La tabla debe tener 4 columnas por vector y puedes agrupar vectores en un gran vector. Las columnas son:
 * Estado inicial
 * Evento disparador
 * Acciones
 * Estado final

|Estado inicial|Evento disparador|Acciones|Estado final|
|--|--|--|--|
|explotado|tocar logo|mostrar contador|configuracion|
|armado|leer datos "A""B""A" (contraseña)|mostrar contador|configuracion|
|configuracion|leer dato "A"|numero en contadro sube|configuracion|
|configuracion|leer informacion "S"|mostrar cuenta regresiva por tiempo|armado|

|Estado inicial|Evento disparador|Acciones|Estado final|
|--|--|--|--|
|explotado|enviar radio mensaje "T"|leer evento, mostrar contador, cambio evento|configuracion|
|armado|enviar radio mensaje "A""B""A" (contraseña)|leer eventos(radio) en orden, mostrar contador, cambio evento|configuracion|
|configuracion|enviar radio mensaje "A"|leer evento, numero en contador sube|configuracion|
|configuracion|enviar radio mensaje "S"|leer evento, mostrar cuenta regresiva por tiempo, cambio evento|armado|



