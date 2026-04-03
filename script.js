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
            btn.style.backgroundColor = '#27ae60';
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

  const Lightbox = (function () {
    let currentImages = [];
    let currentIndex = 0;

    function init() {
      const modal = document.getElementById('lightbox');
      if (!modal) return;

      const imgEl = document.getElementById('lightboxImage');
      const counterEl = document.getElementById('lightboxCounter');
      const prevBtn = document.getElementById('lightboxPrev');
      const nextBtn = document.getElementById('lightboxNext');
      const closeBtn = document.getElementById('lightboxClose');
      const triggers = document.querySelectorAll('.js-lightbox-trigger');

      triggers.forEach(trigger => {
        const imgs = trigger.querySelectorAll('img');
        if (imgs.length > 1) {
          const indicator = document.createElement('div');
          indicator.className = 'gallery-indicator';
          indicator.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${imgs.length} Photos`;
          trigger.appendChild(indicator);
        }

        trigger.addEventListener('click', () => {
          currentImages = Array.from(imgs).map(img => img.src);
          currentIndex = 0;
          updateView();
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });

      function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      function updateView() {
        imgEl.src = currentImages[currentIndex];
        counterEl.textContent = `${currentIndex + 1} / ${currentImages.length}`;

        if (currentImages.length <= 1) {
          prevBtn.style.display = 'none';
          nextBtn.style.display = 'none';
          counterEl.style.display = 'none';
        } else {
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'flex';
          counterEl.style.display = 'block';
        }
      }

      closeBtn.addEventListener('click', closeModal);
      
      prevBtn.addEventListener('click', () => {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex === 0) ? currentImages.length - 1 : currentIndex - 1;
        updateView();
      });

      nextBtn.addEventListener('click', () => {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex === currentImages.length - 1) ? 0 : currentIndex + 1;
        updateView();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft' && currentImages.length > 1) {
          currentIndex = (currentIndex === 0) ? currentImages.length - 1 : currentIndex - 1;
          updateView();
        }
        if (e.key === 'ArrowRight' && currentImages.length > 1) {
          currentIndex = (currentIndex === currentImages.length - 1) ? 0 : currentIndex + 1;
          updateView();
        }
      });
    }

    return { init };
  })();

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

  const FooterYear = (function () {
    function init() { if (DOM.yearSpan) DOM.yearSpan.textContent = new Date().getFullYear(); }
    return { init };
  })();

  function init() {
    MobileMenu.init();
    SmoothScroll.init();
    HeaderScroll.init();
    FormFeedback.init();
    ScrollReveal.init();
    GalleryFilter.init();
    Lightbox.init(); 
    BackToTop.init();
    FooterYear.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();