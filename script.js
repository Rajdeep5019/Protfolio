/* ---- LOADING SCREEN ---- */
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let loadPct = 0;

const loadInterval = setInterval(() => {
  loadPct += Math.random() * 18 + 8;
  if (loadPct >= 100) {
    loadPct = 100;
    clearInterval(loadInterval);
    setTimeout(() => loader.classList.add('hidden'), 200);
  }
  loaderFill.style.width = loadPct + '%';
}, 80);

window.addEventListener('load', () => {
  loadPct = 100;
  loaderFill.style.width = '100%';
  setTimeout(() => loader.classList.add('hidden'), 350);
});

/* ---- PARTICLE CANVAS ---- */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.alpha  = Math.random() * 0.5 + 0.1;
    const r = Math.random();
    this.color = r < 0.5
      ? `rgba(0,198,255,${this.alpha})`
      : r < 0.8
        ? `rgba(123,47,247,${this.alpha})`
        : `rgba(255,60,172,${this.alpha})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,198,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---- CUSTOM CURSOR ---- */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

let lastTX = 0, lastTY = 0;
const TRAIL_GAP = 10;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';

  // Trail dots
  const dx = mx - lastTX, dy = my - lastTY;
  if (Math.sqrt(dx*dx + dy*dy) >= TRAIL_GAP) {
    spawnTrailDot(mx, my);
    lastTX = mx; lastTY = my;
  }
});

function animateCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ---- CURSOR TRAIL ---- */
const TRAIL_COLORS = [
  'rgba(0,198,255,',
  'rgba(123,47,247,',
  'rgba(255,60,172,'
];
let trailColorIdx = 0;

function spawnTrailDot(x, y) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = x + 'px';
  dot.style.top  = y + 'px';

  // Cycle accent colors
  const col = TRAIL_COLORS[trailColorIdx % TRAIL_COLORS.length];
  trailColorIdx++;
  dot.style.setProperty('--tc', col + '0.85)');
  dot.style.setProperty('--tg', col + '0)');

  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 800);
}

document.querySelectorAll('a, button, .project-card, .contact-card, .skill-group, .ach-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
});

/* ---- SCROLL PROGRESS ---- */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
});

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- BURGER MENU ---- */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- TYPEWRITER ---- */
const words = ['Aspiring Developer', 'Backend Builder', 'Problem Solver', 'IoT Enthusiast'];
let wIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeWrite() {
  const word = words[wIdx];
  if (!deleting) {
    tw.textContent = word.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === word.length) {
      setTimeout(() => { deleting = true; typeWrite(); }, 1600);
      return;
    }
    setTimeout(typeWrite, 75);
  } else {
    tw.textContent = word.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
      setTimeout(typeWrite, 300);
      return;
    }
    setTimeout(typeWrite, 40);
  }
}
typeWrite();

/* ---- SCROLL REVEAL ---- */
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ---- ANIMATED STAT COUNTERS ---- */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- 3D TILT EFFECT ON PROJECT CARDS ---- */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    // Don't tilt when flipped
    if (card.querySelector('.card-inner').style.transform &&
        card.querySelector('.card-inner').style.transform.includes('180')) return;
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = -dy * 8;
    const rotY  =  dx * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ---- MAGNETIC BUTTONS ---- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => btn.style.transition = '', 500);
  });
});

/* ---- ACTIVE NAV HIGHLIGHT ---- */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));
