/* ================= data: every number and name in the game. Pure: no DOM, no save. ================= */
const rnd=n=>Math.floor(Math.random()*n);
const pick1=a=>a[rnd(a.length)];
const comma=n=>Math.floor(n).toLocaleString(typeof LANG!=='undefined'&&LANG==='pt'?'pt-BR':'en-US');
const fmt=n=>{n=Math.floor(n);if(n>=1e7)return Math.floor(n/1e6)+'M';if(n>=1e6)return (n/1e6).toFixed(1)+'M';if(n>=1e5)return Math.floor(n/1e3)+'K';return comma(n);};
const dayKey=()=>new Date().toDateString();
const yesterdayKey=()=>new Date(Date.now()-864e5).toDateString();

/* ---------- ONE place for every number that affects the economy ---------- */
const ECON={
  idleCapMin:480,                       // idle storage cap (8h)
  idleBase:4, idlePerStage:1.0,         // gold / minute = base + perStage * stages cleared
  chestEveryMin:120, chestMax:4,        // 1 idle item per 2h, up to 4
  heroLvCost:lv=>Math.round(40*Math.pow(lv,1.6)/5)*5,
  xpNeed:l=>40*l,
  idleClaimXp:10,
  itemGrowth:1.32,                      // stat multiplier per item level (12 levels: a maxed item is ~21x a fresh common)
  scrap:lvl=>Math.round(15*Math.pow(1.75,lvl)),
  stageGoldKinds:{0:10,2:25,3:60},      // gold per monster rarity (x stage number)
  dropRare:[.02,.004], dropMagic:[.18,.01],   // chance of a Rare / Magic stage drop: [base, per stage cleared]
  firstClearGems:10, bossFirstClearGems:50, chapterGems:100,
  firstClearTix:1, bossFirstClearTix:3, chapterTix:5,   // recruit tickets
  ticketGems:60,                        // gem price of one recruit ticket
  pityNew:10,                           // a NEW friend is guaranteed within this many pulls
  starCost:[10,20,40,80,150],           // shards per star
  rarity:[{n:'Common',p:.60,sh:2,c:'#d8d4c8'},{n:'Rare',p:.28,sh:6,c:'#8c8cff'},{n:'Epic',p:.10,sh:15,c:'#ff8aff'},{n:'Legendary',p:.02,sh:40,c:'#ffe96a'}],
  firstClearXp:n=>50+3*n,
  replayXp:.015,                        // replaying a cleared stage gives this share of its first-clear XP
  replayGold:.25,                       // ...and this share of its Chaos: idle income, not grinding, is the main source
  chapMul:[2.2,2.6,3.4,3.9,4.3],      // how much stronger each chapter's monsters are (health and attack)
  easeIn:[.45,.6,.75,.85,.95],          // the first stages of the game are this fraction of their normal strength
  monHpLin:.34, monAtkLin:.32,          // monster growth per stage of the campaign
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
    {n:'The PC',sub:'The brain enters the network',f:'hue-rotate(275deg) saturate(1.1) brightness(.75)'}
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
  tank:{n:'Jack',role:'Cowboy Tank',sub:'Tank',cls:'tank',hp:245,atk:12,iv:1.2},
  rafinha:{n:'Rafinha',role:'Energy Drink Tank',sub:'Tank',cls:'tank',hp:275,atk:11,iv:1.3,sc:1},
  lucao:{n:'Lucão',role:'Fisherman Tank',sub:'Tank',cls:'tank',hp:310,atk:14,iv:1.2,sc:1.05},
  dps:{n:'Daniel',role:'Necromancer Summoner',sub:'Ranged DPS',cls:'dps',rng:1,hp:100,atk:30,iv:1.0},
  chavoso:{n:'Chavoso',role:'Deadeye Archer',sub:'Ranged DPS',cls:'dps',rng:1,hp:90,atk:26,iv:.85},
  copello:{n:'Copello',role:'Mango Sharpshooter',sub:'Ranged DPS',cls:'dps',rng:1,hp:95,atk:36,iv:1.1},
  glem:{n:'Glem',role:'Tiger Druid',sub:'Melee DPS',cls:'dps',hp:175,atk:24,iv:1.0},
  malaguti:{n:'Malaguti',role:'Street Fighter',sub:'Melee DPS',cls:'dps',hp:130,atk:26,iv:.9},
  samuel:{n:'Samuel',role:'Synthetic Assassin',sub:'Melee DPS',cls:'dps',hp:80,atk:36,iv:.8},
  rubens:{n:'Rubens',role:'Smoke Medic',sub:'Support',cls:'sup',heal:1,hp:120,atk:14,iv:1.4},
  ze:{n:'Zé',role:'Fanfarra Drummer',sub:'Support',cls:'sup',rng:1,hp:130,atk:12,iv:1.3},
  donnie:{n:'Donnie',role:'Curse Shaman',sub:'Support',cls:'sup',rng:1,hp:110,atk:16,iv:1.3}
};
const ULT={
  tank:{n:'Hold the Line',mana:40,d:'Gain a shield worth 40% of max health.'},
  rafinha:{n:'Orc Mode',mana:40,d:'Drinks a can of Monster and turns into a huge orc for 8s: heals 25%, gains a 25% shield, +60% attack and grows 35%. His basic attacks become ground-shaking smashes.'},
  lucao:{n:'Big Catch',mana:50,d:'Reels in a huge fish and spins like a top, whipping it into every enemy 4 times for 1.2x attack each, and gains a shield worth 45% of max health.'},
  dps:{n:'Summon Cockatiel',mana:80,d:'The cockatiel takes off from his shoulder, circles over his head, charges one enemy for 5x attack damage and flies back.'},
  chavoso:{n:'Tornado Shot',mana:70,d:'Fires a tornado of arrows: every enemy is hit twice for 1.3x attack each, and he gains Tailwind: +30% speed for 8s.'},
  copello:{n:'Mango Barrage',mana:70,d:'Hurls a mango for 4.5x damage to one enemy, splashing 1.5x on the rest.'},
  glem:{n:'Tiger Form',mana:60,d:'Turns into a huge tiger for 10s: +80% attack, takes 25% less damage, heals 15%.'},
  malaguti:{n:'Combo Breaker',mana:60,d:'A 6-hit combo on one enemy; the finisher hits for 2.2x.'},
  samuel:{n:'Root Access',mana:70,d:'He glitches out of reality and reappears behind the most dangerous enemy in the back row: a 5x backstab that stuns it for 2s. Passive: hits on stunned or back-row enemies deal +30% damage.'},
  rubens:{n:'Smoke Session',mana:60,d:'Takes a long drag on the joint and exhales a cloud of smoke around the whole team, healing every ally for a large amount.'},
  ze:{n:'Fanfarra!',mana:60,d:'He plays the drum and musical notes fly up: the whole team gets +22% attack and +20% speed for 8s, and +10 mana. Passive: allies hit 8% harder.'},
  donnie:{n:'Hex of Ruin',mana:60,d:'A red pentagram circle opens under every enemy: for 8s they deal 20% less damage and take 15% more. Passive: his hits curse (+12% damage taken).'}
};
const HIDS=Object.keys(HEROES);
/* Each hero has ONE fixed weapon (not an item): it cannot be swapped, only upgraded with Chaos. ico = placeholder emoji until real art is drawn. */
const WEAPONS={
  tank:{n:'Outlaw Bullwhip',ico:'\u{1FAA2}',d:'A braided leather whip that cracks across the whole line.'},
  rafinha:{n:'Monster Can',ico:'\u{1F96B}',d:'An ice-cold energy drink. Handle with care: it turns him into an orc.'},
  lucao:{n:'Lucky Fishing Rod',ico:'\u{1F3A3}',d:'Reels in anything, including fish the size of a bus.'},
  dps:{n:'Cockatiel Staff',ico:'\u{1FA84}',d:'A gnarled staff topped with a green orb. The cockatiel approves.'},
  chavoso:{n:'Deadeye Longbow',ico:'\u{1F3F9}',d:'A tall bow that never misses twice in a row.'},
  copello:{n:'Mango Launcher',ico:'\u{1F96D}',d:'Fires overripe mangos at dangerous speeds.'},
  glem:{n:'Tiger Claws',ico:'\u{1F42F}',d:'Gloves with the spirit of the tiger inside.'},
  malaguti:{n:'Iron Knuckles',ico:'\u{1F94A}',d:'Street-fighter wraps hardened by a thousand combos.'},
  samuel:{n:'Synth Wristblade',ico:'\u{1F5E1}\uFE0F',d:'A monofilament blade wired to a wrist console. It writes the code that cuts.'},
  rubens:{n:'Peace Joint',ico:'\u{1F6AC}',d:'A hand-rolled joint of peace and love. The smoke heals, and smells suspiciously nice.'},
  ze:{n:'Fanfarra Drum',ico:'\u{1F941}',d:'A battered drum and a pair of sticks that set the rhythm.'},
  donnie:{n:'Horned Skull Staff',ico:'\u{1F480}',d:'A cow skull on a pole, lit by a purple flame.'}
};
const WEP_MAX=12;
const WEP_BASE={tank:{hp:24,atk:2},dps:{hp:8,atk:6},sup:{hp:16,atk:4}};   // = what two best-set weapon items used to give
const wepCost=lv=>Math.round(100*Math.pow(lv,1.9)/5)*5;     // Chaos to go from lv to lv+1
const MAXTEAM=4;

