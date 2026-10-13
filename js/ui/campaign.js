/* ---------- campaign ---------- */
DRAW.campaign=function(){
  const box=$('campBody');box.innerHTML='';let curEl=null;
  ECON.chapters.forEach((c,ci)=>{
    const first=ci*ECON.stagesPerChapter+1,last=first+ECON.stagesPerChapter-1;
    const unlocked=first<=save.cleared+1,done=Math.max(0,Math.min(ECON.stagesPerChapter,save.cleared-first+1));
    const p=el('div','panel chap'+(unlocked?'':' locked'));
    p.innerHTML='<div class="chead"><div class="cart" style="background-image:url('+BGCH[ci]+')"></div><div class="ctx"><small>Chapter '+(ci+1)+'</small><b>'+c.n+'</b><span>'+c.sub+'</span></div><div class="cprog">'+(unlocked?done+' / '+ECON.stagesPerChapter:ic('ui_lock'))+'</div></div>';
    const g=el('div','nodes');
    for(let n=first;n<=last;n++){
      const st=n<=save.cleared?'done':n===save.cleared+1?'cur':'lock',boss=n===last;
      const b=el('button','node '+st+(boss?' boss':''),(st==='done'?ic('ui_check','s'):st==='lock'?ic('ui_lock','s'):'')+'<span>'+(boss?'BOSS':stageIn(n))+'</span>');
      b.disabled=st==='lock';b.onclick=()=>openPrep(n);g.appendChild(b);
      if(st==='cur')curEl=b;
    }
    p.appendChild(g);
    const foot=el('div','cfoot');
    foot.innerHTML=unlocked?'<small>Chapter reward</small>'+chips({gems:ECON.chapterGems,keys:{s:1}})+(save.chapDone[ci]?'<span class="got">Claimed</span>':''):'<small>Clear the previous chapter to unlock</small>';
    p.appendChild(foot);box.appendChild(p);
  });
  box.appendChild(el('div','sub dim center','More chapters coming soon'));
  setTimeout(()=>{if(curEl)curEl.scrollIntoView({block:'center'});},30);
};

