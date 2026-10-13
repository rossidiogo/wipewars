/* A simulated player. Runs inside the game's own global scope (see load.mjs), so it plays by the real rules:
   every reward, cost and battle below goes through the same functions the screens call. */
const SIM={battleOverhead:8,speed:2,retries:2};

function simNew(){
  save=DEF();save.name='Sim';save.mailInit=true;save.last=Date.now();
  sendMail('a','b',{gold:1000,keys:{b:3}});sendMail('a','b',{gems:300,gold:5000,keys:{s:1}});
  fixForm();
}
/* the strongest legal team: one tank, one support, the two best of the rest */
function simTeam(){
  const own=HIDS.filter(isOwned),by=c=>own.filter(k=>HEROES[k].cls===c).sort((a,b)=>powerOf(b)-powerOf(a));
  const t=[];const tk=by('tank')[0],sp=own.filter(k=>HEROES[k].heal)[0]||by('sup')[0];
  if(tk)t.push(tk);if(sp)t.push(sp);
  own.filter(k=>!t.includes(k)).sort((a,b)=>(HEROES[b].cls==='dps')-(HEROES[a].cls==='dps')||powerOf(b)-powerOf(a)).forEach(k=>{if(t.length<MAXTEAM)t.push(k);});
  if(t.join()!==save.team.join()){save.team=t;save.form={};fixForm();}
}
function simChests(){
  ECON.chests.forEach(c=>{while(save.keys[c.key]>0){save.keys[c.key]--;give({tiers:[rollChest(c)]});save.stats.opens++;prog('chest');}});
}
/* spends everything the way an attentive player would */
function simSpend(){
  save.mail.filter(m=>!m.claimed).forEach(m=>{m.claimed=true;give(m.rewards);});
  ECON.achievements.filter(achCan).forEach(a=>{save.ach[a.id]=1;give(a.r);});
  // Divine: tickets while there are friends to find, silver chests after
  for(let g=0;g<200;g++){
    if(POOL().some(k=>!save.own[k])){if(save.gems<ECON.ticketGems)break;save.gems-=ECON.ticketGems;save.tix++;}
    else{const c=ECON.chests[1];if(save.gems<c.gems)break;save.gems-=c.gems;give({tiers:[rollChest(c)]});save.stats.opens++;prog('chest');}
  }
  while(save.tix>0){save.tix--;pullOne();}
  simChests();
  HIDS.filter(isOwned).forEach(r=>{while(starUp(r));});
  fuseEverything();simTeam();equipBestTeam();
  // Chaos: always the cheapest upgrade among the team's levels and weapons
  for(let g=0;g<2000;g++){
    const opts=[];
    save.team.forEach(r=>{if(save.lv[r]<plv())opts.push([lvCost(r),()=>levelUp(r)]);if(wlvOf(r)<WEP_MAX)opts.push([wepCost(wlvOf(r)),()=>wepUp(r)]);});
    opts.sort((a,b)=>a[0]-b[0]);
    if(!opts.length||opts[0][0]>save.gold)break;opts[0][1]();
  }
  // spare Chaos once levels are capped: bronze chests
  const b=ECON.chests[0];
  while(save.team.every(r=>save.lv[r]>=plv())&&save.gold>=b.gold*4){save.gold-=b.gold;give({tiers:[rollChest(b)]});save.stats.opens++;prog('chest');}
  fuseEverything();equipBestTeam();
  save.team.forEach(skAuto);
}
function simDaily(){
  dayFix();
  const c=calInfo();if(c.can){const k=save.cal;k.streak=(k.last===yesterdayKey()?k.streak:0)+1;k.last=dayKey();give(Object.assign({xp:10},ECON.calendar[c.i]));}
  if(!save.shop.free){save.shop.free=true;prog('shop');newItem(1);}
  if(save.quick.n===0){save.quick.n=1;give({gold:Math.round(rate()*ECON.quickIdleMin),tiers:[stageDropTier()]});}
}
function simTasks(){
  dayFix();
  ECON.tasks.filter(taskDone).forEach(t=>{save.tasks.c[t.id]=1;give({gold:t.g,xp:t.x});});
  ECON.milestones.forEach(m=>{if(actPts()>=m.p&&!save.tasks.m[m.p]){save.tasks.m[m.p]=1;give(m.r);}});
}
/* one battle on stage n; returns {win, secs of real time it took} */
function simFight(n){
  const B=runBattle(heroSpecs(save.team,save.form),monSpecs(stageList(n),n),{seed:Math.floor(Math.random()*4294967296)});
  const casts=B.units.reduce((a,u)=>a+u.st.casts,0);save.stats.casts+=casts;prog('ult',casts);
  if(B.win)stageWin(n);
  return {win:B.win,secs:B.t/SIM.speed+SIM.battleOverhead,t:B.t};
}
/* a farm stage the team cannot lose: used only if the top cleared stage became unwinnable after a team change */
function simFightSafe(){for(let n=save.cleared;n>=1;n--){if(simFight(n).win)return;}}
/* one sitting of `minutes`; returns seconds actually played */
function simSession(minutes){
  let left=minutes*60,fails=0;
  claimIdle();simDaily();simSpend();
  while(left>0){
    const next=save.cleared+1;
    if(next<=MAXSTAGE&&fails<=SIM.retries){
      const r=simFight(next);left-=r.secs;
      if(r.win){fails=0;simSpend();}else fails++;
    }else if(save.cleared>=MAXSTAGE)break;
    else if(save.cleared>0){
      // stuck: farm the best cleared stage, and try the wall again whenever the loot made the team stronger
      const before=save.team.reduce((a,r)=>a+powerOf(r),0);
      const r=simFight(save.cleared);left-=r.secs;if(!r.win){simFightSafe();left-=30;}
      simSpend();
      if(save.team.reduce((a,r)=>a+powerOf(r),0)>before*1.03)fails=0;
    }else break;
  }
  simTasks();simSpend();
  return minutes*60-Math.max(0,left);
}
