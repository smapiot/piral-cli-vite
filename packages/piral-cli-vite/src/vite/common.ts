import { UserConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import codegen from 'rollup-plugin-codegen';

export function createCommonConfig(
  root: string,
  outDir: string,
  develop = true,
  sourcemap = true,
  minify = true,
  variables: Record<string, string> = {},
): UserConfig {
  return {
    root,
    build: {
      outDir,
      sourcemap,
      emptyOutDir: true,
      minify,
    },
    plugins: [EnvironmentPlugin(Object.keys(variables)), codegen()],
  };
}
