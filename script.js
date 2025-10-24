(function () {
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  const refreshBtn = document.getElementById("refreshBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const audioBtn = document.getElementById("audioBtn");
  const input = document.getElementById("inputCaptcha");
  const status = document.getElementById("status");
  const lengthSelect = document.getElementById("lengthSelect");

  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let current = "";

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickChars(len) {
    return Array.from(
      { length: len },
      () => CHARS[randInt(0, CHARS.length - 1)]
    ).join("");
  }

  function drawNoise() {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "#041024");
    g.addColorStop(1, "#052034");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(randInt(0, canvas.width), randInt(0, canvas.height));
      ctx.lineTo(randInt(0, canvas.width), randInt(0, canvas.height));
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }
  }

  function drawText(code) {
    ctx.globalAlpha = 1;
    const letters = code.split("");
    const pad = 20;
    const space = (canvas.width - pad * 2) / letters.length;

    letters.forEach((c, i) => {
      const fontSize = randInt(34, 54);
      ctx.font = `${fontSize}px sans-serif`;
      const x = pad + i * space + randInt(-6, 6);
      const y = randInt(canvas.height * 0.55, canvas.height * 0.75);
      const a = (Math.random() - 0.5) * 0.7;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(c, 0, 0);
      ctx.restore();
    });
  }

  function generate() {
    current = pickChars(Number(lengthSelect.value));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNoise();
    drawText(current);
    status.textContent = "";
  }

  function verify() {
    const v = (input.value || "").trim();
    if (!v) {
      status.textContent = "Enter the code";
      status.className = "status err";
      return;
    }
    if (v.toUpperCase() === current) {
      status.textContent = "Captcha correct";
      status.className = "status ok";
      setTimeout(generate, 500);
    } else {
      status.textContent = "Incorrect";
      status.className = "status err";
      setTimeout(generate, 700);
    }
  }

  function playAudio() {
    if (!("speechSynthesis" in window)) {
      status.textContent = "Audio not supported";
      status.className = "status err";
      return;
    }
    const u = new SpeechSynthesisUtterance(current.split("").join(" "));
    u.rate = 0.9;
    u.pitch = 0.7;
    u.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  refreshBtn.onclick = generate;
  verifyBtn.onclick = verify;
  clearBtn.onclick = () => {
    input.value = "";
    status.textContent = "";
  };
  audioBtn.onclick = playAudio;
  input.onkeydown = (e) => {
    if (e.key === "Enter") verify();
  };
  lengthSelect.onchange = generate;

  generate();
})();