/* ---------- items ---------- */
const SLOTS=['helm','armor','gloves','boots'];
const STYPE=s=>s;
const TYPES=['helm','armor','gloves','boots'];
const LABEL={helm:'Helm',armor:'Armor',gloves:'Gloves',boots:'Boots',weapon:'Weapon'};
const SETS=[{n:'Bulwark',hp:12,atk:1,col:'#4a8fe0',d:'Built for the Tank'},{n:'Fury',hp:4,atk:3,col:'#e0503a',d:'Built for the Damage Dealer'},{n:'Mercy',hp:8,atk:2,col:'#5ac26a',d:'Built for the Support'}];
const PREF=Object.fromEntries(HIDS.map(k=>[k,{tank:0,dps:1,sup:2}[HEROES[k].cls]]));
const TIERS=[['Common','#d8d4c8'],['Magic','#8c8cff'],['Rare','#ffe96a'],['Legendary','#c8742a']];
const lvlOf=i=>i.tier*3+i.star;
const pwr=i=>Math.pow(ECON.itemGrowth,lvlOf(i));
const istat=i=>({hp:Math.round(SETS[i.set].hp*pwr(i)),atk:Math.round(SETS[i.set].atk*pwr(i)*10)/10});
const itemName=i=>TIERS[i.tier][0]+' '+SETS[i.set].n+' '+LABEL[i.type]+' '+i.star+'*';
const itemIco=i=>'item_'+i.type+'_'+i.tier;
const scrapVal=i=>ECON.scrap(lvlOf(i));
const KEYN={b:'Bronze Key',s:'Silver Key',g:'Gold Key'},KEYI={b:'key_bronze',s:'key_silver',g:'key_gold'};

