import pilet from 'rollup-plugin-pilet';
import type { PiletBuildHandler } from 'piral-cli';
import { createCommonConfig } from './common';
import { runRollup } from './bundler-run';
import { extendConfig } from '../helpers';

function nameOf(path: string) {
  return path.replace(/\.js$/, '');
}

function getPackageName() {
  return process.env.BUILD_PCKG_NAME;
}

function getRequireRef() {
  const name = getPackageName();
  return `rolluppr_${name.replace(/\W/gi, '')}`;
}

const handler: PiletBuildHandler = {
  create(options) {
    const piletName = getPackageName();
    const requireRef = getRequireRef();
    const external: Array<string> = [];
    const id = nameOf(options.outFile);
    const input = {
      [id]: options.entryModule,
    };

    // first populate with global externals
    options.externals.forEach((name) => {
      external.push(name);
    });

    // then populate with distributed externals
    options.importmap.forEach((dep) => {
      external.push(dep.name);
    });

    // finally add the local importmap entries to the bundler entry points
    options.importmap.forEach((dep) => {
      if (dep.type === 'local') {
        input[nameOf(dep.ref)] = dep.entry;
      }
    });

    const baseConfig = createCommonConfig(
      options.outDir,
      options.develop,
      options.sourceMaps,
      options.contentHash,
      options.minify,
    );

    const config = extendConfig(
      {
        ...baseConfig,
        input,
        output: {
          ...baseConfig.output,
          format: 'system',
        },
        external,
        plugins: [
          ...baseConfig.plugins,
          pilet({
            id,
            piletName,
            requireRef,
            importmap: options.importmap,
            debug: options.develop,
          }),
        ],
      },
      options.root,
    );

    return runRollup({
      ...config,
      debug: options.watch,
      outFile: options.outFile,
      requireRef,
    });
  },
};

export const create = handler.create;
