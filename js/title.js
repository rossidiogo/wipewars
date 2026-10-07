/* ================= title / login ================= */
(function(){
  const T=$('title');if(!T)return;
  const skip=/skiptitle/.test(location.search);
  const nm=()=>(save.name||'').trim();
  function applyName(){const n=nm()||'Wiper';const e=document.querySelector('.pname');if(e)e.textContent=n;}
  window.applyName=applyName;
  function enter(){
    T.classList.add('out');sfx('reward');
    if(window.Music)Music.start();
    setTimeout(()=>{T.style.display='none';if(typeof maybeTutorial==='function')maybeTutorial();},650);
    applyName();
  }
  function build(){
    const first=!nm();
    T.innerHTML='<div class="tbg"></div><div class="tshade"></div><div class="tstars"></div>'+
      '<img class="tlogo" src="'+LOGO+'" alt="Wipe Wars"><div class="ttag">Idle Auto-Battler</div>'+
      '<div class="theroes" id="tHeroes"></div><div class="tpanel" id="tPanel"></div><div class="tver">Prototype v20</div>';
    const H=$('tHeroes');
    [['tank',1.05],['dps',1.05],['rubens',1.05],['clorox',.62]].forEach(([k,m],i)=>{
      const d=el('div','tu t'+i);const sp=el('div');spriteArt(sp,k,m,true);d.appendChild(sp);H.appendChild(d);
    });
    const P=$('tPanel');
    if(first){
      P.innerHTML='<div class="tt">Welcome, Wiper!</div><div class="ts">What should we call you?</div><input id="tName" type="text" maxlength="14" autocomplete="off" spellcheck="false" placeholder="Your name"><button class="btn primary wide bigbtn" id="tGo" disabled><span>Begin</span></button>';
      const inp=$('tName'),go=$('tGo');
      inp.oninput=()=>{go.disabled=inp.value.trim().length<2;};
      const start=()=>{const v=inp.value.trim();if(v.length<2)return;save.name=v.slice(0,14);persist();enter();};
      go.onclick=start;inp.onkeydown=e=>{if(e.key==='Enter')start();};
    }else{
      P.innerHTML='<div class="ts">Welcome back</div><div class="tt big">'+nm().replace(/[<>&]/g,'')+'</div><div class="ts">Level '+plv()+' &middot; Stage '+stageLabel(Math.min(save.cleared+1,MAXSTAGE))+'</div><button class="btn primary wide bigbtn" id="tGo"><span>Continue</span></button><button class="tlink" id="tNew">New game</button>';
      $('tGo').onclick=enter;
      const nb=$('tNew');nb.onclick=()=>{if(nb.dataset.s){try{localStorage.removeItem('wipewars');}catch(e){}location.reload();}else{nb.dataset.s=1;nb.textContent='Tap again to erase everything';}};
    }
  }
  if(skip){T.style.display='none';applyName();return;}
  build();applyName();
  Acct.ready.then(()=>{
    const P=$('tPanel');if(!P)return;
    const st=el('div','tacc');
    if(!Acct.online||Acct.mock){st.textContent='Offline guest \u00b7 progress saved on this device only';P.appendChild(st);return;}
    st.textContent='Signed in with claude.ai \u00b7 cloud save on';P.appendChild(st);
    if(Acct.cloud&&(!nm()||Acct.cloudNewer())){if(Acct.applyCloud()){build();applyName();$('tPanel').appendChild(st);}}
    Acct.markDirty();Acct.pushNow();
  });
})();
