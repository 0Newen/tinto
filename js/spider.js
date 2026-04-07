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
  const labels = DATA.scores.map((s) => globalThis.I18N.t(s.label));
  const values = DATA.scores.map((s) => s.pts);
  const n = labels.length;
  const step = (Math.PI * 2) / n;
  const off = -Math.PI / 2;

  function draw(prog) {
    ctx.clearRect(0, 0, SZ, SZ);
    // Elastic ease-out for more satisfying reveal
    const t = prog < 1 ? 1 - Math.pow(1 - prog, 4) : 1;

    // Grid rings with fade-in
    const gridAlpha = Math.min(prog * 2, 1) * 0.2;
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
      ctx.strokeStyle = 'rgba(43,70,60,' + gridAlpha + ')';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // Spokes
    const spokeAlpha = Math.min(prog * 2, 1) * 0.2;
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = 'rgba(43,70,60,' + spokeAlpha + ')';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const r = (values[i] / 10) * R * t;
      i === 0
        ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
        : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(104,143,78,' + (0.25 * t) + ')';
    ctx.fill();
    ctx.strokeStyle = '#688F4E';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dots with glow
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const r = (values[i] / 10) * R * t;
      const dx = cx + r * Math.cos(a);
      const dy = cy + r * Math.sin(a);
      // Glow
      ctx.beginPath();
      ctx.arc(dx, dy, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(177,209,130,' + (0.25 * t) + ')';
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#B1D182';
      ctx.fill();
    }

    // Labels
    ctx.font = "400 10px 'Anonymous Pro',monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(43,70,60,0.85)';
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      const lr = R + 20;
      ctx.fillText(labels[i].toUpperCase(), cx + lr * Math.cos(a), cy + lr * Math.sin(a) + 3);
    }
  }

  let prog = 0;
  function tick() {
    prog = Math.min(prog + 0.02, 1);
    draw(prog);
    if (prog < 1) requestAnimationFrame(tick);
  }
  setTimeout(tick, 300);
};
