/* ================= engine: the battle rules. Pure and deterministic: no DOM, no save, no timers. =================
   createBattle(heroes, monsters, opt) returns a battle B. The caller advances it with B.step(seconds) and reads what
   happened from B.ev (a list of events it empties itself); battle.js turns those into animation, the balance
   simulator ignores them. The same seed and the same calls always give the same fight.
   Time is in battle seconds. Events: atk, dmg, heal, miss, mana, fx, shield, die, ult, tele, slam, enrage, end. */
const ENG={
  Q:.05,                    // rules advance in steps of this many seconds, whatever the caller's frame rate or speed
  critMult:1.5,
  manaPerAct:10,
  eliteEvery:3,             // every Nth attack of a rare monster ignores the tank and picks any hero
  slamEvery:9,slamWarn:1.2,slamMult:.7,     // bosses: a telegraphed slam that hits the whole team
  enrageAt:60,enrageStep:5,enrageAdd:.2,    // long fights: monsters hit harder every step, so no battle stalls
  timeout:150               // a battle still running at this point is a defeat
};
/* seconds between an attack starting and its damage landing (projectiles take longer) */
const HITDELAY={h:.12,m:.22,clorox:.75,chavoso:.3,ze:.5};

function createBattle(heroes,mons,opt){
  opt=opt||{};
  const rng=mulberry(opt.seed===undefined?Math.floor(Math.random()*4294967296):opt.seed);
  const B={t:0,over:false,win:null,units:[],ev:[],auto:!!opt.auto,opt};
  let acc=0,queue=[],seq=0,enraged=0;
  const emit=(e,o)=>{o=o||{};o.e=e;B.ev.push(o);};
  const after=(d,fn)=>queue.push({at:B.t+d,n:seq++,fn});
  const ri=n=>Math.floor(rng()*n);
  const vary=()=>.9+rng()*.2;
  const mk=(side,s)=>{
    const p=slotPos(side,s.slot),m=s.mods||{};
    const u={id:B.units.length,side,kind:s.kind,name:s.name,cls:s.cls||'mon',hp:s.hp,max:s.hp,atk:s.atk,iv:s.iv,t:rng()*s.iv*.5,
      slot:s.slot,row:p.row,lane:p.lane,fx:[],shield:0,mana:0,mmax:s.mmax||0,rng:s.rng,heal:s.heal,rar:s.rar||0,boss:!!s.boss,
      m,key:s.key||null,n:0,sl:0,rg:0,st:{dmg:0,heal:0,taken:0,casts:0}};
    B.units.push(u);return u;
  };
  heroes.forEach(s=>mk('h',s));mons.forEach(s=>mk('m',s));
  const alive=side=>B.units.filter(u=>u.side===side&&u.hp>0);
  const fxm=(u,k)=>u.fx.reduce((a,f)=>f.k===k?a*f.m:a,1);
  const has=(u,k)=>u.fx.some(f=>f.k===k);
  const stunned=u=>has(u,'stun');
  const key=(u,k)=>u.key===k;
  function addFx(u,k,m,t,tag){if(u.hp<=0)return;u.fx=u.fx.filter(f=>!(f.k===k&&f.tag===(tag||k)));u.fx.push({k,m,t,tag:tag||k});emit('fx',{u});}
  /* attack after buffs, plus Ze's drum: everyone else on his team hits harder while he stands */
  function A(u){
    let a=u.atk*fxm(u,'atk');
    if(u.side==='h'&&u.kind!=='ze'){const z=B.units.find(x=>x.kind==='ze'&&x.side==='h'&&x.hp>0);if(z)a*=key(z,'ze_beat')?1.14:1.08;}
    return a;
  }
  /* monsters go for the tank first, then the front row; heroes go front to back, ranged ones anywhere */
  function pickTarget(u){
    const foes=alive(u.side==='h'?'m':'h');if(!foes.length)return null;
    if(u.side==='m'){
      if(u.rar===2&&u.n%ENG.eliteEvery===0)return foes[ri(foes.length)];
      const tank=foes.find(f=>f.cls==='tank');if(tank)return tank;
    }
    if(u.side==='h'&&u.rng)return foes[ri(foes.length)];
    const front=foes.filter(f=>f.row===0),pool=front.length?front:foes;
    return pool[ri(pool.length)];
  }
  function gainMana(u,n,flat){
    if(u.side!=='h'||u.hp<=0||u.mana>=u.mmax)return;
    if(!flat)n*=1+(u.m.mana||0);
    if(opt.freeMana)n=u.mmax;
    u.mana=Math.min(u.mmax,u.mana+n);emit('mana',{u});
    if(u.mana>=u.mmax&&B.auto)B.cast(u);
  }
  function heal(t,n,src){
    if(t.hp<=0||B.over)return;
    n=Math.round(n);const got=Math.min(t.max-t.hp,n);t.hp+=got;if(src)src.st.heal+=got;
    emit('heal',{t,n});
  }
  function shield(t,n){if(t.hp<=0)return;t.shield+=Math.round(n);emit('shield',{t});}
  /* o: {crit:true forces a crit, plain:true skips on-hit extras (thorns, counters), tag} */
  function damage(t,dmg,src,o){
    o=o||{};
    if(t.hp<=0||B.over)return 0;
    if(t.side==='h'&&(opt.god||opt.inv))return 0;
    if(t.side==='h'&&key(t,'sam_ghost')&&src&&rng()<.2){emit('miss',{t});return 0;}
    let crit=false;
    if(src&&src.side==='h'){
      if(o.crit||rng()<(src.m.crit||0)){crit=true;dmg*=ENG.critMult+(src.m.critDmg||0);}
      if(t.boss)dmg*=1+(src.m.boss||0);
      if(t.hp/t.max<.3)dmg*=1+(src.m.exec||0);
    }
    dmg*=fxm(t,'in');
    if(t.side==='h')dmg*=1-(t.m.dr||0);
    if(opt.oneHit&&t.side==='m')dmg=t.hp+t.shield+1;
    dmg=Math.max(1,Math.round(dmg));
    let d=dmg;
    if(t.shield>0){const ab=Math.min(t.shield,d);t.shield-=ab;d-=ab;}
    t.hp-=d;if(opt.immortal&&t.side==='m'&&t.hp<1)t.hp=1;
    if(src)src.st.dmg+=dmg;t.st.taken+=dmg;
    emit('dmg',{t,n:dmg,crit,src});
    if(t.side==='h')gainMana(t,Math.min(12,3+Math.round(dmg/t.max*30)));
    if(src&&src.hp>0&&d>0){
      const ls=(src.m.ls||0)+(key(src,'gl_jackpot')&&has(src,'tiger')?.25:0);
      if(ls)heal(src,d*ls,src);
      if(src.m.expose&&t.hp>0)addFx(t,'in',1+src.m.expose,4,'expose');
    }
    if(!o.plain&&src&&src.side==='m'&&src.hp>0&&t.hp>0){
      if(t.m.thorns)damage(src,dmg*t.m.thorns,t,{plain:true});
      if(key(t,'mal_counter')&&rng()<.25)after(.15,()=>{if(t.hp>0)damage(src,A(t)*vary(),t,{plain:true});});
    }
    if(key(t,'luc_bait')&&!t.baited&&t.hp>0&&t.hp/t.max<.4){t.baited=true;shield(t,t.max*.3);}
    if(t.hp<=0)die(t);
    return dmg;
  }
  function die(t){
    t.hp=0;t.shield=0;const hexed=t.fx.some(f=>f.tag==='hex');t.fx=[];emit('die',{t});
    if(t.side==='m'&&hexed){const d=B.units.find(u=>u.hp>0&&key(u,'don_doom'));
      if(d)after(.2,()=>alive('m').forEach(m=>damage(m,t.max*.15,d,{plain:true})));}
  }
  /* one scheduled hit of an ultimate or follow-up: u hits t for mult x attack */
  function strike(u,t,mult,delay,o){
    after(delay||0,()=>{if(!t||t.hp<=0||u.hp<=0)return;const n=damage(t,A(u)*mult*vary(),u,o);if(o&&o.then)o.then(n);});
  }
  const ULTS={
    tank(u,p){shield(u,u.max*.4*p);
      if(key(u,'jack_showdown')){heal(u,u.max*.15*p,u);alive('m').filter(m=>m.row===0).forEach(m=>addFx(m,'stun',1,1.5));}
      emit('ult',{u});},
    rafinha(u,p){const dur=key(u,'raf_double')?12:8,hp=key(u,'raf_double')?.45:.3;emit('ult',{u,d:.85});
      after(.85,()=>{if(u.hp<=0)return;heal(u,u.max*hp*p,u);shield(u,u.max*.3*p);addFx(u,'atk',1.6,dur);addFx(u,'grow',1.35,dur);addFx(u,'orc',1,dur);});},
    lucao(u,p){emit('ult',{u});
      for(let i=0;i<4;i++)alive('m').forEach(m=>strike(u,m,1*p,.2+i*.23));
      shield(u,u.max*.15*p);if(key(u,'luc_net'))alive('m').forEach(m=>addFx(m,'spd',.7,6,'net'));},
    dps(u,p){const t=pickTarget(u);if(!t)return;emit('ult',{u,t,d:.67});
      strike(u,t,5*p,.67,{then:()=>{if(key(u,'dan_peck'))addFx(t,'in',1.25,8,'peck');}});
      if(key(u,'dan_flock'))alive('m').filter(m=>m!==t).slice(0,2).forEach((m,i)=>strike(u,m,2.5*p,.8+i*.12));},
    chavoso(u,p){const ms=alive('m');if(!ms.length)return;emit('ult',{u});addFx(u,'spd',1.3,8,'fan');
      const vol=key(u,'cha_storm')?3:2;
      for(let v=0;v<vol;v++)ms.forEach((m,i)=>{after(.12+v*.3+i*.04,()=>{if(m.hp>0&&u.hp>0)emit('atk',{u,t:m,d:HITDELAY.chavoso,shot:true});});strike(u,m,1.3*p,.12+v*.3+i*.04+HITDELAY.chavoso);});},
    copello(u,p){const t=pickTarget(u);if(!t)return;emit('ult',{u,t});strike(u,t,4.5*p,.2);
      alive('m').forEach(m=>{if(m!==t)strike(u,m,(key(u,'cop_ripe')?2.2:1.2)*p,.33);});},
    glem(u,p){const dur=key(u,'gl_wild')?14:10;addFx(u,'atk',1.8,dur);addFx(u,'in',.75,dur);addFx(u,'grow',1.1,dur);addFx(u,'tiger',1,dur);
      if(key(u,'gl_wild'))addFx(u,'spd',1.25,dur,'wild');heal(u,u.max*.15*p,u);emit('ult',{u});},
    malaguti(u,p){const t=pickTarget(u);if(!t)return;emit('ult',{u,t,d:.8});
      for(let i=0;i<5;i++)strike(u,t,1*p,i*.13);
      const perfect=key(u,'mal_perfect');
      strike(u,t,2.2*p,5*.13,{crit:perfect,then:()=>{if(perfect&&t.hp<=0)gainMana(u,30,true);}});},
    samuel(u,p){const ms=alive('m');if(!ms.length)return;
      const pickT=()=>{const a=alive('m'),back=a.filter(m=>m.row>0);return (back.length?back:a).slice().sort((x,y)=>y.atk-x.atk)[0];};
      const t=pickT();emit('ult',{u,t,d:.42});
      after(.3,()=>{if(u.hp<=0||t.hp<=0)return;addFx(t,'stun',1,2);});
      strike(u,t,5.5*p,.42,{then:n=>{if(key(u,'sam_fork')&&t.hp<=0){const t2=pickT();if(t2)after(.15,()=>{if(u.hp>0&&t2.hp>0)damage(t2,n*.6,u,{plain:true});});}}});},
    rubens(u,p){const h=(20+A(u)*2.5)*p;emit('ult',{u,d:1.65});
      after(1.65,()=>{if(u.hp<=0)return;alive('h').forEach(a=>{heal(a,h,u);if(key(u,'rub_hotbox'))addFx(a,'atk',1.2,8,'hotbox');});});},
    ze(u,p){const dur=key(u,'ze_encore')?14:10,mana=key(u,'ze_encore')?25:15;
      alive('h').forEach(a=>{addFx(a,'atk',1+.35*p,dur,'fan');addFx(a,'spd',1.25,dur,'fan');if(a!==u)gainMana(a,mana,true);});emit('ult',{u});},
    donnie(u,p){const ms=alive('m');ms.forEach(m=>{addFx(m,'atk',.65,10,'hex');addFx(m,'in',1+.25*p,10,'hex');});emit('ult',{u,ms,d:10});}
  };
  /* casts u's ultimate if it is ready. Returns whether it did. */
  B.cast=u=>{
    if(B.over||u.hp<=0||u.mana<u.mmax||!ULTS[u.kind])return false;
    u.mana=0;u.st.casts++;emit('mana',{u});
    ULTS[u.kind](u,1+(u.m.ult||0));return true;
  };
  function act(u){
    const foes=alive(u.side==='h'?'m':'h');if(!foes.length)return;
    u.n++;
    if(u.heal){
      const hurt=alive(u.side).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
      if(hurt&&hurt.hp/hurt.max<.9){emit('atk',{u});heal(hurt,10+A(u)*.8,u);if(key(u,'rub_munch'))gainMana(hurt,8,true);gainMana(u,ENG.manaPerAct);return;}
    }
    const t=pickTarget(u);if(!t)return;
    const orc=u.kind==='rafinha'&&has(u,'orc');
    let dmg=A(u)*vary();
    if(u.kind==='samuel'&&(t.row>0||stunned(t)))dmg*=1.3;
    if(orc)dmg*=1.15;
    const d=orc?.15:(HITDELAY[u.kind]||HITDELAY[u.side]);
    emit('atk',{u,t,d,smash:orc});
    after(d,()=>{
      if(u.hp<=0)return;   // a unit that died mid-swing does not land the hit
      damage(t,dmg,u);
      if(u.kind==='donnie'&&t.hp>0){const ink=key(u,'don_ink');addFx(t,'in',ink?1.2:1.12,ink?9:6,'curse');}
      if(orc&&key(u,'raf_quake'))alive('m').filter(m=>m!==t&&m.row===0).forEach(m=>damage(m,dmg*.5,u,{plain:true}));
      if(key(u,'cha_pierce')){const o=alive('m').filter(m=>m!==t);if(o.length)damage(o[ri(o.length)],dmg*.5,u,{plain:true});}
      if(key(u,'cop_cast')&&t.hp>0&&rng()<.2)addFx(t,'stun',1,1);
      if(key(u,'jack_whiplash')&&u.n%4===0)alive('m').forEach(m=>{if(m!==t)damage(m,dmg*.6,u,{plain:true});});
    });
    gainMana(u,ENG.manaPerAct);
  }
  function end(win){B.over=true;B.win=win;queue=[];emit('end',{win});}
  function tick(){
    B.t+=ENG.Q;
    // scheduled hits and effects that are due, in the order they were scheduled
    for(;;){
      let bi=-1;
      for(let i=0;i<queue.length;i++)if(queue[i].at<=B.t+1e-9&&(bi<0||queue[i].at<queue[bi].at||(queue[i].at===queue[bi].at&&queue[i].n<queue[bi].n)))bi=i;
      if(bi<0||B.over)break;
      const q=queue.splice(bi,1)[0];q.fn();
    }
    if(!B.over&&!opt.lab&&B.t>=ENG.enrageAt){
      const lvl=1+Math.floor((B.t-ENG.enrageAt)/ENG.enrageStep);
      if(lvl>enraged){enraged=lvl;if(lvl===1)emit('enrage');alive('m').forEach(m=>addFx(m,'atk',1+ENG.enrageAdd*lvl,999,'enrage'));}
    }
    for(const u of B.units){
      if(u.hp<=0||B.over)continue;
      if(u.fx.length){let ch=false;u.fx=u.fx.filter(f=>{f.t-=ENG.Q;if(f.t<=0){ch=true;return false;}return true;});if(ch)emit('fx',{u});}
      if(u.side==='h'){
        u.rg+=ENG.Q;
        if(u.rg>=5){u.rg-=5;const aura=alive('h').reduce((a,x)=>a+(x.m.aRegen||0),0),r=(u.m.regen||0)+aura;if(r>0&&u.hp<u.max)heal(u,u.max*r,u);}
      }
      if(u.boss){
        u.sl+=ENG.Q;
        if(u.sl>=ENG.slamEvery){u.sl=0;emit('tele',{u,d:ENG.slamWarn});
          after(ENG.slamWarn,()=>{if(u.hp<=0)return;emit('slam',{u});alive('h').forEach(h=>damage(h,A(u)*ENG.slamMult*vary(),u,{plain:true}));});}
      }
      if(stunned(u))continue;
      u.t+=ENG.Q*fxm(u,'spd')*(1+(u.m.spd||0));
      if(u.t>=u.iv){u.t-=u.iv;act(u);}
    }
    if(B.over)return;
    if(!alive('m').length)end(true);
    else if(!alive('h').length)end(false);
    else if(!opt.lab&&B.t>=ENG.timeout)end(false);
  }
  /* battle-start skills: head-start mana and the supports' team shield */
  const aura=B.units.filter(u=>u.side==='h').reduce((a,u)=>a+(u.m.aShield||0),0);
  B.units.forEach(u=>{if(u.side!=='h')return;if(aura)u.shield=Math.round(u.max*aura);if(u.m.start)u.mana=Math.min(u.mmax,Math.round(u.mmax*u.m.start));});
  /* advances the battle by dt seconds */
  B.step=dt=>{acc+=dt;while(acc>=ENG.Q-1e-9&&!B.over){acc-=ENG.Q;tick();}};
  B.alive=alive;
  return B;
}
/* plays a battle to the end with ultimates cast as soon as they are ready. Used by tests and the balance simulator. */
function runBattle(heroes,mons,opt){
  const B=createBattle(heroes,mons,Object.assign({auto:true},opt));
  while(!B.over){B.step(1);B.ev.length=0;}
  return B;
}
