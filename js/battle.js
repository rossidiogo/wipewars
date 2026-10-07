/* ================= battle ================= */
let stage=1,units=[],over=false,speed=1,pendingStage=1,selSlot=null,FS=1;
const VT={tank:6,dps:14,tp:12,clorox:46};
const LANE_Y=[66,77,88];
const KINDS={
  tp:{n:'Toilet Paper',r:0,hp:60,atk:8,iv:1.1,key:'tp',m:1,pr:0},
  clorox:{n:'Clorox Wipes',r:2,hp:130,atk:14,iv:1.3,key:'clorox',m:1,pr:1},
  boss:{n:'Big Head',r:3,hp:420,atk:20,iv:1.5,key:'bh1',m:.9,pr:1},
  bottle:{n:'Bottle',r:2,hp:130,atk:14,iv:1.3,key:'bottle',m:.8,pr:1},
  bossx:{n:'Boss',r:3,hp:420,atk:20,iv:1.5,key:'bossx',m:.66,pr:1}
};
/* themed monsters per chapter: recolored versions of the base art until real designs exist */
const CHAPMON=[
  {n:['tp','clorox','boss']},
  {n:['fcondom','pcondom','bighead2'],names:['Frozen Condom','Permafrost Prophylactic','Big Head'],k:['fcondom','pcondom','bh2'],m:[1,1,.8]},
  {n:['belt','sander','bighead3'],names:['Sandpaper','Belt Sander','Big Head'],k:['belt','machine','bh3'],m:[1,1,.72]},
  {n:['pzburnt','pzmessy','bighead4'],names:['Burnt Mini Pizza','Dropped Pizza','Big Head'],k:['pzburnt','pzmessy','bh4'],m:[1,1,.62]},
  {n:['cobweb','mold','bighead5'],names:['Cobweb Roll','Mold Spray','Big Head'],f:['hue-rotate(260deg) saturate(.9) brightness(.8)','hue-rotate(110deg) saturate(1.5) brightness(.85)',''],k:[null,null,'bh5'],m:[null,null,.6]}
];
CHAPMON.forEach((c,ci)=>{if(ci===0)return;const base=['tp','bottle','bossx'];c.n.forEach((id,i)=>{const b=KINDS[base[i]];KINDS[id]=Object.assign({},b,{n:c.names[i],f:c.f&&c.f[i],key:(c.k&&c.k[i])||b.key,m:(c.m&&c.m[i])||b.m,hp:Math.round(b.hp*(1+.35*ci)),atk:Math.round(b.atk*(1+.3*ci))});});});
const RC=['#d8d4c8','#8c8cff','#ffe96a','#c8742a'],RN=['Normal','Magic','Rare','Legendary'];

/* slot 0-2 = front row, 3-5 = back row; lane 0 is the far (upper) lane */
function slotPos(side,slot){const row=slot<3?0:1,lane=slot%3;const x=side==='h'?[40,20][row]+(1-lane)*2.5:[60,84][row]-(1-lane)*2.5;return {x,y:LANE_Y[lane],row,lane};}
function fixForm(){
  let t=(save.team||[]).filter((k,i,a)=>HEROES[k]&&isOwned(k)&&a.indexOf(k)===i).slice(0,MAXTEAM);if(!t.length)t=['tank'];
  save.team=t;const f=save.form||{},used=new Set();
  t.forEach(k=>{let s=f[k];if(!(s>=0&&s<6)||used.has(s))s=null;if(s!==null)used.add(s);f[k]=s;});
  t.forEach(k=>{if(f[k]===null){const H=HEROES[k],pref=H.cls==='tank'?[1,0,2,4,3,5]:(H.rng||H.cls==='sup')?[4,5,3,1,0,2]:[0,2,1,3,5,4];f[k]=pref.find(x=>!used.has(x));used.add(f[k]);}});
  save.form=f;
}
fixForm();

