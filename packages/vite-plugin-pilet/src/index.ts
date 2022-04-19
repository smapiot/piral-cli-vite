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
    resolveId(id) {
      if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
        cssFiles.push(id);
      }

      return null;
    },
    renderChunk(content, { map, isEntry, name }) {
      let code = modifyImports(content, importmap);

      if (isEntry && name === id) {
        if (cssFiles.length) {
          code = insertStylesheet(code, piletName, debug);
        }

        code = prependBanner(code, requireRef, importmap);
        return { code, map };
      }

      return { code, map };
    },
  };
}
