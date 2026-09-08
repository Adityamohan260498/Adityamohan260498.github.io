# adityamohan.github.io

Personal portfolio — Unni Aditya Mohan
Mechanical / Thermal Engineer · MS Robotics, Northeastern University

🔗 **Live at:** [adityamohan.github.io](https://adityamohan.github.io)

## Structure

```
index.html                  Landing page. Projects are compact cards linking out.
projects/*.html             Full project writeups  ── GENERATED, do not edit
content/*.frag              Source of truth for each project writeup  ── EDIT HERE
assets/css/main.css         All styling, shared by every page
assets/js/main.js           Scroll reveal, mobile nav, hero particles, anchor restore
assets/images/<project>/    Figures, contours, CAD views
assets/docs/                Source reports and theses linked from the writeups
assets/images/thumbs/<slug>/  Hover-preview frames  ── GENERATED
tools/build_project_pages.py  content/*.frag  ->  projects/*.html
tools/build_thumbs.py         full-size figures  ->  assets/images/thumbs/
tools/build_resume.py         ->  resume.pdf
```

## Editing a project

1. Edit `content/<slug>.frag` (the writeup body only — no `<head>`, nav or footer).
2. Run `python tools/build_project_pages.py`.

## Adding a project

1. Write `content/<slug>.frag`.
2. Add `(slug, title, meta description)` to `PAGES` in `tools/build_project_pages.py`
   — list order controls the prev/next chain.
3. Add a `<a class="project-card" id="p-<slug>" href="projects/<slug>.html">` card
   to the `.project-index` grid in `index.html`. The `id` must match the slug,
   because each detail page's back link points at `../index.html#p-<slug>` so
   visitors return to the exact card they clicked.
4. Run `python tools/build_project_pages.py`.

## Project card hover previews

Hovering a card on the landing page cycles through result thumbnails, so visitors
can glimpse the work before committing to a click.

To change which images a card previews:

1. Edit the `THUMBS` dict in `tools/build_thumbs.py` — key is the project slug,
   value is an ordered list of repo-relative source image paths. Use the
   full-resolution originals; they get downscaled and centre-cropped to 620×300.
2. Run `python tools/build_thumbs.py`.
3. In `index.html`, make sure that card's `.pc-preview` has one `<img>` per frame
   and one `<i>` in `.pc-dots` per frame. **Only the first image uses `src`** (with
   `class="active"`); every later frame uses `data-src`, so the landing page fetches
   one thumbnail per card instead of all of them. The rest load on first hover.

Cycle speed is `data-interval` in milliseconds on `.pc-preview` (default 1100).
Auto-cycling is disabled for visitors with `prefers-reduced-motion`.

**The ISS thermal card has no photos yet** and falls back to a `.pc-stat` band
showing a headline number. To give it real frames: drop RViz/Gazebo screenshots or
result plots into `assets/images/iss-thermal/`, add an `iss-thermal-control` entry
to `THUMBS`, re-run the script, and swap that card's `.pc-stat` band for an image
band copied from one of the other cards.

## Page layout

Section order on `index.html`:
`Hero → About → Experience → Projects (+ skills rail) → Achievements → Contact`

Skills are **not** a standalone section. They live in `<aside class="skills-rail" id="skills">`,
a sticky column pinned beside the project cards inside `#projects` — so they stay on
screen while someone browses the work. Below 980px the rail unsticks and drops
underneath the cards (`order: 2`). The nav's "Skills" link still resolves, because
the `#skills` id sits on the aside.

To edit skills, edit the `.rail-group` blocks in that aside directly.

## Parked projects

`content/iss-thermal-control.frag` is kept but not published. Its card in
`index.html` is commented out under a `PARKED:` banner, and its entry in `PAGES`
in `tools/build_project_pages.py` is commented out too. To bring it back:
uncomment both, then run `python tools/build_project_pages.py`.

## Cache busting

`index.html` and the generated project pages load `main.css?v=N` / `main.js?v=N`.
**Bump N in both `index.html` and `tools/build_project_pages.py` after changing CSS
or JS**, then re-run `python tools/build_project_pages.py` — otherwise browsers keep
serving the old stylesheet and changes appear not to have applied.

## Rebuilding the résumé

`python tools/build_resume.py` (requires `reportlab`). Text lives in the constants
at the top of that file. Note: body text renders in Helvetica/WinAnsi — Greek
letters and arrows are silently dropped, so use ASCII words instead.
