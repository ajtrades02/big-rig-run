const fs=require('fs');
let three=fs.readFileSync('node_modules/three/build/three.min.js','utf8').replace(/console\.warn\('Scripts "build\/three\.js"[^)]*\)/,'0');
const game=fs.readFileSync('src/game.js','utf8');
let t=fs.readFileSync('src/template.html','utf8');
t=t.replace('/*THREE*/',()=>three).replace('/*GAME*/',()=>game);
fs.writeFileSync('index.html',t);console.log('built',t.length);
