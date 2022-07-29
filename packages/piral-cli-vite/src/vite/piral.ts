import type { PiralBuildHandler } from 'piral-cli';
import type { Plugin } from 'vite';
import { dirname } from 'path';
import { createCommonConfig } from './common';
import { runVite } from './bundler-run';
import { extendConfig } from '../helpers';

const htmlTransform: Plugin = {
  name: 'html-transform',
  transformIndexHtml(html) {
    return html
      .replace(/<script\s+src\s*=\s*"\.\/(.*?)"\s*>/g, '<script src="./$1" type=module>')
      .replace(/<script\s+src\s*=\s*'\.\/(.*?)'\s*>/g, "<script src='./$1' type=module>")
      .replace(/<script\s*>/, '<script type=module>');
  },
};

const handler: PiralBuildHandler = {
  create(options) {
    const rootDir = dirname(options.entryFiles);
    const newPlugins = [htmlTransform];
    const baseConfig = createCommonConfig(
      rootDir,
      options.outDir,
      options.emulator,
      options.sourceMaps,
      options.minify,
      {
        DEBUG_PIRAL: process.env.DEBUG_PIRAL || (process.env.DEBUG_PIRAL = ''),
        DEBUG_PILET: process.env.DEBUG_PILET || (process.env.DEBUG_PILET = ''),
        SHARED_DEPENDENCIES: JSON.stringify(options.externals.join(',')),
      },
    );

    if (options.hmr) {
      newPlugins.push({
        name: 'hmr-plugin',
        generateBundle(_, bundle) {
          if (bundle) {
            Object.keys(bundle).forEach((file) => {
              const asset = bundle[file];

              if (asset.type === 'chunk' && asset.isEntry) {
                asset.code = `(() => new WebSocket(location.origin.replace('http', 'ws')+"/$events").onmessage = () => location.reload())();${asset.code}`;
              }
            });
          }
        },
      });
    }

    const config = extendConfig(
      {
        ...baseConfig,
        plugins: [...baseConfig.plugins, ...newPlugins],
      },
      options.root,
    );

    return runVite({
      ...config,
      debug: options.watch,
      outFile: options.outFile,
    });
  },
};

export const create = handler.create;
