(function(){
const $=id=>document.getElementById(id);
const W=320;let H=200;
const renderer=new THREE.WebGLRenderer({antialias:false});renderer.domElement.className='view';
$('game').appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8fd3ff);scene.fog=new THREE.Fog(0x8fd3ff,80,260);
const cam=new THREE.PerspectiveCamera(60,1.6,0.5,400);
function resize(){const a=innerWidth/innerHeight;H=Math.round(W/a);renderer.setSize(W,H,false);cam.aspect=a;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
scene.add(new THREE.HemisphereLight(0xffffff,0x557744,0.7));
const sun=new THREE.DirectionalLight(0xfff2cc,0.9);sun.position.set(60,100,40);scene.add(sun);
const M=c=>new THREE.MeshLambertMaterial({color:c});
const P=(c,sh)=>new THREE.MeshPhongMaterial({color:c,shininess:sh||90,specular:0xffffff});
const box=(w,h,d,m,x,y,z,par)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);(par||scene).add(b);return b;};
// ground & road loop rectangle
const RX=200,RZ=140,RW=16;
box(800,1,800,M(0x4caf50),0,-0.5,0);
const roadM=M(0x444444),lineM=M(0xffee55);
box(2*RX+RW,0.1,RW,roadM,0,0.05,-RZ);box(2*RX+RW,0.1,RW,roadM,0,0.05,RZ);
box(RW,0.1,2*RZ+RW,roadM,-RX,0.05,0);box(RW,0.1,2*RZ+RW,roadM,RX,0.05,0);
for(let x=-RX+10;x<RX;x+=12){box(5,0.12,0.5,lineM,x,0.06,-RZ);box(5,0.12,0.5,lineM,x,0.06,RZ);}
for(let z=-RZ+10;z<RZ;z+=12){box(0.5,0.12,5,lineM,-RX,0.06,z);box(0.5,0.12,5,lineM,RX,0.06,z);}
// cross road through town
box(2*RX,0.1,RW,roadM,0,0.05,0);
function rnd(a,b){return a+Math.random()*(b-a);}
// town buildings around x in [-150,-30], near cross road
const bc=[0xd9a066,0xc0c0c0,0x8888cc,0xcc6666,0xeeeeaa];
for(let i=0;i<40;i++){const x=rnd(-170,170),z=(Math.random()<.5?-1:1)*rnd(14,50);if(Math.abs(x)<30&&Math.abs(z)<30)continue;const h=rnd(5,20);box(rnd(6,12),h,rnd(6,12),M(bc[i%5]),x,h/2,z);}
// trees
const trunk=M(0x7a4a22),leaf=M(0x2e7d32);
for(let i=0;i<120;i++){let x=rnd(-300,300),z=rnd(-250,250);
 if(Math.abs(Math.abs(x)-RX)<14&&Math.abs(z)<RZ+14)continue;if(Math.abs(Math.abs(z)-RZ)<14&&Math.abs(x)<RX+14)continue;if(Math.abs(z)<56&&Math.abs(x)<RX)continue;
 box(1,3,1,trunk,x,1.5,z);box(4,4,4,leaf,x,5,z);}
