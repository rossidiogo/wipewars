import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build } from 'vite';
import { describe, expect, it } from 'vitest';
import { LEGACY_ORDER, legacyCss, legacyJs } from './legacy-plugin';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const CONSTS = ['AVA', 'LOGO', 'BGCH', 'ICO', 'SPD'];

/** Splits the generated script into its five one-line constants and the legacy source that follows. */
function split(js: string) {
  const lines = js.split('\n');
  const consts = Object.fromEntries(CONSTS.map((name, i) => {
    const line = lines[i];
    expect(line.startsWith(`const ${name}=`)).toBe(true);
    return [name, JSON.parse(line.slice(`const ${name}=`.length, -1))];
  }));
  return { consts, source: lines.slice(CONSTS.length).join('\n') };
}

describe('legacyJs', () => {
  const js = legacyJs(root);

  it('emits the generated constants first, ahead of the code that uses them', () => {
    const { consts } = split(js);
    expect(Object.keys(consts)).toEqual(CONSTS);
    expect(consts.LOGO).toMatch(/^data:image\/png;base64,/);
    expect(consts.BGCH).toHaveLength(5);
    expect(Object.keys(consts.AVA)).toContain('tank');
  });

  it('contains every legacy file verbatim, in order', () => {
    expect(LEGACY_ORDER).toEqual(['data', 'state', 'skills', 'engine', 'dom', 'lang', 'art', 'battle', 'prep', 'ui/shell', 'ui/home', 'ui/campaign', 'ui/heroes', 'ui/bag', 'ui/tasks', 'ui/calendar', 'ui/friends', 'ui/shop', 'ui/settings', 'ui/start', 'ui/tutorial', 'recruit', 'cuts', 'net', 'account', 'guild', 'music', 'title', 'lab']);
    expect(split(js).source).toBe(LEGACY_ORDER.map(f => read(`js/${f}.js`) + '\n').join(''));
  });
});

describe('legacyCss', () => {
  it('prepends the generated variables to style.css verbatim', () => {
    const css = legacyCss(root);
    expect(css.startsWith(':root{--cTL:url("data:image/svg+xml,')).toBe(true);
    for (const v of ['--cTR:', '--cBL:', '--cBR:', '--bgimg:url(', '--bgfield:url(']) expect(css.split('\n')[0]).toContain(v);
    expect(css.endsWith(read('css/style.css'))).toBe(true);
  });
});

describe('vite build', () => {
  it('writes one index.html with the legacy script and stylesheet untouched', async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'ww-dist-'));
    await build({ root, logLevel: 'silent', build: { outDir, emptyOutDir: true } });
    expect(readdirSync(outDir)).toEqual(['index.html']);
    const html = readFileSync(join(outDir, 'index.html'), 'utf8');
    expect(html).toContain(`<script>${legacyJs(root)}</script>`);
    expect(html).toContain(`<style>${legacyCss(root)}</style>`);
    expect(html).not.toContain('LEGACY_');
    // The Preact bundle is inlined too: nothing in the page points at another file of ours.
    expect(html).toMatch(/<script type="module">[^<]/);
    expect(html).not.toMatch(/(src|href)="\.?\/?assets\//);
  });
});
