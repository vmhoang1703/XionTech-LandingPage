/* XionTechs site v3: shared behaviour (prototype). Production would render header/footer/news server-side for SEO. */
(function(){
  const root=document.documentElement;
  root.classList.remove('no-js');
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
    <div class="dd"><button class="${page==='products'?'current':''}" aria-expanded="false"><span data-vi="Sản phẩm">Products</span><i class="ph ph-caret-down caret"></i></button>
      <div class="mega">
        <a href="products.html#pxp"><span class="badge b-pxp">PXP</span><span><strong>PXP</strong><small data-vi="Parent eXperience Place. Cả ngày học của con trong tay phụ huynh.">Parent eXperience Place. The school day in every parent's pocket.</small><small class="for" data-vi="Phụ huynh">Parents</small></span></a>
        <a href="products.html#lxp"><span class="badge b-lxp">LXP</span><span><strong>LXP</strong><small data-vi="Learner eXperience Place. Bài học, bài tập và tiến độ cho học sinh.">Learner eXperience Place. Lessons, tasks and progress for students.</small><small class="for" data-vi="Học sinh">Students</small></span></a>
        <a href="products.html#sxp"><span class="badge b-sxp">SXP</span><span><strong>SXP</strong><small data-vi="Staff eXperience Place. Một không gian làm việc, giao diện theo vai trò.">Staff eXperience Place. One workspace, role-based views.</small><small class="for" data-vi="Nhân viên · Giáo viên · Lãnh đạo">Staff · Teachers · Leaders</small></span></a>
        <a href="products.html#iot"><span class="badge b-iot"><i class="ph ph-cpu"></i></span><span><strong data-vi="Quản lý thiết bị IoT">IoT Device Management</strong><small data-vi="Điều khiển thiết bị trong trường từ một màn hình.">Control campus devices from one screen.</small><small class="for" data-vi="Nhân viên và cơ sở vật chất">School staff and facilities</small></span></a>
        <div class="foot"><span data-vi="Nhiều sản phẩm mới sắp ra mắt.">More products are on the way.</span><a href="products.html"><span data-vi="Tất cả sản phẩm">All products</span><i class="ph ph-arrow-right"></i></a></div>
      </div></div>
    <div class="dd"><button class="${page==='services'?'current':''}" aria-expanded="false"><span data-vi="Dịch vụ">Services</span><i class="ph ph-caret-down caret"></i></button>
      <div class="mega svc-mega">
        <a href="services.html#product-engineering"><i class="ph ph-cube"></i><strong>Product Engineering</strong></a>
        <a href="services.html#ai-analytics"><i class="ph ph-chart-scatter"></i><strong>AI-Driven Analytics</strong></a>
        <a href="services.html#co-creation"><i class="ph ph-intersect"></i><strong>Product Co-Creation</strong></a>
        <a href="services.html#staffing"><i class="ph ph-user-plus"></i><strong>Staffing Service</strong></a>
        <a href="services.html#custom-apps"><i class="ph ph-app-window"></i><strong>Custom App Development</strong></a>
        <a href="services.html#low-code"><i class="ph ph-puzzle-piece"></i><strong>Low-code Solutions</strong></a>
        <a href="services.html#ai-solutions"><i class="ph ph-sparkle"></i><strong>AI-Powered Solutions</strong></a>
        <a href="services.html#cloud"><i class="ph ph-cloud"></i><strong>Cloud Computing</strong></a>
        <div class="foot"><span data-vi="Quy trình 4-D: Khám phá, Thiết kế, Phát triển, Triển khai.">Our 4-D process: Discovery, Design, Development, Deployment.</span><a href="services.html#process"><span data-vi="Xem quy trình">See the process</span><i class="ph ph-arrow-right"></i></a></div>
      </div></div>
    <a href="news.html"${cur('news')} data-vi="Tin tức">News</a>
    <a href="about.html"${cur('about')} data-vi="Về chúng tôi">About</a>
    <a href="careers.html"${cur('careers')} data-vi="Tuyển dụng">Careers</a>
  </nav>
  <div class="tools">
    <div class="seg" role="group" aria-label="Language"><button data-lang="en" aria-pressed="true">EN</button><button data-lang="vi" aria-pressed="false">VI</button></div>
    <a class="btn btn-primary btn-sm hide-sm" href="demo.html" data-vi="Đặt lịch demo">Book a demo</a>
    <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false"><i class="ph ph-list"></i></button>
  </div>
</div></header>`;
  const footer=`
<footer class="site"><div class="wrap">
  <div class="fgrid">
    <div><a class="flogo" href="index.html"><img src="assets/logo.png" alt="XionTechs"></a>
      <p class="about" data-vi="Sản phẩm công nghệ giáo dục và dịch vụ phát triển phần mềm cho trường học và doanh nghiệp.">Education technology products and software delivery services for schools and businesses.</p></div>
    <div><h4 data-vi="Sản phẩm">Products</h4><ul><li><a href="products.html#pxp">PXP</a></li><li><a href="products.html#lxp">LXP</a></li><li><a href="products.html#sxp">SXP</a></li><li><a href="products.html#iot" data-vi="Quản lý thiết bị IoT">IoT Device Management</a></li><li><a href="products.html#updates" data-vi="Cập nhật sản phẩm">Product updates</a></li></ul></div>
    <div><h4 data-vi="Dịch vụ">Services</h4><ul><li><a href="services.html#product-engineering">Product Engineering</a></li><li><a href="services.html#ai-analytics">AI-Driven Analytics</a></li><li><a href="services.html#staffing">Staffing Service</a></li><li><a href="services.html#low-code">Low-code Solutions</a></li><li><a href="services.html#cloud">Cloud Computing</a></li><li><a href="services.html" data-vi="Tất cả dịch vụ">All services</a></li></ul></div>
    <div><h4 data-vi="Công ty">Company</h4><ul><li><a href="about.html" data-vi="Về chúng tôi">About</a></li><li><a href="about.html#values" data-vi="Giá trị cốt lõi">Core values</a></li><li><a href="news.html" data-vi="Tin tức">News</a></li><li><a href="careers.html" data-vi="Tuyển dụng">Careers</a></li><li><a href="demo.html" data-vi="Liên hệ">Contact</a></li></ul></div>
    <div><h4 data-vi="Văn phòng">Offices</h4>
      <address class="office"><b>Ho Chi Minh City, Vietnam</b>Viettel Tower, Floor 12<br>285 CMT8, HCMC 70064<br><a href="tel:+84908107552">+84 908 107 552</a></address>
      <address class="office"><b>Dallas, USA</b>Texas, United States<br><a href="tel:+14693229899">+1 469 322 9899</a></address></div>
  </div>
  <div class="fbot"><span>© 2026 XionTechs · <a href="#" data-vi="[Placeholder] Chính sách bảo mật">[Placeholder] Privacy policy</a></span><span class="tag">GET IT <b>DONE</b></span></div>
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
    {id:'n3',date:'05 SEP 2026',cat:'schools',t:'[Placeholder] Back-to-school week with our partner schools',tv:'[Placeholder] Tuần đầu năm học cùng các trường đối tác',x:'Our team was on campus helping teachers and parents get started with SXP and PXP.',xv:'Đội ngũ có mặt tại trường để hỗ trợ giáo viên và phụ huynh bắt đầu với SXP và PXP.'},
    {id:'n4',date:'28 AUG 2026',cat:'product',app:'SXP',t:'[Placeholder] SXP adds dashboards for school leaders',tv:'[Placeholder] SXP bổ sung bảng điều khiển cho lãnh đạo nhà trường',x:'A role-based view that shows what needs attention today.',xv:'Giao diện theo vai trò cho thấy việc cần xử lý hôm nay.'},
    {id:'n5',date:'22 AUG 2026',cat:'team',t:'[Placeholder] Inside our pre-term release testing week',tv:'[Placeholder] Bên trong tuần kiểm thử trước năm học',x:'How our QA team checked every critical flow before students came back.',xv:'Cách đội QA kiểm tra mọi luồng quan trọng trước khi học sinh trở lại trường.'},
    {id:'n6',date:'12 AUG 2026',cat:'product',app:'LXP',t:'[Placeholder] LXP shows assignment progress at a glance',tv:'[Placeholder] LXP hiển thị tiến độ bài tập trong nháy mắt',x:'Students see what is due, what is done and what needs another look.',xv:'Học sinh thấy bài nào sắp đến hạn, bài nào đã xong và bài nào cần xem lại.'},
    {id:'n7',date:'30 JUL 2026',cat:'product',app:'IoT',t:'[Placeholder] A new campus joins the IoT pilot',tv:'[Placeholder] Một khuôn viên mới tham gia thí điểm IoT',x:'Classroom lighting and climate are now scheduled from one screen.',xv:'Ánh sáng và điều hòa trong lớp học giờ được lên lịch từ một màn hình.'},
    {id:'n8',date:'15 JUL 2026',cat:'company',t:'[Placeholder] Low-code, delivered: automating client workflows',tv:'[Placeholder] Low-code thực chiến: tự động hóa quy trình cho khách hàng',x:'How our team uses Power Platform and n8n to ship internal tools faster.',xv:'Cách đội ngũ dùng Power Platform và n8n để ra mắt công cụ nội bộ nhanh hơn.'}
  ];
  const CAT={product:['Product','Sản phẩm'],team:['Team','Đội ngũ'],schools:['Schools','Trường học'],company:['Company','Công ty']};
  const card=(n,big)=>`<article class="spot ncard${big?' big':''} reveal" data-c="${n.cat}">
    <div class="slot" data-slot="news-${n.id}" data-hint="Story photo" data-size="1200 × 750"></div>
    <div class="body"><div class="meta">${n.date}<span class="cat ${n.cat==='product'?'product':''}" data-vi="${CAT[n.cat][1]}${n.app?' · '+n.app:''}">${CAT[n.cat][0]}${n.app?' · '+n.app:''}</span></div>
    <h3 data-vi="${n.tv}">${n.t}</h3><p data-vi="${n.xv}">${n.x}</p>
    <a class="link-arrow" href="news.html"><span data-vi="Đọc tiếp">Read story</span><i class="ph ph-arrow-right"></i></a></div></article>`;
  document.querySelectorAll('[data-news]').forEach(box=>{
    const mode=box.dataset.news,lim=+box.dataset.limit||99;
    let list=NEWS;if(mode==='product')list=NEWS.filter(n=>n.cat==='product');
    box.innerHTML=list.slice(0,lim).map((n,i)=>card(n,mode==='all'&&i===0)).join('');
  });

  /* ---------- i18n (EN from markup, VI from data-vi / data-vi-html / data-vi-ph) ---------- */
  const txt=[...document.querySelectorAll('[data-vi]')].map(el=>[el,el.textContent,el.dataset.vi]);
  const htm=[...document.querySelectorAll('[data-vi-html]')].map(el=>[el,el.innerHTML,el.dataset.viHtml]);
  const phs=[...document.querySelectorAll('[data-vi-ph]')].map(el=>[el,el.placeholder,el.dataset.viPh]);
  function setLang(l){root.lang=l;
    txt.forEach(([el,en,vi])=>el.textContent=l==='vi'?vi:en);htm.forEach(([el,en,vi])=>el.innerHTML=l==='vi'?vi:en);phs.forEach(([el,en,vi])=>el.placeholder=l==='vi'?vi:en);
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===l));store.set('xt3-lang',l)}
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
  setLang(store.get('xt3-lang')||'en');

  /* ---------- menus ---------- */
  const dds=[...document.querySelectorAll('.dd')];
  const closeAll=except=>dds.forEach(d=>{if(d!==except){d.classList.remove('open');d.firstElementChild.setAttribute('aria-expanded','false')}});
  dds.forEach(d=>{const b=d.firstElementChild;
    b.addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
    if(matchMedia('(hover:hover) and (min-width:1081px)').matches){d.addEventListener('mouseenter',()=>{closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true')});d.addEventListener('mouseleave',()=>closeAll())}
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
  const menu=document.getElementById('menu'),burger=document.getElementById('burger');
  burger.onclick=()=>{const o=!menu.classList.contains('mobile-open');menu.classList.toggle('mobile-open',o);burger.setAttribute('aria-expanded',o)};

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

  /* ---------- reveal, spotlight, tilt ---------- */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
  document.querySelectorAll('.spot').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  document.querySelectorAll('.devices').forEach(dev=>{const tilt=dev.querySelector('.tilt');if(!tilt||reduce||!matchMedia('(hover:hover)').matches)return;
    dev.addEventListener('pointermove',e=>{const r=dev.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tilt.style.transform=`rotateY(${x*8}deg) rotateX(${-y*6}deg)`});
    dev.addEventListener('pointerleave',()=>tilt.style.transform='')});

  /* ---------- stats count-up ---------- */
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;sio.unobserve(e.target);
    const el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'';if(reduce){el.innerHTML=to+'<em>'+suf+'</em>';return}
    const t0=performance.now();(function step(now){const p=Math.min(1,(now-t0)/1400),v=Math.round(to*(1-Math.pow(1-p,3)));el.innerHTML=v+'<em>'+suf+'</em>';if(p<1)requestAnimationFrame(step)})(t0)}),{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>sio.observe(el));

  /* ---------- 4-D flow lights up when seen ---------- */
  const fio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('lit');fio.unobserve(e.target)}}),{threshold:.3});
  document.querySelectorAll('.flow').forEach(f=>fio.observe(f));

  /* ---------- filters (news page) ---------- */
  document.querySelectorAll('[data-filter-for]').forEach(group=>{const box=document.getElementById(group.dataset.filterFor);
    group.querySelectorAll('button').forEach(b=>b.onclick=()=>{group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
      box.querySelectorAll('[data-c]').forEach(c=>c.style.display=(b.dataset.f==='all'||c.dataset.c===b.dataset.f)?'':'none')})});

  /* ---------- phone tabs (products page) ---------- */
  document.querySelectorAll('[data-phone-tabs]').forEach(tabs=>{const ph=document.getElementById(tabs.dataset.phoneTabs);const slots=[...ph.querySelectorAll('.slot')];
    tabs.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));slots.forEach((s,j)=>s.classList.toggle('on',j===i))})});

  /* ---------- sub-nav highlight ---------- */
  const sub=[...document.querySelectorAll('.subnav a')];
  if(sub.length){const map=sub.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)sub.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
    map.forEach(s=>nio.observe(s))}

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
  if(df){const card=df.closest('.form-card');const pre=sess.get('xt3-demo-email');if(pre)df.querySelector('#f-email').value=pre;
    const tabs=[...card.querySelectorAll('.ftabs button')];
    const setType=t=>{tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.type===t));card.querySelectorAll('[data-for]').forEach(el=>el.hidden=el.dataset.for!==t);df.dataset.type=t};
    tabs.forEach(b=>b.onclick=()=>setType(b.dataset.type));
    setType(location.hash==='#project'?'project':'demo');
    df.addEventListener('submit',e=>{e.preventDefault();let ok=true;
      df.querySelectorAll('[required]').forEach(i=>{if(i.closest('[hidden]'))return;const bad=i.type==='email'?!EMAIL.test(i.value.trim()):!i.value.trim();i.closest('.field').classList.toggle('bad',bad);if(bad)ok=false});
      if(!ok){const first=df.querySelector('.field.bad input,.field.bad select');first&&first.focus();return}
      card.classList.add('sent');card.scrollIntoView({block:'center'})})}

  /* ---------- flowing strand ribbon (canvas 2D) ---------- */
  document.querySelectorAll('canvas.strands').forEach(cv=>{
    const ctx=cv.getContext('2d'),tone=cv.dataset.tone||'light';let W=0,H=0,vis=true;const t0=performance.now();
    const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)};
    const col={light:[a=>`rgba(22,54,99,${a})`,'rgba(230,173,0,.55)'],navy:[a=>`rgba(170,195,235,${a*.9})`,'rgba(255,192,0,.6)'],amber:[a=>`rgba(255,255,255,${a*2.4})`,'rgba(22,54,99,.35)']}[tone];
    function draw(t){ctx.clearRect(0,0,W,H);const N=54,S=46;
      for(let i=0;i<N;i++){const k=i/(N-1)-.5,acc=i%9===4;ctx.beginPath();
        for(let j=0;j<=S;j++){const u=j/S,x=-.08*W+u*1.16*W,cy=H*(.92-.62*u)+H*.07*Math.sin(u*3.2+t*.25),sp=H*.2*(.35+.65*Math.pow(Math.sin(u*Math.PI*.95+.2),2)),y=cy+k*sp*Math.cos(u*4.2+t*.45+k*.9);j?ctx.lineTo(x,y):ctx.moveTo(x,y)}
        ctx.strokeStyle=acc?col[1]:col[0](.06+.12*(1-Math.abs(k)*2));ctx.lineWidth=acc?1.2:1;ctx.stroke()}}
    const loop=now=>{if(vis)draw(reduce?4:(now-t0)/1000+4);if(!reduce)requestAnimationFrame(loop)};
    new ResizeObserver(()=>{size();draw(4)}).observe(cv);new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cv);size();requestAnimationFrame(loop)});
})();
