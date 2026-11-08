/* alarm.js: alarms, tones, ring screen, achievements */
if(!document.getElementById('alarm'))throw new Error('alarmui.js missing');
if(!Array.isArray(S.alarms))S.alarms=[];
if(!Array.isArray(S.tones))S.tones=[];
if(S.alTh==null)S.alTh=0;
const TONES={dream:['Dream Tone',[[523,.4],[659,.4],[784,.4],[988,.8],[784,.4],[659,.4],[523,.8],[0,.4]]],crystal:['Crystal Bells',[[1319,.25],[1568,.25],[1319,.25],[1760,.5],[0,.5]]],sunrise:['Sunrise',[[392,.5],[494,.5],[587,.5],[784,1],[0,.5]]],wave:['Ocean Wave',[[330,.6],[392,.6],[440,.6],[392,.6],[330,.9],[0,.4]]],beep:['Classic Beep',[[880,.2],[0,.15],[880,.2],[0,.15],[880,.2],[0,.6]]]};
const ATH=[['Blossom','linear-gradient(160deg,#ff9ac1,#c084fc)','🌸'],['Ocean','linear-gradient(160deg,#38bdf8,#4f46e5)','🌊'],['Night','linear-gradient(160deg,#1e1b4b,#7c3aed)','✨'],['Forest','linear-gradient(160deg,#34d399,#0f766e)','🍃'],['Sunrise','linear-gradient(160deg,#fbbf24,#f43f5e)','☀️'],['Lavender','linear-gradient(160deg,#a78bfa,#6366f1)','💜']];
const DUR=[15,30,40,60],DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let AC=null,MG=null,rT=null,sT=null,vT=null,au=null,ed=null,ringA=null;
const pad2=n=>String(n).padStart(2,'0');
const t12=(h,m)=>({t:(h%12||12)+':'+pad2(m),s:h<12?'AM':'PM'});
const aid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toneName=id=>TONES[id]?TONES[id][0]:((S.tones.find(t=>t.id===id)||{}).name||'Dream Tone');
function dtxt(a){
 if(!a.days.length)return'Once';
 if(a.days.length===7)return'Every day';
 if(a.days.length===5&&[1,2,3,4,5].every(d=>a.days.includes(d)))return'Weekdays';
 return a.days.slice().sort().map(d=>DN[d]).join(', ')}
function nextAt(a){
 const n=new Date();
 for(let i=0;i<8;i++){const d=new Date(n.getFullYear(),n.getMonth(),n.getDate()+i,a.h,a.m,0);if(d>n&&(!a.days.length||a.days.includes(d.getDay())))return d}
 return null}
function nextTxt(){
 let b=null;
 for(const a of S.alarms)if(a.on){const d=nextAt(a);if(d&&(!b||d<b))b=d}
 if(!b)return'No alarm is on';
 const m=Math.round((b-Date.now())/6e4),h=Math.floor(m/60);
 return 'In '+(h?h+' h ':'')+(m%60)+' min'}
function alRender(){
 const th=ATH[S.alTh]||ATH[0];
 $('ahero').style.background=th[1];$('aart').textContent=th[2].repeat(80);$('anx').textContent=nextTxt();
 $('alist').innerHTML=S.alarms.length?S.alarms.slice().sort((x,y)=>x.h*60+x.m-y.h*60-y.m).map(a=>{const t=t12(a.h,a.m);
  return '<div class="al'+(a.on?'':' off')+'" data-id="'+a.id+'"><div class="alm"><div class="atime">'+t.t+'<small>'+t.s+'</small></div><div class="adays">'+dtxt(a)+(a.label?' · '+esc(a.label):'')+'</div></div><button class="sw'+(a.on?' on':'')+'" data-t="'+a.id+'"><i></i></button></div>'}).join(''):'<div class="card ctr"><div class="bigemo">⏰</div><p>No alarms yet. Tap Add alarm to create one.</p></div>';
 $('athm').innerHTML=ATH.map((t,i)=>'<button class="'+(i===S.alTh?'on':'')+'" data-th="'+i+'" style="background:'+t[1]+'">'+t[2]+'<br>'+t[0]+'</button>').join('')}
function audioInit(){AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}
function sched(p){
 const t0=AC.currentTime+.05;let t=t0;
 for(const[f,d]of p){
  if(f){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.4,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d*.95);
   o.connect(g);g.connect(MG);o.start(t);o.stop(t+d)}
  t+=d}
 return t-t0}
