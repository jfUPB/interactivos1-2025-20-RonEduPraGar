const socket = io();

// Inicializar audio
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  function sendFrequencies() {
    analyser.getByteFrequencyData(dataArray);
    const freqs = Array.from(dataArray).map((amp, i) => ({
      freq: i * (audioCtx.sampleRate / analyser.fftSize),
      amp: amp / 255,
    }));
    socket.emit("frequencies", freqs);
    requestAnimationFrame(sendFrequencies);
  }

  sendFrequencies();
});
