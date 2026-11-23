// Lo comparten la página y el test.
// Cuánto dar a Ubuntu: a Windows le quedan libres 60 GB o el 15 % de C:, lo que sea más; el resto, hasta 200 GB
export function hueco(total, libre) {
    if (!(total > 0) || !(libre >= 0) || libre > total) return null;
    const paraWindows = Math.max(60, total * 0.15);
    const disponible = libre - paraWindows;
    if (disponible < 40) return { cabe: false, disponible: Math.max(0, Math.floor(disponible)) };
    const gb = Math.min(200, Math.floor(disponible / 10) * 10);
    return { cabe: true, gb, mb: gb * 1024, quedan: Math.floor(libre - gb) };
}
