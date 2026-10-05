/* XionTechs prototype: shared behaviour. Production would render header/footer/news server-side for SEO. */
(function(){
  const root=document.documentElement;
  root.classList.remove('no-js');root.classList.add('js-anim');
  const page=document.body.dataset.page||'';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
  const sess={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};

  /* ---------- header ---------- */
  const cur=p=>page===p?' aria-current="page"':'';
  const header=`
<a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="wrap nav-in">
  <a class="logo" href="index.html" aria-label="XionTechs home"><img src="assets/logo.png" alt="XionTechs, Get IT Done"></a>
  <nav class="menu" id="menu" aria-label="Main">
    <a href="products.html"${cur('products')} data-vi="Sản phẩm">Products</a>
    <a href="services.html"${cur('services')} data-vi="Dịch vụ">Services</a>
    <a href="news.html"${cur('news')} data-vi="Tin tức">News</a>
    <a href="about.html"${cur('about')} data-vi="Về chúng tôi">About</a>
    <a href="careers.html"${cur('careers')} data-vi="Tuyển dụng">Careers</a>
  </nav>
  <div class="tools">
    <button class="menu-btn burger" id="burger" aria-controls="menu" aria-expanded="false"><i class="ph ph-list" aria-hidden="true"></i><span class="sr-only" data-vi="Menu">Menu</span></button>
    <div class="lang"><button class="lang-btn" id="langBtn" aria-expanded="false" aria-controls="langList"><span class="sr-only" data-vi="Ngôn ngữ: ">Language: </span><span id="langCode">EN</span><i class="ph ph-caret-down" aria-hidden="true"></i></button>
      <ul class="lang-list" id="langList" hidden><li><button type="button" data-lang="en" lang="en">EN<span class="sr-only"> English</span></button></li><li><button type="button" data-lang="vi" lang="vi">VI<span class="sr-only"> Tiếng Việt</span></button></li></ul></div>
  </div>
</div></header>`;
  const footer=`
<footer class="site"><div class="wrap">
  <div class="fgrid">
    <div><a class="flogo" href="index.html"><img src="assets/logo.png" alt="XionTechs"></a>
      <p class="about" data-vi="Sản phẩm công nghệ giáo dục và dịch vụ phát triển phần mềm cho trường học và doanh nghiệp.">Education technology products and software delivery services for schools and businesses.</p></div>
    <div><h4 data-vi="Sản phẩm">Products</h4><ul><li><a href="products.html#pxp">PXP</a></li><li><a href="products.html#lxp">LXP</a></li><li><a href="products.html#sxp">SXP</a></li><li><a href="products.html#iot" data-vi="Quản lý thiết bị IoT">IoT Device Management</a></li><li><a href="products.html#updates" data-vi="Cập nhật sản phẩm">Product updates</a></li></ul></div>
    <div><h4 data-vi="Dịch vụ">Services</h4><ul><li><a href="services.html#product-engineering">Product Engineering</a></li><li><a href="services.html#ai-analytics">AI-Driven Analytics</a></li><li><a href="services.html#staffing">Staffing Service</a></li><li><a href="services.html#low-code">Low-code Solutions</a></li><li><a href="services.html#cloud">Cloud Computing</a></li><li><a href="services.html" data-vi="Tất cả dịch vụ">All services</a></li></ul></div>
    <div><h4 data-vi="Công ty">Company</h4><ul><li><a href="about.html" data-vi="Về chúng tôi">About</a></li><li><a href="about.html#values" data-vi="Giá trị cốt lõi">Core values</a></li><li><a href="about.html#faq" data-vi="Câu hỏi thường gặp">FAQ</a></li><li><a href="news.html" data-vi="Tin tức">News</a></li><li><a href="careers.html" data-vi="Tuyển dụng">Careers</a></li><li><a href="demo.html" data-vi="Liên hệ">Contact</a></li></ul></div>
    <div><h4 data-vi="Văn phòng">Offices</h4>
      <address class="office"><b>Plano, Texas, USA</b>7950 Legacy Drive, Suite 400<br>Plano, Texas 75024, USA<br><a href="tel:+14693229899">+1 469 322 9899</a><br><a href="https://wa.me/14694399345" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +1 469 439 9345 (opens in a new tab)">WhatsApp +1 469 439 9345</a><br><a href="mailto:vinni.tran@newxion.com">vinni.tran@newxion.com</a></address>
      <address class="office"><b>Ho Chi Minh City, Vietnam</b><small class="office-tag" data-vi="Vietnam Delivery Center">Vietnam Delivery Center</small>Floor 15, B1 Building<br>279 Nguyen Tri Phuong Street<br>Dien Hong Ward, Ho Chi Minh City, Vietnam<br><a href="tel:+84908107552">+84 908 107 552</a></address></div>
  </div>
  <div class="fbot"><span>© 2026 XionTechs · <a href="privacy.html" data-vi="Chính sách bảo mật">Privacy policy</a></span><span class="tag">GET IT <b>DONE</b></span></div>
</div></footer><div class="toast" id="toast" role="status"></div>`;
  const hs=document.getElementById('site-header'),fs=document.getElementById('site-footer');
  if(hs)hs.outerHTML=header;
  if(fs)fs.outerHTML=footer;

  const toastEl=document.getElementById('toast');let tt;
  const toast=m=>{toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),2600)};

  /* ---------- news data (SAMPLE stories, single source for home / news / products) ---------- */
  const NEWS=[
    {id:'n1',date:'18 SEP 2026',cat:'product',app:'PXP',t:'[Placeholder] Parents can now pay school fees in PXP',tv:'[Placeholder] Phụ huynh giờ có thể đóng học phí ngay trên PXP',x:'Tuition and service fees, with receipts sent straight to the app.',xv:'Học phí và phí dịch vụ, kèm biên lai gửi ngay trong ứng dụng.'},
    {id:'n2',date:'09 SEP 2026',cat:'team',t:'[Placeholder] A day at our Ho Chi Minh City office',tv:'[Placeholder] Một ngày tại văn phòng TP. Hồ Chí Minh',x:'Meet the engineers, testers and designers behind our products and client projects.',xv:'Gặp gỡ các kỹ sư, kiểm thử viên và nhà thiết kế đứng sau sản phẩm và dự án khách hàng.'},
    {id:'n3',date:'05 SEP 2026',cat:'schools',app:'PXP',t:'[Placeholder] Back-to-school week with PXP',tv:'[Placeholder] Tuần đầu năm học cùng PXP',x:'Our team was on campus helping parents get started with PXP.',xv:'Đội ngũ có mặt tại trường để hỗ trợ phụ huynh bắt đầu với PXP.'},
    {id:'n4',date:'28 AUG 2026',cat:'product',app:'SXP',t:'[Placeholder] SXP adds dashboards for school leaders',tv:'[Placeholder] SXP bổ sung bảng điều khiển cho lãnh đạo nhà trường',x:'A role-based view that shows what needs attention today.',xv:'Giao diện theo vai trò cho thấy việc cần xử lý hôm nay.'},
    {id:'n5',date:'22 AUG 2026',cat:'team',t:'[Placeholder] Inside our pre-term release testing week',tv:'[Placeholder] Bên trong tuần kiểm thử trước năm học',x:'How our QA team checked every critical flow before students came back.',xv:'Cách đội QA kiểm tra mọi luồng quan trọng trước khi học sinh trở lại trường.'},
    {id:'n6',date:'12 AUG 2026',cat:'product',app:'LXP',t:'[Placeholder] LXP shows assignment progress at a glance',tv:'[Placeholder] LXP hiển thị tiến độ bài tập trong nháy mắt',x:'Students see what is due, what is done and what needs another look.',xv:'Học sinh thấy bài nào sắp đến hạn, bài nào đã xong và bài nào cần xem lại.'},
    {id:'n7',date:'30 JUL 2026',cat:'product',app:'IoT',t:'[Placeholder] A new campus joins the IoT pilot',tv:'[Placeholder] Một khuôn viên mới tham gia thí điểm IoT',x:'Classroom lighting and climate are now scheduled from one screen.',xv:'Ánh sáng và điều hòa trong lớp học giờ được lên lịch từ một màn hình.'},
    {id:'n8',date:'15 JUL 2026',cat:'company',t:'[Placeholder] Low-code, delivered: automating client workflows',tv:'[Placeholder] Low-code thực chiến: tự động hóa quy trình cho khách hàng',x:'How our team uses Power Platform and n8n to ship internal tools faster.',xv:'Cách đội ngũ dùng Power Platform và n8n để ra mắt công cụ nội bộ nhanh hơn.'}
  ];
  const CAT={product:['Product','Sản phẩm'],team:['Team','Đội ngũ'],schools:['Schools','Trường học'],company:['Company','Công ty']};
  const MON={JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12'};
  const viDate=d=>{const [dd,m,y]=d.split(' ');return MON[m]?dd+'/'+MON[m]+'/'+y:d};
  const card=(n,big)=>`<article class="spot ncard${big?' big':''} reveal" data-c="${n.cat}">
    <div class="slot" data-slot="news-${n.id}" data-hint="Story photo" data-size="1200 × 750"></div>
    <div class="body"><div class="meta"><span data-vi="${viDate(n.date)}">${n.date}</span>${n.app?`<span class="cat product">${n.app}</span>`:`<span class="cat" data-vi="${CAT[n.cat][1]}">${CAT[n.cat][0]}</span>`}</div>
    <h3 data-vi="${n.tv}">${n.t}</h3><p data-vi="${n.xv}">${n.x}</p>
    <a class="link-arrow" href="news-story.html"><span data-vi="Đọc tiếp">Read story</span><i class="ph ph-arrow-right"></i></a></div></article>`;
  document.querySelectorAll('[data-news]').forEach(box=>{
    const mode=box.dataset.news,lim=+box.dataset.limit||99;
    let list=NEWS;if(mode==='product')list=NEWS.filter(n=>n.cat==='product');
    box.innerHTML=list.slice(0,lim).map((n,i)=>card(n,mode==='all'&&i===0)).join('');
  });

  /* ---------- i18n (EN from markup, VI from data-vi / data-vi-html / data-vi-ph) ---------- */
  const txt=[...document.querySelectorAll('[data-vi]')].map(el=>[el,el.textContent,el.dataset.vi]);
  const htm=[...document.querySelectorAll('[data-vi-html]')].map(el=>[el,el.innerHTML,el.dataset.viHtml]);
  const phs=[...document.querySelectorAll('[data-vi-ph]')].map(el=>[el,el.placeholder,el.dataset.viPh]);
  const arias=[...document.querySelectorAll('[data-vi-aria]')].map(el=>[el,el.getAttribute('aria-label'),el.dataset.viAria]);
  function setLang(l){root.lang=l;
    txt.forEach(([el,en,vi])=>el.textContent=l==='vi'?vi:en);htm.forEach(([el,en,vi])=>el.innerHTML=l==='vi'?vi:en);phs.forEach(([el,en,vi])=>el.placeholder=l==='vi'?vi:en);arias.forEach(([el,en,vi])=>el.setAttribute('aria-label',l==='vi'?vi:en));
    document.querySelectorAll('[data-lang]').forEach(b=>{if(b.dataset.lang===l)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
    const code=document.getElementById('langCode');if(code)code.textContent=l==='vi'?'VI':'EN';
    store.set('xt3-lang',l);document.dispatchEvent(new Event('xt-lang'))}
  /* language dropdown: opens on click, closes on choice, Escape or a click outside */
  const langBtn=document.getElementById('langBtn'),langList=document.getElementById('langList');
  const setLangOpen=o=>{if(!langBtn)return;langList.hidden=!o;langBtn.setAttribute('aria-expanded',o)};
  if(langBtn){langBtn.onclick=e=>{e.stopPropagation();setLangOpen(langList.hidden)};
    langBtn.parentElement.addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))setLangOpen(false)});
    document.addEventListener('click',e=>{if(!e.target.closest('.lang'))setLangOpen(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!langList.hidden){setLangOpen(false);langBtn.focus();e.stopImmediatePropagation()}})}
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{setLang(b.dataset.lang);setLangOpen(false);langBtn&&langBtn.focus()});
  setLang(store.get('xt3-lang')||'en');

  /* ---------- menus ---------- */
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;
    const m=document.getElementById('menu');if(m&&m.classList.contains('mobile-open')){setMenuOpen(false);document.getElementById('burger').focus()}});
  const menu=document.getElementById('menu'),burger=document.getElementById('burger');
  function setMenuOpen(o){menu.classList.toggle('mobile-open',o);burger.setAttribute('aria-expanded',o);burger.querySelector('i').className='ph '+(o?'ph-x':'ph-list');root.style.overflow=o?'hidden':''}
  burger.onclick=()=>setMenuOpen(!menu.classList.contains('mobile-open'));
  document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!menu.classList.contains('mobile-open'))return;
    const f=[document.querySelector('.logo'),...menu.querySelectorAll('a,button'),burger,langBtn,...(langList&&!langList.hidden?langList.querySelectorAll('button'):[])].filter(el=>el&&el.offsetParent!==null);if(!f.length)return;
    const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

  /* ---------- screenshot slots: click / drop / paste, saved in this browser ---------- */
  let lastSlot=null;
  function paint(slot,src){let img=slot.querySelector('img');
    if(src){if(!img){img=document.createElement('img');img.alt='';slot.insertBefore(img,slot.querySelector('.rm'))}img.src=src;slot.classList.add('has')}
    else{img&&img.remove();slot.classList.remove('has')}}
  function shrink(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
    const s=Math.min(1,1800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.86))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
  async function put(slot,file){
    if(!file||!/^image\//.test(file.type)){toast('Please use an image file (PNG or JPG).');return}
    try{const url=await shrink(file);paint(slot,url);const ok=store.set('xt3-slot-'+slot.dataset.slot,url);
      toast(ok?'Image added. Saved in this browser.':'Image added, but too large to save. It will clear on reload.')}catch(e){toast('Could not read that image.')}}
  document.querySelectorAll('.slot').forEach(slot=>{
    slot.tabIndex=0;slot.setAttribute('role','button');slot.setAttribute('aria-label','Add '+slot.dataset.hint);
    slot.innerHTML='<div class="hint"><i class="ph ph-image-square"></i><b>'+slot.dataset.hint+'</b><small>Click, drop or paste · '+slot.dataset.size+'</small></div><button class="rm" aria-label="Remove image"><i class="ph ph-x"></i></button>';
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.hidden=true;slot.appendChild(inp);
    const saved=store.get('xt3-slot-'+slot.dataset.slot);if(saved)paint(slot,saved);
    slot.addEventListener('click',e=>{if(e.target===inp)return;e.preventDefault();e.stopPropagation();if(e.target.closest('.rm'))return;inp.click()});
    slot.addEventListener('keydown',e=>{if(e.target!==slot)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click()}});
    inp.addEventListener('change',()=>{put(slot,inp.files[0]);inp.value=''});
    slot.querySelector('.rm').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();paint(slot,null);store.del('xt3-slot-'+slot.dataset.slot);toast('Image removed.')});
    slot.addEventListener('mouseenter',()=>lastSlot=slot);slot.addEventListener('focus',()=>lastSlot=slot);
    ['dragenter','dragover'].forEach(ev=>slot.addEventListener(ev,e=>{e.preventDefault();slot.classList.add('drag')}));
    ['dragleave','drop'].forEach(ev=>slot.addEventListener(ev,e=>{e.preventDefault();slot.classList.remove('drag')}));
    slot.addEventListener('drop',e=>put(slot,e.dataTransfer.files[0]));
  });
  document.addEventListener('paste',e=>{
    if(e.target.matches&&e.target.matches('input,textarea'))return;
    const target=document.activeElement&&document.activeElement.classList.contains('slot')?document.activeElement:lastSlot;
    if(!target)return;const item=[...((e.clipboardData||{}).items||[])].find(i=>i.type.startsWith('image/'));
    if(item){e.preventDefault();put(target,item.getAsFile())}});

  /* ---------- partner logo strip: a copy of the set makes the loop seamless; the copy is hidden from
     screen readers and keyboards and follows the original when a logo is added or removed ---------- */
  document.querySelectorAll('.logo-marquee').forEach(mq=>{
    const track=mq.querySelector('.logo-track'),set=track.querySelector('.logo-set');
    set.querySelectorAll('.slot').forEach(s=>s.tabIndex=-1); /* prototype image slots: still clickable for uploads, not Tab stops */
    const copy=()=>{track.querySelectorAll('.logo-copy').forEach(n=>n.remove());for(let i=0;i<2;i++){const c=set.cloneNode(true);c.classList.add('logo-copy');c.removeAttribute('aria-label');c.setAttribute('aria-hidden','true');c.inert=true;
      c.querySelectorAll('[tabindex],[role],[aria-label],input,.rm').forEach(n=>{if(n.matches('input,.rm'))n.remove();else{n.removeAttribute('tabindex');n.removeAttribute('role');n.removeAttribute('aria-label')}});track.appendChild(c)}};
    copy();new MutationObserver(copy).observe(set,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
    /* pause: hover and keyboard focus (CSS), tap or click toggles, and the hero's Pause motion stops it too */
    mq.addEventListener('click',e=>{if(!e.target.closest('.slot'))mq.classList.toggle('paused')});
    mq.addEventListener('keydown',e=>{if(e.target===mq&&(e.key==='Enter'||e.key===' ')){e.preventDefault();mq.classList.toggle('paused')}});
    if(store.get('xt3-motion')==='off'&&document.querySelector('.motion-toggle'))mq.classList.add('motion-off');
  });

  /* ---------- Why XionTechs "+3": hover, focus or a tap opens the other industries on the same line ---------- */
  document.querySelectorAll('.w-more').forEach(w=>{const b=w.querySelector('.w-more-trigger'),l=w.querySelector('.w-more-list');
    const fit=()=>w.style.setProperty('--more-w',Math.ceil(l.scrollWidth)+'px');fit();addEventListener('resize',fit);document.addEventListener('xt-lang',fit);
    b.addEventListener('click',()=>{const o=!w.classList.contains('open');w.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
    w.addEventListener('focusout',e=>{if(!w.contains(e.relatedTarget)){w.classList.remove('open');b.setAttribute('aria-expanded','false')}})});

  /* ---------- case studies slider: drag with a mouse (touch scrolls natively), arrow keys step one card ---------- */
  const cs=document.getElementById('caseSlider');
  if(cs){let down=false,moved=false,x0=0,s0=0;cs.querySelectorAll('.slot').forEach(s=>s.tabIndex=-1);cs.addEventListener('dragstart',e=>e.preventDefault());
    const shell=cs.closest('.case-shell');const ends=()=>{if(shell)shell.classList.toggle('at-end',cs.scrollLeft>=cs.scrollWidth-cs.clientWidth-4)};cs.addEventListener('scroll',()=>requestAnimationFrame(ends),{passive:true});addEventListener('resize',ends);ends();
    cs.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=cs.scrollLeft});
    cs.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-x0;if(!moved&&Math.abs(dx)>5){moved=true;cs.classList.add('dragging');cs.setPointerCapture(e.pointerId)}if(moved)cs.scrollLeft=s0-dx});
    const stop=()=>{if(!down)return;down=false;cs.classList.remove('dragging');setTimeout(()=>{moved=false},0)};
    cs.addEventListener('pointerup',stop);cs.addEventListener('pointercancel',stop);
    cs.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    cs.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;const c=cs.querySelector('.case-card');if(!c)return;e.preventDefault();
      const step=c.getBoundingClientRect().width+(parseFloat(getComputedStyle(cs).columnGap)||0);cs.scrollBy({left:e.key==='ArrowRight'?step:-step,behavior:reduce?'auto':'smooth'})});
    const dotsBox=document.querySelector('.case-dots'),cards=[...cs.querySelectorAll('.case-card')];
    if(dotsBox&&cards.length){let per=1,dots=[];
      const stepW=()=>cards[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(cs).columnGap)||0);
      const label=(from,to)=>root.lang==='vi'?'Case study '+from+(to>from?' đến '+to:''):'Case studies '+from+(to>from?' to '+to:'');
      const build=force=>{const w=stepW();if(!w){dotsBox.hidden=true;return}const st=getComputedStyle(cs),visible=cs.clientWidth-parseFloat(st.paddingLeft)-parseFloat(st.paddingRight);
        const p2=Math.max(1,Math.floor((visible+1)/w)),pages=Math.max(1,Math.ceil(cards.length/p2));if(!force&&p2===per&&dots.length===pages){mark();return}
        const fi=dots.indexOf(document.activeElement);per=p2;dotsBox.innerHTML='';dotsBox.hidden=pages<2;
        dots=Array.from({length:pages},(_,p)=>{const b=document.createElement('button');b.type='button';b.className='case-dot';const from=p*per+1,to=Math.min(cards.length,from+per-1);
          b.setAttribute('aria-label',label(from,to));b.onclick=()=>cs.scrollTo({left:cards[Math.min(p*per,cards.length-1)].offsetLeft-cards[0].offsetLeft,behavior:reduce?'auto':'smooth'});dotsBox.appendChild(b);return b});
        mark();if(fi>=0)(dots[fi]||dots[dots.length-1]).focus()};
      const mark=()=>{if(!dots.length)return;const x=cs.scrollLeft,max=cs.scrollWidth-cs.clientWidth;let k=Math.round(x/(stepW()*per));if(x>=max-4)k=dots.length-1;
        k=Math.max(0,Math.min(k,dots.length-1));dots.forEach((d,i)=>d.setAttribute('aria-current',i===k?'true':'false'))};
      cs.addEventListener('scroll',()=>requestAnimationFrame(mark),{passive:true});addEventListener('resize',()=>build());document.addEventListener('xt-lang',()=>build(true));build(true)}
  }

  /* ---------- What we build rail: back and forward buttons and arrow keys move one app; buttons switch off at the ends ---------- */
  const rail=document.getElementById('appRail');
  if(rail){const btns=[...document.querySelectorAll('.rail-btn[aria-controls="appRail"]')];
    const step=()=>{const li=rail.querySelector('li');return li?li.getBoundingClientRect().width:rail.clientWidth};
    const go=d=>rail.scrollBy({left:d*step(),behavior:reduce?'auto':'smooth'});
    const state=()=>{const max=rail.scrollWidth-rail.clientWidth;btns.forEach(b=>{b.disabled=+b.dataset.dir<0?rail.scrollLeft<=2:rail.scrollLeft>=max-2})};
    btns.forEach(b=>b.addEventListener('click',()=>go(+b.dataset.dir)));
    rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1)}});
    rail.addEventListener('scroll',()=>requestAnimationFrame(state),{passive:true});addEventListener('resize',state);state()}

  /* ---------- Services "How we work": the steps are tabs; click, or arrow keys up and down, show a step's detail ---------- */
  document.querySelectorAll('.ap-rail').forEach(rl=>{const tabs=[...rl.querySelectorAll('.ap-step')];
    const pick=(t,focus)=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;const p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});if(focus)t.focus()};
    pick(tabs.find(t=>t.getAttribute('aria-selected')==='true')||tabs[0]);
    tabs.forEach((t,i)=>{t.addEventListener('click',()=>pick(t));
      t.addEventListener('keydown',e=>{const k=e.key;let j=null;if(k==='ArrowDown'||k==='ArrowRight')j=(i+1)%tabs.length;else if(k==='ArrowUp'||k==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(k==='Home')j=0;else if(k==='End')j=tabs.length-1;
        if(j!==null){e.preventDefault();pick(tabs[j],true)}})})});

  /* ---------- Products hero glows: rest off screen; Pause motion button shares Home's saved choice ---------- */
  const eco=document.querySelector('.eco-hero');
  if(eco){
    const saved=store.get('xt3-motion'),btn=eco.querySelector('.motion-toggle');let paused=saved?saved==='off':reduce;
    const apply=()=>{eco.classList.toggle('motion-off',paused);eco.classList.toggle('motion-on',!paused);root.classList.toggle('flow-off',paused);root.classList.toggle('flow-on',!paused);if(!btn)return;
      const vi=root.lang==='vi';btn.querySelector('i').className='ph '+(paused?'ph-play':'ph-pause');
      btn.querySelector('span').textContent=paused?(vi?'Chạy chuyển động':'Play motion'):(vi?'Tạm dừng chuyển động':'Pause motion')};
    if(btn)btn.onclick=()=>{if(!paused)eco.classList.add('was-on');paused=!paused;store.set('xt3-motion',paused?'off':'on');apply()};
    document.addEventListener('xt-lang',apply);apply();
    if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>eco.classList.toggle('is-off',!e.isIntersecting))).observe(eco);
  }

  /* ---------- reveal, spotlight, tilt ---------- */
  /* reveal: in each section the heading appears first; the rest of the section follows it in turn, and never before it */
  const headOf=el=>{const sec=el.closest('section');if(!sec)return null;const h=sec.querySelector('h1,h2');if(!h)return null;return h.classList.contains('reveal')?h:h.closest('.reveal')};
  const waiting=new Map();
  const showIn=(el,ms)=>setTimeout(()=>el.classList.add('in'),ms);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;io.unobserve(t);const hd=headOf(t);
    const headIn=h=>{if(h.dataset.shown)return;showIn(h,0);io.unobserve(h);h.dataset.shown=Date.now();h.dataset.next=0;(waiting.get(h)||[]).forEach(el=>showIn(el,450+(h.dataset.next++)*160));waiting.delete(h)};
    if(!hd||hd===t||t.contains(hd)){if(hd)headIn(hd);else showIn(t,0)}
    else{if(!hd.dataset.shown&&hd.getBoundingClientRect().bottom<0)headIn(hd);
      if(hd.dataset.shown){const base=+hd.dataset.shown+450-Date.now();showIn(t,base>0?base+(hd.dataset.next++)*160:120)}
      else{if(!waiting.has(hd))waiting.set(hd,[]);waiting.get(hd).push(t)}}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  document.querySelectorAll('.spot').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  document.querySelectorAll('.devices').forEach(dev=>{const tilt=dev.querySelector('.tilt');if(!tilt||reduce||!matchMedia('(hover:hover)').matches)return;
    dev.addEventListener('pointermove',e=>{const r=dev.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tilt.style.transform=`rotateY(${x*8}deg) rotateX(${-y*6}deg)`});
    dev.addEventListener('pointerleave',()=>tilt.style.transform='')});

  /* ---------- stats count-up ---------- */
  /* numbers start at 0 and count up once they are on screen (after the fade-in); reduced motion shows the final number */
  const show=(el,v)=>{el.innerHTML=v+'<em>'+(el.dataset.suffix||'')+'</em>'};
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;sio.unobserve(e.target);
    const el=e.target,to=+el.dataset.count,blk=el.closest('.reveal');
    const run=()=>setTimeout(()=>{const t0=performance.now();(function step(now){const p=Math.min(1,(now-t0)/1800);show(el,Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(step)})(t0)},900);
    if(!blk||blk.classList.contains('in'))run();else{const mo=new MutationObserver(()=>{if(blk.classList.contains('in')){mo.disconnect();run()}});mo.observe(blk,{attributes:true,attributeFilter:['class']})}}),{threshold:.5});
  if(!reduce)document.querySelectorAll('[data-count]').forEach(el=>{show(el,0);sio.observe(el)});

  /* ---------- filters (news page) ---------- */
  document.querySelectorAll('[data-filter-for]').forEach(group=>{const box=document.getElementById(group.dataset.filterFor);
    const cnt=document.getElementById(group.dataset.count||''),empty=document.getElementById(group.dataset.empty||'');
    const apply=f=>{let n=0;box.querySelectorAll('[data-c]').forEach(c=>{const on=f==='all'||c.dataset.c===f;c.style.display=on?'':'none';if(on)n++});
      if(cnt)cnt.textContent=root.lang==='vi'?'Đang hiển thị '+n+' tin':'Showing '+n+(n===1?' story':' stories');if(empty)empty.hidden=n>0};
    group.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.getAttribute('aria-pressed')==='true')return;group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));apply(b.dataset.f)});
    const reset=empty&&empty.querySelector('button');if(reset)reset.onclick=()=>group.querySelector('[data-f="all"]').click();
    const current=()=>{const a=group.querySelector('[aria-pressed="true"]');return a?a.dataset.f:'all'};
    document.addEventListener('xt-lang',()=>apply(current()));apply(current())});

  /* ---------- phone tabs (products page) ---------- */
  document.querySelectorAll('[data-phone-tabs]').forEach(tabs=>{const ph=document.getElementById(tabs.dataset.phoneTabs);const slots=[...ph.querySelectorAll('.slot')];
    const show=i=>slots.forEach((s,j)=>{const on=j===i;s.classList.toggle('on',on);s.tabIndex=on?0:-1;s.setAttribute('aria-hidden',on?'false':'true')});
    tabs.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));show(i)});show(0)});

  /* ---------- ARIA tabs: arrow keys, Home/End, roving tabindex ---------- */
  document.querySelectorAll('[role="tablist"]:not(.ap-rail)').forEach(list=>{const tabs=[...list.querySelectorAll('[role="tab"]')];if(!tabs.length)return;
    const sync=()=>tabs.forEach(t=>t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1);sync();list.addEventListener('click',()=>setTimeout(sync));
    list.addEventListener('keydown',e=>{const i=tabs.indexOf(document.activeElement);if(i<0)return;let j=null;
      if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;
      if(j===null)return;e.preventDefault();tabs[j].focus();tabs[j].click()})});

  /* ---------- sub-nav highlight ---------- */
  const sub=[...document.querySelectorAll('.subnav:not(.aud-nav) a')];
  if(sub.length){const map=sub.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)sub.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
    map.forEach(s=>nio.observe(s));
    const ft=document.querySelector('footer.site');if(ft)new IntersectionObserver(es=>{if(es[0].isIntersecting)sub.forEach((a,i)=>a.classList.toggle('on',i===sub.length-1))}).observe(ft)}

  /* ---------- Products: stacked app cards (desktop) and the audience pills ---------- */
  const pstack=document.querySelector('.pstack');
  if(pstack){
    const all=[...pstack.children].filter(c=>c.classList.contains('pcard')),DESK=matchMedia('(min-width: 993px)');
    const cols=c=>[...c.children].filter(x=>x.classList.contains('pcol'));
    const clear=()=>all.forEach(c=>{c.style.top='';c.style.backgroundSize='';c.style.backgroundPosition='';c.classList.remove('parked');cols(c).forEach(x=>x.style.opacity='')});
    // each card pins; the next one slides over it and fades it (stacking-cases spec). All reads happen first, then all writes.
    let tops=[];
    const update=()=>{const cards=all;if(!DESK.matches||!cards.length)return;
      const stickyTop=parseFloat(getComputedStyle(pstack).getPropertyValue('--sticky-top'))||172,vh=innerHeight;
      const fb=document.querySelector('.flow-bg'),fh=fb?fb.offsetHeight:0,fw=fb?fb.offsetWidth:0,fTop=fb?fb.getBoundingClientRect().top+scrollY:0;
      // where each card parks: under the header, or bottom-aligned when it would not fit, so its last line is never cut off
      tops=cards.map(c=>{const col=cols(c)[0],mt=col?col.offsetTop:0,ch=c.offsetHeight,t=stickyTop-mt;return t+ch>vh?Math.min(t,vh-ch-16):t});
      const rects=cards.map(c=>c.getBoundingClientRect());
      cards.forEach((c,i)=>{const r=rects[i];c.style.top=tops[i]+'px';c.classList.toggle('parked',i>0&&Math.abs(r.top-tops[i])<1);
        // each card shows the slice of the page gradient that sits behind it
        if(fh&&r.bottom>-50&&r.top<vh+50){c.style.backgroundSize=fw+'px '+fh+'px';c.style.backgroundPosition=(-Math.round(r.left+scrollX))+'px '+(-Math.round(r.top+scrollY-fTop))+'px'}
        // the card fades out as the next one approaches and is gone before the next one passes the content line,
        // so nothing of it shows above the new card (opacity only, so it stays reachable by keyboard and screen readers)
        const nx=rects[i+1];let k=1;
        if(nx){k=(nx.top-stickyTop)/(vh*.4);k=Math.max(0,Math.min(1,k))}
        cols(c).forEach(x=>x.style.opacity=k)})};
    let tick=false;const soon=()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{update();tick=false})};
    addEventListener('scroll',soon,{passive:true});
    let rt=0;addEventListener('resize',()=>{cancelAnimationFrame(rt);rt=requestAnimationFrame(()=>{clear();update()})},{passive:true});
    let crossed=false,schedule=()=>{};DESK.addEventListener('change',()=>{clear();update();crossed=true;schedule()});
    addEventListener('load',update);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(update);
    if('ResizeObserver' in window){const ro=new ResizeObserver(soon);all.forEach(c=>ro.observe(c))}
    update();
    // one-shot screenshot reveal
    const seen=c=>c.classList.add('is-visible');
    if('IntersectionObserver' in window){const vio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){seen(e.target);vio.unobserve(e.target)}}),{threshold:.2});all.forEach(c=>vio.observe(c))}
    else all.forEach(seen);
    // audience pills: a pill jumps to its audience's first card (parked, ready to read); the pill of the audience
    // being read highlights itself
    const pills=[...document.querySelectorAll('.aud-nav [data-aud]')];
    const restY=i=>{const c=all[i];if(!DESK.matches)return c.getBoundingClientRect().top+scrollY-148;
      let y=pstack.getBoundingClientRect().top+scrollY;for(let j=0;j<i;j++)y+=all[j].offsetHeight+parseFloat(getComputedStyle(pstack).rowGap||0);
      return y-(tops[i]||0)};
    // the card being read: the front-most card whose top has passed the middle of the screen and that is still on screen
    const front=()=>{let k=-1;
      all.forEach((c,i)=>{const r=c.getBoundingClientRect();if(r.bottom>innerHeight*.3&&r.top<innerHeight*.5)k=i});
      // once the section after the cards reaches the middle of the screen, no card is being read
      const sec=pstack.closest('section');if(sec&&sec.getBoundingClientRect().bottom<innerHeight*.5)k=-1;return k};
    const mark=()=>{if(!all.length)return;const k=front();
      const aud=k<0?null:all[k].dataset.aud;
      pills.forEach(a=>{a.dataset.aud===aud?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')})};
    // any link to an app card (the pills and the hero diagram) lands on the card parked and ready to read
    document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const l=e.target.closest('a[href^="#"]');if(!l)return;const card=document.getElementById(l.getAttribute('href').slice(1)),i=all.indexOf(card);if(i<0)return;
      e.preventDefault();scrollTo({top:restY(i),behavior:reduce?'auto':'smooth'});history.replaceState(null,'',l.getAttribute('href'));
      card.setAttribute('tabindex','-1');card.focus({preventScroll:true})});
    // tabbing into a covered card brings it back to the front
    all.forEach((c,i)=>c.addEventListener('focusin',e=>{if(e.target===c||!DESK.matches)return;const o=parseFloat(cols(c)[0].style.opacity||'1');if(o<1)scrollTo({top:restY(i),behavior:'auto'})}));
    let mtick=false;addEventListener('scroll',()=>{if(mtick)return;mtick=true;requestAnimationFrame(()=>{mark();mtick=false})},{passive:true});
    addEventListener('resize',mark,{passive:true});mark();
    // resizing across the desktop breakpoint keeps the reader on the card they were reading: the card is noted only
    // while scrolling (never mid-resize), and once the resize settles the page returns to it in the new layout
    const layoutW=()=>document.documentElement.clientWidth;
    let readK=-1,readTop=0,anchor=null,resizing=false,settle=0,lastW=layoutW(),widened=false;
    const noteK=()=>{if(resizing)return;const k=front();readK=k;readTop=k>=0?all[k].getBoundingClientRect().top:0;
      // away from the cards, the reader's place is kept as the section at mid-screen and how far down the screen it sits
      anchor=null;if(k<0){const el=[...document.querySelectorAll('main > section, footer')].find(s=>s.getBoundingClientRect().bottom>innerHeight*.5);if(el)anchor=[el,el.getBoundingClientRect().top/innerHeight]}};
    let nt=false;addEventListener('scroll',()=>{if(nt)return;nt=true;requestAnimationFrame(()=>{noteK();nt=false})},{passive:true});noteK();
    schedule=()=>{const deskAtStart=DESK.matches;resizing=true;const w=layoutW();if(w!==lastW){if(!DESK.matches)widened=true;lastW=w}clearTimeout(settle);settle=setTimeout(()=>{const k=readK;
      const an=anchor;
      // away from the cards on desktop, the card stack above changes height with the window, so any resize restores the section
      try{if(((crossed||widened)&&(k>=0||an))||(k<0&&an&&deskAtStart&&DESK.matches)){clear();update();const h=root.style.scrollBehavior;root.style.scrollBehavior='auto';scrollTo(0,k>=0?(crossed?restY(k):scrollY+all[k].getBoundingClientRect().top-readTop):scrollY+an[0].getBoundingClientRect().top-an[1]*innerHeight);root.style.scrollBehavior=h;update();mark()}}
      finally{crossed=false;widened=false;resizing=false;noteK()}},250)};
    addEventListener('resize',schedule,{passive:true});
    addEventListener('load',()=>{const i=all.indexOf(document.getElementById(location.hash.slice(1)));if(i>=0)requestAnimationFrame(()=>scrollTo({top:restY(i),behavior:'auto'}))});
  }

  /* ---------- Products: one background colour flowing down the page ---------- */
  // Every section in <main> gets a phase from its place in the page, so a new section extends the flow on its own:
  // the first is white with amber dots, the middle ones warm up to bright amber, then ease from
  // halfway down their second-to-last card into light blue and on into the dark sections; the last three are dark blue, deepening
  // into the footer's colour. data-flow="light|rise|night|blue|deep" on a section overrides it.
  // The gradient is drawn once for the whole page (and again when the layout changes), so scrolling stays smooth.
  const flowBg=document.querySelector('.flow-bg');
  if(flowBg){
    root.classList.add('flow-js');
    const C={white:'#FFFFFF',plat:'#F3F5F7',cream:'#F4EBC6',sun:'#F6D96F',amber:'#F6C30A',ice:'#C9D5E6',frost:'#AFBED4',steel:'#5F7394',slate:'#33476A',dusk:'#1C2A46',navy:'#12284C',prussian:'#0D1930',ink:'#0B1730'};
    const phaseOf=(i,n)=>i===0?'light':i===n-1?'deep':i===n-2?'blue':i===n-3?'night':'rise';
    const Y=el=>el.getBoundingClientRect().top+scrollY,B=el=>el.getBoundingClientRect().bottom+scrollY;
    const measure=()=>{const secs=[...document.querySelectorAll('main > section')].filter(s=>s.offsetParent),n=secs.length;if(!n)return;
      secs.forEach((s,i)=>{s.dataset.flowPhase=s.dataset.flow||phaseOf(i,n)});
      flowBg.style.height='0';const O=flowBg.getBoundingClientRect().top+scrollY,H=document.documentElement.scrollHeight-O;
      const list=[],add=(y,c)=>{y=Math.round(y-O);if(!list.length||y>list[list.length-1][0])list.push([y,c])},glows=[];
      const rise=secs.filter(s=>s.dataset.flowPhase==='rise'),rTop=rise.length?Y(rise[0]):0;
      secs.forEach(s=>{const top=Y(s),bot=B(s),h=bot-top,ph=s.dataset.flowPhase;
        if(ph==='light'){add(top,C.white);add(bot,C.plat);glows.push([14,top+h*.45,380,.16])}
        else if(ph==='rise'){if(s===rise[0])add(top,C.plat);
          if(s===rise[rise.length-1]){const kids=[...s.children].filter(k=>k.offsetParent),ce=kids.length?B(kids[kids.length-1]):bot;
            // bright amber by the last two cards (sticky cards move, so their resting place is worked out from heights)
            const cards=[...s.querySelectorAll('.pcard')],gap=cards.length>1?parseFloat(getComputedStyle(cards[0].parentElement).rowGap)||0:0;
            const last=cards[cards.length-1],prev=cards[cards.length-2],tTop=last?ce-last.offsetHeight:ce,lTop=prev?tTop-gap-prev.offsetHeight:rTop+(ce-rTop)*.75,lMid=prev?lTop+prev.offsetHeight/2:lTop;
            add(rTop+(lTop-rTop)*.35,C.cream);add(rTop+(lTop-rTop)*.75,C.sun);add(lTop,C.amber);add(lMid,C.amber);
            // from halfway down the second-to-last card the amber eases into light blue by the last card, then deepens
            add(tTop,C.ice);add(ce,C.frost);
            add(bot,C.steel);
            glows.push([86,rTop+(lTop-rTop)*.25,340,.12])}}
        else if(ph==='night'){add(top+48,C.slate);add(top+110,C.dusk);add(top+h*.45,C.navy);add(bot,C.prussian)}
        else if(ph==='blue'){add(top,C.prussian);add(bot,C.ink)}
        else{add(top,C.ink);add(bot,C.ink)}});
      // blend in a perceptual colour space where the browser supports it, for an even fade
      const space=CSS.supports('background-image','linear-gradient(180deg in oklab,red,blue)')?'180deg in oklab':'180deg';
      const img=glows.map(([x,y,r,a])=>'radial-gradient(circle '+r+'px at '+x+'% '+Math.round(y-O)+'px,rgb(246 195 10 / '+a+') 0,transparent 100%)').concat('linear-gradient('+space+','+list.map(([y,c])=>c+' '+y+'px').join(',')+')').join(',');
      flowBg.style.height=H+'px';flowBg.style.backgroundImage=img;root.style.setProperty('--flow-page',img);
      dispatchEvent(new Event('scroll'))};
    let mt=0;const later=()=>{cancelAnimationFrame(mt);mt=requestAnimationFrame(measure)};
    addEventListener('resize',later,{passive:true});addEventListener('load',later);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
    if('ResizeObserver' in window)new ResizeObserver(later).observe(document.querySelector('main'));
    measure();
  }

  /* ---------- Products: A day at school, played once as the reader arrives ---------- */
  // Step 1 lights up, the rail fills to step 2, step 2 lights up, and so on to step 5, then it stops. It only
  // resets when the reader scrolls back above the whole section, and replays from step 1 on the way back down.
  const dayLine=document.querySelector('.day-line');
  if(dayLine){
    const items=[...dayLine.children],sec=dayLine.closest('section'),STEP=1800;let timers=[],state='idle';
    const stop=()=>{timers.forEach(clearTimeout);timers=[]};
    const reset=()=>{stop();state='idle';dayLine.classList.remove('is-playing','is-done');items.forEach(li=>li.classList.remove('is-reached','is-current','is-passed'))};
    const go=i=>{items.forEach(li=>li.classList.remove('is-current'));items[i].classList.add('is-reached','is-current');
      if(i<items.length-1){timers.push(setTimeout(()=>items[i].classList.add('is-passed'),STEP-1000-100));timers.push(setTimeout(()=>go(i+1),STEP))}
      else{state='done';dayLine.classList.add('is-done');dayLine.classList.remove('is-playing');timers.push(setTimeout(()=>items[i].classList.remove('is-current'),1200))}};
    const still=()=>reduce||root.classList.contains('flow-off');
    const finish=()=>{stop();dayLine.classList.remove('is-playing');items.forEach((li,i)=>{li.classList.add('is-reached');li.classList.remove('is-current');if(i<items.length-1)li.classList.add('is-passed')});state='done';dayLine.classList.add('is-done')};
    const play=()=>{if(state!=='idle')return;state='playing';
      if(still()){items.forEach((li,i)=>{li.classList.add('is-reached');if(i<items.length-1)li.classList.add('is-passed')});state='done';dayLine.classList.add('is-done');return}
      dayLine.classList.add('is-playing');go(0)};
    // starts when the timeline itself is well on screen (the heading above it can be tall on phones)
    const check=()=>{const r=sec.getBoundingClientRect(),l=dayLine.getBoundingClientRect();if(r.top>=innerHeight){if(state!=='idle')reset()}else if(l.top<innerHeight*.7&&l.bottom>innerHeight*.15)play()};
    let dt=false;addEventListener('scroll',()=>{if(dt)return;dt=true;requestAnimationFrame(()=>{check();dt=false})},{passive:true});
    // pressing Pause motion while it plays shows the finished day straight away
    new MutationObserver(()=>{if(state==='playing'&&still())finish()}).observe(root,{attributes:true,attributeFilter:['class']});
    check();
  }

  /* ---------- office clocks ---------- */
  function clocks(){document.querySelectorAll('[data-tz]').forEach(el=>{try{el.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:el.dataset.tz}).format(new Date())}catch(e){}})}
  clocks();setInterval(clocks,30000);

  /* ---------- email capture (prototype: nothing is sent) ---------- */
  const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll('.cap-form').forEach(f=>{const inp=f.querySelector('input[type=email]'),err=f.querySelector('.err');
    f.addEventListener('submit',e=>{e.preventDefault();const v=inp.value.trim();
      if(!EMAIL.test(v)){err.hidden=false;inp.setAttribute('aria-invalid','true');inp.focus();return}
      err.hidden=true;inp.removeAttribute('aria-invalid');
      if(f.dataset.mode==='demo'||f.dataset.mode==='project'){sess.set('xt3-demo-email',v);location.href='demo.html#'+(f.dataset.mode==='project'?'project':'form')}else{f.classList.add('done')}});
    inp.addEventListener('input',()=>{err.hidden=true;inp.removeAttribute('aria-invalid')})});

  /* ---------- demo / contact form ---------- */
  const df=document.getElementById('demoForm');
  if(df){const card=df.closest('.form-card');const pre=sess.get('xt3-demo-email');if(pre){const fe=df.querySelector('#f-email');if(!fe.value)fe.value=pre;try{sessionStorage.removeItem('xt3-demo-email')}catch(e){}}
    const tabs=[...card.querySelectorAll('.ftabs button')];
    const setType=t=>{tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.type===t));card.querySelectorAll('[data-for]').forEach(el=>el.hidden=el.dataset.for!==t);df.dataset.type=t;
      tabs.forEach(b=>b.tabIndex=b.getAttribute('aria-selected')==='true'?0:-1);
      df.querySelectorAll('.field').forEach(fl=>{if(fl.closest('[hidden]')){fl.classList.remove('bad');const c=fl.querySelector('input,select,textarea');c&&c.removeAttribute('aria-invalid')}})};
    tabs.forEach(b=>b.onclick=()=>setType(b.dataset.type));
    addEventListener('hashchange',()=>setType(location.hash==='#project'?'project':'demo'));
    setType(location.hash==='#project'?'project':'demo');
    if(location.hash==='#project')requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));
    const date=df.querySelector('#f-date'),msg=df.querySelector('#f-msg');
    if(date){const n=new Date(),p=v=>String(v).padStart(2,'0');date.min=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate())}
    df.querySelectorAll('.field').forEach((fl,i)=>{const c=fl.querySelector('input,select,textarea'),er=fl.querySelector('.err');if(c&&er){er.id=er.id||'err-'+i;c.setAttribute('aria-describedby',er.id)}});
    const mark=(c,bad)=>{c.closest('.field').classList.toggle('bad',bad);if(bad)c.setAttribute('aria-invalid','true');else c.removeAttribute('aria-invalid')};
    df.addEventListener('input',e=>{const c=e.target;if(c.closest&&c.closest('.field.bad'))mark(c,false)});
    df.addEventListener('submit',e=>{e.preventDefault();let ok=true;
      df.querySelectorAll('[required]').forEach(i=>{if(i.closest('[hidden]'))return;const bad=i.type==='email'?!EMAIL.test(i.value.trim()):!i.value.trim();mark(i,bad);if(bad)ok=false});
      if(date){const n=new Date(),p=v=>String(v).padStart(2,'0');date.min=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate())}
      if(date&&!date.closest('[hidden]')){const bad=!!date.value&&date.value<date.min;mark(date,bad);if(bad)ok=false}
      if(msg){const bad=msg.value.length>2000;mark(msg,bad);if(bad)ok=false}
      if(!ok){const first=df.querySelector('.field.bad input,.field.bad select,.field.bad textarea');first&&first.focus();return}
      const btn=df.querySelector('button[type=submit]'),lab=btn.querySelector('span');btn.disabled=true;lab.textContent=root.lang==='vi'?'Đang gửi...':'Sending...';
      setTimeout(()=>{card.classList.add('sent');card.scrollIntoView({block:'center'})},900)})}

  /* ---------- Home contact form (prototype: nothing is sent) ---------- */
  const cf=document.getElementById('contactForm');
  /* phone: optional; when filled, 7 to 15 digits (E.164) with an optional leading + and spaces, dots, dashes or brackets */
  if(cf){const card=cf.closest('.form-card'),PHONE=/^\+?[0-9(][0-9\s().-]{6,24}$/,digits=v=>(v.match(/\d/g)||[]).length;
    cf.querySelectorAll('.field').forEach((fl,i)=>{const c=fl.querySelector('input,textarea'),h=fl.querySelector('.help');if(h)h.id='chelp-'+i;fl.querySelectorAll('.err').forEach((er,j)=>er.id='cerr-'+i+'-'+j);if(c&&h)c.setAttribute('aria-describedby',h.id)});
    const problem=c=>{const v=c.value.trim();if(c.type==='email')return EMAIL.test(v)?'':'bad';if(c.type==='tel')return !v||(PHONE.test(v)&&digits(v)>=7&&digits(v)<=15)?'':'bad';if(c.tagName==='TEXTAREA'&&c.value.length>2000)return 'long';return v?'':'bad'};
    const mark=(c,p)=>{const fl=c.closest('.field'),h=fl.querySelector('.help'),er=p&&fl.querySelector(p==='long'?'.err-long':'.err:not(.err-long)'),ids=[h&&h.id,er&&er.id].filter(Boolean).join(' ');fl.classList.toggle('bad',!!p);fl.classList.toggle('long',p==='long');
      if(ids)c.setAttribute('aria-describedby',ids);else c.removeAttribute('aria-describedby');if(p)c.setAttribute('aria-invalid','true');else c.removeAttribute('aria-invalid')};
    cf.addEventListener('input',e=>{const c=e.target;if(c.closest&&c.closest('.field.bad')&&!problem(c))mark(c,'')});
    cf.addEventListener('submit',e=>{e.preventDefault();let first=null;
      cf.querySelectorAll('input,textarea').forEach(c=>{const p=problem(c);mark(c,p);if(p&&!first)first=c});
      if(first){first.focus();return}
      const btn=cf.querySelector('button[type=submit]'),lab=btn.querySelector('span');btn.disabled=true;lab.textContent=root.lang==='vi'?'Đang gửi...':'Sending...';
      setTimeout(()=>{card.classList.add('sent');card.scrollIntoView({block:'center'});card.querySelector('.form-ok').focus({preventScroll:true})},900)})}

  /* ---------- Home hero silk cloth (WebGL, from landing-page-v1) ---------- */
  document.querySelectorAll('canvas.silk').forEach(cv=>{
    const tg=cv.parentElement.querySelector('.motion-toggle');
    const gl=cv.getContext('webgl',{premultipliedAlpha:false,antialias:true});if(!gl){cv.remove();tg&&tg.remove();return}
    const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs=`precision highp float;
uniform vec2 r;uniform float t;uniform vec3 bg,base,fold,sheen,thread;
float h(vec2 p){float v=0.;
 v+=sin(p.x*1.4+t*.30+sin(p.y*1.2+t*.18)*1.6)*.55;
 v+=sin(p.y*2.1-t*.24+sin(p.x*.9-t*.12)*1.3)*.33;
 v+=sin((p.x*.7+p.y)*3.0+t*.40)*.10;
 v+=sin((p.x-p.y*.6)*5.2-t*.35)*.035;return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=vec2(uv.x*r.x/r.y,uv.y)*2.4;p+=vec2(-t*.02,0.);
 float e=.004;float hc=h(p);
 float dx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e);float dy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);
 vec3 n=normalize(vec3(-dx,-dy,1.35));vec3 L=normalize(vec3(-.45,.55,.7));
 float diff=clamp(dot(n,L),0.,1.);float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),28.);
 vec3 col=mix(fold,base,smoothstep(.25,.95,diff));col+=sheen*spec*.55;
 float th=abs(sin(hc*7.5+p.x*.35));th=1.-smoothstep(0.,.045,th);col=mix(col,thread,th*(.35+.4*diff));
 float m=.35+.65*smoothstep(.15,.85,uv.x+uv.y*.08+hc*.06);
 gl_FragColor=vec4(mix(bg,col,m),1.);}`;
    const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.remove();tg&&tg.remove();return}
    gl.useProgram(pr);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const U=n=>gl.getUniformLocation(pr,n),hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
    gl.uniform3fv(U('bg'),hex('#0B1730'));gl.uniform3fv(U('base'),hex('#1E4178'));gl.uniform3fv(U('fold'),hex('#050C1A'));gl.uniform3fv(U('sheen'),hex('#FFCF06'));gl.uniform3fv(U('thread'),hex('#FFC000'));
    let last=8;
    const draw=tt=>{gl.uniform1f(U('t'),tt);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};
    const size=()=>{const d=Math.min(devicePixelRatio||1,1.5);cv.width=cv.clientWidth*d;cv.height=cv.clientHeight*d;gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U('r'),cv.width,cv.height);draw(last)};
    new ResizeObserver(size).observe(cv);size();
    const saved=store.get('xt3-motion');let paused=saved?saved==='off':reduce,vis=true,prev=performance.now(),raf=0;
    const btn=cv.parentElement.querySelector('.motion-toggle');
    const label=()=>{if(!btn)return;const vi=root.lang==='vi',txt=paused?(vi?'Chạy chuyển động':'Play motion'):(vi?'Tạm dừng chuyển động':'Pause motion');
      btn.querySelector('i').className='ph '+(paused?'ph-play':'ph-pause');btn.querySelector('span').textContent=txt};
    const kick=()=>{if(!raf&&!paused&&vis){prev=performance.now();raf=requestAnimationFrame(loop)}};
    if(btn)btn.onclick=()=>{paused=!paused;store.set('xt3-motion',paused?'off':'on');label();kick();document.querySelectorAll('.logo-marquee').forEach(m=>m.classList.toggle('motion-off',paused))};
    document.addEventListener('xt-lang',label);
    new IntersectionObserver(es=>{vis=es[0].isIntersecting;kick()}).observe(cv);
    function loop(now){const dt=Math.min((now-prev)/1000,.1);prev=now;last+=dt*.35;draw(last);raf=(!paused&&vis)?requestAnimationFrame(loop):0}
    label();draw(last);kick()});

  /* ---------- job application form (prototype: nothing is sent) ---------- */
  const af=document.getElementById('applyForm');
  if(af){const card=af.closest('.form-card'),cv=af.querySelector('#a-cv'),msg=af.querySelector('#a-msg');
    af.querySelectorAll('.field').forEach((fl,i)=>{const er=fl.querySelector('.err');if(er)er.id='aerr-'+i});
    const desc=(c,bad)=>{const h=c.closest('.field').querySelector('.help'),er=c.closest('.field').querySelector('.err'),ids=[h&&h.id,bad&&er&&er.id].filter(Boolean).join(' ');if(ids)c.setAttribute('aria-describedby',ids);else c.removeAttribute('aria-describedby')};
    af.querySelectorAll('input,textarea').forEach(c=>desc(c,false));
    const mark=(c,bad)=>{c.closest('.field').classList.toggle('bad',bad);desc(c,bad);if(bad)c.setAttribute('aria-invalid','true');else c.removeAttribute('aria-invalid')};
    const cvOk=()=>{const f=cv.files&&cv.files[0];return !!f&&f.size>0&&/\.(pdf|docx?)$/i.test(f.name)&&f.size<=5*1024*1024};
    af.addEventListener('input',e=>{const c=e.target;if(c.closest&&c.closest('.field.bad'))mark(c,false)});
    cv.addEventListener('change',()=>mark(cv,!cvOk()));
    af.addEventListener('submit',e=>{e.preventDefault();let ok=true;
      af.querySelectorAll('input[required]:not([type=file])').forEach(i=>{const bad=i.type==='email'?!EMAIL.test(i.value.trim()):!i.value.trim();mark(i,bad);if(bad)ok=false});
      if(!cvOk()){mark(cv,true);ok=false}
      if(msg.value.length>2000){mark(msg,true);ok=false}
      if(!ok){const first=af.querySelector('.field.bad input,.field.bad textarea');first&&first.focus();return}
      const btn=af.querySelector('button[type=submit]'),lab=btn.querySelector('span');btn.disabled=true;lab.textContent=root.lang==='vi'?'Đang gửi...':'Sending...';
      setTimeout(()=>{card.classList.add('sent');card.scrollIntoView({block:'center'});const ok=card.querySelector('.form-ok');ok&&ok.focus({preventScroll:true})},900)})}

  /* ---------- flowing strand ribbon (canvas 2D) ---------- */
  document.querySelectorAll('canvas.strands').forEach(cv=>{
    const ctx=cv.getContext('2d'),tone=cv.dataset.tone||'light';let W=0,H=0,vis=true,tHold=4;const t0=performance.now();
    const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)};
    const col={light:[a=>`rgba(22,54,99,${a})`,'rgba(230,173,0,.55)'],navy:[a=>`rgba(170,195,235,${a*.9})`,'rgba(255,192,0,.6)'],amber:[a=>`rgba(255,255,255,${a*2.4})`,'rgba(22,54,99,.35)']}[tone];
    function draw(t){ctx.clearRect(0,0,W,H);const N=54,S=46;
      for(let i=0;i<N;i++){const k=i/(N-1)-.5,acc=i%9===4;ctx.beginPath();
        for(let j=0;j<=S;j++){const u=j/S,x=-.08*W+u*1.16*W,cy=H*(.92-.62*u)+H*.07*Math.sin(u*3.2+t*.25),sp=H*.2*(.35+.65*Math.pow(Math.sin(u*Math.PI*.95+.2),2)),y=cy+k*sp*Math.cos(u*4.2+t*.45+k*.9);j?ctx.lineTo(x,y):ctx.moveTo(x,y)}
        ctx.strokeStyle=acc?col[1]:col[0](.06+.12*(1-Math.abs(k)*2));ctx.lineWidth=acc?1.2:1;ctx.stroke()}}
    const loop=now=>{const s=(now-t0)/1000;tHold=reduce?4:Math.min(s,5)+4;if(vis)draw(tHold);if(!reduce&&s<5)requestAnimationFrame(loop)};
    new ResizeObserver(()=>{size();draw(tHold)}).observe(cv);new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cv);size();requestAnimationFrame(loop)});
})();
