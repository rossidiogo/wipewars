/* ================= dom: helpers that touch the page (elements, sound, toast, modal, item tiles, reward popups) ================= */
const $=id=>document.getElementById(id);
const ic=(n,c)=>'<img class="ic '+(c||'')+'" src="'+ICO[n==='gems'?'gem':n]+'" alt="">';
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}

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
