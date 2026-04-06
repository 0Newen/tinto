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
  document.getElementById('s4Score').textContent = '0';
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
  // Phones
  const phonesEl = document.getElementById('s5Phones');
  [
    { label: 'Colombia', v: DATA.contacto.tel1 },
    { label: 'Argentina', v: DATA.contacto.tel2 },
  ].forEach((p) => {
    const div = document.createElement('div');
    div.className = 's5-phone-row';
    div.innerHTML =
      '<span class="s5-phone-label">' + p.label + '</span>' +
      '<span class="s5-phone-num">' + p.v + '</span>';
    phonesEl.appendChild(div);
  });

  // Email (clickable)
  const emailEl = document.getElementById('s5Email');
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:' + DATA.contacto.email;
  emailLink.className = 's5-contact-link';
  emailLink.textContent = DATA.contacto.email;
  emailLink.target = '_blank';
  emailLink.rel = 'noopener noreferrer';
  emailEl.appendChild(emailLink);

  // Instagram (clickable)
  const igEl = document.getElementById('s5Instagram');
  const igLink = document.createElement('a');
  igLink.href = 'https://instagram.com/' + DATA.contacto.instagram.replace('@', '');
  igLink.className = 's5-contact-link';
  igLink.textContent = DATA.contacto.instagram;
  igLink.target = '_blank';
  igLink.rel = 'noopener noreferrer';
  igEl.appendChild(igLink);

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
    const segs = document.querySelectorAll('.prog-seg');
    for (let i = 0; i < segs.length; i++) {
      segs[i].classList.remove('done', 'active');
      if (i < current) segs[i].classList.add('done');
      if (i === current) segs[i].classList.add('active');
    }
  }

  let spiderDrawn = false;
  let scoreAnimated = false;

  function animateCountUp(el, target, duration) {
    el.classList.add('counting');
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * ease;
      el.textContent = current.toFixed(current % 1 === 0 ? 0 : 1);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = Number.parseFloat(target.toFixed(2));
        el.classList.remove('counting');
      }
    }
    requestAnimationFrame(step);
  }

  function onSlideEnter(idx) {
    if (idx === 3) {
      // Animate score bars with stagger
      var fills = document.querySelectorAll('.s4-bar-fill');
      for (var i = 0; i < fills.length; i++) {
        (function(fill, delay) {
          setTimeout(function() {
            fill.style.transform = 'scaleX(' + fill.dataset.pct + ')';
          }, delay);
        })(fills[i], 400 + i * 100);
      }
      // Count-up score number
      if (!scoreAnimated) {
        scoreAnimated = true;
        var scoreEl = document.getElementById('s4Score');
        animateCountUp(scoreEl, DATA.scoreTotal, 1800);
      }
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
  const vcardName = DATA.marca + ' \u2014 ' + DATA.tagline;

  globalThis.addEventListener('load', () => {
    const c = DATA.contacto;
    // Simplified vCard for QR (compact, no photo, ASCII-safe)
    const qrVcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:;;;;',
      'FN:TINTO - Tradicion y Especialidad',
      'ORG:TINTO - Tradicion y Especialidad',
      'X-ABShowAs:COMPANY',
      'EMAIL:' + c.email,
      'TEL:' + c.tel1,
      'TEL:' + c.tel2,
      'END:VCARD',
    ].join('\n');

    try {
      if (typeof QRCode === 'undefined') throw new Error('QRCode library not loaded');
      new QRCode(document.getElementById('qrHolder'), {
        text: qrVcard,
        width: 120,
        height: 120,
        colorDark: '#F4F1E9',
        colorLight: '#2B463C',
        correctLevel: QRCode.CorrectLevel.L,
      });
      // Remove tooltip that QRCode.js adds
      var qrImg = document.querySelector('#qrHolder img');
      if (qrImg) qrImg.removeAttribute('title');
    } catch (err) {
      console.error('QR generation failed:', err);
      document.getElementById('qrHolder').innerHTML =
        '<div style="width:120px;height:120px;display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(244,241,233,0.4);letter-spacing:0.1em;">QR</div>';
    }

    // Save contact on QR tap (includes photo)
    document.getElementById('btnSaveContact').addEventListener('click', () => {
      const ct = DATA.contacto;

      const photoUrl = DATA.contacto.foto || '';

      const vcfLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:;;;;',
        'FN:' + vcardName,
        'ORG:' + vcardName,
        'X-ABShowAs:COMPANY',
        'EMAIL:' + ct.email,
        'TEL;TYPE=CELL:' + ct.tel1,
        'TEL;TYPE=CELL:' + ct.tel2,
        'URL:https://instagram.com/' + ct.instagram.replace('@', ''),
      ];
      if (photoUrl) vcfLines.push('PHOTO;VALUE=URI:' + photoUrl);
      vcfLines.push('END:VCARD');

      const vcf = vcfLines.join('\r\n');
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
