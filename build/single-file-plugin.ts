import type { Plugin } from 'vite';

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Folds the bundled JS and CSS into index.html so the build is one self-contained file
 * (the game is shared and hosted as a single HTML page). Fails the build if Vite emits
 * anything it cannot inline, instead of shipping a page with a dangling reference.
 */
export function singleFilePlugin(): Plugin {
  return {
    name: 'wipewars-single-file',
    enforce: 'post',
    config: () => ({ build: { modulePreload: { polyfill: false }, cssCodeSplit: false } }),
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find(f => f.type === 'asset' && f.fileName.endsWith('.html'));
      if (!html || html.type !== 'asset') return;
      let page = String(html.source);
      for (const [name, file] of Object.entries(bundle)) {
        if (file === html) continue;
        let tag: RegExp, inline: string;
        if (file.type === 'chunk') {
          tag = new RegExp(`<script type="module"[^>]*\\ssrc="[./]*${escapeRe(name)}"[^>]*></script>`);
          // A literal </script> inside the code would end the inline tag early.
          inline = `<script type="module">${file.code.replace(/<\/script/g, '<\\/script')}</script>`;
        } else if (name.endsWith('.css')) {
          tag = new RegExp(`<link rel="stylesheet"[^>]*\\shref="[./]*${escapeRe(name)}"[^>]*>`);
          inline = `<style>${String(file.source)}</style>`;
        } else {
          throw new Error(`single-file build: cannot inline ${name}`);
        }
        if (!tag.test(page)) throw new Error(`single-file build: index.html does not reference ${name}`);
        // Function replacer: bundled code may contain `$&` and similar replacement patterns.
        page = page.replace(tag, () => inline);
        delete bundle[name];
      }
      html.source = page;
    },
  };
}