// locations
const sites=[{n:'DEPOT',x:0,z:-RZ+14},{n:'FARM',x:RX-14,z:90},{n:'TOWN MARKET',x:-120,z:14},{n:'LUMBER MILL',x:-RX+14,z:-80},{n:'GAS STATION',x:120,z:RZ-14},{n:'WAREHOUSE',x:-60,z:RZ-14}];
sites.forEach(s=>{box(12,0.15,12,M(0x999999),s.x,0.08,s.z);});
const marker=new THREE.Mesh(new THREE.ConeGeometry(2.5,5,4),new THREE.MeshBasicMaterial({color:0x33ff66}));marker.rotation.x=Math.PI;scene.add(marker);
const ring=new THREE.Mesh(new THREE.TorusGeometry(6,0.4,4,16),new THREE.MeshBasicMaterial({color:0x33ff66}));ring.rotation.x=Math.PI/2;scene.add(ring);
// truck
const paint=P(0x6d0f1f,120),chrome=P(0xdddddd,150),glass=new THREE.MeshPhongMaterial({color:0x99ccee,transparent:true,opacity:0.45}),gray=M(0x8a8a8a),tire=M(0x111111);
const cab=new THREE.Group();scene.add(cab);
box(3,1,7.5,P(0x333333),0,1,0,cab);//frame
box(3,3,3,paint,0,2.8,1.8,cab);box(3,2.2,3,paint,0,2.2,-1,cab);//cab + hood... (+z forward)
box(3.05,0.3,0.3,chrome,0,1.4,3.3,cab);box(2.4,1.4,0.15,chrome,0,2.2,3.3,cab);//bumper/grille
box(2.6,1.2,0.1,glass,0,3.6,3.32,cab);//windshield
box(2.6,1.2,0.1,glass,1.52,3.6,1.8,cab).rotation.y=Math.PI/2;box(2.6,1.2,0.1,glass,-1.52,3.6,1.8,cab).rotation.y=Math.PI/2;
box(1.0,1.2,1,gray,0.6,2.6,1.4,cab);box(1.0,1.2,1,gray,-0.6,2.6,1.4,cab);//gray seats
box(2.8,0.6,0.5,gray,0,3,3,cab);//gray dash
box(0.3,4,0.3,chrome,1.4,4,0.3,cab);box(0.3,4,0.3,chrome,-1.4,4,0.3,cab);//stacks
box(3.1,0.2,7.6,chrome,0,1.55,0,cab);
[[1.6,2.5],[-1.6,2.5],[1.6,-2.5],[-1.6,-2.5]].forEach(p=>box(0.8,1.6,1.6,tire,p[0],0.8,p[1],cab));
const trailer=new THREE.Group();scene.add(trailer);const TL=13;
box(3.2,3.8,TL,M(0xf2f2f2),0,3.2,-TL/2+1,trailer);box(3.25,0.6,TL,paint,0,1.6,-TL/2+1,trailer);
box(3.3,0.15,TL,chrome,0,1.3,-TL/2+1,trailer);
[[1.6,-TL+3],[-1.6,-TL+3],[1.6,-TL+5],[-1.6,-TL+5]].forEach(p=>box(0.8,1.6,1.6,tire,p[0],0.8,p[1],trailer));
const cargo=box(3.0,0.2,0.2,M(0x33ff66),0,5.2,-TL/2+1,trailer);
// traffic
const path=[[-RX,-RZ],[RX,-RZ],[RX,RZ],[-RX,RZ]];const PER=2*(2*RX+2*RZ);
function pathPos(d,lane){d=((d%PER)+PER)%PER;const segs=[2*RX,2*RZ,2*RX,2*RZ];let i=0;while(d>segs[i]){d-=segs[i];i++;}
 const a=path[i],b=path[(i+1)%4],L=segs[i],t=d/L;const dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L;
 return{x:a[0]+(b[0]-a[0])*t-dz*lane,z:a[1]+(b[1]-a[1])*t+dx*lane,h:Math.atan2(dx,dz)};}
const cars=[];const cc=[0x2266ff,0xffcc00,0x22cc44,0xff7700,0xeeeeee,0x9933cc];
for(let i=0;i<14;i++){const g=new THREE.Group();box(2,1.2,4,M(cc[i%6]),0,1,0,g);box(1.8,0.9,2,glass,0,2,-0.3,g);scene.add(g);
 cars.push({g,d:RX+40+i*(PER-80)/14,lane:(i%2?-4:4),v:(i%2?-1:1)*rnd(10,16)});}
