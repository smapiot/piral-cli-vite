import type { SharedDependency } from 'piral-cli';
import { Plugin } from 'rollup';
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
          asset.code = prependBanner(asset.code, requireRef, importmap);
        }
      });
    },
    renderChunk(content, asset) {
      const code = modifyImports(content, importmap);

      if (asset.isEntry && asset.name === id && cssFiles.length) {
        return insertStylesheet(code, piletName, debug);
      }

      return code;
    },
  };
}
