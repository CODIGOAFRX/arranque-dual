// Ubuntu junto a Windows: progreso de la vía en este navegador. La página se lee entera sin JavaScript;
// esto guarda las casillas, tiende la cuerda por cada largo, marca dónde lo dejaste, calcula el hueco
// para Ubuntu, copia las órdenes, mantiene la pantalla encendida y pasa el progreso a otro dispositivo.

import { hueco } from './hueco.js';

const CLAVE = 'arranque-dual:v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const largos = $$('.largo');
const pasos = $$('.paso');
const tramos = new Map($$('.via-tramo').map(t => [t.dataset.largo, t]));
const ids = new Set(pasos.map(p => p.dataset.paso));
const aviso = $('#aviso');

function leer() {
    try {
        const g = JSON.parse(localStorage.getItem(CLAVE)) || {};
        return { hechos: new Set((g.hechos || []).filter(id => ids.has(id))), ultimo: g.ultimo || null, calculo: g.calculo || {} };
    } catch {
        return { hechos: new Set(), ultimo: null, calculo: {} };
    }
}

const estado = leer();

function guardar() {
    try {
        localStorage.setItem(CLAVE, JSON.stringify({ hechos: [...estado.hechos], ultimo: estado.ultimo, calculo: estado.calculo }));
    } catch {
        // Navegación privada sin almacenamiento: las casillas funcionan, pero no se recuerdan
    }
}

function decir(texto) {
    aviso.textContent = texto;
}

