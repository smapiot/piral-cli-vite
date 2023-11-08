import MagicString from 'magic-string';
import { decode, encode } from '@jridgewell/sourcemap-codec';
import type { SharedDependency } from 'piral-cli';
import type { Plugin } from 'vite';
import { insertStylesheet, modifyImports, prependBanner } from './banner';

export interface PiletPluginOptions {
  id: string;
  debug: boolean;
  importmap: Array<SharedDependency>;
  requireRef: string;
  piletName: string;
}

export default function pilet({ id, debug, piletName, importmap, requireRef }: PiletPluginOptions): Plugin {
  const cssFiles: Array<string> = [];

  return {
    name: 'pilet',
    transform(_, id) {
      if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
        cssFiles.push(id);
      }
    },
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach((file) => {
        const asset = bundle[file];

        if (asset.type === 'chunk' && asset.isEntry && asset.name === id) {
          const sm = bundle[`${file}.map`];
          const ms = new MagicString(asset.code);
          prependBanner(ms, requireRef, importmap);
          asset.code = ms.toString();

          if (sm && 'source' in sm && typeof sm.source === 'string') {
            // shift source map by a single (unmapped) line
            const map = JSON.parse(sm.source);
            const arr = decode(map.mappings);
            arr.unshift([]);
            map.mappings = encode(arr);
            sm.source = JSON.stringify(map);
          }
        }
      });
    },
    renderChunk(content, asset) {
      const ms = new MagicString(content);
      modifyImports(ms, importmap);

      if (asset.isEntry && asset.name === id && cssFiles.length) {
        insertStylesheet(ms, piletName, debug);
      }

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      };
    },
  };
}
