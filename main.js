/* ============================================================
   CANICA — Animations & Interactions
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════
   1. SMOOTH SCROLL (Lenis)
   ══════════════════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
   ══════════════════════════════════════════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorDot  = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' });
});

// Lag the ring for a trailing feel
gsap.ticker.add(() => {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  gsap.set(cursor, { x: curX, y: curY });
});

// Cursor states
const hoverTargets = 'a, button, .tier, .event-card, .concept__card, .btn';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor,    { scale: 2.8, opacity: 0.6, duration: 0.4, ease: 'power2.out' });
    gsap.to(cursorDot, { scale: 0,   duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor,    { scale: 1,   opacity: 1,   duration: 0.4, ease: 'power2.out' });
    gsap.to(cursorDot, { scale: 1,   duration: 0.3 });
  });
});

// Hide default cursor
document.body.style.cursor = 'none';

/* ══════════════════════════════════════════════════════════
   3. NAV
   ══════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 80,
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ── Mobile menu ─────────────────────────────────────────── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(spans[0], { rotation: 45,  y:  7, duration: 0.35, ease: 'power2.out' });
    gsap.to(spans[1], { opacity: 0,          duration: 0.2  });
    gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.35, ease: 'power2.out' });
  } else {
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(spans[1], { opacity: 1,         duration: 0.2  });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  }
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(spans[1], { opacity: 1,         duration: 0.2  });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  });
});

/* ══════════════════════════════════════════════════════════
   4. HERO ENTRANCE
   ══════════════════════════════════════════════════════════ */
const heroTl = gsap.timeline({ delay: 0.15 });

heroTl.fromTo('#hero-logo', {
  y: -80, opacity: 0, scale: 0.88,
}, {
  y: 0, opacity: 1, scale: 1,
  duration: 1.1, ease: 'back.out(1.4)',
});

heroTl.fromTo('.hero__tagline', {
  y: 40, opacity: 0,
}, {
  y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
}, '-=0.5');

heroTl.fromTo('.hero__cta .btn', {
  y: 24, opacity: 0,
}, {
  y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
}, '-=0.5');

heroTl.fromTo(['.hero__address', '.hero__scroll-hint'], {
  opacity: 0,
}, {
  opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
}, '-=0.3');

heroTl.to('.hero__char', {
  opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out',
}, '-=0.4');

/* ── Hero characters idle float ──────────────────────────── */
gsap.utils.toArray('.hero__char').forEach(char => {
  gsap.to(char, {
    y:        gsap.utils.random(-20, 20),
    x:        gsap.utils.random(-10, 10),
    rotation: gsap.utils.random(-10, 10),
    duration: gsap.utils.random(3, 5),
    repeat: -1, yoyo: true, ease: 'sine.inOut',
    delay: gsap.utils.random(0, 2),
  });
});

/* ══════════════════════════════════════════════════════════
   5. HERO MOUSE PARALLAX — multi-layer depth
   ══════════════════════════════════════════════════════════ */
const heroEl = document.querySelector('.hero');

heroEl?.addEventListener('mousemove', (e) => {
  const { width, height, left, top } = heroEl.getBoundingClientRect();
  const cx = (e.clientX - left) / width  - 0.5;  // -0.5 to +0.5
  const cy = (e.clientY - top)  / height - 0.5;

  // Logo: slow, big movement
  gsap.to('#hero-logo', {
    x: cx * 28, y: cy * 18,
    rotationY: cx * 6, rotationX: -cy * 4,
    duration: 1.6, ease: 'power2.out', overwrite: 'auto',
  });

  // Tagline: medium, opposite
  gsap.to('.hero__tagline', {
    x: cx * -14, y: cy * -8,
    duration: 1.8, ease: 'power2.out', overwrite: 'auto',
  });

  // CTA: slight drift
  gsap.to('.hero__cta', {
    x: cx * -8, y: cy * -5,
    duration: 2, ease: 'power2.out', overwrite: 'auto',
  });

  // Characters: each at different depth
  gsap.utils.toArray('.hero__char').forEach((char, i) => {
    const depth  = (i % 2 === 0 ? 1 : -1) * (1.4 + i * 0.5);
    gsap.to(char, {
      x: cx * 38 * depth,
      y: cy * 24 * depth,
      duration: 1.4 + i * 0.15,
      ease: 'power2.out', overwrite: 'auto',
    });
  });
});

heroEl?.addEventListener('mouseleave', () => {
  gsap.to(['#hero-logo', '.hero__tagline', '.hero__cta', '.hero__char'], {
    x: 0, y: 0, rotationX: 0, rotationY: 0,
    duration: 1.6, ease: 'elastic.out(1, 0.5)', stagger: 0.04,
  });
});

/* ══════════════════════════════════════════════════════════
   6. MAGNETIC BUTTONS
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('.btn, .btn-nav').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const relX   = e.clientX - rect.left - rect.width  / 2;
    const relY   = e.clientY - rect.top  - rect.height / 2;
    gsap.to(btn, {
      x: relX * 0.38,
      y: relY * 0.38,
      duration: 0.4, ease: 'power2.out',
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ══════════════════════════════════════════════════════════
   7. 3D TILT on cards
   ══════════════════════════════════════════════════════════ */
