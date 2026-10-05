/* ================= UI: screens ================= */
const NAV=[['heroes','Heroes','ui_heroes'],['bag','Bag','ui_bag'],['home','Home','ui_battle'],['shop','Shop','ui_shop'],['tasks','Tasks','ui_tasks']];
const NAVSCREENS=new Set(['home','heroes','bag','shop','tasks']);
const TITLES={campaign:'Campaign',prep:'Formation',heroes:'Heroes',bag:'Bag',shop:'Shop',tasks:'Daily Tasks',cal:'Daily Login',mail:'Mail',guild:'Guild',friends:'Friends',settings:'Settings'};
const BACK={campaign:'home',prep:'campaign',cal:'home',mail:'home',guild:'home',friends:'home',settings:'home'};
const DRAW={};DRAW.prep=drawPrep;
document.querySelectorAll('[data-ic]').forEach(i=>i.src=ICO[i.dataset.ic]);$('cfgi').src=ICO.ui_settings;

/* currency pills (kept in sync everywhere) */
function pillsHTML(){
  return '<div class="pill" data-go="shop:gold">'+ic('gold')+'<b data-cur="gold"></b></div><div class="pill" data-go="shop:gems">'+ic('gem')+'<b data-cur="gems"></b><i class="plus">+</i></div>';
}
function syncCur(){
  document.querySelectorAll('[data-cur]').forEach(e=>{const k=e.dataset.cur;e.textContent=k==='gold'?fmt(save.gold):k==='gems'?fmt(save.gems):k==='tix'?fmt(save.tix):fmt(save.keys[k]);});
  const x=xpInfo();
  $('plvn').textContent=x.l;$('lvring').style.setProperty('--p',Math.round(x.x/x.need*100));
  $('xpt').textContent=x.x+' / '+x.need+' XP';$('xpf').style.width=(x.x/x.need*100)+'%';
  const b=badgeCounts();
  [['bdg_cal',b.cal],['bdg_mail',b.mail],['bdg_tasks',b.tasks],['bdg_shop',b.shop]].forEach(([id,n])=>{const e=$(id);if(e)e.style.display=n?'flex':'none';});
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(!g)return;
  const [s,t]=g.dataset.go.split(':');if(t)shopTab=t;openScreen(s);
});

/* build headers + nav */
document.querySelectorAll('.screen[data-title]').forEach(s=>{
  if(s.id==='home'||s.id==='fight'||s.id==='prep')return;
  const id=s.id,h=el('div','hdr');
  if(BACK[id]){const b=el('button','btn sm back','&#8249; Back');b.onclick=()=>openScreen(BACK[id]);h.appendChild(b);}
  h.appendChild(el('div','htitle',s.dataset.title));
  h.appendChild(el('div','hcur',pillsHTML()));
  s.insertBefore(h,s.firstChild);
});
(function(){
  const n=$('nav');
  NAV.forEach(([id,l,i])=>{
    const b=el('button','nb'+(id==='home'?' center':''),'<span class="nbi">'+ic(i)+'</span><span class="nbl">'+l+'</span>'+((id==='shop'||id==='tasks')?'<span class="dot" id="bdg_'+id+'"></span>':''));
    b.dataset.s=id;b.onclick=()=>openScreen(id);n.appendChild(b);
  });
})();

let curScreen='home';
function openScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');curScreen=id;
  document.body.dataset.nav=NAVSCREENS.has(id)?'1':'0';
  document.querySelectorAll('#nav .nb').forEach(b=>b.classList.toggle('on',b.dataset.s===id));
  dayFix();if(id==='home'&&typeof layoutHome==='function')layoutHome();
  if(DRAW[id])DRAW[id]();
  syncCur();
  const sc=$(id).querySelector('.scroll');if(sc&&id!=='campaign')sc.scrollTop=0;
}

/* ---------- home ---------- */
const rate=()=>Math.round(ECON.idleBase+ECON.idlePerStage*save.cleared);
function pending(){const m=Math.min(ECON.idleCapMin,(Date.now()+save.skip-save.last)/60000);return {m,g:Math.floor(m*rate())};}
function drawHome(){
  const p=pending(),pct=p.m/ECON.idleCapMin;
  $('rw').textContent=comma(p.g);
  const h=Math.floor(p.m/60),mm=Math.floor(p.m%60);
  $('rt').textContent=h+'h '+mm+'m / 8h'+(p.m>=ECON.idleCapMin?' — full':'');
  $('rbar').style.width=(pct*100)+'%';$('rrate').textContent=comma(rate())+' Chaos / min';
  $('claim').disabled=p.g<1;$('hint').style.display=save.cleared===0?'block':'none';
  $('idleChest').src=ICO[pct>=1?'chest_gold':pct>=.5?'chest_silver':'chest_bronze'];
  $('idleChest').classList.toggle('full',pct>=1);
  const stg=Math.min(save.cleared+1,MAXSTAGE);
  $('goSub').textContent='Chapter '+(chapOf(stg)+1)+' · Stage '+stageLabel(stg);
  syncCur();
}
DRAW.home=drawHome;
$('claim').onclick=()=>{
  const p=pending();if(p.g<1)return;
  const n=Math.min(ECON.chestMax,Math.floor(p.m/ECON.chestEveryMin));
  const tiers=[];for(let i=0;i<n;i++)tiers.push(stageDropTier());
  prog('claim');save.last=Date.now();save.skip=0;
  const out=give({gold:p.g,tiers,xp:10});drawHome();
  showRewards('Idle Rewards',out,Math.floor(p.m/60)+'h '+Math.floor(p.m%60)+'m of progress collected');
};
$('go').onclick=()=>openScreen('campaign');
$('cfg').onclick=()=>openScreen('settings');
(function(){
  const L=[['Calendar','ui_calendar','cal','bdg_cal'],['Mail','ui_mail','mail','bdg_mail']];
  const R=[['Recruit','ticket','recruit',null],['Quick Idle','ui_hourglass','quick',null],['Guild','ui_guild','guild',null],['Friends','ui_friends','friends',null]];
  const mkb=([n,i,s,b],box)=>{
    const w=el('div','sb');const bt=el('button','rb','<img class="ic" src="'+ICO[i]+'" alt="">'+(b?'<span class="dot" id="'+b+'"></span>':''));
    bt.setAttribute('aria-label',n);bt.onclick=()=>s==='quick'?quickIdle():openScreen(s);w.appendChild(bt);w.appendChild(el('span','sl',n));box.appendChild(w);
  };
  L.forEach(x=>mkb(x,$('iconsL')));R.forEach(x=>mkb(x,$('iconsR')));
})();

/* background afk scene (visual only) */
const HOMEPOS={mon:[252,436]},HOMEH=[[62,412],[112,446],[160,416],[86,474]];
let homeS=1;
function sprite(cls){
  const d=document.createElement('div');d.className='unit';d.dataset.c=cls;
  d.innerHTML='<div class="spr"></div>';return d;
}
function layoutHome(){
  const W=$('home').clientWidth||390,H=$('home').clientHeight||844;
  if(!W||!H)return;
  const s=Math.max(W/320,H/693);homeS=s;const off=(320*s-W)/2;
  [...bgH,...bgM].forEach(d=>{
    const cls=d.dataset.c,key=cls==='mon'?'clorox':cls,P=cls==='mon'?HOMEPOS.mon:HOMEH[+d.dataset.i];
    spriteArt(d.querySelector('.msp,.spr'),key,s);
    d.style.left=(P[0]*s-off)+'px';d.style.top=(H-(693-P[1])*s)+'px';d.style.zIndex=P[1];
  });
}
let bgH=[];
function rebuildBgH(){$('bgH').innerHTML='';bgH=save.team.map((c,i)=>{const u=sprite(c);u.dataset.i=i;$('bgH').appendChild(u);return u;});layoutHome();}
const bgM=[0].map(()=>{const u=sprite('mon');$('bgM').appendChild(u);return u;});
window.addEventListener('resize',layoutHome);rebuildBgH();setTimeout(layoutHome,50);
setInterval(()=>{
  if(!$('home').classList.contains('on'))return;
  window.bgN=(window.bgN||0)+1;
  if(!bgH.length)return;const h=bgH[rnd(bgH.length)],m=bgM[0],host=$('home');
  if(window.bgN%4===0){
    atkEl(m);const t=bgH[rnd(bgH.length)];
    setTimeout(()=>launchWipes(host,m.querySelector('canvas'),t.querySelector('canvas'),.17,()=>{const f=document.createElement('span');f.className='fl';f.style.top='-70px';f.textContent='-'+(5+rnd(10));t.appendChild(f);setTimeout(()=>f.remove(),800);},homeS),200);
  }else{
    atkEl(h);
    const f=document.createElement('span');f.className='fl';f.style.top='-90px';f.textContent='-'+(5+rnd(20));m.appendChild(f);setTimeout(()=>f.remove(),800);
  }
},900);
setInterval(()=>{if(curScreen==='home')drawHome();},1000);

