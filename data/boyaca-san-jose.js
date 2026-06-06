/**
 * Perfil de café — Boyacá · San José
 * Variedad Castillo · Lavado · Finca Santamaría
 * Catación 8 may. — 84.50 pts
 */
(function () {
  'use strict';
  globalThis.PROFILES = globalThis.PROFILES || [];

  globalThis.PROFILES.push({
    id: 'boyaca',
    shortLabel: { es: 'Boyacá', en: 'Boyacá' },

    variedad: 'Castillo',
    origen: 'San José',
    region: 'Boyacá',
    altura: '1600 msnm',
    beneficio: 'Lavado',
    fechaTueste: '7 mayo',
    caficultor: 'Liliana Cárdenas',
    finca: 'Finca Santamaría',

    scoreTotal: 84.5,

    scores: [
      { label: 'Aroma', pts: 8 },
      { label: 'Sabor', pts: 8 },
      { label: 'Acidez', pts: 8 },
      { label: 'Cuerpo', pts: 8 },
      { label: 'Dulzura', pts: 8 },
      { label: 'Residual', pts: 8 },
      { label: 'Balance', pts: 8.5 },
      { label: 'Uniformidad', pts: 10 },
    ],

    quoteKey: 'quote_boyaca',

    chips: [
      { texto: 'Especias Marrones', primary: true },
      { texto: 'Frutos Rojos', primary: true },
      { texto: 'Nips de Cacao', primary: true },
      { texto: 'Caña de Azúcar', primary: false },
      { texto: 'Floral', primary: false },
      { texto: 'Frutal', primary: false },
      { texto: 'Jugoso', primary: false },
      { texto: 'Almibarado', primary: false },
      { texto: 'Dulce Mielado', primary: false },
    ],

    // Paleta "Cacao & Brasa" — cobre/ambar de alto contraste
    // para evitar el matiz rosado y mejorar lectura en la gráfica
    colorway: {
      accent:     '#A85E1F',
      accentSoft: 'rgba(168, 94, 31, 0.30)',
      accentGlow: '#E2B15A',
      accentInk:  '#2B463C',
    },

    i18n: {
      es: {
        quote_boyaca: '\u201CEspecias marrones, matiz a frutos rojos, nips de cacao \u2014 caña de azúcar en el final.\u201D',
        'Especias Marrones': 'Especias Marrones',
        'Frutos Rojos': 'Frutos Rojos',
        'Nips de Cacao': 'Nips de Cacao',
        'Caña de Azúcar': 'Caña de Azúcar',
        'Floral': 'Floral',
        'Frutal': 'Frutal',
        'Jugoso': 'Jugoso',
        'Almibarado': 'Almibarado',
        'Dulce Mielado': 'Dulce Mielado',
        'Lavado': 'Lavado',
        '1600 msnm': '1600 msnm',
        '7 mayo': '7 mayo',
      },
      en: {
        quote_boyaca: '\u201CBrown spices, hints of red fruits, cacao nibs \u2014 sugar cane in the finish.\u201D',
        'Especias Marrones': 'Brown Spices',
        'Frutos Rojos': 'Red Fruits',
        'Nips de Cacao': 'Cacao Nibs',
        'Caña de Azúcar': 'Sugar Cane',
        'Floral': 'Floral',
        'Frutal': 'Fruity',
        'Jugoso': 'Juicy',
        'Almibarado': 'Syrupy',
        'Dulce Mielado': 'Honeyed',
        'Lavado': 'Washed',
        '1600 msnm': '1600 masl',
        '7 mayo': 'May 7',
      },
    },
  });
})();
