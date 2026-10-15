import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

import { build as esbuildBuild } from 'esbuild';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'bundle-server',
        closeBundle: async () => {
          await esbuildBuild({
            entryPoints: ['server.ts'],
            bundle: true,
            platform: 'node',
            format: 'cjs',
            packages: 'external',
            sourcemap: true,
            outfile: 'dist/server.cjs',
          });
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
