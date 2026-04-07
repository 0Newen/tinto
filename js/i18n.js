/**
 * TINTO — Internationalization (i18n)
 * Provides ES/EN translations and language switching.
 * Must be loaded before app.js and spider.js.
 */
(function () {
  'use strict';

  const translations = {
    es: {
      // Page
      pageTitle: 'TINTO \u2014 Tradici\u00F3n y Especialidad',

      // Landscape overlay
      rotateTitle: 'Gir\u00E1 tu pantalla',
      rotateSub: 'Para una mejor experiencia us\u00E1 modo horizontal',

      // Nav
      navPrev: 'Anterior',
      navNext: 'Siguiente',

      // Slide 1
      eyebrow: 'Caf\u00E9 de Especialidad',
      tagline: 'Tradici\u00F3n y Especialidad',
      explore: 'Toc\u00E1 o desliz\u00E1 para explorar \u2192',
      ourStory: 'Nuestra Historia \u2193',

      // Slide 2
      origin: 'Origen',
      farmerLabel: 'Caficultor',
      factRegion: 'Regi\u00F3n',
      factAltitude: 'Altura',
      factProcess: 'Beneficio',
      factRoast: 'Tueste',

      // Slide 3
      flavorProfile: 'Perfil de Sabor',

      // Slide 4
      scaScore: 'Puntuaci\u00F3n SCA',
      specialtyCoffee: 'Specialty Coffee',

      // Slide 5
      contact: 'Contacto',
      tapToSave: 'Toc\u00E1 para guardar contacto',
      scanQr: 'O escane\u00E1 el QR desde otro dispositivo',
      phones: 'Tel\u00E9fonos',
      email: 'Email',
      instagram: 'Instagram',
      phoneColombia: 'Colombia',
      phoneArgentina: 'Argentina',

      // iOS install hint
      iosInstallHint: 'Para pantalla completa: Compartir \u2192 Agregar a inicio',

      // SCA score labels (keyed by original Spanish)
      'Aroma': 'Aroma',
      'Sabor': 'Sabor',
      'Acidez': 'Acidez',
      'Cuerpo': 'Cuerpo',
      'Dulzura': 'Dulzura',
      'Residual': 'Residual',
      'Balance': 'Balance',
      'Uniformidad': 'Uniformidad',

      // Chip labels (keyed by original Spanish)
      'Caramelo': 'Caramelo',
      'Avellanas': 'Avellanas',
      'Naranja': 'Naranja',
      'Tabaco Dulce': 'Tabaco Dulce',
      'Frutal': 'Frutal',
      'Jugoso': 'Jugoso',
      'Brillante': 'Brillante',
      'Sedoso': 'Sedoso',
      'Almibarado': 'Almibarado',

      // Quote
      quote: '\u201CDulce caramelo, sedoso, avellanas \u2014 naranja y tabaco dulce en el final.\u201D',

      // Data values that need translation
      'Lavado': 'Lavado',
      '1800 msnm': '1800 msnm',
      '28 enero': '28 enero',
    },

    en: {
      // Page
      pageTitle: 'TINTO \u2014 Tradition & Specialty',

      // Landscape overlay
      rotateTitle: 'Rotate your screen',
      rotateSub: 'For a better experience use landscape mode',

      // Nav
      navPrev: 'Previous',
      navNext: 'Next',

      // Slide 1
      eyebrow: 'Specialty Coffee',
      tagline: 'Tradition & Specialty',
      explore: 'Tap or swipe to explore \u2192',
      ourStory: 'Our Story \u2193',

      // Slide 2
      origin: 'Origin',
      farmerLabel: 'Coffee Grower',
      factRegion: 'Region',
      factAltitude: 'Altitude',
      factProcess: 'Process',
      factRoast: 'Roast',

      // Slide 3
      flavorProfile: 'Flavor Profile',

      // Slide 4
      scaScore: 'SCA Score',
      specialtyCoffee: 'Specialty Coffee',

      // Slide 5
      contact: 'Contact',
      tapToSave: 'Tap to save contact',
      scanQr: 'Or scan the QR from another device',
      phones: 'Phones',
      email: 'Email',
      instagram: 'Instagram',
      phoneColombia: 'Colombia',
      phoneArgentina: 'Argentina',

      // iOS install hint
      iosInstallHint: 'For fullscreen: Share \u2192 Add to Home Screen',

      // SCA score labels
      'Aroma': 'Aroma',
      'Sabor': 'Flavor',
      'Acidez': 'Acidity',
      'Cuerpo': 'Body',
      'Dulzura': 'Sweetness',
      'Residual': 'Aftertaste',
      'Balance': 'Balance',
      'Uniformidad': 'Uniformity',

      // Chip labels
      'Caramelo': 'Caramel',
      'Avellanas': 'Hazelnuts',
      'Naranja': 'Orange',
      'Tabaco Dulce': 'Sweet Tobacco',
      'Frutal': 'Fruity',
      'Jugoso': 'Juicy',
      'Brillante': 'Bright',
      'Sedoso': 'Silky',
      'Almibarado': 'Syrupy',

      // Quote
      quote: '\u201CSweet caramel, silky, hazelnuts \u2014 orange and sweet tobacco in the finish.\u201D',

      // Data values
      'Lavado': 'Washed',
      '1800 msnm': '1800 masl',
      '28 enero': 'January 28',
    },
  };

  let currentLang = 'es';
  try {
    const stored = localStorage.getItem('tinto-lang');
    if (stored && translations[stored]) currentLang = stored;
  } catch (_) {}

  const changeCallbacks = [];

  function t(key) {
    const dict = translations[currentLang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (!translations[lang] || lang === currentLang) return;
    currentLang = lang;
    try { localStorage.setItem('tinto-lang', lang); } catch (_) {}
    document.documentElement.lang = lang;
    document.title = t('pageTitle');

    // Update all data-i18n text elements
    const els = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < els.length; i++) {
      els[i].textContent = t(els[i].getAttribute('data-i18n'));
    }

    // Update all data-i18n-aria elements
    const ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (let j = 0; j < ariaEls.length; j++) {
      ariaEls[j].setAttribute('aria-label', t(ariaEls[j].getAttribute('data-i18n-aria')));
    }

    // Update toggle button UI
    const opts = document.querySelectorAll('.lang-opt');
    for (let k = 0; k < opts.length; k++) {
      opts[k].classList.toggle('active', opts[k].dataset.lang === lang);
    }

    // Notify subscribers
    for (let c = 0; c < changeCallbacks.length; c++) {
      changeCallbacks[c](lang);
    }
  }

  function onLangChange(cb) {
    changeCallbacks.push(cb);
  }

  // Apply initial lang on DOMContentLoaded
  function applyInitial() {
    document.documentElement.lang = currentLang;
    document.title = t('pageTitle');
    if (currentLang !== 'es') {
      const els = document.querySelectorAll('[data-i18n]');
      for (let i = 0; i < els.length; i++) {
        els[i].textContent = t(els[i].getAttribute('data-i18n'));
      }
      const ariaEls = document.querySelectorAll('[data-i18n-aria]');
      for (let j = 0; j < ariaEls.length; j++) {
        ariaEls[j].setAttribute('aria-label', t(ariaEls[j].getAttribute('data-i18n-aria')));
      }
    }
    const opts = document.querySelectorAll('.lang-opt');
    for (let k = 0; k < opts.length; k++) {
      opts[k].classList.toggle('active', opts[k].dataset.lang === currentLang);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyInitial);
  } else {
    applyInitial();
  }

  globalThis.I18N = {
    t: t,
    getLang: getLang,
    setLang: setLang,
    onLangChange: onLangChange,
  };
})();
