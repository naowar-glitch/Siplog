const K='water_tracker_v1',$=id=>document.getElementById(id),P=[150,200,250,300,400,500],GS=[1500,2000,2500,3000,3500,4000,5000,6000,7000,8000,9000,10000],TH=['auto','light','dark'],AV=['#7c6cf0,#5b8def','#ec4899,#8b5cf6','#06b6d4,#3b82f6','#10b981,#06b6d4','#f59e0b,#ef4444'];
let S={size:null,log:[]},q=1;
try{const x=JSON.parse(localStorage.getItem(K));if(x&&Array.isArray(x.log))S=x}catch(e){}
const mq=matchMedia('(prefers-color-scheme: dark)');
function theme(){const d=S.theme==='dark'||(S.theme!=='light'&&mq.matches);document.documentElement.toggleAttribute('data-d',d);document.querySelector('meta[name=theme-color]').content=d?'#16133a':'#7c6cf0'}
if(mq.addEventListener)mq.addEventListener('change',theme);
const G=()=>S.goal>0?S.goal:2500;
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast('Could not save data')}};
const pad=n=>String(n).padStart(2,'0');
const dk=t=>{const d=new Date(t);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const today=()=>dk(Date.now());
const lit=ml=>(ml/1000).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
const fmtT=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
const pl=n=>Math.abs(n)===1?'glass':'glasses';
const gT=e=>(e.g<0?'−':'+')+Math.abs(e.g)+' '+pl(e.g);
const lT=e=>(e.ml<0?'−':'')+lit(Math.abs(e.ml))+' L';
function tot(day){let g=0,ml=0;for(const e of S.log)if(dk(e.t)===day){g+=e.g;ml+=e.ml}return{g,ml}}
function toast(m){const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2600)}
function addN(n){
 if(!S.size){$('md').style.display='flex';return}
 const ml=n*S.size,t=tot(today());
 if(t.g+n<0||t.ml+ml<0){toast('Not enough water logged today to remove '+Math.abs(n)+' '+pl(n));return}
 S.log.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2),t:Date.now(),g:n,ml});
 q=1;save();render()}
function delE(id){
 const e=S.log.find(x=>x.id===id);if(!e||!confirm('Delete this entry?'))return;
 const d=dk(e.t);let g=0,ml=0;
 for(const x of S.log)if(x.id!==id&&dk(x.t)===d){g+=x.g;ml+=x.ml}
 if(g<0||ml<0){toast('Cannot delete: a later removal depends on it');return}
 S.log=S.log.filter(x=>x.id!==id);save();render()}
function setSize(ml){S.size=ml;save();render();toast('Glass size set to '+ml+' ml')}
function setGoal(v){S.goal=v;save();render();toast('Daily goal set to '+lit(v)+' L')}
function setTheme(t){S.theme=t;save();theme();render()}
function avatar(el){
 const n=(S.name||'?').trim();
 if(S.photo){el.style.backgroundImage='url('+S.photo+')';el.textContent='';return}
 let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%997;
 el.style.backgroundImage='linear-gradient(135deg,'+AV[h%AV.length]+')';
 el.textContent=n.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()}
function pickPhoto(f){
 if(!f)return;const r=new FileReader();
 r.onload=()=>{const im=new Image();
  im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const s=Math.min(im.width,im.height);
   c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128);
   S.photo=c.toDataURL('image/jpeg',.8);save();render()};
  im.onerror=()=>toast('Could not read that photo');
  im.src=r.result};
 r.readAsDataURL(f)}
function lbl(k){
 const[y,m,d]=k.split('-').map(Number),dt=new Date(y,m-1,d),n=new Date(),t0=new Date(n.getFullYear(),n.getMonth(),n.getDate());
 const df=Math.round((t0-dt)/864e5);
 if(df===0)return'Today';if(df===1)return'Yesterday';
 const o={weekday:'short',day:'numeric',month:'short'};if(y!==n.getFullYear())o.year='numeric';
 return dt.toLocaleDateString('en-GB',o)}
