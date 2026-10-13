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

