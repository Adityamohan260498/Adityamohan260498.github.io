// Returning from a project page: land exactly on the card that was clicked.
// Reveal animations are force-completed first, otherwise the target is still
// translated/transparent and the browser anchors to the wrong offset.
(function () {
  if (!location.hash) return;
  var target = document.querySelector(location.hash);
  if (!target) return;
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  var html = document.documentElement;
  var prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';            // no smooth-scroll on arrival
  requestAnimationFrame(function () {
    target.scrollIntoView({ block: 'center' });
    html.style.scrollBehavior = prev;
  });
})();

// Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
  });

  // Hero particles — subtle floating dots and connecting lines
  (function() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 45;
    const CONNECT_DIST = 120;

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(199, 140, 60, ${0.08 * (1 - dist/CONNECT_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(199, 140, 60, 0.25)';
        ctx.fill();
        // Move
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); draw();
  })();

// ── Project card hover previews ────────────────────────────────────────────
// Frames 2+ carry data-src rather than src, so the landing page only fetches
// one thumbnail per card. The rest are hydrated on first hover / focus / touch.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.pc-preview').forEach(function (box) {
    var frames = Array.prototype.slice.call(box.querySelectorAll('img'));
    var dots   = Array.prototype.slice.call(box.querySelectorAll('.pc-dots i'));
    var video  = box.querySelector('video');
    if (frames.length < 2 && !video) return;

    var card = box.closest('.project-card');
    if (!card) return;

    var idx = 0, timer = null, hydrated = false;
    var period = parseInt(box.getAttribute('data-interval'), 10) || 1100;

    function hydrate() {
      if (hydrated) return;
      hydrated = true;
      frames.forEach(function (img) {
        var d = img.getAttribute('data-src');
        if (d) { img.src = d; img.removeAttribute('data-src'); }
      });
    }

    function show(n) {
      if (frames.length < 2) return;
      frames[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('on');
      idx = (n + frames.length) % frames.length;
      frames[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('on');
    }

    function start() {
      hydrate();
      if (reduce) return;           // stills only, and the video stays hidden
      if (video) {
        // src is held in data-src so the landing page never fetches the clip
        // until someone actually hovers the card.
        var vs = video.getAttribute('data-src');
        if (vs) { video.src = vs; video.removeAttribute('data-src'); }
        video.classList.add('playing');
        var pp = video.play();
        if (pp && pp.catch) pp.catch(function () {});   // autoplay blocked: keep stills
      }
      if (timer) return;
      timer = setInterval(function () { show(idx + 1); }, period);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      if (video) {
        video.classList.remove('playing');
        video.pause();
        try { video.currentTime = 0; } catch (e) {}
      }
      show(0);                      // always rest on the first frame
    }

    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', start);
    card.addEventListener('blur', stop);
    card.addEventListener('touchstart', hydrate, { passive: true });
  });
})();
