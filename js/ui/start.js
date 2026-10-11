/* ---------- start ---------- */
dayFix();
openScreen('home');
setTimeout(()=>{
  const p=pending();
  if(p.m>=60){
    const b=el('div','rew');
    b.innerHTML='<div class="sub">You were away for <b>'+Math.floor((Date.now()+save.skip-save.last)/3600000)+'h '+Math.floor((Date.now()+save.skip-save.last)/60000%60)+'m</b>. Your heroes kept fighting.</div><div class="chips">'+chips({gold:p.g})+'</div>';
    const c=el('button','btn primary','Collect now');c.onclick=()=>{closeModal();$('claim').click();};b.appendChild(c);
    const l=el('button','btn sm','Later');l.onclick=closeModal;b.appendChild(l);
    openModal(b,{title:'Welcome back',cls:'rewm'});
  }
},500);
setInterval(()=>{if(curScreen==='shop'&&shopTab==='deals'&&!$('modal').classList.contains('on')){const b=document.querySelector('.dealbar b');if(b)b.textContent=untilMidnight();}},30000);

