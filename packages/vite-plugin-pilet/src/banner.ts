import type { SharedDependency } from 'piral-cli';

export function modifyImports(code: string, dependencies: Array<SharedDependency>) {
  code = code.replace(/\[.*?\]/, (s) => {
    dependencies.forEach((dep) => {
      const depRef = (dep as any).requireId || dep.id;
      s = s.replace(`'${dep.name}'`, `'${depRef}'`);
    });

    return s;
  });

  return code;
}

export function prependBanner(code: string, requireRef: string, dependencies: Array<SharedDependency>) {
  const deps = dependencies.reduce((deps, dep) => {
    deps[dep.id] = dep.ref;
    return deps;
  }, {});
  const head = `//@pilet v:2(${requireRef},${JSON.stringify(deps)})`;
  return `${head}\n${code}`;
}

export function insertStylesheet(code: string, name: string, debug: boolean) {
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
  return code.replace(execute, `${execute}\n${insertLink}`);
}
