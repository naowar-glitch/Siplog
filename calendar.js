/* calendar.js: calendar tab, months view, settings, 3 themes */
(function(){
if(document.getElementById('cal')||!document.getElementById('p-prof'))return;
if(!S.cal)S.cal={th:0,ws:0,we:true,dots:true,amt:false};
const C=()=>S.cal,MIN=1990,MAX=2050;
const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const CT=[['Rose Quartz','linear-gradient(160deg,#fb7185,#fbcfe8)'],['Mint Glass','linear-gradient(160deg,#10b981,#a7f3d0)'],['Midnight Gold','linear-gradient(160deg,#1e293b,#f59e0b)']];
const n0=new Date();
let vy=n0.getFullYear(),vm=n0.getMonth(),sY=vy,sM=vm,sD=n0.getDate(),mode=0,X0=0,Y0=0;
const css=`
:root[data-ct="0"]{--bg:linear-gradient(160deg,#ffe4ec,#fbcfe8 45%,#fda4af);--tx:#4a1228;--mu:#9d4a66;--ac:#e11d48;--ac2:#fb7185;--g:linear-gradient(135deg,#f43f5e,#fb923c);--pg:rgba(244,63,94,.4);--cd:rgba(255,255,255,.55);--soft:rgba(255,255,255,.6);--bd:rgba(225,29,72,.18);--sh:0 10px 28px rgba(190,18,60,.18),inset 0 1px 0 rgba(255,255,255,.8);--op:#ffe4ec;--rd:#be123c}
:root[data-ct="1"]{--bg:linear-gradient(160deg,#d1fae5,#a7f3d0 45%,#6ee7b7);--tx:#064e3b;--mu:#047857;--ac:#059669;--ac2:#14b8a6;--g:linear-gradient(135deg,#10b981,#06b6d4);--pg:rgba(16,185,129,.4);--cd:rgba(255,255,255,.55);--soft:rgba(255,255,255,.6);--bd:rgba(5,150,105,.2);--sh:0 10px 28px rgba(5,120,90,.18),inset 0 1px 0 rgba(255,255,255,.8);--op:#d1fae5;--rd:#be123c}
:root[data-ct="2"]{--bg:linear-gradient(160deg,#0f172a,#1e293b 55%,#422006);--tx:#fef3c7;--mu:#d6c28a;--ac:#fbbf24;--ac2:#f59e0b;--g:linear-gradient(135deg,#fbbf24,#f97316);--pg:rgba(251,191,36,.4);--cd:rgba(255,255,255,.07);--soft:rgba(255,255,255,.1);--bd:rgba(251,191,36,.25);--sh:0 10px 28px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.15);--op:#1e293b;--rd:#fb7185}
.chd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.cti{font-size:20px;font-weight:800;background:none;color:var(--tx)}
.cwk{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:12px;color:var(--mu);font-weight:700;margin-bottom:6px}
.cgd{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;touch-action:pan-y}
.dc{position:relative;min-height:50px;border-radius:14px;background:var(--soft);display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:15px;gap:2px;color:var(--tx)}
.dc.we{color:var(--rd)}
.dc.t{background:var(--g);color:#fff}
.dc.s{box-shadow:0 0 0 2px var(--ac)}
.dc i{width:6px;height:6px;border-radius:50%;background:#f59e0b}
.dc i.ok{background:#10b981}
.dc small{font-size:9px;font-weight:600;opacity:.8}
.mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mt{padding:18px 8px;border-radius:18px;background:var(--soft);font-weight:700;color:var(--tx)}
.mt.cur{box-shadow:0 0 0 2px var(--ac)}
.mt.now{background:var(--g);color:#fff}
`;
const sty=document.createElement('style');sty.textContent=css;document.head.appendChild(sty);
document.querySelector('main').insertAdjacentHTML('beforeend',`<section id="cal" class="pg">
 <div class="top"><button class="bk" id="calg">⚙️</button><b class="pt">Calendar</b><button class="chip" id="ctd"></button></div>
 <div class="ctabs" id="cvt"><button class="on" data-v="0">Dates</button><button data-v="1">Months</button></div>
 <div id="cv1">
  <div class="card" style="margin-top:0"><div class="chd"><button class="bk" id="cpm">‹</button><button class="cti" id="cti"></button><button class="bk" id="cnm">›</button></div>
  <div class="cwk" id="cwk"></div><div class="cgd" id="cgd"></div></div>
  <div class="card" id="cpn"></div>
 </div>
 <div id="cv2" style="display:none"><div class="card" style="margin-top:0"><div class="chd"><button class="bk" id="cpy">‹</button><b class="cti" id="cyr"></b><button class="bk" id="cny">›</button></div><div class="mgrid" id="cmg"></div></div></div>
</section>`);
document.querySelector('nav').insertAdjacentHTML('beforebegin',`<div class="sp" id="p-calset"><div class="sph"><button class="bk" data-bk>‹</button><b>Calendar settings</b></div><div class="spb">
<div class="mu sec" style="margin-top:0">Theme</div><div class="card" style="margin-top:0"><div class="thm" id="cthm"></div></div>
<div class="mu sec">Calendar</div><div class="card list" style="margin-top:0">
<div class="fr2"><span class="ic">📆</span><span>Week starts on</span></div><div class="sg2" id="cws"></div>
<button class="li nr" id="cswe" style="margin-top:8px"><span class="ic">🎨</span><span>Highlight weekends</span><span class="sw" id="swe"><i></i></span></button>
<button class="li nr" id="csdt"><span class="ic">🟢</span><span>Show goal dots</span><span class="sw" id="sdt"><i></i></span></button>
<button class="li nr" id="csam"><span class="ic">💧</span><span>Show water per day</span><span class="sw" id="sam"><i></i></span></button>
</div></div></div>`);
function tots(){const m={};for(const e of S.log){const k=dk(e.t),x=m[k]||(m[k]={g:0,ml:0});x.g+=e.g;x.ml+=e.ml}return m}
function grid(){
 const ws=C().ws,first=new Date(vy,vm,1).getDay(),lead=(first-ws+7)%7,dim=new Date(vy,vm+1,0).getDate();
 const M=tots(),g=G(),T=new Date();let h='';
 for(let i=0;i<lead;i++)h+='<div></div>';
 for(let d=1;d<=dim;d++){
  const dt=new Date(vy,vm,d),x=M[dk(dt.getTime())],wd=dt.getDay(),c=['dc'];
  if(vy===T.getFullYear()&&vm===T.getMonth()&&d===T.getDate())c.push('t');
  if(vy===sY&&vm===sM&&d===sD)c.push('s');
  if(C().we&&(wd===0||wd===6))c.push('we');
  const dot=C().dots&&x&&x.ml>0?'<i class="'+(x.ml>=g?'ok':'')+'"></i>':'';
  const amt=C().amt&&x&&x.ml>0?'<small>'+lit(x.ml)+'</small>':'';
  h+='<button class="'+c.join(' ')+'" data-d="'+d+'">'+d+dot+amt+'</button>'}
 $('cgd').innerHTML=h;
 $('cwk').innerHTML=[0,1,2,3,4,5,6].map(i=>'<div>'+DW[(ws+i)%7]+'</div>').join('')}
function panel(){
 const d=new Date(sY,sM,sD),k=dk(d.getTime()),x=tots()[k]||{g:0,ml:0},g=G(),T=new Date(),td=new Date(T.getFullYear(),T.getMonth(),T.getDate());
 const es=S.log.filter(e=>dk(e.t)===k).sort((a,b)=>b.t-a.t);
 $('cpn').innerHTML='<h3>'+d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</h3>'+(d>td?'<p class="mu2">An upcoming day. Nothing to log yet.</p>':
  '<div class="tiles" style="margin-top:0"><div class="tl"><b>'+x.g+'</b><small>'+pl(x.g)+'</small></div><div class="tl"><b>'+lit(x.ml)+' L</b><small>Water</small></div><div class="tl"><b>'+Math.round(Math.min(1,x.ml/g)*100)+'%</b><small>'+(x.ml>=g?'Goal met':'of goal')+'</small></div></div><div style="margin-top:8px">'+(es.length?es.map(e=>rowH(e,false)).join(''):'<p class="mu2">No water logged on this day.</p>')+'</div>')}
function months(){
 const T=new Date();
 $('cmg').innerHTML=MN.map((n,i)=>'<button class="mt'+(vy===vy&&i===vm?' cur':'')+(vy===T.getFullYear()&&i===T.getMonth()?' now':'')+'" data-m="'+i+'">'+n.slice(0,3)+'</button>').join('')}
function calR(){
 $('ctd').textContent=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'});
 $('cti').textContent=MN[vm]+' '+vy;$('cyr').textContent=vy;
 $('cv1').style.display=mode===0?'block':'none';$('cv2').style.display=mode===1?'block':'none';
 document.querySelectorAll('#cvt button').forEach(b=>b.classList.toggle('on',+b.dataset.v===mode));
 if(mode===0){grid();panel()}else months()}
function mv(n){
 vm+=n;while(vm<0){vm+=12;vy--}while(vm>11){vm-=12;vy++}
 if(vy<MIN||vy>MAX){vy=Math.min(MAX,Math.max(MIN,vy));vm=vy===MIN?0:11;toast('Calendar range is 1990 to 2050')}
 calR()}
function setR(){
 $('cthm').innerHTML=CT.map((t,i)=>'<button class="'+(C().th===i?'on':'')+'" data-t="'+i+'" style="background:'+t[1]+'">'+t[0]+'</button>').join('');
 $('cws').innerHTML=[[0,'Sunday'],[1,'Monday'],[6,'Saturday']].map(x=>'<button data-w="'+x[0]+'" class="'+(C().ws===x[0]?'on':'')+'">'+x[1]+'</button>').join('');
 [['we','swe'],['dots','sdt'],['amt','sam']].forEach(x=>$(x[1]).classList.toggle('on',!!C()[x[0]]))}
$('cpm').onclick=()=>mv(-1);
$('cnm').onclick=()=>mv(1);
$('cti').onclick=()=>{mode=1;calR()};
$('cpy').onclick=()=>{if(vy>MIN){vy--;calR()}else toast('Calendar range is 1990 to 2050')};
$('cny').onclick=()=>{if(vy<MAX){vy++;calR()}else toast('Calendar range is 1990 to 2050')};
$('cmg').onclick=e=>{const b=e.target.closest('[data-m]');if(b){vm=+b.dataset.m;mode=0;calR()}};
$('cvt').onclick=e=>{const b=e.target.closest('button');if(b){mode=+b.dataset.v;calR()}};
$('cgd').onclick=e=>{const b=e.target.closest('.dc');if(b){sY=vy;sM=vm;sD=+b.dataset.d;calR()}};
$('ctd').onclick=()=>{const t=new Date();vy=sY=t.getFullYear();vm=sM=t.getMonth();sD=t.getDate();mode=0;calR()};
$('cgd').addEventListener('touchstart',e=>{X0=e.touches[0].clientX;Y0=e.touches[0].clientY},{passive:true});
$('cgd').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-X0,dy=e.changedTouches[0].clientY-Y0;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)mv(dx<0?1:-1)},{passive:true});
$('calg').onclick=()=>{setR();openP('p-calset')};
$('cthm').onclick=e=>{const b=e.target.closest('button');if(b){C().th=+b.dataset.t;save();document.documentElement.setAttribute('data-ct',C().th);setR()}};
$('cws').onclick=e=>{const b=e.target.closest('button');if(b){C().ws=+b.dataset.w;save();setR();calR()}};
[['cswe','we'],['csdt','dots'],['csam','amt']].forEach(x=>$(x[0]).onclick=()=>{C()[x[1]]=!C()[x[1]];save();setR();calR()});
document.querySelectorAll('#p-calset [data-bk]').forEach(b=>b.onclick=()=>history.back());
const _sh=show;
show=function(p){_sh(p);if(p==='cal'){document.documentElement.setAttribute('data-ct',C().th);calR()}else document.documentElement.removeAttribute('data-ct')};
const _rr=render;
render=function(){_rr();if($('cal').classList.contains('on'))calR()};
setR();calR();
})();
