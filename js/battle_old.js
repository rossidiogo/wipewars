let stage=1,units=[],over=false,speed=1,pendingStage=1,selSlot=null,FS=1;
const VT={tank:6,dps:14,sup:8,tp:12,clorox:46};
const LANE_Y=[70,82,94],DS=[.92,.96,1];
const ULT={tank:{n:'Iron Wall',mana:40},dps:{n:'Power Strike',mana:80},sup:{n:'Team Heal',mana:60}};
const KINDS={tp:{n:'Toilet Paper',r:0,hp:60,atk:8,iv:1.1,key:'tp',m:1.1,pr:0},clorox:{n:'Clorox Wipes',r:2,hp:130,atk:14,iv:1.3,key:'clorox',m:.9,pr:1},boss:{n:'Chapter Boss',r:3,hp:420,atk:20,iv:1.5,key:'clorox',m:1.25,pr:1}};
const RC=['#c8c8c8','#8888ff','#ffff77','#af6025'],RN=['Normal','Magic','Rare','Legendary'];

/* row/lane geometry: slot 0-2 = front row, 3-5 = back row; lane 0 is the far (upper) lane */
function slotPos(side,slot){const row=slot<3?0:1,lane=slot%3;const x=side==='h'?[38,20][row]+(1-lane)*2.5:[62,80][row]-(1-lane)*2.5;return {x,y:LANE_Y[lane],row,lane};}
function fixForm(){const f=save.form||{},used=new Set();['tank','dps','sup'].forEach(k=>{let s=f[k];if(!(s>=0&&s<6)||used.has(s))s=[1,3,5,0,2,4].find(x=>!used.has(x));used.add(s);f[k]=s;});save.form=f;}
fixForm();

function mk(side,name,role,hp,atk,iv,cls){return {side,name,role,hp,max:hp,atk,iv,t:Math.random()*iv*0.5,cls,el:null};}
function stageList(n){
  const cnt=Math.min(5,3+Math.floor((n-1)/4)),nC=Math.min(cnt-1,Math.floor(n/3)),l=[];
  for(let i=0;i<cnt;i++)l.push(i<cnt-nC?'tp':'clorox');
  if(n%5===0)l[l.length-1]='boss';
  return l;
}
function placeMonsters(list){
  const order=[1,0,2],used=new Set();
  return list.map(kd=>{const pr=KINDS[kd].pr;let s=null;for(const r of [pr,1-pr]){for(const l of order){const sl=r*3+l;if(!used.has(sl)){s=sl;break;}}if(s!==null)break;}used.add(s);return s;});
}
function startStage(n){stage=n;openScreen('fight');setup();}
$('back').onclick=()=>{over=true;openScreen('home');};