function mk(side,name,role,hp,atk,iv,cls){return {side,name,role,hp,max:hp,atk,iv,t:Math.random()*iv*0.5,cls,el:null,fx:[]};}
/* status effects: {k:'atk'|'in'|'spd'|'stun'|'grow'|'tiger', m, t seconds, tag} */
const fxm=(u,k)=>u.fx.reduce((a,f)=>f.k===k?a*f.m:a,1);
const A=u=>u.atk*fxm(u,'atk')*((u.side==='h'&&u.kind!=='ze'&&units.some(z=>z.kind==='ze'&&z.hp>0))?1.08:1);
const stunned=u=>u.fx.some(f=>f.k==='stun');
function addFx(u,k,m,t,tag){u.fx=u.fx.filter(f=>!(f.k===k&&f.tag===(tag||k)));u.fx.push({k,m,t,tag:tag||k});fxVis(u);}
function fxVis(u){
  if(!u.el)return;const has=k=>u.fx.some(f=>f.k===k);
  u.el.classList.toggle('fx-buff',u.fx.some(f=>f.k==='atk'&&f.m>1));
  u.el.classList.toggle('fx-curse',u.fx.some(f=>(f.k==='atk'&&f.m<1)||(f.k==='in'&&f.m>1)));
  u.el.classList.toggle('fx-stun',has('stun'));
  const g=u.fx.filter(f=>f.k==='grow').reduce((a,f)=>Math.max(a,f.m),1),sp=u.el.querySelector('.msp,.spr'),hud=u.el.querySelector('.hud');
  sp.style.scale=g>1?g:'';if(hud&&u.hy!==undefined)hud.style.top=Math.round(u.hy*g-(u.side==='h'?20:16))+'px';
  if(u.side==='h'){const cv=sp.querySelector('canvas');if(cv)cv.style.filter=has('tiger')?'sepia(1) saturate(5) hue-rotate(-28deg) brightness(1.1)':'';}
}
function stageList(n){
  const cnt=Math.min(5,3+Math.floor((n-1)/4)),nC=Math.min(cnt-1,Math.floor(n/3)),l=[];
  const cm=CHAPMON[chapOf(n)].n;
  for(let i=0;i<cnt;i++)l.push(i<cnt-nC?cm[0]:cm[1]);
  if(stageIn(n)===10)l[l.length-1]=cm[2];
  return l;
}
function stageGold(n){return stageList(n).reduce((a,k)=>a+ECON.stageGoldKinds[KINDS[k].r],0)*n;}
function placeMonsters(list){
  const order=[1,0,2],used=new Set();
  return list.map(kd=>{const pr=KINDS[kd].pr;let s=null;for(const r of [pr,1-pr]){for(const l of order){const sl=r*3+l;if(!used.has(sl)){s=sl;break;}}if(s!==null)break;}used.add(s);return s;});
}
function startStage(n){
  stage=n;$('result').classList.remove('on');
  const c=chapOf(n);
  if(!window.NOCUT&&typeof playCut==='function'&&!SEEN_CH[c]){SEEN_CH[c]=1;playCut(c,()=>{openScreen('fight');setup();});return;}
  openScreen('fight');setup();
}
$('back').onclick=()=>{over=true;$('result').classList.remove('on');openScreen('campaign');};

