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
    <a href="index.html"${cur('home')} data-vi="Trang chủ">Home</a>
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
<footer class="site"><div class="ridge" aria-hidden="true"><svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false"><path class="ridge-fill" d="M0 120 L0 94 L110 82 L200 90 L300 72 L380 84 L470 66 L560 80 L650 60 L730 74 L800 52 L860 6 L920 56 L1000 46 L1090 68 L1180 58 L1270 78 L1360 64 L1440 74 L1440 120 Z"/><path class="ridge-line" d="M0 94 L110 82 L200 90 L300 72 L380 84 L470 66 L560 80 L650 60 L730 74 L800 52 L860 6 L920 56 L1000 46 L1090 68 L1180 58 L1270 78 L1360 64 L1440 74"/></svg><span class="ridge-climber"><svg viewBox="0 0 24 30" focusable="false"><rect class="rc-pack" x="5.4" y="8.4" width="5.4" height="8" rx="2" transform="rotate(16 8.1 12.4)"/><circle class="rc-head" cx="14.6" cy="4.2" r="2.7"/><path class="rc-body" d="M13.4 7.8 L10.6 16.8 M12.8 10 L16.4 12.6 L19 10.4 M10.6 16.8 L15.2 20.6 L16 27.2 M10.6 16.8 L8.2 22.8 L5.4 27.4"/></svg></span></div><div class="wrap">
  <div class="fgrid">
    <div><a class="flogo" href="index.html"><img src="assets/logo.png" alt="XionTechs"></a>
      <p class="about" data-vi="Sản phẩm công nghệ giáo dục và dịch vụ phát triển phần mềm cho trường học và doanh nghiệp.">Education technology products and software delivery services for schools and businesses.</p></div>
    <div><h4 data-vi="Sản phẩm">Products</h4><ul><li><a href="products.html#sxp" data-vi="Cho nhà trường">For schools</a></li><li><a href="products.html#lxp" data-vi="Cho học sinh">For students</a></li><li><a href="products.html#pxp" data-vi="Cho phụ huynh">For parents</a></li></ul></div>
    <div><h4 data-vi="Dịch vụ">Services</h4><ul><li><a href="services.html#product-engineering">Product Engineering</a></li><li><a href="services.html#ai-analytics">AI-Driven Analytics</a></li><li><a href="services.html#staffing">Staffing Service</a></li><li><a href="services.html#low-code">Low-code Solutions</a></li><li><a href="services.html#cloud">Cloud Computing</a></li><li><a href="services.html#process" data-vi="Cách chúng tôi làm việc">How we work</a></li><li><a href="services.html" data-vi="Tất cả dịch vụ">All services</a></li></ul></div>
    <div><h4 data-vi="Công ty">Company</h4><ul><li><a href="news.html" data-vi="Tin tức">News</a></li><li><a href="about.html" data-vi="Về chúng tôi">About us</a></li><li><a href="careers.html" data-vi="Tuyển dụng">Careers</a></li></ul></div>
    <div><h4 data-vi="Văn phòng">Offices</h4>
      <address class="office"><b data-vi="Trung tâm Phát triển Việt Nam">Vietnam Delivery Center</b><span class="orow"><i class="ph ph-map-pin" aria-hidden="true"></i><span>Floor 15, B1 Building<br>279 Nguyen Tri Phuong Street<br>Dien Hong Ward, Ho Chi Minh City, Vietnam</span></span><span class="orow"><i class="ph ph-phone" aria-hidden="true"></i><span><a href="tel:+84908107552">(+84) 908 107 552</a></span></span><span class="orow"><i class="ph ph-envelope-simple" aria-hidden="true"></i><span><a href="mailto:vinni.tran@xiontechs.com">vinni.tran@xiontechs.com</a></span></span></address>
      <address class="office"><b data-vi="Trung tâm Phát triển Hoa Kỳ">US Delivery Center</b><span class="orow"><i class="ph ph-map-pin" aria-hidden="true"></i><span>7950 Legacy Drive, Suite 400<br>Plano, Texas 75024, USA</span></span><span class="orow"><i class="ph ph-phone" aria-hidden="true"></i><span><a href="tel:+14693229899">(+1) 469 322 9899</a></span></span><span class="orow"><i class="ph ph-whatsapp-logo" aria-hidden="true"></i><span><a href="https://wa.me/14694399345" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp (+1) 469 439 9345 (opens in a new tab)" data-vi-aria="WhatsApp (+1) 469 439 9345 (mở trong thẻ mới)">(+1) 469 439 9345</a></span></span><span class="orow"><i class="ph ph-envelope-simple" aria-hidden="true"></i><span><a href="mailto:vinni.tran@newxion.com">vinni.tran@newxion.com</a></span></span></address></div>
  </div>
  <div class="fbot"><span>© 2026 XionTechs · <a href="privacy.html" data-vi="Chính sách bảo mật">Privacy policy</a></span><span class="tag">GET IT <b>DONE</b></span></div>
