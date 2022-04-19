import { existsSync } from 'fs';
import { resolve } from 'path';
import { defaultViteConfig } from './constants';

export function extendConfig(viteConfig: any, root: string): any {
  const otherConfigPath = resolve(root, defaultViteConfig);

  if (existsSync(otherConfigPath)) {
    const otherConfig = require(otherConfigPath);

    if (typeof otherConfig === 'function') {
      viteConfig = otherConfig(viteConfig);
    } else if (typeof otherConfig === 'object') {
      return {
        ...viteConfig,
        ...otherConfig,
      };
    } else {
      console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
    }
  }

  return viteConfig;
}