function setup(){
  const s=stage-1;fixForm();FS=Math.max(.55,Math.min(1,($('field').clientWidth||360)/500));
  units=[['Tank','tank',220,12,1.2],['DPS','dps',100,30,1.0],['Support','sup',120,14,1.4]].map(([n,r,hp,a,iv])=>{const st=heroStats(r,hp,a);const u=mk('h',n,r,st.hp,st.atk,iv,r);u.kind=r;u.m=1.05;u.slot=save.form[r];u.mmax=ULT[r].mana;u.mana=0;u.shield=0;return u;});
  const list=stageList(stage),slots=placeMonsters(list);
  list.forEach((kd,i)=>{const k=KINDS[kd];const u=mk('m',k.n,'mon',Math.round(k.hp*(1+.25*s)),Math.round(k.atk*(1+.2*s)),k.iv,k.key);u.kind=kd;u.m=k.m;u.rar=k.r;u.slot=slots[i];units.push(u);});
  $('heroes').innerHTML='';$('monsters').innerHTML='';$('log').innerHTML='';
  units.forEach(u=>{
    const p=slotPos(u.side,u.slot);u.row=p.row;u.lane=p.lane;
    const d=document.createElement('div');d.className='unit';
    d.style.left=p.x+'%';d.style.top=p.y+'%';d.style.zIndex=Math.round(p.y*10)+(u.side==='m'?1:0);
    d.innerHTML='<div class="hud"><div class="bar"><b></b><i></i></div>'+(u.side==='h'?'<div class="mana" style="width:'+Math.round(u.mmax*.6)+'px"><b></b></div>':'')+'</div><div class="spr"></div>';
    const key=u.side==='h'?u.kind:KINDS[u.kind].key,sc=u.m*DS[p.lane]*FS;
    u.el=d;spriteArt(d.querySelector('.spr'),key,sc);
    d.querySelector('.hud').style.top=Math.round(4-SP[key].top*sc+VT[key]*sc-16)+'px';
    if(u.side==='m')d.querySelector('.bar').style.borderColor=RC[u.rar];
    if(u.kind==='boss')d.querySelector('canvas').style.filter='hue-rotate(-25deg) saturate(1.6) drop-shadow(0 0 6px #af6025)';
    $(u.side==='h'?'heroes':'monsters').appendChild(d);refresh(u);
  });
  over=false;$('msg').textContent='';$('btn').style.display='none';$('stage').textContent=stage;
  $('autoU').textContent='Auto ultimates: '+(save.autoUlt?'On':'Off');
  buildUlts();
}
function refresh(u){
  u.el.querySelector('.bar b').style.width=Math.max(0,u.hp/u.max*100)+'%';
  u.el.querySelector('.bar i').style.width=Math.min(100,(u.shield||0)/u.max*100)+'%';
  u.el.classList.toggle('shielded',(u.shield||0)>0&&u.hp>0);
  u.el.classList.toggle('dead',u.hp<=0);
  updMana(u);
}
function updMana(u){
  if(u.side!=='h')return;
  const m=u.el.querySelector('.mana');m.querySelector('b').style.width=(u.mana/u.mmax*100)+'%';
  m.classList.toggle('full',u.mana>=u.mmax&&u.hp>0);m.style.visibility=u.hp>0?'visible':'hidden';
  updUlts();
}
function pop(u,txt,cls){if(!cls){u.el.classList.add('hit');setTimeout(()=>u.el.classList.remove('hit'),130);}const f=document.createElement('span');f.className='fl '+(cls||'');f.textContent=txt;u.el.appendChild(f);setTimeout(()=>f.remove(),800);}
function log(t){const d=document.createElement('div');d.textContent=t;const l=$('log');l.appendChild(d);while(l.children.length>6)l.removeChild(l.firstChild);}
const alive=side=>units.filter(u=>u.side===side&&u.hp>0);

/* targeting: monsters always go for the tank first, then the closest (front) row; heroes go front to back.
   Inside a row the target is random. */
function pickTarget(u){
  const foes=alive(u.side==='h'?'m':'h');if(!foes.length)return null;
  if(u.side==='m'){const tank=foes.find(f=>f.role==='tank');if(tank)return tank;}
  const front=foes.filter(f=>f.row===0),pool=front.length?front:foes;
  return pool[rnd(pool.length)];
}
function dealDamage(t,dmg,src,tag){
  if(t.hp<=0||over)return;
  let d=dmg;
  if(t.shield>0){const ab=Math.min(t.shield,d);t.shield-=ab;d-=ab;}
  t.hp-=d;pop(t,'-'+dmg);
  if(t.side==='h')gainMana(t,Math.min(12,3+Math.round(dmg/t.max*30)));
  refresh(t);log(src.name+' '+(tag||'hits')+' '+t.name+' for '+dmg);
}

