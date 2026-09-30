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
assets/videos/<slug>/       Clips shown on the detail page + card hover loops
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

## Video

There is no ffmpeg on the PATH, but a full static build ships inside the imageio
wheel and works fine:

```
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
$FF -i clip.gif -movflags +faststart -an \
   -vf "scale='min(720,iw)':-2:flags=lanczos,format=yuv420p" \
   -c:v libx264 -preset slow -crf 30 -profile:v main out.mp4
```

Convert screen-capture GIFs before committing them — the FASTER clips went from
49 MB of GIF to 1.7 MB of H.264 at the same visible quality. Crop RViz/Gazebo
UI panels out while you are there (`crop=iw-54:ih-16:54:16` style).

**On a detail page**, two clips side by side use `.video-grid` (one `<figure>` per
clip, `<figcaption>` for the caption); a single full-width clip uses
`.project-video`. Always set `poster=`. Give the one or two clips that carry the
result `autoplay loop muted playsinline controls`; give everything below the fold
`controls preload="none"` so it costs nothing until clicked.

Note `poster=` is rewritten to `../assets/...` by `build_project_pages.py` along
with `src=` and `href=`, so write it repo-relative like everything else.

**On a project card**, a clip can play on hover. Add a `<video>` with `data-src`
(not `src`) inside `.pc-preview`, after the four `<img>` frames:

```html
<video data-src="assets/videos/<slug>/card-loop.mp4" loop muted playsinline
       preload="none" aria-hidden="true" tabindex="-1"></video>
```

`main.js` fetches and plays it on hover and pauses on leave. Keep the four stills
in the markup — they are the fallback when JS is off, when autoplay is blocked,
and under `prefers-reduced-motion`, where the video is never shown at all. Build
the loop at the band's own aspect ratio (620x300) so nothing is cropped twice:

```
$FF -i source.mp4 -an -t 10 -vf "crop=iw:ih*0.56:0:ih*0.30,scale=620:300" \
   -c:v libx264 -crf 33 assets/videos/<slug>/card-loop.mp4
```

Swap the card's `.pc-hint` text to "Hover to play" so the affordance is honest.

## Page layout

Section order on `index.html`:
`Hero → About → Experience → Projects (+ skills rail) → Achievements → Contact`

Skills are **not** a standalone section. They live in `<aside class="skills-rail" id="skills">`,
a sticky column pinned beside the project cards inside `#projects` — so they stay on
screen while someone browses the work. Below 980px the rail unsticks and drops
underneath the cards (`order: 2`). The nav's "Skills" link still resolves, because
the `#skills` id sits on the aside.

To edit skills, edit the `.rail-group` blocks in that aside directly.

## In-progress projects

Live projects get two markers, so a reader is never guessing how finished the
work is:

- **On the card**, a `<span class="pc-wip">In progress</span>` inside
  `.pc-preview` — renders as a small pip in the top-left of the preview band.
- **On the detail page**, a `.wip-banner` immediately after `.featured-header`:

```html
<div class="wip-banner">
  <span class="wip-tag">In progress</span>
  <div class="wip-text">
    <b>Working today:</b> ... <b>Being built now:</b> ...
  </div>
</div>
```

Say what currently works and what is still open, in that order. A negative
result belongs in the writeup rather than being trimmed out — the kitchen
project reports a collapsed SAC run with the diagnostic, which is more useful
to a reader than an omission.

Use `In Progress · <domain>` rather than `Featured · <domain>` in
`.featured-label`, and an open-ended date (`Sep 2026 – ongoing`).

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
