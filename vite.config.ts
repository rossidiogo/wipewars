import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';
import { legacyPlugin } from './build/legacy-plugin.ts';
import { singleFilePlugin } from './build/single-file-plugin.ts';

export default defineConfig({
  // Relative asset URLs: the game is served from a sub-path on GitHub Pages.
  base: './',
  plugins: [preact(), legacyPlugin(), singleFilePlugin()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'build/**/*.test.ts', 'tests/unit/**/*.test.ts'],
  },
});
