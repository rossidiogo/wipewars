import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vitest/config';
import { legacyPlugin } from './build/legacy-plugin.ts';

export default defineConfig({
  // Relative asset URLs: the game is served from a sub-path on GitHub Pages.
  base: './',
  plugins: [preact(), legacyPlugin(), viteSingleFile()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'build/**/*.test.ts'],
  },
});
