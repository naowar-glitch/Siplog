/* home2.js: profile page, notifications, new tab bar, history + statistics, smoother scroll */
(function(){
if(document.getElementById('p-prof')||!document.getElementById('av2'))return;
const css=`
#aart{display:none}
[data-at] nav,[data-ct] nav{-webkit-backdrop-filter:none;backdrop-filter:none}
body{overscroll-behavior-y:contain}
#av{cursor:pointer}
#p-prof .pfh{flex-direction:column;text-align:center}
#p-prof .avw .av{width:120px;height:120px;font-size:44px}
#p-prof .pnm{justify-content:center}
#p-prof .pfi{width:100%}
#p-prof .ned{justify-content:center}
.pfs .li small{font-weight:400;color:var(--mu)}
.act{background:linear-gradient(135deg,#10b981,#059669);margin-top:8px;display:inline-block}
.nhr{display:flex;align-items:center;justify-content:space-between;margin:4px 0 6px}
.nt{display:flex;gap:12px;padding:16px;margin-top:12px;border-radius:24px;background:var(--cd);border:1px solid var(--bd);box-shadow:var(--sh)}
.nti{width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;flex:none}
.ntb{flex:1;min-width:0}
.nth{display:flex;justify-content:space-between;align-items:center;gap:8px}
.nth b{font-size:17px}
.nw{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(16,185,129,.2);color:#10b981}
.spb .ntb p{margin:6px 0 0;font-size:15px;line-height:1.5;color:var(--tx)}
`;
const sty=document.createElement('style');sty.textContent=css;document.head.appendChild(sty);
/* tab bar: Clock | Calendar | Home | History | Settings */
const nav=document.querySelector('nav'),Q=s=>nav.querySelector(s);
const oldHome=Q('button[data-p="home"]'),fab=Q('.fab'),calBtn=Q('button[data-p="hist"]'),statBtn=Q('button[data-p="stat"]'),setBtn=Q('button[data-p="set"]');
const clockSvg=fab.querySelector('svg');
clockSvg.removeAttribute('style');
const clk=document.createElement('button');
clk.dataset.p='alarm';clk.onclick=()=>show('alarm');
clk.appendChild(clockSvg);clk.appendChild(document.createTextNode('Clock'));
calBtn.dataset.p='cal';calBtn.onclick=()=>show('cal');
[...calBtn.childNodes].forEach(n=>{if(n.nodeType===3)n.nodeValue='Calendar'});
const his=document.createElement('button');
his.dataset.p='hist';his.onclick=()=>show('hist');
his.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>History';
fab.dataset.p='home';fab.removeAttribute('data-o');fab.onclick=()=>show('home');
fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
nav.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
fab.classList.add('on');
oldHome.remove();statBtn.remove();
nav.append(clk,calBtn,fab,his,setBtn);
/* history + statistics together */
const hs=$('hist'),stSec=$('stat');
const tabs=document.createElement('div');
tabs.className='sg2';tabs.style.marginBottom='14px';
tabs.innerHTML='<button class="on" data-h="0">Day by day</button><button data-h="1">Statistics</button>';
const hcard=hs.querySelector('.card');
const box=document.createElement('div');box.id='hstats';box.style.display='none';
[...stSec.children].filter(c=>!c.classList.contains('top')).forEach(c=>box.appendChild(c));
hs.querySelector('.top').after(tabs);hs.appendChild(box);
tabs.onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
 hcard.style.display=b.dataset.h==='0'?'':'none';
 box.style.display=b.dataset.h==='1'?'':'none'};
/* profile pages */
nav.insertAdjacentHTML('beforebegin',`<div class="sp" id="p-prof"><div class="sph"><button class="bk" data-bk>‹</button><b>My Profile</b></div><div class="spb" id="pfb"></div></div>
<div class="sp" id="p-pinfo"><div class="sph"><button class="bk" data-bk>‹</button><b>Personal Information</b></div><div class="spb">
<div class="card ctr" style="margin-top:0"><div class="av" id="av3" style="width:110px;height:110px;font-size:40px;margin:0 auto"></div>
<button class="btn" id="pic" style="margin-top:14px">📷 Change photo</button><button class="btn" id="pir" style="color:var(--rd)">🗑️ Remove photo</button></div>
<div class="card"><h3>Display name</h3><input id="pin" maxlength="24" placeholder="Your name" autocomplete="off"><button class="save" id="pis">Save</button></div></div></div>`);
const card=$('av2').closest('.card');
$('pfb').appendChild(card);
card.querySelector('.pfh').insertAdjacentHTML('afterend','<div class="card list pfs" style="margin-top:16px;box-shadow:none"><button class="li" id="pr1"><span class="ic">👤</span><span>Personal Information<br><small>Your name and profile photo</small></span></button><button class="li nr" id="pr2"><span class="ic">📅</span><span>Member Since<br><small>Your joining date</small></span><em id="pr2v"></em></button></div>');
$('pms').insertAdjacentHTML('afterend','<div class="mu" style="margin-top:6px">SipLog User</div><span class="tag act" id="pact">Active User</span>');
$('av').onclick=()=>openP('p-prof');
$('pr1').onclick=()=>openP('p-pinfo');
$('pr2').onclick=()=>{const d=Math.max(1,Math.round((Date.now()-S.since)/864e5));toast('With SipLog for '+d+(d===1?' day':' days'))};
$('pic').onclick=()=>$('ph').click();
$('pir').onclick=()=>{if(S.photo){delete S.photo;save();render()}};
$('pis').onclick=()=>{const v=$('pin').value.trim();if(!v){toast('Please enter a name');return}S.name=v.slice(0,24);save();render();toast('Saved')};
document.querySelectorAll('#p-prof [data-bk],#p-pinfo [data-bk]').forEach(b=>b.onclick=()=>history.back());
/* notifications */
function bellR(){
 const g=G(),T=tot(today()),y=new Date();y.setDate(y.getDate()-1);
 const Y=tot(dk(y.getTime())),f=Math.min(100,Math.round(T.ml/g*100)),s=pstats(),a=nudges();
 const L=[[s.tg>0?1:0,1,'First Glass'],[s.best,7,'7 Day Streak'],[s.best,30,'30 Day Streak'],[s.done,10,'Goal Master'],[s.best,14,'Consistency Champion']];
 const open=L.filter(x=>x[0]<x[1]).sort((p,q)=>q[0]/q[1]-p[0]/p[1])[0];
 let ins=!S.size?'Choose your glass size to start tracking.':T.ml>=g?'Goal reached! You drank '+lit(T.ml)+' L today.':'You are at '+f+"% of today's goal, "+lit(g-T.ml)+' L to go.';
 if(S.size&&T.ml>0&&T.ml<g&&Y.ml>0)ins+=' Yesterday you drank '+lit(Y.ml)+' L.';
 const rem=a.find(x=>x[2]),last=a.find(x=>x[0]==='🕒')||a.find(x=>x[0]==='🎉'),nx=nextTxt();
 const I=[
  ['✨','Smart Insight','Just now',ins,'rgba(124,108,240,.25)',f<100&&!!S.size],
  ['🏆','Achievements','Progress',open?open[2]+': '+Math.min(open[0],open[1])+' of '+open[1]+'. Keep going!':'All achievements unlocked!','rgba(251,191,36,.25)',false],
  ['💧','Hydration Reminder','Now',rem?rem[1]:last?last[1]:'Keep sipping through the day.','rgba(56,189,248,.25)',!!rem],
  ['⏰','Alarms','Clock tab',nx==='No alarm is on'?'No alarm is on. Set one in the Clock tab.':'Next alarm: '+nx,'rgba(244,114,182,.25)',false],
  ['📅','Daily Summary','Yesterday',Y.ml>0?'Yesterday: '+Y.g+' '+pl(Y.g)+', '+lit(Y.ml)+' L ('+Math.round(Y.ml/g*100)+'% of goal). '+(Y.ml>=g?'Goal met.':'Goal not met.'):'No water was logged yesterday.','rgba(16,185,129,.22)',false]];
 const n=I.filter(x=>x[5]).length;
 $('nl2').className='';$('nl2').style.margin='0';
 $('nl2').innerHTML='<div class="nhr"><div class="mu2">Your SipLog activity</div><span class="tag">'+n+' new</span></div>'+I.map(x=>'<div class="nt"><div class="nti" style="background:'+x[4]+'">'+x[0]+'</div><div class="ntb"><div class="nth"><b>'+x[1]+'</b>'+(x[5]?'<span class="nw">New</span>':'')+'</div><div class="mu2">'+x[2]+'</div><p>'+x[3]+'</p></div></div>').join('')}
const _sp=shP;
shP=function(){_sp();if(stk[stk.length-1]==='p-bell')bellR()};
const _r=render;
render=function(){_r();
 avatar($('av3'));
 if(document.activeElement!==$('pin'))$('pin').value=S.name||'';
 $('pr2v').textContent=new Date(S.since||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
 $('pact').textContent=S.log.some(e=>e.t>Date.now()-6048e5)?'Active User':'Getting started'};
render();
})();