/* ---------- seeded randomness (shop deals, battles) ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}

/* ---------- monsters and stages ---------- */
const LANE_Y=[66,77,88];
const KINDS={
  tp:{n:'Toilet Paper',r:0,hp:176,atk:8.8,iv:1.1,key:'tp',m:1,pr:0},
  clorox:{n:'Clorox Wipes',r:2,hp:385,atk:15.4,iv:1.3,key:'clorox',m:1,pr:1},
  boss:{n:'Big Head',r:3,hp:800,atk:18,iv:1.5,key:'bh1',m:.9,pr:1},
  bottle:{n:'Bottle',r:2,hp:385,atk:15.4,iv:1.3,key:'bottle',m:.8,pr:1},
  bossx:{n:'Boss',r:3,hp:800,atk:18,iv:1.5,key:'bossx',m:.66,pr:1}
};
/* themed monsters per chapter: recolored versions of the base art until real designs exist */
const CHAPMON=[
  {n:['tp','clorox','boss']},
  {n:['fcondom','pcondom','bighead2'],names:['Frozen Condom','Permafrost Prophylactic','Big Head'],k:['fcondom','pcondom','bh2'],m:[1,1,1.0]},
  {n:['belt','sander','bighead3'],names:['Sandpaper','Belt Sander','Big Head'],k:['belt','machine','bh3'],m:[1,1,1.1]},
  {n:['pzburnt','pzmessy','bighead4'],names:['Burnt Mini Pizza','Dropped Pizza','Big Head'],k:['pzburnt','pzmessy','bh4'],m:[1,1,1.2]},
  {n:['ch5clone','ch5deluxe','bighead5'],names:['Silicone Clone','Deluxe Clone','Big Head'],k:['ch5clone','ch5deluxe','bh5'],m:[1,1,1.35]}
];
CHAPMON.forEach((c,ci)=>{if(ci===0)return;const base=['tp','bottle','bossx'];c.n.forEach((id,i)=>{const b=KINDS[base[i]];KINDS[id]=Object.assign({},b,{n:c.names[i],f:c.f&&c.f[i],key:(c.k&&c.k[i])||b.key,m:(c.m&&c.m[i])||b.m,});});});
const RC=['#d8d4c8','#8c8cff','#ffe96a','#c8742a'],RN=['Normal','Magic','Rare','Legendary'];

