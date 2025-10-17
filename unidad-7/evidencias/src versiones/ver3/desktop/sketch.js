const socket = io();

// Crear canvas
const canvas = document.createElement("canvas");
document.body.style.margin = "0";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// Iniciar captura de AUDIO DEL ESCRITORIO
async function initAudioCapture() {
  try {
    // Captura de pantalla con audio del escritorio
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    });

    // Ocultar el video si no se necesita mostrar
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const sphereCount = 16;
    let spheres = Array.from({ length: sphereCount }, (_, i) => ({
      x: Math.random() * (canvas.width - 80) + 40,
      y: Math.random() * (canvas.height - 80) + 40,
      r: 10,
      freq: 0,
      amp: 0
    }));

    function drawVisualizer() {
      analyser.getByteFrequencyData(dataArray);

      const freqs = Array.from(dataArray).map((amp, i) => ({
        freq: i * (audioCtx.sampleRate / analyser.fftSize),
        amp: amp / 255
      }));

      // Enviar frecuencias al servidor
      socket.emit("frequencies", freqs);

      // Dibujar fondo
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Área delimitada
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Dibujar esferas
      for (let i = 0; i < sphereCount; i++) {
        const f = freqs[i * Math.floor(bufferLength / sphereCount)];
        const s = spheres[i];

        s.amp = f ? f.amp : 0;
        s.r = 10 + s.amp * 40;

        // Movimiento suave dentro de los límites
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

      // Barra de nivel de audio general (para confirmar señal)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const barWidth = Math.min((avg / 255) * (canvas.width - 40), canvas.width - 40);
      ctx.fillStyle = "lime";
      ctx.fillRect(20, canvas.height - 30, barWidth, 10);

      // Indicador textual de nivel
      ctx.font = "16px monospace";
      ctx.fillStyle = "white";
      ctx.fillText(`Nivel de audio: ${avg.toFixed(1)}`, 20, canvas.height - 40);

      requestAnimationFrame(drawVisualizer);
    }

    drawVisualizer();

  } catch (err) {
    document.body.innerHTML = `
      <div style="color: red; font-family: sans-serif; padding: 20px;">
        ❌ Error al capturar audio del escritorio: ${err.message}<br><br>
        Consejo: selecciona una ventana o pestaña con audio activo.
      </div>`;
    console.error("Error de captura:", err);
  }
}

// Ejecutar
initAudioCapture();
