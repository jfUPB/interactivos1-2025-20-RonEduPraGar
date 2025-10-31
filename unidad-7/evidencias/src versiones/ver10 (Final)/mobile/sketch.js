const socket = io();
const area = document.getElementById("touchArea");

function handleTouch(event) {
  event.preventDefault();
  const touches = event.touches;

  if (touches.length === 0) return;
  const type = touches.length === 1 ? "attract" : "repel";

  // Calcular punto medio de los dedos
  let x = 0, y = 0;
  for (let i = 0; i < touches.length; i++) {
    x += touches[i].clientX;
    y += touches[i].clientY;
  }
  x /= touches.length;
  y /= touches.length;

  // Normalizar coordenadas
  const nx = x / window.innerWidth;
  const ny = y / window.innerHeight;
  let touchData = {
      type,
      x: nx,
      y: ny
  };
  socket.emit("mobileInteraction", touchData);
  console.log('Sent');

  area.textContent = type === "attract"
    ? "🧲 Atrayendo esferas..."
    : "💥 Repeliendo esferas...";
}

function endTouch() {
  area.textContent = "Toca con 1 dedo (atraer) o 2 dedos (repeler)";
  socket.emit("mobileInteraction", { type: "none" });
}

area.addEventListener("touchstart", handleTouch);
area.addEventListener("touchmove", handleTouch);
area.addEventListener("touchend", endTouch);
area.addEventListener("touchcancel", endTouch);