// state
const T={x:0,z:-RZ,h:Math.PI/2,v:0,steer:0,ta:Math.PI/2};
let money=0,best=+(localStorage.bigRigBest||0),phase='pickup',target=sites[0],timeLeft=0,running=false,crashCd=0,msgT=0,deliveries=0;
$('best').textContent='Best: $'+best;
function msg(s){$('msg').textContent=s;msgT=3;}
function newJob(){const o=sites.filter(s=>s!==sites[0]);target=o[Math.floor(Math.random()*o.length)];
 const d=Math.hypot(target.x-T.x,target.z-T.z);timeLeft=Math.round(d/8+30);phase='deliver';msg('Loaded! Deliver to '+target.n);}
function deliver(){const pay=500+Math.max(0,Math.round(timeLeft))*10;money+=pay;deliveries++;msg('Delivered! +$'+pay+' — back to DEPOT');phase='pickup';target=sites[0];timeLeft=0;
 if(money>best){best=money;localStorage.bigRigBest=best;}}
// input
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key.toLowerCase()=='h')horn(true);});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0;if(e.key.toLowerCase()=='h')horn(false);});
const tb={gas:0,brake:0};let wheelIn=0;
['gas','brake'].forEach(id=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();tb[id]=1;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>tb[id]=0));});
$('horn').addEventListener('pointerdown',e=>{e.preventDefault();horn(true);});['pointerup','pointerleave','pointercancel'].forEach(ev=>$('horn').addEventListener(ev,()=>horn(false)));
const wc=$('wheel');let wid=null,wx0=0;
wc.addEventListener('pointerdown',e=>{wid=e.pointerId;wx0=e.clientX;wc.setPointerCapture(wid);});
wc.addEventListener('pointermove',e=>{if(e.pointerId===wid)wheelIn=Math.max(-1,Math.min(1,(e.clientX-wx0)/60));});
['pointerup','pointercancel'].forEach(ev=>wc.addEventListener(ev,e=>{if(e.pointerId===wid){wid=null;wheelIn=0;}}));
document.addEventListener('touchmove',e=>{if(e.target&&e.target.closest&&e.target.closest('.card'))return;e.preventDefault();},{passive:false});
// audio
let ac,eng,engG,hornG;
function audio(){if(ac)return;ac=new (window.AudioContext||window.webkitAudioContext)();
 eng=ac.createOscillator();eng.type='sawtooth';eng.frequency.value=40;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=400;engG=ac.createGain();engG.gain.value=0.08;eng.connect(f).connect(engG).connect(ac.destination);eng.start();
 hornG=ac.createGain();hornG.gain.value=0;[185,233,277].forEach(fr=>{const o=ac.createOscillator();o.type='square';o.frequency.value=fr;o.connect(hornG);o.start();});
 const hf=ac.createBiquadFilter();hf.type='lowpass';hf.frequency.value=1200;hornG.connect(hf).connect(ac.destination);}
function horn(on){if(!ac)return;hornG.gain.setTargetAtTime(on?0.12:0,ac.currentTime,0.02);if(on)msg('HOOONK!');}
// wheel & dash drawing
const wx=wc.getContext('2d');
function drawWheel(a){wx.clearRect(0,0,150,150);wx.save();wx.translate(75,75);wx.rotate(a);
 const g=wx.createRadialGradient(0,0,50,0,0,70);g.addColorStop(0,'#5a2e12');g.addColorStop(.5,'#9b5a2a');g.addColorStop(1,'#4a230c');
 wx.lineWidth=16;wx.strokeStyle=g;wx.beginPath();wx.arc(0,0,60,0,7);wx.stroke();
 wx.lineWidth=1.5;for(let i=0;i<36;i++){wx.strokeStyle=i%2?'#c48446':'#3a1a08';const r=54+(i*7%12);wx.beginPath();wx.arc(0,0,r,i*0.17,i*0.17+0.5);wx.stroke();}//grain
 const ch=wx.createLinearGradient(-20,-20,20,20);ch.addColorStop(0,'#fff');ch.addColorStop(.4,'#aaa');ch.addColorStop(.6,'#eee');ch.addColorStop(1,'#666');
 wx.fillStyle=ch;[0,2.1,4.2].forEach(r=>{wx.save();wx.rotate(r+Math.PI/2);wx.fillRect(-5,0,10,54);wx.restore();});
 wx.beginPath();wx.arc(0,0,18,0,7);wx.fill();wx.fillStyle='#fff';wx.beginPath();wx.arc(-6,-6,5,0,7);wx.fill();
 wx.strokeStyle='#ccc';wx.lineWidth=2;wx.beginPath();wx.arc(0,0,68,0,7);wx.stroke();wx.restore();}
