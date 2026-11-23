# Ubuntu junto a Windows

**Guía paso a paso para instalar Ubuntu 26.04 LTS junto a Windows (arranque dual) sin perderlo, pensada para seguirla desde el móvil mientras el PC instala.**

La instalación se dibuja como el croquis de una vía de escalada: ocho largos (descargar, preparar Windows, crear el USB, arrancar del USB, instalar, primer arranque, herramientas y qué arranca por defecto), reuniones donde se puede parar sin riesgo, un doble trazo en el único punto sin vuelta atrás fácil y una línea de descenso discontinua para deshacerlo todo. Cada paso se marca; la cuerda baja por el margen hasta la última casilla marcada.

En local: `npm run dev` (http://127.0.0.1:8100/proyecto/arranque-dual/). Destino previsto: `pedrogomez.dev/proyecto/arranque-dual` (sin publicar todavía).

## Qué hace

- **Progreso en el dispositivo.** Las casillas se guardan en `localStorage`, sin cuentas ni cookies. Al volver, «Lo dejaste en el largo n» enlaza con el primer paso sin marcar.
- **Pasar el progreso a otro dispositivo.** Un enlace con `#progreso=1-1.1-2...` suma los pasos hechos en el otro navegador; útil para abrir la guía en Firefox dentro del Ubuntu recién instalado y copiar las órdenes.
- **Calculadora del hueco.** Con el tamaño y el libre de `C:` dice cuántos GB dar a Ubuntu y cuántos MB escribir en «Reducir volumen» (regla: a Windows le quedan libres 60 GB o el 15 % de `C:`, lo que sea más; a Ubuntu, el resto hasta 200 GB).
- **Pantalla encendida** con la Screen Wake Lock API, donde el navegador la tenga.
- **Copiar órdenes** con un toque.
- Sin JavaScript se lee entera; con `prefers-reduced-motion` no hay transiciones. Tema claro y oscuro según el sistema.

No aloja la ISO ni ningún binario (la imagen pesa unos 6 GB y los Workers admiten 25 MiB por archivo): solo enlaces a las páginas oficiales, comprobadas el 23 de noviembre de 2026.

## Cómo está hecho

HTML, CSS y JavaScript sin frameworks ni dependencias, como el resto de proyectos de [pedrogomez.dev](https://www.pedrogomez.dev/).

- `app/index.html`: todo el contenido de la guía.
- `app/guia.css`: el croquis (cuatro tintas, Archivo con su eje de anchura) y el diseño del móvil y del escritorio.
- `app/guia.js`: progreso, cuerda, «dónde lo dejaste», calculadora, copiar, pantalla encendida y pasar el progreso.
- `app/hueco.js`: la regla del tamaño, compartida con el test.
- `scripts/build.mjs`: copia `app/` a `dist/proyecto/arranque-dual`, versiona CSS y JS con un hash y deja `_headers` en la raíz.

```bash
npm test         # cálculo, pasos y casillas, enlaces oficiales, sin rayas, CSP, build y sintaxis
npm run build    # genera dist/proyecto/arranque-dual desde app/
npm run dev      # build y vista local en http://127.0.0.1:8100/proyecto/arranque-dual/
npm run deploy   # Worker de Cloudflare con archivos estáticos (wrangler.jsonc), solo con el OK de Pedro
```

## Créditos

Tipografía: [Archivo](https://github.com/Omnibus-Type/Archivo) (SIL Open Font License, en `app/fonts/OFL.txt`).

Hecho por [Pedro Gómez](https://www.pedrogomez.dev/).
