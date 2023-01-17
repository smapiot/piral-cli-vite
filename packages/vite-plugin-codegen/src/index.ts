import type { Plugin } from 'vite';

function reloadGenerator(name: string) {
  delete require.cache[require.resolve(name)];
  return require(name);
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
    load(id) {
      if (id.endsWith('.codegen')) {
        const generator = reloadGenerator(id);

        return generator.call({
          name: id,
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
