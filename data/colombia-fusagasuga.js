/**
 * Perfil de café — Colombia · Fusagasugá
 * Cambiá este archivo (o agregá nuevos) para cada perfil de taza.
 * Datos de marca y contacto están en brand.js (compartido).
 */
globalThis.PROFILE_DATA = {
  variedad: 'Colombia',
  origen: 'Fusagasugá',
  region: 'Cundinamarca',
  altura: '1800 msnm',
  beneficio: 'Lavado',
  fechaTueste: '28 enero',
  caficultor: 'Daniel Lasso',

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

  quote: '\u201CDulce caramelo, sedoso, avellanas \u2014 naranja y tabaco dulce en el final.\u201D',

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
};
