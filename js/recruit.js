/* ================= Recruit (gacha) ================= */
const POOL=()=>HIDS.filter(k=>!HEROES[k].nopool);
const starsOf=k=>save.stars[k]||0,shardsOf=k=>save.shards[k]||0;
const starCost=k=>ECON.starCost[starsOf(k)];
const starStr=n=>'<span class="sOn">'+'★'.repeat(n)+'</span><span class="sOff">'+'★'.repeat(5-n)+'</span>';
function rollRar(){let r=Math.random(),a=0;for(let i=0;i<ECON.rarity.length;i++){a+=ECON.rarity[i].p;if(r<a)return i;}return 0;}
function wpick(list){const w=k=>save.wish.includes(k)?2:1;let t=list.reduce((a,k)=>a+w(k),0),r=Math.random()*t;for(const k of list){r-=w(k);if(r<0)return k;}return list[list.length-1];}
function pullOne(){
  const pool=POOL(),locked=pool.filter(k=>!save.own[k]);
  let id=wpick(pool);
  if(locked.length&&save.own[id]&&save.gp.n>=ECON.pityNew-1)id=wpick(locked);
  const isNew=!save.own[id],rar=rollRar();
  if(isNew){save.own[id]=1;save.gp.n=0;}else if(locked.length)save.gp.n++;
  save.gp.t++;
  const sh=ECON.rarity[rar].sh;save.shards[id]=shardsOf(id)+sh;
  return {id,rar,isNew,sh};
}
function doPull(n){
  if(save.tix<n){toast('Not enough recruit tickets');return;}
  save.tix-=n;const res=[];for(let i=0;i<n;i++)res.push(pullOne());
  persist();syncCur();revealPulls(res);
}
function buyTicket(){
  if(save.gems<ECON.ticketGems){toast('Not enough Divine Orbs');return;}
  save.gems-=ECON.ticketGems;save.tix++;persist();syncCur();DRAW.recruit();toast('+1 recruit ticket');
}

/* ----- reveal ----- */
function pcard(r){
  const H=HEROES[r.id],R=ECON.rarity[r.rar];
  const c=el('div','pcard'+(r.isNew?' isnew':'')+(r.rar>=2||r.isNew?' big':''));c.style.setProperty('--rc',R.c);
  c.appendChild(el('div','pglow'));
  c.appendChild(el('div','prar',R.n+' &middot; '+'★'.repeat(r.rar+1)));
  const sp=el('div','psp');spriteArt(sp,r.id,2.6,true);c.appendChild(sp);
  c.appendChild(el('div','pname',H.n));c.appendChild(el('div','prole',H.role+' &middot; '+H.sub));
  c.appendChild(el('div','pbadge',r.isNew?'NEW FRIEND!':'+'+r.sh+' shards'));
  if(r.isNew)c.appendChild(el('div','psub','Joined your crew with a bonus of +'+r.sh+' shards'));
  const need=starCost(r.id);
  c.appendChild(el('div','pbar'+(need?'':' max'),need?'<i style="width:'+Math.min(100,shardsOf(r.id)/need*100)+'%"></i><b>'+shardsOf(r.id)+' / '+need+' to next star</b>':'<b>Max stars</b>'));
  return c;
}
function revealPulls(res){
  let fx=$('pullfx');if(!fx){fx=el('div');fx.id='pullfx';document.body.appendChild(fx);}
  fx.innerHTML='';fx.className='on';
  const best=res.reduce((a,r)=>Math.max(a,r.isNew?Math.max(2,r.rar):r.rar),0),col=ECON.rarity[best].c;
  fx.style.setProperty('--rc',col);
  const portal=el('div','pportal','<div class="pring"></div><div class="ptxt">Recruiting&hellip;</div>');fx.appendChild(portal);
  sfx('ult');
  let i=0,done=false;
  const close=()=>{if(done)return;done=true;fx.className='';fx.innerHTML='';if(curScreen==='recruit')DRAW.recruit();if(curScreen==='heroes')DRAW.heroes();};
  const summary=()=>{
    fx.innerHTML='';const box=el('div','psum');
    box.appendChild(el('div','psh','Results'));
    const g=el('div','pgrid');
    res.forEach(r=>{const R=ECON.rarity[r.rar],t=el('div','pmini'+(r.isNew?' isnew':''));t.style.setProperty('--rc',R.c);const sp=el('div');spriteArt(sp,r.id,.7,true);t.appendChild(sp);t.appendChild(el('div','pn',HEROES[r.id].n));t.appendChild(el('div','pt',r.isNew?'NEW!':'+'+r.sh));g.appendChild(t);});
    box.appendChild(g);
    const nw=res.filter(r=>r.isNew).length,sh=res.reduce((a,r)=>a+r.sh,0);
    box.appendChild(el('div','psub2',(nw?nw+' new friend'+(nw>1?'s':'')+' &middot; ':'')+sh+' shards total'));
    const ok=el('button','btn primary wide','Done');ok.onclick=close;box.appendChild(ok);fx.appendChild(box);
  };
  const show=()=>{
    if(i>=res.length){res.length>1?summary():close();return;}
    const r=res[i];fx.innerHTML='';
    const stage=el('div','pstage');stage.appendChild(pcard(r));
    stage.appendChild(el('div','ptap',i<res.length-1?'Tap to continue ('+(i+1)+' / '+res.length+')':'Tap to finish'));
    if(res.length>1){const sk=el('button','btn sm pskip','Skip all');sk.onclick=e=>{e.stopPropagation();summary();};fx.appendChild(sk);}
    fx.appendChild(stage);
    if(r.isNew||r.rar>=2){fx.classList.remove('pfl');void fx.offsetWidth;fx.classList.add('pfl');sfx('reward');}else sfx('hit');
    stage.onclick=()=>{i++;show();};
  };
  setTimeout(()=>{if(!done)show();},res.length===1&&best<2?500:1100);
}

