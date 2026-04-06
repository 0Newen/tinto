/**
 * TINTO — App controller
 * Handles: DOM population, navigation, QR, vCard, fullscreen.
 * Depends on: globalThis.BRAND_DATA, globalThis.PROFILE_DATA, globalThis.drawSpiderChart
 */
(function () {
  'use strict';

  const BRAND = globalThis.BRAND_DATA;
  const PROFILE = globalThis.PROFILE_DATA;
  const DATA = Object.assign({}, BRAND, PROFILE);

  // ── Populate static DOM ──────────────────────────────────
  document.getElementById('s1Logo').textContent = DATA.marca;
  document.getElementById('s1Tagline').textContent = DATA.tagline;
  document.getElementById('s2Variedad').textContent = DATA.variedad;
  document.getElementById('s2Origen').textContent = DATA.origen;
  document.getElementById('s2Caficultor').textContent = DATA.caficultor;
  document.getElementById('s3Quote').textContent = DATA.quote;
  document.getElementById('s4Score').textContent = Number.parseFloat(DATA.scoreTotal.toFixed(2));
  document.getElementById('s5Name').textContent = DATA.marca;
  document.getElementById('s3Attr').textContent = DATA.variedad + ' \u00B7 ' + DATA.origen;

  // Facts (slide 2)
  const factsData = [
    { k: 'Región', v: DATA.region },
    { k: 'Altura', v: DATA.altura },
    { k: 'Beneficio', v: DATA.beneficio },
    { k: 'Tueste', v: DATA.fechaTueste },
  ];
  const factsEl = document.getElementById('s2Facts');
  factsData.forEach((f) => {
    const d = document.createElement('div');
    d.className = 's2-fact';
    d.innerHTML =
      '<span class="s2-fact-k">' + f.k + '</span><span class="s2-fact-v">' + f.v + '</span>';
    factsEl.appendChild(d);
  });

  // Chips (slide 3)
  const chipsEl = document.getElementById('s3Chips');
  DATA.chips.forEach((c) => {
    const el = document.createElement('span');
    el.className = 's3-chip' + (c.primary ? ' primary' : '');
    el.textContent = c.texto;
    chipsEl.appendChild(el);
  });

  // Score bars (slide 4)
  const barsEl = document.getElementById('s4Bars');
  DATA.scores.forEach((s) => {
    const row = document.createElement('div');
    row.className = 's4-bar-row';
    row.innerHTML =
      '<span class="s4-bar-lbl">' +
      s.label +
      '</span>' +
      '<div class="s4-bar-track"><div class="s4-bar-fill" data-pct="' +
      s.pts / 10 +
      '"></div></div>' +
      '<span class="s4-bar-pts">' +
      Number.parseFloat(s.pts.toFixed(2)) +
      '</span>';
    barsEl.appendChild(row);
  });

  // Contact items (slide 5)
  const contEl = document.getElementById('s5Contacts');
  [
    { k: 'Email', v: DATA.contacto.email },
    { k: 'Colombia', v: DATA.contacto.tel1 },
    { k: 'Argentina', v: DATA.contacto.tel2 },
    { k: 'Instagram', v: DATA.contacto.instagram },
  ].forEach((c) => {
    const div = document.createElement('div');
    div.className = 's5-contact-item';
    div.innerHTML =
      '<span class="s5-contact-k">' + c.k + '</span><span class="s5-contact-v">' + c.v + '</span>';
    contEl.appendChild(div);
  });

  // Decorative rings (slide 1)
  const ringsEl = document.getElementById('rings');
  [220, 320, 430, 560].forEach((d) => {
    const el = document.createElement('div');
    el.className = 's1-ring';
    el.style.cssText = 'width:' + d + 'px;height:' + d + 'px;';
    ringsEl.appendChild(el);
  });

  // ── Progress bar ─────────────────────────────────────────
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const progEl = document.getElementById('progress');
  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'prog-seg';
    seg.dataset.i = i;
    progEl.appendChild(seg);
  }

  // ── Navigation ───────────────────────────────────────────
  let current = 0;
  let isAnimating = false;

  function goTo(idx) {
    if (idx === current || isAnimating || idx < 0 || idx >= total) return;
    isAnimating = true;
    slides[current].classList.remove('active');
    current = idx;
    document.getElementById('deck').style.transform = 'translateX(-' + current * 100 + '%)';
    setTimeout(() => {
      slides[current].classList.add('active');
      onSlideEnter(current);
      isAnimating = false;
    }, 300);
    updateUI();
  }

  function updateUI() {
    document.getElementById('btnPrev').classList.toggle('hidden', current === 0);
    document.getElementById('btnNext').classList.toggle('hidden', current === total - 1);
    document.getElementById('counter').textContent = current + 1 + ' / ' + total;
    const segs = document.querySelectorAll('.prog-seg');
    for (let i = 0; i < segs.length; i++) {
      segs[i].classList.remove('done', 'active');
      if (i < current) segs[i].classList.add('done');
      if (i === current) segs[i].classList.add('active');
    }
  }

  let spiderDrawn = false;
  function onSlideEnter(idx) {
    if (idx === 3) {
      // Animate score bars
      setTimeout(() => {
        const fills = document.querySelectorAll('.s4-bar-fill');
        for (let i = 0; i < fills.length; i++) {
          fills[i].style.transform = 'scaleX(' + fills[i].dataset.pct + ')';
        }
      }, 300);
      // Draw spider once
      if (!spiderDrawn) {
        spiderDrawn = true;
        globalThis.drawSpiderChart(document.getElementById('spiderCanvas'));
      }
    }
  }

  // Arrow buttons
  document.getElementById('btnPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('btnNext').addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
  });

  // Touch: swipe + tap zones
  let touchX = 0,
    touchY = 0,
    touchT = 0;
  document.addEventListener(
    'touchstart',
    (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      touchT = Date.now();
    },
    { passive: true },
  );

  document.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      const dt = Date.now() - touchT;

      // Swipe (drag > 40px)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
        return;
      }

      // Tap (short touch, little movement)
      if (dt < 300 && Math.abs(dx) < 15 && Math.abs(dy) < 15) {
        if (e.target.closest('button, a, .s5-qr-wrap, .nav-btn')) return;
        const x = e.changedTouches[0].clientX;
        x > globalThis.innerWidth * 0.35 ? goTo(current + 1) : goTo(current - 1);
      }
    },
    { passive: true },
  );

  updateUI();

  // ── Fullscreen on first touch (mobile) ───────────────────
  function tryFullscreen() {
    const el = document.documentElement;
    const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (rfs) rfs.call(el).catch(() => {});
    document.removeEventListener('touchend', tryFullscreen);
  }
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.addEventListener('touchend', tryFullscreen, { once: true });
  }

  // ── QR + vCard ───────────────────────────────────────────
  globalThis.addEventListener('load', () => {
    const c = DATA.contacto;
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:' + DATA.marca,
      'EMAIL:' + c.email,
      'TEL;TYPE=CELL:' + c.tel1,
      'TEL;TYPE=CELL:' + c.tel2,
      'URL:https://instagram.com/' + c.instagram.replace('@', ''),
      'END:VCARD',
    ].join('\n');

    try {
      new QRCode(document.getElementById('qrHolder'), {
        text: vcard,
        width: 120,
        height: 120,
        colorDark: '#F4EDE0',
        colorLight: '#2C1810',
        correctLevel: QRCode.CorrectLevel.M,
      });
    } catch (err) {
      document.getElementById('qrHolder').innerHTML =
        '<div style="width:120px;height:120px;display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(244,237,224,0.4);letter-spacing:0.1em;">QR</div>';
    }

    // Save contact on QR tap
    document.getElementById('btnSaveContact').addEventListener('click', () => {
      const ct = DATA.contacto;
      const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:' + DATA.marca,
        'EMAIL:' + ct.email,
        'TEL;TYPE=CELL:' + ct.tel1,
        'TEL;TYPE=CELL:' + ct.tel2,
        'END:VCARD',
      ].join('\r\n');
      const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = DATA.marca + '.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
})();