/* mana + ultimates (TFT style: bar sizes differ, cast spends everything, no gain while full) */
function gainMana(u,n){
  if(u.side!=='h'||u.hp<=0||u.mana>=u.mmax)return;
  u.mana=Math.min(u.mmax,u.mana+n);updMana(u);
  if(u.mana>=u.mmax&&save.autoUlt)castUlt(u);
}
function banner(u,text){const s=document.createElement('span');s.className='ban';s.textContent=text;u.el.appendChild(s);setTimeout(()=>s.remove(),1100);}
function flash(col){const f=document.createElement('div');f.className='ffx';f.style.background=col;$('field').appendChild(f);setTimeout(()=>f.remove(),450);}
function slash(t){const s=document.createElement('span');s.className='slash';t.el.appendChild(s);setTimeout(()=>s.remove(),380);}
function castUlt(u){
  if(over||u.hp<=0||u.mana<u.mmax)return;
  u.mana=0;updMana(u);banner(u,ULT[u.kind].n);atkEl(u.el);
  if(u.kind==='tank'){u.shield=(u.shield||0)+Math.round(u.max*.4);refresh(u);flash('#6ad0ff');log('Tank: Iron Wall');}
  else if(u.kind==='dps'){const t=pickTarget(u);if(t){const d=Math.round(u.atk*5*(.9+Math.random()*.2));flash('#ff6a4a');setTimeout(()=>{slash(t);dealDamage(t,d,u,'power strikes');},260);}}
  else{const h=Math.round(20+u.atk*2.5);alive('h').forEach(a=>{a.hp=Math.min(a.max,a.hp+h);pop(a,'+'+h,'heal');refresh(a);});flash('#6ad07a');log('Support: Team Heal (+'+h+')');}
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
  save.autoUlt=!save.autoUlt;persist();$('autoU').textContent='Auto ultimates: '+(save.autoUlt?'On':'Off');
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
function hostXY(host,el,fx,fy){const r=el.getBoundingClientRect(),F=host.getBoundingClientRect();return [r.left-F.left+r.width*fx,r.top-F.top+r.height*fy];}
function ember(host,x,y){const e=document.createElement('span');e.className='em';e.style.left=(x+(Math.random()-.5)*14)+'px';e.style.top=(y+(Math.random()-.5)*10)+'px';e.style.background=['#ffd84a','#ff8f1e','#e23a12'][rnd(3)];host.appendChild(e);setTimeout(()=>e.remove(),520);}
function burst(host,x,y){for(let i=0;i<12;i++){const e=document.createElement('span');e.className='sp';e.style.left=x+'px';e.style.top=y+'px';const a=Math.random()*6.28,v=14+Math.random()*26;e.style.setProperty('--vx',Math.cos(a)*v+'px');e.style.setProperty('--vy',Math.sin(a)*v-8+'px');e.style.background=['#fff6c0','#ffd84a','#ff8f1e','#e23a12'][rnd(4)];host.appendChild(e);setTimeout(()=>e.remove(),480);}}
function launchWipes(host,srcCv,tgtCv,srcFy,onHit,sc){
  sc=sc||1;
  if(!host||!srcCv||!tgtCv||!srcCv.isConnected||!tgtCv.isConnected)return;
  const [sx,sy]=hostXY(host,srcCv,.5,srcFy),[tx,ty]=hostXY(host,tgtCv,.5,.55);
  const dur=Math.max(300,640/speed);let hit=false;
  for(let i=0;i<3;i++)setTimeout(()=>{
    if(!srcCv.isConnected)return;
    const w=document.createElement('canvas');w.width=30;w.height=16;w.className='wip';w.style.width=Math.round(66*sc)+'px';w.style.height=Math.round(35*sc)+'px';
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

function act(u){
  const foes=alive(u.side==='h'?'m':'h'),allies=alive(u.side);
  if(!foes.length)return;
  if(u.role==='sup'){
    const hurt=allies.slice().sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
    if(hurt&&hurt.hp/hurt.max<0.9){atkEl(u.el);const h=Math.round(10+u.atk*0.8);hurt.hp=Math.min(hurt.max,hurt.hp+h);pop(hurt,'+'+h,'heal');refresh(hurt);log(u.name+' heals '+hurt.name);gainMana(u,10);return;}
  }
  const t=pickTarget(u);if(!t)return;
  atkEl(u.el);
  const dmg=Math.max(1,Math.round(u.atk*(0.9+Math.random()*0.2)));
  if(u.side==='m'&&(u.kind==='clorox'||u.kind==='boss'))setTimeout(()=>launchWipes($('field'),u.el.querySelector('canvas'),t.el.querySelector('canvas'),u.kind==='boss'?.34:.38,()=>dealDamage(t,dmg,u,'burns'),FS),200);
  else setTimeout(()=>dealDamage(t,dmg,u),u.side==='h'?120:220);
  gainMana(u,10);
}
function showBtn(label,fn){const b=$('btn');b.textContent=label;b.onclick=fn;b.style.display='inline-block';}
function tick(dt){
  if(over||!$('fight').classList.contains('on'))return;
  units.forEach(u=>{if(u.hp<=0||over)return;u.t+=dt*speed;if(u.t>=u.iv){u.t-=u.iv;act(u);}});
  if(!alive('m').length){
    over=true;updUlts();const g=units.filter(u=>u.side==='m').reduce((a,u)=>a+({0:10,2:25,3:60})[u.rar],0)*stage;save.gold+=g;
    let txt='Stage '+stage+' cleared! +'+g+' gold';
    prog('win');
    if(stage>save.cleared){save.cleared=stage;addXp(40);txt+=' (stage '+(stage+1)+' unlocked)';}
    const it=dropItem();txt+=' | Drop: '+itemName(it);if(stage%5===0){txt+=' + '+itemName(dropItem());}
    persist();$('msg').textContent=txt;
    showBtn('Next stage',()=>{stage++;setup();});
    if(save.auto){const cur=stage;setTimeout(()=>{if(over&&stage===cur&&$('fight').classList.contains('on')){stage++;setup();}},1800);}
  }else if(!alive('h').length){
    over=true;updUlts();$('msg').textContent='Your team was wiped out.';showBtn('Retry stage',setup);
  }
}
$('spd').onclick=()=>{speed=speed===1?2:speed===2?4:1;$('spd').textContent='x'+speed;};

/* ---------- formation (before a stage) ---------- */
function heroAtSlot(s){return ['tank','dps','sup'].find(k=>save.form[k]===s);}
function openPrep(n){pendingStage=n;selSlot=null;$('modal').classList.remove('on');$('prepStage').textContent=n;openScreen('prepS');}
function drawPrep(){
  fixForm();const g=$('prepGrid');g.innerHTML='';
  [['Back row',1],['Front row',0]].forEach(([lab,row])=>{
    const c=document.createElement('div');c.className='pcol';c.innerHTML='<div class="pl">'+lab+'</div>';
    for(let lane=0;lane<3;lane++){
      const s=row*3+lane,k=heroAtSlot(s),b=document.createElement('button');b.className='pcell'+(selSlot===s?' sel':'');
      if(k){const sp=document.createElement('div');spriteArt(sp,k,.62);b.appendChild(sp);const nm=document.createElement('div');nm.className='pn';nm.textContent=BASE[k][0];b.appendChild(nm);}
      else b.innerHTML='<div class="pe">empty</div>';
      b.onclick=()=>prepTap(s);c.appendChild(b);
    }
    g.appendChild(c);
  });
  const cnt={};stageList(pendingStage).forEach(k=>cnt[k]=(cnt[k]||0)+1);
  $('prepEnemies').innerHTML='Enemies: '+Object.keys(cnt).map(k=>'<span style="color:'+RC[KINDS[k].r]+'">'+cnt[k]+'x '+KINDS[k].n+' ('+RN[KINDS[k].r]+')</span>').join(', ');
  $('prepHint').textContent=selSlot===null?'Tap a hero, then tap a spot to move or swap.':'Now tap the spot to move to (tap the same hero to cancel).';
}
function prepTap(s){
  const k=heroAtSlot(s);
  if(selSlot===null){if(k)selSlot=s;}
  else if(selSlot===s)selSlot=null;
  else{const a=heroAtSlot(selSlot);if(a)save.form[a]=s;if(k)save.form[k]=selSlot;selSlot=null;persist();}
  drawPrep();
}
$('prepGo').onclick=()=>startStage(pendingStage);