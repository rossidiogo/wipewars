/* ================= battle: draws the fight that engine.js runs. No rules live here: this file only turns the
   engine's events into sprites, numbers and effects, and shows the result. ================= */
let stage=1,BT=null,units=[],over=true,speed=1,FS=1;
/* battle seconds -> real milliseconds at the current speed */
const ms=s=>s*1000/speed;

function startStage(n){
  window.LAB=null;stage=n;$('result').classList.remove('on');
  const c=chapOf(n);
  if(!window.NOCUT&&typeof playCut==='function'&&!SEEN_CH[c]){SEEN_CH[c]=1;playCut(c,()=>{openScreen('fight');setup();});return;}
  openScreen('fight');setup();
}
$('back').onclick=()=>{window.LAB=null;over=true;$('result').classList.remove('on');openScreen('campaign');};

// units are drawn at the size the field had when the battle began; a resize rescales them (style.css .field .unit)
window.addEventListener('resize',()=>{const w=$('field').clientWidth;if(w)$('field').style.setProperty('--fz',w/(FS*320));});
function setup(){
  stageBanner();
  const LB=window.LAB;fixForm();$('result').classList.remove('on');
  FS=($('field').clientWidth||360)/320;$('field').style.setProperty('--fz',1);
  $('fbg').style.filter='none';$('fbg').style.backgroundImage='url('+BGCH[LB?LB.chap:chapOf(stage)]+')';
  const team=LB?LB.team:save.team,form=LB?labForm(LB.team):save.form;
  const mons=LB?monSpecs(LB.mons.slice(),LB.stg):monSpecs(stageList(stage),stage);
  BT=createBattle(heroSpecs(team,form),mons,{auto:!!save.autoUlt,lab:!!LB,god:!!(LB&&LB.god),immortal:!!(LB&&LB.immortal),
    freeMana:!!((LB&&LB.mana)||(save.digas&&save.dgMana)),inv:!!(save.digas&&save.dgInv),oneHit:!!(save.digas&&save.dgKill)});
  units=BT.units;
  $('fHeroes').innerHTML='';$('fMons').innerHTML='';
  units.forEach(u=>{
    const p=slotPos(u.side,u.slot);u.sc=u.side==='h'?(HEROES[u.kind].sc||1):KINDS[u.kind].m;
    const d=document.createElement('div');d.className='unit s'+u.side+' spawn'+(u.boss?' isboss':'');d.style.animationDelay=(Math.random()*.35)+'s';d.style.setProperty('--rk',(u.side==='h'?-1:1)*2.5*FS+'px');setTimeout(()=>d.classList.remove('spawn'),1100);
    d.style.left=p.x+'%';d.style.top=p.y+'%';d.style.zIndex=Math.round(p.y*10)+(u.side==='m'?1:0);
    d.innerHTML='<div class="hud"><div class="bar"><b></b><i></i></div>'+(u.side==='h'?'<div class="mana" style="width:'+Math.round(u.mmax*.6)+'px"><b></b></div>':'')+'</div><div class="spr"></div>';
    const key=u.side==='h'?u.kind:KINDS[u.kind].key,sc=u.sc*FS;
    u.el=d;spriteArt(d.querySelector('.spr'),key,sc);
    if(u.side==='m'&&KINDS[u.kind].f){const cv=d.querySelector('canvas');if(cv)cv.style.filter=KINDS[u.kind].f;}
    u.hy=-(SP[key].ay-SP[key].top)*sc*SP[key].s;d.querySelector('.hud').style.top=Math.round(u.hy-(u.side==='h'?20:16))+'px';
    if(u.side==='m')d.querySelector('.bar').style.borderColor=RC[u.rar];
    $(u.side==='h'?'fHeroes':'fMons').appendChild(d);refresh(u);
  });
  (function(){const f=$('field');f.querySelectorAll('.mote,.penta,.telew,.enr').forEach(e=>e.remove());for(let i=0;i<16;i++){const m=document.createElement('i');m.className='mote';m.style.left=(Math.random()*100)+'%';m.style.top=(10+Math.random()*80)+'%';m.style.animationDuration=(6+Math.random()*8)+'s';m.style.animationDelay=(-Math.random()*8)+'s';f.appendChild(m);}})();
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
/* status effects the engine put on a unit, shown as classes, size and form swaps */
function fxVis(u){
  if(!u.el)return;const has=k=>u.fx.some(f=>f.k===k);
  u.el.classList.toggle('fx-buff',u.fx.some(f=>f.k==='atk'&&f.m>1&&f.tag!=='enrage'));
  u.el.classList.toggle('fx-curse',u.fx.some(f=>(f.k==='atk'&&f.m<1)||(f.k==='in'&&f.m>1)));
  u.el.classList.toggle('fx-stun',has('stun'));
  u.el.classList.toggle('fx-enrage',u.fx.some(f=>f.tag==='enrage'));
  const g=u.fx.filter(f=>f.k==='grow').reduce((a,f)=>Math.max(a,f.m),1),sp=u.el.querySelector('.msp,.spr'),hud=u.el.querySelector('.hud');
  sp.style.scale=g>1?g:'';if(hud&&u.hy!==undefined)hud.style.top=Math.round(u.hy*g-(u.side==='h'?20:16))+'px';
  // orc / tiger form: swap to the '<key>_orc' / '<key>_tiger' sprite when it exists, otherwise tint the normal sprite as a stand-in
  if(u.side==='h'){const orc=has('orc'),tig=has('tiger'),want=(orc&&SP[u.kind+'_orc'])?u.kind+'_orc':(tig&&SP[u.kind+'_tiger'])?u.kind+'_tiger':u.kind;
    if(SP[want]&&sp.dataset.cur!==want&&(want!==u.kind||sp.dataset.cur)){sp.dataset.cur=want;spriteArt(sp,want,u.sc*FS,false);}
    u.el.classList.toggle('fx-orc',orc&&!SP[u.kind+'_orc']);
    const cv=sp.querySelector('canvas');if(cv)cv.style.filter=(tig&&!SP[u.kind+'_tiger'])?'sepia(1) saturate(5) hue-rotate(-28deg) brightness(1.1)':'';}
}
function sparks(u,cols){const y=(u.hy||-40)*.45,n=7;for(let i=0;i<n;i++){const e=document.createElement('span');e.className='sp px';e.style.left='0px';e.style.top=y+'px';const a=-1.6+(Math.random()-.5)*3.2+(u.side==='h'?-.6:.6),v=(12+Math.random()*22)*FS;e.style.setProperty('--vx',Math.cos(a)*v*(u.side==='h'?-1:1)*-1+'px');e.style.setProperty('--vy',Math.sin(a)*v+'px');e.style.background=(cols||['#fff6c0','#ffd84a','#ff8f1e'])[i%3];u.el.appendChild(e);setTimeout(()=>e.remove(),500);}}
function shake(a){const f=$('field');if(!f)return;f.style.setProperty('--sa',(a||3)*FS+'px');f.classList.remove('shk');void f.offsetWidth;f.classList.add('shk');}
function poof(u){for(let i=0;i<6;i++){const e=document.createElement('span');e.className='dust';e.style.left=((Math.random()-.5)*26*FS)+'px';e.style.top=(-4*FS)+'px';e.style.setProperty('--dx',((Math.random()-.5)*20*FS)+'px');u.el.appendChild(e);setTimeout(()=>e.remove(),700);}}
function pop(u,txt,cls){if(!cls||cls==='crit'){u.el.classList.add('hit');setTimeout(()=>u.el.classList.remove('hit'),130);sparks(u);}const f=document.createElement('span');f.className='fl '+(cls||'')+(u.side==='h'&&cls!=='heal'?' hurt':'');f.textContent=txt;f.style.top=Math.round((u.hy||-40)+10)+'px';u.el.appendChild(f);setTimeout(()=>f.remove(),800);}
const alive=side=>units.filter(u=>u.side===side&&u.hp>0);
function banner(u,text){const s=document.createElement('span');s.className='ban';s.textContent=text;s.style.top=Math.round((u.hy||-40)-8)+'px';u.el.appendChild(s);setTimeout(()=>s.remove(),1100);}
function flash(col){const f=document.createElement('div');f.className='ffx';f.style.background=col;$('field').appendChild(f);setTimeout(()=>f.remove(),450);}
function slash(t){const s=document.createElement('span');s.className='slash';s.style.top=Math.round((t.hy||-40)*.5-20)+'px';t.el.appendChild(s);setTimeout(()=>s.remove(),380);}
/* where a unit stands inside the field, in px */
function fieldXY(u,dy){const fr=$('field').getBoundingClientRect(),r=u.el.getBoundingClientRect();return [r.left-fr.left,r.top-fr.top+(dy||0)];}
/* Chavoso (Deadeye): arrows fly from him to the target */
function arrowFly(u,t,dur){
  const fld=$('field'),[sx,sy]=fieldXY(u,-28),[tx,ty0]=fieldXY(t,-28),ty=ty0+(Math.random()-.5)*16;
  const a=document.createElement('span');a.className='arrowfx';a.style.transformOrigin='0 50%';fld.appendChild(a);
  const ang=Math.atan2(ty-sy,tx-sx)*180/Math.PI;
  a.animate([{transform:'translate('+sx+'px,'+sy+'px) rotate('+ang+'deg)'},{transform:'translate('+tx+'px,'+ty+'px) rotate('+ang+'deg)'}],{duration:dur,easing:'linear'});
  setTimeout(()=>a.remove(),dur);
}
function cloud(host,cols,n,delay){
  setTimeout(()=>{if(over)return;alive('h').forEach(a=>{const r=a.el.getBoundingClientRect(),hr=host.getBoundingClientRect();
    for(let i=0;i<n;i++){const e=document.createElement('span');e.className='sp';e.style.left=(r.left-hr.left+r.width/2)+'px';e.style.top=(r.top-hr.top+r.height*.4)+'px';const an=Math.random()*6.28,v=12+Math.random()*22;e.style.setProperty('--vx',Math.cos(an)*v+'px');e.style.setProperty('--vy',Math.sin(an)*v-10+'px');e.style.background=cols[rnd(cols.length)];host.appendChild(e);setTimeout(()=>e.remove(),480);}});},delay);
}
/* what each ultimate looks like. e is the engine's 'ult' event: {u caster, t target, d seconds until it lands, ms hexed monsters} */
const ULTFX={
  tank:e=>flash('#6ad0ff'),
  rafinha:e=>{const u=e.u;monsterCan(u);   // the can is shown first, the transformation lands when he finishes drinking
    setTimeout(()=>{if(over||u.hp<=0)return;flash('#6aff3a');shockwave(u);},ms(e.d));},
  lucao:e=>{const u=e.u,sp=u.el.querySelector('.msp,.spr'),fish=document.createElement('span');
    if(sp)sp.classList.add('spintop');fish.className='bigfish';fish.textContent='\u{1F41F}';u.el.appendChild(fish);
    setTimeout(()=>{if(sp)sp.classList.remove('spintop');fish.remove();},ms(1.3));flash('#6ad0ff');},
  dps:e=>{const u=e.u,t=e.t;flash('#ff6a4a');
    // the cockatiel takes off from his shoulder, circles over his head, charges the enemy and flies back
    const fld=$('field'),[sx,sy]=fieldXY(u,-45),[tx,ty]=fieldXY(t,-35),bird=document.createElement('span'),dur=ms(1.15);
    bird.className='ckbird';bird.textContent='\u{1F426}';fld.appendChild(bird);
    bird.animate([{transform:'translate('+sx+'px,'+sy+'px) scale(1)'},{transform:'translate('+sx+'px,'+(sy-48)+'px) scale(1.25)',offset:.22},{transform:'translate('+tx+'px,'+ty+'px) scale(1.35)',offset:.58},{transform:'translate('+sx+'px,'+(sy-32)+'px) scale(1.1)',offset:.88},{transform:'translate('+sx+'px,'+sy+'px) scale(1)'}],{duration:dur,easing:'ease-in-out'});
    setTimeout(()=>bird.remove(),dur);},
  chavoso:e=>flash('#9ae070'),
  copello:e=>flash('#f0a020'),
  glem:e=>{const u=e.u;flash('#ffa030');
    // transformation burst: gold coins fly out of him, then a shockwave lands as the tiger appears
    const host=$('field'),r=u.el.getBoundingClientRect(),hr=host.getBoundingClientRect();
    for(let i=0;i<14;i++){const c=document.createElement('span');c.className='sp';c.style.left=(r.left-hr.left+r.width/2)+'px';c.style.top=(r.top-hr.top+r.height*.4)+'px';const an=Math.random()*6.28,v=18+Math.random()*30;c.style.setProperty('--vx',Math.cos(an)*v+'px');c.style.setProperty('--vy',Math.sin(an)*v-12+'px');c.style.background=['#ffd84a','#fff0a0','#e8a020'][rnd(3)];c.style.width=c.style.height='6px';host.appendChild(c);setTimeout(()=>c.remove(),480);}
    shockwave(u);},
  malaguti:e=>{flash('#ff6a4a');setTimeout(()=>{if(!over)banner(e.t,'K.O.!');},ms(e.d));},
  samuel:e=>{
    // glitch-teleport behind the target, backstab, then glitch back
    const u=e.u,t=e.t,el=u.el,L=el.style.left,T=el.style.top,Z=el.style.zIndex;flash('#6aff8a');el.classList.add('glitch');
    setTimeout(()=>{if(over||u.hp<=0)return;el.style.left=(parseFloat(t.el.style.left)+7)+'%';el.style.top=t.el.style.top;el.style.zIndex=(parseInt(t.el.style.zIndex)||0)+2;},ms(.3));
    setTimeout(()=>{el.style.left=L;el.style.top=T;el.style.zIndex=Z;setTimeout(()=>el.classList.remove('glitch'),250);},ms(1.25));
  },
  rubens:e=>{
    // joint goes to his mouth, long drag, then he exhales a smoke cloud that rolls over the WHOLE team as the heal lands
    const u=e.u,host=$('field'),j=document.createElement('span');
    j.className='joint';j.textContent='\u{1F6AC}';u.el.appendChild(j);flash('#8aa870');
    setTimeout(()=>j.classList.add('drag'),ms(.45));
    setTimeout(()=>j.remove(),ms(1.3));
    setTimeout(()=>{if(over||u.hp<=0)return;const hr=host.getBoundingClientRect();
      alive('h').forEach((a,i)=>{const r=a.el.getBoundingClientRect();
        for(let k=0;k<5;k++){const s=document.createElement('span');s.className='smoke';
          s.style.left=(r.left-hr.left+r.width/2+(Math.random()-.5)*r.width*.8)+'px';s.style.top=(r.top-hr.top+r.height*(.2+Math.random()*.6))+'px';
          s.style.animationDelay=(i*90+k*60)+'ms';host.appendChild(s);setTimeout(()=>s.remove(),1700+i*90+k*60);}});
      cloud(host,['#e8e8e0','#b8c8a8','#9ae070'],7,150);
    },ms(e.d-.4));
  },
  ze:e=>{flash('#ffd84a');notesUp(e.u);},
  donnie:e=>{const ms_=e.ms.filter(m=>m.el);
    // one big pentagram under the whole enemy group (not one per monster)
    if(ms_.length){const f=$('field'),xs=ms_.map(m=>parseFloat(m.el.style.left)*f.clientWidth/100),ys=ms_.map(m=>parseFloat(m.el.style.top)*f.clientHeight/100),
      x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),W=Math.max(f.clientWidth*.5,(x1-x0)+f.clientWidth*.3),
      p=document.createElement('span');f.querySelectorAll('.penta').forEach(x=>x.remove());p.className='penta';
      p.style.cssText='width:'+W+'px;height:'+W+'px;left:'+((x0+x1)/2-W/2)+'px;top:'+((y0+y1)/2-W/2-4*FS)+'px';
      f.appendChild(p);setTimeout(()=>p.remove(),ms(e.d));}
    flash('#b050ff');}
};
/* the engine's events, one handler each */
const EV={
  atk:e=>{const u=e.u,t=e.t;if(!e.shot)atkEl(u.el);if(!t)return;
    if(u.side==='m'&&u.kind==='clorox')setTimeout(()=>launchWipes($('field'),u.el.querySelector('canvas'),t.el.querySelector('canvas'),.17,null,FS,ms(e.d-.2)),ms(.2));
    else if(u.kind==='chavoso')arrowFly(u,t,ms(e.d));
    else if(u.kind==='ze')throwSticks(u,t,ms(e.d));
    else if(e.smash)setTimeout(()=>{if(over)return;shockwave(t);shake(2);},ms(e.d));},
  dmg:e=>{pop(e.t,'-'+e.n,e.crit?'crit':'');if(e.crit)slash(e.t);sfx('hit');refresh(e.t);},
  heal:e=>{pop(e.t,'+'+e.n,'heal');refresh(e.t);},
  miss:e=>pop(e.t,'Dodge','heal'),
  mana:e=>updMana(e.u),
  shield:e=>refresh(e.u),
  fx:e=>fxVis(e.u),
  die:e=>{refresh(e.t);fxVis(e.t);},
  ult:e=>{const u=e.u;sfx('ult');banner(u,ULT[u.kind].n);shake(3);atkEl(u.el);prog('ult');save.stats.casts++;ULTFX[u.kind](e);},
  tele:e=>{const u=e.u;u.el.classList.add('tele');const w=document.createElement('div');w.className='telew';w.textContent='!';$('field').appendChild(w);
    setTimeout(()=>{u.el.classList.remove('tele');w.remove();},ms(e.d));},
  slam:e=>{shake(7);flash('#ff3a2a');shockwave(e.u);sfx('lose');},
  enrage:()=>{const b=document.createElement('div');b.className='sbn boss enr';b.innerHTML='<b>Enraged!</b>';$('field').appendChild(b);setTimeout(()=>b.remove(),1900);},
  end:e=>{over=true;updUlts();if(window.LAB)labRespawn();else if(e.win)winBattle();else loseBattle();}
};
/* casts a hero's ultimate (the buttons under the field, and the Lab) */
function castUlt(u){if(BT&&!over)BT.cast(u);}
function buildUlts(){
  const L=$('ults');L.innerHTML='';
  units.filter(u=>u.side==='h').forEach(u=>{
    const d=ULT[u.kind],b=document.createElement('button');b.className='ult';b.id='ult_'+u.kind;
    b.innerHTML='<span class="uface"></span><span class="un">'+d.n+'</span><span class="ur">'+u.name+'</span><div class="mt" style="width:'+d.mana+'%"><b></b></div><span class="mn"></span>';
    if(AVA[u.kind])b.querySelector('.uface').style.backgroundImage='url('+AVA[u.kind]+')';else b.querySelector('.uface').remove();
    b.onclick=()=>castUlt(u);L.appendChild(b);
  });
  updUlts();
}
function updUlts(){
  units.filter(u=>u.side==='h').forEach(u=>{
    const b=$('ult_'+u.kind);if(!b)return;
    const full=u.mana>=u.mmax&&u.hp>0&&!over;
    b.disabled=!full;b.classList.toggle('ready',full);b.classList.toggle('down',u.hp<=0);
    b.querySelector('.mt b').style.width=(u.mana/u.mmax*100)+'%';
    b.querySelector('.mn').textContent=u.hp<=0?'Defeated':Math.floor(u.mana)+' / '+u.mmax;
  });
}
$('autoU').onclick=()=>{
  save.autoUlt=!save.autoUlt;persist();$('autoU').classList.toggle('on',save.autoUlt);$('autoU').textContent='Auto ultimates: '+(save.autoUlt?'On':'Off');
  if(BT){BT.auto=save.autoUlt;if(save.autoUlt)units.filter(u=>u.side==='h').forEach(castUlt);}
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
function launchWipes(host,srcCv,tgtCv,srcFy,onHit,sc,dur){
  sc=sc||1;
  if(!host||!srcCv||!tgtCv||!srcCv.isConnected||!tgtCv.isConnected)return;
  const [sx,sy]=hostXY(host,srcCv,.42,srcFy),[tx,ty]=hostXY(host,tgtCv,.5,.55);
  dur=dur||Math.max(300,640/speed);let hit=false;
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

/* Rafinha: a clearly-labelled Monster energy drink rises to his mouth, he chugs it, then the orc form lands with a shockwave */
const MCAN="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 66'><rect x='7' y='5' width='26' height='57' rx='4' fill='%23121212' stroke='%23000' stroke-width='1.5'/><rect x='7' y='5' width='26' height='8' rx='3' fill='%23888'/><path d='M13 17 L16 43 L20 22 L24 43 L28 17 L25 17 L24 33 L20 17 L16 33 L15 17 Z' fill='%238ee02a' stroke='%234a8a10' stroke-width='.8'/><text x='20' y='55' font-size='6.4' font-weight='900' fill='%238ee02a' text-anchor='middle' font-family='Impact,Arial Black,sans-serif' letter-spacing='.2'>MONSTER</text></svg>\") center/contain no-repeat";
function monsterCan(u){
  const fld=$('field'),fr=fld.getBoundingClientRect(),r=u.el.getBoundingClientRect(),x0=r.left-fr.left,y0=r.top-fr.top;
  const c=document.createElement('span');c.className='mcan';c.style.background=MCAN;fld.appendChild(c);
  c.animate([{transform:'translate('+(x0+14)+'px,'+(y0-8)+'px) rotate(0deg) scale(.8)',opacity:0},{transform:'translate('+(x0+10)+'px,'+(y0-34)+'px) rotate(-20deg) scale(1.1)',opacity:1,offset:.25},{transform:'translate('+(x0+4)+'px,'+(y0-46)+'px) rotate(-62deg) scale(1.15)',offset:.45},{transform:'translate('+(x0+2)+'px,'+(y0-48)+'px) rotate(-70deg) scale(1.15)',offset:.8},{transform:'translate('+(x0+18)+'px,'+(y0-20)+'px) rotate(30deg) scale(.7)',opacity:0}],{duration:1000,easing:'ease-in-out'});
  setTimeout(()=>c.remove(),1100);
}
function shockwave(u){const s=document.createElement('span');s.className='shock';u.el.appendChild(s);setTimeout(()=>s.remove(),500);}
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
function throwSticks(u,t,dur){
  const fld=$('field'),[sx,sy]=fieldXY(u,-30),[tx,ty]=fieldXY(t,-30);
  [0,1].forEach(i=>setTimeout(()=>{
    const s=document.createElement('span');s.className='dstick';fld.appendChild(s);
    const my=Math.min(sy,ty)-34,d=Math.max(120,dur-110);
    s.animate([{transform:'translate('+sx+'px,'+sy+'px) rotate(0deg)'},{transform:'translate('+((sx+tx)/2)+'px,'+my+'px) rotate(360deg)',offset:.5},{transform:'translate('+tx+'px,'+ty+'px) rotate(720deg)'}],{duration:d,easing:'linear'});
    setTimeout(()=>s.remove(),d);
  },i*110));
}

/* ---------- result ---------- */
/* who did what: one row per hero with damage dealt and healing done, as bars against the best of the team */
function statRows(){
  const hs=units.filter(u=>u.side==='h'),top=Math.max(1,...hs.map(u=>Math.max(u.st.dmg,u.st.heal)));
  const box=el('div','bstats');
  hs.forEach(u=>{
    const r=el('div','bstat'+(u.hp<=0?' down':''));
    r.innerHTML='<span class="bsn">'+u.name+'</span><div class="bsb"><i class="d" style="width:'+(u.st.dmg/top*100)+'%"></i>'+(u.st.heal?'<i class="h" style="width:'+(u.st.heal/top*100)+'%"></i>':'')+'</div><span class="bsv">'+fmt(u.st.dmg)+(u.st.heal?' <em>+'+fmt(u.st.heal)+'</em>':'')+'</span>';
    box.appendChild(r);
  });
  return box;
}
function winBattle(){
  sfx('win');
  const w=stageWin(stage),out=w.out,first=w.first;
  const R=$('result');R.innerHTML='';
  const p=el('div','panel resp');
  p.appendChild(el('div','rtitle win','Victory'));
  p.appendChild(el('div','rsub','Stage '+stageLabel(stage)+(first?' &middot; First clear!':'')));
  p.appendChild(el('div','chips',chips(out)));
  const g=el('div','tgrid small');out.items.forEach(i=>g.insertAdjacentHTML('beforeend',tileHTML(i)));p.appendChild(g);
  p.appendChild(statRows());
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
/* the most useful thing the player can do after a loss, given what they have not spent yet */
function loseAdvice(){
  if(BT&&BT.t>=ENG.timeout)return 'Time ran out. Bring more damage: level your damage dealers or upgrade their weapons.';
  if(save.team.some(r=>skFree(r)>0))return 'You have unspent skill points. Open a hero’s skill tree and spend them.';
  if(save.team.some(r=>save.lv[r]<plv()&&save.gold>=lvCost(r)))return 'You can afford to level up a hero. Do that and try again.';
  return 'Your team was wiped out. Level up your heroes or equip better gear.';
}
function loseBattle(){
  sfx('lose');
  const R=$('result');R.innerHTML='';
  const p=el('div','panel resp');
  p.appendChild(el('div','rtitle lose','Defeat'));
  p.appendChild(el('div','rsub',loseAdvice()));
  p.appendChild(statRows());
  const row=el('div','rbtns');
  const b=el('button','btn primary','Retry');b.onclick=()=>setup();row.appendChild(b);
  const h=el('button','btn','Heroes');h.onclick=()=>{R.classList.remove('on');openScreen('heroes');};row.appendChild(h);
  const m=el('button','btn','Map');m.onclick=()=>{R.classList.remove('on');openScreen('campaign');};row.appendChild(m);
  p.appendChild(row);R.appendChild(p);setTimeout(()=>R.classList.add('on'),650);
}
/* the loop: advance the rules, then play back what happened */
function tick(dt){
  if(over||!BT||!$('fight').classList.contains('on'))return;
  BT.step(dt*speed);
  BT.ev.splice(0).forEach(e=>EV[e.e](e));
}
$('spd').onclick=()=>{speed=window.LAB?({1:.5,.5:.25,.25:2,2:1}[speed]||1):speed===1?2:speed===2?4:1;$('spd').textContent='x'+speed;};
$('fight')&&setInterval(()=>tick(0.1),100);

function stageBanner(){
  const c=ECON.chapters[chapOf(stage)],boss=stageIn(stage)===10;
  const b=document.createElement('div');b.className='sbn'+(boss?' boss':'');
  b.innerHTML='<small>'+(c&&c.n||'')+'</small><b>'+(boss?'BOSS \u00b7 ':'')+'Stage '+(chapOf(stage)+1)+'-'+stageIn(stage)+'</b>';
  $('field').appendChild(b);setTimeout(()=>b.remove(),1900);
}
