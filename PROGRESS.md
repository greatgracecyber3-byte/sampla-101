# PROGRESS

## Sept 2026 — Netlify removed from the dashboard entirely

- **`admin.html` now runs on Sveltia CMS** instead of Decap CMS — a
  Decap-compatible editor that authenticates straight against GitHub
  ("Sign in with GitHub" or a pasted personal access token). The
  `base_url`/`auth_endpoint` pointing at `api.netlify.com` is gone.
- **No Netlify anywhere in the setup path.** `DASHBOARD-SETUP.md` no longer
  tells anyone to deploy on Netlify or turn on Identity/Git Gateway; hosting
  is GitHub Pages (or any static host — nothing about the dashboard cares),
  and login is a GitHub sign-in popup or a personal access token.
- **`config.yml`** (kept only as a reference file — `admin.html` doesn't read
  it) had the same Netlify OAuth lines removed.

## What changed in this pass (verified against the site's own files, not just claimed)

- **impact.html rebuilt as a real project database**: 16 documented projects, each in an
  expandable `<details>` card, filterable by 7 categories (Women's Empowerment, Education,
  Health, Water, Youth, Humanitarian, Community Development). Every card shows When / Where /
  Organization / Who benefited / Partners, an evidence tag (Verified — independent source,
  Organization-reported, or Historical record — date being verified), and a real source link
  where one exists.
- **Real sources found and linked** (checked live, 16 Sept 2026):
  - KEMRI — South B Community Medical Camp report
  - KEMRI — South C cancer screening report
  - Pulselive Kenya — seven-county Free Wellness Medical Camp
  - BangBet newsroom — Kako Comprehensive School borehole & food donation
  - SportsDesk.co.ke — Betika/BCLB borehole, Mituvu, Makueni
  - drjanemwikali.com — Foundation history, Business Capital, Water Tank Donation, Borehole
    Drilling Initiatives, CSR Across 32 Counties, Food Donations
  All are labelled by independence level (organization's own site vs. independent media vs.
  government/research-institute source) rather than presented as equally authoritative.
- **Organizational attribution corrected in two places** where the master prompt's own
  caution applied: the Kako widows/orphans event and the Mituvu borehole are sourced to
  Dr. Jane Mwikali personally / her BCLB role, not automatically to External Excellencies
  Global Foundation, because that is what the sources actually say.
- **One claim from the master prompt could not be verified**: the specific "Makueni County
  public-participation document naming Jane Makau as development partner" was not found.
  The Mituvu borehole (Betika/BCLB, independently reported) is used instead, with this
  substitution stated openly rather than hidden.
- **Kako Special School (beds/mattresses/fees)** — no verifiable public post was found, so
  it stays on the archive as "historical record — source being verified" with no invented
  date, exactly as the master prompt requires.
- **Timeline (2017 → 2026)** and **county explorer** (7 counties, only where a sourced
  project exists) added.
