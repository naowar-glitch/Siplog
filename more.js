/* SipLog extras: sheets, bell, + button, statistics, backup */
let pq=1,stm='w';
function openS(id){
 document.querySelectorAll('.sheet').forEach(s=>s.style.display=s.id===id?'block':'none');
 $('ov').style.display='flex';
 if(id==='s-log')lg();
 if(id==='s-bell')$('nl').innerHTML=nudges().map(x=>'<div class="it"><div class="dot">'+x[0]+'</div><div class="mid"><b style="font-weight:600">'+x[1]+'</b></div></div>').join('')}
function closeS(){$('ov').style.display='none'}
function lg(){$('ln').textContent=pq;$('ll').textContent=S.size?pq+' '+pl(pq)+' = '+lit(pq*S.size)+' L':'Choose your glass size first'}
function nudges(){
 const a=[],g=G(),T=tot(today()),h=new Date().getHours();
 if(!S.size)a.push(['⚠️','Choose your glass size to start logging.',1]);
 a.push(T.ml>=g?['🎉','Goal reached! You drank '+lit(T.ml)+' L today.',0]:['💧',lit(g-T.ml)+' L to go for today\'s goal.',0]);
 const L=S.log.filter(e=>e.g>0&&dk(e.t)===today()).map(e=>e.t),last=L.length?Math.max(...L):0;
 if(!last){if(h>=9&&T.ml<g)a.push(['⏰','No water logged yet today. Time for a glass!',1])}
 else{const m=Math.round((Date.now()-last)/6e4);
  if(m>=120&&h>=7&&h<22&&T.ml<g)a.push(['⏰','Last drink was '+Math.floor(m/60)+' h ago. Time for a glass!',1]);
  else a.push(['🕒','Last drink at '+fmtT(last)+'.',0])}
 const n=Number($('sk').textContent);if(n>0)a.push(['🔥',n+'-day streak. Keep it going!',0]);
 return a}
function bars2(w,g){
 const n=w.length,mx=Math.max(g,...w.map(x=>x.ml))*1.15,sw=320/n,bw=Math.min(28,sw*.7),gy=118-g/mx*100;
 let s='<svg viewBox="0 0 320 145" style="width:100%"><defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ac)"/><stop offset="1" style="stop-color:var(--ac2)"/></linearGradient></defs><line x1="0" x2="320" y1="'+gy+'" y2="'+gy+'" stroke-dasharray="4 4" style="stroke:var(--mu)"/>';
 w.forEach((x,i)=>{const h=x.ml/mx*100,c=i*sw+sw/2,ok=x.ml>=g;
  s+='<rect x="'+(c-bw/2)+'" y="'+(118-h)+'" width="'+bw+'" height="'+h+'" rx="'+Math.min(8,bw/2)+'" style="fill:'+(ok?'url(#bg2)':'var(--ac)')+'" opacity="'+(ok?1:.4)+'"/>';
  if(n<=7)s+='<text x="'+c+'" y="'+(112-h)+'" font-size="9" text-anchor="middle" fill="currentColor">'+(x.ml?lit(x.ml):'')+'</text>';
  if(n<=7||i%5===0||i===n-1)s+='<text x="'+c+'" y="136" font-size="10" text-anchor="middle" style="fill:var(--mu)">'+(n<=7?x.d.toLocaleDateString('en-US',{weekday:'short'}):x.d.getDate())+'</text>'});
 return s+'</svg>'}
function statR(){
 const g=G(),n=stm==='w'?7:30,m={};
 for(const e of S.log){const k=dk(e.t);m[k]=(m[k]||0)+e.ml}
 const w=Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(n-1)+i);return{d,ml:Math.max(0,m[dk(d.getTime())]||0)}});
 const met=w.filter(x=>x.ml>=g).length,sum=w.reduce((a,x)=>a+x.ml,0),b=w.reduce((a,x)=>x.ml>a.ml?x:a,w[0]);
 $('wl').textContent='Last '+n+' days · goal met';
 $('rc').setAttribute('stroke-dashoffset',251.3*(1-met/n));$('rt').textContent=Math.round(met/n*100)+'%';
 $('wd').textContent=met+' / '+n;$('wa').textContent='Avg '+lit(Math.round(sum/n))+' L per day';
 $('bars').innerHTML=bars2(w,g);
 $('ins').innerHTML=[['Total',lit(sum)+' L'],['Daily avg',lit(Math.round(sum/n))+' L'],['Best day'+(b.ml?' · '+b.d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}):''),b.ml?lit(b.ml)+' L':'—']].map(x=>'<div class="tl"><b>'+x[1]+'</b><small>'+x[0]+'</small></div>').join('');
 document.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x.dataset.m===stm))}
['setSize','setGoal','setTheme'].forEach(n=>{const f=window[n];window[n]=(...a)=>{f(...a);closeS()}});
const _r2=render;
render=function(){_r2();statR();
 $('v-goal').textContent=lit(G())+' L';$('v-size').textContent=S.size?S.size+' ml':'Not set';
 const t=S.theme||'auto';$('v-th').textContent=t[0].toUpperCase()+t.slice(1);
 $('bd').style.display=nudges().some(x=>x[2])?'block':'none'};
document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>openS(b.dataset.o));
$('ov').onclick=e=>{if(e.target===$('ov')||e.target.closest('[data-x]'))closeS()};
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{stm=b.dataset.m;render()});
$('chip').onclick=()=>openS('s-size');
$('gs').onclick=()=>{$('md').style.display='none';openS('s-size')};
$('lm').onclick=()=>{if(pq>1){pq--;lg()}};
$('lp').onclick=()=>{if(pq<50){pq++;lg()}};
$('la').onclick=()=>{const n=pq;pq=1;closeS();addN(n)};
render();
