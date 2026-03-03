const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');
const heroBg = document.querySelector('.hero-bg');
const form = document.querySelector('.contact-form');

if (year) year.textContent = new Date().getFullYear();

// Mobile navigation toggle.
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

// Sticky navbar background transition on scroll.
const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Hero parallax texture movement (subtle, GPU-friendly transform only).
const updateHeroParallax = () => {
  if (!heroBg) return;
  const offset = Math.min(window.scrollY * 0.16, 50);
  heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
};
window.addEventListener('scroll', updateHeroParallax, { passive: true });

// Smooth close of mobile nav when selecting links.
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Section reveal and staggered card reveal via Intersection Observer.
const revealItems = document.querySelectorAll('.reveal, .stagger > *');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const index = [...el.parentElement.children].indexOf(el);
    const delay = el.parentElement.classList.contains('stagger') ? index * 90 : 0;
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add('visible');
    observer.unobserve(el);
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px'
});

revealItems.forEach((item) => observer.observe(item));

// Hero headline text reveal.
const headline = document.querySelector('[data-animate="headline"]');
if (headline) {
  const chars = headline.textContent.trim().split('');
  headline.textContent = '';
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = '0';
    span.style.transform = 'translate3d(0, 14px, 0)';
    span.style.display = 'inline-block';
    span.style.transition = 'opacity 420ms ease-out, transform 420ms ease-out';
    span.style.transitionDelay = `${120 + i * 18}ms`;
    headline.appendChild(span);
  });
  requestAnimationFrame(() => {
    headline.querySelectorAll('span').forEach((span) => {
      span.style.opacity = '1';
      span.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

// Lightweight form handling.
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      const original = submitButton.textContent;
      submitButton.textContent = 'Request Received';
      submitButton.disabled = true;
      setTimeout(() => {
        submitButton.textContent = original;
        submitButton.disabled = false;
        form.reset();
      }, 1800);
    }
  });
}