/* slot 0-2 = front row, 3-5 = back row; lane 0 is the far (upper) lane */
function slotPos(side,slot){const row=slot<3?0:1,lane=slot%3;const x=side==='h'?[40,20][row]+(1-lane)*2.5:[60,84][row]-(1-lane)*2.5;return {x,y:LANE_Y[lane],row,lane};}
const formPref=k=>{const H=HEROES[k];return H.cls==='tank'?[1,0,2,4,3,5]:(H.rng||H.cls==='sup')?[4,5,3,1,0,2]:[0,2,1,3,5,4];};
function stageList(n){
  const cnt=Math.min(5,3+Math.floor((n-1)/4)),nC=Math.min(cnt-1,Math.floor(n/3)),l=[];
  const cm=CHAPMON[chapOf(n)].n;
  for(let i=0;i<cnt;i++)l.push(i<cnt-nC?cm[0]:cm[1]);
  if(stageIn(n)===10)l[l.length-1]=cm[2];
  return l;
}
function stageGold(n){return stageList(n).reduce((a,k)=>a+ECON.stageGoldKinds[KINDS[k].r],0)*n;}
function placeMonsters(list){
  const order=[1,0,2],used=new Set();
  return list.map(kd=>{const pr=KINDS[kd].pr;let s=null;for(const r of [pr,1-pr]){for(const l of order){const sl=r*3+l;if(!used.has(sl)){s=sl;break;}}if(s!==null)break;}used.add(s);return s;});
}
/* a monster of kind kd as it appears on stage n */
function monStats(kd,n){const k=KINDS[kd],s=n-1,c=ECON.chapMul[chapOf(n)]*(ECON.easeIn[s]||1);return {hp:Math.round(k.hp*(1+ECON.monHpLin*s)*c),atk:Math.round(k.atk*(1+ECON.monAtkLin*s)*c)};}
/* the enemy line-up of a list of kinds, ready for createBattle (engine.js) */
function monSpecs(list,n){const slots=placeMonsters(list);return list.map((kd,i)=>{const k=KINDS[kd],st=monStats(kd,n);return {kind:kd,name:k.n,hp:st.hp,atk:st.atk,iv:k.iv,slot:slots[i],rar:k.r,boss:k.r===3};});}