function stopSound(){
 clearInterval(rT);clearInterval(vT);clearTimeout(sT);rT=vT=sT=null;
 if(au){au.pause();au=null}
 if(MG){try{MG.disconnect()}catch(e){}MG=null}
 if(navigator.vibrate)navigator.vibrate(0)}
function sound(id,vib){
 stopSound();audioInit();
 const c=S.tones.find(t=>t.id===id);
 if(c){au=new Audio(c.data);au.loop=true;au.play().catch(()=>{})}
 else{MG=AC.createGain();MG.connect(AC.destination);const p=(TONES[id]||TONES.dream)[1],L=sched(p);rT=setInterval(()=>sched(p),L*1000)}
 if(vib&&navigator.vibrate){const v=()=>navigator.vibrate([700,500]);v();vT=setInterval(v,1200)}}
function preview(id){sound(id,false);sT=setTimeout(stopSound,4000)}
function ringNow(a){
 const th=ATH[S.alTh]||ATH[0],t=t12(a.h,a.m);
 $('rbg').style.background=th[1];$('rart').textContent=th[2].repeat(120);
 $('rt2').textContent=t.t+' '+t.s;$('rl').textContent=a.label||'Alarm';
 $('ring').style.display='flex';ringA=a;
 sound(a.tone,a.vib);sT=setTimeout(stopRing,a.dur*1000)}
function stopRing(){stopSound();$('ring').style.display='none'}
$('rst').onclick=stopRing;
$('rsz').onclick=()=>{const a=ringA;stopRing();toast('Snoozed for 5 minutes');setTimeout(()=>ringNow(a),300000)};
const fired={};
function tick(){
 const n=new Date(),hm=n.getHours()*60+n.getMinutes(),key=dk(n.getTime())+'-'+hm;
 for(const a of S.alarms){
  if(!a.on||a.h*60+a.m!==hm||fired[a.id]===key)continue;
  if(a.days.length&&!a.days.includes(n.getDay()))continue;
  fired[a.id]=key;
  if(!a.days.length){a.on=false;save();alRender()}
  ringNow(a);break}
 if($('alarm').classList.contains('on'))$('anx').textContent=nextTxt()}
setInterval(tick,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
addEventListener('pointerdown',()=>{try{audioInit()}catch(e){}},{once:true});
function fillEdit(){
 const t=t12(ed.h,ed.m);
 $('aet').textContent=ed.isNew?'New alarm':'Edit alarm';
 $('adel').style.display=ed.isNew?'none':'block';
 $('atd').textContent=t.t+' '+t.s;$('ati').value=pad2(ed.h)+':'+pad2(ed.m);
 $('adys').innerHTML=['S','M','T','W','T','F','S'].map((l,i)=>'<button data-d="'+i+'" class="'+(ed.days.includes(i)?'on':'')+'">'+l+'</button>').join('');
 $('arp').textContent=dtxt(ed);
 $('alb').value=ed.label;
 $('atv').textContent=toneName(ed.tone);
 $('adu').innerHTML=DUR.map(d=>'<button data-u="'+d+'" class="'+(ed.dur===d?'on':'')+'">'+d+'s</button>').join('');
 $('avs').classList.toggle('on',ed.vib)}
function openEdit(id){
 const a=id?S.alarms.find(x=>x.id===id):null;
 ed=a?JSON.parse(JSON.stringify(a)):{id:aid(),h:8,m:0,days:[],label:'Drink water',tone:'dream',dur:30,vib:true,on:true,isNew:true};
 fillEdit();openP('p-aled')}
$('alist').onclick=e=>{
 const s=e.target.closest('.sw'),c=e.target.closest('.al');
 if(s){const a=S.alarms.find(x=>x.id===s.dataset.t);a.on=!a.on;save();alRender();return}
 if(c)openEdit(c.dataset.id)};
$('athm').onclick=e=>{const b=e.target.closest('button');if(b){S.alTh=Number(b.dataset.th);save();alRender()}};
$('aadd').onclick=()=>openEdit(null);
$('ati').oninput=()=>{const p=$('ati').value.split(':').map(Number);if(p.length===2&&!isNaN(p[0])){ed.h=p[0];ed.m=p[1];fillEdit()}};
$('adys').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=Number(b.dataset.d),i=ed.days.indexOf(d);if(i<0)ed.days.push(d);else ed.days.splice(i,1);fillEdit()};
$('alb').oninput=()=>{ed.label=$('alb').value};
$('adu').onclick=e=>{const b=e.target.closest('button');if(b){ed.dur=Number(b.dataset.u);fillEdit()}};
$('avb').onclick=()=>{ed.vib=!ed.vib;fillEdit()};
$('asv').onclick=()=>{
 ed.label=$('alb').value.trim().slice(0,30);
 const o={...ed};delete o.isNew;
 const i=S.alarms.findIndex(x=>x.id===ed.id);
 if(i<0)S.alarms.push(o);else S.alarms[i]=o;
 save();alRender();history.back();toast('Alarm saved')};
