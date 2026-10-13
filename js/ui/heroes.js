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
  lb.onclick=()=>{levelUp(r);DRAW.heroes();syncCur();};
  card.appendChild(lb);
  const fp=skCanSpend(r)?skFree(r):0,kb=el('button','btn wide sktbtn'+(fp>0?' has':''),'<span>Skill tree</span>'+(fp>0?'<b class="skbdg">'+fp+'</b>':''));
  kb.onclick=()=>openScreen('skills');card.appendChild(kb);
  const sc=starCost(r);
  if(sc){const sb=el('button','btn wide','Star up &nbsp;'+shardsOf(r)+' / '+sc+' shards');sb.disabled=shardsOf(r)<sc;sb.onclick=()=>{starUp(r);syncCur();toast(H.n+' reached '+starsOf(r)+' star'+(starsOf(r)>1?'s':'')+'!');DRAW.heroes();};card.appendChild(sb);}
  const u=ULT[r];
  card.appendChild(el('div','ultbox','<div class="ulth">Ultimate — '+u.n+'</div><div class="sub">'+u.d+' Needs '+u.mana+' mana.</div>'));
  box.appendChild(card);

  const W=WEAPONS[r],wl=wlvOf(r),ws=wepStat(r),wc=el('div','panel wpn');
  wc.appendChild(el('div','sect','Weapon <small>Fixed - cannot be changed</small>'));
  wc.appendChild(el('div','wrow','<div class="wico">'+W.ico+'</div><div class="winf"><b>'+W.n+'</b> <small class="gld">Lv '+wl+' / '+WEP_MAX+'</small><div class="sub">'+W.d+'</div><div class="sub"><span>Attack</span> <b>+'+ws.atk+'</b> &middot; <span>Health</span> <b>+'+ws.hp+'</b></div></div>'));
  if(wl<WEP_MAX){
    const nx=wepStat(r,wl+1),wcost=wepCost(wl);
    const ub=el('button','btn primary wide','Upgrade weapon &nbsp;'+ic('gold','s')+' '+comma(wcost)+' &nbsp;<small>+'+Math.round((nx.atk-ws.atk)*10)/10+' ATK / +'+(nx.hp-ws.hp)+' HP</small>');
    ub.disabled=save.gold<wcost;
    ub.onclick=()=>{if(!wepUp(r))return;sfx('reward');DRAW.heroes();syncCur();};
    wc.appendChild(ub);
  }else wc.appendChild(el('div','sub center gld','Weapon at max level'));
  box.appendChild(wc);

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
function equipBest(){equipBestTeam();DRAW.heroes();toast('Best gear equipped');}
function pickEquip(r,s){
  const used=equippedIds(),cur=itemOf(save.eq[r][s]);
  const list=save.items.filter(i=>i.type===STYPE(s)&&!used.has(i.id)).sort((a,b)=>gearScore(b,r)-gearScore(a,r));
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

