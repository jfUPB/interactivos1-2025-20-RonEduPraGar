const socket = io();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let spheres = [];

socket.on("updateFrequencies", (data) => {
  spheres = data.map((f, i) => ({
    id: i,
    freq: f.freq,
    amp: f.amp,
    x: Math.sin(i) * 100 + canvas.width/2,
    y: Math.cos(i) * 100 + canvas.height/2,
  }));
});

canvas.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  // ejemplo simple: mover esfera activa
  socket.emit("sphereMove", { id: 0, x: t.clientX, y: t.clientY });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spheres.forEach(s => {
    const radius = 10 + s.amp * 50;
    const color = `hsl(${s.freq/50}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();