// Un enlace con #progreso=1-1.1-2... trae los pasos hechos desde otro dispositivo y se suma a los de aquí
function importar() {
    const m = location.hash.match(/^#progreso=([\w.-]*)$/);
    if (!m) return;
    const traidos = m[1].split('.').filter(id => ids.has(id));
    traidos.forEach(id => estado.hechos.add(id));
    if (traidos.length) estado.ultimo = traidos.at(-1);
    guardar();
    history.replaceState(null, '', location.pathname + location.search);
    decir(traidos.length ? `Progreso traído: ${traidos.length} pasos hechos.` : 'El enlace no traía pasos hechos.');
}

const pasosDe = largo => pasos.filter(p => p.closest('.largo') === largo);
const nombreLargo = largo => largo.dataset.largo === 'd' ? 'el descenso' : `el largo ${largo.dataset.largo}`;

// Dónde estás: el largo del último paso marcado si sigue a medias; si no, el primero sin terminar
function dondeEstas() {
    const ultimo = estado.ultimo && pasos.find(p => p.dataset.paso === estado.ultimo);
    const suyo = ultimo && ultimo.closest('.largo');
    if (suyo && pasosDe(suyo).some(p => !estado.hechos.has(p.dataset.paso))) return suyo;
    return largos.find(l => l.dataset.largo !== 'd' && pasosDe(l).some(p => !estado.hechos.has(p.dataset.paso))) || null;
}

// La cuerda del margen llega hasta el seguro más bajo que hayas pasado (la casilla marcada más abajo)
function cuerdaHasta(largo, suyos, completo) {
    if (completo) return 1;
    const alto = largo.offsetHeight;
    const ultimo = suyos.findLast(p => estado.hechos.has(p.dataset.paso));
    if (!ultimo || !alto) return 0;
    const marca = ultimo.querySelector('.marca');
    return Math.min(1, (ultimo.offsetTop + marca.offsetTop + marca.offsetHeight / 2) / alto);
}

function pintar() {
    const medidas = largos.map(largo => {
        const suyos = pasosDe(largo);
        const hechos = suyos.filter(p => estado.hechos.has(p.dataset.paso)).length;
        const completo = hechos === suyos.length;
        return { largo, suyos, hechos, completo, cuerda: cuerdaHasta(largo, suyos, completo) };
    });
    for (const { largo, suyos, hechos, completo, cuerda } of medidas) {
        largo.style.setProperty('--avance', cuerda.toFixed(3));
        largo.classList.toggle('hecho', completo);
        const tramo = tramos.get(largo.dataset.largo);
        if (tramo) {
            tramo.style.setProperty('--avance', (hechos / suyos.length).toFixed(3));
            tramo.classList.toggle('hecho', completo);
            const nombre = tramo.querySelector('span').textContent;
            const como = completo ? 'hecho' : hechos ? `${hechos} de ${suyos.length} pasos` : 'pendiente';
            tramo.querySelector('a').setAttribute('aria-label', `${largo.dataset.largo === 'd' ? 'Descenso' : 'Largo ' + largo.dataset.largo}, ${nombre}: ${como}`);
        }
    }

    const aqui = dondeEstas();
    for (const [, tramo] of tramos) tramo.querySelector('a').removeAttribute('aria-current');
    if (aqui) tramos.get(aqui.dataset.largo)?.querySelector('a').setAttribute('aria-current', 'step');

    const subida = pasos.filter(p => !p.dataset.paso.startsWith('d'));
    const hechosSubida = subida.filter(p => estado.hechos.has(p.dataset.paso)).length;
    const donde = $('#donde');
    if (!estado.hechos.size) donde.textContent = '8 largos y un descenso';
    else if (hechosSubida === subida.length && !aqui) donde.textContent = 'Vía completa';
    else if (aqui?.dataset.largo === 'd') donde.textContent = 'En el descenso';
    else donde.textContent = `Largo ${aqui ? aqui.dataset.largo : 8} de 8 · ${hechosSubida} de ${subida.length} pasos`;

    const siguiente = $('#siguiente');
    const paso = aqui && pasosDe(aqui).find(p => !estado.hechos.has(p.dataset.paso));
    if (paso) {
        siguiente.href = `#${paso.id}`;
        siguiente.textContent = estado.hechos.size ? `Sigue: paso ${paso.dataset.paso}` : 'Empieza por el largo 1';
    } else {
        siguiente.href = '#cima';
        siguiente.textContent = 'Vía completa';
    }
    $('#cima').hidden = hechosSubida !== subida.length;
}

// La banderita: al volver, un enlace al primer paso sin marcar del largo donde lo dejaste
function retomar() {
    const caja = $('#retomar');
    const aqui = estado.hechos.size && dondeEstas();
    if (!aqui) { caja.hidden = true; return; }
    const siguiente = pasosDe(aqui).find(p => !estado.hechos.has(p.dataset.paso));
    const titulo = aqui.querySelector('h2').textContent;
    caja.replaceChildren(
        document.createTextNode(`Lo dejaste en ${nombreLargo(aqui)}: ${titulo}. `),
        Object.assign(document.createElement('a'), { href: `#${siguiente.id}`, textContent: `Seguir por el paso ${siguiente.dataset.paso}` })
    );
    caja.hidden = false;
}

function casillas() {
    for (const paso of pasos) {
        const marca = paso.querySelector('.marca');
        marca.checked = estado.hechos.has(paso.dataset.paso);
        marca.addEventListener('change', () => {
            if (marca.checked) estado.hechos.add(paso.dataset.paso);
            else estado.hechos.delete(paso.dataset.paso);
            estado.ultimo = paso.dataset.paso;
            guardar();
            pintar();
        });
    }
}

function calculadora() {
    const form = $('#calculo');
    const salida = $('#resultado');
    const total = $('#total');
    const libre = $('#libre');
    if (estado.calculo.total) total.value = estado.calculo.total;
    if (estado.calculo.libre) libre.value = estado.calculo.libre;
    const fmt = n => n.toLocaleString('es-ES');
    const calcular = () => {
        const t = parseFloat(total.value.replace(',', '.'));
        const l = parseFloat(libre.value.replace(',', '.'));
        estado.calculo = { total: total.value, libre: libre.value };
        guardar();
        if (!total.value || !libre.value) { salida.textContent = 'Escribe los dos números y te digo cuántos MB poner en Windows.'; return; }
        if (!(t > 0) || l < 0) { salida.textContent = 'Escribe un tamaño de C: mayor que 0 y un libre de 0 o más.'; return; }
        const r = hueco(t, l);
        if (!r) { salida.textContent = 'El espacio libre no puede ser mayor que el tamaño de C:.'; return; }
        if (!r.cabe) {
            salida.textContent = `Para Ubuntu quedarían ${fmt(r.disponible)} GB: no compensa. Libera espacio, usa otro disco o prueba WSL2.`;
            return;
        }
        const fuerte = t => Object.assign(document.createElement('strong'), { textContent: t });
        salida.replaceChildren(
            'Para Ubuntu, ', fuerte(`${fmt(r.gb)} GB`), '. En Windows escribe ', fuerte(`${r.mb}`),
            ` MB. A Windows le quedan ${fmt(r.quedan)} GB libres.`
        );
    };
    form.addEventListener('input', calcular);
    form.addEventListener('submit', e => e.preventDefault());
    calcular();
}

// Botón de copiar bajo cada orden
function ordenes() {
    for (const pre of $$('pre')) {
        const caja = document.createElement('div');
        caja.className = 'orden';
        pre.replaceWith(caja);
        const boton = Object.assign(document.createElement('button'), { type: 'button', className: 'copiar', textContent: 'Copiar' });
        const lineas = pre.textContent.trim().split('\n').length;
        boton.setAttribute('aria-label', lineas > 1 ? `Copiar las ${lineas} órdenes` : `Copiar la orden ${pre.textContent.trim()}`);
        caja.append(pre, boton);
        boton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(pre.textContent.trim());
                boton.textContent = 'Copiada';
            } catch {
                getSelection().selectAllChildren(pre);
                boton.textContent = 'Seleccionada: copia con el menú';
            }
            setTimeout(() => { boton.textContent = 'Copiar'; }, 1800);
        });
    }
}

