const SP={};
function mkImg(u){const i=new Image();i.src=u;return i;}
for(const k in SPD){const o=SPD[k];SP[k]={w:o.w,h:o.h,ax:o.ax,ay:o.ay,top:o.top,s:o.s||1,idle:o.idle.map(mkImg),atk:o.atk.map(mkImg)};}
const SHW={tank:34,dps:30,tp:34,clorox:44,boss:64};
function drawFrame(c,img){if(!img||!img.complete)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.drawImage(img,0,0);}
/* m = css px per sprite pixel. box=true -> normal sized box (menus); else zero-size anchor at the feet (battle) */
function spriteArt(el,key,m,box){
  el.className='msp';el.innerHTML='';const S=SP[key];const m0=m;m=m*S.s;
  const c=document.createElement('canvas');c.width=S.w;c.height=S.h;c.className='monc';c.dataset.k=key;c.dataset.m=m;
  c.style.width=(S.w*m)+'px';c.style.height=(S.h*m)+'px';c.style.imageRendering='pixelated';c.style.display='block';
  if(box){el.style.position='relative';el.style.width=(S.w*m)+'px';el.style.height=(S.h*m)+'px';el.style.margin='0 auto';}
  else{
    el.style.cssText='position:relative;width:0;height:0;margin:0';
    const sw=SHW[key]*m0,sh=sw*.3,sd=document.createElement('div');sd.className='shd';
    sd.style.cssText='position:absolute;left:'+(-sw/2)+'px;top:'+(-sh*.55)+'px;width:'+sw+'px;height:'+sh+'px';el.appendChild(sd);
    c.style.position='absolute';c.style.left=(-S.ax*m)+'px';c.style.top=(-S.ay*m)+'px';
  }
  el.appendChild(c);S.idle[0].addEventListener('load',()=>drawFrame(c,S.idle[0]));drawFrame(c,S.idle[0]);
}
let fi=0;
setInterval(()=>{fi++;document.querySelectorAll('canvas.monc').forEach(c=>{if(c.dataset.busy)return;const S=SP[c.dataset.k];drawFrame(c,S.idle[fi%4]);});},210);
/* attack timeline: [frame, ms, dx(px in sprite units), sx, sy] */
const HERO_ST=[[0,100,-2,1,1],[1,90,5,1,1],[2,150,9,1,1],[3,130,2,1,1]];
const STEPS={clorox:[[0,110,0,1.03,.95],[1,100,0,1,1],[2,130,0,.97,1.05],[3,130,0,1,1]],
  tp:[[0,110,0,1.03,.95],[1,110,-4,1,1],[2,150,-8,1,1],[3,130,-2,1,1]],tank:[[0,100,-4,1,1],[1,90,10,1,1],[2,150,18,1,1],[3,130,4,1,1]],dps:HERO_ST,
  boss:[[0,130,0,1.03,.95],[1,110,0,1,1],[2,150,0,.97,1.05],[3,150,0,1,1]]};
STEPS.bottle=STEPS.clorox;STEPS.bossx=STEPS.boss;SHW.bottle=44;SHW.bossx=64;
STEPS.pzburnt=STEPS.tp;STEPS.pzmessy=STEPS.tp;SHW.pzburnt=34;SHW.pzmessy=40;STEPS.belt=STEPS.tp;STEPS.machine=STEPS.tp;SHW.belt=34;SHW.machine=44;for(let i=1;i<=5;i++){STEPS['bh'+i]=STEPS.boss;SHW['bh'+i]=50;}
STEPS.fcondom=STEPS.tp;STEPS.pcondom=STEPS.tp;STEPS.bh2=STEPS.boss;SHW.fcondom=34;SHW.pcondom=38;SHW.bh2=50;
['rafinha','lucao','copello','chavoso','glem','malaguti','samuel','rubens','ze','donnie'].forEach(k=>{STEPS[k]=HERO_ST;SHW[k]=30;});STEPS.rafinha=STEPS.tank;STEPS.lucao=STEPS.tank;STEPS.glem=STEPS.tank;STEPS.malaguti=STEPS.tank;SHW.rafinha=40;SHW.lucao=34;SHW.glem=34;
/*GENART*/
STEPS['tp']=STEPS.tp;SHW['tp']=34;
STEPS['clorox']=STEPS.tp;SHW['clorox']=40;
STEPS['fcondom']=STEPS.tp;SHW['fcondom']=34;
STEPS['pcondom']=STEPS.tp;SHW['pcondom']=40;
STEPS['belt']=STEPS.tp;SHW['belt']=34;
STEPS['machine']=STEPS.tp;SHW['machine']=42;
STEPS['pzburnt']=STEPS.tp;SHW['pzburnt']=34;
STEPS['pzmessy']=STEPS.tp;SHW['pzmessy']=40;
STEPS['tank']=HERO_ST;SHW['tank']=34;
STEPS['dps']=HERO_ST;SHW['dps']=30;
STEPS['ze']=HERO_ST;SHW['ze']=32;
STEPS['donnie']=HERO_ST;SHW['donnie']=32;
STEPS['chavoso']=HERO_ST;SHW['chavoso']=30;
STEPS['rafinha']=HERO_ST;SHW['rafinha']=34;
STEPS['ch5clone']=STEPS.tp;SHW['ch5clone']=34;
STEPS['ch5deluxe']=STEPS.tp;SHW['ch5deluxe']=40;
STEPS['bh3']=STEPS.boss;SHW['bh3']=56;
STEPS['bh1']=STEPS.boss;SHW['bh1']=56;
STEPS['bh5']=STEPS.boss;SHW['bh5']=56;
STEPS['bh2']=STEPS.boss;SHW['bh2']=56;
STEPS['bh4']=STEPS.boss;SHW['bh4']=56;
STEPS['rafinha_orc']=STEPS.tank;SHW['rafinha_orc']=40;
STEPS['samuel']=HERO_ST;SHW['samuel']=30;
STEPS['rubens']=HERO_ST;SHW['rubens']=30;
STEPS['glem']=HERO_ST;SHW['glem']=30;
STEPS['glem_tiger']=HERO_ST;SHW['glem_tiger']=36;
/*END-GENART*/
function atkEl(el){
  const c=el.querySelector('canvas.monc');if(!c||c.dataset.busy)return;
  const k=c.dataset.k,m=+c.dataset.m,S=SP[k];c.dataset.busy=1;
  c.style.transformOrigin=(S.ax*m)+'px '+(S.ay*m)+'px';
  let t=0;
  STEPS[k].forEach(([f,dur,dx,sx,sy])=>{setTimeout(()=>{drawFrame(c,S.atk[f]);c.style.transform='translateX('+dx*m+'px) scale('+sx+','+sy+')';},t);t+=dur;});
  setTimeout(()=>{delete c.dataset.busy;c.style.transform='';},t);
}
