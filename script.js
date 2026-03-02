// script.js
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('#navMenu');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const scrollLinks = Array.from(document.querySelectorAll('[data-scroll]'));
  const toTop = document.querySelector('#toTop');
  const year = document.querySelector('#year');

  // Footer year
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  if (toggle && header && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        // Focus first link for keyboard users
        const first = menu.querySelector('a');
        first && first.focus();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Smooth scroll with header offset (keep native smooth-scroll too)
  function scrollToTarget(id) {
    const el = document.querySelector(id);
    if (!el) return;
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const y = window.scrollY + el.getBoundingClientRect().top - headerH - 10;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  scrollLinks.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // close mobile menu
      if (header && header.classList.contains('is-open')) {
        header.classList.remove('is-open');
        toggle && toggle.setAttribute('aria-expanded', 'false');
      }
      scrollToTarget(href);
      history.replaceState(null, '', href);
    });
  });

  // Active section highlighting
  const sectionIds = ['#home', '#services', '#process', '#about', '#contact'];
  const sections = sectionIds
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  const linkForSection = (id) => {
    const normalized = id.replace('#', '');
    return navLinks.find((l) => (l.getAttribute('href') || '').replace('#', '') === normalized);
  };

  const setActiveLink = (id) => {
    navLinks.forEach((l) => l.classList.remove('is-active'));
    const link = linkForSection(id);
    link && link.classList.add('is-active');
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActiveLink('#' + visible.target.id);
      }
    },
    {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: '-20% 0px -60% 0px'
    }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // Back to top visibility + action
  const onScroll = () => {
    const show = window.scrollY > 650;
    toTop && toTop.classList.toggle('is-visible', show);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal animations
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Contact form validation + success state
  const form = document.querySelector('#contactForm');
  const success = document.querySelector('#formSuccess');

  const validators = {
    firstName: (v) => v.trim().length >= 1 || 'Please enter your first name.',
    lastName: (v) => v.trim().length >= 1 || 'Please enter your last name.',
    email: (v) => {
      const val = v.trim();
      if (!val) return 'Please enter your email.';
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      return ok || 'Please enter a valid email address.';
    },
    phone: (v) => {
      const val = v.trim();
      if (!val) return true; // optional
      const ok = /^[0-9()+\-\s.]{7,}$/.test(val);
      return ok || 'Please enter a valid phone number.';
    },
    inquiry: (v) => v.trim().length >= 10 || 'Please add a brief inquiry (at least 10 characters).'
  };

  function setFieldError(input, message) {
    const field = input.closest('.field');
    const error = field ? field.querySelector('.field__error') : null;
    if (!field || !error) return;

    const hasError = message !== true;
    field.classList.toggle('is-invalid', hasError);
    error.textContent = hasError ? String(message) : '';
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function validateForm() {
    if (!form) return false;

    let ok = true;
    Object.keys(validators).forEach((name) => {
      const input = form.elements.namedItem(name);
      if (!input) return;
      const value = input.value ?? '';
      const result = validators[name](String(value));
      setFieldError(input, result);
      if (result !== true) ok = false;
    });

    return ok;
  }

  if (form) {
    form.addEventListener('input', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return;
      const name = t.name;
      if (validators[name]) {
        const result = validators[name](t.value);
        setFieldError(t, result);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = validateForm();
      if (!ok) {
        // focus first invalid
        const firstInvalid = form.querySelector('.field.is-invalid input, .field.is-invalid textarea');
        firstInvalid && firstInvalid.focus();
        return;
      }
      // success state (no backend)
      if (success) success.hidden = false;

      // Keep it lightweight: do not clear values automatically; user may want to copy.
      // Optionally collapse success after time:
      window.setTimeout(() => { if (success) success.hidden = true; }, 8000);
    });
  }

  // Policy modal (Accessibility / Privacy) — sourced from PDF summaries
  const modal = document.querySelector('#policyModal');
  const modalTitle = document.querySelector('#policyTitle');
  const modalBody = document.querySelector('#policyBody');

  const policyContent = {
    accessibility: {
      title: 'Accessibility',
      html: `
        <p>The company aims to meet WCAG 2.1 Level AA accessibility standards, addressing text alternatives for non-text content, keyboard navigability, color contrast, and clear navigation.</p>
        <p>Regular audits and user testing are conducted to improve accessibility, and feedback is welcomed.</p>
      `
    },
    privacy: {
      title: 'Privacy',
      html: `
        <p>Updated July 19, 2025: the policy explains that the company may collect personal data (names, emails, phone numbers) and usage data (IP address, browser type, pages visited).</p>
        <p>Information is used to operate and maintain the website, improve and personalise it, understand how users interact with the site, develop new products and features, and communicate with users.</p>
      `
    }
  };

  function openModal(key) {
    if (!modal || !modalTitle || !modalBody) return;
    const content = policyContent[key];
    if (!content) return;

    modalTitle.textContent = content.title;
    modalBody.innerHTML = content.html;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // focus management
    const closeBtn = modal.querySelector('[data-modal-close]');
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const openKey = t.getAttribute('data-modal-open');
    if (openKey) {
      openModal(openKey);
      return;
    }
    if (t.hasAttribute('data-modal-close')) {
      closeModal();
      return;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });

  // Trap focus inside modal when open (minimal)
  document.addEventListener('focusin', (e) => {
    if (!modal || modal.hidden) return;
    const panel = modal.querySelector('.modal__panel');
    if (!panel) return;
    if (!panel.contains(e.target)) {
      const closeBtn = panel.querySelector('[data-modal-close]');
      closeBtn && closeBtn.focus();
    }
  });
})();