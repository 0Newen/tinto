/**
 * Spider / Radar chart — draws an animated SCA score chart on a canvas.
 * Reads from globalThis.PROFILE_DATA.scores
 */
globalThis.drawSpiderChart = function drawSpiderChart(canvas) {
  const DATA = globalThis.PROFILE_DATA;
  const isMobile = globalThis.innerWidth < 600;
  const SZ = isMobile ? Math.min(globalThis.innerWidth - 56, 260) : 280;
  canvas.width = SZ;
  canvas.height = SZ;

  const ctx = canvas.getContext('2d');
  const cx = SZ / 2;
  const cy = SZ / 2;
  const R = SZ * 0.36;
  const labels = DATA.scores.map((s) => s.label);
  const values = DATA.scores.map((s) => s.pts);
  const n = labels.length;
  const step = (Math.PI * 2) / n;
  const off = -Math.PI / 2;

  function draw(prog) {
    ctx.clearRect(0, 0, SZ, SZ);
    const ease = 1 - Math.pow(1 - prog, 3);

    // Grid rings
    [2, 4, 6, 8, 10].forEach((ring) => {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = off + i * step;
        const r = (ring / 10) * R;
        i === 0
          ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
          : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(44,24,16,0.2)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // Spokes
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = 'rgba(44,24,16,0.2)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const r = (values[i] / 10) * R * ease;
      i === 0
        ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
        : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(185,115,51,0.25)';
    ctx.fill();
    ctx.strokeStyle = '#B87333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dots
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const r = (values[i] / 10) * R * ease;
      ctx.beginPath();
      ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#E8C07A';
      ctx.fill();
    }

    // Labels
    ctx.font = "400 10px 'Jost',sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(44,24,16,0.85)';
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const lr = R + 20;
      ctx.fillText(labels[i].toUpperCase(), cx + lr * Math.cos(a), cy + lr * Math.sin(a) + 3);
    }
  }

  let prog = 0;
  function tick() {
    prog = Math.min(prog + 0.03, 1);
    draw(prog);
    if (prog < 1) requestAnimationFrame(tick);
  }
  setTimeout(tick, 400);
};
