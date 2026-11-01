import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 5501);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const parts = relative.split('/');
    if (parts.some(part => part.startsWith('.')) || !types[extname(relative)] ||
        (parts.length > 1 && !['css', 'js', 'images'].includes(parts[0]))) throw new Error('Not public');
    const path = await realpath(resolve(root, relative));
    if (!path.startsWith(root + sep)) throw new Error('Not public');
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`PokeFetch preview: http://127.0.0.1:${port}\n`));
server.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
