/* ---------- Julia tutorial ---------- */
const TIPS={
  home:['Hi, I’m <b>Julia</b>! I’ll show you around Wipe Wars. Ready?','Tap <b>Battle</b> to start fighting. Your heroes attack on their own — no tapping needed.','I left you <b>10 Recruit Tickets</b>! Open <b>Recruit</b> on the right side to meet more friends for your team.','Even when you close the game, your heroes keep earning <b>Chaos Orbs</b> (up to 8 hours). Come back and claim the chest!','Use the buttons along the bottom to visit <b>Heroes</b>, the <b>Bag</b>, the Shop and more. I’ll pop in with tips on each one.'],
  fight:['When a hero’s <b>mana bar</b> fills up they cast their <b>ultimate</b> on their own. Want to time it yourself? Turn off <b>Auto ultimates</b> under the field and tap their portrait.','Beat a stage’s <b>Big Head</b> boss to unlock the next one. Lose? Level up and try again!'],
  heroes:['Spend Chaos Orbs to <b>level up</b> your heroes. A hero can’t go above your player level.','Build a team of up to 4 on the <b>Formation</b> screen. <b>Tanks</b> soak damage, <b>ranged DPS</b> can hit the back row, and <b>supports</b> heal, buff, or curse.'],
  recruit:['Every pull brings a friend. The first time you pull someone, they join your crew!','Pulling someone you already have gives <b>shards</b>. Collect enough to give them more <b>stars</b> (+10% stats each).','A <b>new friend is guaranteed</b> within 10 pulls, and your 2 <b>favorites</b> show up twice as often.'],
  skills:['Every <b>level-up</b> gives a hero a <b>skill point</b>, and every star gives two. Spend them here to shape how that hero fights.','Each branch opens from the top down. Put <b>12 points</b> in the tree to unlock a <b>keystone</b>: a big change to the hero’s ultimate or attacks. You can reset for free, so experiment!'],
  bag:['Gear comes in 4 tiers. Fuse two identical pieces to raise their stars.','Tap <b>Equip best</b> to gear everyone up fast. Matching <b>set pieces</b> give bonus stats!']
};
(function(){
  const d=document.createElement('div');d.id='tip';document.body.appendChild(d);
  let tm=null,tk=null,run=0;
  function stop(){d.classList.remove('on');clearInterval(tm);clearTimeout(tk);run++;}
  function play(id,force){
    const steps0=TIPS[id];if(!steps0)return;const steps=steps0.map(s=>window.t?t(s):s);
    if(!force&&save.tut&&save.tut[id])return;
    save.tut=save.tut||{};save.tut[id]=1;persist();
    const my=++run;let i=0;
    d.innerHTML='<img class="jp" alt="Julia"><div class="jb"><div class="jn">Julia</div><div class="jt"></div><div class="jf"><span class="jd"></span><button class="btn sm ghost jskip">Skip</button><button class="btn sm primary jnext">Next</button></div></div>';
    const img=d.querySelector('.jp'),txt=d.querySelector('.jt'),nx=d.querySelector('.jnext'),sk=d.querySelector('.jskip'),dots=d.querySelector('.jd');
    img.src=AVA.jul0;d.classList.add('on');
    function say(){
      clearInterval(tm);const full=steps[i];
      dots.textContent=steps.map((_,k)=>k===i?'●':'○').join(' ');
      nx.textContent=i===steps.length-1?'Got it':'Next';
      const plain=full.replace(/<[^>]+>/g,'');let n=0;txt.innerHTML='';
      tm=setInterval(()=>{
        if(my!==run){clearInterval(tm);return;}
        n+=2;const done=n>=plain.length;
        if(done){txt.innerHTML=full;img.src=AVA.jul0;clearInterval(tm);return;}
        txt.textContent=plain.slice(0,n);img.src=(id==='home'&&i===0)?((n/2)%2?AVA.jul3:AVA.jul0):((n/2)%2?AVA.jul1:AVA.jul0);
      },35);
    }
    nx.onclick=()=>{if(my!==run)return;if(txt.innerHTML!==steps[i]&&txt.textContent.length<steps[i].replace(/<[^>]+>/g,'').length){clearInterval(tm);txt.innerHTML=steps[i];img.src=AVA.jul0;return;}i++;if(i>=steps.length)stop();else say();};
    sk.onclick=stop;
    say();
    (function blink(){tk=setTimeout(()=>{if(my!==run)return;const o=img.src;img.src=AVA.jul2;setTimeout(()=>{if(my===run&&img.src===AVA.jul2)img.src=AVA.jul0;},140);blink();},2600);})();
  }
  window.showTip=id=>play(id,false);
  window.replayTutorial=()=>{save.tut={};persist();stop();if(curScreen!=='home')openScreen('home');setTimeout(()=>play('home',true),300);};
  window.maybeTutorial=()=>setTimeout(()=>showTip('home'),900);
  const oo=openScreen;
  openScreen=function(id){oo(id);stop();if(id!=='home')setTimeout(()=>showTip(id),700);};
})();
