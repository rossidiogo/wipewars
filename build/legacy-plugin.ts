import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Injects the not-yet-migrated game (js/*.js, css/style.css, base64 assets) into index.html as
 * raw inline text. The legacy scripts share one global scope and must not be parsed, bundled or
 * minified, so they bypass Vite's pipeline entirely.
 */

/** Concatenation order of js/<name>.js. Later files depend on globals from earlier ones. */
export const LEGACY_ORDER = ['data', 'state', 'skills', 'engine', 'dom', 'lang', 'art', 'battle', 'prep', 'ui', 'recruit', 'cuts', 'net', 'account', 'guild', 'music', 'title', 'lab'];

const text = (root: string, p: string) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const json = (root: string, p: string) => JSON.parse(text(root, p));
const b64 = (root: string, p: string) => 'data:image/png;base64,' + readFileSync(join(root, p)).toString('base64');

/** Percent-encodes like Python's urllib.parse.quote: only letters, digits and _.-~/ stay literal. */
const quote = (s: string) => encodeURIComponent(s)
  .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
  .replace(/%2F/g, '/');

/** One ornate panel corner as a CSS url(); `transform` mirrors it into the other three corners. */
function corner(transform: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><g transform='${transform}'>`
    + `<path d='M1 15V4l3-3h11' fill='none' stroke='#c9a96a' stroke-width='1.4'/>`
    + `<path d='M4 4l2.6 2.6L4 9.2 1.4 6.6z' fill='#e0c57a'/><path d='M1 15V8M8 1h-2' stroke='#7a5c32' stroke-width='1' /></g></svg>`;
  return `url("data:image/svg+xml,${quote(svg)}")`;
}

export function legacyCss(root: string): string {
  const bg = json(root, 'assets/bg2.json');
  const vars = `:root{--cTL:${corner('')};--cTR:${corner('matrix(-1 0 0 1 16 0)')};--cBL:${corner('matrix(1 0 0 -1 0 16)')};--cBR:${corner('matrix(-1 0 0 -1 16 16)')};--bgimg:url(${bg.tall});--bgfield:url(${bg.wide})}\n`;
  return vars + text(root, 'css/style.css');
}

export function legacyJs(root: string): string {
  // assets/ava_<key>.png -> AVA[key]
  const ava = Object.fromEntries(readdirSync(join(root, 'assets'))
    .filter(f => /^ava_.*\.png$/.test(f)).sort()
    .map(f => [f.slice(4, -4), b64(root, `assets/${f}`)]));
  const bgch = json(root, 'assets/bg_ch.json');
  const consts: [string, unknown][] = [
    ['AVA', ava],
    ['LOGO', b64(root, 'assets/logo.png')],
    ['BGCH', [0, 1, 2, 3, 4].map(i => bgch[String(i)])],
    ['ICO', json(root, 'assets/icons2.json')],
    ['SPD', json(root, 'assets/sprites2.json')],
  ];
  return consts.map(([name, value]) => `const ${name}=${JSON.stringify(value)};\n`).join('')
    + LEGACY_ORDER.map(f => text(root, `js/${f}.js`) + '\n').join('');
}

export function legacyPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: 'wipewars-legacy',
    configResolved(config) { root = config.root; },
    transformIndexHtml: {
      order: 'post',
      // Function replacers: the legacy source contains `$'` and `$&`, which a string replacement would expand.
      handler: html => html
        .replace('<!--LEGACY_CSS-->', () => `<style>${legacyCss(root)}</style>`)
        .replace('<!--LEGACY_JS-->', () => `<script>${legacyJs(root)}</script>`),
    },
    configureServer(server) {
      const dirs = ['js', 'css', 'assets'].map(d => join(root, d));
      server.watcher.add(dirs);
      server.watcher.on('change', file => {
        if (dirs.some(d => file.startsWith(d))) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
