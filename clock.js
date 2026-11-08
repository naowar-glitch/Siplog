/* clock.js: world clock, timer, stopwatch, live clock icon */
(function(){
if(!document.getElementById('v-world'))throw new Error('clockui.js missing');
const CITIES=[['New Delhi','Asia/Kolkata'],['Dhaka','Asia/Dhaka'],['Karachi','Asia/Karachi'],['Kathmandu','Asia/Kathmandu'],['Colombo','Asia/Colombo'],['Kabul','Asia/Kabul'],['Dubai','Asia/Dubai'],['Riyadh','Asia/Riyadh'],['Doha','Asia/Qatar'],['Tehran','Asia/Tehran'],['Istanbul','Europe/Istanbul'],['Moscow','Europe/Moscow'],['Cairo','Africa/Cairo'],['Nairobi','Africa/Nairobi'],['Lagos','Africa/Lagos'],['Johannesburg','Africa/Johannesburg'],['London','Europe/London'],['Paris','Europe/Paris'],['Berlin','Europe/Berlin'],['Rome','Europe/Rome'],['Madrid','Europe/Madrid'],['Amsterdam','Europe/Amsterdam'],['New York','America/New_York'],['Chicago','America/Chicago'],['Denver','America/Denver'],['Los Angeles','America/Los_Angeles'],['Toronto','America/Toronto'],['Mexico City','America/Mexico_City'],['Sao Paulo','America/Sao_Paulo'],['Buenos Aires','America/Argentina/Buenos_Aires'],['Singapore','Asia/Singapore'],['Kuala Lumpur','Asia/Kuala_Lumpur'],['Bangkok','Asia/Bangkok'],['Jakarta','Asia/Jakarta'],['Manila','Asia/Manila'],['Hong Kong','Asia/Hong_Kong'],['Shanghai','Asia/Shanghai'],['Tokyo','Asia/Tokyo'],['Seoul','Asia/Seoul'],['Sydney','Australia/Sydney'],['Auckland','Pacific/Auckland'],['Honolulu','Pacific/Honolulu']];
if(!Array.isArray(S.wc)||!S.wc.length)S.wc=['New Delhi'];
const tzOf=n=>(CITIES.find(c=>c[0]===n)||CITIES[0])[1];
const FM={};
const fm=tz=>FM[tz]||(FM[tz]=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',weekday:'short'}));
const vis=id=>$('alarm').classList.contains('on')&&$(id).style.display!=='none';
function wcCalc(n){
 const p={},nw=new Date();
 fm(tzOf(n)).formatToParts(nw).forEach(x=>p[x.type]=x.value);
 const h=+p.hour,m=+p.minute,L=Date.UTC(nw.getFullYear(),nw.getMonth(),nw.getDate(),nw.getHours(),nw.getMinutes()),
 Z=Date.UTC(+p.year,+p.month-1,+p.day,h,m),
 dd=Math.round((Date.UTC(+p.year,+p.month-1,+p.day)-Date.UTC(nw.getFullYear(),nw.getMonth(),nw.getDate()))/864e5),
 df=Math.round((Z-L)/6e4),a=Math.abs(df);
 return{t:(h%12||12)+':'+pad2(m)+'<small>'+(h<12?'AM':'PM')+'</small>',d:(dd===0?'Today':dd>0?'Tomorrow':'Yesterday')+', '+p.weekday+' · '+(df===0?'Same time':Math.floor(a/60)+(a%60?' h '+a%60+' min':' h')+(df>0?' ahead':' behind'))}}
function wcUpdate(){document.querySelectorAll('#wlist .wc').forEach(el=>{const c=wcCalc(el.dataset.n);el.querySelector('.wt').innerHTML=c.t;el.querySelector('.wd').textContent=c.d})}
function wcRender(){
 $('wlist').innerHTML=S.wc.length?S.wc.map(n=>'<div class="wc" data-n="'+n+'"><div style="flex:1;min-width:0"><b>'+n+'</b><div class="mu wd"></div></div><div class="wt"></div><button class="x" data-r="'+n+'">✕</button></div>').join(''):'<div class="card ctr"><p>No cities yet. Tap + to add one.</p></div>';
 wcUpdate()}
function cRender(q){
 q=(q||'').toLowerCase();
 $('cls').innerHTML=CITIES.filter(c=>!S.wc.includes(c[0])&&c[0].toLowerCase().includes(q)).map(c=>'<button class="sr" data-c="'+c[0]+'"><span style="flex:1">'+c[0]+'</span><span class="mu">'+c[1].split('/').pop().replace(/_/g,' ')+'</span></button>').join('')||'<p>No city found.</p>'}
$('wadd').onclick=()=>{$('csr').value='';cRender('');openP('p-city')};
$('csr').oninput=()=>cRender($('csr').value);
$('cls').onclick=e=>{const b=e.target.closest('[data-c]');if(b){S.wc.push(b.dataset.c);save();wcRender();history.back()}};
$('wlist').onclick=e=>{const b=e.target.closest('[data-r]');if(b&&confirm('Remove '+b.dataset.r+'?')){S.wc=S.wc.filter(x=>x!==b.dataset.r);save();wcRender()}};
$('ctabs').onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 document.querySelectorAll('#ctabs button').forEach(x=>x.classList.toggle('on',x===b));
 ['v-alarm','v-world','v-timer','v-stop'].forEach((id,i)=>$(id).style.display=i===+b.dataset.v?'block':'none');
 if(b.dataset.v==='1')wcRender()};
/* timer */
if(!S.tm||typeof S.tm.total!=='number')S.tm={total:300000,left:300000,end:0,run:false};
const TP=[[60,'1 min'],[300,'5 min'],[600,'10 min'],[900,'15 min'],[1800,'30 min'],[3600,'1 hour']];
const fmtH=ms=>{const s=Math.ceil(ms/1000);return pad2(Math.floor(s/3600))+':'+pad2(Math.floor(s/60)%60)+':'+pad2(s%60)};
const tmSet=()=>((Math.min(23,+$('tmh').value||0))*3600+(Math.min(59,+$('tmm').value||0))*60+Math.min(59,+$('tmsec').value||0))*1000;
function tmFill(ms){const s=Math.round(ms/1000);$('tmh').value=Math.floor(s/3600);$('tmm').value=Math.floor(s/60)%60;$('tmsec').value=s%60}
function tmShow(){
 const t=S.tm,left=t.run?Math.max(0,t.end-Date.now()):t.left;
 $('tmt').textContent=fmtH(left);
 $('tmc').setAttribute('stroke-dashoffset',552.9*(1-(t.total?left/t.total:0)));
 $('tmg').textContent=t.run?'Pause':(left<t.total&&left>0?'Resume':'Start');
 ['tmh','tmm','tmsec'].forEach(i=>$(i).disabled=t.run||left<t.total)}
function ringTimer(){
 const th=ATH[S.alTh]||ATH[0];
 $('rbg').style.background=th[1];$('rart').textContent='';
 $('rt2').textContent='Time is up';$('rl').textContent=fmtH(S.tm.total)+' timer';
 $('rsz').style.display='none';$('ring').style.display='flex';
 sound(S.tmSnd||'dream',S.tmVib!==false,S.tmVol==null?.8:S.tmVol);
 sT=setTimeout(stopRing,60000)}
function tmDone(){
 const t=S.tm,late=Date.now()-t.end;
 t.run=false;t.left=t.total;save();tmShow();
 if(late>6e5){toast('Your timer finished earlier');return}
 ringTimer()}
$('tmg').onclick=()=>{
 const t=S.tm;
 if(t.run){t.left=Math.max(0,t.end-Date.now());t.run=false}
 else{
  if(t.left>=t.total||t.left<=0){const T=tmSet();if(!T){toast('Set a time first');return}t.total=T;t.left=T}
  t.end=Date.now()+t.left;t.run=true}
 save();tmShow()};
$('tmx').onclick=()=>{const t=S.tm;t.run=false;const T=tmSet()||t.total;t.total=T;t.left=T;tmFill(T);save();tmShow()};
['tmh','tmm','tmsec'].forEach(i=>$(i).oninput=()=>{if(!S.tm.run){const T=tmSet();S.tm.total=T;S.tm.left=T;tmShow()}});
$('tpre').innerHTML=TP.map(p=>'<button data-s="'+p[0]+'">'+p[1]+'</button>').join('');
$('tpre').onclick=e=>{const b=e.target.closest('button');if(!b||S.tm.run)return;const ms=+b.dataset.s*1000;S.tm.total=ms;S.tm.left=ms;tmFill(ms);save();tmShow()};
$('tmk').onclick=()=>{
 const s=Math.round((S.tm.run?S.tm.end-Date.now():S.tm.left)/1000);
 if(!s){toast('Set a time first');return}
 location.href='intent:#Intent;action=android.intent.action.SET_TIMER;i.android.intent.extra.alarm.LENGTH='+s+';S.android.intent.extra.alarm.MESSAGE=SipLog;end'};
tmFill(S.tm.run?S.tm.total:S.tm.left);
/* stopwatch */
const sw={run:false,t0:0,acc:0,laps:[]};
const swMs=()=>sw.acc+(sw.run?performance.now()-sw.t0:0);
const fmtS=ms=>pad2(Math.floor(ms/60000))+':'+pad2(Math.floor(ms/1000)%60)+'.'+pad2(Math.floor(ms/10)%100);
function swShow(){$('swt').textContent=fmtS(swMs());$('swg').textContent=sw.run?'Stop':(sw.acc?'Resume':'Start');$('swl').textContent=sw.run?'Lap':'Reset'}
function lapR(){
 $('swlaps').style.display=sw.laps.length?'block':'none';
 $('swlaps').innerHTML=sw.laps.slice().reverse().map((x,i)=>'<div class="lp"><span>Lap '+(sw.laps.length-i)+'</span><span>'+fmtS(x.l)+'</span><span class="mu">'+fmtS(x.t)+'</span></div>').join('')}
$('swg').onclick=()=>{if(sw.run){sw.acc+=performance.now()-sw.t0;sw.run=false}else{sw.t0=performance.now();sw.run=true}swShow()};
$('swl').onclick=()=>{
 if(sw.run){const t=swMs(),l=sw.laps.length?t-sw.laps[sw.laps.length-1].t:t;sw.laps.push({t,l});lapR()}
 else{sw.acc=0;sw.laps=[];lapR();swShow()}};
/* live clock icon + ticker */
function clockIcon(d){
 const h=d.getHours()%12,m=d.getMinutes(),s=d.getSeconds();
 $('ckh').setAttribute('transform','rotate('+(h*30+m*.5)+' 12 12)');
 $('ckm').setAttribute('transform','rotate('+(m*6+s*.1)+' 12 12)');
 $('cks').setAttribute('transform','rotate('+s*6+' 12 12)')}
let lastS=-1;
setInterval(()=>{
 const d=new Date(),s=d.getSeconds();
 if(s!==lastS){lastS=s;clockIcon(d);if(vis('v-world'))wcUpdate()}
 if(S.tm.run){if(Date.now()>=S.tm.end)tmDone();else if(vis('v-timer'))tmShow()}
 if(sw.run&&vis('v-stop'))swShow()},100);
wcRender();tmShow();swShow();clockIcon(new Date());
})();
