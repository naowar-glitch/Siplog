/* lang.js: language picker and translation of the main screens */
(function(){
if(document.getElementById('p-lang')||!document.getElementById('cal'))return;
const K=['Home','Calendar','Clock','History','Settings',"Today's intake",'Remaining','+1 Glass','Add or remove glasses','Add','Remove','Calculator',"Today's log",'Statistics','Week','Month','Daily intake','Daily Water Goal','Default Glass Size','Appearance','App Theme','Data & Privacy','Reset All Data','About SipLog','Privacy Policy','About App','Contact & Feedback','Language','Alarm','World clock','Timer','Stopwatch','Start','Stop','Reset','Save','Notifications','My Profile','Personal Information','Member Since','Achievements','Dates','Months','Today','Yesterday','Goals','Day by day'];
const D={
hi:['होम','कैलेंडर','घड़ी','इतिहास','सेटिंग्स','आज का सेवन','बाकी','+1 गिलास','गिलास जोड़ें या हटाएं','जोड़ें','हटाएं','कैलकुलेटर','आज का लॉग','आंकड़े','सप्ताह','महीना','दैनिक सेवन','दैनिक पानी लक्ष्य','डिफ़ॉल्ट गिलास आकार','दिखावट','ऐप थीम','डेटा और गोपनीयता','सारा डेटा रीसेट करें','SipLog के बारे में','गोपनीयता नीति','ऐप के बारे में','संपर्क और फीडबैक','भाषा','अलार्म','विश्व घड़ी','टाइमर','स्टॉपवॉच','शुरू करें','रोकें','रीसेट','सेव करें','सूचनाएं','मेरी प्रोफ़ाइल','व्यक्तिगत जानकारी','सदस्यता तिथि','उपलब्धियां','तारीखें','महीने','आज','कल','लक्ष्य','दिन-प्रतिदिन'],
ja:['ホーム','カレンダー','時計','履歴','設定','今日の摂取量','残り','+1 杯','杯数の追加・削除','追加','削除','電卓','今日の記録','統計','週','月','1日の摂取量','1日の水分目標','既定のグラスサイズ','外観','アプリのテーマ','データとプライバシー','すべてのデータをリセット','SipLogについて','プライバシーポリシー','アプリについて','お問い合わせ・フィードバック','言語','アラーム','世界時計','タイマー','ストップウォッチ','開始','停止','リセット','保存','通知','マイプロフィール','個人情報','登録日','実績','日付','月別','今日','昨日','目標','日別'],
zh:['首页','日历','时钟','历史','设置','今日饮水量','剩余','+1 杯','增减杯数','添加','移除','计算器','今日记录','统计','周','月','每日饮水量','每日饮水目标','默认杯子容量','外观','应用主题','数据与隐私','重置所有数据','关于 SipLog','隐私政策','关于应用','联系与反馈','语言','闹钟','世界时钟','计时器','秒表','开始','停止','重置','保存','通知','我的资料','个人信息','加入时间','成就','日期','月份','今天','昨天','目标','每日明细'],
ur:['ہوم','کیلنڈر','گھڑی','ہسٹری','ترتیبات','آج کی مقدار','باقی','+1 گلاس','گلاس شامل یا کم کریں','شامل کریں','ہٹائیں','کیلکولیٹر','آج کا لاگ','اعداد و شمار','ہفتہ','مہینہ','روزانہ مقدار','روزانہ پانی کا ہدف','ڈیفالٹ گلاس سائز','ظاہری شکل','ایپ تھیم','ڈیٹا اور پرائیویسی','تمام ڈیٹا ری سیٹ کریں','SipLog کے بارے میں','پرائیویسی پالیسی','ایپ کے بارے میں','رابطہ اور فیڈبیک','زبان','الارم','عالمی گھڑی','ٹائمر','اسٹاپ واچ','شروع کریں','روکیں','ری سیٹ','محفوظ کریں','اطلاعات','میری پروفائل','ذاتی معلومات','رکنیت کی تاریخ','کامیابیاں','تاریخیں','مہینے','آج','کل','ہدف','روزانہ تفصیل'],
ar:['الرئيسية','التقويم','الساعة','السجل','الإعدادات','استهلاك اليوم','المتبقي','+1 كوب','إضافة أو إزالة أكواب','إضافة','إزالة','الآلة الحاسبة','سجل اليوم','الإحصائيات','أسبوع','شهر','الاستهلاك اليومي','هدف الماء اليومي','حجم الكوب الافتراضي','المظهر','سمة التطبيق','البيانات والخصوصية','إعادة ضبط كل البيانات','حول SipLog','سياسة الخصوصية','حول التطبيق','اتصل بنا والملاحظات','اللغة','المنبه','الساعة العالمية','المؤقت','ساعة الإيقاف','ابدأ','إيقاف','إعادة ضبط','حفظ','الإشعارات','ملفي الشخصي','المعلومات الشخصية','عضو منذ','الإنجازات','التواريخ','الأشهر','اليوم','أمس','الهدف','يوماً بيوم'],
bn:['হোম','ক্যালেন্ডার','ঘড়ি','ইতিহাস','সেটিংস','আজকের পান','বাকি','+1 গ্লাস','গ্লাস যোগ বা বাদ দিন','যোগ করুন','সরান','ক্যালকুলেটর','আজকের লগ','পরিসংখ্যান','সপ্তাহ','মাস','দৈনিক পান','দৈনিক পানির লক্ষ্য','ডিফল্ট গ্লাসের আকার','চেহারা','অ্যাপ থিম','ডেটা ও গোপনীয়তা','সব ডেটা রিসেট করুন','SipLog সম্পর্কে','গোপনীয়তা নীতি','অ্যাপ সম্পর্কে','যোগাযোগ ও মতামত','ভাষা','অ্যালার্ম','বিশ্ব ঘড়ি','টাইমার','স্টপওয়াচ','শুরু করুন','থামান','রিসেট','সংরক্ষণ করুন','বিজ্ঞপ্তি','আমার প্রোফাইল','ব্যক্তিগত তথ্য','সদস্য হওয়ার তারিখ','অর্জন','তারিখ','মাসসমূহ','আজ','গতকাল','লক্ষ্য','দিন অনুযায়ী'],
ta:['முகப்பு','நாட்காட்டி','கடிகாரம்','வரலாறு','அமைப்புகள்','இன்றைய அளவு','மீதம்','+1 குவளை','குவளைகளைச் சேர்/நீக்கு','சேர்','நீக்கு','கணிப்பான்','இன்றைய பதிவு','புள்ளிவிவரம்','வாரம்','மாதம்','தினசரி அளவு','தினசரி தண்ணீர் இலக்கு','இயல்புநிலை குவளை அளவு','தோற்றம்','ஆப் தீம்','தரவு மற்றும் தனியுரிமை','அனைத்து தரவையும் மீட்டமை','SipLog பற்றி','தனியுரிமைக் கொள்கை','ஆப் பற்றி','தொடர்பு மற்றும் கருத்து','மொழி','அலாரம்','உலக கடிகாரம்','டைமர்','ஸ்டாப்வாட்ச்','தொடங்கு','நிறுத்து','மீட்டமை','சேமி','அறிவிப்புகள்','என் சுயவிவரம்','தனிப்பட்ட தகவல்','உறுப்பினர் ஆன தேதி','சாதனைகள்','தேதிகள்','மாதங்கள்','இன்று','நேற்று','இலக்கு','நாள்வாரியாக']};
const M={};
for(const l in D){M[l]={};K.forEach((k,i)=>M[l][k]=D[l][i])}
const LG=[['en','English'],['hi','हिन्दी'],['ja','日本語'],['zh','中文'],['ur','اردو'],['ar','العربية'],['bn','বাংলা'],['ta','தமிழ்']];
const sty=document.createElement('style');
sty.textContent='[dir=rtl] .li,[dir=rtl] .sr{text-align:right}[dir=rtl] .bk{transform:scaleX(-1)}';
document.head.appendChild(sty);
document.querySelector('nav').insertAdjacentHTML('beforebegin','<div class="sp" id="p-lang"><div class="sph"><button class="bk" data-bk>‹</button><b>Language</b></div><div class="spb"><div class="card" style="margin-top:0;padding:6px 16px" id="lgl"></div><p>The main screens are translated. Long texts such as the privacy policy stay in English for now.</p></div></div>');
const sec=[...document.querySelectorAll('#set .sec')].find(e=>e.textContent==='Data & Privacy');
if(sec)sec.insertAdjacentHTML('beforebegin','<div class="mu sec">Language</div><div class="card list" style="margin-top:0"><button class="li" id="s-lang"><span class="ic">🌐</span><span>Language</span><em id="v-lang"></em></button></div>');
const orig=new WeakMap();
let busy=false,tmr=null;
const ob=new MutationObserver(()=>{if(!busy&&(S.lang||'en')!=='en'){clearTimeout(tmr);tmr=setTimeout(run,60)}});
function walk(m){
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 const a=[];while(w.nextNode())a.push(w.currentNode);
 for(const n of a){
  const raw=orig.has(n)?orig.get(n):n.nodeValue;
  const mm=raw.match(/^([^\p{L}\p{N}+]*)([\s\S]*?)(\s*)$/u);
  const tr=m&&mm&&mm[2]?m[mm[2]]:null;
  if(tr){if(!orig.has(n))orig.set(n,raw);const v=mm[1]+tr+mm[3];if(n.nodeValue!==v)n.nodeValue=v}
  else if(orig.has(n)){if(n.nodeValue!==orig.get(n))n.nodeValue=orig.get(n);orig.delete(n)}}}
function run(){busy=true;ob.disconnect();walk(M[S.lang||'en']||null);ob.observe(document.body,{childList:true,subtree:true,characterData:true});busy=false}
function lgR(){
 const cur=S.lang||'en';
 $('lgl').innerHTML=LG.map(x=>'<button class="sr'+(cur===x[0]?' on':'')+'" data-l="'+x[0]+'"><span class="rd"></span><span style="flex:1">'+x[1]+'</span></button>').join('');
 $('v-lang').textContent=LG.find(x=>x[0]===cur)[1]}
function setLang(l){
 S.lang=l;save();
 document.documentElement.dir=(l==='ur'||l==='ar')?'rtl':'ltr';
 document.documentElement.lang=l;
 lgR();run()}
$('lgl').onclick=e=>{const b=e.target.closest('[data-l]');if(b)setLang(b.dataset.l)};
$('s-lang').onclick=()=>{lgR();openP('p-lang')};
document.querySelectorAll('#p-lang [data-bk]').forEach(b=>b.onclick=()=>history.back());
lgR();
document.documentElement.dir=(S.lang==='ur'||S.lang==='ar')?'rtl':'ltr';
run();
})();
