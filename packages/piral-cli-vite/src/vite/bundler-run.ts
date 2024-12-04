import { EventEmitter } from 'events';
import { InlineConfig, build } from 'vite';

interface ViteConfig extends InlineConfig {
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

      const watcher = await build(config);

      if (debug && 'on' in watcher) {
        watcher.on('event', (event) => {
          if (event.code === 'ERROR') {
            console.error(event);
          } else if (event.code === 'BUNDLE_START') {
            console.info('Bundling ...');
          } else if (event.code === 'BUNDLE_END') {
            event.result.close();
            console.info('Bundled!');
          } else if (event.code === 'END') {
            eventEmitter.emit('end', bundle);
          }
        });

        eventEmitter.emit('start', bundle);
      }

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