$('adel').onclick=()=>{if(!confirm('Delete this alarm?'))return;S.alarms=S.alarms.filter(x=>x.id!==ed.id);save();alRender();history.back()};
$('aclk').onclick=()=>{
 const l=$('alb').value.trim()||'SipLog';
 location.href='intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR='+ed.h+';i.android.intent.extra.alarm.MINUTES='+ed.m+';S.android.intent.extra.alarm.MESSAGE='+encodeURIComponent(l)+';end'};
function tRender(){
 const all=Object.keys(TONES).map(k=>[k,TONES[k][0],'🎵']).concat(S.tones.map(t=>[t.id,t.name,'📁']));
 $('tlist').innerHTML=all.map(x=>'<button class="li" data-k="'+x[0]+'"><span class="ic">'+x[2]+'</span><span>'+esc(x[1])+'</span><em>'+(ed.tone===x[0]?'✓ Selected':'')+'</em>'+(x[2]==='📁'?'<span class="x" data-del="'+x[0]+'">✕</span>':'')+'</button>').join('')}
$('atn').onclick=()=>{tRender();openP('p-tone')};
$('tlist').onclick=e=>{
 const d=e.target.closest('[data-del]');
 if(d){S.tones=S.tones.filter(t=>t.id!==d.dataset.del);if(ed.tone===d.dataset.del)ed.tone='dream';save();tRender();fillEdit();return}
 const b=e.target.closest('.li');
 if(b){ed.tone=b.dataset.k;tRender();fillEdit();preview(ed.tone)}};
$('tadd').onclick=()=>$('tfile').click();
$('tfile').onchange=e=>{
 const f=e.target.files[0];e.target.value='';if(!f)return;
 if(f.size>2*1048576){toast('Tone must be under 2 MB');return}
 const r=new FileReader();
 r.onload=()=>{
  const t={id:'c'+aid(),name:f.name.replace(/\.[^.]+$/,'').slice(0,24),data:r.result};
  S.tones.push(t);
  try{localStorage.setItem(K,JSON.stringify(S))}catch(x){S.tones.pop();toast('Not enough storage for this tone');return}
  ed.tone=t.id;tRender();fillEdit();toast('Tone added')};
 r.readAsDataURL(f)};
function achR(){
 const s=pstats(),L=[['🥛','First Glass','Log your first glass',s.tg>0?1:0,1],['🔥','7 Day Streak','7 days in a row',s.best,7],['⚡','30 Day Streak','30 days in a row',s.best,30],['🎯','Goal Master','Complete 10 daily goals',s.done,10],['👑','Consistency Champion','Reach a 14 day streak',s.best,14]];
 const n=L.filter(x=>x[3]>=x[4]).length;
 $('ach').innerHTML='<div class="ahd">'+n+' of '+L.length+' unlocked</div><div class="agrid">'+L.map(x=>{const p=Math.min(x[3],x[4]),ok=x[3]>=x[4];
  return '<div class="ac'+(ok?' on':'')+'"><div class="am">'+x[0]+'</div><b>'+x[1]+'</b><small>'+x[2]+'</small><div class="ab"><i style="width:'+Math.round(p/x[4]*100)+'%"></i></div><span>'+(ok?'Unlocked':p+' / '+x[4])+'</span></div>'}).join('')+'</div>'}
document.querySelectorAll('#alarm .tg').forEach(b=>b.onclick=()=>{S.theme=document.documentElement.hasAttribute('data-d')?'light':'dark';save();theme();render()});
document.querySelectorAll('.sp [data-bk]').forEach(b=>b.onclick=()=>history.back());
const _r4=render;
render=function(){_r4();alRender();achR()};
render();
