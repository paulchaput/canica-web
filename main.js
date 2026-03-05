/* ============================================================
   CANICA — Animations & Interactions
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── NAV scroll state ─────────────────────────────────────── */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 80,
  onEnter:    () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ── Mobile menu ──────────────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.2 });
    gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
  } else {
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.2 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.2 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
  });
});

/* ── Hero entrance ────────────────────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.3 });

// Each geo letter falls in from above with stagger
heroTl.fromTo('.geo-letter', {
  y: -80,
  opacity: 0,
  scale: 0.8,
  rotation: () => gsap.utils.random(-20, 20),
}, {
  y: 0,
  opacity: 1,
  scale: 1,
  rotation: 0,
  duration: 0.8,
  stagger: 0.08,
  ease: 'back.out(1.4)',
});

heroTl.fromTo('.hero__tagline', {
  y: 30,
  opacity: 0,
}, {
  y: 0,
  opacity: 1,
  duration: 0.7,
  ease: 'power3.out',
}, '-=0.3');

heroTl.fromTo('.hero__cta', {
  y: 20,
  opacity: 0,
}, {
  y: 0,
  opacity: 1,
  duration: 0.6,
  ease: 'power3.out',
}, '-=0.4');

heroTl.fromTo(['.hero__address', '.hero__scroll-hint'], {
  opacity: 0,
}, {
  opacity: 1,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
}, '-=0.3');

/* ── Background shapes float ──────────────────────────────── */
gsap.utils.toArray('.shape').forEach(shape => {
  gsap.to(shape, {
    y: gsap.utils.random(-30, 30),
    x: gsap.utils.random(-15, 15),
    rotation: gsap.utils.random(-10, 10),
    duration: gsap.utils.random(4, 7),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: gsap.utils.random(0, 2),
  });
});

/* ── Marble bounce on hover ───────────────────────────────── */
document.querySelectorAll('.marble').forEach((marble, i) => {
  marble.addEventListener('mouseenter', () => {
    gsap.to(marble, {
      y: -6,
      scale: 1.15,
      duration: 0.25,
      ease: 'back.out(2)',
    });
  });
  marble.addEventListener('mouseleave', () => {
    gsap.to(marble, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)',
    });
  });
});

/* ── Scroll reveal: reveal-up ─────────────────────────────── */
gsap.utils.toArray('.reveal-up').forEach(el => {
  const delay = parseFloat(el.dataset.delay || 0);
  gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Scroll reveal: reveal-left ───────────────────────────── */
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.to(el, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Scroll reveal: reveal-right ──────────────────────────── */
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.to(el, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Tiers stagger ────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.tiers',
  start: 'top 85%',
  onEnter: () => {
    gsap.fromTo('.tier', {
      y: 50,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });
  },
  once: true,
});

/* ── Event cards stagger ──────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.events-grid',
  start: 'top 85%',
  onEnter: () => {
    gsap.fromTo('.event-card', {
      y: 40,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  },
  once: true,
});

/* ── Marquee pause on hover ───────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee__track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ── CTA shapes parallax ──────────────────────────────────── */
const ctaShapes = document.querySelectorAll('.cta-shape');
ScrollTrigger.create({
  trigger: '.cta-section',
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1.5,
  onUpdate: (self) => {
    const progress = self.progress;
    ctaShapes[0] && gsap.set(ctaShapes[0], { y: progress * -60 });
    ctaShapes[1] && gsap.set(ctaShapes[1], { y: progress *  40 });
    ctaShapes[2] && gsap.set(ctaShapes[2], { y: progress * -30 });
  },
});

/* ── Geo logo interactive on hero ────────────────────────────
   Subtle gravity: shapes drift toward cursor                  */
document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width  - 0.5;
  const cy = (e.clientY - rect.top)  / rect.height - 0.5;
  gsap.to('.geo-letter', {
    x: cx * 12,
    y: cy * 8,
    duration: 1.2,
    ease: 'power2.out',
    stagger: 0.02,
    overwrite: 'auto',
  });
});
document.querySelector('.hero')?.addEventListener('mouseleave', () => {
  gsap.to('.geo-letter', { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)', stagger: 0.03 });
});
