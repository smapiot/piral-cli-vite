import type { InlineConfig } from 'vite';
import codegen from 'vite-plugin-codegen';
import environment from 'vite-plugin-environment';

export function createCommonConfig(
  root: string,
  outDir: string,
  develop = true,
  sourcemap = true,
  minify = true,
  variables: Record<string, string> = {},
): InlineConfig {
  const varKeys = Object.keys({
    BUILD_PCKG_NAME: process.env.BUILD_PCKG_NAME,
    BUILD_PCKG_VERSION: process.env.BUILD_PCKG_VERSION,
    BUILD_TIME_FULL: process.env.BUILD_TIME_FULL,
    PIRAL_CLI_VERSION: process.env.PIRAL_CLI_VERSION,
    NODE_ENV: process.env.NODE_ENV,
    ...variables,
  });
  return {
    root,
    build: {
      outDir,
      sourcemap,
      emptyOutDir: false,
      minify,
      rollupOptions: {
        output: {
          assetFileNames: '[name].[hash][extname]',
          chunkFileNames: '[name].[hash].js',
          entryFileNames: '[name].[hash].js',
        },
      },
    },
    plugins: [environment(varKeys), codegen({ outDir, rootDir: root })],
  };
}
