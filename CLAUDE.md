# Ubuntu junto a Windows (pedrogomez.dev/proyecto/arranque-dual)

Guía estática (HTML, CSS y JavaScript sin frameworks) para instalar Ubuntu junto a Windows, servida por un Worker de
Cloudflare. Todo el texto de la web y de los comentarios va en español de España, sin rayas (el test lo comprueba).

- Contexto de producto: [PRODUCT.md](PRODUCT.md). Dirección visual: `.impeccable/surfaces/app-index-html.md`
  (croquis de vía de escalada). Sistema visual: [DESIGN.md](DESIGN.md) cuando exista.
- Vista local: `npm run dev` o el servidor `arranque-dual` de `../.claude/launch.json` (puerto 8100).
- Tests: en Windows `node --test` se queda colgado; ejecuta `node test/guia.test.mjs`.
- Diseño revisado con Impeccable (`/impeccable critique`, `audit`); las críticas quedan en `.impeccable/critique/`.

Reglas:
- Solo enlaces a páginas oficiales; nada de ISO ni binarios en `app/` (los Workers admiten 25 MiB por archivo).
- Los datos con fecha (Ubuntu 26.04.1, Rufus 4.16) están en el texto y en el pie: si cambian, actualiza los dos
  y la fecha de comprobación.
- Cada paso es `<li class="paso" data-paso="n-m">` con su casilla `c n-m` y su `<label>`: el test lo exige y el
  progreso se guarda por `data-paso`. Cambiar un id rompe el progreso guardado de quien ya empezó.
- El estado se dice con la forma de la línea (continua hecho, fina pendiente, discontinua descenso, doble trazo sin
  vuelta atrás), no con colores nuevos. Cuatro tintas: roca, grafito, cuerda y gris auxiliar.
- CSP estricta: sin estilos ni scripts en línea en el HTML.
- No desplegar ni crear el repo público sin el OK de Pedro.
