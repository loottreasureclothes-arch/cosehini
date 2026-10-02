const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  mobileNav.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.13, rootMargin: '0px 0px -50px' });

document.querySelectorAll('.reveal, .image-reveal').forEach((element) => observer.observe(element));

const count = document.querySelector('[data-count]');
let counted = false;
const countObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting || counted) return;
  counted = true;
  const target = Number(count.dataset.count);
  const start = performance.now();
  const duration = 900;
  const animate = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    count.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}, { threshold: .5 });
if (count) countObserver.observe(count);

// Celular personal del cliente (pendiente), con lada de país: 52 + 10 dígitos
const WHATSAPP = '52CELULAR_PENDIENTE';

const quoteForm = document.querySelector('#quote-form');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const text = [
    'Hola, COSEHINI. Me interesa solicitar una cotización.',
    '',
    `Nombre: ${data.get('nombre')}`,
    `Empresa: ${data.get('empresa')}`,
    `Teléfono: ${data.get('telefono')}`,
    `Correo: ${data.get('correo')}`,
    `Servicio: ${data.get('servicio')}`,
    '',
    `Mensaje: ${data.get('mensaje')}`
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

const heroMedia = document.querySelector('.hero-media');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking || !heroMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ticking = true;
  requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY * .08, 55);
    heroMedia.style.transform = `scale(1.03) translateY(${offset}px)`;
    ticking = false;
  });
}, { passive: true });
