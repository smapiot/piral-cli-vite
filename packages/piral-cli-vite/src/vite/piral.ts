import type { PiralBuildHandler } from 'piral-cli';
import { dirname } from 'path';
import { createCommonConfig } from './common';
import { runVite } from './bundler-run';
import { extendConfig } from '../helpers';

const handler: PiralBuildHandler = {
  create(options) {
    const rootDir = dirname(options.entryFiles);
    const baseConfig = createCommonConfig(
      rootDir,
      options.outDir,
      options.emulator,
      options.sourceMaps,
      options.minify,
      {
        DEBUG_PIRAL: JSON.stringify(process.env.DEBUG_PIRAL || ''),
        DEBUG_PILET: JSON.stringify(process.env.DEBUG_PILET || ''),
        SHARED_DEPENDENCIES: JSON.stringify(options.externals.join(',')),
      },
    );

    const config = extendConfig(
      {
        ...baseConfig,
        plugins: [...baseConfig.plugins],
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
