import { defineConfig } from '@playwright/test';

// WW_TARGET=baseline serves the build.py output (.baseline/), default serves the Vite build (dist/).
const dir = process.env.WW_TARGET === 'baseline' ? '.baseline' : 'dist';
const sizes = [[360, 640], [390, 844], [480, 900]] as const;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'line',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  expect: { toHaveScreenshot: { animations: 'disabled' } },
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  projects: [
    ...sizes.map(([width, height]) => ({
      name: `${width}x${height}`,
      testMatch: /screens\.spec\.ts/,
      use: { viewport: { width, height } },
    })),
    { name: 'smoke', testMatch: /smoke\.spec\.ts/, use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx vite preview --outDir ${dir} --port 4173 --strictPort`,
    url: 'http://localhost:4173',
    reuseExistingServer: false,
  },
});
