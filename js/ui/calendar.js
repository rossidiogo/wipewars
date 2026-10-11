/* ---------- calendar ---------- */
DRAW.cal=function(){
  const st=calInfo(),box=$('calBody');box.innerHTML='';
  box.appendChild(el('div','sub center','Log in every day to keep your streak. Missing a day restarts it.'));
  const g=el('div','calgrid');
  ECON.calendar.forEach((r,d)=>{
    const claimed=d<st.i||(st.i===d&&!st.can&&false),today=d===st.i&&st.can,cl=d<st.i;
    const c=el('div','panel day'+(cl?' done':'')+(today?' today':'')+(d===6?' big':''));
    c.innerHTML='<div class="dn">Day '+(d+1)+'</div><div class="dr">'+chips(r)+'</div>'+(cl?'<div class="dc">'+ic('ui_check')+'</div>':'');
    g.appendChild(c);
  });
  box.appendChild(g);
  const b=el('button','btn primary wide',st.can?'Claim day '+(st.i+1):'Come back tomorrow');b.disabled=!st.can;
  b.onclick=()=>{
    const c=save.cal;c.streak=(c.last===yesterdayKey()?c.streak:0)+1;c.last=dayKey();
    const out=give(Object.assign({xp:10},ECON.calendar[st.i]));syncCur();DRAW.cal();showRewards('Daily Login',out,'Day '+(st.i+1)+' reward');
  };
  box.appendChild(b);
};

/* mail: migrated to Preact, see src/screens/mail */

