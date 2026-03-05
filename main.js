/* ============================================================
   CANICA — Full-page scroll + Animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR — Canica marble
   ══════════════════════════════════════════════════════════ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;
let totalRotation = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX + 6, y: mouseY + 8, duration: 0.12, ease: 'none' });
});

gsap.ticker.add(() => {
  const dx = mouseX - curX;
  const dy = mouseY - curY;
  curX += dx * 0.11;
  curY += dy * 0.11;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 0.5) totalRotation += dist * 0.6;
  gsap.set(cursor, { x: curX, y: curY, rotation: totalRotation });
});

document.body.style.cursor = 'none';
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.style.cursor = 'none';
});

const hoverTargets = 'a, button, .tier, .event-card, .concept__card, .menu-card';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('is-hovering');
    gsap.to(cursorDot, { opacity: 0, duration: 0.2 });
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-hovering');
    gsap.to(cursorDot, { opacity: 1, duration: 0.3 });
  });
});

/* ══════════════════════════════════════════════════════════
   2. FULL-PAGE SCROLL SYSTEM
   ══════════════════════════════════════════════════════════ */
const sections   = [...document.querySelectorAll('.fp-section')];
const dots       = [...document.querySelectorAll('.fp-dot')];
const fpDots     = document.getElementById('fp-dots');
const DURATION   = 1.0;
const EASE       = 'power3.inOut';

// Dark sections (white dots)
const darkSections = [2, 5]; // membresias, reservar

let current     = 0;
let isAnimating = false;

// Set initial state: section 0 active, rest below
sections.forEach((s, i) => {
  if (i === 0) {
    s.classList.add('fp-active');
    gsap.set(s, { yPercent: 0 });
  } else {
    gsap.set(s, { yPercent: 100 });
  }
});

function goTo(index, dir = 1) {
  if (isAnimating || index === current) return;
  if (index < 0 || index >= sections.length) return;

  isAnimating = true;

  const leaving  = sections[current];
  const entering = sections[index];
  const direction = index > current ? 1 : -1;

  // Position entering section
  gsap.set(entering, { yPercent: direction * 100 });
  entering.classList.add('fp-active');

  const tl = gsap.timeline({
    onComplete: () => {
      leaving.classList.remove('fp-active');
      current = index;
      isAnimating = false;
      updateDots(index);
      // Run section-enter animations
      animateSection(index);
    }
  });

  // Leaving: slide out + slight scale down
  tl.to(leaving, {
    yPercent: -direction * 100,
    scale: 0.96,
    opacity: 0.4,
    duration: DURATION,
    ease: EASE,
  }, 0);

  // Entering: slide in
  tl.to(entering, {
    yPercent: 0,
    scale: 1,
    opacity: 1,
    duration: DURATION,
    ease: EASE,
  }, 0);
}

function updateDots(index) {
  dots.forEach((d, i) => d.classList.toggle('fp-dot--active', i === index));
  fpDots.classList.toggle('is-dark', darkSections.includes(index));
}

/* ── Dot click navigation ────────────────────────────────── */
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goTo(i));
});

/* ── Nav link navigation ─────────────────────────────────── */
document.querySelectorAll('[data-goto]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(link.dataset.goto));
  });
});

// Intercept anchor nav links
const anchorMap = {
  '#membresias': 2,
  '#cafe':       3,
  '#eventos':    4,
  '#reservar':   5,
  '#hero':       0,
  '#concept':    1,
};
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const idx = anchorMap[link.getAttribute('href')];
  if (idx !== undefined) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(idx);
    });
  }
});

/* ── Wheel ───────────────────────────────────────────────── */
let wheelCooldown = false;

window.addEventListener('wheel', (e) => {
  if (wheelCooldown || isAnimating) return;

  // Allow internal scroll on overflow sections
  const active = sections[current];
  const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 4;
  const atTop    = active.scrollTop <= 0;

  if (e.deltaY > 0 && !atBottom) return; // section still scrolling down
  if (e.deltaY < 0 && !atTop)    return; // section still scrolling up

  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 900);

  if      (e.deltaY > 0) goTo(current + 1,  1);
  else if (e.deltaY < 0) goTo(current - 1, -1);
}, { passive: true });

/* ── Touch ───────────────────────────────────────────────── */
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isAnimating) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 40) return;

  const active  = sections[current];
  const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 4;
  const atTop    = active.scrollTop <= 0;

  if (diff > 0 && (!atBottom || current === sections.length - 1)) {
    if (atBottom) goTo(current + 1, 1);
  } else if (diff < 0 && (!atTop || current === 0)) {
    if (atTop) goTo(current - 1, -1);
  }
}, { passive: true });

/* ── Keyboard ────────────────────────────────────────────── */
window.addEventListener('keydown', (e) => {
  if (isAnimating) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goTo(current - 1);
});

/* ══════════════════════════════════════════════════════════
   3. PER-SECTION ENTER ANIMATIONS
   ══════════════════════════════════════════════════════════ */