const dx=$('dash').getContext('2d');
function drawDash(){dx.clearRect(0,0,300,110);dx.fillStyle='#777';dx.fillRect(0,20,300,90);
 for(let y=26;y<110;y+=10){dx.fillStyle='#8e8e8e';dx.fillRect(0,y,300,6);}//tuck and roll
 dx.fillStyle='#5f5f5f';dx.fillRect(150,24,150,50);
 [[185,49,'mph',Math.abs(T.v)/30],[245,49,'rpm',0.2+Math.abs(T.v)/40]].forEach(g=>{dx.strokeStyle='#eee';dx.lineWidth=4;dx.beginPath();dx.arc(g[0],g[1],18,0,7);dx.stroke();dx.fillStyle='#111';dx.beginPath();dx.arc(g[0],g[1],15,0,7);dx.fill();
  const a=Math.PI*0.75+Math.min(1,g[3])*Math.PI*1.5;dx.strokeStyle='#f33';dx.lineWidth=2;dx.beginPath();dx.moveTo(g[0],g[1]);dx.lineTo(g[0]+Math.cos(a)*12,g[1]+Math.sin(a)*12);dx.stroke();});
 for(let i=0;i<4;i++){dx.fillStyle='#ddd';dx.fillRect(160+i*14,80,6,12);dx.fillStyle='#fff';dx.fillRect(161+i*14,81,2,4);}//chrome switches
 dx.fillStyle='#ccc';dx.fillRect(268,62,5,36);dx.fillStyle='#8b4a1e';dx.beginPath();dx.arc(270,60,9,0,7);dx.fill();dx.strokeStyle='#c48446';dx.beginPath();dx.arc(270,60,5,0,3);dx.stroke();//shifter
}
// loop
let last=performance.now();
function step(dt){
 const st=(keys.a||keys.arrowleft?1:0)-(keys.d||keys.arrowright?1:0)-wheelIn;
 const gas=keys.w||keys.arrowup||tb.gas,brk=keys.s||keys.arrowdown||tb.brake;
 T.steer+=(Math.max(-1,Math.min(1,st))-T.steer)*Math.min(1,dt*4);
 if(gas)T.v+=12*dt;else if(brk)T.v-=(T.v>0?25:8)*dt;else T.v*=1-0.6*dt;
 T.v=Math.max(-6,Math.min(30,T.v));
 T.h+=T.steer*T.v*dt/7*0.9;
 T.x+=Math.sin(T.h)*T.v*dt;T.z+=Math.cos(T.h)*T.v*dt;T.x=Math.max(-380,Math.min(380,T.x));T.z=Math.max(-380,Math.min(380,T.z));
 // trailer kinematics: hitch at cab -1.5
 const hx=T.x-Math.sin(T.h)*1.5,hz=T.z-Math.cos(T.h)*1.5;
 T.ta+=Math.sin(T.h-T.ta)*T.v*dt/TL*1.4;
 cab.position.set(T.x,0,T.z);cab.rotation.y=T.h;trailer.position.set(hx,0,hz);trailer.rotation.y=T.ta;
 cars.forEach(c=>{c.d+=c.v*dt;const p=pathPos(c.d,c.lane);c.g.position.set(p.x,0,p.z);c.g.rotation.y=p.h+(c.v<0?Math.PI:0);
  const tx=hx-Math.sin(T.ta)*TL/2,tz=hz-Math.cos(T.ta)*TL/2;
  if(crashCd<=0&&(Math.hypot(p.x-T.x,p.z-T.z)<4||Math.hypot(p.x-tx,p.z-tz)<5)){crashCd=2;money=Math.max(0,money-100);T.v*=-0.3;msg('CRASH! -$100');if(ac){const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=80;g.gain.value=.2;g.gain.setTargetAtTime(0,ac.currentTime,.15);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.6);}}});
 crashCd-=dt;
 if(phase==='deliver')timeLeft-=dt;
 if(Math.hypot(target.x-T.x,target.z-T.z)<9&&Math.abs(T.v)<8){phase==='pickup'?newJob():deliver();}
 cargo.visible=phase==='deliver';
 const t=performance.now()/300;marker.position.set(target.x,9+Math.sin(t),target.z);marker.rotation.y=t;ring.position.set(target.x,0.5,target.z);
 marker.material.color.setHex(phase==='pickup'?0x33ff66:0xffaa00);ring.material.color.copy(marker.material.color);
 const nar=cam.aspect<1,cd=nar?28:20;cam.position.lerp(new THREE.Vector3(T.x-Math.sin(T.h)*cd,nar?15:10,T.z-Math.cos(T.h)*cd),Math.min(1,dt*3));cam.lookAt(T.x,3,T.z);
 if(ac){eng.frequency.setTargetAtTime(38+Math.abs(T.v)*3,ac.currentTime,.1);}
 // HUD
 $('money').textContent='$'+money;$('spd').textContent=Math.round(Math.abs(T.v)*2.2)+' mph';
 const dist=Math.round(Math.hypot(target.x-T.x,target.z-T.z));
 $('timer').textContent=(phase==='deliver'?'⏱'+Math.max(0,Math.ceil(timeLeft))+'s ':'')+target.n+' '+dist+'m';
 const ang=Math.atan2(target.x-T.x,target.z-T.z)-T.h;$('arrow').style.transform='rotate('+(-ang)+'rad)';$('arrow').style.color=phase==='pickup'?'#3f6':'#fa0';
 if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').textContent='';}
 drawWheel(-T.steer*2.4);drawDash();drawMini();}
