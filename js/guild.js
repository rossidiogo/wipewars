/* ================= guilds (shared db) ================= */
(function(){
  const esc=t=>String(t==null?'':t).replace(/[<>&"]/g,'');
  const BOSSES=[['The Plunger King','hue-rotate(0deg)'],['Sir Scrubs-a-Lot','hue-rotate(160deg) saturate(1.2)'],['Duchess of Dust','hue-rotate(260deg) saturate(.8)'],['Baron Von Mold','hue-rotate(95deg) saturate(1.3) brightness(.9)']];
  const wkNow=()=>Math.floor((Date.now()+4*864e5)/(7*864e5));
  const MAXATT=3;
  const G={gid:null,guild:null,members:[],subs:[],me:null,mode:'home',res:[],q:'',browse:null};
  function totalPower(){return save.team.reduce((a,r)=>a+powerOf(r),0);}
  function myDoc(){return Acct.db.doc('gmembers/'+Acct.id);}
  function meBase(extra){return Object.assign({name:save.name||'Wiper',lvl:plv(),pw:totalPower(),t:Date.now()},extra||{});}
  function stop(){G.subs.forEach(f=>{try{f();}catch(e){}});G.subs=[];}
  function listen(){
    stop();
    G.subs.push(myDoc().onSnapshot(s=>{
      const d=s.exists?s.data():null;const gid=d&&d.gid;
      if(gid!==G.gid){G.gid=gid||null;G.guild=null;G.members=[];watchGuild();}
      G.me=d;redraw();
    },()=>{}));
  }
  function watchGuild(){
    if(G.watchOff){G.watchOff();G.watchOff=null;}if(G.watchOff2){G.watchOff2();G.watchOff2=null;}
    if(!G.gid)return;
    G.watchOff=Acct.db.doc('guilds/'+G.gid).onSnapshot(s=>{G.guild=s.exists?s.data():null;redraw();},()=>{});
    G.watchOff2=Acct.db.collection('gmembers').where('gid','==',G.gid).onSnapshot(s=>{G.members=s.docs.map(d=>Object.assign({id:d.id},d.data()));redraw();},()=>{});
  }
  function redraw(){if(curScreen==='guild')render();}
  function boss(){
    const wk=wkNow(),b=BOSSES[wk%BOSSES.length];
    const mem=G.members;let pw=0,dmg=0;
    mem.forEach(m=>{pw+=m.pw||0;if(m.wk===wk)dmg+=m.dmg||0;});
    const max=Math.max(2000,Math.round(pw*12));
    return {wk,name:b[0],f:b[1],max,dmg,hp:Math.max(0,max-dmg)};
  }
  async function create(name){
    name=name.trim();if(name.length<3)return toast('Name needs 3+ letters');
    await Acct.db.doc('guilds/'+Acct.id).set({name:name.slice(0,16),name_l:name.slice(0,16).toLowerCase(),owner:Acct.id,t:Date.now()});
    await myDoc().set(meBase({gid:Acct.id,wk:wkNow(),dmg:0,att:0,day:''}));
    toast('Guild created!');sfx('reward');
  }
  async function join(gid){await myDoc().set(meBase({gid,wk:wkNow(),dmg:0,att:0,day:''}));toast('Joined the guild!');sfx('reward');}
  async function leave(){
    const gid=G.gid,others=G.members.filter(m=>m.id!==Acct.id);
    await myDoc().delete();
    if(G.guild&&G.guild.owner===Acct.id){
      if(others.length)await Acct.db.doc('guilds/'+gid).update({owner:others[0].id});
      else await Acct.db.doc('guilds/'+gid).delete();
    }
  }
  async function attack(){
    const m=G.me,b=boss(),today=Acct.today();
    if(!m||b.hp<=0)return;
    const used=m.day===today?(m.att||0):0;if(used>=MAXATT)return toast('No attacks left today');
    const dmg=Math.round(totalPower()*(0.8+Math.random()*0.5)*(Math.random()<.15?2:1));
    const cur=m.wk===b.wk?(m.dmg||0):0;
    await myDoc().update({wk:b.wk,dmg:cur+dmg,day:today,att:used+1,pw:totalPower(),lvl:plv(),name:save.name||'Wiper',t:Date.now()});
    sfx('ult');shake(2);G.lastHit=dmg;
    const f=document.getElementById('gbHit');if(f){f.textContent='-'+comma(dmg);f.classList.remove('go');void f.offsetWidth;f.classList.add('go');}
  }
  async function claim(){
    const m=G.me,b=boss();if(!m||b.hp>0||m.claim===b.wk||m.wk!==b.wk||!(m.dmg>0))return;
    await myDoc().update({claim:b.wk});
    const out=give({gems:40,gold:5000,keys:{s:2}});showRewards('Guild boss defeated!',out,'Thanks for helping '+esc(G.guild&&G.guild.name));
  }
  async function doSearch(){
    try{
      const q=G.q.trim().toLowerCase();
      const col=Acct.db.collection('guilds');
      const s=q.length>=2?await col.where('name_l','>=',q).where('name_l','<',q+'').limit(10).get():await col.limit(10).get();
      G.res=s.docs.map(d=>Object.assign({id:d.id},d.data()));
      for(const g of G.res){try{const ms=await Acct.db.collection('gmembers').where('gid','==',g.id).get();g.n=ms.docs.length;}catch(e){g.n='?';}}
    }catch(e){G.res=[];}
    redraw();
  }
  function render(){
    const box=$('guild').querySelector('.scroll');
    if(!Acct.online){
      box.innerHTML='<div class="panel soon"><div class="soonic">'+ic('ui_guild','big')+'</div><div class="soont">Guild</div><div class="sub">Guilds need the signed-in online version. Open the game from its shared link while signed in to claude.ai, with Contributor access.</div></div>';return;
    }
    const keep=document.activeElement&&document.activeElement.id==='gSearch';
    box.innerHTML='';
    if(!G.gid){
      box.appendChild(el('div','sect','Create a guild'));
      const row=el('div');row.style.cssText='display:flex;gap:8px;margin-bottom:14px';
      const inp=el('input');inp.id='gName';inp.maxLength=16;inp.placeholder='Guild name';inp.autocomplete='off';
      inp.style.cssText='flex:1;min-width:0;padding:12px;background:#000;border:1px solid #5b4529;color:#f1e6c8;font-size:16px';
      const b=el('button','btn primary','Create');b.onclick=()=>create(inp.value).catch(()=>toast('Could not create'));row.append(inp,b);box.appendChild(row);
      box.appendChild(el('div','sect','Find a guild'));
      const s=el('input');s.id='gSearch';s.value=G.q;s.placeholder='Search by name (or leave empty)';s.autocomplete='off';
      s.style.cssText='width:100%;box-sizing:border-box;padding:12px;background:#000;border:1px solid #5b4529;color:#f1e6c8;font-size:16px;margin-bottom:8px';
      let tm;s.oninput=()=>{G.q=s.value;clearTimeout(tm);tm=setTimeout(doSearch,350);};box.appendChild(s);
      if(!G.res.length&&G.browse===null){G.browse=1;doSearch();}
      if(!G.res.length)box.appendChild(el('div','sub center','No guilds found yet. Create the first one!'));
      G.res.forEach(g=>{const r=el('div','srow','<span><b>'+esc(g.name)+'</b><br><small class="dim">'+(g.n||0)+' members</small></span>');r.style.marginBottom='6px';
        const j=el('button','btn sm primary','Join');j.onclick=()=>join(g.id).catch(()=>toast('Could not join'));r.appendChild(j);box.appendChild(r);});
      if(keep){const e=$('gSearch');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length);}}
      return;
    }
    const g=G.guild;if(!g){box.appendChild(el('div','sub center','Loading guild...'));return;}
    const b=boss(),today=Acct.today(),m=G.me||{};
    const left=MAXATT-(m.day===today?(m.att||0):0);
    box.appendChild(el('div','sect',esc(g.name)+' <small>'+G.members.length+' members</small>'));
    const bp=el('div','panel gboss');
    bp.innerHTML='<div class="gbn">Weekly boss</div><div class="gbname">'+esc(b.name)+'</div><div class="gbspr"><div id="gbSp"></div><span id="gbHit" class="gbhit"></span></div>'+
      '<div class="gbbar"><b style="width:'+Math.round(100*b.hp/b.max)+'%"></b></div><div class="sub center">'+comma(b.hp)+' / '+comma(b.max)+' HP</div>';
    box.appendChild(bp);
    spriteArt($('gbSp'),'boss',.9,true);const cv=$('gbSp').querySelector('canvas');if(cv)cv.style.filter=b.f;
    const act=el('div');act.style.cssText='display:flex;gap:8px;margin:10px 0';
    if(b.hp>0){const ab=el('button','btn primary wide','Attack ('+left+' left today)');ab.disabled=left<=0;ab.onclick=()=>{ab.disabled=true;attack().catch(()=>toast('Attack failed'));};act.appendChild(ab);}
    else{const cb=el('button','btn primary wide',m.claim===b.wk?'Reward claimed':'Claim reward');cb.disabled=m.claim===b.wk||m.wk!==b.wk||!(m.dmg>0);cb.onclick=()=>claim().catch(()=>toast('Claim failed'));act.appendChild(cb);}
    box.appendChild(act);
    box.appendChild(el('div','sub dim center','Your attack power = your 3 heroes’ total power. 3 attacks per day. A new boss arrives every week.'));
    box.appendChild(el('div','sect','Damage ranking'));
    const ms=G.members.slice().sort((a,c)=>((c.wk===b.wk?c.dmg:0)||0)-((a.wk===b.wk?a.dmg:0)||0));
    ms.forEach((x,i)=>{const d=x.wk===b.wk?(x.dmg||0):0;const r=el('div','srow','<span><b>'+(i+1)+'. '+esc(x.name)+'</b>'+(x.id===Acct.id?' <small class="dim">(you)</small>':'')+(g.owner===x.id?' <small class="gld">leader</small>':'')+'<br><small class="dim">Level '+(x.lvl||1)+'</small></span><b class="gld">'+comma(d)+'</b>');r.style.marginBottom='6px';box.appendChild(r);});
    const lv=el('button','btn sm','Leave guild');lv.style.marginTop='14px';
    lv.onclick=()=>{if(lv.dataset.s)leave().catch(()=>{});else{lv.dataset.s=1;lv.textContent='Tap again to leave';}};box.appendChild(lv);
  }
  DRAW.guild=function(){
    if(!Acct.online){render();Acct.ready.then(()=>{if(Acct.online&&curScreen==='guild'){listen();render();}});return;}
    if(!G.started){G.started=1;listen();}
    render();
  };
})();
