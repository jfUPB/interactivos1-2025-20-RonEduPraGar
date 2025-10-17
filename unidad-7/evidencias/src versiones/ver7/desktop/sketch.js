const socket = io();

// Crear canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Usar el botón existente en el HTML
const startButton = document.getElementById("startButton");

async function initAudioCapture() {
  try {
    let stream;

    // 🟢 Intentar capturar audio del escritorio o pestaña con audio
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: undefined,
          }
        }
      });
      console.log("✅ Captura de escritorio iniciada");
    } catch (err) {
      console.warn("⚠️ No se pudo capturar escritorio, intentando micrófono:", err);
      // 🟡 Fallback: usar micrófono si no se permite el escritorio
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      console.log("🎤 Captura de micrófono iniciada");
    }

    // Crear contexto y analizador
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const sphereCount = 16;
    let spheres = Array.from({ length: sphereCount }, () => ({
      x: Math.random() * (canvas.width - 80) + 40,
      y: Math.random() * (canvas.height - 80) + 40,
      r: 10,
      amp: 0
    }));

    function drawVisualizer() {
      analyser.getByteFrequencyData(dataArray);

      const freqs = Array.from(dataArray).map((amp, i) => ({
        freq: i * (audioCtx.sampleRate / analyser.fftSize),
        amp: amp / 255
      }));

      socket.emit("frequencies", freqs);

      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      for (let i = 0; i < sphereCount; i++) {
        const f = freqs[i * Math.floor(bufferLength / sphereCount)];
        const s = spheres[i];

        s.amp = f ? f.amp : 0;
        s.r = 10 + s.amp * 40;

        s.x += (Math.random() - 0.5) * 3;
        s.y += (Math.random() - 0.5) * 3;
        s.x = Math.min(Math.max(s.x, 40), canvas.width - 40);
        s.y = Math.min(Math.max(s.y, 40), canvas.height - 40);

        const hue = (f.freq / 40) % 360;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
      }

      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const barWidth = Math.min((avg / 255) * (canvas.width - 40), canvas.width - 40);
      ctx.fillStyle = avg > 10 ? "lime" : "red";
      ctx.fillRect(20, canvas.height - 30, barWidth, 10);

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
    document.body.innerHTML = `
      <div style="color: red; font-family: sans-serif; padding: 20px;">
        ❌ Error al capturar audio: ${err.message}<br><br>
        Consejo: selecciona una pestaña o ventana con audio activo.
      </div>`;
    console.error("Error de captura:", err);
  }
}

// Inicia la captura al hacer clic en el botón
startButton.addEventListener("click", () => {
  initAudioCapture();
  startButton.disabled = true;
  startButton.textContent = "Capturando audio...";
});