function glass(ml){
 const f=Math.min(ml/500,1),y=52-48*f,w=(y-4)/12;
 return '<svg viewBox="0 0 40 56"><polygon points="'+(6+w)+','+y+' '+(34-w)+','+y+' 30,52 10,52" style="fill:var(--ac2)"/><path d="M6 4L10 52H30L34 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'}
function rowH(e,del){
 return '<div class="it"><div class="dot'+(e.g<0?' neg':'')+'">'+(e.g<0?'−':'💧')+'</div><div class="mid"><b>'+fmtT(e.t)+'</b><small>'+gT(e)+'</small></div><span class="lv">'+lT(e)+'</span>'+(del?'<button class="x" onclick="delE(\''+e.id+'\')">✕</button>':'')+'</div>'}
function bars(w,g){
 const mx=Math.max(g,...w.map(x=>x.ml))*1.15,sw=320/7,gy=118-g/mx*100;
 let s='<svg viewBox="0 0 320 145" style="width:100%"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ac)"/><stop offset="1" style="stop-color:var(--ac2)"/></linearGradient></defs><line x1="0" x2="320" y1="'+gy+'" y2="'+gy+'" stroke-dasharray="4 4" style="stroke:var(--mu)"/>';
 w.forEach((x,i)=>{const h=x.ml/mx*100,c=i*sw+sw/2,ok=x.ml>=g;
  s+='<rect x="'+(c-14)+'" y="'+(118-h)+'" width="28" height="'+h+'" rx="8" style="fill:'+(ok?'url(#bg1)':'var(--ac)')+'" opacity="'+(ok?1:.4)+'"/><text x="'+c+'" y="'+(112-h)+'" font-size="9" text-anchor="middle" fill="currentColor">'+(x.ml?lit(x.ml):'')+'</text><text x="'+c+'" y="136" font-size="10" text-anchor="middle" style="fill:var(--mu)">'+x.d.toLocaleDateString('en-US',{weekday:'short'})+'</text>'});
 return s+'</svg>'}
