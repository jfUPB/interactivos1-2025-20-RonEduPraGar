import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Recibir datos de frecuencias del escritorio
  socket.on("frequencies", (data) => {
    io.emit("updateFrequencies", data); // reenviar a móviles
  });

  // Recibir posiciones de esferas desde el móvil
  socket.on("sphereMove", (sphereData) => {
    io.emit("spherePositionUpdate", sphereData); // broadcast opcional
  });
});

server.listen(3000, () => console.log("Servidor en http://localhost:3000"));
