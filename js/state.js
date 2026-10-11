/* ================= state: the save and every rule that reads or changes it. No DOM: the balance simulator loads this file too. ================= */
const wlvOf=r=>Math.min(WEP_MAX,Math.max(1,(save.wlv&&save.wlv[r])||1));
const wepStat=(r,lv)=>{lv=lv||wlvOf(r);const b=WEP_BASE[HEROES[r].cls],p=Math.pow(ECON.itemGrowth,lv-1);return {hp:Math.round(b.hp*p),atk:Math.round(b.atk*p*10)/10};};
const isOwned=k=>!!(save.own[k]||save.digas);
// Flavio ('sup') left the game: his healer role is Rubens. Strip him from old/cloud saves (his gear goes back to the bag).
function purgeFlavio(d){
  if(d.own&&d.own.sup)d.own.rubens=1;
  if(Array.isArray(d.team)){d.team=d.team.map(k=>k==='sup'?'rubens':k).filter((k,i,a)=>HEROES[k]&&a.indexOf(k)===i);if(!d.team.length)d.team=['tank','dps','rubens'];}
  ['own','lv','eq','form','stars','shards'].forEach(f=>{if(d[f])delete d[f].sup;});
  if(Array.isArray(d.wish))d.wish=d.wish.filter(k=>HEROES[k]);
  return d;
}

/* ---------- save ---------- */
const DEF=()=>({ver:3,name:'',music:true,tut:{},gold:300,gems:0,keys:{b:0,s:0,g:0},cleared:0,last:Date.now(),skip:0,
  lv:Object.fromEntries(HIDS.map(k=>[k,1])),wlv:Object.fromEntries(HIDS.map(k=>[k,1])),items:[],eq:Object.fromEntries(HIDS.map(k=>[k,{}])),nid:1,xp:0,
  tasks:{day:'',p:{},c:{},m:{}},cal:{last:'',streak:0},auto:false,form:{tank:1,dps:4,rubens:5},team:['tank','dps','rubens'],tix:10,own:{tank:1,dps:1,rubens:1},stars:{},shards:{},gp:{n:0,t:0},wish:[],autoUlt:true,sound:true,lang:'en',sk:{},
  mail:[],mailInit:false,mid:1,shop:{day:'',n:0,bought:{},free:false},pity:{s:0,g:0,gl:0},quick:{day:'',n:0},
  chapDone:{},stats:{wins:0,opens:0,casts:0,fuses:0},ach:{},seen:{}});
let save=DEF(),fromVer=3;   // fromVer: the version of the save that was loaded (3 for a new game)
try{
  const s=JSON.parse(localStorage.getItem('wipewars')||'null');
  if(s){
    const d=DEF();
    for(const k in d){if(s[k]!==undefined)d[k]=(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))?Object.assign(d[k],s[k]):s[k];}
    if(s.xp===undefined)d.xp=40*(s.cleared||0);
    if(s.team===undefined)d.team=['tank','dps','rubens'];
    if(s.own===undefined)d.own={tank:1,dps:1,rubens:1};
    if(!s.ver){d.gems=0;} // v1 saves: keep everything, fresh premium currency
    purgeFlavio(d);
    save=d;fromVer=s.ver||1;
  }
}catch(e){}
save.ver=3;
function persist(){save.mod=Date.now();if(window.Acct)Acct.markDirty();try{localStorage.setItem('wipewars',JSON.stringify(save));}catch(e){}}

// Weapons are no longer items: old weapon items are scrapped into Chaos and weapon slots are cleared (one-time, safe to repeat).
function dropOldWeapons(){
  if(!Array.isArray(save.items))return;
  const old=save.items.filter(i=>i.type==='weapon');
  if(old.length){save.gold+=old.reduce((a,i)=>a+scrapVal(i),0);const ids=new Set(old.map(i=>i.id));save.items=save.items.filter(i=>!ids.has(i.id));}
  Object.values(save.eq||{}).forEach(e=>{delete e.weapon1;delete e.weapon2;});
  if(!save.wlv)save.wlv={};HIDS.forEach(k=>{if(!save.wlv[k])save.wlv[k]=1;});
}
dropOldWeapons();
const itemOf=id=>save.items.find(x=>x.id===id);
function equippedIds(){const s=new Set();Object.values(save.eq).forEach(e=>Object.values(e).forEach(id=>s.add(id)));return s;}
function newItem(tier,type,set,star){
  const it={id:save.nid++,type:type||TYPES[rnd(TYPES.length)],set:set===undefined?rnd(3):set,tier:tier||0,star:star||0};
  save.items.push(it);return it;
}
function stageDropTier(b){
  const r=Math.random()-(b||0),c=save.cleared;
  return r<ECON.dropRare[0]+c*ECON.dropRare[1]?2:r<ECON.dropMagic[0]+c*ECON.dropMagic[1]?1:0;
}
function dropItem(b){return newItem(stageDropTier(b));}