function render(){
 const m={};for(const e of S.log){const k=dk(e.t),x=m[k]||(m[k]={g:0,ml:0});x.g+=e.g;x.ml+=e.ml}
 const Z={g:0,ml:0},T=m[today()]||Z,now=new Date(),g=G(),f=Math.min(1,T.ml/g),hr=now.getHours();
 $('ob').style.display=S.name?'none':'flex';
 $('gr0').textContent=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
 $('nm0').textContent=S.name||'';avatar($('av'));avatar($('av2'));
 $('pr').style.display=S.photo?'block':'none';
 if(document.activeElement!==$('nm'))$('nm').value=S.name||'';
 $('dt').textContent=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
 $('chip').textContent=S.size?'🥛 '+S.size+' ml':'⚠️ Set glass size';
 $('wv').style.transform='translateY('+(160*(1-f)-8*f)+'px)';
 $('gl').textContent='Goal '+lit(g)+' L';$('lt').textContent=lit(T.ml)+' L';$('pc').textContent=Math.round(f*100)+'% of goal';
 $('rm').textContent=lit(Math.max(0,g-T.ml))+' L';
 let n=0;const d=new Date();if((m[dk(d.getTime())]||Z).ml<g)d.setDate(d.getDate()-1);
 while(n<3650&&(m[dk(d.getTime())]||Z).ml>=g){n++;d.setDate(d.getDate()-1)}
 $('sk').textContent=n;$('sc').textContent=T.g;$('un').textContent=pl(T.g)+' today';
 const w=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);return{d:x,ml:Math.max(0,(m[dk(x.getTime())]||Z).ml),t:i===6}});
 $('wk').innerHTML=w.map(x=>'<div class="dy'+(x.ml>=g?' ok':'')+(x.t?' t':'')+'">'+x.d.toLocaleDateString('en-US',{weekday:'narrow'})+'<i>'+(x.ml>=g?'✓':x.d.getDate())+'</i></div>').join('');
 const met=w.filter(x=>x.ml>=g).length,sum=w.reduce((a,x)=>a+x.ml,0);
 $('rc').setAttribute('stroke-dashoffset',251.3*(1-met/7));$('rt').textContent=Math.round(met/7*100)+'%';
 $('wd').textContent=met+' / 7';$('wa').textContent='Avg '+lit(Math.round(sum/7))+' L per day';
 $('bars').innerHTML=bars(w,g);
 $('qn').textContent=q;$('ql').textContent=S.size?q+' '+pl(q)+' = '+lit(q*S.size)+' L':'Choose glass size in Settings';
 $('cm').textContent=now.toLocaleDateString('en-US',{month:'short'}).toUpperCase();$('cd').textContent=now.getDate();
 const D={};for(const e of S.log)(D[dk(e.t)]=D[dk(e.t)]||[]).push(e);
 const te=(D[today()]||[]).slice().sort((a,b)=>b.t-a.t);
 $('td').innerHTML=te.length?te.map(e=>rowH(e,true)).join(''):'<div class="mu">No water logged yet today. Tap +1 Glass after you drink.</div>';
 const ks=Object.keys(D).sort().reverse();
 $('hs').innerHTML=ks.length?ks.map(k=>{const es=D[k].sort((a,b)=>b.t-a.t),x=m[k];
  return '<details><summary><span>'+lbl(k)+'</span><span class="tag">'+x.g+' '+pl(x.g)+' · '+lit(x.ml)+' L</span></summary>'+es.map(e=>rowH(e,false)).join('')+'</details>'}).join(''):'<div class="mu">No history yet.</div>';
 let h=P.map(ml=>'<button class="gl'+(S.size===ml?' sel':'')+'" onclick="setSize('+ml+')">'+glass(ml)+'<div>'+ml+' ml</div></button>').join('');
 if(S.size&&!P.includes(S.size))h+='<button class="gl sel">'+glass(S.size)+'<div>'+S.size+' ml</div></button>';
 $('gr').innerHTML=h;
 $('gq').innerHTML=GS.map(v=>'<button class="gl'+(g===v?' sel':'')+'" onclick="setGoal('+v+')"><div>'+lit(v)+' L</div></button>').join('');
 $('th').innerHTML=TH.map(t=>'<button class="gl'+((S.theme||'auto')===t?' sel':'')+'" onclick="setTheme(\''+t+'\')"><div>'+t[0].toUpperCase()+t.slice(1)+'</div></button>').join('');
 $('cur').textContent=S.size?'Current: '+S.size+' ml per glass':'No size chosen yet'}
function show(p){
 document.querySelectorAll('.pg').forEach(s=>s.classList.toggle('on',s.id===p));
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
 scrollTo(0,0)}
/* ---------- Calculator (separate from the log) ---------- */
let ex='',sub='',fresh=false;
const isOp=c=>'+−×÷'.includes(c);
function calcEval(s){
 if(!s)return null;
 if(s[0]==='−')s='0'+s;
 if(isOp(s[s.length-1]))s=s.slice(0,-1);
 const t=s.match(/\d+\.?\d*|[+−×÷]/g);
 if(!t)return null;
 const n=[],o=[];
 for(const x of t){if(isOp(x))o.push(x);else n.push(parseFloat(x))}
 if(n.length!==o.length+1)return null;
 const N=[n[0]],O=[];
 for(let i=0;i<o.length;i++){
  if(o[i]==='×')N[N.length-1]*=n[i+1];
  else if(o[i]==='÷'){if(n[i+1]===0)return'DIV0';N[N.length-1]/=n[i+1]}
  else{O.push(o[i]);N.push(n[i+1])}
 }
 let r=N[0];
 for(let i=0;i<O.length;i++)r=O[i]==='+'?r+N[i+1]:r-N[i+1];
 return r}
function fmtNum(r){
 r=parseFloat(r.toPrecision(12));if(r===0)r=0;
 return r.toLocaleString('en-US',{maximumFractionDigits:10,useGrouping:false}).replace('-','−')}
function calcRender(){
 $('ce').textContent=ex||'0';
 $('ce').style.fontSize=ex.length>16?'22px':ex.length>10?'28px':'36px';
 let p=sub;
 if(!p&&ex.length>1&&!isOp(ex[ex.length-1])&&/[+−×÷]/.test(ex.slice(1))){
  const r=calcEval(ex);
  p=r==='DIV0'?'Cannot divide by 0':(typeof r==='number'&&isFinite(r)?'= '+fmtNum(r):'')}
 $('cr').textContent=p}