function addTilt(selector, intensity = 12) {
  document.querySelectorAll(selector).forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange     = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = (e.clientX - rect.left)  / rect.width  - 0.5;
      const cy   = (e.clientY - rect.top)   / rect.height - 0.5;
      gsap.to(card, {
        rotationY:  cx * intensity,
        rotationX: -cy * intensity,
        scale: 1.03,
        duration: 0.4, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, scale: 1,
        duration: 0.7, ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}
addTilt('.tier',        10);
addTilt('.event-card',  8);
addTilt('.concept__card', 6);
addTilt('.menu-card',   5);

/* ══════════════════════════════════════════════════════════
   8. SCROLL REVEALS — word-by-word for headings
   ══════════════════════════════════════════════════════════ */

// Split all h2 inside sections into word spans for masked reveal
function splitWords(el) {
  const text  = el.textContent;
  const words = text.split(/(\s+)/);
  el.innerHTML = words.map(w =>
    w.trim()
      ? `<span class="word-wrap"><span class="word">${w}</span></span>`
      : w
  ).join('');
}

document.querySelectorAll('.concept h2, .membresias h2, .cafe h2, .eventos h2, .cta-section h2').forEach(h2 => {
  splitWords(h2);
  gsap.fromTo(h2.querySelectorAll('.word'), {
    y: '110%', opacity: 0,
  }, {
    y: '0%', opacity: 1,
    duration: 0.8, stagger: 0.07, ease: 'power3.out',
    scrollTrigger: {
      trigger: h2,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

// Standard reveals
gsap.utils.toArray('.reveal-up').forEach(el => {
  const delay = parseFloat(el.dataset.delay || 0);
  gsap.fromTo(el, { y: 60, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, delay,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
  });
});

gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el, { x: -70, opacity: 0 }, {
    x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
  });
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el, { x: 70, opacity: 0 }, {
    x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
  });
});

/* ── Tiers ───────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.tiers', start: 'top 85%', once: true,
  onEnter: () => {
    gsap.fromTo('.tier', { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.13, ease: 'power3.out',
    });
  },
});

/* ── Events ──────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.events-grid', start: 'top 85%', once: true,
  onEnter: () => {
    gsap.fromTo('.event-card', { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.11, ease: 'power3.out',
    });
  },
});

/* ══════════════════════════════════════════════════════════
   9. SCRUBBED PARALLAX on sections
   ══════════════════════════════════════════════════════════ */

// Concept section: cards drift apart on scroll
gsap.to('.concept__card--kids', {
  y: -40,
  scrollTrigger: { trigger: '.concept__split', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
});
gsap.to('.concept__card--adults', {
  y: 40,
  scrollTrigger: { trigger: '.concept__split', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
});

// Café: text and card move at different speeds
gsap.to('.cafe__text', {
  y: -30,
  scrollTrigger: { trigger: '.cafe', start: 'top bottom', end: 'bottom top', scrub: 1 },
});
gsap.to('.cafe__menu-preview', {
  y: 30,
  scrollTrigger: { trigger: '.cafe', start: 'top bottom', end: 'bottom top', scrub: 1 },
});

// CTA shapes
const ctaShapes = document.querySelectorAll('.cta-shape');
if (ctaShapes[0]) gsap.to(ctaShapes[0], { y: -80, scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
if (ctaShapes[1]) gsap.to(ctaShapes[1], { y:  60, scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
if (ctaShapes[2]) gsap.to(ctaShapes[2], { y: -40, scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 2   } });

/* ══════════════════════════════════════════════════════════
   10. MARQUEE — speed reacts to scroll velocity
   ══════════════════════════════════════════════════════════ */
const marqueeTrack = document.querySelector('.marquee__track');
let marqueeSpeed   = 1;
let lastScrollY    = window.scrollY;

if (marqueeTrack) {
  lenis.on('scroll', ({ velocity }) => {
    const v = Math.abs(velocity);
    marqueeSpeed = gsap.utils.clamp(0.4, 6, 1 + v * 0.08);
    gsap.to(marqueeTrack, {
      '--marquee-speed-mult': marqueeSpeed,
      duration: 0.4, ease: 'power2.out',
      onUpdate: () => {
        marqueeTrack.style.animationDuration = `${24 / marqueeSpeed}s`;
      },
    });
  });

  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ══════════════════════════════════════════════════════════
   11. NAV LOGO wobble on hover
   ══════════════════════════════════════════════════════════ */
const navLogo = document.querySelector('.nav__logo-img');
navLogo?.addEventListener('mouseenter', () => {
  gsap.to(navLogo, { rotation: -4, scale: 1.06, duration: 0.3, ease: 'power2.out' });
});
navLogo?.addEventListener('mouseleave', () => {
  gsap.to(navLogo, { rotation: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
});

/* ══════════════════════════════════════════════════════════
   12. SECTION BACKGROUND COLOR shift on scroll
   ══════════════════════════════════════════════════════════ */
// Subtle tint change when entering memberships (dark) section
ScrollTrigger.create({
  trigger: '.membresias',
  start: 'top 60%',
  end: 'bottom 40%',
  onEnter:     () => gsap.to('body', { backgroundColor: '#0A0A0A', duration: 0.8, ease: 'power2.out' }),
  onLeave:     () => gsap.to('body', { backgroundColor: '#F5F0E8', duration: 0.8, ease: 'power2.out' }),
  onEnterBack: () => gsap.to('body', { backgroundColor: '#0A0A0A', duration: 0.8, ease: 'power2.out' }),
  onLeaveBack: () => gsap.to('body', { backgroundColor: '#F5F0E8', duration: 0.8, ease: 'power2.out' }),
});
