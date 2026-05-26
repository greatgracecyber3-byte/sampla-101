/* ============================================================
   SOLTECH ELECTRICAL — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. MOBILE MENU ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileNav.classList.toggle('open', !isOpen);
      // prevent body scroll when menu open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || href.split('#')[0] === currentPage ||
        (currentPage === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 5. HERO SLIDESHOW ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (slides.length) {
    let current = 0;
    const showSlide = (n) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === n));
      dots.forEach((d,  i) => d.classList.toggle('active', i === n));
      current = n;
    };
    dots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)));
    let timer = setInterval(() => showSlide((current + 1) % slides.length), 5000);
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', () => clearInterval(timer));
      heroEl.addEventListener('mouseleave', () => {
        timer = setInterval(() => showSlide((current + 1) % slides.length), 5000);
      });
    }
    showSlide(0);
  }

  /* ── 6. COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString();
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── 7. FAQ ACCORDION ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(f => f.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 8. GALLERY FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        galleryItems.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.opacity   = show ? '1'      : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(0.92)';
          item.style.pointerEvents = show ? 'all' : 'none';
          item.style.position  = show ? 'relative' : 'absolute';
        });
      });
    });
  }

  /* ── 9. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 10. TESTIMONIALS SLIDER ── */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');
  if (testimonialSlides.length && prevBtn && nextBtn) {
    let tCurrent = 0;
    const showTesti = (n) => {
      testimonialSlides.forEach((s, i) => s.classList.toggle('active', i === n));
      tCurrent = n;
    };
    nextBtn.addEventListener('click', () => showTesti((tCurrent + 1) % testimonialSlides.length));
    prevBtn.addEventListener('click', () => showTesti((tCurrent - 1 + testimonialSlides.length) % testimonialSlides.length));
    showTesti(0);
    setInterval(() => showTesti((tCurrent + 1) % testimonialSlides.length), 6000);
  }

  /* ── 11. CONTACT FORM SUCCESS ── */
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:.95rem;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);white-space:nowrap;';
    banner.textContent = '✅ Message sent! We\'ll respond within 2 hours.';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 5000);
  }

});
