---
name: Ubuntu junto a Windows
description: Guía de arranque dual dibujada como el croquis de una vía de escalada.
colors:
  roca: "#ecede8"
  grafito: "#17191c"
  grafito-2: "#464b4f"
  cuerda: "#e8461e"
  aux: "#7d8580"
  raya: "#c9ccc6"
  sobre-cuerda: "#08090a"
  roca-noche: "#16181a"
  grafito-noche: "#e7e8e3"
  grafito-2-noche: "#a9aea9"
  cuerda-noche: "#ff6b3d"
  aux-noche: "#6c736e"
  raya-noche: "#2c3034"
  codigo-noche: "#24272b"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 12.5vw, 5.75rem)"
    fontWeight: 850
    lineHeight: 0.9
    fontVariation: "'wdth' 64"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.95rem, 7.5vw, 2.75rem)"
    fontWeight: 760
    lineHeight: 1.02
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 78"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 680
    lineHeight: 1.3
    fontVariation: "'wdth' 92"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 72"
  code:
    fontFamily: "ui-monospace, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.55
rounded:
  sm: "3px"
  md: "4px"
  pill: "16px"
  belay: "50%"
spacing:
  margen-via: "44px"
  eje: "19px"
  paso: "16px"
  largo: "64px"
components:
  checkbox:
    backgroundColor: "{colors.roca}"
    rounded: "{rounded.md}"
    size: "26px"
  checkbox-checked:
    backgroundColor: "{colors.cuerda}"
    textColor: "{colors.sobre-cuerda}"
  button:
    textColor: "{colors.grafito}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "46px"
  button-pressed:
    backgroundColor: "{colors.grafito}"
    textColor: "{colors.roca}"
  code-block:
    backgroundColor: "{colors.grafito}"
    textColor: "{colors.roca}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  chip-cuidado:
    backgroundColor: "{colors.cuerda}"
    textColor: "{colors.sobre-cuerda}"
    rounded: "2px"
    padding: "1px 7px"
---

# Ubuntu junto a Windows

## Overview

**North star: el croquis de vía.** La instalación es una vía: largos (fases), reuniones (sitios donde parar sin
riesgo), un doble trazo (el único punto sin vuelta atrás fácil) y el descenso (deshacer) dibujado desde el principio.
El mundo vive en el marco y en el margen; la columna de lectura se queda tranquila. Se lee sobre todo en un móvil
junto a un PC que está instalando, de día o de noche: claro u oscuro según el sistema.

## Colors

Cuatro tintas y ninguna más: **roca** (fondo), **grafito** (texto y trazo), **cuerda** (lo hecho y lo que importa) y
**gris auxiliar** (lo pendiente). `grafito-2` es grafito rebajado para texto secundario y `raya` separa pasos. La
versión de noche cambia la roca por grafito y aviva la cuerda. Sobre la cuerda el texto va en `sobre-cuerda`
(5:1 en claro); nunca grafito, que se queda en 4,47:1.

## Typography

Una sola familia, Archivo variable, autoalojada (`app/fonts/archivo.woff2`, latín). El eje de anchura hace el
trabajo: estrecha (64 a 78 %) y en versalitas para el aparato del croquis (cabecera, grados, tira de la vía,
etiquetas de notas, botones); anchura normal para leer. Título principal en versalitas estrechas muy negras. Las
órdenes, en la monoespaciada del sistema, y solo para código.

## Layout

Móvil primero. Una columna de 44rem como máximo. A la izquierda de cada largo, un margen de 44px con la cuerda en el
eje de 19px: las casillas de los pasos se sientan sobre ella como seguros. Arriba, en el móvil, una tira fija con la
vía en miniatura, el siguiente paso y la pantalla encendida. Desde 1000px, la vía pasa a ser una columna lateral fija
con los nombres de los largos y la cabecera se alinea con la columna de lectura. Más aire encima de cada largo (64px)
que dentro.

## Elevation & Depth

Plano, como un papel impreso: sin sombras. La profundidad la dan el grosor y la forma de las líneas y el anillo doble
de las reuniones.

## Shapes

El estado se dice con la forma de la línea, no con colores nuevos: continua y gruesa en cuerda, hecho; fina en gris,
pendiente; discontinua, descenso; doble trazo, sin vuelta atrás. Círculos para reuniones y números de largo (anillo
doble en las reuniones, discontinuo en el descenso). Esquinas de 3 a 4px en casillas, botones y bloques de código;
píldora solo en el interruptor de pantalla.

## Components

- **Paso**: casilla de 26px sobre la cuerda y `<label>` como título; al marcarla se rellena de cuerda y el título se
  tacha en cuerda. Debajo, el cuerpo con notas «Deberías ver», «Por qué», «Si no» (etiqueta estrecha en grafito-2) y
  «Cuidado» (chip de cuerda).
- **Cuerda del largo**: línea fina en gris y, encima, la cuerda que baja hasta la casilla marcada más abajo
  (transform, 0,7 s, curva de salida exponencial). Es el único movimiento de la página.
- **Reunión**: filete grafito y círculo «R» con anillo doble sobre la cuerda.
- **Tira de la vía**: círculos numerados unidos por tramos que la cuerda cubre según el avance; el largo actual lleva
  un anillo de cuerda.
- **Orden**: bloque grafito con el texto partido (se lee entero en el móvil) y un «Copiar» subrayado en cuerda.
- **Calculadora**: dos números con borde grafito y el resultado en cifras estrechas y negras.

## Do's and Don'ts

- Sí: decir el estado con línea (continua, fina, discontinua, doble) y reservar la cuerda para lo hecho y los avisos.
- Sí: título del largo con su número en el círculo del margen y el grado debajo («En Windows · Reversible»).
- No: antetítulos encima de los títulos, cajas de aviso de colores ni bordes laterales gruesos.
- No: una quinta tinta. Si hace falta distinguir algo, cambia la forma de la línea.
- No: imágenes del instalador inventadas; se describen las pantallas con palabras.
