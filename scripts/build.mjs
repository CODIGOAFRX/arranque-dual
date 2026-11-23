// Genera dist/proyecto/arranque-dual (servido en pedrogomez.dev/proyecto/arranque-dual) desde app/: versiona
// CSS y JS con un hash de lo publicado (los imports entre módulos llevan la versión del importado), sustituye
// {{BASE}} y deja _headers en la raíz de dist, donde lo lee el Worker de archivos estáticos.
import { cp, readFile, rm, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const base = '/proyecto/arranque-dual';
const dist = resolve(repo, 'dist');
const out = resolve(dist, base.slice(1));

await rm(dist, { recursive: true, force: true });
await cp(resolve(repo, 'app'), out, { recursive: true });
await rename(resolve(out, '_headers'), resolve(dist, '_headers'));

const versiones = new Map();
async function version(file) {
    if (versiones.has(file)) return versiones.get(file);
    let texto = await readFile(resolve(out, file), 'utf8');
    if (file.endsWith('.js')) {
        for (const [m, dep] of texto.matchAll(/from '\.\/([^']+\.js)'/g)) texto = texto.replace(m, `from './${dep}?v=${await version(dep)}'`);
        await writeFile(resolve(out, file), texto);
    }
    const v = createHash('sha256').update(texto).digest('hex').slice(0, 10);
    versiones.set(file, v);
    return v;
}

let html = await readFile(resolve(out, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/\{\{v:([^}]+)\}\}/g)) html = html.replace(`{{v:${file}}}`, await version(file));
html = html.replaceAll('{{BASE}}', base);
if (/\{\{/.test(html)) throw new Error('Queda una marca sin rellenar en index.html');
await writeFile(resolve(out, 'index.html'), html);
console.log(`Generado ${out}`);
