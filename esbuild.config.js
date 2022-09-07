import esbuild from "esbuild";
import { nodeBuiltIns } from "esbuild-node-builtins";
// import GlobalsPlugin from "esbuild-plugin-globals";
import brode from '@geut/esbuild-plugin-brode'

const watch = (process.argv.includes('-w') || process.argv.includes('-watch'))
  ? {
    onRebuild(error,result){
      console.log('rebuilt',{error,result});
    }
  }
  : false;
const globalName = 'JSONStackData';
const entryPoints = ['src/index.ts'];
const webPlugins = [nodeBuiltIns(),brode()];
const webCorePlugins = webPlugins.concat([
  // GlobalsPlugin({
  //   react: "React",
  //   'react-dom': "ReactDOM"
  // })
],
);
const serverPlugins = [];
const serverExternals = [
  'valid-url',
  'http',
  'https',
  "csvtojson",
  "js-grid-search-lite",
  "lodash.range",
  "lodash.rangeright",
  "ml-confusion-matrix",
  "ml-matrix",
  "ml-stat",
  "natural",
  "node-fpgrowth",
  "probability-distributions",
  "random-js",
  "valid-url",
  'wordnet-db',
  'webworker-threads',
  'lapack'
];



void async function main(){
  try {
    const browserMinifiedBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:true,
      sourcemap:true,
      target:['es2019'],
      plugins: webPlugins,
      outfile:'dist/web/index.min.js'
    });
    const browserBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      sourcemap:true,
      target:['es2019'],
      plugins: webPlugins,
      outfile:'dist/web/index.js'
    });
    const browserLegacyBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      sourcemap:true,
      target:['es6'],
      plugins: webCorePlugins,
      outfile:'dist/web/index.legacy.js'
    });
    const browserLegacyMinifiedBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:true,
      sourcemap:true,
      target:['es6'],
      plugins: webCorePlugins,
      outfile:'dist/web/index.legacy-min.js'
    });

    const cjsBuild = await esbuild.build({
      watch,
      format:'cjs',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      external: serverExternals,
      sourcemap:false,
      platform:'node',
      plugins: serverPlugins,
      outfile:'dist/cjs/index.js'
    });
    const esmBuild = await esbuild.build({
      watch,
      format:'esm',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      external: serverExternals,
      sourcemap:false,
      platform:'node',
      plugins: serverPlugins,
      outfile:'dist/esm/index.js'
    });

    console.log({
      browserBuild,
      browserMinifiedBuild,
      browserLegacyBuild, 
      browserLegacyMinifiedBuild,
      cjsBuild, 
      esmBuild
    });
  } catch(e){
    console.error(e);
  }
}();