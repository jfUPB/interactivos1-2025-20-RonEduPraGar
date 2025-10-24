// =======================================================
// Servidor principal de la aplicación
// =======================================================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// -------------------------------------------------------
// SERVIR ARCHIVOS ESTÁTICOS
// -------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// Cliente de escritorio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Cliente móvil
app.get("/mobile", (req, res) => {
  res.sendFile(path.join(__dirname, "public/mobile/index.html"));
});

// -------------------------------------------------------
// SOCKET.IO
// -------------------------------------------------------
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  // ---------------------------
  // Frecuencias desde el escritorio
  // ---------------------------
  socket.on("frequencies", (data) => {
    socket.broadcast.emit("frequencies", data);
  });

  // ---------------------------
  // Interacción móvil (atraer / repeler)
  // ---------------------------
  socket.on("mobileInteraction", (data) => {
    console.log(
      `📱 Interacción móvil recibida -> tipo: ${data.action}, dedos: ${data.touches}`
    );
    socket.broadcast.emit("mobileInteraction", data);
  });

  // ---------------------------
  // Desconexión
  // ---------------------------
  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// -------------------------------------------------------
// INICIO DEL SERVIDOR
// -------------------------------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor en ejecución en http://localhost:${PORT}`);
});