/* ----- recruit screen ----- */
TITLES.recruit='Recruit';BACK.recruit='home';
DRAW.recruit=function(){
  const box=$('recruitBody');box.innerHTML='';
  const pool=POOL(),locked=pool.filter(k=>!save.own[k]);
  const jb=el('div','panel rjul');
  jb.innerHTML='<img src="'+AVA.jul0+'" alt="Julia"><div><b>Julia</b><div class="sub">Every pull brings a friend. New faces are guaranteed, and repeats become shards that give your friends more stars.</div></div>';
  box.appendChild(jb);
  const p=el('div','panel');
  p.appendChild(el('div','sect','Recruit <small>'+ic('ticket','s')+' '+save.tix+' tickets</small>'));
  const row=el('div','rbtns');
  const b1=el('button','btn primary','Recruit &times;1 &nbsp;'+ic('ticket','s')+' 1');b1.disabled=save.tix<1;b1.onclick=()=>doPull(1);
  const b10=el('button','btn primary','Recruit &times;10 &nbsp;'+ic('ticket','s')+' 10');b10.disabled=save.tix<10;b10.onclick=()=>doPull(10);
  row.appendChild(b1);row.appendChild(b10);p.appendChild(row);
  const buy=el('button','btn wide','Buy a ticket &nbsp;'+ic('gem','s')+' '+ECON.ticketGems);buy.onclick=buyTicket;p.appendChild(buy);
  p.appendChild(el('div','sub dim center','Earn tickets by clearing new stages, daily login, and task milestones.'));
  box.appendChild(p);
  const pc=el('div','panel');
  pc.appendChild(el('div','sect','New friend guarantee'));
  if(locked.length){const n=Math.min(ECON.pityNew,save.gp.n);pc.appendChild(el('div','pbarx','<i style="width:'+(n/ECON.pityNew*100)+'%"></i><b>'+n+' / '+ECON.pityNew+'</b>'));pc.appendChild(el('div','sub dim center','A new friend is guaranteed within '+(ECON.pityNew-n)+' pull'+(ECON.pityNew-n>1?'s':'')+'. '+locked.length+' still to find.'));}
  else pc.appendChild(el('div','sub center','Everyone has joined your crew! Repeats now go straight into star shards.'));
  box.appendChild(pc);
  const wp=el('div','panel');
  wp.appendChild(el('div','sect','Favorites <small>'+save.wish.length+' / 2 &middot; 2&times; chance</small>'));
  const wg=el('div','rchips');
  pool.forEach(k=>{const on=save.wish.includes(k),b=el('button','rchip'+(on?' on':'')+(save.own[k]?'':' locked'));const sp=el('div','rsp');spriteArt(sp,k,.42,true);b.appendChild(sp);b.appendChild(el('div','rn',HEROES[k].n));
    b.onclick=()=>{if(on)save.wish=save.wish.filter(x=>x!==k);else{if(save.wish.length>=2){toast('Pick up to 2 favorites');return;}save.wish.push(k);}persist();DRAW.recruit();};wg.appendChild(b);});
  wp.appendChild(wg);box.appendChild(wp);
  const cp=el('div','panel');
  cp.appendChild(el('div','sect','Collection <small>'+pool.filter(k=>save.own[k]).length+' / '+pool.length+'</small>'));
  const cg=el('div','rchips');
  pool.forEach(k=>{const own=!!save.own[k],b=el('button','rchip col'+(own?'':' locked'));const sp=el('div','rsp');spriteArt(sp,k,.42,true);b.appendChild(sp);b.appendChild(el('div','rn',own?HEROES[k].n:'???'));
    if(own){const n=starCost(k);b.appendChild(el('div','rst',starStr(starsOf(k))));b.appendChild(el('div','rsh',n?shardsOf(k)+'/'+n:'MAX'));}
    b.onclick=()=>{if(!own){toast('Not recruited yet');return;}selHero=k;openScreen('heroes');};cg.appendChild(b);});
  cp.appendChild(cg);box.appendChild(cp);
  const op=el('div','panel');
  op.appendChild(el('div','sect','Pull rarity'));
  op.appendChild(el('div','sub',ECON.rarity.map(r=>'<span style="color:'+r.c+'">'+r.n+'</span> '+Math.round(r.p*100)+'% &middot; +'+r.sh+' shards').join('<br>')));
  op.appendChild(el('div','sub dim','Star costs: '+ECON.starCost.join(', ')+' shards. Each star adds +10% stats.'));
  box.appendChild(op);
};
