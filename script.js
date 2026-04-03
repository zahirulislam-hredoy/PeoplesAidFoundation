/* ================================================================
   PEOPLE'S AID FOUNDATION — Core Interactivity
   ================================================================ */

;(function () {
  'use strict';

  const DOM = {
    header:       document.getElementById('header'),
    navToggle:    document.getElementById('navToggle'),
    nav:          document.getElementById('mainNav'),
    navLinks:     document.querySelectorAll('.nav__link'),
    contactForm:  document.getElementById('contactForm'),
    backToTop:    document.getElementById('backToTop'),
    yearSpan:     document.getElementById('currentYear'),
    body:         document.body,
  };

  function addClass(el, cls) { if (el && !el.classList.contains(cls)) el.classList.add(cls); }
  function removeClass(el, cls) { if (el && el.classList.contains(cls)) el.classList.remove(cls); }

  // 1. Mobile Menu
  const MobileMenu = (function () {
    let isOpen = false;
    function toggle() {
      isOpen = !isOpen;
      if (isOpen) {
        addClass(DOM.nav, 'nav--open');
        addClass(DOM.navToggle, 'active');
        DOM.navToggle.setAttribute('aria-expanded', 'true');
        DOM.body.style.overflow = 'hidden';
      } else {
        removeClass(DOM.nav, 'nav--open');
        removeClass(DOM.navToggle, 'active');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        DOM.body.style.overflow = '';
      }
    }
    function init() {
      if (!DOM.navToggle) return;
      DOM.navToggle.addEventListener('click', toggle);
      DOM.navLinks.forEach(link => link.addEventListener('click', () => { if (isOpen) toggle(); }));
    }
    return { init };
  })();

  // 2. Smooth Scroll
  const SmoothScroll = (function () {
    function init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#' || targetId === '#!') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 64;
            const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - headerOffset - 20, behavior: 'smooth' });
          }
        });
      });
    }
    return { init };
  })();

  // 3. Header Scroll
  const HeaderScroll = (function () {
    function init() {
      if (!DOM.header) return;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) addClass(DOM.header, 'header--scrolled');
        else removeClass(DOM.header, 'header--scrolled');
      }, { passive: true });
    }
    return { init };
  })();

  // 4. Form Success Message (Restored)
  const FormFeedback = (function () {
    function init() {
      if (DOM.contactForm) {
        DOM.contactForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const btn = this.querySelector('button');
          const originalText = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Sending...';

          setTimeout(() => {
            btn.textContent = 'Message Sent Successfully!';
            btn.style.backgroundColor = '#27ae60'; // Success green
            this.reset();
            
            setTimeout(() => {
              btn.disabled = false;
              btn.textContent = originalText;
              btn.style.backgroundColor = '';
            }, 3000);
          }, 800);
        });
      }
    }
    return { init };
  })();

  // 5. Scroll Reveal
  const ScrollReveal = (function () {
    function init() {
      const revealTargets = document.querySelectorAll('[data-reveal]');
      if (!('IntersectionObserver' in window)) {
        revealTargets.forEach(el => addClass(el, 'revealed'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay');
            const delayMs = delay ? parseInt(delay, 10) * 120 : 0;
            setTimeout(() => addClass(entry.target, 'revealed'), delayMs);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealTargets.forEach(el => observer.observe(el));
    }
    return { init };
  })();

  // 6. Gallery Filter
  const GalleryFilter = (function () {
    function init() {
      const filterBtns = document.querySelectorAll('.filter-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (!filterBtns.length || !galleryItems.length) return;

      filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          filterBtns.forEach(b => removeClass(b, 'active'));
          addClass(this, 'active');
          const filterValue = this.getAttribute('data-filter');

          galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === category) {
              item.style.display = 'block';
              setTimeout(() => item.classList.remove('fade-out'), 10);
            } else {
              item.classList.add('fade-out');
              setTimeout(() => { if (item.classList.contains('fade-out')) item.style.display = 'none'; }, 400); 
            }
          });
        });
      });
    }
    return { init };
  })();

  // 7. Back-to-Top Button
  const BackToTop = (function () {
    function init() {
      if (!DOM.backToTop) return;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 600) addClass(DOM.backToTop, 'visible');
        else removeClass(DOM.backToTop, 'visible');
      }, { passive: true });
      DOM.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    return { init };
  })();

  // 8. Footer Year
  const FooterYear = (function () {
    function init() { if (DOM.yearSpan) DOM.yearSpan.textContent = new Date().getFullYear(); }
    return { init };
  })();

  // Initialize all
  function init() {
    MobileMenu.init();
    SmoothScroll.init();
    HeaderScroll.init();
    FormFeedback.init();
    ScrollReveal.init();
    GalleryFilter.init();
    BackToTop.init();
    FooterYear.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();