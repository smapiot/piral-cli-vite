import type { SharedDependency } from 'piral-cli';

export interface PiletPluginOptions {
  id: string;
  debug: boolean;
  importmap: Array<SharedDependency>;
  requireRef: string;
  piletName: string;
  schema: 'v2' | 'v3';
}
