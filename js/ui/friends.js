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

