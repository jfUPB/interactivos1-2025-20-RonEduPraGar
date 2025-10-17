const socket = io();

// Crear elementos visuales
const canvas = document.createElement("canvas");
document.body.style.margin = "0";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// Parámetros del analizador de audio
navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false } })
  .then(stream => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    // Esferas base para visualización local
    const sphereCount = 16;
    let spheres = Array.from({ length: sphereCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 10,
      freq: i,
      amp: 0,
    }));

    function drawVisualizer() {
      analyser.getByteFrequencyData(dataArray);

      // Normalización
      const freqs = Array.from(dataArray).map((amp, i) => ({
        freq: i * (audioCtx.sampleRate / analyser.fftSize),
        amp: amp / 255
      }));

      // Enviar datos al servidor
      socket.emit("frequencies", freqs);

      // Visualización local
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Delimitador visual del área de movimiento
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Dibujar esferas representando algunas frecuencias
      for (let i = 0; i < sphereCount; i++) {
        const f = freqs[i * Math.floor(bufferLength / sphereCount)];
        const s = spheres[i];

        s.amp = f ? f.amp : 0;
        s.r = 10 + s.amp * 40;

        // Movimiento suave limitado dentro del área
        s.x += (Math.random() - 0.5) * 4;
        s.y += (Math.random() - 0.5) * 4;

        s.x = Math.min(Math.max(s.x, 40), canvas.width - 40);
        s.y = Math.min(Math.max(s.y, 40), canvas.height - 40);

        const hue = (f.freq / 40) % 360;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
      }

      // Indicador de nivel general de audio
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const barHeight = (avg / 255) * 100;
      ctx.fillStyle = "lime";
      ctx.fillRect(20, canvas.height - 40, barHeight * 10, 10);

      requestAnimationFrame(drawVisualizer);
    }

    drawVisualizer();
  })
  .catch(err => {
    document.body.innerHTML = `<p style="color:red; font-family:sans-serif;">
      ❌ Error al acceder al micrófono o audio del sistema: ${err.message}
    </p>`;
    console.error(err);
  });