const mx=$('mini').getContext('2d');
function drawMini(){const s=110/800*1.4;mx.fillStyle='#2a5';mx.fillRect(0,0,110,85);mx.save();mx.translate(55,42);mx.scale(s,s);
 mx.strokeStyle='#555';mx.lineWidth=RW;mx.strokeRect(-RX,-RZ,2*RX,2*RZ);mx.beginPath();mx.moveTo(-RX,0);mx.lineTo(RX,0);mx.stroke();
 mx.fillStyle=phase==='pickup'?'#3f6':'#fa0';mx.fillRect(target.x-10,target.z-10,20,20);
 mx.fillStyle='#ff0';cars.forEach(c=>mx.fillRect(c.g.position.x-4,c.g.position.z-4,8,8));
 mx.fillStyle='#f22';mx.fillRect(T.x-8,T.z-8,16,16);mx.restore();}
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;if(running)step(dt);renderer.render(scene,cam);requestAnimationFrame(loop);}
cab.position.set(T.x,0,T.z);cab.rotation.y=T.h;cam.position.set(-18,9,-RZ);cam.lookAt(0,3,-RZ);drawWheel(0);drawDash();
requestAnimationFrame(loop);
function startGame(){audio();$('menu').style.display='none';running=true;last=performance.now();msg('Head to the DEPOT to pick up a load!');}
$('playBtn').onclick=startGame;$('playBtn2').onclick=startGame;
window.__game={T,get money(){return money},get phase(){return phase},get target(){return target},get running(){return running},deliveries:()=>deliveries};
})();
