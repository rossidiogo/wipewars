/* ================= core: helpers, config, save ================= */
const $=id=>document.getElementById(id);
const rnd=n=>Math.floor(Math.random()*n);
const pick1=a=>a[rnd(a.length)];
const comma=n=>Math.floor(n).toLocaleString(typeof LANG!=='undefined'&&LANG==='pt'?'pt-BR':'en-US');
const fmt=n=>{n=Math.floor(n);if(n>=1e7)return Math.floor(n/1e6)+'M';if(n>=1e6)return (n/1e6).toFixed(1)+'M';if(n>=1e5)return Math.floor(n/1e3)+'K';return comma(n);};
const ic=(n,c)=>'<img class="ic '+(c||'')+'" src="'+ICO[n==='gems'?'gem':n]+'" alt="">';
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
const dayKey=()=>new Date().toDateString();
const yesterdayKey=()=>new Date(Date.now()-864e5).toDateString();

/* ---------- ONE place for every number that affects the economy ---------- */
const ECON={
  idleCapMin:480,                       // idle storage cap (8h)
  idleBase:2, idlePerStage:0.9,         // gold / minute = base + perStage * stages cleared
  chestEveryMin:120, chestMax:4,        // 1 idle item per 2h, up to 4
  heroLvCost:lv=>Math.round(40*Math.pow(lv,1.6)/5)*5,
  xpNeed:l=>40*l,
  itemGrowth:1.7,                       // stat multiplier per item level
  scrap:lvl=>Math.round(15*Math.pow(1.75,lvl)),
  stageGoldKinds:{0:10,2:25,3:60},      // gold per monster rarity (x stage number)
  firstClearGems:10, bossFirstClearGems:50, chapterGems:100,
  firstClearTix:1, bossFirstClearTix:3, chapterTix:5,   // recruit tickets
  ticketGems:60,                        // gem price of one recruit ticket
  pityNew:10,                           // a NEW friend is guaranteed within this many pulls
  starCost:[10,20,40,80,150],           // shards per star
  rarity:[{n:'Common',p:.60,sh:2,c:'#d8d4c8'},{n:'Rare',p:.28,sh:6,c:'#8c8cff'},{n:'Epic',p:.10,sh:15,c:'#ff8aff'},{n:'Legendary',p:.02,sh:40,c:'#ffe96a'}],
  firstClearXp:n=>50+3*n,
  replayXp:.12,                         // replaying a cleared stage gives this share of its first-clear XP
  monsterGrowth:1.035,                  // extra compounding monster stat growth per stage (keeps gear relevant)
  goldPerGem:30,                        // gold bundle price = gold / goldPerGem (min 10 gems)
  chests:[
    {id:'b',name:'Bronze Chest',blurb:'Common loot, great for fusing.',odds:[89,10,1,0],gold:500,gems:0,key:'b',pity:null},
    {id:'s',name:'Silver Chest',blurb:'Rare or better guaranteed every 10 opens.',odds:[55,35,9.5,.5],gold:0,gems:100,key:'s',pity:{rare:10}},
    {id:'g',name:'Gold Chest',blurb:'Rare every 10 opens, Legendary guaranteed every 40.',odds:[25,45,27,3],gold:0,gems:280,key:'g',pity:{rare:10,leg:40}}
  ],
  multiDiscount:.9,                     // x10 opens cost 9x
  itemGold:[200,700,2500,9000],         // base gold price of an item by tier (shop)
  itemGems:[8,25,80,300],
  refreshCost:[10,20,30,40,50],
  quickIdleMin:120, quickIdleCost:[0,30,50,70,90,110],
  bundleHours:[2,8,24],                 // hours of idle gold sold as bundles
  gemPacks:[['Handful of Divine Orbs',60,'$0.99'],['Pouch of Divine Orbs',330,'$4.99'],['Sack of Divine Orbs',700,'$9.99'],['Chest of Divine Orbs',1500,'$19.99'],['Vault of Divine Orbs',4000,'$49.99']],
  calendar:[{gold:300},{gold:500,tix:1},{gems:20},{gold:800,keys:{b:1},tix:1},{gems:30},{gold:1500,keys:{b:2},tix:1},{gems:50,keys:{s:1},tiers:[2],tix:2}],
  tasks:[
    {id:'claim',k:'claim',n:'Claim idle rewards',t:1,pts:10,g:100,x:15},
    {id:'win3',k:'win',n:'Win 3 battles',t:3,pts:15,g:150,x:25},
    {id:'win10',k:'win',n:'Win 10 battles',t:10,pts:20,g:400,x:50},
    {id:'new',k:'new',n:'Clear a new stage',t:1,pts:10,g:200,x:30},
    {id:'lvl',k:'lvl',n:'Level up a hero',t:1,pts:10,g:100,x:20},
    {id:'fuse',k:'fuse',n:'Fuse an item',t:1,pts:10,g:100,x:20},
    {id:'chest',k:'chest',n:'Open a chest',t:1,pts:10,g:100,x:20},
    {id:'shop',k:'shop',n:'Claim the free daily gift',t:1,pts:5,g:50,x:10},
    {id:'ult',k:'ult',n:'Cast 5 ultimates',t:5,pts:10,g:150,x:20}
  ],
  milestones:[{p:20,r:{gold:500}},{p:40,r:{gems:15,tix:1}},{p:60,r:{keys:{b:2}}},{p:80,r:{gems:25,tix:1}},{p:100,r:{gems:30,keys:{s:1},tix:2}}],
  chapters:[
    {n:'The Bathroom',sub:'Where it all began',f:'none'},
    {n:'The Deep Freeze',sub:'Everything is frozen. Even the condoms.',f:'hue-rotate(150deg) saturate(1.3)'},
    {n:'The Workshop',sub:'Sawdust, sparks and sandpaper',f:'sepia(.8) hue-rotate(-10deg) saturate(1.6)'},
    {n:'The Car Ride',sub:'Never put the box on your lap',f:'hue-rotate(210deg) saturate(1.2) brightness(.92)'},
    {n:'The Basement',sub:'Something is growing down here',f:'hue-rotate(275deg) saturate(1.1) brightness(.75)'}
  ],
  achievements:[
    {id:'w10',n:'Warm-up',d:'Win 10 battles',stat:'wins',t:10,r:{gems:20}},
    {id:'w50',n:'Wipe Enthusiast',d:'Win 50 battles',stat:'wins',t:50,r:{gems:40,gold:2000}},
    {id:'w200',n:'Serial Wiper',d:'Win 200 battles',stat:'wins',t:200,r:{gems:80,keys:{s:1}}},
    {id:'w1000',n:'Wipe Legend',d:'Win 1,000 battles',stat:'wins',t:1000,r:{gems:200,keys:{g:1}}},
    {id:'o10',n:'Treasure Hunter',d:'Open 10 chests',stat:'opens',t:10,r:{gems:20}},
    {id:'o100',n:'Chest Goblin',d:'Open 100 chests',stat:'opens',t:100,r:{gems:60,keys:{b:5}}},
    {id:'f10',n:'Blacksmith',d:'Fuse 10 times',stat:'fuses',t:10,r:{gems:20}},
    {id:'f100',n:'Master Smith',d:'Fuse 100 times',stat:'fuses',t:100,r:{gems:60,keys:{s:1}}},
    {id:'u25',n:'Spell Slinger',d:'Cast 25 ultimates',stat:'casts',t:25,r:{gems:20}},
    {id:'u250',n:'Ultimate Fan',d:'Cast 250 ultimates',stat:'casts',t:250,r:{gems:60,keys:{b:5}}},
    {id:'s10',n:'Chapter 1 Cleared',d:'Clear stage 10',stat:'cleared',t:10,r:{gems:30,keys:{s:1}}},
    {id:'s20',n:'Halfway There',d:'Clear stage 20',stat:'cleared',t:20,r:{gems:50}},
    {id:'s30',n:'Deep Cleaner',d:'Clear stage 30',stat:'cleared',t:30,r:{gems:80,keys:{s:1}}},
    {id:'s40',n:'Backseat Survivor',d:'Clear stage 40',stat:'cleared',t:40,r:{gems:120,keys:{s:2}}},
    {id:'s50',n:'Campaign Complete',d:'Clear stage 50',stat:'cleared',t:50,r:{gems:200,keys:{g:1}}},
    {id:'p5',n:'Rising Star',d:'Reach player level 5',stat:'plv',t:5,r:{gems:20}},
    {id:'p15',n:'Veteran',d:'Reach player level 15',stat:'plv',t:15,r:{gems:60}},
    {id:'p30',n:'Elite',d:'Reach player level 30',stat:'plv',t:30,r:{gems:150,keys:{g:1}}}
  ],
  stagesPerChapter:10
};
const MAXSTAGE=ECON.chapters.length*ECON.stagesPerChapter;
const chapOf=n=>Math.floor((n-1)/ECON.stagesPerChapter);
const stageIn=n=>(n-1)%ECON.stagesPerChapter+1;
const stageLabel=n=>(chapOf(n)+1)+'-'+stageIn(n);

const HEROES={
  tank:{n:'Jack',role:'Cowboy Tank',sub:'Tank',cls:'tank',hp:220,atk:12,iv:1.2},
  rafinha:{n:'Rafinha',role:'Energy Drink Tank',sub:'Tank',cls:'tank',hp:300,atk:9,iv:1.3,sc:1.12},
  lucao:{n:'Lucão',role:'Fisherman Tank',sub:'Tank',cls:'tank',hp:210,atk:13,iv:1.2,sc:1.05},
  dps:{n:'Daniel',role:'Bird Summoner',sub:'Ranged DPS',cls:'dps',rng:1,hp:100,atk:30,iv:1.0},
  chavoso:{n:'Chavoso',role:'Deadeye Archer',sub:'Ranged DPS',cls:'dps',rng:1,hp:90,atk:26,iv:.85},
  copello:{n:'Copello',role:'Mango Sharpshooter',sub:'Ranged DPS',cls:'dps',rng:1,hp:95,atk:33,iv:1.15},
  glem:{n:'Glem',role:'Tiger Druid',sub:'Melee DPS',cls:'dps',hp:175,atk:20,iv:1.1},
  malaguti:{n:'Malaguti',role:'Street Fighter',sub:'Melee DPS',cls:'dps',hp:130,atk:26,iv:.9},
  samuel:{n:'Samuel',role:'Hacker Assassin',sub:'Melee DPS',cls:'dps',hp:80,atk:36,iv:.8},
  rubens:{n:'Rubens',role:'Smoke Medic',sub:'Support',cls:'sup',heal:1,hp:120,atk:14,iv:1.4},
  ze:{n:'Zé',role:'Fanfarra Drummer',sub:'Support',cls:'sup',hp:130,atk:12,iv:1.3},
  donnie:{n:'Donnie',role:'Curse Shaman',sub:'Support',cls:'sup',rng:1,hp:110,atk:16,iv:1.3}
};
const ULT={
  tank:{n:'Hold the Line',mana:40,d:'Gain a shield worth 40% of max health.'},
  rafinha:{n:'Energy Overload',mana:50,d:'Drinks a can: grows huge, heals 30%, gains a 30% shield and +60% attack for 8s.'},
  lucao:{n:'Big Catch',mana:50,d:'Reels in a huge fish and spins like a top, whipping it into every enemy 4 times for 1x attack each, and gains a shield worth 15% of max health.'},
  dps:{n:'Summon Cockatiel',mana:80,d:'His cockatiel dives in for 5x attack damage to one enemy.'},
  chavoso:{n:'Deadeye Volley',mana:70,d:'Fires 4 arrows at random enemies for 1.7x attack each.'},
  copello:{n:'Mango Barrage',mana:80,d:'Hurls a mango for 4.5x damage to one enemy, splashing 1.2x on the rest.'},
  glem:{n:'Tiger Form',mana:60,d:'Turns into a huge tiger for 10s: +80% attack, takes 25% less damage, heals 15%.'},
  malaguti:{n:'Combo Breaker',mana:60,d:'A 6-hit combo on one enemy; the finisher hits for 2.2x.'},
  samuel:{n:'Root Access',mana:70,d:'Freezes every enemy for 3s and deals 5.5x damage to the weakest in the back.'},
  rubens:{n:'Smoke Session',mana:60,d:'A cloud of smoke heals every ally for a large amount.'},
  ze:{n:'Fanfarra!',mana:60,d:'Drums rally the team: +35% attack and +25% speed for 10s. Passive: allies hit 8% harder.'},
  donnie:{n:'Hex of Ruin',mana:60,d:'Curses all enemies for 10s: -35% attack and +25% damage taken. Passive: his hits curse (+12% damage taken).'}
};
const HIDS=Object.keys(HEROES);
const MAXTEAM=4;
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
const DEF=()=>({ver:2,name:'',music:true,tut:{},gold:300,gems:0,keys:{b:0,s:0,g:0},cleared:0,last:Date.now(),skip:0,
  lv:Object.fromEntries(HIDS.map(k=>[k,1])),items:[],eq:Object.fromEntries(HIDS.map(k=>[k,{}])),nid:1,xp:0,
  tasks:{day:'',p:{},c:{},m:{}},cal:{last:'',streak:0},auto:false,form:{tank:1,dps:4,rubens:5},team:['tank','dps','rubens'],tix:10,own:{tank:1,dps:1,rubens:1},stars:{},shards:{},gp:{n:0,t:0},wish:[],autoUlt:false,sound:true,
  mail:[],mailInit:false,mid:1,shop:{day:'',n:0,bought:{},free:false},pity:{s:0,g:0,gl:0},quick:{day:'',n:0},
  chapDone:{},stats:{wins:0,opens:0,casts:0,fuses:0},ach:{},seen:{}});
