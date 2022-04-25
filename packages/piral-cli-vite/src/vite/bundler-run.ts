import { EventEmitter } from 'events';
import { UserConfig, build } from 'vite';

interface ViteConfig extends UserConfig {
  debug: boolean;
  outFile: string;
  requireRef?: string;
}

export function runVite(options: ViteConfig) {
  const { debug, outFile, requireRef, ...config } = options;
  const eventEmitter = new EventEmitter();
  const bundle = {
    outFile: `/${outFile}`,
    outDir: config.build.outDir,
    name: outFile,
    requireRef,
  };

  return Promise.resolve({
    async bundle() {
      if (debug) {
        config.build.watch = {};
      }

      await build(config);
      return bundle;
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
