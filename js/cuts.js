/* Chapter cutscenes (PLACEHOLDERS): plays the first time a chapter is entered in a session. Real animations + lore come later: replace panels with {anim:...}. */
const SEEN_CH={};
const CUTS=[
  {panels:[{t:'Every legend starts somewhere unglamorous.'},{t:'At the end of the hall, someone with a perfectly normal-sized head waits.',spr:'bh1',m:1.6},{t:'Tonight it starts in the bathroom, and the toilet paper has opinions.'},{t:'[Placeholder cutscene: chapter 1]'}]},
  {panels:[{t:'The cold came first. Then the condoms.'},{t:'Something very large, with a very large head, is waiting at the bottom of the freezer.',spr:'bh2',m:1.6},{t:'[Placeholder cutscene: chapter 2]'}]},
  {panels:[{t:'The workshop smells like sawdust. The machines are already running.'},{t:'[Placeholder cutscene: chapter 3]'}]},
  {panels:[{t:'The pizza was fine until the first sharp turn.'},{t:'Then the box slid off your lap, and the pizza had feelings about it.'},{t:'[Placeholder cutscene: chapter 4]'}]},
  {panels:[{t:'Down the stairs, down, down. The head has grown.'},{t:'[Placeholder cutscene: chapter 5]'}]}
];
function playCut(c,done){
  const data=CUTS[c];if(!data){done();return;}
  const root=document.createElement('div');root.id='cut';
  root.innerHTML='<div class="cbg" style="background-image:url('+BGCH[c]+')"></div><div class="cvig"></div><div class="cbar t"></div><div class="cbar b"></div>'
   +'<div class="cchap"><small>Chapter '+(c+1)+'</small><b>'+ECON.chapters[c].n+'</b></div><div class="cspr"></div><div class="ctext"></div><div class="chint">Tap to continue</div><button class="btn sm cskip">Skip</button>';
  document.body.appendChild(root);
  let i=0,typing=null,fin=false;
  const tx=root.querySelector('.ctext'),sp=root.querySelector('.cspr');
  function end(){if(fin)return;fin=true;clearInterval(typing);root.classList.add('out');setTimeout(()=>{root.remove();done();},350);}
  function show(){
    const p=data.panels[i];tx.textContent='';sp.innerHTML='';
    if(p.spr&&SP[p.spr]){const d=document.createElement('div');sp.appendChild(d);spriteArt(d,p.spr,p.m||1.5);}
    let k=0;clearInterval(typing);typing=setInterval(()=>{k++;tx.textContent=p.t.slice(0,k);if(k>=p.t.length)clearInterval(typing);},26);
  }
  root.onclick=e=>{
    if(fin)return;
    if(e.target.classList.contains('cskip')){end();return;}
    const p=data.panels[i];
    if(tx.textContent.length<p.t.length){clearInterval(typing);tx.textContent=p.t;return;}
    i++;if(i>=data.panels.length)end();else show();
  };
  show();
}
