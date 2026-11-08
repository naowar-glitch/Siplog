/* alset.js: alarm settings, sounds, volume, themes */
(function(){
if(!document.getElementById('p-alset'))throw new Error('clockui.js missing');
const g=(k,d)=>S[k]==null?d:S[k];
ATH.length=0;
ATH.push(['Aurora','linear-gradient(160deg,#4c1d95,#db2777)',''],['Lagoon','linear-gradient(160deg,#0f766e,#2563eb)',''],['Sunset','linear-gradient(160deg,#f59e0b,#7c3aed)','']);
if(!(S.alTh>=0&&S.alTh<3))S.alTh=0;
Object.assign(TONES,{
 morning:['Morning Dew',[[659,.3],[784,.3],[988,.3],[1319,.6],[0,.5]]],
 silver:['Silver Bell',[[1568,.2],[1319,.2],[1568,.2],[2093,.6],[0,.6]]],
 star:['Starlight',[[880,.35],[1108,.35],[1318,.35],[1760,.7],[1318,.35],[0,.6]]],
 gentle:['Gentle Rise',[[262,.5],[330,.5],[392,.5],[523,.5],[659,.9],[0,.5]]],
 pulse:['Pulse',[[740,.12],[0,.1],[740,.12],[0,.1],[740,.12],[0,.1],[988,.3],[0,.7]]]});
const AT=()=>{if($('alarm').classList.contains('on'))document.documentElement.setAttribute('data-at',S.alTh);else document.documentElement.removeAttribute('data-at')};
const _show=show;show=function(p){_show(p);AT()};
const _al=alRender;alRender=function(){_al();$('ahero').style.background='';AT()};
function applyVol(v,grad){
 if(MG&&AC){const t=AC.currentTime;MG.gain.cancelScheduledValues(t);
  if(grad){MG.gain.setValueAtTime(.03,t);MG.gain.linearRampToValueAtTime(v,t+10)}else MG.gain.setValueAtTime(v,t)}
 if(au){
  if(grad){au.volume=.05;let x=.05;const i=setInterval(()=>{x=Math.min(v,x+v/20);if(au)au.volume=x;if(!au||x>=v)clearInterval(i)},500)}
  else au.volume=v}}
const _sd=sound;
sound=function(id,vib,vol){_sd(id,vib);applyVol(vol==null?g('alVol',.8):vol,vol==null&&vib===true&&g('alGr',false))};
const _oe=openEdit;
openEdit=function(id){_oe(id);if(ed&&ed.isNew){ed.tone=g('alSnd','dream');ed.vib=g('alVib',true);ed.dur=g('alDur',30);fillEdit()}};
const _rn=ringNow;
ringNow=function(a){_rn(a);const n=g('alSnz',5);$('rsz').style.display='';$('rsz').textContent='Snooze '+n+' min'};
$('rsz').onclick=()=>{const a=ringA,n=g('alSnz',5);stopRing();toast('Snoozed for '+n+' minutes');setTimeout(()=>ringNow(a),n*60000)};
const segs=[['sg-dur',[15,30,40,60],'alDur',30,'s'],['sg-snz',[5,10,15],'alSnz',5,' min']];
const sws=[['alVib',true,'s-avib','sw-avib'],['alGr',false,'s-agr','sw-agr'],['tmVib',true,'s-tvib','sw-tvib']];
function setR(){
 $('v-asnd').textContent=toneName(g('alSnd','dream'));$('v-tsnd').textContent=toneName(g('tmSnd','dream'));
 sws.forEach(x=>$(x[3]).classList.toggle('on',g(x[0],x[1])));
 segs.forEach(s=>$(s[0]).innerHTML=s[1].map(v=>'<button data-v="'+v+'" class="'+(g(s[2],s[3])===v?'on':'')+'">'+v+s[4]+'</button>').join(''))}
segs.forEach(s=>$(s[0]).onclick=e=>{const b=e.target.closest('button');if(b){S[s[2]]=+b.dataset.v;save();setR()}});
sws.forEach(x=>$(x[2]).onclick=()=>{S[x[0]]=!g(x[0],x[1]);save();setR()});
let sctx='al';
const SK={al:['alSnd','alVol','Alarm sound'],tm:['tmSnd','tmVol','Timer sound']};
function sndR(){
 const k=SK[sctx],cur=g(k[0],'dream');
 $('snt').textContent=k[2];
 const all=Object.keys(TONES).map(i=>[i,TONES[i][0],0]).concat(S.tones.map(t=>[t.id,t.name,1]));
 $('snl').innerHTML=all.map(x=>'<button class="sr'+(cur===x[0]?' on':'')+'" data-k="'+x[0]+'"><span class="rd"></span><span style="flex:1">'+esc(x[1])+'</span>'+(x[2]?'<span class="x" data-del="'+x[0]+'">✕</span>':'')+'</button>').join('');
 $('svol').value=g(k[1],.8)}
function openSnd(c){sctx=c;sndR();openP('p-snd')}
$('s-asnd').onclick=()=>openSnd('al');
$('s-tsnd').onclick=()=>openSnd('tm');
$('snl').onclick=e=>{
 const k=SK[sctx],d=e.target.closest('[data-del]');
 if(d){S.tones=S.tones.filter(t=>t.id!==d.dataset.del);['alSnd','tmSnd'].forEach(q=>{if(S[q]===d.dataset.del)S[q]='dream'});save();sndR();setR();return}
 const b=e.target.closest('.sr');
 if(b){S[k[0]]=b.dataset.k;save();sndR();setR();sound(S[k[0]],false,g(k[1],.8));sT=setTimeout(stopSound,4000)}};
$('svol').oninput=()=>{const v=+$('svol').value;S[SK[sctx][1]]=v;applyVol(v,false)};
$('svol').onchange=()=>save();
$('sna').onclick=()=>$('tfile2').click();
$('tfile2').onchange=e=>{
 const f=e.target.files[0];e.target.value='';if(!f)return;
 if(f.size>2*1048576){toast('Tone must be under 2 MB');return}
 const r=new FileReader();
 r.onload=()=>{
  const t={id:'c'+aid(),name:f.name.replace(/\.[^.]+$/,'').slice(0,24),data:r.result};
  S.tones.push(t);
  try{localStorage.setItem(K,JSON.stringify(S))}catch(x){S.tones.pop();toast('Not enough storage for this tone');return}
  S[SK[sctx][0]]=t.id;sndR();setR();toast('Tone added')};
 r.readAsDataURL(f)};
$('alg').onclick=()=>{setR();openP('p-alset')};
document.querySelectorAll('#p-alset [data-sp]').forEach(b=>b.onclick=()=>openP(b.dataset.sp));
document.querySelectorAll('#p-alset [data-bk],#p-snd [data-bk],#p-city [data-bk]').forEach(b=>b.onclick=()=>history.back());
setR();alRender();AT();
})();
