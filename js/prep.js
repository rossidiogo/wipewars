/* ================= prep: pick the team and its formation before a stage ================= */
let pendingStage=1,selSlot=null;
function heroAtSlot(s){return save.team.find(k=>save.form[k]===s);}
function openPrep(n){pendingStage=n;selSlot=null;openScreen('prep');}
function drawPrep(){
  fixForm();const n=pendingStage,g=$('prepGrid');g.innerHTML='';
  $('prepTitle').innerHTML='<small>Chapter '+(chapOf(n)+1)+' &middot; '+ECON.chapters[chapOf(n)].n+'</small><b>Stage '+stageLabel(n)+(stageIn(n)===10?' &middot; Boss':'')+'</b>';
  [['Back row',1],['Front row',0]].forEach(([lab,row])=>{
    const c=el('div','pcol');c.appendChild(el('div','pl',lab));
    for(let lane=0;lane<3;lane++){
      const s=row*3+lane,k=heroAtSlot(s),b=el('button','pcell'+(selSlot===s?' sel':''));
      if(k){const sp=el('div');spriteArt(sp,k,.62,true);b.appendChild(sp);b.appendChild(el('div','pn',HEROES[k].n));}
      else b.innerHTML='<div class="pe">empty</div>';
      b.onclick=()=>prepTap(s);c.appendChild(b);
    }
    g.appendChild(c);
  });
  drawRoster();
  const cnt={};stageList(n).forEach(k=>cnt[k]=(cnt[k]||0)+1);
  $('prepEnemies').innerHTML=Object.keys(cnt).map(k=>'<div class="erow"><span style="color:'+RC[KINDS[k].r]+'">'+cnt[k]+'&times; '+KINDS[k].n+'</span><small>'+RN[KINDS[k].r]+'</small></div>').join('');
  drawOdds(n);
  const first=n>save.cleared;
  let rw={gold:stageGold(n)};if(first){rw.gems=stageIn(n)===10?ECON.bossFirstClearGems:ECON.firstClearGems;rw.tix=stageIn(n)===10?ECON.bossFirstClearTix:ECON.firstClearTix;rw.xp=ECON.firstClearXp(n);}
  $('prepRewards').innerHTML=chips(rw)+'<span class="chip">'+ic('item_sword_0')+'<b>'+(stageIn(n)===10?'2 drops':'1 drop')+'</b></span>';
  $('prepRwLabel').textContent=first?'Rewards (first clear bonus included)':'Rewards';
  $('prepHint').textContent=selSlot===null?'Tap a hero, then tap a spot to move or swap.':'Now tap the spot to move to (tap the same hero to cancel).';
}
/* scouting report: the engine rehearses the fight with the current team and formation */
const ODDS=[[.9,'Should be a clean win','good'],[.6,'You have the edge','good'],[.3,'Could go either way','even'],[.05,'A long shot','bad'],[-1,'Hopeless for now. Level up, upgrade gear or spend skill points.','bad']];
function drawOdds(n){
  const w=winChance(n),o=ODDS.find(x=>w>=x[0]);
  $('prepOdds').className='scout '+o[2];
  $('prepOdds').innerHTML='<div class="sch"><span>Scouting report</span><b>Win chance '+Math.round(w*100)+'%</b></div><div class="scb"><i style="width:'+Math.max(3,w*100)+'%"></i></div><div class="sub">'+o[1]+'</div>';
}
function prepTap(s){
  const k=heroAtSlot(s);
  if(selSlot===null){if(k)selSlot=s;}
  else if(selSlot===s)selSlot=null;
  else{const a=heroAtSlot(selSlot);if(a)save.form[a]=s;if(k)save.form[k]=selSlot;selSlot=null;persist();}
  drawPrep();
}
function drawRoster(){
  const box=$('prepRoster');if(!box)return;box.innerHTML='';
  $('prepTeamN').textContent=save.team.length+' / '+MAXTEAM;
  [['Tank','Tanks'],['Ranged DPS','Ranged'],['Melee DPS','Melee'],['Support','Support']].forEach(([sub,lab])=>{
    const row=el('div','rrow');row.appendChild(el('div','rlab',lab));const cs=el('div','rchips');
    HIDS.filter(k=>HEROES[k].sub===sub&&(!HEROES[k].nopool||isOwned(k))).forEach(k=>{
      const on=save.team.includes(k),own=isOwned(k),b=el('button','rchip'+(on?' on':'')+(own?'':' locked'));
      const sp=el('div','rsp');spriteArt(sp,k,.42,true);b.appendChild(sp);b.appendChild(el('div','rn',HEROES[k].n));
      b.onclick=()=>toggleTeam(k);cs.appendChild(b);
    });
    row.appendChild(cs);box.appendChild(row);
  });
}
function toggleTeam(k){
  if(!isOwned(k)){toast('Not recruited yet. Try the Recruit screen!');return;}
  const t=save.team.slice(),i=t.indexOf(k);
  if(i>=0){if(t.length<=1){toast('You need at least one hero');return;}t.splice(i,1);}
  else{if(t.length>=MAXTEAM){toast('Team is full ('+MAXTEAM+'). Remove a hero first.');return;}t.push(k);}
  save.team=t;selSlot=null;fixForm();persist();drawPrep();if(window.rebuildBgH)rebuildBgH();
}
$('prepGo').onclick=()=>startStage(pendingStage);
$('prepBack').onclick=()=>openScreen('campaign');
