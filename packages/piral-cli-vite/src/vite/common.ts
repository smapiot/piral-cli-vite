import { UserConfig } from 'vite';
import codegen from 'vite-plugin-codegen';
import environment from 'vite-plugin-environment';

export function createCommonConfig(
  root: string,
  outDir: string,
  develop = true,
  sourcemap = true,
  minify = true,
  variables: Record<string, string> = {},
): UserConfig {
  const varKeys = Object.keys({
    BUILD_PCKG_NAME: process.env.BUILD_PCKG_NAME,
    BUILD_PCKG_VERSION: process.env.BUILD_PCKG_VERSION,
    BUILD_TIME_FULL: process.env.BUILD_TIME_FULL,
    PIRAL_CLI_VERSION: process.env.PIRAL_CLI_VERSION,
    ...variables,
  });
  return {
    root,
    build: {
      outDir,
      sourcemap,
      emptyOutDir: true,
      minify,
    },
    plugins: [environment(varKeys), codegen()],
  };
}
