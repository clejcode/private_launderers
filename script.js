// script.js
// Behavior modules for the single-page marketing site.
(() => {
  'use strict';

  const dom = {
    header: document.querySelector('.site-header'),
    navToggle: document.querySelector('.nav__toggle'),
    navMenu: document.querySelector('#navMenu'),
    navLinks: Array.from(document.querySelectorAll('.nav__link')),
    scrollLinks: Array.from(document.querySelectorAll('[data-scroll]')),
    toTop: document.querySelector('#toTop'),
    year: document.querySelector('#year'),
    contactForm: document.querySelector('#contactForm'),
    formSuccess: document.querySelector('#formSuccess'),
    successMessage: document.querySelector('#successMessage'),
    modal: document.querySelector('#policyModal'),
    modalTitle: document.querySelector('#policyTitle'),
    modalBody: document.querySelector('#policyBody'),
    themeToggle: document.querySelector('#themeToggle'),
    modalOpenButtons: Array.from(document.querySelectorAll('[data-modal-open]')),
    modalCloseButtons: Array.from(document.querySelectorAll('[data-modal-close]')),
    scheduleForm: document.querySelector('#scheduleForm'),
    scheduleNotes: document.querySelector('#scheduleNotes'),
    garmentType: document.querySelector('#garmentType'),
    serviceTypes: Array.from(document.querySelectorAll('input[name="serviceType"]')),
    addonStain: document.querySelector('#addonStain'),
    addonRush: document.querySelector('#addonRush'),
    addonStorage: document.querySelector('#addonStorage'),
    conciergeSummary: document.querySelector('#conciergeSummary'),
    conciergeToSchedule: document.querySelector('#conciergeToSchedule'),
    membershipSelectButtons: Array.from(document.querySelectorAll('[data-membership-select]')),
    membershipInquire: document.querySelector('#membershipInquire')
  };

  const THEME_KEY = 'private-launderers-theme';
  const SECTION_IDS = ['#home', '#services', '#process', '#about', '#contact', '#membership', '#concierge', '#schedule'];
  const POLICY_CONTENT = {
    accessibility: {
      title: 'Accessibility',
      body: '<p>Private Launderers is committed to improving accessibility for all visitors. If you encounter barriers using this site, please contact us by phone or email so we can assist directly.</p>'
    },
    privacy: {
      title: 'Privacy',
      body: '<p>Contact details submitted through this site are used only to respond to service inquiries. This static site does not process payments or store sensitive account data.</p>'
    }
  };

  const conciergeModel = {
    basePrice: { Suit: 35, 'Silk Blouse': 22, 'Cashmere Sweater': 24, Coat: 30, Dress: 26 },
    multiplier: { 'Standard Care': 1.0, 'Premium Care': 1.35, 'Press Only': 0.75 },
    addons: { 'Stain treatment': 8, 'Rush handling': 15, 'Seasonal storage': 12 }
  };

  let modalTriggerEl = null;

  const setCurrentYear = () => { if (dom.year) dom.year.textContent = String(new Date().getFullYear()); };
  const closeMobileMenu = () => {
    if (!dom.header) return;
    dom.header.classList.remove('is-open');
    if (dom.navToggle) dom.navToggle.setAttribute('aria-expanded', 'false');
  };

  const setTheme = (theme) => {
    const selectedTheme = theme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', selectedTheme);
    const isDark = selectedTheme === 'dark';
    if (dom.themeToggle) {
      dom.themeToggle.setAttribute('aria-pressed', String(isDark));
      dom.themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      const label = dom.themeToggle.querySelector('.theme-toggle__label');
      if (label) label.textContent = isDark ? 'Dark mode' : 'Light mode';
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', isDark ? '#101113' : '#f8f8f7');
  };

  const scrollToTarget = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerHeight = dom.header ? dom.header.getBoundingClientRect().height : 0;
    const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const openModal = ({ title, bodyHtml, triggerEl }) => {
    if (!dom.modal || !dom.modalTitle || !dom.modalBody) return;
    modalTriggerEl = triggerEl instanceof HTMLElement ? triggerEl : null;
    dom.modalTitle.textContent = title || 'Notice';
    dom.modalBody.innerHTML = bodyHtml || '';
    dom.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeButton = dom.modal.querySelector('.modal__close');
    if (closeButton instanceof HTMLElement) closeButton.focus();
  };

  const closeModal = () => {
    if (!dom.modal) return;
    dom.modal.hidden = true;
    document.body.style.overflow = '';
    if (modalTriggerEl) modalTriggerEl.focus();
    modalTriggerEl = null;
  };

  const initMobileNavigation = () => {
    if (!dom.navToggle || !dom.header || !dom.navMenu) return;
    dom.navToggle.addEventListener('click', () => {
      const isOpen = dom.header.classList.toggle('is-open');
      dom.navToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        const firstLink = dom.navMenu.querySelector('a');
        if (firstLink instanceof HTMLElement) firstLink.focus();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dom.header.classList.contains('is-open')) {
        closeMobileMenu();
        dom.navToggle.focus();
      }
    });
  };

  const initAnchorScrolling = () => {
    dom.scrollLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        closeMobileMenu();
        scrollToTarget(href);
        history.replaceState(null, '', href);
      });
    });
  };

  const initActiveSectionHighlight = () => {
    if (!('IntersectionObserver' in window)) return;
    const sections = SECTION_IDS.map((id) => document.querySelector(id)).filter(Boolean);
    if (!sections.length || !dom.navLinks.length) return;

    const setActiveLink = (sectionId) => {
      dom.navLinks.forEach((link) => link.classList.remove('is-active'));
      const targetLink = dom.navLinks.find((link) => (link.getAttribute('href') || '') === sectionId);
      if (targetLink) targetLink.classList.add('is-active');
    };

    const observer = new IntersectionObserver((entries) => {
      const mostVisible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (mostVisible?.target?.id) setActiveLink(`#${mostVisible.target.id}`);
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -60% 0px' });

    sections.forEach((section) => observer.observe(section));
  };

  const initBackToTop = () => {
    if (!dom.toTop) return;
    const updateVisibility = () => dom.toTop.classList.toggle('is-visible', window.scrollY > 650);
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
    dom.toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const initRevealAnimations = () => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const revealElements = Array.from(document.querySelectorAll('.reveal'));
    if (!revealElements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach((el) => observer.observe(el));
  };

  const initContactForm = () => {
    if (!dom.contactForm) return;
    const validators = {
      firstName: (value) => value.trim().length >= 1 || 'Please enter your first name.',
      lastName: (value) => value.trim().length >= 1 || 'Please enter your last name.',
      email: (value) => {
        const normalized = value.trim();
        if (!normalized) return 'Please enter your email.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || 'Please enter a valid email address.';
      },
      phone: (value) => {
        const normalized = value.trim();
        if (!normalized) return true;
        return /^[0-9()+\-\s.]{7,}$/.test(normalized) || 'Please enter a valid phone number.';
      },
      inquiry: (value) => value.trim().length >= 10 || 'Please add a brief inquiry (at least 10 characters).'
    };

    const setFieldError = (input, result) => {
      const field = input.closest('.field');
      const errorNode = field?.querySelector('.field__error');
      if (!field || !errorNode) return;
      const hasError = result !== true;
      field.classList.toggle('is-invalid', hasError);
      errorNode.textContent = hasError ? String(result) : '';
      input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    };

    dom.contactForm.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (!(target.name in validators)) return;
      setFieldError(target, validators[target.name](target.value));
    });

    dom.contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let formIsValid = true;
      Object.keys(validators).forEach((fieldName) => {
        const input = dom.contactForm.elements.namedItem(fieldName);
        if (!input) return;
        const result = validators[fieldName](String(input.value ?? ''));
        setFieldError(input, result);
        if (result !== true) formIsValid = false;
      });
      if (!formIsValid) {
        const firstInvalid = dom.contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }
      dom.contactForm.reset();
      dom.contactForm.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.setAttribute('aria-invalid', 'false'));
      dom.contactForm.querySelectorAll('.field.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      dom.contactForm.querySelectorAll('.field__error').forEach((el) => { el.textContent = ''; });
      if (dom.formSuccess) {
        dom.formSuccess.hidden = false;
        window.setTimeout(() => { dom.formSuccess.hidden = true; }, 8000);
      }
    });
  };

  const getConciergeState = () => {
    const garment = dom.garmentType ? dom.garmentType.value : '';
    const checkedService = dom.serviceTypes.find((input) => input.checked);
    const service = checkedService ? checkedService.value : '';
    const addOns = [];
    if (dom.addonStain?.checked) addOns.push('Stain treatment');
    if (dom.addonRush?.checked) addOns.push('Rush handling');
    if (dom.addonStorage?.checked) addOns.push('Seasonal storage');

    const base = conciergeModel.basePrice[garment];
    const multiplier = conciergeModel.multiplier[service];
    const addOnTotal = addOns.reduce((sum, item) => sum + (conciergeModel.addons[item] || 0), 0);
    const hasEstimate = Number.isFinite(base) && Number.isFinite(multiplier);
    const total = hasEstimate ? Math.round(base * multiplier + addOnTotal) : null;
    return { garment, service, addOns, total };
  };

  const updateConciergeSummary = () => {
    if (!dom.conciergeSummary) return;
    const state = getConciergeState();
    const garmentEl = dom.conciergeSummary.querySelector('[data-summary-garment]');
    const serviceEl = dom.conciergeSummary.querySelector('[data-summary-service]');
    const addonsEl = dom.conciergeSummary.querySelector('[data-summary-addons]');
    const totalEl = dom.conciergeSummary.querySelector('[data-summary-total]');
    if (garmentEl) garmentEl.textContent = state.garment || '—';
    if (serviceEl) serviceEl.textContent = state.service || '—';
    if (addonsEl) addonsEl.textContent = state.addOns.length ? state.addOns.join(', ') : 'None';
    if (totalEl) totalEl.textContent = state.total === null ? '$—' : `$${state.total}`;
  };

  const prefillScheduleNotes = (line) => {
    if (!dom.scheduleNotes || !line) return;
    const existing = dom.scheduleNotes.value.trim();
    dom.scheduleNotes.value = existing ? `${existing}\n${line}` : line;
  };

  const initConcierge = () => {
    if (!dom.garmentType || !dom.conciergeSummary) return;
    [dom.garmentType, ...dom.serviceTypes, dom.addonStain, dom.addonRush, dom.addonStorage].forEach((el) => {
      if (!el) return;
      el.addEventListener('change', updateConciergeSummary);
    });
    updateConciergeSummary();

    if (!dom.conciergeToSchedule) return;
    dom.conciergeToSchedule.addEventListener('click', () => {
      const state = getConciergeState();
      const note = `Concierge: ${state.garment || '—'}, ${state.service || '—'}, Add-ons: ${state.addOns.length ? state.addOns.join(', ') : 'None'}, Estimate: ${state.total === null ? '$—' : `$${state.total}`}`;
      if (dom.scheduleNotes) prefillScheduleNotes(note);
      if (document.querySelector('#schedule')) scrollToTarget('#schedule');
    });
  };

  const initScheduleForm = () => {
    if (!dom.scheduleForm) return;
    dom.scheduleForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = Array.from(dom.scheduleForm.querySelectorAll('[required]'));
      let firstInvalid = null;
      requiredFields.forEach((field) => {
        const isValid = field instanceof HTMLInputElement || field instanceof HTMLSelectElement ? field.checkValidity() : true;
        field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
        if (!isValid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
        return;
      }

      const formData = new FormData(dom.scheduleForm);
      const name = String(formData.get('fullName') || '');
      const email = String(formData.get('email') || '');
      const date = String(formData.get('pickupDate') || '');
      const windowValue = String(formData.get('pickupWindow') || '');
      const recurring = dom.scheduleForm.querySelector('#recurringWeekly')?.checked ? 'Yes' : 'No';

      const summaryHtml = `
        <p>Request received. We’ll follow up to confirm.</p>
        <p><strong>Name:</strong> ${name || '—'}<br><strong>Email:</strong> ${email || '—'}<br><strong>Date:</strong> ${date || '—'}<br><strong>Window:</strong> ${windowValue || '—'}<br><strong>Recurring:</strong> ${recurring}</p>
      `;
      openModal({ title: 'Pickup Request', bodyHtml: summaryHtml, triggerEl: dom.scheduleForm.querySelector('button[type="submit"]') });
      dom.scheduleForm.reset();
      requiredFields.forEach((field) => field.setAttribute('aria-invalid', 'false'));
      updateConciergeSummary();
    });
  };

  const initMembership = () => {
    if (dom.membershipSelectButtons.length) {
      dom.membershipSelectButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const plan = button.getAttribute('data-membership-select') || '—';
          prefillScheduleNotes(`Membership interest: ${plan}`);
          openModal({
            title: 'Membership Inquiry',
            bodyHtml: `<p>Membership inquiry received. We’ll follow up with details.</p><p><strong>Selected plan:</strong> ${plan}</p>`,
            triggerEl: button
          });
        });
      });
    }

    if (dom.membershipInquire) {
      dom.membershipInquire.addEventListener('click', () => {
        openModal({
          title: 'Membership Inquiry',
          bodyHtml: '<p>Membership inquiry received. We’ll follow up with details.</p><p><strong>Selected plan:</strong> Not selected</p>',
          triggerEl: dom.membershipInquire
        });
      });
    }
  };

  const initModal = () => {
    if (!dom.modal) return;
    dom.modalOpenButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const content = POLICY_CONTENT[button.dataset.modalOpen];
        if (!content) return;
        openModal({ title: content.title, bodyHtml: content.body, triggerEl: button });
      });
    });

    dom.modalCloseButtons.forEach((button) => {
      button.addEventListener('click', () => closeModal());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dom.modal && !dom.modal.hidden) closeModal();
    });
  };

  const initThemeToggle = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    setTheme(savedTheme || 'dark');
    if (!dom.themeToggle) return;
    dom.themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  };

  setCurrentYear();
  initMobileNavigation();
  initAnchorScrolling();
  initActiveSectionHighlight();
  initBackToTop();
  initThemeToggle();
  initRevealAnimations();
  initContactForm();
  initModal();
  initConcierge();
  initScheduleForm();
  initMembership();
})();
