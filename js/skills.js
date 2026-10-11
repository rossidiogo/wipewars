/* ================= skills: every hero's skill tree. Data + rules, no DOM (the tree screen is src/screens/skills). =================
   A hero earns 1 skill point per level-up and 2 per star. A tree has three branches of three nodes
   (3 ranks each) shared by the hero's class, plus two keystones of the hero's own: only one can be active.
   A node's `m` names what it changes (see SK_ZERO); `v` is the amount per rank. The battle rules read the totals
   through skMods(); keystones are looked up by id in engine.js. */
const SK_RANKS=3;            // ranks per node
const SK_STEP=2;             // ranks a node needs before the next one in its branch opens
const SK_KEY_REQ=12;         // points spent in the tree before a keystone can be taken
const SK_KEY_COST=2;
const SK_STAR_PTS=2;
const SK_ZERO=()=>({hp:0,atk:0,spd:0,crit:0,critDmg:0,dr:0,ls:0,mana:0,start:0,ult:0,thorns:0,regen:0,exec:0,boss:0,aRegen:0,aShield:0,expose:0,key:null});
const SKTREE={
  tank:[
    {n:'Bulwark',col:'#4a8fe0',nodes:[
      {id:'t_hp',n:'Thick Skin',m:'hp',v:.06,d:'+6% Health per rank.'},
      {id:'t_dr',n:'Iron Guard',m:'dr',v:.04,d:'Takes 4% less damage per rank.'},
      {id:'t_regen',n:'Second Wind',m:'regen',v:.015,d:'Every 5s, recovers 1.5% of max Health per rank.'}]},
    {n:'Brawler',col:'#e0503a',nodes:[
      {id:'t_atk',n:'Heavy Hands',m:'atk',v:.06,d:'+6% Attack per rank.'},
      {id:'t_thorns',n:'Spiked Armor',m:'thorns',v:.1,d:'Attackers take back 10% of the damage they deal, per rank.'},
      {id:'t_boss',n:'Bully',m:'boss',v:.08,d:'+8% damage to bosses per rank.'}]},
    {n:'Rally',col:'#e0b64a',nodes:[
      {id:'t_start',n:'Head Start',m:'start',v:.12,d:'Starts each battle with 12% mana per rank.'},
      {id:'t_mana',n:'Adrenaline',m:'mana',v:.08,d:'Gains mana 8% faster per rank.'},
      {id:'t_ult',n:'Showman',m:'ult',v:.1,d:'Ultimate is 10% stronger per rank.'}]}
  ],
  dps:[
    {n:'Precision',col:'#e0503a',nodes:[
      {id:'d_atk',n:'Sharpen',m:'atk',v:.06,d:'+6% Attack per rank.'},
      {id:'d_crit',n:'Keen Eye',m:'crit',v:.06,d:'+6% chance to land a critical hit per rank.'},
      {id:'d_critd',n:'Deep Cuts',m:'critDmg',v:.2,d:'Critical hits deal +20% damage per rank.'}]},
    {n:'Tempo',col:'#e0b64a',nodes:[
      {id:'d_spd',n:'Quick Hands',m:'spd',v:.05,d:'Attacks 5% faster per rank.'},
      {id:'d_mana',n:'Momentum',m:'mana',v:.08,d:'Gains mana 8% faster per rank.'},
      {id:'d_ult',n:'Showtime',m:'ult',v:.1,d:'Ultimate is 10% stronger per rank.'}]},
    {n:'Survival',col:'#5ac26a',nodes:[
      {id:'d_hp',n:'Tough',m:'hp',v:.06,d:'+6% Health per rank.'},
      {id:'d_ls',n:'Vampirism',m:'ls',v:.04,d:'Heals for 4% of the damage dealt, per rank.'},
      {id:'d_exec',n:'Finisher',m:'exec',v:.1,d:'+10% damage to enemies below 30% Health, per rank.'}]}
  ],
  sup:[
    {n:'Mending',col:'#5ac26a',nodes:[
      {id:'s_hp',n:'Vitality',m:'hp',v:.06,d:'+6% Health per rank.'},
      {id:'s_aregen',n:'Soothing Aura',m:'aRegen',v:.006,d:'Every 5s, the whole team recovers 0.6% of max Health per rank.'},
      {id:'s_ashield',n:'Guardian',m:'aShield',v:.04,d:'The whole team starts each battle with a shield worth 4% of max Health per rank.'}]},
    {n:'Tactics',col:'#e0b64a',nodes:[
      {id:'s_mana',n:'Insight',m:'mana',v:.08,d:'Gains mana 8% faster per rank.'},
      {id:'s_start',n:'Prepared',m:'start',v:.12,d:'Starts each battle with 12% mana per rank.'},
      {id:'s_ult',n:'Encore',m:'ult',v:.1,d:'Ultimate is 10% stronger per rank.'}]},
    {n:'Hexes',col:'#b050ff',nodes:[
      {id:'s_atk',n:'Sting',m:'atk',v:.06,d:'+6% Attack per rank.'},
      {id:'s_spd',n:'Haste',m:'spd',v:.05,d:'Attacks 5% faster per rank.'},
      {id:'s_expose',n:'Weak Spot',m:'expose',v:.03,d:'Enemies this hero hits take 3% more damage for 4s, per rank.'}]}
  ]
};
const KEYSTONES={
  tank:[{id:'jack_showdown',n:'Showdown',d:'Hold the Line also heals 15% of max Health and stuns the enemy front row for 1.5s.'},
        {id:'jack_whiplash',n:'Whiplash',d:'Every 4th attack cracks the whip across every enemy for 60% damage.'}],
  rafinha:[{id:'raf_double',n:'Double Can',d:'Orc Mode lasts 12s instead of 8s and heals 40% instead of 25%.'},
        {id:'raf_quake',n:'Aftershock',d:'Orc smashes also hit every other enemy in the front row for 50% damage.'}],
  lucao:[{id:'luc_net',n:'Fishing Net',d:'Big Catch also slows every enemy by 30% for 6s.'},
        {id:'luc_bait',n:'Live Bait',d:'The first time he drops below 40% Health in a battle, he gains a shield worth 30% of max Health.'}],
  dps:[{id:'dan_flock',n:'Flock',d:'The cockatiel also strikes two more enemies for half damage.'},
        {id:'dan_peck',n:'Pecking Order',d:'The cockatiel marks its target: it takes 25% more damage for 8s.'}],
  chavoso:[{id:'cha_pierce',n:'Piercing Arrows',d:'Basic attacks pass through and hit a second enemy for 50% damage.'},
        {id:'cha_storm',n:'Eye of the Storm',d:'Tornado Shot hits every enemy three times instead of twice.'}],
  copello:[{id:'cop_ripe',n:'Overripe',d:'Mango Barrage splashes for 2.4x instead of 1.5x.'},
        {id:'cop_cast',n:'Heavy Cast',d:'Basic attacks have a 20% chance to stun the target for 1s.'}],
  glem:[{id:'gl_jackpot',n:'Jackpot',d:'While in Tiger Form, heals for 25% of the damage dealt.'},
        {id:'gl_wild',n:'Wild Card',d:'Tiger Form lasts 14s instead of 10s and also gives +25% speed.'}],
  malaguti:[{id:'mal_perfect',n:'Perfect!',d:'The combo finisher always crits, and refunds 30 mana if it kills.'},
        {id:'mal_counter',n:'Counter Hit',d:'25% chance to strike back when hit.'}],
  samuel:[{id:'sam_fork',n:'Fork Bomb',d:'If the backstab kills, he backstabs another enemy for 60% of the damage.'},
        {id:'sam_ghost',n:'Ghost Process',d:'Dodges 20% of attacks.'}],
  rubens:[{id:'rub_hotbox',n:'Hotbox',d:'Smoke Session also gives the whole team +20% attack for 8s.'},
        {id:'rub_munch',n:'Munchies',d:'His basic heals also give the target 8 mana.'}],
  ze:[{id:'ze_encore',n:'Standing Ovation',d:'Fanfarra! lasts 12s instead of 8s and gives +20 mana instead of +10.'},
        {id:'ze_beat',n:'Marching Beat',d:'His passive makes allies hit 14% harder instead of 8%.'}],
  donnie:[{id:'don_doom',n:'Doom',d:'A hexed enemy that dies explodes, dealing 15% of its max Health to the others.'},
        {id:'don_ink',n:'Cursed Ink',d:'His basic curse is stronger and lasts longer: +20% damage taken for 9s.'}]
};
const skTree=r=>SKTREE[HEROES[r].cls];
const skNodes=r=>skTree(r).flatMap(b=>b.nodes);
function skOf(r){if(!save.sk)save.sk={};return save.sk[r]||(save.sk[r]={});}
const skRank=(r,id)=>skOf(r)[id]||0;
const skKey=r=>{const k=skOf(r).key;return KEYSTONES[r].some(x=>x.id===k)?k:null;};
const skTotal=r=>Math.max(0,(save.lv[r]||1)-1)+SK_STAR_PTS*((save.stars&&save.stars[r])||0);
const skSpent=r=>skNodes(r).reduce((a,n)=>a+skRank(r,n.id),0)+(skKey(r)?SK_KEY_COST:0);
const skFree=r=>skTotal(r)-skSpent(r);
/* why a node cannot take another rank right now, or '' when it can */
function skBlock(r,id){
  for(const b of skTree(r)){const i=b.nodes.findIndex(n=>n.id===id);if(i<0)continue;
    if(skRank(r,id)>=SK_RANKS)return 'max';
    if(i>0&&skRank(r,b.nodes[i-1].id)<SK_STEP)return 'locked';
    return skFree(r)<1?'points':'';}
  return 'locked';
}
function skBuy(r,id){if(skBlock(r,id))return false;skOf(r)[id]=skRank(r,id)+1;persist();return true;}
function skKeyBlock(r,id){
  if(skKey(r)===id)return 'on';
  if(skSpent(r)-(skKey(r)?SK_KEY_COST:0)<SK_KEY_REQ)return 'locked';
  return (skKey(r)||skFree(r)>=SK_KEY_COST)?'':'points';
}
/* taking the other keystone swaps it: the cost is the same */
function skPickKey(r,id){if(skKeyBlock(r,id))return false;skOf(r).key=id;persist();return true;}
function skReset(r){skOf(r);save.sk[r]={};persist();}
/* the totals the battle rules use */
function skMods(r){
  const m=SK_ZERO();skNodes(r).forEach(n=>{m[n.m]+=n.v*skRank(r,n.id);});m.key=skKey(r);return m;
}
/* spends a hero's free points the way a sensible player would: used by "Auto-assign" and by the balance simulator */
function skAuto(r){
  let guard=99;
  while(skFree(r)>0&&guard--){
    if(skFree(r)>=SK_KEY_COST&&!skKey(r)&&!skKeyBlock(r,KEYSTONES[r][0].id)){skPickKey(r,KEYSTONES[r][0].id);continue;}
    // fill branch by branch, shallowest open node first, so points are never stranded behind a lock
    const open=skTree(r).flatMap(b=>b.nodes.map((n,i)=>({n,i}))).filter(x=>!skBlock(r,x.n.id)).sort((a,b)=>a.i-b.i||skRank(r,b.n.id)-skRank(r,a.n.id));
    if(!open.length)break;skBuy(r,open[0].n.id);
  }
}