function setup(){
  stageBanner();
  const s=stage-1;fixForm();$('result').classList.remove('on');
  FS=($('field').clientWidth||360)/320;
  $('fbg').style.filter=chapOf(stage)===1?'saturate(.55) brightness(1.18) hue-rotate(-8deg)':'none';$('fbg').style.backgroundImage='url('+BGCH[chapOf(stage)]+')';
  units=save.team.map(r=>{const H=HEROES[r],st=heroStats(r);const u=mk('h',H.n,H.cls,st.hp,st.atk,H.iv,r);u.kind=r;u.m=H.sc||1;u.rng=H.rng;u.heal=H.heal;u.slot=save.form[r];u.mmax=ULT[r].mana;u.mana=0;u.shield=0;return u;});
  const list=stageList(stage),slots=placeMonsters(list);
  list.forEach((kd,i)=>{const k=KINDS[kd];const u=mk('m',k.n,'mon',Math.round(k.hp*(1+.25*s)*Math.pow(ECON.monsterGrowth,s)),Math.round(k.atk*(1+.2*s)*Math.pow(ECON.monsterGrowth,s)),k.iv,k.key);u.kind=kd;u.m=k.m;u.rar=k.r;u.slot=slots[i];units.push(u);});
  $('fHeroes').innerHTML='';$('fMons').innerHTML='';
  units.forEach(u=>{
    const p=slotPos(u.side,u.slot);u.row=p.row;u.lane=p.lane;
    const d=document.createElement('div');d.className='unit s'+u.side+' spawn';d.style.animationDelay=(Math.random()*.35)+'s';d.style.setProperty('--rk',(u.side==='h'?-1:1)*2.5*FS+'px');setTimeout(()=>d.classList.remove('spawn'),1100);
    d.style.left=p.x+'%';d.style.top=p.y+'%';d.style.zIndex=Math.round(p.y*10)+(u.side==='m'?1:0);
    d.innerHTML='<div class="hud"><div class="bar"><b></b><i></i></div>'+(u.side==='h'?'<div class="mana" style="width:'+Math.round(u.mmax*.6)+'px"><b></b></div>':'')+'</div><div class="spr"></div>';
    const key=u.side==='h'?u.kind:KINDS[u.kind].key,sc=u.m*FS;
    u.el=d;spriteArt(d.querySelector('.spr'),key,sc);
    if(u.side==='m'&&KINDS[u.kind].f){const cv=d.querySelector('canvas');if(cv)cv.style.filter=KINDS[u.kind].f;}
    u.hy=-(SP[key].ay-SP[key].top)*sc*SP[key].s;d.querySelector('.hud').style.top=Math.round(u.hy-(u.side==='h'?20:16))+'px';
    if(u.side==='m')d.querySelector('.bar').style.borderColor=RC[u.rar];
    $(u.side==='h'?'fHeroes':'fMons').appendChild(d);refresh(u);
  });
  (function(){const f=$('field');f.querySelectorAll('.mote').forEach(e=>e.remove());for(let i=0;i<16;i++){const m=document.createElement('i');m.className='mote';m.style.left=(Math.random()*100)+'%';m.style.top=(10+Math.random()*80)+'%';m.style.animationDuration=(6+Math.random()*8)+'s';m.style.animationDelay=(-Math.random()*8)+'s';f.appendChild(m);}})();
  over=false;
  $('fplq').innerHTML='<small>Chapter '+(chapOf(stage)+1)+' &middot; '+ECON.chapters[chapOf(stage)].n+'</small><b>Stage '+stageLabel(stage)+(stageIn(stage)===10?' &middot; Boss':'')+'</b>';
  $('autoU').classList.toggle('on',!!save.autoUlt);$('autoU').textContent='Auto ultimates: '+(save.autoUlt?'On':'Off');
  buildUlts();
}
function updEnemies(){
  const ms=units.filter(u=>u.side==='m'),left=ms.filter(u=>u.hp>0).length;
  $('ecount').textContent=left+' / '+ms.length+' remaining';
  const g={};ms.forEach(u=>{const k=g[u.kind]=g[u.kind]||{n:0,a:0,r:u.rar};k.n++;if(u.hp>0)k.a++;});
  $('elist').innerHTML=Object.keys(g).map(k=>'<div class="erow"><span style="color:'+RC[g[k].r]+'">'+KINDS[k].n+'</span><small>'+g[k].a+' / '+g[k].n+' &middot; '+RN[g[k].r]+'</small></div>').join('');
}
function refresh(u){
  u.el.querySelector('.bar b').style.width=Math.max(0,u.hp/u.max*100)+'%';
  u.el.querySelector('.bar i').style.width=Math.min(100,(u.shield||0)/u.max*100)+'%';
  u.el.classList.toggle('shielded',(u.shield||0)>0&&u.hp>0);
  if(u.hp<=0&&!u.el.classList.contains('dead')){poof(u);if(u.side==='h')shake(4);}u.el.classList.toggle('dead',u.hp<=0);
  updMana(u);if(units.length&&$('ecount'))updEnemies();
}
function updMana(u){
  if(u.side!=='h')return;
  const m=u.el.querySelector('.mana');m.querySelector('b').style.width=(u.mana/u.mmax*100)+'%';
  m.classList.toggle('full',u.mana>=u.mmax&&u.hp>0);m.style.visibility=u.hp>0?'visible':'hidden';
  updUlts();
}
function sparks(u,cols){const y=(u.hy||-40)*.45,n=7;for(let i=0;i<n;i++){const e=document.createElement('span');e.className='sp px';e.style.left='0px';e.style.top=y+'px';const a=-1.6+(Math.random()-.5)*3.2+(u.side==='h'?-.6:.6),v=(12+Math.random()*22)*FS;e.style.setProperty('--vx',Math.cos(a)*v*(u.side==='h'?-1:1)*-1+'px');e.style.setProperty('--vy',Math.sin(a)*v+'px');e.style.background=(cols||['#fff6c0','#ffd84a','#ff8f1e'])[i%3];u.el.appendChild(e);setTimeout(()=>e.remove(),500);}}
function shake(a){const f=$('field');if(!f)return;f.style.setProperty('--sa',(a||3)*FS+'px');f.classList.remove('shk');void f.offsetWidth;f.classList.add('shk');}
function poof(u){for(let i=0;i<6;i++){const e=document.createElement('span');e.className='dust';e.style.left=((Math.random()-.5)*26*FS)+'px';e.style.top=(-4*FS)+'px';e.style.setProperty('--dx',((Math.random()-.5)*20*FS)+'px');u.el.appendChild(e);setTimeout(()=>e.remove(),700);}}
function pop(u,txt,cls){if(!cls){u.el.classList.add('hit');setTimeout(()=>u.el.classList.remove('hit'),130);sparks(u);}const f=document.createElement('span');f.className='fl '+(cls||'')+(u.side==='h'&&!cls?' hurt':'');f.textContent=txt;f.style.top=Math.round((u.hy||-40)+10)+'px';u.el.appendChild(f);setTimeout(()=>f.remove(),800);}
const alive=side=>units.filter(u=>u.side===side&&u.hp>0);

/* monsters always go for the tank first, then the closest (front) row; heroes go front to back. Random inside a row. */
function pickTarget(u){
  const foes=alive(u.side==='h'?'m':'h');if(!foes.length)return null;
  if(u.side==='m'){const tank=foes.find(f=>f.role==='tank');if(tank)return tank;}
  if(u.side==='h'&&u.rng)return foes[rnd(foes.length)];
  const front=foes.filter(f=>f.row===0),pool=front.length?front:foes;
  return pool[rnd(pool.length)];
}
function dealDamage(t,dmg,src,tag){
  if(t.hp<=0||over)return;
  if(save.digas){if(t.side==='h'&&save.dgInv)return;if(t.side==='m'&&save.dgKill)dmg=Math.max(dmg,t.hp+(t.shield||0)+1);}
  dmg=Math.max(1,Math.round(dmg*fxm(t,'in')));
  let d=dmg;
  if(t.shield>0){const ab=Math.min(t.shield,d);t.shield-=ab;d-=ab;}
  t.hp-=d;pop(t,'-'+dmg);sfx('hit');
  if(t.side==='h')gainMana(t,Math.min(12,3+Math.round(dmg/t.max*30)));
  refresh(t);
}

