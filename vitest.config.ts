import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/features/testing/**/*.{test,spec}.ts',
      'packages/ai-engine/tests/**/*.{test,spec}.ts'
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*E2E*', '**/*e2e*']
  }
});
