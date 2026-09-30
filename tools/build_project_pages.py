#!/usr/bin/env python3
"""Generates projects/*.html detail pages from the fragments in content/.

SOURCE OF TRUTH: content/<slug>.frag holds each project's writeup.
Edit the .frag, then re-run this script. Editing projects/*.html directly
works until the next run, which overwrites it.

Each page = shared nav + sticky back-bar + the project's full writeup + prev/next.
The back link carries the card's anchor (#p-<slug>) so returning to index.html
lands on the exact card the visitor clicked.

Run:  python tools/build_project_pages.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# order controls the prev/next chain and matches the card order on index.html
PAGES = [
    ("g1-locomotion", "Unitree G1 · RL Locomotion from Simulation onto the Real Robot",
     "Reinforcement-learning locomotion for a 29-DoF Unitree G1 humanoid, trained in mjlab / MuJoCo Warp "
     "under a system-identification randomisation curriculum and deployed to the physical robot at 50 Hz "
     "over CycloneDDS, with the measured hardware limits written down."),
    ("kitchen-pick-place", "Kitchen Semantic Pick-and-Place · VLM Grounding into Asymmetric RL",
     "A Franka Panda in a randomised MuJoCo kitchen that follows natural-language instructions: an OWLv2 "
     "grounding pipeline measured at 98% recall and 95% grasp validity, whose measured error becomes the "
     "noise model an asymmetric SAC policy trains against."),
    ("faster-dynamic", "FASTER+Predict · High-Speed Flight Through Moving Obstacles",
     "Reproduction of the FASTER trajectory planner in 2-D and in ROS/Gazebo, plus FASTER+Predict: a "
     "constant-velocity obstacle predictor and two-boundary grid inflation that restores the planner's "
     "safety guarantee in dynamic environments without modifying its MIQP."),
    ("metal-hydride-reactor", "Metal Hydride Hydrogen Storage Reactor",
     "Transient thermal and reacting porous-media simulation of a 30 bar metal hydride "
     "hydrogen storage vessel in COMSOL, with a fin array trade study against a parasitic mass budget."),
    ("humidity-chamber", "Humidity Chamber · Cross-Flow Cooling & Atomizer Humidification",
     "Design and multiphase CFD of a two-unit environmental test chamber: cross-flow finned "
     "heat exchanger and atomizer-fed humidification, analyzed in ANSYS Fluent."),
    # PARKED — re-enable this entry and uncomment the matching card in index.html
    # to bring the ISS project back. Source: content/iss-thermal-control.frag
    # ("iss-thermal-control", "ISS Active Thermal Control System · ROS 2 & Gazebo",
    #  "Two-stage water-to-ammonia active thermal control for a space station, implemented in "
    #  "C++ on ROS 2 with a URDF-derived lumped-capacitance conduction network."),
    ("effi-cycle", "SAE Effi-Cycle · Chassis & Suspension Design",
     "CAD and structural FEA of a 15 kg human-electric hybrid vehicle chassis and suspension, "
     "validated across four impact and torsion load cases in ANSYS Workbench."),
]

TEMPLATE = """<!DOCTYPE html>
<!-- GENERATED FILE: do not edit directly.
     Source: content/{slug}.frag   Rebuild: python tools/build_project_pages.py -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title_plain} · Unni Aditya Mohan</title>
  <meta name="description" content="{desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/main.css?v=5">
</head>
<body>

<!-- ════════════════════════════════════════════ NAV ════════════════════════════════════════════ -->
<nav>
  <div class="nav-inner">
    <a class="nav-logo" href="../index.html">ADITYA<span>.</span></a>
    <button class="hamburger" onclick="document.querySelector('.nav-links').classList.toggle('open')" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
      <li><a href="../index.html#about">About</a></li>
      <li><a href="../index.html#experience">Experience</a></li>
      <li><a href="../index.html#projects">Projects</a></li>
      <li><a href="../index.html#skills">Skills</a></li>
      <li><a href="../index.html#contact">Contact</a></li>
    </ul>
  </div>
</nav>

<!-- ════════════════════════════════════════════ BACK BAR ════════════════════════════════════════════ -->
<div class="backbar">
  <div class="backbar-inner">
    <a class="back-link" href="../index.html#p-{slug}"><span>←</span> All projects</a>
    <span class="backbar-title">{title_plain}</span>
  </div>
</div>

<!-- ════════════════════════════════════════════ PROJECT ════════════════════════════════════════════ -->
<section id="projects" class="project-detail">
  <div class="section-inner">

{block}
    <nav class="page-nav" aria-label="Project navigation">
{prevnext}
    </nav>

  </div>
</section>

<footer>
  <p>Designed &amp; built by Unni Aditya Mohan · © 2026</p>
</footer>

<script src="../assets/js/main.js?v=5"></script>
</body>
</html>
"""


def strip_tags(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip()


def build():
    out = []
    for i, (slug, title, desc) in enumerate(PAGES):
        frag = open(os.path.join(ROOT, 'content', slug + '.frag'), encoding='utf-8').read()

        # re-root relative asset paths one level up (projects/ -> repo root).
        # poster= is in here for <video> thumbnails, which would otherwise 404.
        frag = re.sub(r'(\b(?:src|href|poster)=")(assets/)', r'\1../\2', frag)

        links = []
        if i > 0:
            p = PAGES[i - 1]
            links.append('      <a href="%s.html">← %s</a>' % (p[0], strip_tags(p[1])))
        else:
            links.append('      <a href="../index.html#projects">← All projects</a>')
        if i < len(PAGES) - 1:
            n = PAGES[i + 1]
            links.append('      <a href="%s.html">%s →</a>' % (n[0], strip_tags(n[1])))
        else:
            links.append('      <a href="../index.html#projects">All projects →</a>')

        html = TEMPLATE.format(
            title_plain=strip_tags(title),
            desc=desc.replace('"', '&quot;'),
            slug=slug,
            block=frag.rstrip() + '\n',
            prevnext='\n'.join(links),
        )
        path = os.path.join(ROOT, 'projects', slug + '.html')
        open(path, 'w', encoding='utf-8').write(html)
        out.append((slug, len(html)))
    return out


if __name__ == '__main__':
    os.makedirs(os.path.join(ROOT, 'projects'), exist_ok=True)
    for slug, n in build():
        print('wrote projects/%s.html  (%d bytes)' % (slug, n))
