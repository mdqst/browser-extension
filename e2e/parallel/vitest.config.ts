import { UserConfig, mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import viteConfig from '../vitest.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      bail: 1,
      threads: false,
      reporters: ['default', '../src/test/sentryReporter.ts'],
    },
  }) as UserConfig,
);