let save=DEF();
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
    save=d;
  }
}catch(e){}
save.ver=2;
function persist(){save.mod=Date.now();if(window.Acct)Acct.markDirty();try{localStorage.setItem('wipewars',JSON.stringify(save));}catch(e){}}

/* ---------- tiny synth sound effects (no audio files needed) ---------- */
let AC=null,lastSfx={};
function tone(f,d,type,vol,when,slide){
  const t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,slide),t+d);
  g.gain.setValueAtTime(vol||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);
}
function sfx(n){
  if(!save.sound)return;
  try{
    if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();}
    if(AC.state==='suspended')AC.resume();
    const now=performance.now();if(lastSfx[n]&&now-lastSfx[n]<(n==='hit'?70:30))return;lastSfx[n]=now;
    if(n==='click')tone(520,.06,'triangle',.05);
    else if(n==='hit')tone(160,.09,'square',.035,0,60);
    else if(n==='coin'){tone(988,.08,'square',.04);tone(1319,.14,'square',.04,.07);}
    else if(n==='reward'){[523,659,784,1047].forEach((f,i)=>tone(f,.16,'triangle',.06,i*.07));}
    else if(n==='ult'){tone(220,.35,'sawtooth',.05,0,880);}
    else if(n==='win'){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',.07,i*.1));}
    else if(n==='lose'){[392,330,262,196].forEach((f,i)=>tone(f,.28,'sawtooth',.045,i*.14));}
    else if(n==='err')tone(130,.15,'square',.05);
  }catch(e){}
}
document.addEventListener('click',e=>{if(e.target.closest('.btn:not(:disabled),.rb,.nb,.tab,.node:not(:disabled),.tw,.mile,.pcell,.htab,.pill'))sfx('click');},true);

