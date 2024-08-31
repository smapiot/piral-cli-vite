import type { Plugin } from 'vite';
import { createRequire } from 'module';

const requireModule = createRequire(__filename);

function reloadGenerator(name: string) {
  const path = requireModule.resolve(name);
  delete requireModule.cache[path];
  return requireModule(name);
}

export default function codegen(options = { outDir: 'dist', rootDir: process.cwd() }): Plugin {
  return {
    name: 'codegen',
    resolveId(source) {
      if (source.endsWith('.codegen')) {
        return source;
      }

      return null;
    },
    load(name) {
      if (name.endsWith('.codegen')) {
        const generator = reloadGenerator(name);

        return generator.call({
          name,
          options,
          addDependency: (file) => {
            this.addWatchFile(file);
          },
        });
      }

      return null;
    },
  };
}
