// Basic helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // 1) Tab switching
  const tabs = $$('.menu-item');
  const sections = $$('.tab-content');
  const showTab = id => {
    sections.forEach(s => s.id === id ? s.classList.remove('hidden') : s.classList.add('hidden'));
    tabs.forEach(t => t.dataset.target === id ? t.classList.add('active') : t.classList.remove('active'));
    // trigger animations when projects tab opens
    if(id === 'projects') startProjectAnimations();
  };
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.target)));
  showTab('home'); // default

  // set copyright year
  $('#year').textContent = new Date().getFullYear();

  // 2) Typewriter effect on home
  (function typewriterHome(){
    const el = document.getElementById('typewriter');
    if(!el) return;
    const txt = el.textContent;
    el.textContent = '';
    let i=0;
    const t = setInterval(()=>{ el.textContent += txt[i++] || ''; if(i>txt.length) clearInterval(t); }, 40);
  })();

  // 3) Carousel (auto + buttons)
  (function carousel(){
    const slides = $$('.slide');
    if(!slides.length) return;
    let idx = 0;
    const show = n => {
      slides.forEach((s,i)=> s.classList.toggle('active', i===n));
    };
    show(idx);
    const next = () => { idx = (idx+1) % slides.length; show(idx); };
    const prev = () => { idx = (idx-1+slides.length) % slides.length; show(idx); };
    $('#carousel .next')?.addEventListener('click', next);
    $('#carousel .prev')?.addEventListener('click', prev);
    let auto = setInterval(next, 4000);
    // pause on hover
    $('#carousel')?.addEventListener('mouseenter', ()=> clearInterval(auto));
    $('#carousel')?.addEventListener('mouseleave', ()=> auto=setInterval(next,4000));
  })();

  // 4) Filterable gallery & modal
  (function galleryFilterModal(){
    const buttons = $$('.filter-btn');
    const cards = $$('.gallery .card');
    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const f = btn.dataset.filter;
        cards.forEach(card => card.style.display = (f==='all' || card.dataset.category===f) ? '' : 'none');
      });
    });

    // modal
    const modal = $('#modal');
    const modalImg = $('#modal-img');
    const modalDesc = $('#modal-desc');
    const modalClose = $('#modal-close');
    cards.forEach(card => {
      card.addEventListener('click', ()=> {
        const img = card.querySelector('img')?.src;
        const text = card.querySelector('p')?.textContent || '';
        modalImg.src = img || '';
        modalDesc.textContent = text;
        modal.classList.remove('hidden');
      });
    });
    modalClose?.addEventListener('click', ()=> modal.classList.add('hidden'));
    modal.addEventListener('click', e => { if(e.target === modal) modal.classList.add('hidden'); });
  })();

  // 5) Animated metrics and progress bars (trigger when projects tab visible)
  function startProjectAnimations(){
    // progress bars on home (skills)
    $$('.progress').forEach(p => {
      const fill = p.querySelector('.progress-fill');
      const pct = +p.dataset.percent || 60;
      fill.style.width = pct + '%';
    });
    // metrics counters
    $$('.metric-num').forEach(el => {
      const target = +el.dataset.target || 0;
      el.textContent = '0';
      let cur = 0;
      const step = Math.max(1, Math.floor(target/60));
      const timer = setInterval(()=> {
        cur += step;
        if(cur >= target){ el.textContent = target; clearInterval(timer); }
        else el.textContent = cur;
      }, 20);
    });
    // mini typewriter in projects
    const tpEl = document.getElementById('typewriter-project');
    if(tpEl){
      const txt = "Click a gallery item to open the lightbox. Filter projects by category.";
      tpEl.textContent = ''; let i=0;
      const t = setInterval(()=>{ tpEl.textContent += txt[i++] || ''; if(i>txt.length) clearInterval(t); }, 24);
    }
  }

  // Theme toggle (small extra interactive)
  $('#theme-toggle')?.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    // simple color switch
    if(document.documentElement.classList.contains('dark')){
      document.documentElement.style.setProperty('--bg','#121212');
      document.documentElement.style.setProperty('--text','#eee');
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--text');
    }
  });
});