</div></footer><div class="toast" id="toast" role="status"></div>`;
  const hs=document.getElementById('site-header'),fs=document.getElementById('site-footer');
  if(hs)hs.outerHTML=header;
  if(fs)fs.outerHTML=footer;

  const toastEl=document.getElementById('toast');let tt;
  const toast=m=>{toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),2600)};

  /* ---------- the climber (ENH-045): each page has its own spot on the footer ridge, set by its place in the navigation,
     from Home at the foot to Careers on the summit. Arriving from another page, it walks from that page's spot. ---------- */
  const ridge=document.querySelector('.ridge'),climber=ridge&&ridge.querySelector('.ridge-climber'),rline=ridge&&ridge.querySelector('.ridge-line');
  if(climber&&rline&&rline.getTotalLength){const total=rline.getTotalLength();let peakLen=total;
    // the length along the ridge line where it reaches the peak (x 860 of 1440)
    for(let lo=0,hi=total,i=0;i<30;i++){const mid=(lo+hi)/2;if(rline.getPointAtLength(mid).x<860)lo=mid;else hi=mid;peakLen=hi}
    const SPOT={home:.06,products:.24,services:.42,news:.6,about:.8,careers:1},page=document.body.dataset.page,known=SPOT[page]!=null;
    let from=known?SPOT[page]:SPOT.home;try{const v=parseFloat(sessionStorage.getItem('xt-climber'));if(!isNaN(v))from=Math.min(1,Math.max(0,v))}catch(e){}
    // the climber only ever climbs: a page lower on the mountain keeps it where it is (and Privacy, Demo and 404 never move it)
    const goal=known?Math.max(from,SPOT[page]):from;if(known)try{sessionStorage.setItem('xt-climber',String(goal))}catch(e){}
    let p=from,frame=0;
    const put=v=>{const r=ridge.getBoundingClientRect(),pt=rline.getPointAtLength(Math.min(1,Math.max(0,v))*peakLen);
      climber.style.transform='translate('+(pt.x*r.width/1440).toFixed(1)+'px,'+(pt.y*r.height/120).toFixed(1)+'px)'};
    const walk=()=>{if(reduce||Math.abs(goal-from)<.005){p=goal;put(p);return}
      climber.classList.toggle('left',goal<from);climber.classList.add('walking');
      const t0=performance.now(),dur=900+Math.abs(goal-from)*2200;
      const tick=t=>{const f=Math.min(1,(t-t0)/dur),e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;p=from+(goal-from)*e;put(p);
        if(f<1)frame=requestAnimationFrame(tick);else climber.classList.remove('walking','left')};
      frame=requestAnimationFrame(tick)};
    put(p);addEventListener('resize',()=>put(p),{passive:true});
    // it sets off once the ridge comes into view, so the walk is seen
    if('IntersectionObserver' in window&&!reduce){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();walk()}},{threshold:.5});io.observe(ridge)}else walk()}

  /* ---------- news data (single source for home / news / products / story page) ---------- */
  // aud is the audience the News filter uses; app names the product a story is about (Products shows those).
  // real stories from the newXion newsroom (captured 5 Oct 2026); mock:1 marks sample stories for audiences the newsroom does not cover yet
  const NEWS=[
    {id:'work-smart-play-sharp',date:'31 Jul 2026',aud:'company',t:'How our team is putting agentic AI to work every day',tv:'Cách đội ngũ của chúng tôi đưa AI tác tử vào công việc hằng ngày',x:'At our “Thực Chiến AI với Agentic Workflow” workshop, team members showed how they use AI tools in their everyday work, then stayed on to celebrate together.',xv:'Tại workshop “Thực Chiến AI với Agentic Workflow”, các thành viên chia sẻ cách họ dùng công cụ AI trong công việc hằng ngày, rồi cùng ở lại vui chơi gắn kết.',img:'assets/news/01-work-smart-play-sharp.jpg',alt:'Team members at the Agentic Workflow AI workshop',b:[['Applying AI not only to software development but also to everyday work activities is becoming increasingly important for improving productivity and efficiency. That idea shaped the internal workshop we held on July 31.','Ứng dụng AI không chỉ trong phát triển phần mềm mà cả trong công việc hằng ngày ngày càng quan trọng để nâng cao năng suất và hiệu quả. Đó cũng là tinh thần của buổi workshop nội bộ chúng tôi tổ chức ngày 31/7.'],['## Learning from the people doing the work','## Học từ chính những người trong cuộc'],['At the “Thực Chiến AI với Agentic Workflow” workshop, team members shared practical experiences from their day-to-day roles and demonstrated how they leverage AI tools to take on parts of their daily work.','Tại workshop “Thực Chiến AI với Agentic Workflow”, các thành viên chia sẻ kinh nghiệm thực tế từ công việc hằng ngày và trình diễn cách họ dùng công cụ AI để đảm nhận một phần công việc của mình.'],['Because the examples came from real work, the session quickly became an exchange of ideas. Team members learned from one another and explored new ways to integrate AI into their own workflows, so they can work smarter and more effectively.','Vì các ví dụ đều đến từ công việc thật, buổi chia sẻ nhanh chóng trở thành nơi trao đổi ý tưởng. Mọi người học hỏi lẫn nhau và tìm cách mới để đưa AI vào quy trình của mình, giúp làm việc thông minh và hiệu quả hơn.'],['## Beyond the workshop','## Sau buổi workshop'],['To conclude the event, we enjoyed a team-building gathering where conversations extended beyond work. It was a valuable time to connect, share personal experiences and strengthen relationships across the team.','Khép lại sự kiện là buổi gắn kết đội ngũ, nơi câu chuyện vượt ra ngoài công việc. Đó là khoảng thời gian quý giá để kết nối, chia sẻ trải nghiệm cá nhân và thắt chặt tình cảm trong đội.'],['Moments like this reinforce the culture that makes newXion feel not just like a workplace, but like a family, and keep learning an everyday habit rather than a one-off event.','Những khoảnh khắc như vậy củng cố văn hóa giúp newXion không chỉ là nơi làm việc mà còn như một gia đình, và giúp việc học hỏi trở thành thói quen hằng ngày thay vì một sự kiện đơn lẻ.']]},
    {id:'lunar-new-year-2026',date:'23 Feb 2026',aud:'company',t:'Welcoming the Year of the Horse with our Vietnam team',tv:'Chào đón năm Bính Ngọ cùng đội ngũ tại Việt Nam',x:'Our Vietnam Delivery Centers took a full week off for Tết, then came back on February 23 to exchange new year wishes and lucky money.',xv:'Các Trung tâm Phát triển tại Việt Nam được nghỉ trọn một tuần dịp Tết, rồi trở lại vào ngày 23/2 để chúc Tết và nhận lì xì đầu năm.',img:'assets/news/03-lunar-new-year-2026.jpg',alt:'Lunar New Year celebration at the Vietnam Delivery Centers',b:[['Lunar New Year has always been a cherished and traditional celebration for Vietnamese, and it is one of the most important moments of the year for our team.','Tết Nguyên Đán luôn là dịp lễ truyền thống được người Việt trân quý, và cũng là một trong những khoảnh khắc quan trọng nhất trong năm của đội ngũ chúng tôi.'],['This year, our members in the Vietnam Delivery Centers enjoyed a full week of holiday from February 16th to February 20th, time to rest and celebrate with loved ones, and returned to work on February 23rd.','Năm nay, các thành viên tại các Trung tâm Phát triển ở Việt Nam được nghỉ trọn một tuần từ 16 đến 20/2, có thời gian nghỉ ngơi và sum vầy bên người thân, rồi trở lại làm việc vào ngày 23/2.'],['## Starting the year together','## Cùng nhau khởi đầu năm mới'],['As part of our tradition, we welcomed the new year on our return by exchanging wishes of prosperity and receiving lucky money from the Board of Management.','Theo truyền thống, chúng tôi chào đón năm mới khi trở lại làm việc bằng những lời chúc thịnh vượng và nhận lì xì từ Ban Điều hành.'],['2026 is the Year of the Horse. We are moving forward with the strength and endurance of the horse.','2026 là năm Bính Ngọ. Chúng tôi tiến bước với sức mạnh và sự bền bỉ của loài ngựa.']]},
    {id:'ai-robotics-client-visit',date:'10 Oct 2025',aud:'schools',t:'Exploring AI and robotics for education with a visiting client',tv:'Cùng khách hàng khám phá AI và robot cho giáo dục',x:'A client visited our XionTech Delivery Center in Ho Chi Minh City to explore how AI and robotics could be applied in education.',xv:'Một khách hàng đã đến thăm Trung tâm Phát triển XionTech tại TP. Hồ Chí Minh để tìm hiểu cách ứng dụng AI và robot trong giáo dục.',img:'assets/news/05-ai-robotics-client-visit.jpg',alt:'Client visit to the XionTech Delivery Center in Ho Chi Minh City',b:[['We were delighted to welcome an esteemed client to the XionTech Delivery Center in Ho Chi Minh City. The visit focused on a shared interest: exploring opportunities for applying AI and robotics in education.','Chúng tôi rất vui được chào đón một khách hàng quý mến đến Trung tâm Phát triển XionTech tại TP. Hồ Chí Minh. Chuyến thăm tập trung vào mối quan tâm chung: tìm hiểu cơ hội ứng dụng AI và robot trong giáo dục.'],['## Why AI and robotics in education','## Vì sao là AI và robot trong giáo dục'],['Education is where we go deepest as a company, and AI and robotics open up new ways to bring technology into learning. Meeting in person gave both teams the chance to discuss those possibilities together.','Giáo dục là lĩnh vực chúng tôi chuyên sâu nhất, và AI cùng robot mở ra những cách mới để đưa công nghệ vào việc học. Gặp gỡ trực tiếp giúp hai bên cùng trao đổi về những khả năng đó.'],['Visits like this help clients get to know the team behind their projects first-hand, and help us understand their goals early.','Những chuyến thăm như vậy giúp khách hàng trực tiếp làm quen với đội ngũ đứng sau dự án của mình, và giúp chúng tôi hiểu mục tiêu của họ ngay từ sớm.']]},
    {id:'project-kickoff',date:'08 Apr 2025',aud:'schools',t:'Kicking off a major education initiative with our client in Ho Chi Minh City',tv:'Khởi động một sáng kiến giáo dục quan trọng cùng khách hàng tại TP. Hồ Chí Minh',x:'Our client joined us at the Besco Delivery Center in Ho Chi Minh City to set out the project requirements and officially start a major education initiative.',xv:'Khách hàng đã cùng chúng tôi có mặt tại Trung tâm Phát triển Besco ở TP. Hồ Chí Minh để thống nhất yêu cầu dự án và chính thức khởi động một sáng kiến giáo dục quan trọng.',img:'assets/news/06-project-kickoff.jpg',alt:'Project kickoff at the Besco Delivery Center in Ho Chi Minh City',b:[['A strong start makes a big difference to any project. Our valued client visited the Besco Delivery Center in Ho Chi Minh City to outline the project requirements and officially kick off a major education initiative.','Một khởi đầu vững chắc tạo nên khác biệt lớn cho mọi dự án. Khách hàng thân thiết đã đến Trung tâm Phát triển Besco tại TP. Hồ Chí Minh để trao đổi yêu cầu dự án và chính thức khởi động một sáng kiến giáo dục quan trọng.'],['## Aligning from day one','## Thống nhất ngay từ ngày đầu'],['Meeting in person at the start gave both teams the chance to agree on the requirements before delivery begins, so everyone moves forward with the same understanding.','Gặp gỡ trực tiếp ngay từ đầu giúp hai bên thống nhất yêu cầu trước khi bắt tay vào triển khai, để mọi người cùng tiến lên với một cách hiểu chung.']]},
    {id:'ai-tutor',date:'20 Mar 2025',aud:'students',app:'AI Tutor',mock:1,t:'[Placeholder] Why better AI tutoring starts with guiding the student’s thinking',tv:'[Placeholder] Vì sao gia sư AI tốt hơn bắt đầu từ việc dẫn dắt tư duy của học sinh',x:'A useful AI tutor should not simply produce the answer. It should help the learner understand what went wrong, try again and build confidence in the reasoning.',xv:'Một gia sư AI hữu ích không chỉ đưa ra đáp án. Nó giúp người học hiểu mình sai ở đâu, thử lại và tự tin hơn vào cách lập luận của mình.',img:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=88',alt:'',b:[]},
    {id:'pxp',date:'12 Feb 2025',aud:'parents',app:'PXP',mock:1,t:'[Placeholder] Making the school day easier for parents to follow',tv:'[Placeholder] Giúp phụ huynh dễ dàng theo dõi một ngày học của con',x:'Parents need simple, reliable visibility into the moments that matter without having to chase information across different systems.',xv:'Phụ huynh cần nắm được những khoảnh khắc quan trọng một cách đơn giản và đáng tin cậy, mà không phải đi tìm thông tin ở nhiều hệ thống khác nhau.',img:'https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1400&q=88',alt:'',b:[]},
    {id:'lxp',date:'15 Jan 2025',aud:'students',app:'LXP',mock:1,t:'[Placeholder] Designing a learning experience that keeps progress visible',tv:'[Placeholder] Thiết kế trải nghiệm học tập giúp tiến độ luôn rõ ràng',x:'Learning feels more coherent when activities, feedback and progress are connected around the student instead of spread across separate tools.',xv:'Việc học liền mạch hơn khi hoạt động, phản hồi và tiến độ được kết nối quanh học sinh, thay vì trải rộng trên nhiều công cụ riêng lẻ.',img:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=88',alt:'',b:[]}
  ];
  const AUD={schools:['Schools','Trường học'],students:['Students','Học sinh'],parents:['Parents','Phụ huynh'],company:['Company','Công ty']};
  const MON={JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12'};
  const viDate=d=>{const [dd,m,y]=d.split(' ');const mm=MON[(m||'').toUpperCase()];return mm?dd+'/'+mm+'/'+y:d};
  const href=n=>'news-story.html?id='+n.id;
  // News: full-image story cards (ENH-037). The first is the featured one; the whole card is the link.
  const scard=(n,i)=>`<a class="scard${i===0?' featured':''}" data-c="${n.aud}" href="${href(n)}" aria-labelledby="st-${n.id} sd-${n.id} sa-${n.id}">
    <img src="${n.img}" alt="" width="1400" height="933"${i>1?' loading="lazy"':''} onerror="this.remove()">
    <span class="scard-meta"><span class="scard-pill${n.aud==='company'?' company':''}" id="sa-${n.id}" data-vi="${AUD[n.aud][1]}">${AUD[n.aud][0]}</span><span class="scard-date" id="sd-${n.id}" data-vi="${viDate(n.date)}">${n.date}</span></span>
    <span class="scard-content"><span class="scard-title" id="st-${n.id}" data-vi="${n.tv}">${n.t}</span></span>
    <span class="scard-read" aria-hidden="true"><span data-vi="Đọc tiếp">Read story</span></span></a>`;
  document.querySelectorAll('[data-news]').forEach(box=>{
    const mode=box.dataset.news,lim=+box.dataset.limit||99;
    if(mode==='all'){box.innerHTML=NEWS.map(scard).join('');return}
    const list=mode==='product'?NEWS.filter(n=>n.app):NEWS;
    box.classList.remove('news-grid');box.classList.add('sgrid','sgrid-row');box.innerHTML=list.slice(0,lim).map((n,i)=>scard(n,i+1)).join('');
  });
  // News: the first story shown is a large lead story and the rest are square cards; a lead only when a full row of squares follows (or it is alone)
  const newsGrid=document.getElementById('newsGrid');
  const shape=()=>{if(!newsGrid)return;const vis=[...newsGrid.querySelectorAll('.scard')].filter(c=>c.style.display!=='none');
    const cols=getComputedStyle(newsGrid).gridTemplateColumns.split(' ').length,n=vis.length;
    newsGrid.querySelectorAll('.s-lead').forEach(c=>c.classList.remove('s-lead'));if(vis[0]&&(n===1||n-1>=cols))vis[0].classList.add('s-lead')};
  // each story card unfolds from the top like a menu as it scrolls into view, one after another across its row; a filter change replays it
  let pio=null;
  const press=()=>{if(!newsGrid||reduce||!('IntersectionObserver' in window))return;if(pio)pio.disconnect();newsGrid.classList.add('press-wait');
    const vis=[...newsGrid.querySelectorAll('.scard')].filter(c=>c.style.display!=='none'),cols=getComputedStyle(newsGrid).gridTemplateColumns.split(' ').length,lead=vis[0]&&vis[0].classList.contains('s-lead')?1:0;
    vis.forEach(c=>c.classList.remove('shown','press-in'));
    pio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const c=e.target;pio.unobserve(c);const k=vis.indexOf(c);
      c.style.setProperty('--d',(k<lead?0:(k-lead)%cols)*260+'ms');c.classList.add('shown','press-in');const done=ev=>{if(ev.target!==c||ev.animationName!=='menuReveal')return;c.classList.remove('press-in');c.removeEventListener('animationend',done)};c.addEventListener('animationend',done)}),{threshold:.01});
    vis.forEach(c=>pio.observe(c))};
  shape();press();
  addEventListener('resize',()=>requestAnimationFrame(shape),{passive:true});document.querySelectorAll('[data-filter-for="newsGrid"] button').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(()=>{shape();press()})));
  // story page: the header follows ?id= (the article body is the shared sample)
  const artTitle=document.querySelector('.art-hero h1');
  if(artTitle){const id=new URLSearchParams(location.search).get('id'),n=NEWS.find(s=>s.id===id)||NEWS[0];if(id&&n.id!==id)location.replace('news.html');
    const set=(el,en,vi)=>{if(!el)return;el.textContent=en;el.dataset.vi=vi};
    set(document.getElementById('artAudience'),AUD[n.aud][0],AUD[n.aud][1]);set(document.getElementById('artDate'),n.date,viDate(n.date));
    set(artTitle,n.t,n.tv);set(document.getElementById('artDek'),n.x,n.xv);
    const body=document.getElementById('artBody');if(body){body.innerHTML='';n.b.forEach(([en,vi])=>{const h=en.startsWith('## '),el=document.createElement(h?'h2':'p');el.textContent=h?en.slice(3):en;el.dataset.vi=h?vi.slice(3):vi;body.appendChild(el)});
      const note=document.getElementById('artSample');if(note)note.hidden=!n.mock}
    const im=document.getElementById('artImage');if(im)im.alt=n.alt||'';
    const img=document.getElementById('artImage');if(img)img.src=n.img.startsWith('http')?n.img.replace('w=1400','w=1800').replace('q=88','q=90'):n.img;
    const og=document.querySelector('meta[property="og:title"]');if(og)og.setAttribute('content',n.t);
    const tab=()=>{document.title=(root.lang==='vi'?n.tv:n.t)+' | XionTechs'};tab();document.addEventListener('xt-lang',tab)}

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

  /* ---------- sliders (Home case studies): drag with a mouse (touch scrolls natively), arrow keys step one card ---------- */
  document.querySelectorAll('.case-slider').forEach(cs=>{let down=false,moved=false,x0=0,s0=0;cs.querySelectorAll('.slot').forEach(s=>s.tabIndex=-1);cs.addEventListener('dragstart',e=>e.preventDefault());
    const shell=cs.closest('.case-shell');const ends=()=>{if(shell)shell.classList.toggle('at-end',cs.scrollLeft>=cs.scrollWidth-cs.clientWidth-4)};cs.addEventListener('scroll',()=>requestAnimationFrame(ends),{passive:true});addEventListener('resize',ends);ends();
    cs.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=cs.scrollLeft});
    cs.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-x0;if(!moved&&Math.abs(dx)>5){moved=true;cs.classList.add('dragging');cs.setPointerCapture(e.pointerId)}if(moved)cs.scrollLeft=s0-dx});
    const stop=()=>{if(!down)return;down=false;cs.classList.remove('dragging');setTimeout(()=>{moved=false},0)};
    cs.addEventListener('pointerup',stop);cs.addEventListener('pointercancel',stop);
    cs.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    cs.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;const c=cs.querySelector(':scope > .case-card');if(!c)return;e.preventDefault();
      const step=c.getBoundingClientRect().width+(parseFloat(getComputedStyle(cs).columnGap)||0);cs.scrollBy({left:e.key==='ArrowRight'?step:-step,behavior:reduce?'auto':'smooth'})});
    const dotsBox=(cs.closest('section')||document).querySelector('.case-dots'),cards=[...cs.querySelectorAll(':scope > .case-card')];
    if(dotsBox&&cards.length){let per=1,dots=[];
      const stepW=()=>cards[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(cs).columnGap)||0);
      const en=dotsBox.dataset.dotEn||'Case studies',vi=dotsBox.dataset.dotVi||'Case study';
      const label=(from,to)=>root.lang==='vi'?vi+' '+from+(to>from?' đến '+to:''):en+' '+from+(to>from?' to '+to:'');
      const build=force=>{const w=stepW();if(!w){dotsBox.hidden=true;return}const st=getComputedStyle(cs),visible=cs.clientWidth-parseFloat(st.paddingLeft)-parseFloat(st.paddingRight);
        const p2=Math.max(1,Math.floor((visible+1)/w)),pages=Math.max(1,Math.ceil(cards.length/p2));if(!force&&p2===per&&dots.length===pages){mark();return}
        const fi=dots.indexOf(document.activeElement);per=p2;dotsBox.innerHTML='';dotsBox.hidden=pages<2;
        dots=Array.from({length:pages},(_,p)=>{const b=document.createElement('button');b.type='button';b.className='case-dot';const from=p*per+1,to=Math.min(cards.length,from+per-1);
          b.setAttribute('aria-label',label(from,to));b.onclick=()=>cs.scrollTo({left:cards[Math.min(p*per,cards.length-1)].offsetLeft-cards[0].offsetLeft,behavior:reduce?'auto':'smooth'});dotsBox.appendChild(b);return b});
        mark();if(fi>=0)(dots[fi]||dots[dots.length-1]).focus()};
      const mark=()=>{if(!dots.length)return;const x=cs.scrollLeft,max=cs.scrollWidth-cs.clientWidth;let k=Math.round(x/(stepW()*per));if(x>=max-4)k=dots.length-1;
        k=Math.max(0,Math.min(k,dots.length-1));dots.forEach((d,i)=>d.setAttribute('aria-current',i===k?'true':'false'))};
      cs.addEventListener('scroll',()=>requestAnimationFrame(mark),{passive:true});addEventListener('resize',()=>build());document.addEventListener('xt-lang',()=>build(true));build(true)}
  });

  /* ---------- Careers: the event reel drifts past like the partner strip (ENH-041). It holds while the reader hovers or
     focuses it and stops with the pause button; with reduced motion it stays still and can be scrolled sideways instead. ---------- */
  const reel=document.querySelector('.reel');
  if(reel&&reel.closest('section')&&reel.closest('section').querySelector('.reel-toggle')){const track=reel.querySelector('.reel-track'),view=reel.querySelector('.reel-view'),originals=[...track.children],toggle=reel.closest('section').querySelector('.reel-toggle');
    if(reduce){toggle.hidden=true}else{
    // a second copy makes the loop seamless; hidden from screen readers and the keyboard, its labels follow the originals' language
    const clones=[...originals,...originals].map(n=>{const k=n.cloneNode(true);k.setAttribute('aria-hidden','true');k.tabIndex=-1;k.removeAttribute('href');
      k.querySelectorAll('[data-vi]').forEach(e=>e.removeAttribute('data-vi'));k.querySelectorAll('img').forEach(i=>i.removeAttribute('loading'));track.appendChild(k);return k});
    document.addEventListener('xt-lang',()=>requestAnimationFrame(()=>clones.forEach((k,i)=>{k.querySelector('.reel-label').textContent=originals[i%originals.length].querySelector('.reel-label').textContent})));
    const SPEED=34;let x=0,half=1,paused=false,hover=false,focus=false,inview=true,last=0,running=false;
    // one loop is exactly the distance from the first photo to its copy (gaps included)
    const measure=()=>{half=(clones[0].offsetLeft-originals[0].offsetLeft)||1};
    const moving=()=>!paused&&!hover&&!focus&&inview&&!document.hidden;
    const draw=()=>{if(!hover&&!focus){while(-x>=half)x+=half;while(x>0)x-=half}track.style.transform='translate3d('+x.toFixed(2)+'px,0,0)'};
    const frame=t=>{const dt=last?Math.min(.05,(t-last)/1000):0;last=t;x-=SPEED*dt;draw();if(moving())requestAnimationFrame(frame);else{running=false;last=0}};
    const kick=()=>{if(!running&&moving()){running=true;last=0;requestAnimationFrame(frame)}};
    const label=()=>{const vi=root.lang==='vi';toggle.setAttribute('aria-label',paused?(vi?'Tiếp tục ảnh':'Play the photos'):(vi?'Tạm dừng ảnh':'Pause the photos'));toggle.querySelector('i').className='ph '+(paused?'ph-play':'ph-pause')};
    toggle.addEventListener('click',()=>{paused=!paused;label();kick()});document.addEventListener('xt-lang',()=>requestAnimationFrame(label));
    view.addEventListener('mouseenter',()=>{hover=true});view.addEventListener('mouseleave',()=>{hover=false;kick()});
    // a photo reached by keyboard holds the reel and slides fully into view (the view itself never scrolls)
    view.addEventListener('scroll',()=>{view.scrollLeft=0});
    track.addEventListener('focusin',e=>{focus=true;const card=e.target.closest('.reel-card');if(!card)return;view.scrollLeft=0;const v=view.getBoundingClientRect(),r=card.getBoundingClientRect();
      if(r.left<v.left+16)x+=v.left+16-r.left;else if(r.right>v.right-16)x-=r.right-(v.right-16);draw()});
    track.addEventListener('focusout',e=>{if(!track.contains(e.relatedTarget)){focus=false;kick()}});
    document.addEventListener('visibilitychange',kick);
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{inview=es[0].isIntersecting;kick()}).observe(reel);
    addEventListener('resize',measure,{passive:true});addEventListener('load',measure);track.querySelectorAll('img').forEach(i=>i.addEventListener('load',measure));
    measure();kick()}}

  /* ---------- Careers: the Growth Learning Model. The dot travels once round the ring when it comes into view, lighting
     each step in turn, and rests on the last; with reduced motion it simply shows the first step. ---------- */
  const cyc=document.querySelector('.cycle-stage');
  if(cyc){const nodes=[...cyc.querySelectorAll('.cycle-node')],dot=cyc.querySelector('.cycle-dot');
    const at=a=>'rotate('+a+'deg) translateX(var(--cycle-radius)) rotate('+(-a)+'deg)';
    const go=i=>{dot.style.transform=at(+nodes[i].dataset.angle);nodes.forEach((n,k)=>n.classList.toggle('current',k===i))};
    // the dot starts on the ring at the first step with no animation; only the later steps travel
    dot.style.transition='none';go(0);void dot.offsetWidth;requestAnimationFrame(()=>{dot.style.transition=''});
    if(!reduce&&'IntersectionObserver' in window){let ran=false;const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting||ran)return;ran=true;io.disconnect();
      let i=0;const next=()=>{if(++i<nodes.length){go(i);setTimeout(next,2600)}};setTimeout(next,1200)},{threshold:.4});io.observe(cyc)}}
  /* ---------- Careers: flip cards (click, tap, Enter or Space) ---------- */
  document.querySelectorAll('.flip-card').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.classList.toggle('flipped',on);
    // only the face on show is read out
    b.querySelector('.flip-front')?.setAttribute('aria-hidden',String(on));b.querySelector('.flip-back')?.setAttribute('aria-hidden',String(!on))}));

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
  if(!reduce)document.querySelectorAll('[data-count]').forEach(el=>{if(el.dataset.count===''||isNaN(+el.dataset.count))return;show(el,0);sio.observe(el)});

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

  /* ---------- Services: the Eight services panel starts a fixed gap below the hero panel, whatever the cards' height ---------- */
  const svcHero=document.querySelector('.svc-hero'),svcCards=document.querySelector('.svc-metrics'),svcPanel=document.querySelector('.svc-panel');
  if(svcHero&&svcCards&&svcPanel){const GAP=28,fitPanels=()=>{svcPanel.style.marginTop='';svcPanel.style.paddingTop='';svcCards.style.marginTop='';
      // the cards sit centred across the gap, but never higher than the hero's bottom space allows
      const ch=svcCards.getBoundingClientRect().height,room=parseFloat(getComputedStyle(svcHero).paddingBottom)-72;svcCards.style.marginTop=-Math.round(Math.min(ch/2-GAP/2,room))+'px';
      const ov=Math.max(0,Math.round(svcCards.getBoundingClientRect().bottom-svcHero.getBoundingClientRect().bottom-GAP));
      svcPanel.style.marginTop=-ov+'px';svcPanel.style.paddingTop=(ov+(innerWidth>640?140:96))+'px'};
    fitPanels();addEventListener('resize',fitPanels,{passive:true});addEventListener('load',fitPanels);document.addEventListener('xt-lang',()=>requestAnimationFrame(fitPanels));
    if('ResizeObserver' in window){let lastH=0;new ResizeObserver(es=>{const h=Math.round(es[0].contentRect.height);if(h!==lastH){lastH=h;requestAnimationFrame(fitPanels)}}).observe(svcCards)}if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitPanels)}

  /* ---------- Products, Services, News and Careers: one background colour flowing down the page ---------- */
  // Every section in <main> gets a phase from its place in the page, so a new section extends the flow on its own:
  // the first is white with amber dots, the middle ones warm up to bright amber, then ease from
  // halfway down their second-to-last card into light blue and on into the dark sections; the last three are dark blue, deepening
  // into the footer's colour. data-flow="light|rise|night|blue|deep" on a section overrides it.
  // The gradient is drawn once for the whole page (and again when the layout changes), so scrolling stays smooth.
  // the page colour at a point down the page, so things on top can switch to navy where the colour turns amber
  let flowStops=[];
  const onAmber=yDoc=>{if(flowStops.length<2)return false;let i=flowStops.findIndex(s=>s[0]>=yDoc);if(i<=0)i=Math.max(1,i<0?flowStops.length-1:1);
    const [y0,c0]=flowStops[i-1],[y1,c1]=flowStops[i],t=Math.min(1,Math.max(0,(yDoc-y0)/Math.max(1,y1-y0)));
    const h=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)),A=h(c0),B=h(c1),m=A.map((v,k)=>v+(B[k]-v)*t);
    // saturated yellow: red and green well above blue
    return Math.min(m[0],m[1])-m[2]>90};
  // the page colour's relative luminance at a point, so text can pick the colour that stays readable
  const lumAt=yDoc=>{if(flowStops.length<2)return 1;let i=flowStops.findIndex(s=>s[0]>=yDoc);if(i<=0)i=Math.max(1,i<0?flowStops.length-1:1);
    const [y0,c0]=flowStops[i-1],[y1,c1]=flowStops[i],t=Math.min(1,Math.max(0,(yDoc-y0)/Math.max(1,y1-y0)));
    const h=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)),A=h(c0),B=h(c1);
    const ch=A.map((v,k)=>(v+(B[k]-v)*t)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*ch[0]+.7152*ch[1]+.0722*ch[2]};
  const flowBg=document.querySelector('.flow-bg');
  if(flowBg){
    root.classList.add('flow-js');
    const C={white:'#FFFFFF',plat:'#F3F5F7',cream:'#F4EBC6',sun:'#F6D96F',amber:'#F6C30A',ice:'#C9D5E6',frost:'#AFBED4',steel:'#5F7394',slate:'#33476A',dusk:'#1C2A46',navy:'#12284C',prussian:'#0D1930',ink:'#0B1730'};
    const phaseOf=(i,n)=>i===0?'light':i===n-1?'deep':i===n-2?'blue':i===n-3?'night':'rise';
    const Y=el=>el.getBoundingClientRect().top+scrollY,B=el=>el.getBoundingClientRect().bottom+scrollY;
    const measure=()=>{const secs=[...document.querySelectorAll('main > section')].filter(s=>s.offsetParent),n=secs.length;if(!n)return;
      const pal=flowBg.dataset.palette;
      secs.forEach((s,i)=>{s.dataset.flowPhase=s.dataset.flow||(pal?(i===0?'light':'rise'):phaseOf(i,n))});
      flowBg.style.height='0';const O=flowBg.getBoundingClientRect().top+scrollY,H=document.documentElement.scrollHeight-O;
      const list=[],add=(y,c)=>{y=Math.round(y-O);if(!list.length||y>list[list.length-1][0])list.push([y,c])},glows=[];
      const rise=secs.filter(s=>s.dataset.flowPhase==='rise'),rTop=rise.length?Y(rise[0]):0;
      if(pal==='home'){
        // home: one layer from the hero to the footer. The hero's navy carries on behind Our partners and Why XionTechs (white
        // text); Work built with our partners starts at a normal blue behind its heading and lightens behind its cards, so
        // How we approach sits on light blue (navy text); What we build eases to the soft blue the news starts with, and the
        // news and contact form keep the colours they had (soft blue into amber), now drawn in the same layer so no edge shows.
        const W=innerWidth>=980,R=W?420:220,dark=secs.filter(s=>s.dataset.flow==='night'),lastDark=dark[dark.length-1];
        const news=document.querySelector('[aria-labelledby="news-h"]'),contact=document.getElementById('contact');
        add(Y(secs[0]),'#0B1730');
        const P=['#163663','#163663','#1A3C70'];
        dark.forEach((s,k)=>{if(s!==lastDark)add(B(s),P[Math.min(k,P.length-1)])});
        // the last dark section: blue behind its heading, then lightening behind its cards
        if(lastDark){const head=lastDark.querySelector('.sec-head,.sec-head-row'),hb=head?B(head)+24:Y(lastDark)+260;
        add(hb,'#24497F');add(B(lastDark)-40,'#BFD0E8')}
        const after=secs.slice(lastDark?secs.indexOf(lastDark)+1:1).filter(s=>s!==news&&s!==contact);
        after.forEach((s,k)=>{if(k===0)add(Y(s)+(B(s)-Y(s))*.3,'#DCE6F5');add(B(s),'#EEF2F9')});
        if(news){add(B(news),'#F4F7FC')}
        if(contact){const t=Y(contact),h=B(contact)-t;add(t+h*.22,'#FDF3D6');add(t+h*.55,'#FCE6A8');add(B(contact),'#FFD84A')}
        secs.forEach((s,i)=>{if(i===0||s===news||s===contact)return;const t=Y(s),h=B(s)-t,isDark=s.dataset.flow==='night',l=i%2===1;
          glows.push([l?6:94,t+h*.35,R,isDark?.16:.28,'255 192 0']);if(!isDark&&s!==after[after.length-1])glows.push([l?92:8,t+h*.6,R*.9,.6,'255 255 255'])});
        glows.push([100,Y(secs[0]),Math.round((B(secs[0])-Y(secs[0]))*.9),.16,'255 192 0']);
      }else
      if(pal==='mesh'){
        // mesh (Services): the hero and Eight services are rounded panels with their own colours; around and below them the
        // page is a soft light blue that turns white at the end, with white and amber glows that stop before the white end.
        const W=innerWidth>=980,R=W?400:210,last=secs[n-1],end=B(last),top=Y(secs[0]);
        add(top,'#EEF2F9');
        const out=document.getElementById('outcomes'),proc=document.getElementById('process');
        if(out)add(Y(out),'#E6EEF9');if(proc)add(Y(proc)+(B(proc)-Y(proc))*.35,'#DCE6F5');
        add(end-(end-top)*.08,'#F7F9FD');add(end,'#FFFFFF');
        [out,proc].filter(Boolean).forEach((s,k)=>{const t=Y(s),h=B(s)-t,l=k%2===0;
          glows.push([l?6:94,t+h*.3,R,.4,'255 192 0'],[l?92:8,t+h*.6,R*.9,.85,'255 255 255'])});
      }else
      if(pal){
        // Every section after the hero, the email band included, shares one gradient, so nothing sits in its own box.
        // warm (Services): white into amber and back to a warm cream; nothing blue.
        // cool (News): white with light blue shading drifting through the whole page, hero included.
        // pastel (Careers): light blue at the top, white through the middle, warm amber towards the footer.
        const first=secs[0],mid=secs.slice(1),a=mid.length?Y(mid[0]):B(first),z=mid.length?B(mid[mid.length-1]):a;
        add(Y(first),pal==='pastel'?'#DCE6F5':C.white);add(B(first),pal==='cool'?'#F7FAFE':pal==='soft'?C.white:pal==='pastel'?'#E8EFF9':C.plat);
        glows.push([14,Y(first)+(B(first)-Y(first))*.45,380,pal==='cool'?.07:pal==='pastel'?.1:.16,pal==='cool'||pal==='pastel'?'63 102 160':'246 195 10']);
        const path=pal==='soft'?[[0,C.white],[1,C.white]]:pal==='pastel'?[[0,'#E8EFF9'],[.28,'#F5F8FD'],[.45,'#FFFFFF'],[.7,'#FFF5D9'],[1,'#FFE7A3']]
          :pal==='warm'?[[0,C.plat],[.16,C.cream],[.36,C.sun],[.52,C.amber],[.7,C.sun],[.86,C.cream],[1,'#FFF3D0']]
          :[[0,'#F7FAFE'],[.22,'#EEF4FC'],[.45,'#E6EEF9'],[.68,'#F0F5FC'],[.86,'#E7EFF9'],[1,'#E1EAF7']];
        path.forEach(([f,c])=>add(a+(z-a)*f,c));
        if(pal==='cool'){for(let k=0;k<5;k++)glows.push([k%2?86:10,a+(z-a)*(.08+k*.21),460,.07,'63 102 160'])}
        // soft (Services): white, with large pale amber washes drifting in from alternate sides
        else if(pal==='soft'){for(let k=0;k<4;k++)glows.push([k%2?96:2,a+(z-a)*(.06+k*.28),620,.16,'246 195 10'])}
        else glows.push([86,a+(z-a)*(pal==='pastel'?.82:.3),360,pal==='pastel'?.1:.12,'246 195 10']);
      }else
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
      const img=glows.map(([x,y,r,a,c])=>'radial-gradient(circle '+r+'px at '+x+'% '+Math.round(y-O)+'px,rgb('+(c||'246 195 10')+' / '+a+') 0,transparent 100%)').concat('linear-gradient('+space+','+list.map(([y,c])=>c+' '+y+'px').join(',')+')').join(',');
      flowBg.style.height=H+'px';flowBg.style.backgroundImage=img;root.style.setProperty('--flow-page',img);
      flowStops=list.map(([y,c])=>[y+O,c]);
      dispatchEvent(new Event('scroll'))};
    let mt=0;const later=()=>{cancelAnimationFrame(mt);mt=requestAnimationFrame(measure)};
    addEventListener('resize',later,{passive:true});addEventListener('load',later);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
    if('ResizeObserver' in window)new ResizeObserver(later).observe(document.querySelector('main'));
    measure();
  }

  /* ---------- Products: the tab bar and the card dividers turn navy where the background is amber ---------- */
  const audBar=document.querySelector('.aud-nav'),stackCards=[...document.querySelectorAll('.pstack .pcard')];
  if(audBar&&flowBg){const tone=()=>{const r=audBar.getBoundingClientRect(),y=r.top+r.height/2+scrollY,fr=flowBg.getBoundingClientRect();
      audBar.style.backgroundImage='var(--flow-page)';audBar.style.backgroundSize=fr.width+'px '+fr.height+'px';audBar.style.backgroundPosition=(fr.left-r.left)+'px '+(fr.top-r.top)+'px';audBar.classList.toggle('on-amber',onAmber(y));
      // dark amber (#8A6700, luminance .15) only where it keeps 4.5:1; navy everywhere else
      audBar.classList.toggle('amber-ok',(lumAt(y)+.05)/(.151+.05)>=4.5);
      stackCards.forEach(c=>{const t=c.getBoundingClientRect().top+scrollY;c.classList.toggle('on-amber',onAmber(t))})};
    let tq=false;addEventListener('scroll',()=>{if(tq)return;tq=true;requestAnimationFrame(()=>{tone();tq=false})},{passive:true});addEventListener('resize',tone,{passive:true});tone()}

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

  /* ---------- About: the mountain story. Scrolling through the held story moves through its chapters and climbs the mountain ---------- */
  const mtn=document.querySelector('.mtn');
  if(mtn){
    const chs=[...mtn.querySelectorAll('.mtn-ch')],dots=[...mtn.querySelectorAll('.mtn-dots span')],pin=mtn.querySelector('.mtn-pin'),
      targets=chs.map((c,i)=>chs.length>1?i/(chs.length-1):0),path=[[20,69.5],[28,65.5],[38.7,54.2],[43.3,47],[47.3,45],[53.3,35.5],[52.8,30],[55.5,25],[58.4,19.4]];
    let p=0,frame=0,active=-1;
    const draw=(v,i)=>{p=Math.min(1,Math.max(0,v));mtn.style.setProperty('--mtn',p.toFixed(4));
      const f=p*(path.length-1),j=Math.min(path.length-2,Math.floor(f)),q=f-j;
      mtn.style.setProperty('--mx',(path[j][0]+(path[j+1][0]-path[j][0])*q)+'%');mtn.style.setProperty('--my',(path[j][1]+(path[j+1][1]-path[j][1])*q)+'%');
      mtn.classList.toggle('at-top',p>.985);
      if(i!==active){active=i;mtn.classList.toggle('is-late',i>=(mtn.dataset.late!=null?+mtn.dataset.late:3));chs.forEach((c,n)=>c.classList.toggle('on',n===i));dots.forEach((d,n)=>d.classList.toggle('on',n===i))}};
    const stop=()=>{cancelAnimationFrame(frame);frame=0};
    const travel=i=>{stop();const from=p,to=targets[i],dist=Math.abs(to-from);draw(from,i);
      if(reduce||dist<.001){draw(to,i);return}
      const t0=performance.now(),dur=1400+dist*3000;
      const tick=t=>{const f=Math.min(1,(t-t0)/dur),e=f<.5?4*f*f*f:1-Math.pow(-2*f+2,3)/2;draw(from+(to-from)*e,i);frame=f<1?requestAnimationFrame(tick):0};
      frame=requestAnimationFrame(tick)};
    // each chapter takes an equal share of the held scroll (measured from where it starts to stick, under the header); scrolling back up
    // goes back down. On short screens nothing is held, so a chapter takes over once its heading is 60% of the way down the screen. No timer, no autoplay
    const onScroll=instant=>{let k;
      const cs=getComputedStyle(pin);
      if(cs.position==='sticky'){const run=Math.max(1,mtn.offsetHeight-pin.offsetHeight),prog=(parseFloat(cs.top)-mtn.getBoundingClientRect().top)/run;k=Math.max(0,Math.min(chs.length-1,Math.floor(prog*chs.length)))}
      else{k=0;chs.forEach((c,i)=>{if(c.querySelector('.mtn-title').getBoundingClientRect().top<innerHeight*.6)k=i})}
      // when the page opens (or reloads) part-way down, show that chapter straight away instead of replaying the climb
      if(instant===true){stop();draw(targets[k],k);return}
      if(k!==active)travel(k)};
    let mt=false;addEventListener('scroll',()=>{if(mt)return;mt=true;requestAnimationFrame(()=>{onScroll();mt=false})},{passive:true});
    addEventListener('resize',onScroll,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&active>=0){stop();draw(targets[active],active)}});
    draw(0,0);onScroll(true);addEventListener('load',()=>onScroll(true),{once:true});
  }

  /* ---------- office clocks ---------- */
  function clocks(){document.querySelectorAll('[data-tz]').forEach(el=>{try{el.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:el.dataset.tz}).format(new Date())}catch(e){}})}
  clocks();setInterval(clocks,30000);

  /* ---------- email capture (prototype: nothing is sent) ---------- */
  const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll('.cap-form').forEach(f=>{const inp=f.querySelector('input[type=email]'),err=f.querySelector('.err');
    if(inp&&err){if(!err.id)err.id='cap-err-'+Math.random().toString(36).slice(2,8);inp.setAttribute('aria-describedby',err.id)}
    f.addEventListener('submit',e=>{e.preventDefault();const v=inp.value.trim();
      if(!EMAIL.test(v)){err.hidden=false;inp.setAttribute('aria-invalid','true');inp.focus();return}
      err.hidden=true;inp.removeAttribute('aria-invalid');
      if(f.dataset.mode==='demo'||f.dataset.mode==='project'){sess.set('xt3-demo-email',v);location.href='demo.html#'+(f.dataset.mode==='project'?'project':'form')}else{f.classList.add('done');const ok=f.querySelector('.cap-ok');if(ok)ok.focus()}});
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
      setTimeout(()=>{card.classList.add('sent');card.scrollIntoView({block:'center'});const ok=card.querySelector('.form-ok');if(ok){ok.tabIndex=-1;ok.focus({preventScroll:true})}},900)})}

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
    const col={light:[a=>`rgba(22,54,99,${a})`,'rgba(230,173,0,.55)'],navy:[a=>`rgba(170,195,235,${a*.9})`,'rgba(255,192,0,.6)'],cool:[a=>`rgba(22,54,99,${a})`,'rgba(63,102,160,.5)'],warm:[a=>`rgba(176,122,0,${a})`,'rgba(240,179,0,.55)'],amber:[a=>`rgba(255,255,255,${a*2.4})`,'rgba(22,54,99,.35)']}[tone];
    function draw(t){ctx.clearRect(0,0,W,H);const N=54,S=46;
      for(let i=0;i<N;i++){const k=i/(N-1)-.5,acc=i%9===4;ctx.beginPath();
        for(let j=0;j<=S;j++){const u=j/S,x=-.08*W+u*1.16*W,cy=H*(.92-.62*u)+H*.07*Math.sin(u*3.2+t*.25),sp=H*.2*(.35+.65*Math.pow(Math.sin(u*Math.PI*.95+.2),2)),y=cy+k*sp*Math.cos(u*4.2+t*.45+k*.9);j?ctx.lineTo(x,y):ctx.moveTo(x,y)}
        ctx.strokeStyle=acc?col[1]:col[0](.06+.12*(1-Math.abs(k)*2));ctx.lineWidth=acc?1.2:1;ctx.stroke()}}
    const loop=now=>{const s=(now-t0)/1000;tHold=reduce?4:Math.min(s,5)+4;if(vis)draw(tHold);if(!reduce&&s<5)requestAnimationFrame(loop)};
    new ResizeObserver(()=>{size();draw(tHold)}).observe(cv);new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cv);size();requestAnimationFrame(loop)});
  if(location.hash)addEventListener('load',()=>{let t=null;try{t=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(e){}
    if(t)(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{const off=t.getBoundingClientRect().top-(parseFloat(getComputedStyle(t).scrollMarginTop)||0);if(Math.abs(off)>24)t.scrollIntoView()})});
})();
