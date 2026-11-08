/* v2: full pages, profile, statistics, achievements, photo cropper */
if(!S.since){S.since=S.log.length?Math.min(...S.log.map(e=>e.t)):Date.now();save()}
const stk=[];
function shP(){
 const t=stk[stk.length-1];
 document.querySelectorAll('.sp').forEach(p=>p.style.display=p.id===t?'flex':'none');
 if(t==='p-bell')$('nl2').innerHTML=nudges().map(x=>'<div class="it"><div class="dot">'+x[0]+'</div><div class="mid"><b style="font-weight:600;font-size:16px">'+x[1]+'</b></div></div>').join('')}
function openP(id){closeS();stk.push(id);history.pushState({sp:id},'');shP()}
addEventListener('popstate',()=>{if(stk.length){stk.pop();shP()}});
document.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>openP(b.dataset.sp));
document.querySelectorAll('[data-bk]').forEach(b=>b.onclick=()=>history.back());
$('ap').onclick=()=>openS('s-photo');
$('pc1').addEventListener('click',closeS);
$('pr').addEventListener('click',closeS);
$('pe').onclick=()=>{$('pnm').style.display='none';$('ned').style.display='flex';$('nm').value=S.name||'';$('nm').focus()};
$('ns').addEventListener('click',()=>{if($('nm').value.trim()){$('ned').style.display='none';$('pnm').style.display='flex'}});
$('nm').onkeydown=e=>{if(e.key==='Enter')$('ns').click()};
const CV=280;let ci=null,cs0=1,cz=1,cx=0,cy=0,dr=null;
function crop(){
 const s=cs0*cz,w=ci.naturalWidth*s,h=ci.naturalHeight*s,mx=(w-CV)/2,my=(h-CV)/2;
 cx=Math.max(-mx,Math.min(mx,cx));cy=Math.max(-my,Math.min(my,cy));
 const im=$('cimg');im.style.width=w+'px';im.style.height=h+'px';im.style.left=(CV/2+cx-w/2)+'px';im.style.top=(CV/2+cy-h/2)+'px'}
function openCrop(f){
 const r=new FileReader();
 r.onload=()=>{const im=$('cimg');
  im.onload=()=>{ci=im;cs0=CV/Math.min(im.naturalWidth,im.naturalHeight);cz=1;cx=cy=0;$('cz').value=1;crop();openP('p-crop')};
  im.onerror=()=>toast('Could not read that photo');
  im.src=r.result};
 r.readAsDataURL(f)}
$('ph').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)openCrop(f)};
$('cv').onpointerdown=e=>{dr={x:e.clientX,y:e.clientY,a:cx,b:cy};$('cv').setPointerCapture(e.pointerId)};
$('cv').onpointermove=e=>{if(!dr)return;cx=dr.a+e.clientX-dr.x;cy=dr.b+e.clientY-dr.y;crop()};
$('cv').onpointerup=$('cv').onpointercancel=()=>{dr=null};
$('cz').oninput=()=>{cz=Number($('cz').value);crop()};
$('cok').onclick=()=>{
 const s=cs0*cz,w=ci.naturalWidth*s,h=ci.naturalHeight*s,L=CV/2+cx-w/2,T=CV/2+cy-h/2,c=document.createElement('canvas');
 c.width=c.height=256;
 c.getContext('2d').drawImage(ci,-L/s,-T/s,CV/s,CV/s,0,0,256,256);
 S.photo=c.toDataURL('image/jpeg',.88);save();render();history.back()};
function pstats(){
 const g=G(),m={};let tl=0,tg=0;
 for(const e of S.log){const k=dk(e.t);m[k]=(m[k]||0)+e.ml;tl+=e.ml;tg+=e.g}
 const ks=Object.keys(m).filter(k=>m[k]>0).sort();
 let best=0,run=0,done=0;
 if(ks.length){const d=new Date(ks[0]+'T00:00:00'),t=new Date();t.setHours(0,0,0,0);
  while(d<=t){if((m[dk(d.getTime())]||0)>=g){run++;done++;if(run>best)best=run}else run=0;d.setDate(d.getDate()+1)}}
 return{tl,tg,days:ks.length,done,best,avg:ks.length?Math.round(tl/ks.length):0,cur:Number($('sk').textContent)||0,top:ks.reduce((a,k)=>Math.max(a,m[k]),0)}}
const ACH=[['🥛','First Glass','Log your first glass',s=>s.tg>0],['🔥','7 Day Streak','Hit your goal 7 days in a row',s=>s.best>=7],['⚡','30 Day Streak','Hit your goal 30 days in a row',s=>s.best>=30],['🎯','Goal Master','Complete 10 daily goals',s=>s.done>=10],['👑','Consistency Champion','Reach a 14 day streak',s=>s.best>=14]];
const _r3=render;
render=function(){_r3();
 $('pn1').textContent=S.name||'';
 $('pms').textContent='Member since '+new Date(S.since||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
 const s=pstats();
 $('pst').innerHTML=[['💧','Total water',lit(s.tl)+' L'],['🥛','Total glasses',s.tg],['📅','Tracking days',s.days],['📊','Daily average',lit(s.avg)+' L'],['🔥','Current streak',s.cur+' d'],['🏅','Best streak',s.best+' d'],['🎯','Goals completed',s.done],['⭐','Best day',lit(s.top)+' L']].map(x=>'<div class="ps"><i>'+x[0]+'</i><b>'+x[2]+'</b><small>'+x[1]+'</small></div>').join('');
 $('ach').innerHTML=ACH.map(a=>{const ok=a[3](s);return '<div class="ar'+(ok?' on':'')+'"><div class="ai">'+a[0]+'</div><div class="mid"><b>'+a[1]+'</b><small>'+a[2]+'</small></div><span class="as">'+(ok?'Unlocked':'🔒 Locked')+'</span></div>'}).join('')};
render();
