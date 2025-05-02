import type { PiralBuildHandler } from 'piral-cli';
import type { Plugin } from 'vite';
import { load } from 'cheerio';
import { dirname, resolve } from 'path';
import { readFileSync, readdirSync, writeFileSync } from 'fs';

import { createCommonConfig } from './common';
import { runVite } from './bundler-run';

function isLocal(path: string) {
  if (path) {
    if (path.startsWith(':')) {
      return false;
    } else if (path.startsWith('http:')) {
      return false;
    } else if (path.startsWith('https:')) {
      return false;
    } else if (path.startsWith('data:')) {
      return false;
    }

    return true;
  }

  return false;
}

function transformIndexHtml(html: string) {
  const rx = /<script\s+.*<\/script>/gm;
  const replacements: Array<[string, string]> = [];

  while (true) {
    const match = rx.exec(html);

    if (!match) {
      break;
    }

    const text = match[0];
    const templateContent = load(text, null, false);

    templateContent('script[src]')
      .filter((_, e) => isLocal(e.attribs.src))
      .each((_, e) => {
        if (!e.attribs.type) {
          e.attribs.type = 'module';
          replacements.push([text, templateContent.html()]);
        }
      });
  }

  for (const [original, replacement] of replacements) {
    html = html.replace(original, replacement);
  }

  return html;
}

function getConfigFile(root: string) {
  const fileNames = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs'];
  const files = readdirSync(root);

  for (const name of fileNames) {
    if (files.includes(name)) {
      return resolve(root, name);
    }
  }

  return undefined;
}

const handler: PiralBuildHandler = {
  create(options) {
    const rootDir = dirname(options.entryFiles);
    const newPlugins: Array<Plugin> = [];
    const config = createCommonConfig(rootDir, options.outDir, options.emulator, options.sourceMaps, options.minify, {
      DEBUG_PIRAL: process.env.DEBUG_PIRAL || (process.env.DEBUG_PIRAL = ''),
      DEBUG_PILET: process.env.DEBUG_PILET || (process.env.DEBUG_PILET = ''),
      SHARED_DEPENDENCIES: JSON.stringify(options.externals.join(',')),
    });

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

    const configFile = getConfigFile(options.root);
    const indexHtml = resolve(rootDir, 'index.html');
    const content = readFileSync(indexHtml, 'utf8');
    writeFileSync(indexHtml, transformIndexHtml(content), 'utf8');

    return runVite({
      ...config,
      configFile,
      plugins: [...config.plugins, ...newPlugins],
      debug: options.watch,
      outFile: options.outFile,
    });
  },
};

export const create = handler.create;
