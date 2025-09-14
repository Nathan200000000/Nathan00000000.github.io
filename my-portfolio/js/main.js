const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = $$('.menu-item');
  const sections = $$('.tab-content');
  const showTab = id => {
    sections.forEach(s => s.id === id ? s.classList.remove('hidden') : s.classList.add('hidden'));
    tabs.forEach(t => t.dataset.target === id ? t.classList.add('active') : t.classList.remove('active'));
    if (id === 'projects') startProjectAnimations();
  };
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.target)));
  showTab('home');

  // Set current year
  $('#year').textContent = new Date().getFullYear();

  // Typewriter effect (Home)
  (function typewriterHome() {
    const el = $('#typewriter');
    if (!el) return;
    const txt = "Web developer • problem solver • learner";
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += txt[i++] || '';
      if (i > txt.length) clearInterval(t);
    }, 40);
  })();

  // Carousel
  (function carousel() {
    const slides = $$('.slide');
    if (!slides.length) return;
    let idx = 0;
    const show = n => slides.forEach((s, i) => s.classList.toggle('active', i === n));
    show(idx);
    const next = () => { idx = (idx + 1) % slides.length; show(idx); };
    const prev = () => { idx = (idx - 1 + slides.length) % slides.length; show(idx); };
    $('#carousel .next')?.addEventListener('click', next);
    $('#carousel .prev')?.addEventListener('click', prev);
    let auto = setInterval(next, 4000);
    $('#carousel')?.addEventListener('mouseenter', () => clearInterval(auto));
    $('#carousel')?.addEventListener('mouseleave', () => auto = setInterval(next, 4000));
  })();

  // Gallery filter & modal
  (function galleryFilterModal() {
    const buttons = $$('.filter-btn');
    const cards = $$('.gallery .card');
    const modal = $('#modal');
    const modalImg = $('#modal-img');
    const modalDesc = $('#modal-desc');
    const modalClose = $('#modal-close');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        cards.forEach(card => {
          card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
        });
      });
    });

    cards.forEach(card => {
      card.addEventListener('click', () => {
        modalImg.src = card.querySelector('img')?.src || '';
        modalDesc.textContent = card.querySelector('p')?.textContent || '';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };
    modalClose?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (!e.target.closest('.modal-inner')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });
  })();

  // Project animations
  function startProjectAnimations() {
    $$('.progress').forEach(p => {
      const fill = p.querySelector('.progress-fill');
      fill.style.width = (p.dataset.percent || 60) + '%';
    });
    $$('.metric-num').forEach(el => {
      const target = +el.dataset.target || 0;
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = cur;
        }
      }, 20);
    });
    const tpEl = $('#typewriter-project');
    if (tpEl) {
      const txt = "Click a gallery item to open the lightbox. Filter projects by category.";
      tpEl.textContent = '';
      let i = 0;
      const t = setInterval(() => {
        tpEl.textContent += txt[i++] || '';
        if (i > txt.length) clearInterval(t);
      }, 24);
    }
  }

  // Theme toggle
  const root = document.documentElement;
  const toggleTheme = () => {
    const dark = root.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };
  $('#theme-toggle')?.addEventListener('click', toggleTheme);
  if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Optional: stop observing once revealed
      }
    });
  }, {
    threshold: 0.1
  });
  revealEls.forEach(el => obs.observe(el));
});