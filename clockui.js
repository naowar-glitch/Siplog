/* clockui.js: clock tabs, settings, sound and city pages, 3 themes, live clock icon */
(function(){
const sec=document.getElementById('alarm');
if(!sec||document.getElementById('v-world'))return;
const css=`
#hist .tg,#stat .tg,#alarm .tg{display:none}
:root[data-at]{--cd:rgba(255,255,255,.14);--soft:rgba(255,255,255,.18);--bd:rgba(255,255,255,.26);--tx:#fff;--mu:rgba(255,255,255,.78);--rd:#ffd0d8;--sh:0 10px 28px rgba(20,0,60,.3),inset 0 1px 0 rgba(255,255,255,.35)}
:root[data-at="0"]{--bg:linear-gradient(160deg,#3b0764,#6d28d9 45%,#db2777);--ac:#f9a8d4;--ac2:#c4b5fd;--g:linear-gradient(135deg,#a78bfa,#f472b6);--pg:rgba(244,114,182,.5);--op:#3b0f7a}
:root[data-at="1"]{--bg:linear-gradient(160deg,#064e3b,#0891b2 48%,#2563eb);--ac:#99f6e4;--ac2:#7dd3fc;--g:linear-gradient(135deg,#2dd4bf,#38bdf8);--pg:rgba(45,212,191,.5);--op:#0b4a6f}
:root[data-at="2"]{--bg:linear-gradient(160deg,#f59e0b,#ef4444 48%,#7c3aed);--ac:#fde68a;--ac2:#fecaca;--g:linear-gradient(135deg,#fbbf24,#fb7185);--pg:rgba(251,113,133,.5);--op:#7a2330}
.ahero{background:var(--cd)}
.ctabs{display:flex;gap:8px;overflow-x:auto;margin:6px 0 14px;scrollbar-width:none}
.ctabs button{flex:1;padding:10px 12px;border-radius:999px;background:var(--soft);font-weight:700;font-size:13px;color:var(--mu);white-space:nowrap}
.ctabs button.on{background:var(--g);color:#fff}
.wch{display:flex;align-items:center;justify-content:space-between}
.plusb{width:44px;height:44px;border-radius:50%;background:var(--g);color:#fff;font-size:26px;line-height:1;flex:none;box-shadow:0 6px 16px var(--pg)}
.wc{display:flex;align-items:center;gap:12px;padding:16px;margin-top:12px;border-radius:24px;background:var(--cd);border:1px solid var(--bd);box-shadow:var(--sh)}
.wc b{font-size:20px}
.wt{font-size:34px;font-weight:800;white-space:nowrap}
.wt small{font-size:14px;margin-left:3px}
.rg2{position:relative;width:240px;height:240px;margin:8px auto}
.rg2 svg{width:100%;height:100%}
.rtime{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;font-variant-numeric:tabular-nums}
.tin{display:flex;gap:10px;justify-content:center;margin:14px 0}
.tin div{text-align:center}
.tin input{width:78px;text-align:center;font-size:26px;padding:10px}
.tin small{display:block;color:var(--mu);font-size:12px;margin-top:4px}
.chs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.chs button{padding:9px 14px;border-radius:999px;background:var(--soft);font-weight:700;font-size:13px}
.swt{font-size:56px;font-weight:800;text-align:center;margin:20px 0;font-variant-numeric:tabular-nums}
.lp{display:flex;justify-content:space-between;padding:12px 4px;border-top:1px solid var(--bd);font-variant-numeric:tabular-nums}
.lp:first-child{border-top:0}
.li.nr::after{content:none}
.fr2{display:flex;align-items:center;gap:12px;padding:12px 0 8px;font-weight:600}
.sr{display:flex;align-items:center;gap:14px;width:100%;padding:15px 4px;border-top:1px solid var(--bd);text-align:left;font-size:17px}
.sr:first-child{border-top:0}
.rd{width:26px;height:26px;border-radius:50%;border:2px solid var(--mu);flex:none;position:relative}
.sr.on .rd{border-color:var(--ac)}
.sr.on .rd::after{content:"";position:absolute;inset:4px;border-radius:50%;background:var(--ac)}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const top=sec.querySelector('.top');
top.innerHTML='<button class="bk" id="alg">⚙️</button><b class="pt">Clock</b>';
const va=document.createElement('div');va.id='v-alarm';
[...sec.children].filter(c=>c!==top).forEach(c=>va.appendChild(c));
const tabs=document.createElement('div');tabs.className='ctabs';tabs.id='ctabs';
tabs.innerHTML=['Alarm','World clock','Timer','Stopwatch'].map((n,i)=>'<button data-v="'+i+'"'+(i?'':' class="on"')+'>'+n+'</button>').join('');
sec.appendChild(tabs);sec.appendChild(va);
sec.insertAdjacentHTML('beforeend',`<div id="v-world" style="display:none"><div class="wch"><b style="font-size:20px">World clock</b><button class="plusb" id="wadd">＋</button></div><div id="wlist"></div></div>
<div id="v-timer" style="display:none">
<div class="rg2"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="88" fill="none" stroke-width="10" style="stroke:var(--soft)"/><circle id="tmc" cx="100" cy="100" r="88" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="552.9" stroke-dashoffset="0" transform="rotate(-90 100 100)" style="stroke:var(--ac)"/></svg><div class="rtime" id="tmt">00:05:00</div></div>
<div class="tin"><div><input type="number" inputmode="numeric" id="tmh" min="0" max="23"><small>hours</small></div><div><input type="number" inputmode="numeric" id="tmm" min="0" max="59"><small>min</small></div><div><input type="number" inputmode="numeric" id="tmsec" min="0" max="59"><small>sec</small></div></div>
<div class="chs" id="tpre"></div>
<div class="row"><button class="rem" id="tmx">Reset</button><button id="tmg">Start</button></div>
<button class="plus" id="tmk" style="background:var(--soft);color:var(--tx);box-shadow:none">⏱ Also start in phone Clock</button>
<p class="note">The timer rings while SipLog is open. For a timer that always works, use the phone Clock button.</p></div>
<div id="v-stop" style="display:none"><div class="swt" id="swt">00:00.00</div><div class="row"><button class="rem" id="swl">Reset</button><button id="swg">Start</button></div><div class="card" id="swlaps" style="display:none"></div></div>`);
document.querySelector('nav').insertAdjacentHTML('beforebegin',`<div class="sp" id="p-alset"><div class="sph"><button class="bk" data-bk>‹</button><b>Clock settings</b></div><div class="spb">
<div class="mu sec" style="margin-top:0">Theme</div><div id="athold"></div>
<div class="mu sec">Alarm</div>
<div class="card list" style="margin-top:0">
<button class="li" id="s-asnd"><span class="ic">🎵</span><span>Alarm sound</span><em id="v-asnd"></em></button>
<button class="li nr" id="s-avib"><span class="ic">📳</span><span>Vibration</span><span class="sw" id="sw-avib"><i></i></span></button>
<div class="fr2"><span class="ic">⏳</span><span>Ring length</span></div><div class="sg2" id="sg-dur"></div>
<div class="fr2"><span class="ic">💤</span><span>Snooze length</span></div><div class="sg2" id="sg-snz"></div>
<button class="li nr" id="s-agr" style="margin-top:8px"><span class="ic">📈</span><span>Start quiet, get louder</span><span class="sw" id="sw-agr"><i></i></span></button>
</div>
<div class="mu sec">Timer</div>
<div class="card list" style="margin-top:0">
<button class="li" id="s-tsnd"><span class="ic">🔔</span><span>Timer sound</span><em id="v-tsnd"></em></button>
<button class="li nr" id="s-tvib"><span class="ic">📳</span><span>Vibration</span><span class="sw" id="sw-tvib"><i></i></span></button>
</div>
<div class="mu sec">About SipLog</div>
<div class="card list" style="margin-top:0">
<button class="li" data-sp="p-priv"><span class="ic">🛡️</span><span>Privacy Policy</span></button>
<button class="li" data-sp="p-about"><span class="ic">ℹ️</span><span>About App</span></button>
</div></div></div>
<div class="sp" id="p-snd"><div class="sph"><button class="bk" data-bk>‹</button><b id="snt">Alarm sound</b><button class="plusb" id="sna">＋</button></div><div class="spb"><div class="card" style="margin-top:0;padding:6px 16px" id="snl"></div><div class="card"><div class="cth"><span class="ic">🔊</span><input type="range" id="svol" min="0" max="1" step="0.05"></div></div><input type="file" id="tfile2" accept="audio/*" hidden></div></div>
<div class="sp" id="p-city"><div class="sph"><button class="bk" data-bk>‹</button><b>Add city</b></div><div class="spb"><input id="csr" placeholder="Search city" autocomplete="off"><div class="card" id="cls" style="padding:6px 16px"></div></div></div>`);
document.getElementById('athold').appendChild(document.getElementById('athm').closest('.card'));
const fab=document.querySelector('nav .fab');
if(fab)fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:34px;height:34px"><circle cx="12" cy="12" r="10" stroke-width="1.8"/><path d="M12 3.2v1.6M12 19.2v1.6M3.2 12h1.6M19.2 12h1.6" stroke-width="1.6" stroke-linecap="round"/><line id="ckh" x1="12" y1="12" x2="12" y2="7.5" stroke-width="2.2" stroke-linecap="round"/><line id="ckm" x1="12" y1="12" x2="12" y2="5" stroke-width="1.8" stroke-linecap="round"/><line id="cks" x1="12" y1="13.5" x2="12" y2="4.5" stroke-width="1" stroke="#fde68a" stroke-linecap="round"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>';
})();
