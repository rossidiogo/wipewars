/* ---------- shop ---------- */
let shopTab='deals';
const SHOPTABS=[['deals','Deals'],['chests','Chests'],['gold','Chaos'],['gems','Divine']];
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