/* ---------- players, heroes ---------- */
function xpInfo(){let x=save.xp,l=1;while(x>=ECON.xpNeed(l)){x-=ECON.xpNeed(l);l++;}return {l,x,need:ECON.xpNeed(l)};}
const plv=()=>xpInfo().l;
function addXp(n){const b=plv();save.xp+=n;if(plv()>b)toast('Player level '+plv()+'!');}
function heroStats(r,hp,atk){
  hp=hp===undefined?HEROES[r].hp:hp;atk=atk===undefined?HEROES[r].atk:atk;
  const m=(1+0.15*(save.lv[r]-1))*(1+0.1*(save.stars[r]||0));let h=hp*m,a=atk*m;
  Object.values(save.eq[r]).forEach(id=>{const it=itemOf(id);if(it){const s=istat(it);h+=s.hp;a+=s.atk;}});
  const w=wepStat(r);h+=w.hp;a+=w.atk;
  const sk=skMods(r);h*=1+sk.hp;a*=1+sk.atk;
  return {hp:Math.round(h),atk:Math.round(a)};
}
const powerOf=r=>{const s=heroStats(r);return Math.round(s.hp/5+s.atk*4);};

/* ---------- rewards ---------- */
function give(r){
  const out={gold:0,gems:0,keys:{},items:[],xp:0};
  if(r.gold){save.gold+=r.gold;out.gold=r.gold;}
  if(r.gems){save.gems+=r.gems;out.gems=r.gems;}
  if(r.tix){save.tix+=r.tix;out.tix=r.tix;}
  if(r.keys)for(const k in r.keys){save.keys[k]+=r.keys[k];out.keys[k]=r.keys[k];}
  (r.tiers||[]).forEach(t=>out.items.push(newItem(t)));
  if(r.xp){addXp(r.xp);out.xp=r.xp;}
  persist();return out;
}

/* ---------- tasks / activity ---------- */
function dayFix(){
  const d=dayKey();
  if(save.tasks.day!==d){save.tasks={day:d,p:{},c:{},m:{}};}
  if(save.shop.day!==d){save.shop={day:d,n:0,bought:{},free:false};}
  if(save.quick.day!==d){save.quick={day:d,n:0};}
}
function prog(k,n){dayFix();save.tasks.p[k]=(save.tasks.p[k]||0)+(n||1);}
const actPts=()=>ECON.tasks.reduce((a,t)=>a+(save.tasks.c[t.id]?t.pts:0),0);
const taskDone=t=>(save.tasks.p[t.k]||0)>=t.t&&!save.tasks.c[t.id];
const achVal=s=>s==='cleared'?save.cleared:s==='plv'?plv():(save.stats[s]||0);
const achCan=a=>!save.ach[a.id]&&achVal(a.stat)>=a.t;
function badgeCounts(){
  dayFix();
  const tasks=ECON.achievements.filter(achCan).length+ECON.tasks.filter(taskDone).length+ECON.milestones.filter(m=>actPts()>=m.p&&!save.tasks.m[m.p]).length;
  const cal=calInfo().can?1:0;
  const mail=save.mail.filter(m=>!m.claimed).length;
  const shop=(!save.shop.free)?1:0;
  const heroes=save.team.filter(skCanSpend).length;
  return {tasks,cal,mail,shop,heroes};
}
function calInfo(){
  const c=save.cal,t=dayKey();
  if(c.last===t)return {can:false,i:(c.streak-1)%7+1};
  return {can:true,i:(c.last===yesterdayKey()?c.streak:0)%7};
}

/* ---------- mail ---------- */
function sendMail(title,body,rewards){save.mail.unshift({id:save.mid++,title,body,rewards,claimed:false,t:Date.now()});persist();}
if(!save.mailInit){
  sendMail('Thanks for testing','Early tester bonus - more is coming as the game grows.',{gold:1000,keys:{b:3}});
  sendMail('Welcome to Wipe Wars!','A little something to get your run started. Open chests in the shop, equip your heroes and push the campaign.',{gems:300,gold:5000,keys:{s:1}});
  save.mailInit=true;persist();
}
/* v3 rebalanced gear and monsters and added skill trees: a save from before that gets one thank-you mail, so losing gear power does not sting */
// Written without persist(): persist() stamps the save as just modified, and a stale device would then overwrite a newer cloud save (account.js cloudNewer).
if(fromVer<3&&save.cleared>0){save.mail.unshift({id:save.mid++,claimed:false,t:Date.now(),title:'The Great Rebalance',body:'Heroes now have skill trees, and gear and monsters were rebalanced. Every level you already earned is a skill point waiting to be spent. Here is something to get you going again.',rewards:{gems:300,tix:5,keys:{s:1}}});try{localStorage.setItem('wipewars',JSON.stringify(save));}catch(e){}}

