import { rollup, watch, RollupOptions } from 'rollup';
import { EventEmitter } from 'events';

interface RollupConfig extends RollupOptions {
  debug: boolean;
  outFile: string;
  requireRef?: string;
}

export function runRollup(options: RollupConfig) {
  const { debug, output, outFile, requireRef, ...input } = options;
  const out = Array.isArray(output) ? output.shift() : output;
  const eventEmitter = new EventEmitter();
  const bundle = {
    outFile: `/${outFile}`,
    outDir: out.dir,
    name: outFile,
    requireRef,
  };

  return Promise.resolve({
    async bundle() {
      if (debug) {
        const watcher = watch({ ...input, output });
        watcher.on('event', (event) => {
          if (event.code === 'ERROR') {
            console.log(event);
          } else if (event.code === 'BUNDLE_START') {
            console.log('Bunding ...');
          } else if (event.code === 'BUNDLE_END') {
            event.result.close();
            console.log('Bundled!');
          } else if (event.code === 'END') {
            eventEmitter.emit('end', bundle);
          }
        });
        eventEmitter.emit('start', bundle);
      } else {
        const b = await rollup(input);
        await b.write(out);
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
