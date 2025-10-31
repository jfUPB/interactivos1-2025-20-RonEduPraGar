const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); 
const port = 3000;

app.use(express.static("public", "js"));

io.on("connection", (socket) => {
  console.log('New client connected', socket.id);

  // Recibir datos de frecuencias del escritorio
  socket.on("frequencies", (data) => {
    io.emit("updateFrequencies", data); // reenviar a móviles
  });
  // Recibir posiciones de esferas desde el móvil
  socket.on("sphereMove", (sphereData) => {
    io.emit("spherePositionUpdate", sphereData); // broadcast opcional
  });
  socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => console.log("Servidor en http://localhost:3000"));
