/* alarmui.js: glass theme, alarm screens, center button */
(function(){
if(document.getElementById('alarm'))return;
const css=`
:root{--bg:radial-gradient(70% 38% at 8% 0%,rgba(124,108,240,.55),transparent 62%),radial-gradient(60% 34% at 100% 28%,rgba(56,189,248,.45),transparent 62%),radial-gradient(70% 40% at 0% 100%,rgba(236,72,153,.3),transparent 62%),linear-gradient(165deg,#eef1ff,#e1ecff);--cd:rgba(255,255,255,.42);--soft:rgba(255,255,255,.5);--bd:rgba(110,100,200,.22);--sh:0 10px 28px rgba(60,70,170,.16),inset 0 1px 0 rgba(255,255,255,.85),inset 0 0 0 1px rgba(255,255,255,.35);--op:#f3f1ff}
:root[data-d]{--bg:radial-gradient(70% 38% at 8% 0%,rgba(139,92,246,.55),transparent 62%),radial-gradient(60% 34% at 100% 28%,rgba(34,211,238,.3),transparent 62%),radial-gradient(70% 40% at 0% 100%,rgba(236,72,153,.32),transparent 62%),linear-gradient(165deg,#05040d,#0f0a26);--cd:rgba(255,255,255,.08);--soft:rgba(255,255,255,.09);--bd:rgba(255,255,255,.16);--sh:0 10px 28px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.22),inset 0 0 0 1px rgba(255,255,255,.06);--op:#1a1340}
.sheet,.mb{background:var(--op)}
#toast{background:var(--op);color:var(--tx);border:1px solid var(--bd)}
nav{-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
nav .fab{border:3px solid rgba(255,255,255,.6)}
nav .fab.on{background:var(--g);color:#fff}
.lnk{display:none}
.sph b{flex:1}
.lnk2{padding:10px 18px;border-radius:14px;background:var(--g);color:#fff;font-weight:800}
#avb::after{content:none}
.ahero{position:relative;overflow:hidden;border-radius:28px;padding:22px;min-height:120px;color:#fff;box-shadow:var(--sh)}
.aart{position:absolute;inset:0;opacity:.3;font-size:26px;line-height:1.7;letter-spacing:8px;overflow:hidden;word-break:break-all;pointer-events:none}
.anx{position:relative;font-size:28px;font-weight:800;margin-top:6px}
.note{color:var(--mu);font-size:13px;line-height:1.5;margin:12px 4px}
.al{display:flex;align-items:center;gap:12px;padding:16px;margin-top:12px;border-radius:24px;background:var(--cd);border:1px solid var(--bd);box-shadow:var(--sh)}
.alm{flex:1;min-width:0}
.atime{font-size:38px;font-weight:800;line-height:1}
.atime small{font-size:16px;margin-left:4px}
.adays{color:var(--mu);font-size:14px;margin-top:6px}
.al.off .atime{opacity:.45}
.sw{display:inline-block;width:54px;height:32px;border-radius:999px;background:var(--soft);border:1px solid var(--bd);position:relative;flex:none;padding:0}
.sw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.sw.on{background:var(--g)}
.sw.on i{transform:translateX(22px)}
.dys{display:flex;justify-content:space-between}
.dys button{width:42px;height:42px;border-radius:50%;background:var(--soft);font-weight:700}
.dys button.on{background:var(--g);color:#fff}
.tbig{display:block;position:relative;font-size:54px;font-weight:800}
.tbig input{position:absolute;inset:0;opacity:0;width:100%;height:100%}
.sg2{display:flex;border-radius:999px;padding:4px;background:var(--soft)}
.sg2 button{flex:1;padding:10px;border-radius:999px;font-weight:700;color:var(--mu)}
.sg2 button.on{background:var(--g);color:#fff}
.thm{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.thm button{height:70px;border-radius:18px;color:#fff;font-weight:700;font-size:12px;border:2px solid transparent}
.thm button.on{border-color:var(--ac);box-shadow:0 0 0 2px var(--ac)}
#ring{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;text-align:center;color:#fff;padding:30px}
.rbg{position:absolute;inset:0}
.rin{position:relative;width:100%;max-width:360px}
.rtm{font-size:68px;font-weight:800;text-shadow:0 4px 20px rgba(0,0,0,.25)}
.rl{font-size:22px;margin:8px 0 40px}
.ahd{color:var(--mu);font-size:14px;margin:0 0 12px;font-weight:600}
.agrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.ac{padding:16px 12px;border-radius:22px;background:var(--soft);border:1px solid var(--bd);text-align:center;box-shadow:var(--sh)}
.ac:last-child:nth-child(odd){grid-column:1/-1}
.am{width:58px;height:58px;margin:0 auto 10px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;background:var(--soft);filter:grayscale(1);opacity:.55}
.ac.on .am{background:var(--g);filter:none;opacity:1;box-shadow:0 8px 20px var(--pg)}
.ac b{display:block;font-size:15px}
.ac small{display:block;color:var(--mu);font-size:12px;margin:3px 0 10px}
.ab{height:7px;border-radius:4px;background:var(--bd);overflow:hidden}
.ab i{display:block;height:100%;background:var(--g);border-radius:4px}
.ac span{display:block;font-size:12px;font-weight:700;color:var(--mu);margin-top:6px}
.ac.on span{color:var(--ac)}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const sec=`<section id="alarm" class="pg">
 <div class="top"><b class="pt">Alarms</b><button class="tg"><i></i></button></div>
 <div class="ahero" id="ahero"><div class="aart" id="aart"></div><div style="position:relative;opacity:.85;font-size:13px;letter-spacing:2px">NEXT ALARM</div><div class="anx" id="anx"></div></div>
 <p class="note">Alarms ring while SipLog is open on screen. For wake-up alarms use the phone Clock: open an alarm here and tap Add to phone Clock.</p>
 <div id="alist"></div>
 <button class="plus" id="aadd">＋ Add alarm</button>
 <div class="card"><h3>Alarm theme</h3><div class="thm" id="athm"></div></div>
</section>`;
const pages=`<div class="sp" id="p-aled"><div class="sph"><button class="bk" data-bk>‹</button><b id="aet">New alarm</b><button class="igc" id="adel">🗑️</button><button class="lnk2" id="asv">Save</button></div><div class="spb">
<div class="card ctr" style="margin-top:0"><label class="tbig"><span id="atd">08:00 AM</span><input type="time" id="ati" value="08:00"></label><div class="mu2">Tap the time to change it</div></div>
<div class="card"><h3>Repeat</h3><div class="dys" id="adys"></div><div class="mu2" id="arp" style="margin-top:10px"></div></div>
<div class="card"><h3>Label</h3><input id="alb" maxlength="30" placeholder="e.g. Drink water" autocomplete="off"></div>
<div class="card"><button class="li" id="atn"><span class="ic">🎵</span><span>Ringtone</span><em id="atv"></em></button>
<h3 style="margin:14px 0 10px">Ring length</h3><div class="sg2" id="adu"></div>
<button class="li" id="avb" style="margin-top:8px"><span class="ic">📳</span><span>Vibrate</span><span class="sw" id="avs"><i></i></span></button></div>
<button class="plus" id="aclk" style="background:var(--soft);color:var(--tx);box-shadow:none">⏰ Add to phone Clock</button>
</div></div>
<div class="sp" id="p-tone"><div class="sph"><button class="bk" data-bk>‹</button><b>Ringtone</b></div><div class="spb"><div class="card" style="margin-top:0" id="tlist"></div><button class="plus" id="tadd" style="background:var(--soft);color:var(--tx);box-shadow:none">＋ Add my own tone</button><input type="file" id="tfile" accept="audio/*" hidden><p>Tap a tone to select it and hear a short preview. Your own tones must be under 2 MB.</p></div></div>
<div id="ring"><div class="rbg" id="rbg"></div><div class="aart" id="rart"></div><div class="rin"><div class="rtm" id="rt2"></div><div class="rl" id="rl"></div><button class="plus" id="rst">Stop</button><button class="plus" id="rsz" style="background:rgba(255,255,255,.25);box-shadow:none">Snooze 5 min</button></div></div>`;
document.querySelector('main').insertAdjacentHTML('beforeend',sec);
document.querySelector('nav').insertAdjacentHTML('beforebegin',pages);
const fab=document.querySelector('nav .fab');
if(fab){fab.removeAttribute('data-o');fab.setAttribute('data-p','alarm');fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px"><circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5M5 4 2 7M19 4l3 3"/></svg>';fab.onclick=()=>show('alarm')}
})();
