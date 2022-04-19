import { RollupOptions } from 'rollup';
import { resolve } from 'path';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import codegen from 'rollup-plugin-codegen';
import postcss from 'rollup-plugin-postcss';

export function createCommonConfig(
  outdir: string,
  development = false,
  sourcemap = true,
  contentHash = true,
  minify = true,
  variables: Record<string, string> = {},
): RollupOptions {
  return {
    output: {
      sourcemap: sourcemap,
      dir: outdir,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      codegen(),
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
          'process.env.BUILD_PCKG_NAME': JSON.stringify(process.env.BUILD_PCKG_NAME),
          'process.env.BUILD_PCKG_VERSION': JSON.stringify(process.env.BUILD_PCKG_VERSION),
          'process.env.PIRAL_CLI_VERSION': JSON.stringify(process.env.PIRAL_CLI_VERSION),
          'process.env.BUILD_TIME_FULL': JSON.stringify(process.env.BUILD_TIME_FULL),
          ...variables,
        },
        preventAssignment: true,
      }),
      url({
        destDir: outdir,
        emitFiles: true,
        fileName: contentHash ? '[name].[hash][extname]' : '[name][extname]',
        limit: 32,
        include: [
          '**/*.svg',
          '**/*.png',
          '**/*.jp(e)?g',
          '**/*.gif',
          '**/*.webp',
          '**/*.mp3',
          '**/*.mp4',
          '**/*.ogg',
          '**/*.wav',
          '**/*.ogv',
          '**/*.wasm',
        ],
      }),
      postcss({
        extract: resolve(outdir, 'style.css'),
        use: ['sass'],
        minimize: minify,
        sourceMap: sourcemap,
        extensions: ['.css', '.scss', '.sass', '.pcss', '.sss'],
      }),
    ],
  };
}
