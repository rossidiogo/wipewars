/* ---------- Digas mode (god mode for testing; fully reversible) ---------- */
function digasOn(){
  if(save.digas)return;
  save.digasBak=JSON.stringify({cleared:save.cleared,gold:save.gold,gems:save.gems,keys:save.keys,lv:save.lv,xp:save.xp,chapDone:save.chapDone,sk:save.sk||{}});
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
  HIDS.forEach(r=>{if(skFree(r)<0)skReset(r);});   // a backup from before skill trees has no skills to restore
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
  sec('Lab');
  const lb=el('button','btn sm primary','Open');lb.onclick=()=>openLab('fight');L.appendChild(row('Test heroes, monsters and ultimates, and browse the gallery',lb));
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
  L.appendChild(el('div','sub dim center','Wipe Wars v1.0'));
};

