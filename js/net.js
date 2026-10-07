/* ================= Net: pluggable online layer =================
   Exposes Net.use('db'|'user') with the small Firestore-like API that account.js / guild.js already speak:
     db.doc(path).get()/set(data)/update(patch)/delete()/onSnapshot(cb,err)
     db.collection(name).where(field,op,value)...limit(n).get()/onSnapshot(cb,err)
   Default backend = LOCAL MOCK (localStorage, one device, seeded with practice bots so Friends/Guild/PvP can be played offline).
   To go online later: Net.setBackend({use:async name=>...}) with the same API (Supabase/Firebase wrapper); nothing else changes. */
window.Net=(function(){
  const N={mock:true,backend:null,botIds:[]};
  const KEY='wipewars_net_v1',UKEY='wipewars_uid_v1';
  const ls={get:k=>{try{return localStorage.getItem(k);}catch(e){return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}}};
  let store=null;
  try{store=JSON.parse(ls.get(KEY)||'null');}catch(e){}
  const BOTS=[
    {id:'bot_mopknight',name:'Mop Knight',lvl:14,stage:21},{id:'bot_sudsy',name:'Sudsy Sam',lvl:9,stage:12},
    {id:'bot_plunger',name:'Plunger Pete',lvl:22,stage:34},{id:'bot_lint',name:'Lint Lord',lvl:6,stage:7},
    {id:'bot_bleachbae',name:'Bleach Bae',lvl:17,stage:26},{id:'bot_squeegee',name:'Squeegee Sue',lvl:11,stage:16}
  ];
  N.botIds=BOTS.map(b=>b.id);
  function seed(){
    store={docs:{}};
    BOTS.forEach(b=>{
      store.docs['profiles/'+b.id]={name:b.name,name_l:b.name.toLowerCase(),lvl:b.lvl,stage:b.stage,t:Date.now(),bot:true};
    });
    store.docs['guilds/bot_mopknight']={name:'Mop Squad',name_l:'mop squad',owner:'bot_mopknight',t:Date.now(),bot:true};
    BOTS.slice(0,4).forEach(b=>{store.docs['gmembers/'+b.id]={gid:'bot_mopknight',name:b.name,lvl:b.lvl,t:Date.now(),bot:true};});
  }
  if(!store||!store.docs)seed();
  const save=()=>ls.set(KEY,JSON.stringify(store));
  const subs=new Set();
  const split=p=>{const i=p.lastIndexOf('/');return{coll:p.slice(0,i),id:p.slice(i+1)};};
  const snapDoc=p=>{const d=store.docs[p];return{exists:d!==undefined,id:split(p).id,data:()=>d===undefined?undefined:JSON.parse(JSON.stringify(d))};};
  const OPS={'==':(a,b)=>a===b,'!=':(a,b)=>a!==b,'>=':(a,b)=>a>=b,'>':(a,b)=>a>b,'<':(a,b)=>a<b,'<=':(a,b)=>a<=b};
  function runQuery(coll,filters,lim){
    let ids=Object.keys(store.docs).filter(p=>{const s=split(p);return s.coll===coll;});
    ids=ids.filter(p=>filters.every(f=>{const v=store.docs[p][f.f];return v!==undefined&&OPS[f.op](v,f.v);}));
    if(lim)ids=ids.slice(0,lim);
    const docs=ids.map(snapDoc);
    return{docs,size:docs.length,empty:!docs.length};
  }
  function notify(){subs.forEach(s=>{try{s();}catch(e){}});}
  function write(p,fn){
    fn();save();setTimeout(notify,0);
    const d=store.docs[p];  // practice bots accept friend requests after a moment
    if(p.indexOf('reqs/')===0&&d&&d.st==='pend'&&/^bot_/.test(d.to)){
      setTimeout(()=>{if(store.docs[p]&&store.docs[p].st==='pend'){store.docs[p].st='ok';save();notify();}},900);
    }
  }
  function query(coll,filters,lim){
    const q={
      where:(f,op,v)=>query(coll,filters.concat([{f,op,v}]),lim),
      limit:n=>query(coll,filters,n),
      get:async()=>runQuery(coll,filters,lim),
      onSnapshot:(cb,err)=>{const run=()=>cb(runQuery(coll,filters,lim));subs.add(run);setTimeout(run,0);return()=>subs.delete(run);}
    };
    return q;
  }
  const db={
    doc:p=>({
      get:async()=>snapDoc(p),
      set:async data=>{write(p,()=>{store.docs[p]=JSON.parse(JSON.stringify(data));});},
      update:async patch=>{write(p,()=>{store.docs[p]=Object.assign({},store.docs[p]||{},JSON.parse(JSON.stringify(patch)));});},
      delete:async()=>{write(p,()=>{delete store.docs[p];});},
      onSnapshot:(cb,err)=>{const run=()=>cb(snapDoc(p));subs.add(run);setTimeout(run,0);return()=>subs.delete(run);}
    }),
    collection:name=>query(name,[],0)
  };
  let uid=ls.get(UKEY);
  if(!uid){uid='u'+Math.random().toString(36).slice(2,12);ls.set(UKEY,uid);}
  const user={id:async()=>uid};
  window.addEventListener('storage',e=>{if(e.key===KEY){try{store=JSON.parse(e.newValue)||store;}catch(x){}notify();}});
  N.use=async function(name){
    if(N.backend)return N.backend.use(name);
    return name==='db'?db:name==='user'?user:null;
  };
  N.setBackend=b=>{N.backend=b;N.mock=!b;};
  /* handy for PvP/tests: practice opponents' saved teams (ghosts) */
  N.ghosts=()=>BOTS.map(b=>({id:b.id,name:b.name,lvl:b.lvl,stage:b.stage}));
  N._reset=()=>{seed();save();notify();};
  return N;
})();
