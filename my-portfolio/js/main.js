const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // === TAB SWITCHING ===
  const tabs = $$('.menu-item');
  const sections = $$('.tab-content');
  const showTab = id => {
    sections.forEach(s =>
      s.id === id ? s.classList.remove('hidden') : s.classList.add('hidden')
    );
    tabs.forEach(t => {
      const active = t.dataset.target === id;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    if (id === 'projects') startProjectAnimations();
  };
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.target)));
  showTab('home');

  // === CURRENT YEAR ===
  $('#year').textContent = new Date().getFullYear();

  // === TYPEWRITER (HOME) ===
  (function typewriterHome() {
    const el = $('#typewriter-main'); // ✅ match updated HTML
    if (!el) return;
    const txt = "Web developer • problem solver • learner";
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += txt[i++] || '';
      if (i > txt.length) clearInterval(t);
    }, 40);
  })();

  // === CAROUSEL ===
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

  // === GALLERY FILTER & MODAL ===
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
        const img = card.querySelector('img');
        modalImg.src = img?.src || 'images/fallback.jpg';
        modalImg.alt = img?.alt || 'Project image';
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

  // === PROJECT ANIMATIONS ===
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

  // === THEME TOGGLE ===
  $('#theme-toggle')?.addEventListener('click', () => {
    const dark = root.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
  if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');

  // === TIME CAPSULE / CYBERPUNK TOGGLE ===
  $('#time-capsule-toggle')?.addEventListener('click', () => {
    const body = document.body;
    const isCyber = body.classList.contains('cyberpunk');
    // ✅ Proper toggle between the two
    body.classList.toggle('cyberpunk', !isCyber);
    body.classList.toggle('time-capsule', isCyber);
  });

  // === AI AVATAR ===
  (function aiAvatar() {
    const avatar = $('#ai-avatar');
    const bubble = avatar?.querySelector('.speech-bubble');
    if (!avatar || !bubble) return;
    const phrases = [
      "Need help with a project?",
      "Ask me about my skills!",
      "Want to see something cool?",
      "Try saying 'Go to Projects'"
    ];
    let i = 0;
    setInterval(() => {
      bubble.textContent = phrases[i++ % phrases.length];
    }, 4000);
  })();

  // === VOICE NAVIGATION ===
  (function voiceNav() {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = e => {
      const command = e.results[0][0].transcript.toLowerCase();
      if (command.includes('home')) showTab('home');
      if (command.includes('projects')) showTab('projects');
      if (command.includes('info')) showTab('info');
      if (command.includes('about')) showTab('about');
    };
    document.addEventListener('keydown', e => {
      if (e.key === 'v') recognition.start();
    });
  })();

  // === LIVE CODE EDITOR ===
  (function liveEditor() {
    const input = $('#code-input');
    const output = $('#code-output');
    if (!input || !output) return;
    const updateOutput = () => {
      const html = input.value;
      const blob = new Blob([html], { type: 'text/html' });
      output.src = URL.createObjectURL(blob);
    };
    input.addEventListener('input', updateOutput);
    updateOutput();
  })();

  // === TILT EFFECTS ===
  (function tiltCards() {
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y / rect.height - 0.5) * -20;
        const rotateY = (x / rect.width - 0.5) * 20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  })();

  // === CANVAS BACKGROUND ===
  (function animatedCanvas() {
    const canvas = $('#background-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: Math.random() * 0.5 + 0.2
    }));
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#00ffe7';
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.x -= s.dx;
        if (s.x < 0) {
          s.x = w;
          s.y = Math.random() * h;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
  })();

  // === REVEAL ON SCROLL ===
  const revealEls = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => obs.observe(el));

  // === REVEAL FALLBACK ===
  window.addEventListener('load', () => {
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
});