function animateSection(index) {
  const section = sections[index];

  // Reset elements
  const reveals = section.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  gsap.killTweensOf(reveals);

  switch(index) {

    case 0: // HERO — already handled by entrance TL, just re-trigger chars
      gsap.fromTo('.hero__char', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      });
      break;

    case 1: // CONCEPT
      gsap.fromTo(section.querySelectorAll('.concept__text > *'), {
        y: 50, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });
      gsap.fromTo('.concept__card--kids', { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out',
      });
      gsap.fromTo('.concept__card--adults', { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, delay: 0.3, ease: 'power3.out',
      });
      break;

    case 2: // MEMBRESIAS
      gsap.fromTo(section.querySelectorAll('.section-header > *'), {
        y: 40, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      });
      gsap.fromTo('.tier', { y: 70, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.12, delay: 0.2, ease: 'back.out(1.2)',
      });
      break;

    case 3: // CAFÉ
      gsap.fromTo('.cafe__text > *', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });
      gsap.fromTo('.cafe__menu-preview', { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out',
      });
      break;

    case 4: // EVENTOS
      gsap.fromTo(section.querySelectorAll('.section-header > *'), {
        y: 40, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      });
      gsap.fromTo('.event-card', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.12, delay: 0.2, ease: 'back.out(1.1)',
      });
      break;

    case 5: // CTA
      gsap.fromTo('.cta-section__inner > *', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });
      gsap.fromTo('.cta-shape', { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 0.12, duration: 1.2, stagger: 0.15, delay: 0.3, ease: 'back.out(1)',
      });
      break;
  }
}

/* ══════════════════════════════════════════════════════════
   4. HERO ENTRANCE (section 0)
   ══════════════════════════════════════════════════════════ */
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl.fromTo('#hero-logo', { y: -80, opacity: 0, scale: 0.88 }, {
  y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.4)',
});
heroTl.fromTo('.hero__tagline', { y: 40, opacity: 0 }, {
  y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
}, '-=0.5');
heroTl.fromTo('.hero__cta .btn', { y: 24, opacity: 0 }, {
  y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
}, '-=0.5');
heroTl.fromTo(['.hero__address', '.hero__scroll-hint'], { opacity: 0 }, {
  opacity: 1, duration: 0.7, stagger: 0.1,
}, '-=0.3');
heroTl.to('.hero__char', { opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.3');

/* Characters float */
gsap.utils.toArray('.hero__char').forEach(char => {
  gsap.to(char, {
    y: gsap.utils.random(-20, 20),
    x: gsap.utils.random(-10, 10),
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
  const cx = (e.clientX - left) / width  - 0.5;
  const cy = (e.clientY - top)  / height - 0.5;

  gsap.to('#hero-logo', {
    x: cx * 28, y: cy * 18, rotationY: cx * 6, rotationX: -cy * 4,
    duration: 1.6, ease: 'power2.out', overwrite: 'auto',
  });
  gsap.to('.hero__tagline', {
    x: cx * -14, y: cy * -8,
    duration: 1.8, ease: 'power2.out', overwrite: 'auto',
  });
  gsap.to('.hero__cta', {
    x: cx * -8, y: cy * -5,
    duration: 2, ease: 'power2.out', overwrite: 'auto',
  });
  gsap.utils.toArray('.hero__char').forEach((char, i) => {
    const depth = (i % 2 === 0 ? 1 : -1) * (1.4 + i * 0.5);
    gsap.to(char, {
      x: cx * 38 * depth, y: cy * 24 * depth,
      duration: 1.4 + i * 0.15, ease: 'power2.out', overwrite: 'auto',
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
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width  / 2;
    const relY = e.clientY - rect.top  - rect.height / 2;
    gsap.to(btn, { x: relX * 0.38, y: relY * 0.38, duration: 0.4, ease: 'power2.out' });
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
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(card, {
        rotationY: cx * intensity, rotationX: -cy * intensity, scale: 1.03,
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
addTilt('.tier',          10);
addTilt('.event-card',     8);
addTilt('.concept__card',  6);
addTilt('.menu-card',      5);

/* ══════════════════════════════════════════════════════════
   8. NAV
   ══════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

// Show scrolled style when not on hero
function updateNav(index) {
  nav.classList.toggle('scrolled', index > 0);
  // Logo: white on dark sections
  const logoImg = document.querySelector('.nav__logo-img');
  if (darkSections.includes(index)) {
    logoImg.src = 'assets/images/logo-alt-white.png';
    document.querySelectorAll('.nav__links a').forEach(a => a.style.color = 'var(--ivory)');
    burger.querySelectorAll('span').forEach(s => s.style.background = 'var(--ivory)');
  } else {
    logoImg.src = 'assets/images/logo-alt-black.png';
    document.querySelectorAll('.nav__links a').forEach(a => a.style.color = '');
    burger.querySelectorAll('span').forEach(s => s.style.background = '');
  }
}

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(spans[0], { rotation: 45,  y:  7, duration: 0.35 });
    gsap.to(spans[1], { opacity: 0,          duration: 0.2  });
    gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.35 });
  } else {
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.35 });
    gsap.to(spans[1], { opacity: 1,         duration: 0.2  });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.35 });
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.35 });
    gsap.to(spans[1], { opacity: 1,         duration: 0.2  });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.35 });
  });
});

/* ══════════════════════════════════════════════════════════
   9. NAV LOGO wobble
   ══════════════════════════════════════════════════════════ */
const navLogo = document.querySelector('.nav__logo-img');
navLogo?.addEventListener('mouseenter', () => {
  gsap.to(navLogo, { rotation: -4, scale: 1.06, duration: 0.3, ease: 'power2.out' });
});
navLogo?.addEventListener('mouseleave', () => {
  gsap.to(navLogo, { rotation: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
});