/* quick idle */
function quickIdle(){
  dayFix();const n=save.quick.n,costs=ECON.quickIdleCost,left=costs.length-n;
  const g=Math.round(rate()*ECON.quickIdleMin);
  const b=el('div','qi');
  b.innerHTML='<div class="qic">'+ic('ui_hourglass','big')+'</div><div class="sub">Instantly collect <b>'+ECON.quickIdleMin/60+' hours</b> of idle rewards.</div><div class="chips">'+chips({gold:g,tiers:[0]})+'</div>';
  if(left<=0)b.appendChild(el('div','sub dim','No quick idles left today. Come back tomorrow.'));
  else{
    const c=costs[n],btn=el('button','btn primary',c===0?'Free ('+left+' left today)':'Collect &nbsp;'+ic('gem','s')+' '+c+' &nbsp;<small>('+left+' left)</small>');
    btn.onclick=()=>{
      if(c>0&&save.gems<c){toast('Not enough Divine');return;}
      save.gems-=c;save.quick.n++;
      const out=give({gold:g,tiers:[stageDropTier()]});syncCur();
      showRewards('Quick Idle',out);
    };
    b.appendChild(btn);
  }
  openModal(b,{title:'Quick Idle'});
}

/* ---------- campaign ---------- */
DRAW.campaign=function(){
  const box=$('campBody');box.innerHTML='';let curEl=null;
  ECON.chapters.forEach((c,ci)=>{
    const first=ci*ECON.stagesPerChapter+1,last=first+ECON.stagesPerChapter-1;
    const unlocked=first<=save.cleared+1,done=Math.max(0,Math.min(ECON.stagesPerChapter,save.cleared-first+1));
    const p=el('div','panel chap'+(unlocked?'':' locked'));
    p.innerHTML='<div class="chead"><div class="cart" style="background-image:url('+BGCH[ci]+')"></div><div class="ctx"><small>Chapter '+(ci+1)+'</small><b>'+c.n+'</b><span>'+c.sub+'</span></div><div class="cprog">'+(unlocked?done+' / '+ECON.stagesPerChapter:ic('ui_lock'))+'</div></div>';
    const g=el('div','nodes');
    for(let n=first;n<=last;n++){
      const st=n<=save.cleared?'done':n===save.cleared+1?'cur':'lock',boss=n===last;
      const b=el('button','node '+st+(boss?' boss':''),(st==='done'?ic('ui_check','s'):st==='lock'?ic('ui_lock','s'):'')+'<span>'+(boss?'BOSS':stageIn(n))+'</span>');
      b.disabled=st==='lock';b.onclick=()=>openPrep(n);g.appendChild(b);
      if(st==='cur')curEl=b;
    }
    p.appendChild(g);
    const foot=el('div','cfoot');
    foot.innerHTML=unlocked?'<small>Chapter reward</small>'+chips({gems:ECON.chapterGems,keys:{s:1}})+(save.chapDone[ci]?'<span class="got">Claimed</span>':''):'<small>Clear the previous chapter to unlock</small>';
    p.appendChild(foot);box.appendChild(p);
  });
  box.appendChild(el('div','sub dim center','More chapters coming soon'));
  setTimeout(()=>{if(curEl)curEl.scrollIntoView({block:'center'});},30);
};

