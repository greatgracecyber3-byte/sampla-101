// Impact page — category filter + real auto-counters + stat animation.
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Auto-count documented projects / categories (real DOM count, not invented) ----
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var categorySet = new Set();
  cards.forEach(function (card) {
    (card.getAttribute('data-cats') || '').split(' ').filter(Boolean).forEach(function (c) {
      categorySet.add(c);
    });
  });
  var countyCards = document.querySelectorAll('.county-card').length;

  var projectsEl = document.getElementById('stat-projects');
  var categoriesEl = document.getElementById('stat-categories');
  var countiesEl = document.getElementById('stat-counties');
  if (projectsEl) projectsEl.setAttribute('data-count', String(cards.length));
  if (categoriesEl) categoriesEl.setAttribute('data-count', String(categorySet.size));
  if (countiesEl) countiesEl.setAttribute('data-count', String(countyCards));

  // ---- Animate every stat number on scroll into view ----
  var statEls = document.querySelectorAll('.dash-number[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { observer.observe(el); });
  } else {
    statEls.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  // ---- Category filter ----
  var filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cats') || '').split(' ');
        var show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.hidden = !show;
      });
    });
  });
});
