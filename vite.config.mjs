import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'build';

/**
 * Writes build/version.txt after every production build.
 * Consumed by ops to identify which version is deployed.
 */
function versionFilePlugin() {
  let outDir;
  return {
    name: 'access8math-version-file',
    apply: 'build',
    configResolved(config) {
      // config.build.outDir is as-authored (relative to root), so resolve it
      // here. Other consumers of this config (Storybook's Vite builder) then
      // write into their own output directory, not build/.
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // writeBundle (not closeBundle) so nothing is written when the build fails.
    writeBundle() {
      const version = process.env.npm_package_version || 'unknown';
      const buildDate = new Date().toISOString();
      fs.writeFileSync(
        path.join(outDir, 'version.txt'),
        `Version: ${version}\nBuild Date: ${buildDate}`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), svgr(), versionFilePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // main.js (Electron dev mode) loads http://localhost:3000/
    port: 3000,
    strictPort: true,
  },
  build: {
    // main.js (electron-serve), forge, deploy scripts and CI all read from build/
    outDir: OUT_DIR,
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
