/* ============================================
   PORTFOLIO WEBSITE — MAIN SCRIPT
============================================ */

// ─── LOADER ──────────────────────────────────
(function () {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    progress.style.width = pct + '%';
    if (pct === 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startParticles();
        animateCounters();
      }, 300);
    }
  }, 80);
  document.body.style.overflow = 'hidden';
})();


// ─── CUSTOM CURSOR ────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function rafCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(rafCursor);
}
rafCursor();


// ─── NAVBAR ──────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav on scroll
function updateActiveNav() {
  const sections = ['home','about','skills','projects','contact'];
  const scrollY = window.scrollY + 200;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.getElementById('nav-' + id);
    if (!el || !link) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}


// ─── PARTICLE CANVAS ──────────────────────────
function startParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connecting lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}


// ─── SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger sibling reveals
function staggerReveal() {
  ['skills-grid','projects-grid'].forEach(cls => {
    const container = document.querySelector('.' + cls);
    if (!container) return;
    container.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });
}
staggerReveal();
revealEls.forEach(el => revealObs.observe(el));


// ─── COUNTER ANIMATION ────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
    }, 25);
  });
}


// ─── PROFICIENCY BARS ─────────────────────────
const profObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.prof-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      profObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const profSection = document.querySelector('.proficiency');
if (profSection) profObs.observe(profSection);


// ─── PROJECT FILTER ───────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    projectCards.forEach((card, i) => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.style.animation = '';
      if (show) {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.animation = `fadeInUp 0.4s ${i * 60}ms both`;
        }, 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject fadeInUp keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);


// ─── TESTIMONIAL SLIDER ───────────────────────
(function () {
  const track = document.getElementById('testimonial-track');
  const dots  = document.querySelectorAll('.t-dot');
  const prev  = document.getElementById('t-prev');
  const next  = document.getElementById('t-next');
  if (!track) return;
  const count = track.children.length;
  let idx = 0;

  function go(n) {
    idx = (n + count) % count;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  // Auto-play
  let auto = setInterval(() => go(idx + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => { auto = setInterval(() => go(idx + 1), 5000); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? idx + 1 : idx - 1);
  });
})();


// ─── CONTACT FORM ─────────────────────────────
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const btnText = document.getElementById('btn-send-text');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('input-name').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const msg   = document.getElementById('input-message').value.trim();
    if (!name || !email || !msg) return;

    // Simulate sending
    btnText.textContent = 'Sending...';
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btnText.textContent = 'Send Message 🚀';
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });
}


// ─── FOOTER YEAR ─────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ─── SMOOTH SCROLL (btn clicks) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});


// ─── PARALLAX HERO ORBS ───────────────────────
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
    const factor = (i + 1) * 12;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});


// ─── SKILL CARD TILT ────────────────────────
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * 5;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) * -5;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ─── TYPING EFFECT (Hero) ───────────────────
(function () {
  const el = document.querySelector('.hero-title');
  if (!el) return;
  // Already rendered; just add a blinking caret via CSS class
  // This effect cycles through role descriptions
  const roles = ['Full-Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Coder'];
  let ri = 0, ci = 0, deleting = false;
  const roleSpan = document.createElement('span');
  roleSpan.style.cssText = `
    display: block; font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 500; color: var(--clr-muted);
    margin-top: 0.5rem; min-height: 1.6em;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.02em;
  `;
  el.parentNode.insertBefore(roleSpan, el.nextSibling);

  const caretStyle = document.createElement('style');
  caretStyle.textContent = `
    .type-caret::after {
      content: '|'; color: var(--clr-primary-light);
      animation: caretBlink 0.8s step-end infinite;
    }
    @keyframes caretBlink { 0%,100%{opacity:1} 50%{opacity:0} }
  `;
  document.head.appendChild(caretStyle);
  roleSpan.classList.add('type-caret');

  function type() {
    const current = roles[ri];
    if (deleting) {
      roleSpan.textContent = current.substring(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 500); return; }
      setTimeout(type, 60);
    } else {
      roleSpan.textContent = current.substring(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 100);
    }
  }
  setTimeout(type, 2000);
})();