/* mana + ultimates (bar sizes differ, cast spends everything, no gain while full) */
function gainMana(u,n){
  if(u.side!=='h'||u.hp<=0||u.mana>=u.mmax)return;
  if(save.digas&&save.dgMana)n=u.mmax;
  u.mana=Math.min(u.mmax,u.mana+n);updMana(u);
  if(u.mana>=u.mmax&&save.autoUlt)castUlt(u);
}
function banner(u,text){const s=document.createElement('span');s.className='ban';s.textContent=text;s.style.top=Math.round((u.hy||-40)-8)+'px';u.el.appendChild(s);setTimeout(()=>s.remove(),1100);}
function flash(col){const f=document.createElement('div');f.className='ffx';f.style.background=col;$('field').appendChild(f);setTimeout(()=>f.remove(),450);}
function slash(t){const s=document.createElement('span');s.className='slash';s.style.top=Math.round((t.hy||-40)*.5-20)+'px';t.el.appendChild(s);setTimeout(()=>s.remove(),380);}
function hitFor(u,t,mult,delay){setTimeout(()=>{if(over||!t||t.hp<=0)return;slash(t);dealDamage(t,Math.round(A(u)*mult*(.9+Math.random()*.2)),u,'strikes');},delay||0);}
function healAll(h){alive('h').forEach(a=>{a.hp=Math.min(a.max,a.hp+h);pop(a,'+'+h,'heal');refresh(a);});}
function cloud(host,cols,n,delay){
  setTimeout(()=>{if(over)return;alive('h').forEach(a=>{const r=a.el.getBoundingClientRect(),hr=host.getBoundingClientRect();
    for(let i=0;i<n;i++){const e=document.createElement('span');e.className='sp';e.style.left=(r.left-hr.left+r.width/2)+'px';e.style.top=(r.top-hr.top+r.height*.4)+'px';const an=Math.random()*6.28,v=12+Math.random()*22;e.style.setProperty('--vx',Math.cos(an)*v+'px');e.style.setProperty('--vy',Math.sin(an)*v-10+'px');e.style.background=cols[rnd(cols.length)];host.appendChild(e);setTimeout(()=>e.remove(),480);}});},delay);
}
const ULTFX={
  tank:u=>{u.shield=(u.shield||0)+Math.round(u.max*.4);refresh(u);flash('#6ad0ff');},
  rafinha:u=>{const h=Math.round(u.max*.3);u.hp=Math.min(u.max,u.hp+h);pop(u,'+'+h,'heal');u.shield=(u.shield||0)+Math.round(u.max*.3);addFx(u,'atk',1.6,8);addFx(u,'grow',1.3,8);refresh(u);flash('#6aff3a');},
  lucao:u=>{
    const sp=u.el.querySelector('.msp,.spr'),fish=document.createElement('span');
    if(sp)sp.classList.add('spintop');fish.className='bigfish';fish.textContent='\u{1F41F}';u.el.appendChild(fish);
    setTimeout(()=>{if(sp)sp.classList.remove('spintop');fish.remove();},1300);
    for(let i=0;i<4;i++)alive('m').forEach(m=>hitFor(u,m,1,200+i*230));
    u.shield=(u.shield||0)+Math.round(u.max*.15);refresh(u);flash('#6ad0ff');
  },
  dps:u=>{const t=pickTarget(u);if(t){const d=Math.round(A(u)*5*(.9+Math.random()*.2));flash('#ff6a4a');
    // the cockatiel takes off from his shoulder, circles over his head, charges the enemy and flies back
    const fld=$('field'),fr=fld.getBoundingClientRect(),r1=u.el.getBoundingClientRect(),r2=t.el.getBoundingClientRect();
    const sx=r1.left-fr.left,sy=r1.top-fr.top-45,tx=r2.left-fr.left,ty=r2.top-fr.top-35,bird=document.createElement('span');
    bird.className='ckbird';bird.textContent='\u{1F426}';fld.appendChild(bird);
    const an=bird.animate([{transform:'translate('+sx+'px,'+sy+'px) scale(1)'},{transform:'translate('+sx+'px,'+(sy-48)+'px) scale(1.25)',offset:.22},{transform:'translate('+tx+'px,'+ty+'px) scale(1.35)',offset:.58},{transform:'translate('+sx+'px,'+(sy-32)+'px) scale(1.1)',offset:.88},{transform:'translate('+sx+'px,'+sy+'px) scale(1)'}],{duration:1150,easing:'ease-in-out'});
    an.onfinish=()=>bird.remove();setTimeout(()=>bird.remove(),1400);
    setTimeout(()=>{slash(t);dealDamage(t,d,u,'strikes');},670);}},
  chavoso:u=>{const ms=alive('m');if(!ms.length)return;flash('#9ae070');for(let i=0;i<4;i++)hitFor(u,ms[rnd(ms.length)],1.7,i*160);},
  copello:u=>{const t=pickTarget(u);flash('#f0a020');hitFor(u,t,4.5,200);alive('m').forEach(m=>{if(m!==t)hitFor(u,m,1.2,330);});},
  glem:u=>{addFx(u,'atk',1.8,10);addFx(u,'in',.75,10);addFx(u,'grow',1.35,10);addFx(u,'tiger',1,10);const h=Math.round(u.max*.15);u.hp=Math.min(u.max,u.hp+h);pop(u,'+'+h,'heal');refresh(u);flash('#ffa030');},
  malaguti:u=>{const t=pickTarget(u);if(!t)return;for(let i=0;i<6;i++)hitFor(u,t,i===5?2.2:1,i*130);setTimeout(()=>{if(!over)banner(t,'K.O.!');},800);flash('#ff6a4a');},
  samuel:u=>{alive('m').forEach(m=>addFx(m,'stun',1,3));const ms=alive('m').sort((a,b)=>(b.row-a.row)||(a.hp-b.hp));if(ms[0])hitFor(u,ms[0],5.5,250);flash('#6aff8a');},
  rubens:u=>{const h=Math.round(20+A(u)*2.5),host=$('field');flash('#8aa870');cloud(host,['#e8e8e0','#b8c8a8','#9ae070'],9,500);setTimeout(()=>{if(!over)healAll(h);},700);},
  ze:u=>{alive('h').forEach(a=>{addFx(a,'atk',1.35,10,'fan');addFx(a,'spd',1.25,10,'fan');if(a!==u)gainMana(a,15);});flash('#ffd84a');notesUp(u);},
  donnie:u=>{alive('m').forEach(m=>{addFx(m,'atk',.65,10,'hex');addFx(m,'in',1.25,10,'hex');});flash('#b050ff');}
};
function castUlt(u){
  if(over||u.hp<=0||u.mana<u.mmax)return;
  u.mana=0;updMana(u);sfx('ult');banner(u,ULT[u.kind].n);shake(3);atkEl(u.el);prog('ult');save.stats.casts++;
  ULTFX[u.kind](u);
}
function buildUlts(){
  const L=$('ults');L.innerHTML='';
  units.filter(u=>u.side==='h').forEach(u=>{
    const d=ULT[u.kind],b=document.createElement('button');b.className='ult';b.id='ult_'+u.kind;
    b.innerHTML='<span class="un">'+d.n+'</span><span class="ur">'+u.name+'</span><div class="mt" style="width:'+d.mana+'%"><b></b></div><span class="mn"></span>';
    b.onclick=()=>castUlt(u);L.appendChild(b);
  });
  updUlts();
}
function updUlts(){
  units.filter(u=>u.side==='h').forEach(u=>{
    const b=$('ult_'+u.kind);if(!b)return;
    const full=u.mana>=u.mmax&&u.hp>0&&!over;
    b.disabled=!full;b.classList.toggle('ready',full);
    b.querySelector('.mt b').style.width=(u.mana/u.mmax*100)+'%';
    b.querySelector('.mn').textContent=u.hp<=0?'Defeated':Math.floor(u.mana)+' / '+u.mmax;
  });
}
$('autoU').onclick=()=>{
  save.autoUlt=!save.autoUlt;persist();$('autoU').classList.toggle('on',save.autoUlt);$('autoU').textContent='Auto ultimates: '+(save.autoUlt?'On':'Off');
  if(save.autoUlt)units.filter(u=>u.side==='h').forEach(u=>{if(u.mana>=u.mmax)castUlt(u);});
};

