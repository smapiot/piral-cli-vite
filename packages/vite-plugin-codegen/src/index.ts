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