/* ---------- heroes ---------- */
let selHero='tank';
DRAW.heroes=function(){
  const box=$('heroBody');box.innerHTML='';
  const tabs=el('div','htabs');
  Object.keys(HEROES).filter(r=>!HEROES[r].nopool||isOwned(r)).forEach(r=>{
    const b=el('button','htab'+(r===selHero?' on':'')+(isOwned(r)?'':' locked'));const sp=el('div','htp');spriteArt(sp,r,.42,true);b.appendChild(sp);
    b.appendChild(el('div','htn',(save.team.includes(r)?'<i class="tdot"></i>':'')+HEROES[r].n.split(' ')[0]+'<small>'+(isOwned(r)?'Lv '+save.lv[r]+(starsOf(r)?' &middot; '+starsOf(r)+'★':''):'Locked')+'</small>'));b.onclick=()=>{selHero=r;DRAW.heroes();};tabs.appendChild(b);
  });
  box.appendChild(tabs);
  if(!isOwned(selHero)&&HEROES[selHero].nopool)selHero='tank';
  const r=selHero,H=HEROES[r],st=heroStats(r),lv=save.lv[r],cost=ECON.heroLvCost(lv);
  if(!isOwned(r)){
    const c0=el('div','panel hcard');const t0=el('div','htop2');
    const p0=el('div','hport locked');const s0=el('div','hps');spriteArt(s0,r,1.25,true);p0.appendChild(s0);t0.appendChild(p0);
    const i0=el('div','hinfo');i0.innerHTML='<div class="hname">'+H.n+'</div><div class="hrole">'+H.role+' &middot; '+H.sub+'</div><div class="sub">Not recruited yet. Pull them on the Recruit screen. '+shardsOf(r)+' shards saved.</div>';
    t0.appendChild(i0);c0.appendChild(t0);
    const g0=el('button','btn primary wide','Go to Recruit');g0.onclick=()=>openScreen('recruit');c0.appendChild(g0);
    c0.appendChild(el('div','ultbox','<div class="ulth">Ultimate — '+ULT[r].n+'</div><div class="sub">'+ULT[r].d+' Needs '+ULT[r].mana+' mana.</div>'));
    box.appendChild(c0);return;
  }
  const card=el('div','panel hcard');
  const top=el('div','htop2');
  const port=el('div','hport');const sp=el('div','hps');spriteArt(sp,r,1.25,true);port.appendChild(sp);if(typeof AVA!=='undefined'&&AVA[r]){const av=el('div','hava');av.innerHTML='<img src="'+AVA[r]+'">';port.appendChild(av);}top.appendChild(port);
  const info=el('div','hinfo');
  info.innerHTML='<div class="hname">'+H.n+'</div><div class="hrole">'+H.role+' &middot; '+H.sub+(save.team.includes(r)?' &middot; <b class="gld">On team</b>':'')+'</div>'
   +'<div class="stat"><span>Level</span><b>'+lv+' <small>/ '+plv()+'</small></b></div>'
   +'<div class="stat"><span>Stars</span><b class="gld">'+starStr(starsOf(r))+'</b></div>'
   +'<div class="stat"><span>Health</span><b>'+comma(st.hp)+'</b></div>'
   +'<div class="stat"><span>Attack</span><b>'+comma(st.atk)+'</b></div>'
   +'<div class="stat"><span>Power</span><b class="gld">'+comma(powerOf(r))+'</b></div>';
  top.appendChild(info);card.appendChild(top);
  const lb=el('button','btn primary wide',lv>=plv()?'Level cap — raise your player level':'Level up &nbsp;'+ic('gold','s')+' '+comma(cost));
  lb.disabled=lv>=plv()||save.gold<cost;
  lb.onclick=()=>{save.gold-=cost;save.lv[r]++;prog('lvl');persist();DRAW.heroes();syncCur();};
  card.appendChild(lb);
  const sc=starCost(r);
  if(sc){const sb=el('button','btn wide','Star up &nbsp;'+shardsOf(r)+' / '+sc+' shards');sb.disabled=shardsOf(r)<sc;sb.onclick=()=>{save.shards[r]-=sc;save.stars[r]=starsOf(r)+1;persist();toast(H.n+' reached '+starsOf(r)+' star'+(starsOf(r)>1?'s':'')+'!');DRAW.heroes();};card.appendChild(sb);}
  const u=ULT[r];
  card.appendChild(el('div','ultbox','<div class="ulth">Ultimate — '+u.n+'</div><div class="sub">'+u.d+' Needs '+u.mana+' mana.</div>'));
  box.appendChild(card);

  const eq=el('div','panel eqp');
  eq.appendChild(el('div','sect','Equipment <small>Best set: <span style="color:'+SETS[PREF[r]].col+'">'+SETS[PREF[r]].n+'</span></small>'));
  const g=el('div','eqgrid');
  SLOTS.forEach(s=>{
    const it=itemOf(save.eq[r][s]),b=el('button','eqslot');
    b.innerHTML=(it?tileHTML(it):'<div class="tile empty">'+ic(s.startsWith('weapon')?'item_sword_0':'item_'+s+'_0','ghost')+'</div>')+'<span>'+LABEL[STYPE(s)]+'</span>';
    b.onclick=()=>pickEquip(r,s);g.appendChild(b);
  });
  ['Ring','Necklace','Belt'].forEach(n=>{const b=el('div','eqslot locked');b.innerHTML='<div class="tile empty">'+ic('ui_lock','ghost')+'</div><span>'+n+'</span>';g.appendChild(b);});
  eq.appendChild(g);
  const row=el('div','rbtns');
  const best=el('button','btn','Equip best');best.onclick=equipBest;row.appendChild(best);
  const un=el('button','btn','Unequip hero');un.onclick=()=>{save.eq[r]={};persist();DRAW.heroes();};row.appendChild(un);
  eq.appendChild(row);box.appendChild(eq);
  const note=el('div','sub dim center','Jewelry slots (ring, necklace, belt) unlock in a future update.');box.appendChild(note);
};
function equipBest(){
  save.team.forEach(r=>save.eq[r]={});
  const used=equippedIds(),order=save.team.slice();
  SLOTS.forEach(s=>order.forEach(r=>{
    let best=null,bs=-1;
    save.items.forEach(i=>{
      if(i.type!==STYPE(s)||used.has(i.id))return;
      const sc=pwr(i)*(i.set===PREF[r]?1.5:1);
      if(sc>bs){bs=sc;best=i;}
    });
    if(best){used.add(best.id);save.eq[r][s]=best.id;}
  }));
  persist();DRAW.heroes();toast('Best gear equipped');
}
function pickEquip(r,s){
  const used=equippedIds(),cur=itemOf(save.eq[r][s]);
  const list=save.items.filter(i=>i.type===STYPE(s)&&!used.has(i.id)).sort((a,b)=>(pwr(b)*(b.set===PREF[r]?1.5:1))-(pwr(a)*(a.set===PREF[r]?1.5:1)));
  const body=el('div','pick');
  const tip=el('div','tipbox');const act=el('div','rbtns');
  const grid=el('div','tgrid');
  let sel=null;
  const showSel=i=>{
    sel=i;tip.innerHTML=tipHTML(i);
    const a=istat(i),c=cur?istat(cur):{hp:0,atk:0};
    const dh=a.hp-c.hp,da=Math.round((a.atk-c.atk)*10)/10;
    const cl=v=>v>0?'up':v<0?'dn':'';
    if(cur)tip.insertAdjacentHTML('beforeend','<div class="cmp">vs equipped: <span class="'+cl(dh)+'">'+(dh>=0?'+':'')+dh+' HP</span> <span class="'+cl(da)+'">'+(da>=0?'+':'')+da+' ATK</span></div>');
    act.innerHTML='';const eb=el('button','btn primary','Equip');eb.onclick=()=>{save.eq[r][s]=i.id;persist();closeModal();DRAW.heroes();};act.appendChild(eb);
    grid.querySelectorAll('.tile').forEach((t,k)=>t.classList.toggle('sel',list[k]===i));
  };
  if(cur){tip.innerHTML=tipHTML(cur);tip.insertAdjacentHTML('afterbegin','<div class="sub center">Currently equipped</div>');const ub=el('button','btn','Unequip');ub.onclick=()=>{delete save.eq[r][s];persist();closeModal();DRAW.heroes();};act.appendChild(ub);}
  else tip.innerHTML='<div class="sub center">Select an item to compare.</div>';
  list.forEach(i=>{const w=el('div','tw',tileHTML(i));w.onclick=()=>showSel(i);grid.appendChild(w);});
  grid.querySelectorAll('.tile');
  if(!list.length)grid.appendChild(el('div','sub dim','No unequipped '+LABEL[STYPE(s)].toLowerCase()+'s. Win stages or open chests.'));
  body.appendChild(tip);body.appendChild(act);body.appendChild(grid);
  openModal(body,{title:LABEL[STYPE(s)]+' — '+HEROES[r].n});
}