- **Sources & Further Reading** section added, grouped Level 1 (KEMRI/official) → Level 2
  (independent media) → Level 3 (organization's own site).
- **Auto-counters are real**: "Documented projects," "Counties reached" and "Project
  categories" are computed in `impact.js` by counting the actual DOM elements on the page,
  not hardcoded.
- **All 60 `href="#"` placeholders fixed site-wide** (index, about, our-work, impact,
  get-involved, stories, contact): footer legal links now point to four new real pages;
  social placeholders became honest "(link coming soon)" text, except Facebook, which links
  to the Foundation's real page.
- **Four new legal pages built**: `privacy.html`, `terms.html`, `safeguarding.html`,
  `accessibility.html`, styled with new `legal.css`, each explicitly marked as a draft
  pending legal review (not published as if final).
- **Validated**: HTML tag balance, CSS brace balance, and JS syntax all checked
  programmatically after the rebuild — see this file's Sept 2026 entry.

## Sept 2026 — layout fixes + photo dashboard

- **Fixed the homepage text/slider collision.** Three causes: (1) the carousel
  dots were pinned at a fixed `bottom: 44px`, so a two-line caption pushed text
  under them; (2) slides used `display:none/block`, so the carousel resized as
  captions changed length; (3) the decorative frame and accent had `z-index:-1`
  without a stacking context on `.hero-visual`, so they painted *behind* the hero
  background instead of behind the photo. Slides now stack in one CSS grid cell
  (fixed height, crossfade), the caption is an overlay with a scrim that reserves
  space for the dots, and `.hero-visual` gets `z-index: 0`.
- **Fixed the tablet nav overlap.** The hamburger only appeared at 640px, so
  between ~700px and 980px seven nav items plus the Donate button ran into the
  logo. The menu panel now takes over at 1024px, with a scrim and a body scroll
  lock behind it.
- **Fixed a sideways scrollbar on narrow phones** caused by the closed off-canvas
  menu (`overflow-x: clip` on `<html>`, plus `visibility` so closed menu links
  stay out of the tab order).
- **Verified**: no hero copy/visual overlap and no horizontal scroll at 320, 390,
  768, 900, 1200 and 1440px; all pages load without JS errors.

### Photo dashboard (upload without touching code)

- All 98 photo boxes across the site now carry a `data-slot` id.
- `admin/config.yml` rebuilt with two sections: **Homepage slider** and
  **Photos across the site** (95 named spots in a dropdown, plus alt text and
  caption fields).
- New `site-images.js` reads `content/images.json` and swaps placeholders for
  real `<img>` tags at page load.
- `admin/index.html` now shows connection instructions if the dashboard can't
  load, instead of a blank page.
- `DASHBOARD-SETUP.md` written for a non-technical user.
- **Still required:** the `repo:` line in `admin/config.yml` must be pointed at a
  real GitHub repository, and Netlify Identity + Git Gateway enabled, before
  anyone can log in.

## Sept 2026 — photo slots cut from 98 to 17, and frames made removable

- **98 slots was too many.** Reduced to 17 named spots by (a) sharing one photo
  across the places it appears — the seven programme photos now fill both the
  Home focus grid and the matching Our Work section, and the founder portrait and
  three story cards work the same way; and (b) replacing the 67 individual Impact
  slots with 16 per-project photo *groups*.
- **Project galleries are now variable-length.** Each Impact project takes a list
  of 0..n photos. First photo becomes the lead image, the rest form a group sized
  to its own count (1 → 60% width, 2 → pair, 4 → 2x2, 5-6 → 3 across), so there
  are never holes in a three-across grid.
- **Empty frames are removed, not left blank.** `site-images.js` deletes every
  unfilled `.ph-photo` and tags the surrounding band with `.media-removed`; new
  CSS collapses two-column bands (`.health-inner`, `.founder-inner`,
  `.program-inner`, `.founder-full-inner`) to a single 68ch column, and gives
  photo-led cards a top rule so the heading has something to sit against. The
  homepage slider is exempt — it always keeps its frames.
- **One dashboard switch** (`settings.showPlaceholders`) brings the labelled grey
  boxes back while photographs are still being collected. Currently ON.
- **Bug found and fixed during testing:** injected captions were being added as
  plain siblings, which made them grid items in two-column bands and pushed the
  text column down a row. Photo and caption are now wrapped in one `<figure>`.
- **Frames are hidden until the loader decides**, so a removed frame never
  flashes on screen first.
- **Verified** on a local HTTP server (fetch does not work over file://) with a
  partial-fill fixture: fills, removals, reflow, per-project galleries, no JS
  errors, and no horizontal scroll on all 8 content pages at 390px and 1280px.

## Sept 2026 — admin/ folder collapsed into one flat file

- **The dashboard was an `admin/` folder** (`admin/index.html` + `admin/config.yml`).
  GitHub's browser drag-and-drop upload kept either dropping the folder
  entirely or nesting it a level too deep (`site-improved/admin/...` instead
  of `admin/...`), which is a common failure mode for non-technical GitHub
  users and was confirmed happening in practice.
- **Replaced with a single file, `admin.html`**, sitting at the site root next
  to `about.html` and `contact.html`. It uploads to GitHub the same way any
  other page does — no folder to lose or misplace.
- The YAML config that used to live in `admin/config.yml` is now a JS object
  (`DASHBOARD_CONFIG`) embedded directly in `admin.html`, loaded via
  `window.CMS_MANUAL_INIT = true` + `CMS.init({ config: DASHBOARD_CONFIG })`
  instead of Decap's default auto-discovered `config.yml`. Converted
  programmatically from the old YAML (via `yaml.safe_load` → `json.dumps`) to
  avoid retyping 18 photo spots and 17 projects by hand.
- All 11 footer links updated from `admin/` to `admin.html`.
- **Verified**: `admin.html` is valid HTML, the embedded JS passes
  `node --check`, and the embedded config parses as valid JSON with all 18
  photo spots and 17 projects intact.
- Setup guide (`DASHBOARD-SETUP.md`) rewritten to match: uploading is now
  "select everything inside the folder and drag it in," and connecting the
  repo means editing one line inside `admin.html` instead of a separate
  `config.yml`.

## Still open before this can go fully live

- Real photography — 17 site spots, the slider, and 16 project groups are all
  still empty. Nothing breaks if they stay empty (frames are removed), but the
  site is currently all text.
- No form backend connected (newsletter, contact, volunteer forms still `action="#"`).
- No payment processor connected on Get Involved.
- `robots.txt` / `sitemap.xml` still reference a placeholder domain.
- Legal pages need review by an actual lawyer/safeguarding specialist before publishing —
  they are honest first drafts, not final policy.
- Kako Special School project and the four pre-2023 medical camps still need their
  original sources located to move from "historical record" to "verified."
