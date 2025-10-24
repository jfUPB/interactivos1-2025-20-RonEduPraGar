const socket = io();
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const interactionStatus = document.getElementById("interactionStatus");

// Estado de interacción proveniente del móvil
let mobileInteraction = { type: "none", x: 0.5, y: 0.5 };
socket.on("mobileInteraction", data => {
  mobileInteraction = data;
  if (data.type === "attract") interactionStatus.textContent = "🧲 Atracción";
  else if (data.type === "repel") interactionStatus.textContent = "💥 Repulsión";
  else interactionStatus.textContent = "Sin interacción";
});

async function startCapture() {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });
    displayStream.getVideoTracks().forEach(t => t.stop());

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(displayStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    const sphereCount = 16;
    const spheres = Array.from({ length: sphereCount }, () => ({
      x: Math.random() * (canvas.width - 80) + 50,
      y: Math.random() * (canvas.height - 80) + 50,
      r: 14,
      amp: 0
    }));

    function drawVisualizer() {
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // Dibujar marco de área
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      for (let i = 0; i < spheres.length; i++) {
        const amp = dataArray[i * Math.floor(dataArray.length / sphereCount)] / 255;
        const s = spheres[i];
        s.r = 14 + amp * 50;

        // Movimiento aleatorio leve
        s.x += (Math.random() - 0.5) * 2;
        s.y += (Math.random() - 0.5) * 2;

        // --- Aplicar interacción móvil ---
        if (mobileInteraction.type !== "none") {
          const tx = mobileInteraction.x * canvas.width;
          const ty = mobileInteraction.y * canvas.height;
          const dx = tx - s.x;
          const dy = ty - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Fuerza más perceptible
          const intensity = mobileInteraction.type === "attract" ? 1.6 : -1.6;
          const falloff = Math.min(1, 200 / dist);
          s.x += (dx / dist) * intensity * falloff;
          s.y += (dy / dist) * intensity * falloff;

          // Indicador visual del punto de interacción
          if (i === 0) {
            ctx.beginPath();
            ctx.arc(tx, ty, 40, 0, Math.PI * 2);
            ctx.strokeStyle = mobileInteraction.type === "attract" ? "#00ffcc" : "#ff4444";
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }

        // Mantener dentro de límites
        s.x = Math.min(Math.max(s.x, 40), canvas.width - 40);
        s.y = Math.min(Math.max(s.y, 40), canvas.height - 40);

        const hue = (i * 30) % 360;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue},100%,50%)`;
        ctx.fill();
      }

      // Barra de diagnóstico de audio
      const barWidth = Math.min((avg / 255) * (canvas.width - 40), canvas.width - 40);
      ctx.fillStyle = avg > 10 ? "lime" : "red";
      ctx.fillRect(20, canvas.height - 30, barWidth, 10);

      // Texto de estado de audio
      ctx.font = "16px monospace";
      ctx.fillStyle = "white";
      ctx.fillText(
        avg > 10 ? `Audio detectado (${avg.toFixed(1)})` : "Esperando audio...",
        20,
        canvas.height - 40
      );

      requestAnimationFrame(drawVisualizer);
    }

    drawVisualizer();
  } catch (err) {
    console.error("Error al capturar audio:", err);
    alert("Error al capturar audio: " + err.message);
  }
}

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  startButton.textContent = "Capturando audio...";
  startCapture();
});