/* ---------- bag ---------- */
let bagFilter='all';
function stacks(){
  const used=equippedIds(),g={};
  save.items.filter(i=>!used.has(i.id)).forEach(i=>{const k=[i.type,i.set,i.tier,i.star].join('|');(g[k]=g[k]||[]).push(i);});
  return Object.values(g).sort((a,b)=>lvlOf(b[0])-lvlOf(a[0])||a[0].type.localeCompare(b[0].type));
}
DRAW.bag=function(){
  const box=$('bagBody');box.innerHTML='';
  const used=equippedIds();
  const tabs=el('div','tabs');
  [['all','All'],...TYPES.map(t=>[t,LABEL[t]])].forEach(([k,l])=>{const b=el('button','tab'+(bagFilter===k?' on':''),l);b.onclick=()=>{bagFilter=k;DRAW.bag();};tabs.appendChild(b);});
  box.appendChild(tabs);
  const bar=el('div','bagbar');
  bar.innerHTML='<span>'+(save.items.length-used.size)+' items in bag &middot; '+used.size+' equipped</span>';
  const fa=el('button','btn sm','Fuse all');fa.onclick=fuseAll;bar.appendChild(fa);
  const sc=el('button','btn sm','Scrap...');sc.onclick=scrapMenu;bar.appendChild(sc);
  box.appendChild(bar);
  const list=stacks().filter(a=>bagFilter==='all'||a[0].type===bagFilter);
  const g=el('div','panel tpanel');
  const grid=el('div','tgrid');
  list.forEach(a=>{const w=el('div','tw',tileHTML(a[0],{count:a.length}));w.onclick=()=>itemDetail(a[0].type+'|'+a[0].set+'|'+a[0].tier+'|'+a[0].star);grid.appendChild(w);});
  if(!list.length)grid.appendChild(el('div','empty-msg','Nothing here yet.<br><small>Win stages, claim idle chests and open shop chests to find gear.</small>'));
  g.appendChild(grid);box.appendChild(g);
  box.appendChild(el('div','sub dim center','Fuse 2 identical items into 1 of the next level. Common → Magic → Rare → Legendary, 3 levels each.'));
};
function itemDetail(key){
  const a=stacks().find(s=>[s[0].type,s[0].set,s[0].tier,s[0].star].join('|')===key);
  if(!a){closeModal();DRAW.bag();return;}
  const i=a[0],body=el('div','pick');
  body.innerHTML=tipHTML(i)+'<div class="sub center">You have <b>'+a.length+'</b> unequipped</div>';
  const row=el('div','rbtns col');
  if(a.length>=2&&lvlOf(i)<11){
    const f=el('button','btn primary','Fuse 2 → '+(i.star===2?TIERS[i.tier+1][0]+' 0★':TIERS[i.tier][0]+' '+(i.star+1)+'★'));
    f.onclick=()=>{fuse(a[0],a[1]);toast('Fused!');itemDetail(key);};row.appendChild(f);
  }
  const s1=el('button','btn','Scrap 1 &nbsp;'+ic('gold','s')+' '+comma(scrapVal(i)));
  s1.onclick=()=>{save.items=save.items.filter(x=>x!==a[0]);save.gold+=scrapVal(i);persist();syncCur();DRAW.bag();itemDetail(key);};row.appendChild(s1);
  if(a.length>1){const s2=el('button','btn','Scrap all '+a.length+' &nbsp;'+ic('gold','s')+' '+comma(scrapVal(i)*a.length));
    s2.onclick=()=>{save.items=save.items.filter(x=>!a.includes(x));save.gold+=scrapVal(i)*a.length;persist();syncCur();closeModal();DRAW.bag();};row.appendChild(s2);}
  body.appendChild(row);
  openModal(body,{title:'Item',onClose:()=>{if(curScreen==='bag')DRAW.bag();}});
}
function fuse(a,b){
  save.items=save.items.filter(x=>x!==a&&x!==b);
  const n={id:save.nid++,type:a.type,set:a.set,tier:a.tier,star:a.star+1};
  if(n.star>2){n.star=0;n.tier++;}
  save.items.push(n);prog('fuse');save.stats.fuses++;persist();return n;
}
function fuseAll(){
  let n=0;
  for(let g=0;g<999;g++){
    const m={};stacks().forEach(s=>{if(s.length>=2&&lvlOf(s[0])<11)m[s[0].id]=s;});
    const k=Object.keys(m)[0];if(k===undefined)break;
    const s=m[k];fuse(s[0],s[1]);n++;
  }
  DRAW.bag();toast(n?('Fused '+n+' time'+(n>1?'s':'')):'Nothing to fuse');
}
function scrapMenu(){
  const body=el('div','pick');body.appendChild(el('div','sub center','Scrap all unequipped items of a tier for Chaos. Equipped gear is never scrapped.'));
  const row=el('div','rbtns col');
  TIERS.forEach((t,ti)=>{
    const items=save.items.filter(i=>i.tier===ti&&!equippedIds().has(i.id));
    const v=items.reduce((a,i)=>a+scrapVal(i),0);
    const b=el('button','btn','<span style="color:'+t[1]+'">'+t[0]+'</span> &nbsp;&times;'+items.length+' &nbsp;'+ic('gold','s')+' '+comma(v));
    b.disabled=!items.length;
    b.onclick=()=>{if(!b.dataset.s){b.dataset.s=1;b.innerHTML='Tap again to confirm';return;}save.items=save.items.filter(x=>!items.includes(x));save.gold+=v;persist();syncCur();closeModal();DRAW.bag();toast('Scrapped for '+comma(v)+' gold');};
    row.appendChild(b);
  });
  body.appendChild(row);openModal(body,{title:'Scrap Items'});
}

/* ---------- tasks / activity ---------- */
let taskTab='daily';
function drawAch(box){
  const L=el('div','panel tlist');
  ECON.achievements.slice().sort((a,b)=>(save.ach[a.id]?1:0)-(save.ach[b.id]?1:0)||(achCan(b)?1:0)-(achCan(a)?1:0)).forEach(a=>{
    const v=Math.min(a.t,achVal(a.stat)),done=!!save.ach[a.id],can=achCan(a);
    const r=el('div','trow'+(done?' done':''));
    r.innerHTML='<div class="tm"><div class="tn">'+a.n+' <small class="dim">'+a.d+'</small></div><div class="tbar"><i style="width:'+(v/a.t*100)+'%"></i><span>'+comma(v)+' / '+comma(a.t)+'</span></div><div class="chips sm">'+chips(a.r)+'</div></div>';
    const b=el('button','btn sm'+(can?' primary':''),done?'Claimed':'Claim');b.disabled=!can;
    b.onclick=()=>{save.ach[a.id]=1;const out=give(a.r);syncCur();DRAW.tasks();showRewards(a.n,out);};
    r.appendChild(b);L.appendChild(r);
  });
  box.appendChild(L);
}
DRAW.tasks=function(){
  const box=$('taskBody');box.innerHTML='';
  const tb=el('div','tabs big');
  [['daily','Daily'],['ach','Achievements']].forEach(([k,l])=>{const b=el('button','tab'+(taskTab===k?' on':''),l);b.onclick=()=>{taskTab=k;DRAW.tasks();};tb.appendChild(b);});
  box.appendChild(tb);
  if(taskTab==='ach'){drawAch(box);return;}
  const pts=actPts();
  const a=el('div','panel actp');
  a.appendChild(el('div','sect','Daily Activity <small>'+pts+' / 100</small>'));
  const bar=el('div','abar');bar.innerHTML='<div class="abf" style="width:'+Math.min(100,pts)+'%"></div>';
  const ms=el('div','ms');
  ECON.milestones.forEach(m=>{
    const done=!!save.tasks.m[m.p],can=pts>=m.p&&!done;
    const b=el('button','mile'+(done?' done':can?' can':''),'<div class="mi">'+(done?ic('ui_check'):ic(m.r.keys&&m.r.keys.s?'chest_silver':m.r.gems?'gem':m.r.keys?'chest_bronze':'gold'))+'</div><b>'+m.p+'</b>');
    b.onclick=()=>{
      if(done){toast('Already claimed');return;}
      if(!can){const body=el('div','rew');body.innerHTML='<div class="sub">Reach '+m.p+' activity points to unlock.</div><div class="chips">'+chips(m.r)+'</div>';openModal(body,{title:'Activity reward',cls:'rewm'});return;}
      save.tasks.m[m.p]=1;const out=give(m.r);syncCur();DRAW.tasks();showRewards('Activity Reward',out);
    };
    ms.appendChild(b);
  });
  a.appendChild(bar);a.appendChild(ms);box.appendChild(a);
  const L=el('div','panel tlist');
  ECON.tasks.forEach(t=>{
    const p=Math.min(t.t,save.tasks.p[t.k]||0),done=!!save.tasks.c[t.id],can=p>=t.t&&!done;
    const r=el('div','trow'+(done?' done':''));
    r.innerHTML='<div class="tm"><div class="tn">'+t.n+'</div><div class="tbar"><i style="width:'+(p/t.t*100)+'%"></i><span>'+p+' / '+t.t+'</span></div><div class="chips sm">'+chips({gold:t.g,xp:t.x})+'<span class="chip pts"><b>+'+t.pts+'</b> pts</span></div></div>';
    const b=el('button','btn sm'+(can?' primary':''),done?'Claimed':'Claim');b.disabled=!can;
    b.onclick=()=>{save.tasks.c[t.id]=1;give({gold:t.g,xp:t.x});persist();DRAW.tasks();syncCur();};
    r.appendChild(b);L.appendChild(r);
  });
  box.appendChild(L);
  box.appendChild(el('div','sub dim center','Resets in '+untilMidnight()));
};
function untilMidnight(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);const s=Math.floor((m-n)/1000);return Math.floor(s/3600)+'h '+String(Math.floor(s%3600/60)).padStart(2,'0')+'m';}

