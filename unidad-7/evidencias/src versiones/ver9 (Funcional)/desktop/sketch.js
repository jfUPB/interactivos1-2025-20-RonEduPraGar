const socket = io();
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");

async function startCapture() {
  console.log("Solicitando permiso de captura…");
  try {
    // Esta llamada sólo funciona si proviene de un gesto de usuario
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    // Detener el video inmediatamente; nos quedamos sólo con el audio
    displayStream.getVideoTracks().forEach(t => t.stop());

    const audioTracks = displayStream.getAudioTracks();
    if (audioTracks.length === 0) {
      alert("No se detectó audio del sistema. Elige una pestaña o ventana con sonido activo.");
      return;
    }

    console.log("✅ Captura iniciada:", audioTracks[0].label);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(new MediaStream(audioTracks));
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    drawVisualizer(analyser, dataArray, audioCtx);

  } catch (err) {
    console.error("❌ Error de captura:", err);
    alert("No se pudo iniciar la captura: " + err.message);
  }
}

function drawVisualizer(analyser, dataArray, audioCtx) {
  const sphereCount = 16;
  const spheres = Array.from({ length: sphereCount }, () => ({
    x: Math.random() * (canvas.width - 80) + 40,
    y: Math.random() * (canvas.height - 80) + 40,
    r: 10,
    amp: 0
  }));

  function loop() {
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const barWidth = Math.min((avg / 255) * (canvas.width - 40), canvas.width - 40);
    ctx.fillStyle = avg > 10 ? "lime" : "red";
    ctx.fillRect(20, canvas.height - 30, barWidth, 10);

    for (let i = 0; i < spheres.length; i++) {
      const amp = dataArray[i * Math.floor(dataArray.length / sphereCount)] / 255;
      const s = spheres[i];
      s.r = 10 + amp * 40;
      s.x += (Math.random() - 0.5) * 3;
      s.y += (Math.random() - 0.5) * 3;
      s.x = Math.min(Math.max(s.x, 40), canvas.width - 40);
      s.y = Math.min(Math.max(s.y, 40), canvas.height - 40);
      const hue = (i * 30) % 360;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue},100%,50%)`;
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  loop();
}

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  startButton.textContent = "Capturando audio...";
  startCapture(); // <- llamada dentro del click garantiza que Chrome muestre permisos
});