// Pantalla encendida mientras sigues la guía con el PC instalando
function vela() {
    const boton = $('#vela');
    if (!('wakeLock' in navigator)) return;
    boton.hidden = false;
    let cerrojo = null;
    const pedir = async () => {
        try {
            cerrojo = await navigator.wakeLock.request('screen');
            cerrojo.addEventListener('release', () => { if (document.visibilityState === 'visible') marcar(false); });
            marcar(true);
        } catch {
            marcar(false);
            decir('Este navegador no deja mantener la pantalla encendida ahora.');
        }
    };
    const marcar = activo => {
        boton.setAttribute('aria-pressed', String(activo));
        boton.textContent = activo ? 'Pantalla: encendida' : 'Pantalla encendida';
    };
    boton.addEventListener('click', async () => {
        if (cerrojo && !cerrojo.released) { await cerrojo.release(); cerrojo = null; marcar(false); }
        else pedir();
    });
    // El sistema suelta el cerrojo al cambiar de pestaña; se recupera al volver
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && boton.getAttribute('aria-pressed') === 'true' && (!cerrojo || cerrojo.released)) pedir();
    });
}

function controles() {
    $('#pasar').addEventListener('click', async () => {
        const url = `${location.origin}${location.pathname}#progreso=${[...estado.hechos].join('.')}`;
        if (navigator.share) {
            try { await navigator.share({ title: 'Mi progreso: Ubuntu junto a Windows', url }); return; } catch (e) { if (e.name === 'AbortError') return; }
        }
        try {
            await navigator.clipboard.writeText(url);
            decir('Enlace copiado. Ábrelo en el otro dispositivo y se suma a lo que tenga.');
        } catch {
            decir(`Abre este enlace en el otro dispositivo: ${url}`);
        }
    });

    const borrar = $('#borrar');
    let espera = null;
    borrar.addEventListener('click', () => {
        if (!borrar.classList.contains('armado')) {
            borrar.classList.add('armado');
            borrar.textContent = 'Pulsa otra vez para borrarlo todo';
            espera = setTimeout(() => { borrar.classList.remove('armado'); borrar.textContent = 'Empezar de cero'; }, 4000);
            return;
        }
        clearTimeout(espera);
        estado.hechos.clear();
        estado.ultimo = null;
        estado.calculo = {};
        $('#total').value = '';
        $('#libre').value = '';
        $('#calculo').dispatchEvent(new Event('input'));
        guardar();
        $$('.marca').forEach(m => { m.checked = false; });
        borrar.classList.remove('armado');
        borrar.textContent = 'Empezar de cero';
        pintar();
        retomar();
        decir('Progreso borrado. La vía empieza de nuevo.');
    });
}

importar();
casillas();
pintar();
new ResizeObserver(() => pintar()).observe(document.querySelector('.columna'));
retomar();
calculadora();
ordenes();
vela();
controles();
