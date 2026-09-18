/* ============================================================
   site-images.js — photo frames, filled or removed from /admin
   ------------------------------------------------------------
   Three things happen here, in this order:

   1. Photos you uploaded get dropped into their frames.
   2. Photo groups on the Our Impact projects get built from a list,
      so a project can have no photos, one, or six.
   3. Any frame you did NOT fill is REMOVED from the page entirely,
      and the section around it is told to close the gap. Nothing is
      left behind — no empty box, no reserved space.

   Step 3 is the default. While you are still collecting photographs
   you can switch it off in the dashboard under Display settings, and
   the labelled placeholder boxes come back.
   ============================================================ */
(function () {
  'use strict';

  var SETTINGS = { showPlaceholders: false };

  /* ---------- helpers ---------------------------------------- */

  function makeImg(entry, className) {
    var img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.alt || entry.caption || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = className;
    return img;
  }

  // Swap a placeholder box for a real photo, keeping the box's shape.
  function fillFrame(box, entry) {
    box.classList.remove('ph-photo');
    box.classList.add('has-photo');
    box.innerHTML = '';
    box.appendChild(makeImg(entry, 'slot-img'));

    if (!entry.caption) return;

    // The caption must travel WITH the photo. Dropping it in as a plain
    // sibling turns it into a grid item of its own, which shunts the text
    // column of any two-column band down a row. Wrapping keeps one item.
    var fig = document.createElement('figure');
    fig.className = 'slot-figure';
    box.parentNode.insertBefore(fig, box);
    fig.appendChild(box);

    var cap = document.createElement('figcaption');
    cap.className = 'slot-caption';
    cap.textContent = entry.caption;
    fig.appendChild(cap);
  }

  /* ---------- 3. removal + reflow ------------------------------
     Some frames sit in a two-column band (the health feature, the
     founder block, each Our Work programme row). Removing the photo
     from one of those leaves a half-empty grid, so we mark the parent
     and let the stylesheet collapse it to a single column.          */

  var REFLOW_PARENTS = [
    '.health-inner', '.founder-inner', '.founder-full-inner',
    '.program-inner', '.focus-card', '.story-card', '.impact-story-card',
    '.latest-card', '.project-full',
    '.featured-programme-inner', '.prog-hero-inner'
  ];

  function markReflow(parent) {
    REFLOW_PARENTS.forEach(function (sel) {
      var band = parent && parent.closest(sel);
      if (band && !band.querySelector('img.slot-img, .ph-photo')) {
        band.classList.add('media-removed');
      }
    });
  }

  function clearUnfilled() {
    if (SETTINGS.showPlaceholders) return;

    document.querySelectorAll('.ph-photo').forEach(function (box) {
      // the homepage slider always keeps its frames — a slider with no
      // frame is not a slider
      if (box.closest('.hero-carousel')) return;
      var parent = box.parentElement;
      box.remove();
      markReflow(parent);
    });

    // a photo group with nothing left in it should not leave a gap either
    document.querySelectorAll('.project-gallery, .prog-gallery').forEach(function (g) {
      if (!g.querySelector('img')) {
        var cap = g.nextElementSibling;
        if (cap && cap.classList.contains('gallery-caption')) cap.remove();
        var parent = g.parentElement;
        g.remove();
        markReflow(parent);
      }
    });

    // Unverified numbers work the same way as unfilled photos: rather than
    // ever inventing a figure, an unfilled stat is removed — not shown with
    // a placeholder, not shown with a guessed number. Real figures replace
    // this removal once they exist and are entered in the dashboard.
    document.querySelectorAll('.stat-placeholder').forEach(function (span) {
      var stat = span.closest('.impact-stat');
      if (stat) stat.remove();
    });
    // Only the programme "Impact" figures on Our Work are stripped this
    // way — contact details (address/phone/email) are left as visible
    // placeholders instead of being deleted, since a contact page with no
    // way to reach the Foundation at all is worse than one that says so.
    document.querySelectorAll('.program-fields > div').forEach(function (field) {
      if (field.querySelector('.ph-inline')) field.remove();
    });
  }

  /* ---------- 1. named frames -------------------------------- */

  function applyPhotos(list) {
    list.forEach(function (entry) {
      if (!entry || !entry.slot || !entry.image) return;
      // one entry can fill the same spot in more than one place — the
      // seven programme photos appear on both Home and Our Work
      document.querySelectorAll('[data-slot="' + entry.slot + '"]').forEach(function (box) {
        fillFrame(box, entry);
      });
    });
  }

  /* ---------- 2. project photo groups ------------------------ */

  function applyProjects(list) {
    list.forEach(function (proj) {
      if (!proj || !proj.project) return;
      var block = document.querySelector('[data-project="' + proj.project + '"]');
      if (!block) return;

      var photos = (proj.photos || []).filter(function (p) { return p && p.image; });
      if (!photos.length) return;            // leave it — clearUnfilled removes it

      var lead = block.querySelector('.project-full-media');
      var gallery = block.querySelector('.project-gallery, .prog-gallery');

      if (lead) fillFrame(lead, photos[0]);
      var rest = photos.slice(lead ? 1 : 0);

      if (!gallery) return;
      gallery.innerHTML = '';
      if (!rest.length) {
        var cap = gallery.nextElementSibling;
        if (cap && cap.classList.contains('gallery-caption')) cap.remove();
        gallery.remove();
        return;
      }
      rest.forEach(function (p) {
        var cell = document.createElement('div');
        cell.className = 'project-gallery-item prog-gallery-item has-photo';
        cell.appendChild(makeImg(p, 'slot-img'));
        gallery.appendChild(cell);
      });
      // 1, 2, 4 or 6 photos should each look deliberate, rather than a
      // three-across grid with holes in it
      gallery.setAttribute('data-count', Math.min(rest.length, 6));
    });
  }

  /* ---------- go --------------------------------------------- */

  function finish() {
    clearUnfilled();
    document.documentElement.classList.add('photos-ready');
  }

  fetch('content/images.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data) {
        if (data.settings && typeof data.settings.showPlaceholders === 'boolean') {
          SETTINGS.showPlaceholders = data.settings.showPlaceholders;
        }
        if (Array.isArray(data.photos)) applyPhotos(data.photos);
        if (Array.isArray(data.projects)) applyProjects(data.projects);
      }
      finish();
    })
    .catch(finish);
})();
