/* ---------- bag ---------- */
let bagFilter='all';
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
function fuseAll(){const n=fuseEverything();DRAW.bag();toast(n?('Fused '+n+' time'+(n>1?'s':'')):'Nothing to fuse');}
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