/* burning wipes: a real sprite, flies along an arc from the mouth all the way to the target */
const WIPE=[];
(function(){
  const FL=['#7a1410','#e23a12','#ff8f1e','#ffd84a','#fff6c0'];
  for(let f=0;f<3;f++){
    const c=document.createElement('canvas');c.width=30;c.height=16;const g=c.getContext('2d');
    const px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1);};
    for(let x=0;x<17;x++){
      const t=x/16,jit=((x*7+f*5)%4)-1.5;
      const hh=Math.max(0,Math.round(Math.pow(t,.8)*6+jit*.8*t));
      const cy=8+Math.round(Math.sin((x+f*2)*.9)*1.2*(1-t));
      for(let dy=-hh;dy<=hh;dy++){
        const r=Math.abs(dy)/Math.max(1,hh);
        px(x,cy+dy,r>.8?FL[0]:r>.55?FL[1]:r>.25?FL[2]:(t>.55?FL[3]:FL[2]));
      }
      if(t>.7)px(x,cy,FL[4]);
    }
    for(let x=14;x<=28;x++){
      const cy=8+Math.round(1.3*Math.sin((x-14)/2.3+f*.4));
      for(let dy=-2;dy<=2;dy++){
        let col=dy<=-1?'#f6f3ec':dy===0?'#e6e1d4':'#c9c3b2';
        if(x<=18)col=dy<=-1?'#7a5a3a':'#3a2a1c';
        if(x===28&&Math.abs(dy)===2)continue;
        px(x,cy+dy,col);
      }
      px(x,cy-3,'#0d0a08');px(x,cy+3,'#0d0a08');
      if((x+f)%5===0)px(x,cy,'#bdb6a2');
    }
    px(29,7,'#0d0a08');px(29,8,'#0d0a08');px(29,9,'#0d0a08');
    for(let k=0;k<5;k++)px(16+((k*3+f)%4),7+(k%3)+(f%2),'#ffb23a');
    WIPE.push(c);
  }
})();
function hostXY(host,e,fx,fy){const r=e.getBoundingClientRect(),F=host.getBoundingClientRect();return [r.left-F.left+r.width*fx,r.top-F.top+r.height*fy];}
function ember(host,x,y){const e=document.createElement('span');e.className='em';e.style.left=(x+(Math.random()-.5)*14)+'px';e.style.top=(y+(Math.random()-.5)*10)+'px';e.style.background=['#ffd84a','#ff8f1e','#e23a12'][rnd(3)];host.appendChild(e);setTimeout(()=>e.remove(),520);}
function burst(host,x,y){for(let i=0;i<12;i++){const e=document.createElement('span');e.className='sp';e.style.left=x+'px';e.style.top=y+'px';const a=Math.random()*6.28,v=14+Math.random()*26;e.style.setProperty('--vx',Math.cos(a)*v+'px');e.style.setProperty('--vy',Math.sin(a)*v-8+'px');e.style.background=['#fff6c0','#ffd84a','#ff8f1e','#e23a12'][rnd(4)];host.appendChild(e);setTimeout(()=>e.remove(),480);}}
function launchWipes(host,srcCv,tgtCv,srcFy,onHit,sc){
  sc=sc||1;
  if(!host||!srcCv||!tgtCv||!srcCv.isConnected||!tgtCv.isConnected)return;
  const [sx,sy]=hostXY(host,srcCv,.42,srcFy),[tx,ty]=hostXY(host,tgtCv,.5,.55);
  const dur=Math.max(300,640/speed);let hit=false;
  for(let i=0;i<3;i++)setTimeout(()=>{
    if(!srcCv.isConnected)return;
    const w=document.createElement('canvas');w.width=30;w.height=16;w.className='wip';w.style.width=Math.round(30*1.5*sc)+'px';w.style.height=Math.round(16*1.5*sc)+'px';
    host.appendChild(w);const g=w.getContext('2d');
    const jx=(Math.random()-.5)*26,jy=(Math.random()-.5)*22,ex=tx+jx*.3,ey=ty+jy*.3;
    const cx=(sx+ex)/2+jx,cy=Math.min(sy,ey)-60-Math.random()*40;
    const t0=performance.now();let last=-999,fr=0;
    (function step(now){
      const t=Math.min(1,(now-t0)/dur),u=1-t;
      const x=u*u*sx+2*u*t*cx+t*t*ex,y=u*u*sy+2*u*t*cy+t*t*ey;
      const dx=2*u*(cx-sx)+2*t*(ex-cx),dy=2*u*(cy-sy)+2*t*(ey-cy);
      w.style.left=x+'px';w.style.top=y+'px';
      w.style.transform='translate(-50%,-50%) scaleX(-1) rotate('+Math.atan2(dy,-dx)+'rad)';
      if(now-last>70){fr=(fr+1)%3;g.clearRect(0,0,30,16);g.drawImage(WIPE[fr],0,0);last=now;ember(host,x,y);}
      if(t<1)requestAnimationFrame(step);
      else{w.remove();burst(host,ex,ey);if(!hit){hit=true;onHit&&onHit();}}
    })(t0);
  },i*Math.max(40,120/Math.max(1,speed*.6)));
}