/* ---------- team and formation ---------- */
function fixForm(){
  let t=(save.team||[]).filter((k,i,a)=>HEROES[k]&&isOwned(k)&&a.indexOf(k)===i).slice(0,MAXTEAM);if(!t.length)t=['tank'];
  save.team=t;const f=save.form||{},used=new Set();
  t.forEach(k=>{let s=f[k];if(!(s>=0&&s<6)||used.has(s))s=null;if(s!==null)used.add(s);f[k]=s;});
  t.forEach(k=>{if(f[k]===null){f[k]=formPref(k).find(x=>!used.has(x));used.add(f[k]);}});
  save.form=f;
}
fixForm();
/* heroes as createBattle (engine.js) wants them */
function heroSpecs(team,form){
  return team.map(r=>{const H=HEROES[r],st=heroStats(r),sk=skMods(r);return {kind:r,name:H.n,cls:H.cls,hp:st.hp,atk:st.atk,iv:H.iv,slot:form[r],rng:H.rng,heal:H.heal,mmax:ULT[r].mana,mods:sk,key:sk.key};});
}

/* ---------- economy rules (moved out of the screens so the simulator plays by the same ones) ---------- */
const rate=()=>Math.round(ECON.idleBase+ECON.idlePerStage*save.cleared);
function pending(){const m=Math.min(ECON.idleCapMin,(Date.now()+save.skip-save.last)/60000);return {m,g:Math.floor(m*rate())};}
function fuse(a,b){
  save.items=save.items.filter(x=>x!==a&&x!==b);
  const n={id:save.nid++,type:a.type,set:a.set,tier:a.tier,star:a.star+1};
  if(n.star>2){n.star=0;n.tier++;}
  save.items.push(n);prog('fuse');save.stats.fuses++;persist();return n;
}
function dealsFor(){
  const R=mulberry(hashStr(save.shop.day+':'+save.shop.n)),P=()=>TYPES[Math.floor(R()*TYPES.length)],S=()=>Math.floor(R()*3);
  const disc=()=>[.1,.2,.3,.4][Math.floor(R()*4)];
  const item=(tier,cur)=>{const d=disc(),base=cur==='gold'?ECON.itemGold[tier]:ECON.itemGems[tier];return {kind:'item',type:P(),set:S(),tier,cur,disc:d,price:Math.round(base*(1-d))};};
  const FR=mulberry(hashStr(save.shop.day+':free'));
  const free={kind:'item',free:true,type:TYPES[Math.floor(FR()*TYPES.length)],set:Math.floor(FR()*3),tier:1,cur:'gold',price:0,disc:1};
  const keyDeal=(new Date().getDate()%2)?{kind:'keys',keys:{b:5},cur:'gems',price:50,disc:.25}:{kind:'keys',keys:{s:1},cur:'gems',price:80,disc:.2};
  return [free,item(0,'gold'),item(1,'gold'),item(2,'gold'),item(2,'gems'),keyDeal];
}
function weighted(w){let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i;}return w.length-1;}
function rollChest(c){
  let tier=weighted(c.odds);
  if(c.pity){
    save.pity[c.id]++;
    if(c.pity.leg){save.pity.gl++;if(save.pity.gl>=c.pity.leg)tier=3;}
    if(tier<2&&save.pity[c.id]>=c.pity.rare)tier=2;
    if(tier>=2)save.pity[c.id]=0;
    if(tier===3&&c.pity.leg)save.pity.gl=0;
  }
  return tier;
}
const POOL=()=>HIDS.filter(k=>!HEROES[k].nopool);
const starsOf=k=>save.stars[k]||0,shardsOf=k=>save.shards[k]||0;
const starCost=k=>ECON.starCost[starsOf(k)];
function rollRar(){let r=Math.random(),a=0;for(let i=0;i<ECON.rarity.length;i++){a+=ECON.rarity[i].p;if(r<a)return i;}return 0;}
function wpick(list){const w=k=>save.wish.includes(k)?2:1;let t=list.reduce((a,k)=>a+w(k),0),r=Math.random()*t;for(const k of list){r-=w(k);if(r<0)return k;}return list[list.length-1];}
function pullOne(){
  const pool=POOL(),locked=pool.filter(k=>!save.own[k]);
  let id=wpick(pool);
  if(locked.length&&save.own[id]&&save.gp.n>=ECON.pityNew-1)id=wpick(locked);
  const isNew=!save.own[id],rar=rollRar();
  if(isNew){save.own[id]=1;save.gp.n=0;}else if(locked.length)save.gp.n++;
  save.gp.t++;
  const sh=ECON.rarity[rar].sh;save.shards[id]=shardsOf(id)+sh;
  return {id,rar,isNew,sh};
}