/* ---------- toast + modal ---------- */
let tt;
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1700);}
function openModal(node,opts){
  opts=opts||{};const m=$('modal'),box=$('mbox');box.innerHTML='';box.className='panel '+(opts.cls||'');
  if(opts.title){const h=el('div','mhead');h.appendChild(el('div','mtitle',opts.title));const x=el('button','xbtn','&times;');x.onclick=closeModal;h.appendChild(x);box.appendChild(h);}
  const body=el('div','mbody');if(typeof node==='string')body.innerHTML=node;else body.appendChild(node);box.appendChild(body);
  m.classList.add('on');m._close=opts.onClose||null;return body;
}
function closeModal(){const m=$('modal');m.classList.remove('on');const f=m._close;m._close=null;if(f)f();}
$('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});

/* ---------- items ---------- */
const SLOTS=['helm','armor','gloves','boots','weapon1','weapon2'];
const STYPE=s=>s.startsWith('weapon')?'weapon':s;
const TYPES=['helm','armor','gloves','boots','weapon'];
const LABEL={helm:'Helm',armor:'Armor',gloves:'Gloves',boots:'Boots',weapon:'Weapon'};
const SETS=[{n:'Bulwark',hp:12,atk:1,col:'#4a8fe0',d:'Built for the Tank'},{n:'Fury',hp:4,atk:3,col:'#e0503a',d:'Built for the Damage Dealer'},{n:'Mercy',hp:8,atk:2,col:'#5ac26a',d:'Built for the Support'}];
const PREF=Object.fromEntries(HIDS.map(k=>[k,{tank:0,dps:1,sup:2}[HEROES[k].cls]]));
const TIERS=[['Common','#d8d4c8'],['Magic','#8c8cff'],['Rare','#ffe96a'],['Legendary','#c8742a']];
const lvlOf=i=>i.tier*3+i.star;
const pwr=i=>Math.pow(ECON.itemGrowth,lvlOf(i));
const istat=i=>({hp:Math.round(SETS[i.set].hp*pwr(i)),atk:Math.round(SETS[i.set].atk*pwr(i)*10)/10});
const itemName=i=>TIERS[i.tier][0]+' '+SETS[i.set].n+' '+LABEL[i.type]+' '+i.star+'*';
const itemIco=i=>'item_'+(i.type==='weapon'?'sword':i.type)+'_'+i.tier;
const scrapVal=i=>ECON.scrap(lvlOf(i));
const itemOf=id=>save.items.find(x=>x.id===id);
function equippedIds(){const s=new Set();Object.values(save.eq).forEach(e=>Object.values(e).forEach(id=>s.add(id)));return s;}
function newItem(tier,type,set,star){
  const it={id:save.nid++,type:type||TYPES[rnd(5)],set:set===undefined?rnd(3):set,tier:tier||0,star:star||0};
  save.items.push(it);return it;
}
function stageDropTier(b){
  const r=Math.random()-(b||0),c=save.cleared;
  return r<0.03+c*0.01?2:r<0.2+c*0.02?1:0;
}
function dropItem(b){return newItem(stageDropTier(b));}
function tileHTML(i,opt){
  opt=opt||{};
  const stars=i.star?'<div class="tstars">'+ic('ui_star').repeat(i.star)+'</div>':'';
  return '<div class="tile t'+i.tier+(opt.sel?' sel':'')+'"><span class="pip" style="background:'+SETS[i.set].col+'"></span>'+ic(itemIco(i))+stars+(opt.count>1?'<span class="cnt">'+opt.count+'</span>':'')+(opt.badge?'<span class="bdg">'+opt.badge+'</span>':'')+'</div>';
}
function tipHTML(i){
  const s=istat(i),t=TIERS[i.tier];
  return '<div class="tip t'+i.tier+'"><div class="tiph" style="color:'+t[1]+'">'+t[0]+' '+LABEL[i.type]+(i.star?' '+'★'.repeat(i.star):'')+'</div>'
   +'<div class="tipn" style="color:'+t[1]+'">'+SETS[i.set].n+' '+LABEL[i.type]+'</div>'
   +'<div class="sep"></div>'
   +'<div class="tl"><b>+'+s.hp+'</b> Health</div><div class="tl"><b>+'+s.atk+'</b> Attack</div>'
   +'<div class="sep"></div>'
   +'<div class="tl dim">Item level '+(lvlOf(i)+1)+' / 12</div>'
   +'<div class="tl" style="color:'+SETS[i.set].col+'">'+SETS[i.set].n+' set — '+SETS[i.set].d+'</div></div>';
}

/* ---------- players, heroes ---------- */
function xpInfo(){let x=save.xp,l=1;while(x>=ECON.xpNeed(l)){x-=ECON.xpNeed(l);l++;}return {l,x,need:ECON.xpNeed(l)};}
const plv=()=>xpInfo().l;
function addXp(n){const b=plv();save.xp+=n;if(plv()>b)toast('Player level '+plv()+'!');}
function heroStats(r,hp,atk){
  hp=hp===undefined?HEROES[r].hp:hp;atk=atk===undefined?HEROES[r].atk:atk;
  const m=(1+0.15*(save.lv[r]-1))*(1+0.1*(save.stars[r]||0));let h=hp*m,a=atk*m;
  Object.values(save.eq[r]).forEach(id=>{const it=itemOf(id);if(it){const s=istat(it);h+=s.hp;a+=s.atk;}});
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
const KEYN={b:'Bronze Key',s:'Silver Key',g:'Gold Key'},KEYI={b:'key_bronze',s:'key_silver',g:'key_gold'};
function chips(r){
  let h='';
  if(r.gold)h+='<span class="chip">'+ic('gold')+'<b>'+comma(r.gold)+'</b></span>';
  if(r.gems)h+='<span class="chip">'+ic('gem')+'<b>'+comma(r.gems)+'</b></span>';
  if(r.tix)h+='<span class="chip">'+ic('ticket')+'<b>'+r.tix+'</b></span>';
  for(const k in (r.keys||{}))if(r.keys[k])h+='<span class="chip">'+ic(KEYI[k])+'<b>'+r.keys[k]+'</b></span>';
  if(r.xp)h+='<span class="chip xp"><b>'+r.xp+'</b> XP</span>';
  if(r.tiers&&r.tiers.length)h+='<span class="chip">'+ic('item_sword_'+Math.max(...r.tiers))+'<b>'+r.tiers.length+' item'+(r.tiers.length>1?'s':'')+'</b></span>';
  return h;
}
function showRewards(title,out,sub){
  sfx('reward');const b=el('div','rew');
  if(sub)b.appendChild(el('div','sub',sub));
  const ch=chips(out);if(ch)b.appendChild(el('div','chips',ch));
  if(out.items&&out.items.length){
    const g=el('div','tgrid small');out.items.slice(0,30).forEach(i=>{g.insertAdjacentHTML('beforeend',tileHTML(i));});b.appendChild(g);
    if(out.items.length>30)b.appendChild(el('div','sub','...and '+(out.items.length-30)+' more'));
  }
  const ok=el('button','btn primary','Collect');ok.onclick=closeModal;b.appendChild(ok);
  openModal(b,{title:title,cls:'rewm'});
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
  return {tasks,cal,mail,shop};
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
