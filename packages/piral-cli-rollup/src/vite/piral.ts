import html from '@rollup/plugin-html';
import type { PiralBuildHandler } from 'piral-cli';
import { createCommonConfig } from './common';
import { runRollup } from './bundler-run';
import { extendConfig } from '../helpers';
import { inspectHtml, makeHtmlAttributes } from '../utils';

const handler: PiralBuildHandler = {
  create(options) {
    const { template, entries } = inspectHtml(options.root, options.entryFiles);

    const baseConfig = createCommonConfig(
      options.outDir,
      options.emulator,
      options.sourceMaps,
      options.contentHash,
      options.minify,
      {
        'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''),
        'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''),
        'process.env.SHARED_DEPENDENCIES': JSON.stringify(options.externals.join(',')),
      },
    );

    const config = extendConfig(
      {
        ...baseConfig,
        input: entries,
        output: {
          ...baseConfig.output,
          format: 'amd',
        },
        plugins: [
          ...baseConfig.plugins,
          html({
            publicPath: options.publicUrl,
            template({ files, attributes, meta, publicPath }) {
              const prefix = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;
              const [script] = (files.js || []).map(({ fileName }) => fileName);

              if (script) {
                template('head').append(
                  `<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" data-main="${prefix}${script}" async defer></script>`,
                );
              }

              (files.css || [{ fileName: 'style.css' }]).forEach(({ fileName }) => {
                const attrs = makeHtmlAttributes(attributes.link);
                template('head').append(`<link href="${prefix}${fileName}" rel="stylesheet"${attrs}>`);
              });

              meta.forEach((input) => {
                const attrs = makeHtmlAttributes(input);
                template('head').append(`<meta${attrs}>`);
              });

              return template.html({});
            },
          }),
        ],
      },
      options.root,
    );

    return runRollup({
      ...config,
      debug: options.watch,
      outFile: options.outFile,
    });
  },
};

export const create = handler.create;
