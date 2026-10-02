// Datos de contacto: se cambian solo aquí y se actualizan en toda la página.
// Celular personal del cliente con lada de país (52 + 10 dígitos). Pendiente.
const CONTACT = {
  phone: '',
  email: 'gerencia@cosehini.com'
};

const phoneDigits = CONTACT.phone.replace(/\D/g, '');
const phoneLabel = phoneDigits.length === 12
  ? `${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5, 8)} ${phoneDigits.slice(8)}`
  : 'Celular pendiente';

const waLink = (text) => `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;

document.querySelectorAll('[data-tel]').forEach((el) => {
  if (!phoneDigits) { el.hidden = true; return; }
  el.href = `tel:+${phoneDigits}`;
  const label = el.querySelector('.tel-text') || (el.children.length ? null : el);
  if (label && el.textContent.trim() !== 'Llamar' && el.textContent.trim() !== 'Llamar ahora') label.textContent = phoneLabel;
});

document.querySelectorAll('[data-mail]').forEach((el) => {
  el.href = `mailto:${CONTACT.email}`;
  const label = el.querySelector('.mail-text') || (el.children.length ? null : el);
  if (label) label.textContent = CONTACT.email;
});

const setWa = (el) => { el.href = waLink(el.dataset.wa); };
document.querySelectorAll('[data-wa]').forEach(setWa);

// Menú móvil
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const setMenu = (open) => {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
};
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

// Aparición al scrollear
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.04, rootMargin: '0px' });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Inspecciones: elegir autoridad
const AUTHORITIES = {
  stps: {
    name: 'Secretaría del Trabajo y Previsión Social',
    what: 'Revisa las condiciones de seguridad e higiene de tu centro de trabajo y el cumplimiento de las normas de la STPS.',
    short: 'STPS'
  },
  profepa: {
    name: 'Procuraduría Federal de Protección al Ambiente',
    what: 'Revisa el cumplimiento ambiental de competencia federal: residuos peligrosos, emisiones y autorizaciones federales.',
    short: 'PROFEPA'
  },
  proespa: {
    name: 'Procuraduría Estatal de Protección al Ambiente',
    what: 'Revisa el cumplimiento ambiental de competencia estatal en Aguascalientes.',
    short: 'PROESPA'
  },
  pc: {
    name: 'Protección Civil',
    what: 'Revisa tu programa interno, señalización, equipo contra incendio, brigadas y simulacros.',
    short: 'Protección Civil'
  }
};

const tabs = document.querySelectorAll('.insp-tabs [role="tab"]');
const panel = document.querySelector('.insp-panel');
const inspName = document.querySelector('#insp-name');
const inspWhat = document.querySelector('#insp-what');
const inspCta = document.querySelector('#insp-cta');
const inspCtaText = document.querySelector('#insp-cta-text');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const a = AUTHORITIES[tab.dataset.auth];
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    inspName.textContent = a.name;
    inspWhat.textContent = a.what;
    inspCtaText.textContent = `Me llegó una inspección · ${a.short}`;
    inspCta.dataset.wa = `Hola, me llegó una inspección de ${a.short} y necesito apoyo.`;
    setWa(inspCta);
    panel.classList.remove('swap');
    void panel.offsetWidth;
    panel.classList.add('swap');
  });
});

// Proceso: la línea se llena con el scroll (y se vacía al regresar)
const timeline = document.querySelector('#timeline');
const steps = timeline ? [...timeline.querySelectorAll('li')] : [];
let ticking = false;
const updateTimeline = () => {
  ticking = false;
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const mark = window.innerHeight * 0.6;
  const fill = Math.min(Math.max((mark - rect.top) / rect.height, 0), 1);
  timeline.style.setProperty('--fill', fill.toFixed(3));
  steps.forEach((li) => {
    const r = li.getBoundingClientRect();
    li.classList.toggle('on', r.top + 24 < mark);
  });
};
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateTimeline);
}, { passive: true });
updateTimeline();

// Formulario: se manda por WhatsApp
const quoteForm = document.querySelector('#quote-form');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const lines = [
    'Hola, COSEHINI. Me interesa solicitar una cotización.',
    '',
    `Nombre: ${data.get('nombre')}`,
    `Empresa: ${data.get('empresa')}`,
    `Teléfono: ${data.get('telefono')}`
  ];
  if (data.get('correo')) lines.push(`Correo: ${data.get('correo')}`);
  lines.push(`Servicio: ${data.get('servicio')}`);
  if (data.get('mensaje')) lines.push('', `Mensaje: ${data.get('mensaje')}`);
  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});