/* Ze Vitor: musical notes fly up out of him (ultimate) and he throws drumsticks (basic attack) */
function notesUp(u){
  const fld=$('field'),fr=fld.getBoundingClientRect(),r=u.el.getBoundingClientRect(),x0=r.left-fr.left,y0=r.top-fr.top-30;
  for(let i=0;i<10;i++)setTimeout(()=>{
    const n=document.createElement('span');n.className='mnote';n.textContent=['♪','♫','♪','♩'][i%4];n.style.color=['#ffd84a','#6ad0ff','#ff8aa8','#9ae070'][i%4];
    n.style.left=(x0+(Math.random()-.5)*26)+'px';n.style.top=y0+'px';fld.appendChild(n);
    const dx=(Math.random()-.5)*60,an=n.animate([{transform:'translate(0,0) scale(.7)',opacity:0},{opacity:1,offset:.15},{transform:'translate('+dx+'px,-'+(70+Math.random()*50)+'px) scale(1.3)',opacity:0}],{duration:1100,easing:'ease-out'});
    an.onfinish=()=>n.remove();setTimeout(()=>n.remove(),1400);
  },i*90);
}
function throwSticks(u,t,done){
  const fld=$('field'),fr=fld.getBoundingClientRect(),r1=u.el.getBoundingClientRect(),r2=t.el.getBoundingClientRect();
  const sx=r1.left-fr.left,sy=r1.top-fr.top-30,tx=r2.left-fr.left,ty=r2.top-fr.top-30;
  [0,1].forEach(i=>setTimeout(()=>{
    const s=document.createElement('span');s.className='dstick';fld.appendChild(s);
    const my=Math.min(sy,ty)-34;
    const an=s.animate([{transform:'translate('+sx+'px,'+sy+'px) rotate(0deg)'},{transform:'translate('+((sx+tx)/2)+'px,'+my+'px) rotate(360deg)',offset:.5},{transform:'translate('+tx+'px,'+ty+'px) rotate(720deg)'}],{duration:Math.max(260,420/speed),easing:'linear'});
    an.onfinish=()=>{s.remove();if(i===1&&done)done();};setTimeout(()=>s.remove(),900);
  },i*110));
}
function act(u){
  const foes=alive(u.side==='h'?'m':'h'),allies=alive(u.side);
  if(!foes.length)return;
  if(u.heal){
    const hurt=allies.slice().sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
    if(hurt&&hurt.hp/hurt.max<0.9){atkEl(u.el);const h=Math.round(10+A(u)*0.8);hurt.hp=Math.min(hurt.max,hurt.hp+h);pop(hurt,'+'+h,'heal');refresh(hurt);gainMana(u,10);return;}
  }
  const t=pickTarget(u);if(!t)return;
  atkEl(u.el);
  const dmg=Math.max(1,Math.round(A(u)*(0.9+Math.random()*0.2)));
  if(u.side==='m'&&(u.kind==='clorox'))setTimeout(()=>launchWipes($('field'),u.el.querySelector('canvas'),t.el.querySelector('canvas'),u.kind==='boss'?.2:.17,()=>dealDamage(t,dmg,u,'burns'),FS),200);
  else if(u.side==='h'&&u.kind==='ze')setTimeout(()=>throwSticks(u,t,()=>{if(!over)dealDamage(t,dmg,u);}),100);
  else setTimeout(()=>{dealDamage(t,dmg,u);if(u.kind==='donnie'&&t.hp>0)addFx(t,'in',1.12,6,'curse');},u.side==='h'?120:220);
  gainMana(u,10);
}

