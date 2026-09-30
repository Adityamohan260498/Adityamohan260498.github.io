#!/usr/bin/env python3
"""Builds the hover-preview thumbnails used by the project cards on index.html.

Each project card cycles through a few "result" frames on hover. Source images
are full-resolution figures (some are 2000px / 200KB+); loading four of those per
card would make the landing page heavy, so they get downscaled here.

Output:  assets/images/thumbs/<slug>/01.jpg, 02.jpg, ...

To change what a card previews, edit THUMBS below and re-run:
    python tools/build_thumbs.py

To add frames from your own images, drop them anywhere under assets/images/
and list their paths in the right slug.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WIDTH = 620          # rendered at ~310px CSS width, so 2x for retina
QUALITY = 74
BOX = (620, 300)     # crop box — cards show a 2.07:1 letterbox band

# slug -> ordered list of source images (repo-relative)
THUMBS = {
    "g1-locomotion": [
        "assets/images/g1/seq-1.jpg",
        "assets/images/g1/seq-2.jpg",
        "assets/images/g1/seq-3.jpg",
        "assets/images/g1/seq-4.jpg",
    ],
    "kitchen-pick-place": [
        "assets/images/kitchen/grounding-carrot.png",
        "assets/images/kitchen/expert-still.jpg",
        "assets/images/kitchen/pipeline-still.jpg",
        "assets/images/kitchen/cam-arm.png",
    ],
    "faster-dynamic": [
        "assets/images/faster/rviz-forest.jpg",
        "assets/images/faster/gazebo-corridor.jpg",
        "assets/images/faster/rviz-corridor.jpg",
        "assets/images/faster/gazebo-forest.jpg",
    ],
    "metal-hydride-reactor": [
        "assets/images/hydrogen-storage/bed-temp-50s.jpg",
        "assets/images/hydrogen-storage/bed-temp-200s.jpg",
        "assets/images/hydrogen-storage/3d-model-annotated.jpg",
        "assets/images/hydrogen-storage/2d-model-60ect.jpg",
    ],
    "humidity-chamber": [
        "assets/images/humidity-chamber/hx-temp-front.jpg",
        "assets/images/humidity-chamber/hx-velocity-streamlines.jpg",
        "assets/images/humidity-chamber/nozzle-vof-multiorifice.jpg",
        "assets/images/humidity-chamber/hx-iso-cad.jpg",
    ],
    "effi-cycle": [
        "assets/images/effi-cycle/stress.png",
        "assets/images/effi-cycle/deformation.png",
        "assets/images/effi-cycle/fos.png",
        "assets/images/effi-cycle/cad-topview.png",
    ],
    # iss-thermal-control: no result images captured yet. Drop screenshots
    # (RViz / Gazebo / plots) into assets/images/iss-thermal/ and list them
    # here, then re-run this script and add the markup per README.
}


def fit(im, box):
    """Scale to cover the box, then centre-crop. Keeps aspect, no letterboxing."""
    tw, th = box
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = max(1, round(sw * scale)), max(1, round(sh * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def build():
    made = []
    for slug, sources in THUMBS.items():
        outdir = os.path.join(ROOT, "assets", "images", "thumbs", slug)
        os.makedirs(outdir, exist_ok=True)
        for i, rel in enumerate(sources, 1):
            src = os.path.join(ROOT, rel)
            if not os.path.exists(src):
                print("  !! missing source: %s" % rel)
                continue
            im = Image.open(src)
            if im.mode in ("RGBA", "LA", "P"):
                bg = Image.new("RGB", im.size, (10, 10, 18))
                im = im.convert("RGBA")
                bg.paste(im, mask=im.split()[-1])
                im = bg
            else:
                im = im.convert("RGB")
            out = os.path.join(outdir, "%02d.jpg" % i)
            fit(im, BOX).save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            made.append((slug, i, os.path.getsize(out)))
    return made


if __name__ == "__main__":
    rows = build()
    total = sum(n for _, _, n in rows)
    for slug, i, n in rows:
        print("assets/images/thumbs/%s/%02d.jpg  %5.1f KB" % (slug, i, n / 1024))
    print("\n%d frames, %.0f KB total" % (len(rows), total / 1024))