function press(k){
 const ps=sub;sub='';
 const cur=()=>ex.match(/[\d.]*$/)[0];
 if(k==='C'){ex='';fresh=false}
 else if(k==='⌫'){if(fresh){ex='';fresh=false}else ex=ex.slice(0,-1)}
 else if(k==='='){
  if(ex.length<2||isOp(ex[ex.length-1])||!/[+−×÷]/.test(ex.slice(1))){sub=ps;calcRender();return}
  const r=calcEval(ex);
  if(r==='DIV0')sub='Cannot divide by 0';
  else if(r===null||!isFinite(r))sub='Error';
  else{sub=ex+' =';ex=fmtNum(r);fresh=true}
 }
 else if(isOp(k)){
  fresh=false;
  if(ex===''){if(k==='−')ex='−'}
  else if(ex!=='−'){
   if(ex.endsWith('.'))ex=ex.slice(0,-1);
   ex=isOp(ex[ex.length-1])?ex.slice(0,-1)+k:ex+k}
 }
 else if(k==='.'){
  if(fresh){ex='';fresh=false}
  const c=cur();
  if(!c.includes('.'))ex+=c===''?'0.':'.'}
 else{
  if(fresh){ex='';fresh=false}
  const c=cur();
  if(k==='00'&&(c===''||c==='0')){}
  else if(c==='0'){ex=ex.slice(0,-1)+k}
  else if(c.replace('.','').length<12&&ex.length<60)ex+=k}
 calcRender()}
const KEYS=[['C','fn'],['⌫','fn'],['÷','op'],['×','op'],['7',''],['8',''],['9',''],['−','op'],['4',''],['5',''],['6',''],['+','op'],['1',''],['2',''],['3',''],['=','eq'],['0',''],['00',''],['.','']];
$('keys').innerHTML=KEYS.map(k=>'<button class="k '+k[1]+'" data-k="'+k[0]+'">'+k[0]+'</button>').join('');
$('keys').onclick=e=>{const b=e.target.closest('button');if(b)press(b.dataset.k)};
/* ---------- Wiring ---------- */
$('p1').onclick=()=>addN(1);
$('qm').onclick=()=>{if(q>1){q--;render()}};
$('qp').onclick=()=>{if(q<50){q++;render()}};
$('qa').onclick=()=>addN(q);
$('qr').onclick=()=>addN(-q);
$('chip').onclick=()=>show('set');
$('gs').onclick=()=>{$('md').style.display='none';show('set')};
$('md').onclick=e=>{if(e.target===$('md'))$('md').style.display='none'};
$('ok').onclick=()=>{const v=$('on').value.trim();if(!v){toast('Please enter your name');return}S.name=v.slice(0,24);save();render()};
$('on').onkeydown=e=>{if(e.key==='Enter')$('ok').click()};
$('ns').onclick=()=>{const v=$('nm').value.trim();if(!v){toast('Please enter a name');return}S.name=v.slice(0,24);save();render();toast('Name saved')};
$('pc1').onclick=()=>$('ph').click();
$('ph').onchange=e=>{pickPhoto(e.target.files[0]);e.target.value=''};
$('pr').onclick=()=>{delete S.photo;save();render()};
$('cs').onclick=()=>{const v=Number($('cu').value);
 if(!Number.isInteger(v)||v<50||v>1000){toast('Enter a whole number from 50 to 1000 ml');return}
 $('cu').value='';setSize(v)};
$('ra').onclick=()=>{
 if(!confirm('Reset everything?\n\nThis removes your glass size and ALL glass counts and history. This cannot be undone.'))return;
 S.size=null;S.log=[];q=1;save();render();toast('Everything has been reset')};
document.addEventListener('contextmenu',e=>{if(!e.target.closest('input'))e.preventDefault()});
let day=today();
setInterval(()=>{if(today()!==day){day=today();render()}},30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){day=today();render()}});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
theme();render();calcRender();
