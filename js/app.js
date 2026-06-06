/**
 * TINTO — App controller
 * Handles: DOM population, navigation, QR, vCard, fullscreen, profile switching.
 * Depends on: globalThis.BRAND_DATA, globalThis.PROFILES, globalThis.drawSpiderChart
 */
(function () {
  'use strict';

  const BRAND = globalThis.BRAND_DATA;
  const PROFILES = globalThis.PROFILES || [];
  const t = globalThis.I18N.t;

  if (!PROFILES.length) {
    console.error('TINTO: no profiles registered');
    return;
  }

  // ── Active profile state ──────────────────────────────────
  let activeProfileId = null;
  try {
    const stored = localStorage.getItem('tinto-profile');
    if (stored && PROFILES.some((p) => p.id === stored)) activeProfileId = stored;
  } catch (_) {}
  if (!activeProfileId) activeProfileId = PROFILES[0].id;

  function getActiveProfile() {
    return PROFILES.find((p) => p.id === activeProfileId) || PROFILES[0];
  }

  // Expose for spider.js (legacy global)
  function syncLegacyGlobal() {
    globalThis.PROFILE_DATA = getActiveProfile();
  }
  syncLegacyGlobal();

  // ── Apply colorway as CSS variables ──────────────────────
  function applyColorway(profile) {
    const cw = profile.colorway || {};
    const root = document.documentElement;
    root.style.setProperty('--accent',      cw.accent     || '#688F4E');
    root.style.setProperty('--accent-soft', cw.accentSoft || 'rgba(104,143,78,0.25)');
    root.style.setProperty('--accent-glow', cw.accentGlow || '#B1D182');
    root.style.setProperty('--accent-ink',  cw.accentInk  || '#2B463C');
    root.setAttribute('data-profile', profile.id);
  }

  // ── Register the profile's per-locale strings into i18n ──
  function registerProfileI18n(profile) {
    if (profile.i18n && globalThis.I18N.registerProfileStrings) {
      globalThis.I18N.registerProfileStrings(profile.i18n);
    }
  }

  // ── Render slides 2-4 from a profile ─────────────────────
  function renderProfile(profile) {
    const DATA = Object.assign({}, BRAND, profile);

    // Slide 2 — Origen
    document.getElementById('s2Variedad').textContent = DATA.variedad;
    document.getElementById('s2Origen').textContent   = DATA.origen;
    document.getElementById('s2Caficultor').textContent = DATA.caficultor;

    // Optional farm sub-line
    const subEl = document.getElementById('s2CafSub');
    if (subEl) {
      const parts = [];
      if (DATA.finca) parts.push(t('farmLabel') + ': ' + DATA.finca);
      subEl.textContent = parts.join('  ·  ');
      subEl.style.display = parts.length ? '' : 'none';
    }

    // Facts grid
    const factKeys = ['factRegion', 'factAltitude', 'factProcess', 'factRoast'];
    const factVals = [DATA.region, DATA.altura, DATA.beneficio, DATA.fechaTueste];
    const factsEl = document.getElementById('s2Facts');
    factsEl.innerHTML = '';
    factKeys.forEach(function (key, i) {
      const d = document.createElement('div');
      d.className = 's2-fact';
      d.innerHTML =
        '<span class="s2-fact-k" data-i18n="' + key + '">' + t(key) + '</span>' +
        '<span class="s2-fact-v" data-i18n="' + factVals[i] + '">' + t(factVals[i]) + '</span>';
      factsEl.appendChild(d);
    });

    // Slide 3 — Quote + chips
    const quoteKey = DATA.quoteKey || 'quote';
    const quoteEl = document.getElementById('s3Quote');
    quoteEl.setAttribute('data-i18n', quoteKey);
    quoteEl.textContent = t(quoteKey);

    const chipsEl = document.getElementById('s3Chips');
    chipsEl.innerHTML = '';
    DATA.chips.forEach((c) => {
      const el = document.createElement('span');
      el.className = 's3-chip' + (c.primary ? ' primary' : '');
      el.textContent = t(c.texto);
      el.setAttribute('data-i18n', c.texto);
      chipsEl.appendChild(el);
    });

    // Slide 4 — Score bars
    const barsEl = document.getElementById('s4Bars');
    barsEl.innerHTML = '';
    DATA.scores.forEach((s) => {
      const row = document.createElement('div');
      row.className = 's4-bar-row';
      row.innerHTML =
        '<span class="s4-bar-lbl" data-i18n="' + s.label + '">' + t(s.label) + '</span>' +
        '<div class="s4-bar-track"><div class="s4-bar-fill" data-pct="' + (s.pts / 10) + '"></div></div>' +
        '<span class="s4-bar-pts">' + Number.parseFloat(s.pts.toFixed(2)) + '</span>';
      barsEl.appendChild(row);
    });

    // Reset score number
    document.getElementById('s4Score').textContent = '0';
  }

  // ── Static brand DOM ─────────────────────────────────────
  document.getElementById('s1Logo').textContent = BRAND.marca;
  document.getElementById('s1Tagline').textContent = t('tagline');
  document.getElementById('s5Name').textContent = BRAND.marca;
  document.getElementById('s3Attr').textContent = '';

  // Initial apply
  const initialProfile = getActiveProfile();
  registerProfileI18n(initialProfile);
  applyColorway(initialProfile);
  renderProfile(initialProfile);

  // Contact items (slide 5) — once, brand-level
  const phonesEl = document.getElementById('s5Phones');
  [{ label: 'phoneArgentina', v: BRAND.contacto.tel2 }].forEach((p) => {
    const div = document.createElement('div');
    div.className = 's5-phone-row';
    div.innerHTML =
      '<span class="s5-phone-label" data-i18n="' + p.label + '">' + t(p.label) + '</span>' +
      '<span class="s5-phone-num">' + p.v + '</span>';
    phonesEl.appendChild(div);
  });

  const emailEl = document.getElementById('s5Email');
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:' + BRAND.contacto.email;
  emailLink.className = 's5-contact-link';
  emailLink.textContent = BRAND.contacto.email;
  emailLink.target = '_blank';
  emailLink.rel = 'noopener noreferrer';
  emailEl.appendChild(emailLink);

  const igEl = document.getElementById('s5Instagram');
  const igLink = document.createElement('a');
  igLink.href = 'https://instagram.com/' + BRAND.contacto.instagram.replace('@', '');
  igLink.className = 's5-contact-link';
  igLink.textContent = BRAND.contacto.instagram;
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
  const themeColors = ['#2B463C', '#F4F1E9', '#2B463C', '#F4F1E9', '#2B463C'];
  const themeMeta = document.querySelector('meta[name="theme-color"]');

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
    if (themeMeta) themeMeta.setAttribute('content', themeColors[current] || '#2B463C');
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
    const start = 0;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const cur = start + (target - start) * ease;
      el.textContent = cur.toFixed(cur % 1 === 0 ? 0 : 1);
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
      const fills = document.querySelectorAll('.s4-bar-fill');
      // Reset (for profile re-render)
      for (let i = 0; i < fills.length; i++) fills[i].style.transform = 'scaleX(0)';
      for (let i = 0; i < fills.length; i++) {
        (function(fill, delay) {
          setTimeout(function() {
            fill.style.transform = 'scaleX(' + fill.dataset.pct + ')';
          }, delay);
        })(fills[i], 400 + i * 100);
      }
      if (!scoreAnimated) {
        scoreAnimated = true;
        const scoreEl = document.getElementById('s4Score');
        animateCountUp(scoreEl, getActiveProfile().scoreTotal, 1800);
      }
      if (!spiderDrawn) {
        spiderDrawn = true;
        const canvas = document.getElementById('spiderCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        globalThis.drawSpiderChart(canvas);
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
  let touchX = 0, touchY = 0, touchT = 0;
  document.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touchT = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    const dt = Date.now() - touchT;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
      return;
    }

    if (dt < 300 && Math.abs(dx) < 15 && Math.abs(dy) < 15) {
      if (e.target.closest('button, a, .s5-qr-wrap, .nav-btn, .profile-switch')) return;
      const x = e.changedTouches[0].clientX;
      x > globalThis.innerWidth * 0.35 ? goTo(current + 1) : goTo(current - 1);
    }
  }, { passive: true });

  updateUI();

  // ── Profile switcher UI ──────────────────────────────────
  const switchEl = document.getElementById('profileSwitch');
  function buildProfileSwitch() {
    if (!switchEl) return;
    switchEl.innerHTML = '';
    const lang = globalThis.I18N.getLang();
    PROFILES.forEach(function (p) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-opt';
      btn.dataset.profile = p.id;
      btn.textContent = (p.shortLabel && p.shortLabel[lang]) || p.origen;
      btn.addEventListener('click', function () { setActiveProfile(p.id); });
      switchEl.appendChild(btn);
    });
    updateProfileSwitchUI();
  }
  function updateProfileSwitchUI() {
    if (!switchEl) return;
    const opts = switchEl.querySelectorAll('.profile-opt');
    for (let i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('active', opts[i].dataset.profile === activeProfileId);
    }
  }
  buildProfileSwitch();

  // ── Profile switch (depends on slides + onSlideEnter) ────
  function setActiveProfile(id) {
    if (id === activeProfileId) return;
    const profile = PROFILES.find((p) => p.id === id);
    if (!profile) return;
    activeProfileId = id;
    try { localStorage.setItem('tinto-profile', id); } catch (_) {}

    registerProfileI18n(profile);
    syncLegacyGlobal();
    applyColorway(profile);
    renderProfile(profile);
    updateProfileSwitchUI();

    // Reset animation flags so slide 4 replays
    spiderDrawn = false;
    scoreAnimated = false;

    // Replay slide animations if visible
    const cur = slides[current];
    if (cur) {
      cur.classList.remove('active');
      void cur.offsetWidth;
      cur.classList.add('active');
      onSlideEnter(current);
    }
  }

  // ── Fullscreen on first touch (mobile) ───────────────────
  function tryFullscreen() {
    const el = document.documentElement;
    const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (rfs) rfs.call(el).catch(() => {});
  }

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.addEventListener('touchend', function onFirstTouch() {
      tryFullscreen();
      document.removeEventListener('touchend', onFirstTouch);
    }, { once: true });
  }

  // ── QR + vCard ───────────────────────────────────────────
  const vcardName = BRAND.marca + ' \u2014 ' + BRAND.tagline;

  globalThis.addEventListener('load', () => {
    const c = BRAND.contacto;
    const qrVcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:;;;;',
      'FN:TINTO - Tradicion y Especialidad',
      'ORG:TINTO - Tradicion y Especialidad',
      'X-ABShowAs:COMPANY',
      'EMAIL:' + c.email,
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
      const qrImg = document.querySelector('#qrHolder img');
      if (qrImg) qrImg.removeAttribute('title');
    } catch (err) {
      console.error('QR generation failed:', err);
      document.getElementById('qrHolder').innerHTML =
        '<div style="width:120px;height:120px;display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(244,241,233,0.4);letter-spacing:0.1em;">QR</div>';
    }

    document.getElementById('btnSaveContact').addEventListener('click', () => {
      const ct = BRAND.contacto;
      const photoUrl = BRAND.contacto.foto || '';
      const vcfLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:;;;;',
        'FN:' + vcardName,
        'ORG:' + vcardName,
        'X-ABShowAs:COMPANY',
        'EMAIL:' + ct.email,
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
      a.download = BRAND.marca + '.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });

  // ── Language toggle ──────────────────────────────────────
  document.getElementById('langToggle').addEventListener('click', function () {
    const lang = globalThis.I18N.getLang() === 'es' ? 'en' : 'es';
    globalThis.I18N.setLang(lang);
  });

  globalThis.I18N.onLangChange(function () {
    // Rebuild switcher labels (locale-aware)
    buildProfileSwitch();
    // Redraw spider with translated labels
    spiderDrawn = false;
    const canvas = document.getElementById('spiderCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (current === 3) {
      spiderDrawn = true;
      globalThis.drawSpiderChart(canvas);
    }
    // Rebuild caficultor sub-line (labels are localized)
    const subEl = document.getElementById('s2CafSub');
    if (subEl) {
      const ap = getActiveProfile();
      const parts = [];
      if (ap.finca) parts.push(t('farmLabel') + ': ' + ap.finca);
      subEl.textContent = parts.join('  ·  ');
    }
  });

  // ── Links ─────────────────────────────────────────────────
  document.getElementById('goToContact').addEventListener('click', function (e) {
    e.preventDefault();
    goTo(total - 1);
  });

  document.getElementById('goToStart').addEventListener('click', function (e) {
    e.preventDefault();
    goTo(0);
  });

  if (location.hash === '#contacto') {
    setTimeout(function () { goTo(total - 1); }, 400);
  }
})();