/* ---------- player actions: each returns false when it cannot be done ---------- */
const lvCost=r=>ECON.heroLvCost(save.lv[r]);
function levelUp(r){const c=lvCost(r);if(save.lv[r]>=plv()||save.gold<c)return false;save.gold-=c;save.lv[r]++;prog('lvl');persist();return true;}
function wepUp(r){const l=wlvOf(r),c=wepCost(l);if(l>=WEP_MAX||save.gold<c)return false;save.gold-=c;save.wlv[r]=l+1;persist();return true;}
function starUp(r){const c=starCost(r);if(!c||shardsOf(r)<c)return false;save.shards[r]-=c;save.stars[r]=starsOf(r)+1;persist();return true;}
/* gear score of an item for hero r: its level, with a bonus for the hero's own set */
const gearScore=(i,r)=>pwr(i)*(i.set===PREF[r]?1.5:1);
function equipBestTeam(){
  save.team.forEach(r=>save.eq[r]={});
  const used=equippedIds();
  SLOTS.forEach(s=>save.team.forEach(r=>{
    let best=null,bs=-1;
    save.items.forEach(i=>{if(i.type!==STYPE(s)||used.has(i.id))return;const sc=gearScore(i,r);if(sc>bs){bs=sc;best=i;}});
    if(best){used.add(best.id);save.eq[r][s]=best.id;}
  }));
  persist();
}
/* unequipped identical items, biggest first */
function stacks(){
  const used=equippedIds(),g={};
  save.items.filter(i=>!used.has(i.id)).forEach(i=>{const k=[i.type,i.set,i.tier,i.star].join('|');(g[k]=g[k]||[]).push(i);});
  return Object.values(g).sort((a,b)=>lvlOf(b[0])-lvlOf(a[0])||a[0].type.localeCompare(b[0].type));
}
/* fuses every pair it can; returns how many fusions happened */
function fuseEverything(){
  let n=0;
  for(let g=0;g<999;g++){const s=stacks().find(s=>s.length>=2&&lvlOf(s[0])<11);if(!s)break;fuse(s[0],s[1]);n++;}
  return n;
}
function claimIdle(){
  const p=pending();if(p.g<1)return null;
  const n=Math.min(ECON.chestMax,Math.floor(p.m/ECON.chestEveryMin)),tiers=[];for(let i=0;i<n;i++)tiers.push(stageDropTier());
  prog('claim');save.last=Date.now();save.skip=0;
  return {out:give({gold:p.g,tiers,xp:ECON.idleClaimXp}),m:p.m};
}
/* what winning stage n pays, already granted */
function stageWin(n){
  const first=n>save.cleared,boss=stageIn(n)===10;
  const r={gold:stageGold(n),tiers:[stageDropTier()]};
  if(boss)r.tiers.push(stageDropTier(.15));
  if(!first){r.xp=Math.max(1,Math.round(ECON.firstClearXp(n)*ECON.replayXp));r.gold=Math.round(r.gold*ECON.replayGold);}
  else{
    r.xp=ECON.firstClearXp(n);r.gems=boss?ECON.bossFirstClearGems:ECON.firstClearGems;r.tix=boss?ECON.bossFirstClearTix:ECON.firstClearTix;
    save.cleared=n;prog('new');
    if(boss){const c=chapOf(n);if(!save.chapDone[c]){save.chapDone[c]=1;sendMail('Chapter '+(c+1)+' complete!',ECON.chapters[c].n+' conquered. Here is your chapter reward.',{gems:ECON.chapterGems,keys:{s:1},tix:ECON.chapterTix});}}
  }
  prog('win');save.stats.wins++;
  return {out:give(r),first,boss};
}

/* share of k rehearsed battles the current team wins on stage n, fought the way the player has the game set (auto ultimates on or off).
   Fixed seeds: the same team always gets the same answer. */
function winChance(n,k){
  k=k||20;let w=0;const hs=()=>heroSpecs(save.team,save.form),ms=()=>monSpecs(stageList(n),n);
  for(let i=0;i<k;i++)if(runBattle(hs(),ms(),{seed:i*7919+n,auto:!!save.autoUlt,inv:!!(save.digas&&save.dgInv),oneHit:!!(save.digas&&save.dgKill),freeMana:!!(save.digas&&save.dgMana)}).win)w++;
  return w/k;
}
