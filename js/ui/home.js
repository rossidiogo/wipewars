/* ---------- home ---------- */
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
  const c=claimIdle();drawHome();
  showRewards('Idle Rewards',c.out,Math.floor(p.m/60)+'h '+Math.floor(p.m%60)+'m of progress collected');
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
  // the scene is portrait art: on wide windows stop growing at 450 visible rows and centre it (style.css #home.cap)
  const s=Math.min(Math.max(W/320,H/693),H/450);homeS=s;const off=(320*s-W)/2;
  $('home').classList.toggle('cap',off<0);$('home').style.setProperty('--hsw',320*s+'px');
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

