# TINTO — Perfiles de Café de Especialidad

Presentación interactiva tipo story para perfiles de taza de café de especialidad.

## Estructura

```text
tinto/
├── index.html              ← Template HTML (agnóstico al perfil)
├── timeline.html           ← Historia / editorial scroll
├── manifest.json           ← PWA manifest
├── favicon.svg             ← Ícono SVG
├── css/
│   ├── styles.css          ← Estilos globales (perfil)
│   └── timeline.css        ← Estilos del timeline
├── js/
│   ├── app.js              ← Navegación, DOM, eventos, QR, vCard
│   ├── spider.js           ← Gráfico radar (canvas, aislado)
│   ├── i18n.js             ← Internacionalización ES/EN
│   └── timeline.js         ← Scroll y animaciones del timeline
├── data/
│   ├── brand.js            ← Marca y contacto (compartido, no cambia)
│   └── colombia-fusagasuga.js  ← Perfil de taza (único por café)
├── img/                    ← Imágenes del timeline
└── README.md
```

## Agregar un nuevo perfil

1. Copiá `data/colombia-fusagasuga.js` → `data/nuevo-perfil.js`
2. Editá solo los datos de taza (origen, scores, chips, etc.)
3. En `index.html`, cambiá la línea del script de perfil:

   ```html
   <script src="data/nuevo-perfil.js"></script>
   ```

4. `data/brand.js` (marca, contacto) se comparte — no lo dupliques.

## Tecnologías

- **Vanilla HTML / CSS / JS** — Sin framework, sin build tools
- **Google Fonts** — Anonymous Pro
- **QRCode.js** — Generación de QR para vCard
- **Canvas API** — Gráfico spider/radar para puntajes SCA
- **Web App Manifest** — Experiencia standalone en mobile

## Principios

- **KISS** — Estructura mínima, sin capas innecesarias
- **YAGNI** — Solo lo necesario; sin bundler ni framework
- **DRY** — Los datos viven en un solo archivo por perfil; estilos y lógica son compartidos

## Deploy (GitHub Pages)

1. Subí el repositorio a GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. La URL será `https://<usuario>.github.io/tinto/`

## Características

- 5 slides: Marca → Origen → Notas de Sabor → Puntuación SCA → Contacto
- Internacionalización ES/EN con toggle
- Navegación: teclado (flechas), swipe, tap zones
- Gráfico radar animado con puntajes SCA
- QR con vCard descargable al tocar
- Overlay para modo horizontal en mobile
- Soporte fullscreen (PWA standalone)
- Timeline editorial con scroll (Nuestra Historia)
