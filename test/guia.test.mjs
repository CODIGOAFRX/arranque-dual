// Comprobaciones de la guía. En Windows `node --test` se queda colgado: ejecuta `node test/guia.test.mjs`.
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { hueco } from '../app/hueco.js';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = f => readFile(resolve(repo, f), 'utf8');
const html = await leer('app/index.html');
const css = await leer('app/guia.css');
const js = await leer('app/guia.js');
let fallos = 0;

function prueba(nombre, fn) {
    try { fn(); console.log(`ok   ${nombre}`); }
    catch (e) { fallos++; console.log(`MAL  ${nombre}\n     ${e.message}`); }
}

prueba('el cálculo del hueco sigue la regla', () => {
    assert.deepEqual(hueco(930, 283), { cabe: true, gb: 140, mb: 143360, quedan: 143 });
    assert.deepEqual(hueco(476, 300), { cabe: true, gb: 200, mb: 204800, quedan: 100 });
    assert.equal(hueco(256, 90).cabe, false);
    assert.equal(hueco(100, 200), null);
    assert.equal(hueco(0, 0), null);
});

prueba('cada paso tiene casilla, etiqueta y un id único', () => {
    const pasos = [...html.matchAll(/<li class="paso[^"]*" id="paso-([\w-]+)" data-paso="\1">\s*<input type="checkbox" id="c([\w-]+)" class="marca"><label for="c([\w-]+)">/g)];
    const todos = [...html.matchAll(/data-paso="([\w-]+)"/g)].map(m => m[1]);
    assert.equal(pasos.length, todos.length, 'algún paso no tiene la forma casilla + etiqueta');
    assert.equal(new Set(todos).size, todos.length, 'hay pasos repetidos');
    for (const [, paso, casilla, etiqueta] of pasos) assert.ok(paso === casilla && casilla === etiqueta, `paso ${paso} mal enlazado`);
});

prueba('cada largo de la vía tiene su sección y viceversa', () => {
    const tramos = [...html.matchAll(/class="via-tramo[^"]*" data-largo="(\w)"[^>]*><a href="#([\w-]+)"/g)];
    const secciones = [...html.matchAll(/<section class="largo[^"]*" id="([\w-]+)" data-largo="(\w)"/g)];
    assert.equal(tramos.length, 9);
    assert.equal(secciones.length, 9);
    for (const [, largo, ancla] of tramos) assert.ok(secciones.some(([, id, l]) => id === ancla && l === largo), `el tramo ${largo} no apunta a su largo`);
});

prueba('los pasos citados en el texto existen', () => {
    const ids = new Set([...html.matchAll(/data-paso="([\w-]+)"/g)].map(m => m[1]));
    for (const [, id] of html.matchAll(/paso (\d-\d)\b/g)) assert.ok(ids.has(id), `se cita el paso ${id}`);
});

prueba('los enlaces externos son https y oficiales', () => {
    const permitidos = ['ubuntu.com', 'releases.ubuntu.com', 'documentation.ubuntu.com', 'rufus.ie', 'etcher.balena.io', 'aka.ms', 'nodejs.org', 'claude.ai', 'code.claude.com', 'code.visualstudio.com', 'docs.docker.com', 'get.docker.com', 'github.com', 'www.pedrogomez.dev'];
    for (const [, url] of html.matchAll(/href="(http[^"]+)"/g)) {
        assert.ok(url.startsWith('https://'), url);
        assert.ok(permitidos.includes(new URL(url).hostname), `dominio no previsto: ${url}`);
    }
});

prueba('no se aloja ninguna imagen de disco ni binario', () => {
    assert.doesNotMatch(html, /href="[^"]*\.(iso|exe|img)"/);
});

prueba('sin rayas en los textos', () => {
    for (const [nombre, texto] of [['index.html', html], ['guia.css', css], ['guia.js', js]]) assert.doesNotMatch(texto, /[—–]/, nombre);
});

prueba('sin estilos ni scripts en línea (la CSP no los deja)', () => {
    assert.doesNotMatch(html, /\sstyle="/);
    assert.doesNotMatch(html, /<script>(?!<\/script>)/);
    assert.doesNotMatch(html, /\son[a-z]+="/);
});


const fuente = await stat(resolve(repo, 'app/fonts/archivo.woff2'));
prueba('la fuente existe y pesa menos de 120 KB', () => assert.ok(fuente.size < 120_000));

prueba('el build deja la página sin marcas y con las rutas versionadas', () => {
    execFileSync(process.execPath, [resolve(repo, 'scripts/build.mjs')], { stdio: 'pipe' });
});
const salida = await readFile(resolve(repo, 'dist/proyecto/arranque-dual/index.html'), 'utf8');
prueba('la salida del build apunta a /proyecto/arranque-dual con ?v=', () => {
    assert.match(salida, /href="\/proyecto\/arranque-dual\/guia\.css\?v=[0-9a-f]{10}"/);
    assert.match(salida, /src="\/proyecto\/arranque-dual\/guia\.js\?v=[0-9a-f]{10}"/);
    assert.doesNotMatch(salida, /\{\{/);
});
const guiaSalida = await readFile(resolve(repo, 'dist/proyecto/arranque-dual/guia.js'), 'utf8');
prueba('el import de hueco.js lleva versión', () => assert.match(guiaSalida, /from '\.\/hueco\.js\?v=[0-9a-f]{10}'/));

prueba('sintaxis de los módulos', () => {
    for (const f of ['app/guia.js', 'app/hueco.js', 'scripts/build.mjs', 'scripts/dev.mjs']) execFileSync(process.execPath, ['--check', resolve(repo, f)], { stdio: 'pipe' });
});

if (fallos) { console.log(`\n${fallos} fallo(s)`); process.exit(1); }
console.log('\nTodo bien');
