# Photo dashboard — setup and daily use

The site has a dashboard at **`admin.html`**: a login screen, a file picker, an
upload button and a Publish button. You never need to touch code to change a
photo. It's one plain file — uploads to GitHub exactly like `about.html` or
`contact.html` does, no folder involved.

There are **18 photo spots** around the site, plus the homepage slider, plus
one photo group per project on Our Impact and one for the Accelerator 2026
programme gallery. Every one of them is optional.

---

## The idea in one paragraph

You add a photo only where you actually have one. Any spot you leave empty has
its frame **removed from the live site**, and the layout closes the gap — a
two-column band becomes one full-width column of text, a card loses its image
area and leads with its heading, a project with no pictures shows no photo area
at all. There are no empty grey boxes and no reserved space. Delete a photo
later and the same thing happens in reverse.

The homepage slider is the one exception: it always keeps its frames, because a
slider with no frames is not a slider.

---

## Part 1 — Connect it (once, about 5 minutes)

1. **Put the site in a GitHub repository.** Create a free account at
   github.com, make a new repository. Then open the unzipped site folder on
   your computer, select everything inside it (Ctrl+A / Cmd+A — you should see
   every individual file and folder highlighted, not one single folder icon),
   and drag all of it into the repository at once.

2. **Point the dashboard at your repository.** Open `admin.html` in a text
   editor, search for this line near the bottom of the file:

   ```
   "repo": "YOUR-GITHUB-USERNAME/YOUR-REPO-NAME",
   ```

   and change it to your real one, e.g. `"repo": "janemakau/eegf-website",`
   — keep the quotes and the comma exactly as they are. Save the file, then
   re-upload just this one file to GitHub: **Add file → Upload files → drag in
   `admin.html` → Commit changes.**

3. **Turn on GitHub Pages (or whatever host you use).** In your repository on
   GitHub: **Settings → Pages → Deploy from a branch → `main`**. Your site
   goes live at `https://your-username.github.io/your-repo-name/` a minute
   or two later. (If you host elsewhere, this step is whatever your host
   normally asks for — nothing about the dashboard changes.)

4. Go to `yoursite.com/admin.html`, enter the door password
   (`KaribuKenya@23`, unless you've changed it), then click **Sign in with
   GitHub** and approve the popup. That's it — there's no separate service to
   configure. The first time, GitHub will ask you to authorize the one-time
   sign-in; approve it and you're in the editor.

   If the popup gets blocked or you'd rather not use the popup flow, use a
   **personal access token** instead: on GitHub go to **Settings → Developer
   settings → Personal access tokens → Fine-grained tokens → Generate new
   token**, give it read/write access to "Contents" on just this repository,
   then paste that token into the dashboard's sign-in screen.

### Seeing it before you do any of that

Serve the folder locally (for example `python3 -m http.server` in the site
folder) and open `admin.html` in a browser. The password screen works
immediately. The editor behind it needs the repository connected (step 2) to
save changes — until then you'll see a "not connected yet" message, which is
expected.

---

## Part 2 — The three things you can do

### Homepage slider

The rotating photos at the top of the home page.

**Add Slide** → upload → caption → drag to reorder → **Publish**.
Remove a slide by deleting its entry. Two slides is fine; so is eight.

### Photos around the site — 18 spots

**Add Photo** → pick the spot from the dropdown → upload → **Publish**.

Seven of the spots are the **programme photos** (Women's Empowerment, Youth,
Health, Education, Economic, Leadership, Community). Each of those appears in
**two places at once** — the Home page grid and the matching Our Work section —
so you upload once and it lands in both. The founder portrait and the three
story cards work the same way. The **Accelerator 2026 official graphic** is
shared between the homepage teaser banner and its section on the Our Work page.

The full list:

| Spot | Appears on |
|---|---|
| Accelerator 2026 — official programme graphic | Home + Our Work |
| Programme — Women's Empowerment | Home + Our Work |
| Programme — Youth Development | Home + Our Work |
| Programme — Health | Home |
| Programme — Education & Skills | Home + Our Work |
| Programme — Economic Empowerment | Home + Our Work |
| Programme — Leadership | Home + Our Work |
| Programme — Community Development | Home + Our Work |
| Feature — medical outreach band | Home + Our Work |
| Portrait — Rev. Dr. Jane Mwikali Makau | Home + About |
| Story cards 1, 2, 3 | Home + Stories |
| Latest news cards 1, 2, 3 | Home |
| Contact — map or office photo | Contact |
| Story template — main photo | Story template |

**To remove a photo**, delete its entry and Publish. The frame disappears and
the page closes up.

### Project photos (Our Impact + Accelerator 2026)

**Add Project** → pick one of the 16 Impact projects, or "Accelerator 2026 —
programme gallery" → add as many photos as you have.

- For an Impact project, the **first** photo becomes the large one at the top;
  the rest form a group underneath, sized to however many there are.
- For the Accelerator gallery, every photo you add joins its 6-photo grid on
  the Our Work page (orientation day, training, mentorship, KIRDI activities —
  whatever you actually have).
- A project or gallery you never add photos to shows **no photo area at all**
  — the text just runs.

### The one switch: Display settings

At the top of "Photos around the site" there is a single toggle:

> **Show labelled empty boxes while collecting photos**

It is currently **on**, so you still see the grey `[ADD PHOTO — …]` boxes,
which is useful while you are gathering pictures and want to know what to look
for. **Turn it off** once you're happy the site can stand on the photos you
have — every unfilled frame is then removed from the live site and the layout
closes up.

---

## Photo guidelines

- **Size:** at least 1200px on the long edge. Straight from a phone is fine.
- **Shape:** slider frames are portrait; most others are landscape. The site
  crops to fit, so keep the subject near the middle.
- **Weight:** aim under ~500 KB per file so pages load on mobile data.
  squoosh.app shrinks photos free in the browser.
- **Alt text:** one sentence saying what is in the picture. This is what a
  blind visitor hears and what Google reads. Worth the ten seconds.
- **Consent:** for any recognisable person, especially a child, be sure you
  have permission to publish before uploading. This matters more than the
  photo does.

---

## How it works, briefly

Each photo frame carries a `data-slot` label (`data-slot="programme-women"`),
and each project or gallery carries `data-project="p01"` or
`data-project="accelerator-2026"`. Publishing writes your choices to
`content/images.json` and saves the files into `images/gallery/`. On page
load, `site-images.js` fills the frames it has photos for, builds the project
groups, then deletes every remaining empty frame and tags the section around
it so the stylesheet can close the gap.

If you ever add a new photo frame to a page, give it a `data-slot` of its own
and add a matching line to the `options` list inside `admin.html` (search for
`DASHBOARD_CONFIG` near the bottom of the file).