function winBattle(){
  over=true;updUlts();
  sfx('win');const first=stage>save.cleared,boss=stageIn(stage)===10;
  const r={gold:stageGold(stage),tiers:[stageDropTier()]};
  if(boss)r.tiers.push(stageDropTier(.15));
  if(!first)r.xp=Math.max(1,Math.round(ECON.firstClearXp(stage)*ECON.replayXp));
  if(first){
    r.xp=ECON.firstClearXp(stage);r.gems=boss?ECON.bossFirstClearGems:ECON.firstClearGems;r.tix=boss?ECON.bossFirstClearTix:ECON.firstClearTix;
    save.cleared=stage;prog('new');
    if(boss){const c=chapOf(stage);if(!save.chapDone[c]){save.chapDone[c]=1;sendMail('Chapter '+(c+1)+' complete!',ECON.chapters[c].n+' conquered. Here is your chapter reward.',{gems:ECON.chapterGems,keys:{s:1},tix:ECON.chapterTix});}}
  }
  prog('win');save.stats.wins++;
  const out=give(r);
  const R=$('result');R.innerHTML='';
  const p=el('div','panel resp');
  p.appendChild(el('div','rtitle win','Victory'));
  p.appendChild(el('div','rsub','Stage '+stageLabel(stage)+(first?' &middot; First clear!':'')));
  p.appendChild(el('div','chips',chips(out)));
  const g=el('div','tgrid small');out.items.forEach(i=>g.insertAdjacentHTML('beforeend',tileHTML(i)));p.appendChild(g);
  const row=el('div','rbtns');
  const hasNext=stage<MAXSTAGE&&(stage+1<=save.cleared+1);
  if(hasNext){const b=el('button','btn primary','Next stage');b.onclick=()=>{startStage(stage+1);};row.appendChild(b);}
  const rp=el('button','btn','Replay');rp.onclick=()=>setup();row.appendChild(rp);
  const hm=el('button','btn','Map');hm.onclick=()=>{R.classList.remove('on');openScreen('campaign');};row.appendChild(hm);
  p.appendChild(row);R.appendChild(p);
  setTimeout(()=>R.classList.add('on'),650);
  if(save.auto&&hasNext){const cur=stage;setTimeout(()=>{if(over&&stage===cur&&$('fight').classList.contains('on')){stage++;setup();}},3200);}
  persist();
}
function loseBattle(){
  over=true;updUlts();sfx('lose');
  const R=$('result');R.innerHTML='';
  const p=el('div','panel resp');
  p.appendChild(el('div','rtitle lose','Defeat'));
  p.appendChild(el('div','rsub','Your team was wiped out. Level up your heroes or equip better gear.'));
  const row=el('div','rbtns');
  const b=el('button','btn primary','Retry');b.onclick=()=>setup();row.appendChild(b);
  const h=el('button','btn','Heroes');h.onclick=()=>{R.classList.remove('on');openScreen('heroes');};row.appendChild(h);
  const m=el('button','btn','Map');m.onclick=()=>{R.classList.remove('on');openScreen('campaign');};row.appendChild(m);
  p.appendChild(row);R.appendChild(p);setTimeout(()=>R.classList.add('on'),650);
}
function tick(dt){
  if(over||!$('fight').classList.contains('on'))return;
  units.forEach(u=>{if(u.hp<=0||over)return;
    if(u.fx.length){let ch=false;u.fx=u.fx.filter(f=>{f.t-=dt*speed;if(f.t<=0){ch=true;return false;}return true;});if(ch)fxVis(u);}
    if(stunned(u))return;
    u.t+=dt*speed*fxm(u,'spd');if(u.t>=u.iv){u.t-=u.iv;act(u);}});
  if(!alive('m').length)winBattle();
  else if(!alive('h').length)loseBattle();
}
$('spd').onclick=()=>{speed=speed===1?2:speed===2?4:1;$('spd').textContent='x'+speed;};
$('fight')&&setInterval(()=>tick(0.1),100);

