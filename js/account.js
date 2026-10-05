/* ================= accounts, cloud save, friends (shared db) ================= */
window.Acct=(function(){
  const A={db:null,id:null,ready:null,cloud:null,online:false,reqs:{},gifts:[],profiles:{},subs:[],onchange:null};
  const today=()=>new Date().toISOString().slice(0,10);
  const tag=id=>(id||'').replace(/[^A-Za-z0-9]/g,'').slice(-4).toUpperCase();
  A.tag=tag;A.today=today;
  const myProfile=()=>({name:save.name||'Wiper',name_l:(save.name||'wiper').toLowerCase(),lvl:plv(),stage:save.cleared||0,t:Date.now()});
  A.ready=(async()=>{
    try{
      const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
      if(!db||!user)return A;
      const id=await user.id();if(!id)return A;
      A.db=db;A.id=id;A.online=true;
      try{const s=await db.doc('data/users/'+id+'/cloud').get();if(s.exists)A.cloud=s.data();}catch(e){}
    }catch(e){}
    return A;
  })();
  /* ---- cloud save ---- */
  let dirty=false,busy=false;
  A.markDirty=()=>{dirty=true;};
  async function push(){
    if(!A.online||!dirty||busy)return;busy=true;dirty=false;
    try{
      await A.db.doc('data/users/'+A.id+'/cloud').set({j:JSON.stringify(save),mod:save.mod||Date.now()});
      await A.db.doc('profiles/'+A.id).set(myProfile());
    }catch(e){dirty=true;}
    busy=false;
  }
  setInterval(push,15000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)push();});
  A.pushNow=push;
  A.applyCloud=()=>{ // replace local save with the newer cloud copy
    if(!A.cloud)return false;
    try{const c=JSON.parse(A.cloud.j);Object.keys(save).forEach(k=>delete save[k]);Object.assign(save,c);persist();return true;}catch(e){return false;}
  };
  A.cloudNewer=()=>!!(A.cloud&&A.cloud.mod>(save.mod||0)+1000);
  A.cloudInfo=()=>{try{const c=JSON.parse(A.cloud.j);return{name:c.name,lvl:(c.xp!==undefined?null:null),stage:c.cleared||0};}catch(e){return null;}};
  /* ---- friends ---- */
  const key=(a,b)=>a+'~'+b;
  A.start=function(cb){
    if(!A.online||A.subs.length)return;A.onchange=cb;
    A.db.doc('profiles/'+A.id).set(myProfile()).catch(()=>{});
    const watch=(q,fn)=>A.subs.push(q.onSnapshot(s=>{fn(s.docs.map(d=>d.data()));A.refreshProfiles().then(()=>A.onchange&&A.onchange());},()=>{}));
    let inc=[],out=[];
    const merge=()=>{A.reqs={};inc.concat(out).forEach(r=>{A.reqs[key(r.from,r.to)]=r;});};
    watch(A.db.collection('reqs').where('to','==',A.id),d=>{inc=d;merge();});
    watch(A.db.collection('reqs').where('from','==',A.id),d=>{out=d;merge();});
    watch(A.db.collection('gifts').where('to','==',A.id),d=>{A.gifts=d;});
  };
  A.friendIds=()=>Object.values(A.reqs).filter(r=>r.st==='ok').map(r=>r.from===A.id?r.to:r.from);
  A.incoming=()=>Object.values(A.reqs).filter(r=>r.st==='pend'&&r.to===A.id);
  A.outgoing=()=>Object.values(A.reqs).filter(r=>r.st==='pend'&&r.from===A.id);
  A.refreshProfiles=async function(){
    const need=new Set();Object.values(A.reqs).forEach(r=>{need.add(r.from);need.add(r.to);});need.delete(A.id);
    for(const id of need){if(A.profiles[id])continue;try{const s=await A.db.doc('profiles/'+id).get();A.profiles[id]=s.exists?s.data():{name:'Unknown',lvl:1,stage:0};}catch(e){}}
  };
  A.search=async function(q){
    q=q.trim().toLowerCase();if(q.length<2)return[];
    const s=await A.db.collection('profiles').where('name_l','>=',q).where('name_l','<',q+'').limit(10).get();
    return s.docs.map(d=>({id:d.id,...d.data()})).filter(p=>p.id!==A.id);
  };
  A.request=async function(to){
    if(A.reqs[key(A.id,to)]||A.reqs[key(to,A.id)])return;
    await A.db.doc('reqs/'+key(A.id,to)).set({from:A.id,to,st:'pend',t:Date.now()});
  };
  A.accept=r=>A.db.doc('reqs/'+key(r.from,r.to)).update({st:'ok'});
  A.remove=async r=>{await A.db.doc('reqs/'+key(r.from,r.to)).delete();delete A.reqs[key(r.from,r.to)];};
  A.canGift=id=>!(A.sentToday||{})[id];
  A.sendGift=async function(to){
    await A.db.doc('gifts/'+key(A.id,to)).set({from:A.id,to,day:today(),claimed:false});
    (A.sentToday=A.sentToday||{})[to]=1;
  };
  A.pendingGifts=()=>A.gifts.filter(g=>!g.claimed);
  A.claimGift=async g=>{await A.db.doc('gifts/'+key(g.from,g.to)).update({claimed:true});g.claimed=true;};
  return A;
})();
