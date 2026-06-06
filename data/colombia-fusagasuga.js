/**
 * Perfil de café — Colombia · Fusagasugá
 * Cada perfil se auto-registra en globalThis.PROFILES.
 * Datos de marca y contacto están en brand.js (compartido).
 */
(function () {
  'use strict';
  globalThis.PROFILES = globalThis.PROFILES || [];

  globalThis.PROFILES.push({
    id: 'fusagasuga',
    shortLabel: { es: 'Fusagasugá', en: 'Fusagasugá' },

    variedad: 'Colombia',
    origen: 'Fusagasugá',
    region: 'Cundinamarca',
    altura: '1800 msnm',
    beneficio: 'Lavado',
    fechaTueste: '28 enero',
    caficultor: 'Daniel Lasso',
    finca: '',
    tostador: '',

    scoreTotal: 85,

    scores: [
      { label: 'Aroma', pts: 8 },
      { label: 'Sabor', pts: 8.25 },
      { label: 'Acidez', pts: 8 },
      { label: 'Cuerpo', pts: 8.25 },
      { label: 'Dulzura', pts: 8.25 },
      { label: 'Residual', pts: 8 },
      { label: 'Balance', pts: 8 },
      { label: 'Uniformidad', pts: 10 },
    ],

    quoteKey: 'quote_fusagasuga',

    chips: [
      { texto: 'Caramelo', primary: true },
      { texto: 'Avellanas', primary: true },
      { texto: 'Naranja', primary: false },
      { texto: 'Tabaco Dulce', primary: false },
      { texto: 'Frutal', primary: false },
      { texto: 'Jugoso', primary: false },
      { texto: 'Brillante', primary: false },
      { texto: 'Sedoso', primary: false },
      { texto: 'Almibarado', primary: false },
    ],

    // Paleta "Hoja & Caña" (verde-oliva, identidad TINTO original)
    colorway: {
      accent:     '#688F4E',
      accentSoft: 'rgba(104, 143, 78, 0.25)',
      accentGlow: '#B1D182',
      accentInk:  '#2B463C',
    },

    i18n: {
      es: {
        quote_fusagasuga: '\u201CDulce caramelo, sedoso, avellanas \u2014 naranja y tabaco dulce en el final.\u201D',
        'Caramelo': 'Caramelo',
        'Avellanas': 'Avellanas',
        'Naranja': 'Naranja',
        'Tabaco Dulce': 'Tabaco Dulce',
        'Frutal': 'Frutal',
        'Jugoso': 'Jugoso',
        'Brillante': 'Brillante',
        'Sedoso': 'Sedoso',
        'Almibarado': 'Almibarado',
        'Lavado': 'Lavado',
        '1800 msnm': '1800 msnm',
        '28 enero': '28 enero',
      },
      en: {
        quote_fusagasuga: '\u201CSweet caramel, silky, hazelnuts \u2014 orange and sweet tobacco in the finish.\u201D',
        'Caramelo': 'Caramel',
        'Avellanas': 'Hazelnuts',
        'Naranja': 'Orange',
        'Tabaco Dulce': 'Sweet Tobacco',
        'Frutal': 'Fruity',
        'Jugoso': 'Juicy',
        'Brillante': 'Bright',
        'Sedoso': 'Silky',
        'Almibarado': 'Syrupy',
        'Lavado': 'Washed',
        '1800 msnm': '1800 masl',
        '28 enero': 'January 28',
      },
    },
  });
})();
