/* ================= UI: screens ================= */
const NAV=[['heroes','Heroes','ui_heroes'],['bag','Bag','ui_bag'],['home','Home','ui_battle'],['shop','Shop','ui_shop'],['tasks','Tasks','ui_tasks']];
const NAVSCREENS=new Set(['home','heroes','bag','shop','tasks']);
const TITLES={campaign:'Campaign',prep:'Formation',heroes:'Heroes',skills:'Skill Tree',bag:'Bag',shop:'Shop',tasks:'Daily Tasks',cal:'Daily Login',mail:'Mail',guild:'Guild',friends:'Friends',settings:'Settings'};
const BACK={campaign:'home',prep:'campaign',skills:'heroes',cal:'home',mail:'home',guild:'home',friends:'home',settings:'home'};
const DRAW={};DRAW.prep=drawPrep;
document.querySelectorAll('[data-ic]').forEach(i=>i.src=ICO[i.dataset.ic]);$('cfgi').src=ICO.ui_settings;

/* currency pills (kept in sync everywhere) */
function pillsHTML(){
  return '<div class="pill" data-go="shop:gold">'+ic('gold')+'<b data-cur="gold"></b></div><div class="pill" data-go="shop:gems">'+ic('gem')+'<b data-cur="gems"></b><i class="plus">+</i></div>';
}
function syncCur(){
  document.querySelectorAll('[data-cur]').forEach(e=>{const k=e.dataset.cur;e.textContent=k==='gold'?fmt(save.gold):k==='gems'?fmt(save.gems):k==='tix'?fmt(save.tix):fmt(save.keys[k]);});
  const x=xpInfo();
  $('plvn').textContent=x.l;$('lvring').style.setProperty('--p',Math.round(x.x/x.need*100));
  $('xpt').textContent=x.x+' / '+x.need+' XP';$('xpf').style.width=(x.x/x.need*100)+'%';
  const b=badgeCounts();
  [['bdg_cal',b.cal],['bdg_mail',b.mail],['bdg_tasks',b.tasks],['bdg_shop',b.shop],['bdg_heroes',b.heroes]].forEach(([id,n])=>{const e=$(id);if(e)e.style.display=n?'flex':'none';});
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(!g)return;
  const [s,t]=g.dataset.go.split(':');if(t)shopTab=t;openScreen(s);
});

/* build headers + nav */
document.querySelectorAll('.screen[data-title]').forEach(s=>{
  if(s.id==='home'||s.id==='fight'||s.id==='prep')return;
  const id=s.id,h=el('div','hdr');
  if(BACK[id]){const b=el('button','btn sm back','&#8249; Back');b.onclick=()=>openScreen(BACK[id]);h.appendChild(b);}
  h.appendChild(el('div','htitle',s.dataset.title));
  h.appendChild(el('div','hcur',pillsHTML()));
  s.insertBefore(h,s.firstChild);
});
(function(){
  const n=$('nav');
  NAV.forEach(([id,l,i])=>{
    const b=el('button','nb'+(id==='home'?' center':''),'<span class="nbi">'+ic(i)+'</span><span class="nbl">'+l+'</span>'+((id==='shop'||id==='tasks'||id==='heroes')?'<span class="dot" id="bdg_'+id+'"></span>':''));
    b.dataset.s=id;b.onclick=()=>openScreen(id);n.appendChild(b);
  });
})();

let curScreen='home';
function openScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');curScreen=id;
  document.body.dataset.nav=NAVSCREENS.has(id)?'1':'0';
  document.querySelectorAll('#nav .nb').forEach(b=>b.classList.toggle('on',b.dataset.s===id));
  dayFix();if(id==='home'&&typeof layoutHome==='function')layoutHome();
  if(DRAW[id])DRAW[id]();
  syncCur();
  const sc=$(id).querySelector('.scroll');if(sc&&id!=='campaign')sc.scrollTop=0;
}