/* ---------- calendar ---------- */
DRAW.cal=function(){
  const st=calInfo(),box=$('calBody');box.innerHTML='';
  box.appendChild(el('div','sub center','Log in every day to keep your streak. Missing a day restarts it.'));
  const g=el('div','calgrid');
  ECON.calendar.forEach((r,d)=>{
    const claimed=d<st.i||(st.i===d&&!st.can&&false),today=d===st.i&&st.can,cl=d<st.i;
    const c=el('div','panel day'+(cl?' done':'')+(today?' today':'')+(d===6?' big':''));
    c.innerHTML='<div class="dn">Day '+(d+1)+'</div><div class="dr">'+chips(r)+'</div>'+(cl?'<div class="dc">'+ic('ui_check')+'</div>':'');
    g.appendChild(c);
  });
  box.appendChild(g);
  const b=el('button','btn primary wide',st.can?'Claim day '+(st.i+1):'Come back tomorrow');b.disabled=!st.can;
  b.onclick=()=>{
    const c=save.cal;c.streak=(c.last===yesterdayKey()?c.streak:0)+1;c.last=dayKey();
    const out=give(Object.assign({xp:10},ECON.calendar[st.i]));syncCur();DRAW.cal();showRewards('Daily Login',out,'Day '+(st.i+1)+' reward');
  };
  box.appendChild(b);
};

/* ---------- mail ---------- */
DRAW.mail=function(){
  const box=$('mailBody');box.innerHTML='';
  const unclaimed=save.mail.filter(m=>!m.claimed);
  const bar=el('div','bagbar','<span>'+unclaimed.length+' unclaimed</span>');
  const ca=el('button','btn sm primary','Claim all');ca.disabled=!unclaimed.length;
  ca.onclick=()=>{
    const tot={gold:0,gems:0,keys:{},tiers:[]};
    unclaimed.forEach(m=>{m.claimed=true;const r=m.rewards;tot.gold+=r.gold||0;tot.gems+=r.gems||0;for(const k in (r.keys||{}))tot.keys[k]=(tot.keys[k]||0)+r.keys[k];(r.tiers||[]).forEach(t=>tot.tiers.push(t));});
    const out=give(tot);syncCur();DRAW.mail();showRewards('Mail Rewards',out);
  };
  bar.appendChild(ca);box.appendChild(bar);
  if(!save.mail.length)box.appendChild(el('div','empty-msg','No mail.'));
  save.mail.forEach(m=>{
    const p=el('div','panel mailr'+(m.claimed?' done':''));
    p.innerHTML='<div class="mh"><b>'+m.title+'</b><small>'+new Date(m.t).toLocaleDateString()+'</small></div><div class="sub">'+m.body+'</div><div class="chips">'+chips(m.rewards)+'</div>';
    const b=el('button','btn sm'+(m.claimed?'':' primary'),m.claimed?'Claimed':'Claim');b.disabled=m.claimed;
    b.onclick=()=>{m.claimed=true;const out=give(m.rewards);syncCur();DRAW.mail();showRewards(m.title,out);};
    p.appendChild(b);box.appendChild(p);
  });
};

