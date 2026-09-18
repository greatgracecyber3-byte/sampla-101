/* ============================================================
   custom-photos.js — freeform photo frames, added from /admin
   ------------------------------------------------------------
   Unlike the named spots in site-images.js (fixed positions,
   filled from a dropdown), these are EXTRA frames you create
   yourself: pick which page they belong to, pick a shape, upload
   a photo, hit Publish. They land in that page's "Photo gallery"
   section, in the order you added them.

   A page with none added shows no gallery section at all — same
   "no empty boxes" rule as the rest of the site.
   ============================================================ */
(function () {
  'use strict';

  var FRAME_CLASS = {
    square: 'cf-square',
    portrait: 'cf-portrait',
    landscape: 'cf-landscape',
    wide: 'cf-wide'
  };

  function render(zone, entries) {
    var section = document.querySelector('.custom-gallery[data-zone="' + zone + '"]');
    if (!section) return;
    var grid = section.querySelector('.custom-gallery-grid');
    if (!entries.length || !grid) { section.remove(); return; }

    entries.forEach(function (entry) {
      if (!entry || !entry.image) return;
      var frameClass = FRAME_CLASS[entry.frameType] || FRAME_CLASS.landscape;

      var fig = document.createElement('figure');
      fig.className = 'custom-frame ' + frameClass;

      var img = document.createElement('img');
      img.src = entry.image;
      img.alt = entry.alt || entry.caption || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      fig.appendChild(img);

      if (entry.caption) {
        var cap = document.createElement('figcaption');
        cap.textContent = entry.caption;
        fig.appendChild(cap);
      }
      grid.appendChild(fig);
    });

    section.classList.add('has-photos');
  }

  fetch('content/custom-photos.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      var byZone = {};
      if (data && Array.isArray(data.photos)) {
        data.photos.forEach(function (p) {
          if (!p || !p.zone) return;
          (byZone[p.zone] = byZone[p.zone] || []).push(p);
        });
      }
      document.querySelectorAll('.custom-gallery').forEach(function (section) {
        var zone = section.getAttribute('data-zone');
        render(zone, byZone[zone] || []);
      });
    })
    .catch(function () {
      // No data yet — remove every gallery section rather than show empty ones
      document.querySelectorAll('.custom-gallery').forEach(function (s) { s.remove(); });
    });
})();
