/* procedural chiptune: a slow minor loop, scheduled a bar ahead */
window.Music=(function(){
  const N=n=>440*Math.pow(2,(n-69)/12);
  const CH=[[45,0,3,7],[41,0,4,7],[43,2,5,9],[40,0,3,7]]; // Am F G Em-ish roots + offsets
  const MEL=[[0,7,3,7,12,7,3,7],[0,5,9,5,12,9,5,9],[2,7,11,7,14,11,7,11],[0,4,7,4,12,7,4,7]];
  let on=false,timer=null,bar=0,next=0,g=null;
  function ctx(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;AC=new C();}if(AC.state==='suspended')AC.resume();return true;}
  function note(f,t,d,type,v){const o=AC.createOscillator(),gg=AC.createGain();o.type=type;o.frequency.value=f;gg.gain.setValueAtTime(v,t);gg.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gg);gg.connect(g);o.start(t);o.stop(t+d+.02);}
  function sched(){
    if(!on)return;
    const spb=.3;
    while(next<AC.currentTime+.8){
      const c=CH[bar%4],m=MEL[bar%4];
      for(let i=0;i<8;i++){
        const t=next+i*spb/2;
        if(i%2===0)note(N(c[0]+(i%4===2?12:0)),t,.28,'triangle',.07);
        note(N(69-12+c[0]-45+m[i]+ (bar%8>=4?12:0)),t,.16,'square',.018);
      }
      next+=spb*4;bar++;
    }
  }
  return{
    start(){if(on||!save.music||!ctx())return;on=true;g=AC.createGain();g.gain.value=1;g.connect(AC.destination);next=AC.currentTime+.05;sched();timer=setInterval(sched,250);},
    stop(){on=false;clearInterval(timer);if(g){try{g.disconnect();}catch(e){}g=null;}},
    set(v){save.music=v;persist();v?this.start():this.stop();}
  };
})();