/* ---------- guild / friends placeholders ---------- */
function soonPanel(id,icon,title,lines){
  $(id).querySelector('.scroll').innerHTML='<div class="panel soon"><div class="soonic">'+ic(icon,'big')+'</div><div class="soont">'+title+'</div><div class="sub">Coming soon</div><ul>'+lines.map(l=>'<li>'+l+'</li>').join('')+'</ul></div>';
}
soonPanel('guild','ui_guild','Guild',['Join or create a guild with your friend group','Team boss battles with shared rewards','Guild shop and weekly rankings']);
let frTab='list',frRes=[],frQ='';
const esc=t=>String(t==null?'':t).replace(/[<>&"]/g,'');
DRAW.friends=function(){
  const box=$('friends').querySelector('.scroll');box.innerHTML='';
  if(!Acct.online){
    box.innerHTML='<div class="panel soon"><div class="soonic">'+ic('ui_friends','big')+'</div><div class="soont">Friends</div><div class="sub">Friends need the signed-in online version. Open the game from its shared link while signed in to claude.ai, and make sure the owner gave you Contributor access.</div></div>';
    Acct.ready.then(()=>{if(Acct.online&&curScreen==='friends')DRAW.friends();});return;
  }
  Acct.start(()=>{if(curScreen==='friends')DRAW.friends();});
  const inc=Acct.incoming(),gifts=Acct.pendingGifts();
  const tabs=el('div','tabs');
  [['list','Friends'],['req','Requests'+(inc.length?' ('+inc.length+')':'')],['add','Add']].forEach(([k,l])=>{const b=el('button','tab'+(frTab===k?' on':''),l);b.onclick=()=>{frTab=k;DRAW.friends();};tabs.appendChild(b);});
  box.appendChild(tabs);
  const me=el('div','sub center','You are <b>'+esc(save.name||'Wiper')+'</b> <span class="dim">#'+Acct.tag(Acct.id)+'</span>');me.style.margin='8px 0';box.appendChild(me);
  const prow=(p,id,right)=>{const r=el('div','srow','<span><b>'+esc(p.name)+'</b> <small class="dim">#'+Acct.tag(id)+'</small><br><small class="dim">Level '+(p.lvl||1)+' \u00b7 Stage '+(p.stage?stageLabel(Math.min(p.stage,MAXSTAGE)):'-')+'</small></span>');r.style.marginBottom='6px';if(right)r.appendChild(right);return r;};
  if(frTab==='list'){
    if(gifts.length){
      box.appendChild(el('div','sect','Gifts <small>'+gifts.length+' waiting</small>'));
      const b=el('button','btn primary wide','Claim '+gifts.length+' gift'+(gifts.length>1?'s':'')+' (+'+gifts.length*50+' Chaos Orbs)');
      b.onclick=async()=>{const n=gifts.length;for(const g of gifts)await Acct.claimGift(g);save.gold+=50*n;persist();syncCur();toast('Gifts claimed!');sfx('reward');DRAW.friends();};
      box.appendChild(b);
    }
    const ids=Acct.friendIds();
    box.appendChild(el('div','sect','Your friends <small>'+ids.length+'</small>'));
    if(!ids.length)box.appendChild(el('div','sub center','No friends yet. Use the Add tab to find people by name.'));
    ids.sort((a,b)=>((Acct.profiles[b]||{}).stage||0)-((Acct.profiles[a]||{}).stage||0)).forEach(id=>{
      const p=Acct.profiles[id]||{name:'...'};
      const g=el('button','btn sm',Acct.canGift(id)?'Gift':'Sent');g.disabled=!Acct.canGift(id);
      g.onclick=async()=>{g.disabled=true;await Acct.sendGift(id);save.gold+=10;persist();syncCur();toast('Gift sent! +10 Chaos Orbs');DRAW.friends();};
      const w=el('div');w.style.cssText='display:flex;gap:6px';w.appendChild(g);
      const x=el('button','btn sm','\u2715');x.onclick=()=>{if(x.dataset.s){const r=Object.values(Acct.reqs).find(r=>(r.from===id||r.to===id)&&r.st==='ok');if(r)Acct.remove(r).then(DRAW.friends);}else{x.dataset.s=1;x.textContent='Sure?';}};w.appendChild(x);
      box.appendChild(prow(p,id,w));
    });
  }else if(frTab==='req'){
    box.appendChild(el('div','sect','Incoming <small>'+inc.length+'</small>'));
    if(!inc.length)box.appendChild(el('div','sub center','No pending requests.'));
    inc.forEach(r=>{const p=Acct.profiles[r.from]||{name:'...'};const w=el('div');w.style.cssText='display:flex;gap:6px';
      const a=el('button','btn sm primary','Accept');a.onclick=()=>Acct.accept(r).then(()=>{toast('Friend added!');});
      const d=el('button','btn sm','\u2715');d.onclick=()=>Acct.remove(r).then(DRAW.friends);w.append(a,d);box.appendChild(prow(p,r.from,w));});
    const out=Acct.outgoing();
    box.appendChild(el('div','sect','Sent <small>'+out.length+'</small>'));
    if(!out.length)box.appendChild(el('div','sub center','Nothing sent.'));
    out.forEach(r=>{const p=Acct.profiles[r.to]||{name:'...'};const c=el('button','btn sm','Cancel');c.onclick=()=>Acct.remove(r).then(DRAW.friends);box.appendChild(prow(p,r.to,c));});
  }else{
    box.appendChild(el('div','sect','Find a player'));
    const inp=el('input');inp.id='frSearch';inp.type='text';inp.placeholder='Type a name (2+ letters)';inp.value=frQ;inp.autocomplete='off';
    inp.style.cssText='width:100%;box-sizing:border-box;padding:12px;background:#000;border:1px solid #5b4529;color:#f1e6c8;font-size:16px;margin-bottom:8px';
    box.appendChild(inp);const res=el('div');box.appendChild(res);
    const show=()=>{res.innerHTML='';if(frQ.trim().length>=2&&!frRes.length)res.appendChild(el('div','sub center','No players found. They need to open the game once to appear.'));
      frRes.forEach(p=>{const known=Acct.reqs[p.id+'~'+Acct.id]||Acct.reqs[Acct.id+'~'+p.id];
        const b=el('button','btn sm primary',known?(known.st==='ok'?'Friends':'Pending'):'Add');b.disabled=!!known;
        b.onclick=async()=>{b.disabled=true;await Acct.request(p.id);Acct.profiles[p.id]=p;toast('Request sent');b.textContent='Pending';};
        res.appendChild(prow(p,p.id,b));});};
    let tm;inp.oninput=()=>{frQ=inp.value;clearTimeout(tm);tm=setTimeout(async()=>{try{frRes=await Acct.search(frQ);}catch(e){frRes=[];}show();},350);};
    show();
  }
};

/* ---------- shop ---------- */
let shopTab='deals';
const SHOPTABS=[['deals','Deals'],['chests','Chests'],['gold','Chaos'],['gems','Divine']];
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function dealsFor(){
  const R=mulberry(hashStr(save.shop.day+':'+save.shop.n)),P=()=>TYPES[Math.floor(R()*5)],S=()=>Math.floor(R()*3);
  const disc=()=>[.1,.2,.3,.4][Math.floor(R()*4)];
  const item=(tier,cur)=>{const d=disc(),base=cur==='gold'?ECON.itemGold[tier]:ECON.itemGems[tier];return {kind:'item',type:P(),set:S(),tier,cur,disc:d,price:Math.round(base*(1-d))};};
  const FR=mulberry(hashStr(save.shop.day+':free'));
  const free={kind:'item',free:true,type:TYPES[Math.floor(FR()*5)],set:Math.floor(FR()*3),tier:1,cur:'gold',price:0,disc:1};
  const keyDeal=(new Date().getDate()%2)?{kind:'keys',keys:{b:5},cur:'gems',price:50,disc:.25}:{kind:'keys',keys:{s:1},cur:'gems',price:80,disc:.2};
  return [free,item(0,'gold'),item(1,'gold'),item(2,'gold'),item(2,'gems'),keyDeal];
}
DRAW.shop=function(){
  const box=$('shopBody');box.innerHTML='';
  const tabs=el('div','tabs big');
  SHOPTABS.forEach(([k,l])=>{const b=el('button','tab'+(shopTab===k?' on':''),l+(k==='deals'&&!save.shop.free?'<span class="dot on"></span>':''));b.onclick=()=>{shopTab=k;DRAW.shop();};tabs.appendChild(b);});
  box.appendChild(tabs);
  ({deals:shopDeals,chests:shopChests,gold:shopGold,gems:shopGems})[shopTab](box);
};
function priceBtn(cur,price,fn,label){
  const ci=cur==='gems'?'gem':cur;const b=el('button','btn buy'+(price===0?' primary':''),(price===0?'FREE':ic(ci,'s')+' '+comma(price)));
  if(label)b.innerHTML=label;
  const have=cur==='gold'?save.gold:save.gems;
  b.onclick=()=>{if(price>0&&have<price){toast(cur==='gold'?'Not enough Chaos':'Not enough Divine');return;}fn();};
  return b;
}
function shopDeals(box){
  const bar=el('div','dealbar');
  bar.innerHTML='<span>Refreshes in <b>'+untilMidnight()+'</b></span>';
  const n=save.shop.n,cost=ECON.refreshCost[n];
  const rb=el('button','btn sm',cost===undefined?'No refreshes left':'Refresh &nbsp;'+ic('gem','s')+' '+cost);rb.disabled=cost===undefined;
  rb.onclick=()=>{if(save.gems<cost){toast('Not enough Divine');return;}save.gems-=cost;save.shop.n++;save.shop.bought={free:save.shop.bought.free};persist();syncCur();DRAW.shop();toast('Deals refreshed');};
  bar.appendChild(rb);box.appendChild(bar);
  const g=el('div','dgrid');
  dealsFor().forEach((d,i)=>{
    const key=d.free?'free':'d'+i,sold=d.free?save.shop.free:!!save.shop.bought[key];
    const c=el('div','panel deal'+(sold?' sold':''));
    let art,name;
    if(d.kind==='item'){const it={type:d.type,set:d.set,tier:d.tier,star:0,id:0};art='<div class="tw">'+tileHTML(it)+'</div>';name='<span style="color:'+TIERS[d.tier][1]+'">'+TIERS[d.tier][0]+' '+SETS[d.set].n+' '+LABEL[d.type]+'</span>';
      c.onclick=e=>{if(e.target.closest('button'))return;const b=el('div','pick');b.innerHTML=tipHTML(it);openModal(b,{title:'Item'});};}
    else{const k=Object.keys(d.keys)[0];art='<div class="tile keyt">'+ic(KEYI[k])+'<span class="cnt">'+d.keys[k]+'</span></div>';name=KEYN[k]+(d.keys[k]>1?'s &times;'+d.keys[k]:'');}
    c.innerHTML=(d.disc&&!d.free?'<span class="disc">-'+Math.round(d.disc*100)+'%</span>':'')+(d.free?'<span class="disc free">FREE</span>':'')+art+'<div class="dn2">'+name+'</div>';
    if(sold)c.appendChild(el('div','soldb','Sold out'));
    else c.appendChild(priceBtn(d.cur,d.price,()=>{
      if(d.free)save.shop.free=true;else save.shop.bought[key]=1;
      save.gold-=d.cur==='gold'?d.price:0;save.gems-=d.cur==='gems'?d.price:0;
      if(d.free)prog('shop');
      let out;
      if(d.kind==='item'){const it=newItem(d.tier,d.type,d.set);persist();out={gold:0,gems:0,keys:{},items:[it]};}
      else out=give({keys:d.keys});
      persist();syncCur();DRAW.shop();showRewards('Purchased',out);
    }));
    g.appendChild(c);
  });
  box.appendChild(g);
}
function weighted(w){let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i;}return w.length-1;}
function rollChest(c){
  let tier=weighted(c.odds);
  if(c.pity){
    save.pity[c.id]++;
    if(c.pity.leg){save.pity.gl++;if(save.pity.gl>=c.pity.leg)tier=3;}
    if(tier<2&&save.pity[c.id]>=c.pity.rare)tier=2;
    if(tier>=2)save.pity[c.id]=0;
    if(tier===3&&c.pity.leg)save.pity.gl=0;
  }
  return tier;
}
function openChests(c,n,useKey){
  if(useKey){if(save.keys[c.key]<n){toast('Not enough keys');return;}save.keys[c.key]-=n;}
  else{
    const cost=Math.round((c.gold||c.gems)*n*(n>1?ECON.multiDiscount:1));
    if(c.gold){if(save.gold<cost){toast('Not enough Chaos');return;}save.gold-=cost;}
    else{if(save.gems<cost){toast('Not enough Divine');return;}save.gems-=cost;}
  }
  const tiers=[];for(let i=0;i<n;i++)tiers.push(rollChest(c));
  const out=give({tiers});prog('chest',n);save.stats.opens+=n;persist();syncCur();DRAW.shop();
  out.items.sort((a,b)=>b.tier-a.tier);
  showRewards(c.name+(n>1?' ×'+n:''),out,n>1?'Best pull first':'');
}
function shopChests(box){
  ECON.chests.forEach(c=>{
    const p=el('div','panel chestp');
    const cur=c.gold?'gold':'gems',one=c.gold||c.gems,ten=Math.round(one*10*ECON.multiDiscount);
    let pity='';
    if(c.pity){pity='<div class="pity">Rare+ in <b>'+(c.pity.rare-save.pity[c.id])+'</b> opens'+(c.pity.leg?' &middot; Legendary in <b>'+(c.pity.leg-save.pity.gl)+'</b>':'')+'</div>';}
    const odds=c.odds.map((o,i)=>o?'<span style="color:'+TIERS[i][1]+'">'+TIERS[i][0]+' '+o+'%</span>':'').filter(Boolean).join(' &middot; ');
    p.innerHTML='<div class="cp-top"><div class="cp-art">'+ic('chest_'+({b:'bronze',s:'silver',g:'gold'})[c.id],'xl')+'</div><div class="cp-tx"><div class="cp-n">'+c.name+'</div><div class="sub">'+c.blurb+'</div><div class="odds">'+odds+'</div>'+pity+'</div></div>';
    const row=el('div','cprow');
    row.appendChild(priceBtn(cur,one,()=>openChests(c,1,false),'Open &times;1 &nbsp;'+ic(cur,'s')+' '+comma(one)));
    row.appendChild(priceBtn(cur,ten,()=>openChests(c,10,false),'Open &times;10 &nbsp;'+ic(cur,'s')+' '+comma(ten)));
    p.appendChild(row);
    const kr=el('div','cprow key');
    const k1=el('button','btn sm','&times;1 &nbsp;'+ic(KEYI[c.key],'s')+' '+save.keys[c.key]);k1.disabled=save.keys[c.key]<1;k1.onclick=()=>openChests(c,1,true);
    const k10=el('button','btn sm','&times;10 &nbsp;'+ic(KEYI[c.key],'s')+' 10');k10.disabled=save.keys[c.key]<10;k10.onclick=()=>openChests(c,10,true);
    kr.appendChild(el('span','kl','Use '+KEYN[c.key]+'s'));kr.appendChild(k1);kr.appendChild(k10);
    p.appendChild(kr);box.appendChild(p);
  });
  box.appendChild(el('div','sub dim center','Opening 10 at once costs 10% less. Odds are shown on every chest.'));
}
function shopGold(box){
  const q=el('div','panel goldp');
  dayFix();const n=save.quick.n,left=ECON.quickIdleCost.length-n;
  q.innerHTML='<div class="gp-h"><div class="cp-art">'+ic('ui_hourglass','xl')+'</div><div class="cp-tx"><div class="cp-n">Quick Idle</div><div class="sub">Instantly collect '+ECON.quickIdleMin/60+'h of idle rewards. '+left+' left today.</div></div></div>';
  const b=el('button','btn primary wide','Open Quick Idle');b.onclick=quickIdle;q.appendChild(b);box.appendChild(q);
  ECON.bundleHours.forEach(h=>{
    const g=Math.round(rate()*60*h),gems=Math.max(10,Math.round(g/ECON.goldPerGem));
    const p=el('div','panel goldp row');
    p.innerHTML='<div class="cp-art">'+ic('gold',h>=24?'xl':h>=8?'lg':'')+'</div><div class="cp-tx"><div class="cp-n">'+comma(g)+' Chaos</div><div class="sub">'+h+' hours of idle income at your current rate</div></div>';
    p.appendChild(priceBtn('gem',gems,()=>{save.gems-=gems;const out=give({gold:g});syncCur();DRAW.shop();showRewards('Chaos Bundle',out);}));
    box.appendChild(p);
  });
  box.appendChild(el('div','sub dim center','Bundle sizes grow as you clear more stages.'));
}
function shopGems(box){
  box.appendChild(el('div','sub center','Real-money purchases are not available in this prototype.'));
  ECON.gemPacks.forEach(([n,g,pr],i)=>{
    const p=el('div','panel goldp row dis');
    p.innerHTML='<div class="cp-art">'+ic('gem',i>=3?'xl':i>=1?'lg':'')+'</div><div class="cp-tx"><div class="cp-n">'+n+'</div><div class="sub">'+comma(g)+' Divine</div></div>';
    const b=el('button','btn buy',pr+'<small>soon</small>');b.disabled=true;p.appendChild(b);box.appendChild(p);
  });
}

/* ---------- Digas mode (god mode for testing; fully reversible) ---------- */
function digasOn(){
  if(save.digas)return;
  save.digasBak=JSON.stringify({cleared:save.cleared,gold:save.gold,gems:save.gems,keys:save.keys,lv:save.lv,xp:save.xp,chapDone:save.chapDone});
  save.digas=1;save.cleared=MAXSTAGE;
  for(let c=0;c<ECON.chapters.length;c++)save.chapDone[c]=1;
  save.gold=Math.max(save.gold,99999999);save.gems=Math.max(save.gems,999999);
  for(const k in save.keys)save.keys[k]=Math.max(save.keys[k],99);
  save.xp=Math.max(save.xp,400000);
  const L=plv();Object.keys(HEROES).forEach(r=>save.lv[r]=Math.max(save.lv[r],L));
  save.digasItems=[];for(let i=0;i<18;i++){const it=newItem(3);if(it)save.digasItems.push(it.id);}
  save.dgInv=1;save.dgKill=1;save.dgMana=1;
  persist();
}
function digasOff(){
  if(!save.digas)return;
  try{const b=JSON.parse(save.digasBak);Object.assign(save,b);}catch(e){}
  const ids=new Set(save.digasItems||[]);save.items=save.items.filter(i=>!ids.has(i.id));
  Object.keys(save.eq).forEach(r=>{Object.keys(save.eq[r]).forEach(k=>{if(ids.has(save.eq[r][k]))delete save.eq[r][k];});});
  save.digas=0;save.digasBak=null;save.digasItems=[];save.dgInv=save.dgKill=save.dgMana=0;persist();
}

/* ---------- settings ---------- */
DRAW.settings=function(){
  const L=$('setBody');L.innerHTML='';
  const row=(label,btn)=>{const r=el('div','srow','<span>'+label+'</span>');r.appendChild(btn);return r;};
  const sec=t=>L.appendChild(el('div','sect',t));
  const tog=(label,get,set)=>{const b=el('button','btn sm'+(get()?' primary':''),get()?'On':'Off');b.onclick=()=>{set(!get());persist();DRAW.settings();};L.appendChild(row(label,b));};
  sec('Digas mode');
  const dg=el('button','btn sm'+(save.digas?' primary':''),save.digas?'On':'Off');
  dg.onclick=()=>{if(save.digas)digasOff();else digasOn();syncCur();toast(save.digas?'Digas mode ON: everything unlocked':'Digas mode off: progress restored');DRAW.settings();};
  L.appendChild(row('Digas mode (unlock everything)',dg));
  L.appendChild(el('div','sub dim','Unlocks all stages, tons of currency, high hero levels and legendary gear. Turning it off restores your real progress.'));
  if(save.digas){
    tog('Heroes can\u2019t die',()=>save.dgInv,v=>save.dgInv=v?1:0);
    tog('One-hit kills',()=>save.dgKill,v=>save.dgKill=v?1:0);
    tog('Ultimates always ready',()=>save.dgMana,v=>save.dgMana=v?1:0);
    const cs=el('div','srow','<span>Watch chapter cutscene</span>');
    for(let c=0;c<ECON.chapters.length;c++){const b=el('button','btn sm',String(c+1));b.onclick=()=>playCut(c,()=>{});cs.appendChild(b);}
    L.appendChild(cs);
  }
  sec('Profile');
  const nb=el('button','btn sm',(save.name||'Wiper')+' \u270e');nb.onclick=()=>{const v=prompt('Player name (2-14 characters)',save.name||'');if(v&&v.trim().length>=2){save.name=v.trim().slice(0,14);persist();applyName();DRAW.settings();}};L.appendChild(row('Player name',nb));
  sec('Game');
  tog('Auto-start next stage after a win',()=>save.auto,v=>save.auto=v);
  tog('Auto ultimates',()=>save.autoUlt,v=>save.autoUlt=v);
  tog('Sound effects',()=>save.sound,v=>save.sound=v);
  tog('Music',()=>save.music,v=>Music.set(v));
  const rt=el('button','btn sm','Replay');rt.onclick=()=>{replayTutorial();};L.appendChild(row('Tutorial with Julia',rt));
  const lang=el('button','btn sm',LANG==='pt'?'Português':'English');lang.onclick=()=>{setLang(LANG==='pt'?'en':'pt');};L.appendChild(row('Language',lang));
  sec('Testing tools');
  const t=(label,txt,fn)=>{const b=el('button','btn sm',txt);b.onclick=()=>{fn();persist();syncCur();toast(label);if(curScreen==='settings')DRAW.settings();};L.appendChild(row(label,b));};
  t('Skip 1 hour of idle time','Skip 1h',()=>save.skip+=3600000);
  t('Add 1,000 Divine','+1,000',()=>save.gems+=1000);
  t('Add 50,000 Chaos','+50K',()=>save.gold+=50000);
  t('Add 5 of every key','+5',()=>{for(const k in save.keys)save.keys[k]+=5;});
  t('Unlock next stage','+1 stage',()=>{if(save.cleared<MAXSTAGE)save.cleared++;});
  t('Raise player level (adds XP)','+500 XP',()=>save.xp+=500);
  t('Reset daily tasks, shop and quick idle','Reset',()=>{save.tasks.day='';save.shop.day='';save.quick.day='';save.cal.last='';dayFix();});
  sec('Danger zone');
  const b2=el('button','btn sm danger','Erase');
  b2.onclick=()=>{if(b2.dataset.s){try{localStorage.removeItem('wipewars');}catch(e){}location.reload();}else{b2.dataset.s=1;b2.textContent='Tap again to confirm';}};
  L.appendChild(row('Erase all progress',b2));
  L.appendChild(el('div','sub dim center','Wipe Wars prototype v19'));
};

/* ---------- start ---------- */
dayFix();
openScreen('home');
setTimeout(()=>{
  const p=pending();
  if(p.m>=60){
    const b=el('div','rew');
    b.innerHTML='<div class="sub">You were away for <b>'+Math.floor((Date.now()+save.skip-save.last)/3600000)+'h '+Math.floor((Date.now()+save.skip-save.last)/60000%60)+'m</b>. Your heroes kept fighting.</div><div class="chips">'+chips({gold:p.g})+'</div>';
    const c=el('button','btn primary','Collect now');c.onclick=()=>{closeModal();$('claim').click();};b.appendChild(c);
    const l=el('button','btn sm','Later');l.onclick=closeModal;b.appendChild(l);
    openModal(b,{title:'Welcome back',cls:'rewm'});
  }
},500);
setInterval(()=>{if(curScreen==='shop'&&shopTab==='deals'&&!$('modal').classList.contains('on')){const b=document.querySelector('.dealbar b');if(b)b.textContent=untilMidnight();}},30000);

/* ---------- Julia tutorial ---------- */
const TIPS={
  home:['Hi, I’m <b>Julia</b>! I’ll show you around Wipe Wars. Ready?','Tap <b>Battle</b> to start fighting. Your heroes attack on their own — no tapping needed.','I left you <b>10 Recruit Tickets</b>! Open <b>Recruit</b> on the right side to meet more friends for your team.','Even when you close the game, your heroes keep earning <b>Chaos Orbs</b> (up to 8 hours). Come back and claim the chest!','Use the buttons along the bottom to visit <b>Heroes</b>, the <b>Bag</b>, the Shop and more. I’ll pop in with tips on each one.'],
  fight:['When a hero’s <b>mana bar</b> fills up, tap their portrait at the bottom to cast an <b>ultimate</b>.','Beat a stage’s <b>Big Head</b> boss to unlock the next one. Lose? Level up and try again!'],
  heroes:['Spend Chaos Orbs to <b>level up</b> your heroes. A hero can’t go above your player level.','Build a team of up to 4 on the <b>Formation</b> screen. <b>Tanks</b> soak damage, <b>ranged DPS</b> can hit the back row, and <b>supports</b> heal, buff, or curse.'],
  recruit:['Every pull brings a friend. The first time you pull someone, they join your crew!','Pulling someone you already have gives <b>shards</b>. Collect enough to give them more <b>stars</b> (+10% stats each).','A <b>new friend is guaranteed</b> within 10 pulls, and your 2 <b>favorites</b> show up twice as often.'],
  bag:['Gear comes in 4 tiers. Fuse two identical pieces to raise their stars.','Tap <b>Equip best</b> to gear everyone up fast. Matching <b>set pieces</b> give bonus stats!']
};
(function(){
  const d=document.createElement('div');d.id='tip';document.body.appendChild(d);
  let tm=null,tk=null,run=0;
  function stop(){d.classList.remove('on');clearInterval(tm);clearTimeout(tk);run++;}
  function play(id,force){
    const steps0=TIPS[id];if(!steps0)return;const steps=steps0.map(s=>window.t?t(s):s);
    if(!force&&save.tut&&save.tut[id])return;
    save.tut=save.tut||{};save.tut[id]=1;persist();
    const my=++run;let i=0;
    d.innerHTML='<img class="jp" alt="Julia"><div class="jb"><div class="jn">Julia</div><div class="jt"></div><div class="jf"><span class="jd"></span><button class="btn sm ghost jskip">Skip</button><button class="btn sm primary jnext">Next</button></div></div>';
    const img=d.querySelector('.jp'),txt=d.querySelector('.jt'),nx=d.querySelector('.jnext'),sk=d.querySelector('.jskip'),dots=d.querySelector('.jd');
    img.src=AVA.jul0;d.classList.add('on');
    function say(){
      clearInterval(tm);const full=steps[i];
      dots.textContent=steps.map((_,k)=>k===i?'●':'○').join(' ');
      nx.textContent=i===steps.length-1?'Got it':'Next';
      const plain=full.replace(/<[^>]+>/g,'');let n=0;txt.innerHTML='';
      tm=setInterval(()=>{
        if(my!==run){clearInterval(tm);return;}
        n+=2;const done=n>=plain.length;
        if(done){txt.innerHTML=full;img.src=AVA.jul0;clearInterval(tm);return;}
        txt.textContent=plain.slice(0,n);img.src=(id==='home'&&i===0)?((n/2)%2?AVA.jul3:AVA.jul0):((n/2)%2?AVA.jul1:AVA.jul0);
      },35);
    }
    nx.onclick=()=>{if(my!==run)return;if(txt.innerHTML!==steps[i]&&txt.textContent.length<steps[i].replace(/<[^>]+>/g,'').length){clearInterval(tm);txt.innerHTML=steps[i];img.src=AVA.jul0;return;}i++;if(i>=steps.length)stop();else say();};
    sk.onclick=stop;
    say();
    (function blink(){tk=setTimeout(()=>{if(my!==run)return;const o=img.src;img.src=AVA.jul2;setTimeout(()=>{if(my===run&&img.src===AVA.jul2)img.src=AVA.jul0;},140);blink();},2600);})();
  }
  window.showTip=id=>play(id,false);
  window.replayTutorial=()=>{save.tut={};persist();stop();if(curScreen!=='home')openScreen('home');setTimeout(()=>play('home',true),300);};
  window.maybeTutorial=()=>setTimeout(()=>showTip('home'),900);
  const oo=openScreen;
  openScreen=function(id){oo(id);stop();if(id!=='home')setTimeout(()=>showTip(id),700);};
})();