/* ---------- formation (before a stage) ---------- */
function heroAtSlot(s){return save.team.find(k=>save.form[k]===s);}
function openPrep(n){pendingStage=n;selSlot=null;openScreen('prep');}
function drawPrep(){
  fixForm();const n=pendingStage,g=$('prepGrid');g.innerHTML='';
  $('prepTitle').innerHTML='<small>Chapter '+(chapOf(n)+1)+' &middot; '+ECON.chapters[chapOf(n)].n+'</small><b>Stage '+stageLabel(n)+(stageIn(n)===10?' &middot; Boss':'')+'</b>';
  [['Back row',1],['Front row',0]].forEach(([lab,row])=>{
    const c=el('div','pcol');c.appendChild(el('div','pl',lab));
    for(let lane=0;lane<3;lane++){
      const s=row*3+lane,k=heroAtSlot(s),b=el('button','pcell'+(selSlot===s?' sel':''));
      if(k){const sp=el('div');spriteArt(sp,k,.62,true);b.appendChild(sp);b.appendChild(el('div','pn',HEROES[k].n));}
      else b.innerHTML='<div class="pe">empty</div>';
      b.onclick=()=>prepTap(s);c.appendChild(b);
    }
    g.appendChild(c);
  });
  drawRoster();
  const cnt={};stageList(n).forEach(k=>cnt[k]=(cnt[k]||0)+1);
  $('prepEnemies').innerHTML=Object.keys(cnt).map(k=>'<div class="erow"><span style="color:'+RC[KINDS[k].r]+'">'+cnt[k]+'&times; '+KINDS[k].n+'</span><small>'+RN[KINDS[k].r]+'</small></div>').join('');
  const first=n>save.cleared;
  let rw={gold:stageGold(n)};if(first){rw.gems=stageIn(n)===10?ECON.bossFirstClearGems:ECON.firstClearGems;rw.tix=stageIn(n)===10?ECON.bossFirstClearTix:ECON.firstClearTix;rw.xp=ECON.firstClearXp(n);}
  $('prepRewards').innerHTML=chips(rw)+'<span class="chip">'+ic('item_sword_0')+'<b>'+(stageIn(n)===10?'2 drops':'1 drop')+'</b></span>';
  $('prepRwLabel').textContent=first?'Rewards (first clear bonus included)':'Rewards';
  $('prepHint').textContent=selSlot===null?'Tap a hero, then tap a spot to move or swap.':'Now tap the spot to move to (tap the same hero to cancel).';
}
function prepTap(s){
  const k=heroAtSlot(s);
  if(selSlot===null){if(k)selSlot=s;}
  else if(selSlot===s)selSlot=null;
  else{const a=heroAtSlot(selSlot);if(a)save.form[a]=s;if(k)save.form[k]=selSlot;selSlot=null;persist();}
  drawPrep();
}
function drawRoster(){
  const box=$('prepRoster');if(!box)return;box.innerHTML='';
  $('prepTeamN').textContent=save.team.length+' / '+MAXTEAM;
  [['Tank','Tanks'],['Ranged DPS','Ranged'],['Melee DPS','Melee'],['Support','Support']].forEach(([sub,lab])=>{
    const row=el('div','rrow');row.appendChild(el('div','rlab',lab));const cs=el('div','rchips');
    HIDS.filter(k=>HEROES[k].sub===sub&&(!HEROES[k].nopool||isOwned(k))).forEach(k=>{
      const on=save.team.includes(k),own=isOwned(k),b=el('button','rchip'+(on?' on':'')+(own?'':' locked'));
      const sp=el('div','rsp');spriteArt(sp,k,.42,true);b.appendChild(sp);b.appendChild(el('div','rn',HEROES[k].n));
      b.onclick=()=>toggleTeam(k);cs.appendChild(b);
    });
    row.appendChild(cs);box.appendChild(row);
  });
}
function toggleTeam(k){
  if(!isOwned(k)){toast('Not recruited yet. Try the Recruit screen!');return;}
  const t=save.team.slice(),i=t.indexOf(k);
  if(i>=0){if(t.length<=1){toast('You need at least one hero');return;}t.splice(i,1);}
  else{if(t.length>=MAXTEAM){toast('Team is full ('+MAXTEAM+'). Remove a hero first.');return;}t.push(k);}
  save.team=t;selSlot=null;fixForm();persist();drawPrep();if(window.rebuildBgH)rebuildBgH();
}
$('prepGo').onclick=()=>startStage(pendingStage);
$('prepBack').onclick=()=>openScreen('campaign');

function stageBanner(){
  const c=ECON.chapters[chapOf(stage)],boss=stageIn(stage)===10;
  const b=document.createElement('div');b.className='sbn'+(boss?' boss':'');
  b.innerHTML='<small>'+(c&&c.n||'')+'</small><b>'+(boss?'BOSS \u00b7 ':'')+'Stage '+(chapOf(stage)+1)+'-'+stageIn(stage)+'</b>';
  $('field').appendChild(b);setTimeout(()=>b.remove(),1900);
}
