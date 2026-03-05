/* ============================================================
   CANICA — main.js
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ── Smooth scroll ───────────────────────────────────────── */
const lenis = new Lenis({ duration: 1.3, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── Marble cursor ───────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0, rot = 0;

if (window.matchMedia('(hover: hover)').matches) {
  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button').forEach(el => el.style.cursor = 'none');

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursorDot, { x: mx + 5, y: my + 7, duration: 0.1, ease: 'none' });
  });

  gsap.ticker.add(() => {
    const dx = mx - cx, dy = my - cy;
    cx += dx * 0.11; cy += dy * 0.11;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.5) rot += dist * 0.55;
    gsap.set(cursor, { x: cx, y: cy, rotation: rot });
  });

  document.querySelectorAll('a, button, .tier, .event-card, .concept-card, .menu-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('is-hovering'); gsap.to(cursorDot, { opacity: 0, duration: 0.2 }); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hovering'); gsap.to(cursorDot, { opacity: 1, duration: 0.3 }); });
  });
}

/* ── Nav ─────────────────────────────────────────────────── */
const nav     = document.getElementById('nav');
const navLogo = document.getElementById('nav-logo');
const burger  = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const [s0, s1, s2] = burger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(s0, { rotation: 45,  y:  7, duration: 0.3 });
    gsap.to(s1, { opacity: 0,          duration: 0.2 });
    gsap.to(s2, { rotation: -45, y: -7, duration: 0.3 });
  } else {
    gsap.to(s0, { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(s1, { opacity: 1,         duration: 0.2 });
    gsap.to(s2, { rotation: 0, y: 0, duration: 0.3 });
  }
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  burger.querySelectorAll('span').forEach((s, i) => gsap.to(s, { rotation: 0, y: 0, opacity: 1, duration: 0.3 }));
}));

/* ── Progress dots ───────────────────────────────────────── */
const sections = ['s-hero','s-concept','s-memberships','s-cafe','s-events','s-cta'].map(id => document.getElementById(id));
const dots     = document.querySelectorAll('.fp-dot');
const fpDots   = document.getElementById('fp-dots');
const darkSecs = new Set([2, 5]); // memberships, cta

sections.forEach((sec, i) => {
  if (!sec) return;
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter:     () => activeDot(i),
    onEnterBack: () => activeDot(i),
  });
});

function activeDot(i) {
  dots.forEach((d, j) => d.classList.toggle('fp-dot--active', j === i));
  fpDots.classList.toggle('is-dark', darkSecs.has(i));
}
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const target = sections[i];
    if (target) lenis.scrollTo(target, { duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });
});

/* ── Hero entrance ───────────────────────────────────────── */
const tl = gsap.timeline({ delay: 0.2 });
tl.fromTo('#hero-logo',       { y: -70, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.3)' });
tl.fromTo('.s-hero__tagline', { y: 32,  opacity: 0 },             { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
tl.fromTo('.s-hero__cta .btn',{ y: 20,  opacity: 0 },             { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.5');
tl.fromTo(['.s-hero__address','.s-hero__scroll'], { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.3');
tl.to('.hero__char', { opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3');

/* Characters float */
document.querySelectorAll('.hero__char').forEach(c => {
  gsap.to(c, {
    y: gsap.utils.random(-18, 18), x: gsap.utils.random(-8, 8), rotation: gsap.utils.random(-8, 8),
    duration: gsap.utils.random(3, 5), repeat: -1, yoyo: true, ease: 'sine.inOut',
    delay: gsap.utils.random(0, 1.5),
  });
});

/* ── Hero mouse parallax ─────────────────────────────────── */
const heroEl = document.querySelector('.s-hero');
heroEl?.addEventListener('mousemove', e => {
  const { width, height, left, top } = heroEl.getBoundingClientRect();
  const cx2 = (e.clientX - left) / width  - 0.5;
  const cy2 = (e.clientY - top)  / height - 0.5;
  gsap.to('#hero-logo',        { x: cx2 * 24,  y: cy2 * 14, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
  gsap.to('.s-hero__tagline',  { x: cx2 * -12, y: cy2 * -7, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
  gsap.to('.s-hero__cta',      { x: cx2 * -7,  y: cy2 * -4, duration: 2,   ease: 'power2.out', overwrite: 'auto' });
  document.querySelectorAll('.hero__char').forEach((c, i) => {
    const d = (i % 2 === 0 ? 1 : -1) * (1.2 + i * 0.4);
    gsap.to(c, { x: cx2 * 34 * d, y: cy2 * 20 * d, duration: 1.3 + i * 0.1, ease: 'power2.out', overwrite: 'auto' });
  });
});
heroEl?.addEventListener('mouseleave', () => {
  gsap.to(['#hero-logo','.s-hero__tagline','.s-hero__cta','.hero__char'], { x: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)', stagger: 0.03 });
});

/* ── Scroll reveals ──────────────────────────────────────── */
document.querySelectorAll('.reveal').forEach(el => {
  const isLeft  = el.classList.contains('reveal--left');
  const isRight = el.classList.contains('reveal--right');
  gsap.fromTo(el,
    { opacity: 0, x: isLeft ? -50 : isRight ? 50 : 0, y: isLeft || isRight ? 0 : 48 },
    { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

/* ── Tiers stagger ───────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.tiers', start: 'top 85%', once: true,
  onEnter: () => gsap.fromTo('.tier', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'back.out(1.1)' }),
});

/* ── Events stagger ──────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.events-grid', start: 'top 85%', once: true,
  onEnter: () => gsap.fromTo('.event-card', { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
});

/* ── Magnetic buttons ────────────────────────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.btn, .btn-nav').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width/2) * 0.35, y: (e.clientY - r.top - r.height/2) * 0.35, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
  });
}

/* ── 3D card tilt ────────────────────────────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  ['.tier:10', '.event-card:8', '.concept-card:6', '.menu-card:5'].forEach(s => {
    const [sel, intensity] = s.split(':');
    document.querySelectorAll(sel).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        gsap.to(card, { rotationY: ((e.clientX - r.left)/r.width - 0.5) * intensity, rotationX: -((e.clientY - r.top)/r.height - 0.5) * intensity, scale: 1.02, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' }));
    });
  });
}

/* ── CTA parallax orbs ───────────────────────────────────── */
gsap.utils.toArray('.s-cta__orb').forEach((orb, i) => {
  gsap.to(orb, {
    y: [-60, 40, -30][i],
    scrollTrigger: { trigger: '.s-cta', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
});

/* ── Nav logo hover ──────────────────────────────────────── */
navLogo?.addEventListener('mouseenter', () => gsap.to(navLogo, { rotation: -4, scale: 1.06, duration: 0.3 }));
navLogo?.addEventListener('mouseleave', () => gsap.to(navLogo, { rotation: 0,  scale: 1,    duration: 0.6, ease: 'elastic.out(1, 0.4)' }));
