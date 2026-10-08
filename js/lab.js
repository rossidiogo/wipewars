/* ================= Lab: test every hero / monster / boss / ultimate + visual gallery (dev tool for the owner; no progress is changed) ================= */
window.LAB=null;
const LAB_STATUS={tank:'Aprovado',dps:'Aprovado',ze:'Aprovado',donnie:'Provisório (Jacquin 87-90)',chavoso:'Provisório (Jacquin 87-90)',rafinha:'Provisório (Jacquin 87-90)',samuel:'Provisório (Jacquin 86)',glem:'Provisório (desenhado por código; humano + forma tigre, Jacquin pendente)',rubens:'Provisório (desenhado por código; Jacquin 85, prevê ~86 após últimos ajustes)'};
const labSt=r=>LAB_STATUS[r]||'Placeholder - aguarda fotos/arte';
function labForm(team){const f={},used=new Set();team.forEach(k=>{const H=HEROES[k],pref=H.cls==='tank'?[1,0,2,4,3,5]:(H.rng||H.cls==='sup')?[4,5,3,1,0,2]:[0,2,1,3,5,4];f[k]=pref.find(x=>!used.has(x));used.add(f[k]);});return f;}
const labCfg={team:['tank','dps','samuel','rubens'],mons:['tp','clorox','boss'],chap:0,stg:1,god:true,immortal:true,mana:true};
function labStart(){
  if(!labCfg.team.length||!labCfg.mons.length){toast('Escolha pelo menos 1 herói e 1 monstro');return;}
  window.LAB={team:labCfg.team.slice(0,6),mons:labCfg.mons.slice(0,6),chap:labCfg.chap,stg:labCfg.stg,god:labCfg.god,immortal:labCfg.immortal,mana:labCfg.mana};
  closeModal();$('result').classList.remove('on');openScreen('fight');setup();speed=1;$('spd').textContent='x1';
}
function labRespawn(){if(!window.LAB||LAB._rs)return;LAB._rs=1;setTimeout(()=>{if(window.LAB){LAB._rs=0;setup();}},1400);}
function openLab(tab){
  const body=el('div','labbox');
  const tabs=el('div','tabs');
  tab=tab||'fight';
  const mkTab=(k,l)=>{const b=el('button','tab'+(tab===k?' on':''),l);b.onclick=()=>{closeModal();openLab(k);};tabs.appendChild(b);};
  mkTab('fight','Laboratório de luta');mkTab('gal','Galeria (review visual)');body.appendChild(tabs);
  const again=()=>{closeModal();openLab(tab);};
  if(tab==='fight'){
    const chips=(items,sel,toggle,lab)=>{const w=el('div','labchips');items.forEach(k=>{const b=el('button','btn sm'+(sel(k)?' primary':''),lab(k));b.onclick=()=>{toggle(k);again();};w.appendChild(b);});return w;};
    body.appendChild(el('div','sect','Heróis (até 6) <small>qualquer um, mesmo sem ter recrutado</small>'));
    body.appendChild(chips(HIDS,k=>labCfg.team.includes(k),k=>{const i=labCfg.team.indexOf(k);if(i>=0)labCfg.team.splice(i,1);else if(labCfg.team.length<6)labCfg.team.push(k);},k=>HEROES[k].n));
    body.appendChild(el('div','sect','Inimigos (toque para adicionar, até 6; toque em "limpar" para zerar)'));
    const cnt=k=>labCfg.mons.filter(x=>x===k).length;
    body.appendChild(chips(Object.keys(KINDS),k=>cnt(k)>0,k=>{if(labCfg.mons.length<6)labCfg.mons.push(k);},k=>KINDS[k].n+(cnt(k)>0?' x'+cnt(k):'')));
    const clr=el('button','btn sm','Limpar inimigos');clr.onclick=()=>{labCfg.mons=[];again();};body.appendChild(clr);
    body.appendChild(el('div','sect','Cenário'));
    const bg=el('div','labchips');for(let i=0;i<5;i++){const b=el('button','btn sm'+(labCfg.chap===i?' primary':''),'Cap. '+(i+1));b.onclick=()=>{labCfg.chap=i;again();};bg.appendChild(b);}body.appendChild(bg);
    body.appendChild(el('div','sect','Opções'));
    const opt=(l,key)=>{const r=el('div','srow','<span>'+l+'</span>');const b=el('button','btn sm'+(labCfg[key]?' primary':''),labCfg[key]?'Ligado':'Desligado');b.onclick=()=>{labCfg[key]=!labCfg[key];again();};r.appendChild(b);body.appendChild(r);};
    opt('Heróis não morrem','god');opt('Inimigos imortais (bom para ver animações)','immortal');opt('Ultimates sempre prontas','mana');
    body.appendChild(el('div','sub dim','Na luta, o botão de velocidade alterna 1 / 0.5 / 0.25 / 2. Toque nas ults embaixo para disparar. "Voltar" sai do laboratório. Nada disso altera seu progresso.'));
    const go=el('button','btn primary wide','Começar luta de teste');go.onclick=labStart;body.appendChild(go);
  }else{
    const card=(inner)=>{const c=el('div','galc');c.innerHTML=inner;return c;};
    body.appendChild(el('div','sect','Heróis'));
    const g1=el('div','galg');
    HIDS.forEach(k=>{const H=HEROES[k],W=WEAPONS[k],c=card('<div class="galsp"></div><b>'+H.n+'</b><small>'+H.role+' · '+H.sub+'</small><small>Arma: '+W.ico+' '+W.n+'</small><small>Ult: '+ULT[k].n+'</small><small class="galst">'+labSt(k)+'</small>');
      try{spriteArt(c.querySelector('.galsp'),k,1.25,true);}catch(e){}g1.appendChild(c);});
    body.appendChild(g1);
    body.appendChild(el('div','sect','Monstros e chefes'));
    const g2=el('div','galg');
    Object.keys(KINDS).forEach(k=>{const K=KINDS[k],c=card('<div class="galsp"></div><b>'+K.n+'</b><small>'+['Normal','Mágico','Raro','Chefe'][K.r]+' · vida '+K.hp+' · ataque '+K.atk+'</small>');
      try{spriteArt(c.querySelector('.galsp'),K.key,Math.min(1.2,1.2/Math.max(.6,K.m)),true);}catch(e){}g2.appendChild(c);});
    body.appendChild(g2);
    body.appendChild(el('div','sect','Cenários'));
    const g3=el('div','galg wide');
    BGCH.forEach((b,i)=>g3.appendChild(card('<div class="galbg" style="background-image:url('+b+')"></div><b>Capítulo '+(i+1)+' · '+ECON.chapters[i].n+'</b>')));
    body.appendChild(g3);
  }
  openModal(body,{title:'Laboratório'});
}
(function(){const s=document.createElement('style');s.textContent=".labbox{max-height:70vh;overflow:auto}.labchips{display:flex;flex-wrap:wrap;gap:5px;margin:4px 0 8px}.galg{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.galg.wide{grid-template-columns:1fr}.galc{background:rgba(0,0,0,.3);border:1px solid rgba(214,170,90,.25);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:2px;align-items:center;text-align:center}.galc small{font-size:11px;opacity:.8}.galc .galst{color:#ffd84a}.galsp{min-height:90px;display:flex;align-items:flex-end;justify-content:center}.galbg{width:100%;height:110px;background-size:cover;background-position:center;image-rendering:pixelated;border-radius:6px}";document.head.appendChild(s);})();
if(/[?&]lab\b/.test(location.search))window.addEventListener('load',()=>setTimeout(()=>openLab('fight'),600));
