/* ══════════════════════════════════════
   CSM PLANEJADOS — main.js
   ══════════════════════════════════════ */

// ── Nav: scroll effect + active link ──
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Active link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

// ── Hero carousel ──
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let carouselTimer;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }

function startCarousel() {
  carouselTimer = setInterval(nextSlide, 5500);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(carouselTimer);
    goToSlide(+dot.dataset.slide);
    startCarousel();
  });
});

startCarousel();

// ── Scroll reveal ──
const reveals = document.querySelectorAll(
  '.service-card, .step, .gallery-item, .highlight-item, .about-content > *, .contact-info > *, .contact-form-wrap, .section-header'
);
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = Math.min(idx * 0.1, 0.5) + 's';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const phone = data.get('phone');
    const service = data.get('service') || 'não especificado';
    const message = data.get('message') || '';

    const waMsg = encodeURIComponent(
      `Olá! Me chamo ${name}.\nTelefone: ${phone}\nServiço: ${service}\n${message ? 'Mensagem: ' + message : ''}`
    );

    // Show success state
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Open WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/55XXXXXXXXXXX?text=${waMsg}`, '_blank');
    }, 800);
  });
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72);
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── Gallery modal ──
const galleryItems = document.querySelectorAll('.gallery-item');

const modal = document.createElement('div');
modal.id = 'galleryModal';
modal.style.cssText = `
  display:none; position:fixed; inset:0; z-index:9999;
  background:rgba(0,0,0,0.92); align-items:center;
  justify-content:center; cursor:zoom-out;
`;
modal.innerHTML = `
  <button id="modalClose" style="position:absolute;top:20px;right:28px;background:none;
    border:none;color:#fff;font-size:2.5rem;cursor:pointer;line-height:1;">&times;</button>
  <img id="modalImg" style="max-width:92vw;max-height:90vh;object-fit:contain;
    border-radius:4px;box-shadow:0 8px 48px rgba(0,0,0,0.6);" />
`;
document.body.appendChild(modal);

const modalImg = document.getElementById('modalImg');

galleryItems.forEach(item => {
  item.style.cursor = 'zoom-in';
  item.addEventListener('click', () => {
    modalImg.src = item.querySelector('img').src;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });