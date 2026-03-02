// script.js
// Behavior modules for the single-page marketing site.
(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Shared DOM references
  // ---------------------------------------------------------------------------
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
    modalCloseButtons: Array.from(document.querySelectorAll('[data-modal-close]'))
  };

  const THEME_KEY = 'private-launderers-theme';

  const SECTION_IDS = ['#home', '#services', '#process', '#about', '#contact'];

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

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  const setCurrentYear = () => {
    if (dom.year) dom.year.textContent = String(new Date().getFullYear());
  };

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

  // ---------------------------------------------------------------------------
  // Navigation + scroll behavior
  // ---------------------------------------------------------------------------
  const initMobileNavigation = () => {
    if (!dom.navToggle || !dom.header || !dom.navMenu) return;

    dom.navToggle.addEventListener('click', () => {
      const isOpen = dom.header.classList.toggle('is-open');
      dom.navToggle.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        const firstLink = dom.navMenu.querySelector('a');
        if (firstLink) firstLink.focus();
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

    const linkForSection = (sectionId) => {
      const normalized = sectionId.replace('#', '');
      return dom.navLinks.find((link) => (link.getAttribute('href') || '').replace('#', '') === normalized);
    };

    const setActiveLink = (sectionId) => {
      dom.navLinks.forEach((link) => link.classList.remove('is-active'));
      const matched = linkForSection(sectionId);
      if (matched) matched.classList.add('is-active');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible?.target?.id) {
          setActiveLink(`#${mostVisible.target.id}`);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-20% 0px -60% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initBackToTop = () => {
    if (!dom.toTop) return;

    const updateVisibility = () => {
      dom.toTop.classList.toggle('is-visible', window.scrollY > 650);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    dom.toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ---------------------------------------------------------------------------
  // Progressive reveal animation
  // ---------------------------------------------------------------------------
  const initRevealAnimations = () => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealElements = Array.from(document.querySelectorAll('.reveal'));
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  // ---------------------------------------------------------------------------
  // Contact form validation
  // ---------------------------------------------------------------------------
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

  const validateForm = () => {
    if (!dom.contactForm) return false;

    let isValid = true;
    Object.keys(validators).forEach((fieldName) => {
      const input = dom.contactForm.elements.namedItem(fieldName);
      if (!input) return;

      const result = validators[fieldName](String(input.value ?? ''));
      setFieldError(input, result);
      if (result !== true) isValid = false;
    });

    return isValid;
  };

  const initContactForm = () => {
    if (!dom.contactForm) return;

    dom.contactForm.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (!(target.name in validators)) return;

      setFieldError(target, validators[target.name](target.value));
    });

    dom.contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formIsValid = validateForm();

      if (!formIsValid) {
        const firstInvalid = dom.contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const emailSignup = dom.contactForm.elements.namedItem('emailSignup');
      const textSignup = dom.contactForm.elements.namedItem('textSignup');
      const hasPromoOptIn =
        emailSignup instanceof HTMLInputElement &&
        textSignup instanceof HTMLInputElement &&
        emailSignup.checked &&
        textSignup.checked;

      if (dom.successMessage) {
        dom.successMessage.textContent = hasPromoOptIn
          ? 'Thank you. You are signed up for email and text updates—your 10% off on your next service is now unlocked. Please call or email to complete scheduling.'
          : 'Thank you. Your message is ready to be sent—please call or email to complete scheduling.';
      }

      dom.contactForm.reset();
      dom.contactForm.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.setAttribute('aria-invalid', 'false'));
      dom.contactForm.querySelectorAll('.field.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      dom.contactForm.querySelectorAll('.field__error').forEach((el) => {
        el.textContent = '';
      });

      if (dom.formSuccess) {
        dom.formSuccess.hidden = false;
        window.setTimeout(() => {
          dom.formSuccess.hidden = true;
        }, 8000);
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Policy modal
  // ---------------------------------------------------------------------------
  const openModal = (kind) => {
    if (!dom.modal || !dom.modalTitle || !dom.modalBody) return;

    const content = POLICY_CONTENT[kind];
    if (!content) return;

    dom.modalTitle.textContent = content.title;
    dom.modalBody.innerHTML = content.body;
    dom.modal.hidden = false;
    document.body.style.overflow = 'hidden';

    const closeButton = dom.modal.querySelector('.modal__close');
    if (closeButton instanceof HTMLElement) closeButton.focus();
  };

  const closeModal = () => {
    if (!dom.modal) return;
    dom.modal.hidden = true;
    document.body.style.overflow = '';
  };

  const initModal = () => {
    if (!dom.modal) return;

    dom.modalOpenButtons.forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.modalOpen));
    });

    dom.modalCloseButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dom.modal.hidden) closeModal();
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

  // ---------------------------------------------------------------------------
  // Boot sequence
  // ---------------------------------------------------------------------------
  setCurrentYear();
  initMobileNavigation();
  initAnchorScrolling();
  initActiveSectionHighlight();
  initBackToTop();
  initThemeToggle();
  initRevealAnimations();
  initContactForm();
  initModal();
})();
