// External Excellencies Global Foundation — Stage 1 interactions
document.addEventListener('DOMContentLoaded', function () {

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    // Dim + lock the page behind the menu panel so the nav links never read
    // as if they are sitting on top of the page content.
    var scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);

    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAllDropdowns();
    }

    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    // close menu when a plain nav link (not a dropdown toggle) is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  // Nav dropdowns (About Us / Our Work / Get Involved) — click to open,
  // like a standard multi-level nav. Works the same on desktop and mobile.
  var dropdownItems = Array.prototype.slice.call(document.querySelectorAll('.has-dropdown'));
  function closeAllDropdowns(except) {
    dropdownItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var btn = item.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  dropdownItems.forEach(function (item) {
    var btn = item.querySelector('.dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) closeAllDropdowns(item);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) closeAllDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Hero image carousel — auto-fetches uploaded photos from content/gallery.json
  // (written by the /admin image dashboard). Falls back to the placeholder
  // slides already in the HTML if that file is empty or missing.
  var heroCarousel = document.getElementById('hero-carousel');
  if (heroCarousel) {
    var track = document.getElementById('hero-carousel-track');
    var dotsWrap = document.getElementById('hero-dots');
    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');
    var current = 0;
    var timer = null;

    function getSlides() { return Array.prototype.slice.call(track.querySelectorAll('.hero-slide')); }

    function buildDots() {
      var slides = getSlides();
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to photo ' + (i + 1));
        if (i === current) b.classList.add('is-active');
        b.addEventListener('click', function () { goTo(i); restart(); });
        dotsWrap.appendChild(b);
      });
    }

    function goTo(index) {
      var slides = getSlides();
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      var dots = dotsWrap.querySelectorAll('button');
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });
    heroCarousel.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    heroCarousel.addEventListener('mouseleave', restart);

    // Try to load images uploaded via the admin dashboard
    fetch('content/gallery.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && Array.isArray(data.slides) && data.slides.length) {
          track.innerHTML = data.slides.map(function (s, i) {
            return '<div class="hero-slide' + (i === 0 ? ' is-active' : '') + '">' +
              '<img class="visual-block ph-photo" src="' + s.image + '" alt="' + (s.caption || '') + '">' +
              (s.caption ? '<p class="hero-slide-caption">' + s.caption + '</p>' : '') +
              '</div>';
          }).join('');
        }
        buildDots();
        restart();
      })
      .catch(function () { buildDots(); restart(); });
  }

  // Scroll cue: jump to next section
  var cue = document.getElementById('scroll-cue');
  if (cue) {
    cue.addEventListener('click', function () {
      var next = document.getElementById('focus');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Verified stat counter — runs once when it enters the viewport
  var statEl = document.querySelector('.stat-number[data-count]');
  if (statEl && 'IntersectionObserver' in window) {
    var target = parseInt(statEl.getAttribute('data-count'), 10) || 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var animateCount = function () {
      if (reduceMotion) {
        statEl.textContent = target;
        return;
      }
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        statEl.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else statEl.textContent = target;
      }
      requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statEl);
  } else if (statEl) {
    statEl.textContent = statEl.getAttribute('data-count');
  }

});
