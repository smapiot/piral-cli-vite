import MagicString from 'magic-string';
import type { SharedDependency } from 'piral-cli';
import { PiletPluginOptions } from './types';

export function modifyImports(ms: MagicString, dependencies: Array<SharedDependency>) {
  ms.replace(/\[.*?\]/, (s) => {
    dependencies.forEach((dep) => {
      const depRef = (dep as any).requireId || dep.id;
      s = s.replace(`'${dep.name}'`, `'${depRef}'`);
    });

    return s;
  });
}

export function prependBanner(
  ms: MagicString,
  requireRef: string,
  dependencies: Array<SharedDependency>,
  schema: PiletPluginOptions['schema'],
) {
  const deps = dependencies.reduce((deps, dep) => {
    deps[dep.id] = dep.ref;
    return deps;
  }, {});

  if (schema === 'v2') {
    ms.prepend(`//@pilet v:2(${requireRef},${JSON.stringify(deps)})\n`);
  } else if (schema === 'v3') {
    ms.prepend(`//@pilet v:3(${requireRef},${JSON.stringify(deps)})\n`);
  }
}

export function insertStylesheet(ms: MagicString, name: string, debug: boolean, schema: PiletPluginOptions['schema']) {
  if (schema === 'v2') {
    const bundleUrl = `function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}`;
    const cssFiles = ['style.css'];
    const stylesheet = [
      `var d=document`,
      `var __bundleUrl__=(${bundleUrl})()`,
      `${JSON.stringify(cssFiles)}.forEach(cf=>{`,
      `  var u=__bundleUrl__+cf`,
      `  var e=d.createElement("link")`,
      `  e.setAttribute('data-origin', ${JSON.stringify(name)})`,
      `  e.type="text/css"`,
      `  e.rel="stylesheet"`,
      `  e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
      `  d.head.appendChild(e)`,
      `})`,
    ].join(';\n  ');
    const insertLink = `(function(){\n  ${stylesheet};\n})()`;
    const execute = 'execute: (function () {';
    ms.replace(execute, `${execute}\n${insertLink}`);
  } else if (schema === 'v3') {
    const cssFiles = ['style.css'];
    const execute = 'execute: (function () {';
    const insertLink = `exports("styles", ${JSON.stringify(cssFiles)})`;
    ms.replace(execute, `${execute}\n${insertLink}`);
  }
}
