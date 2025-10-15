const esbuild = require('esbuild');
const fs = require('fs');
(async ()=>{
  await esbuild.build({
    entryPoints: ['src/widget.js'],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: 'CivicChat',
    outfile: 'dist/widget.1.0.0.min.js'
  });
  // copy css
  fs.copyFileSync('src/widget.css', 'dist/widget.1.0.0.min.css');
  console.log('Build complete.');
})();
