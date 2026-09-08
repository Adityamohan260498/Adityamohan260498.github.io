#!/usr/bin/env python3
"""Builds resume.pdf — mechanical / thermal engineering targeted.

Edit RESUME below and re-run:   python tools/build_resume.py
Output: resume.pdf in the repo root (linked from index.html).
"""
import os
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Flowable, KeepTogether)

ACCENT = colors.HexColor("#1a1a1a")
RULE   = colors.HexColor("#999999")
MUTED  = colors.HexColor("#444444")

NAME    = "UNNI ADITYA MOHAN"
CONTACT = ("Boston, MA &nbsp;|&nbsp; (857) 225-3866 &nbsp;|&nbsp; "
           "adityamohan2604@gmail.com &nbsp;|&nbsp; "
           "linkedin.com/in/adityamohan2604 &nbsp;|&nbsp; github.com/adityamohan260498")

SUMMARY = ("Mechanical engineer with 3 years of capital-equipment experience at Thermax on boiler pressure parts, "
           "plus a simulation background across transient heat transfer, multiphase CFD and structural FEA. "
           "Comfortable owning a design from CAD through analysis to procurement and the manufacturing floor.")

# NOTE: body text is rendered in Helvetica (WinAnsi encoding). Greek letters and arrows
# are NOT in that character set and will silently vanish. Use ASCII words instead.

EDUCATION = [
    ("Northeastern University, Boston, MA", "Master of Science in Robotics &nbsp;&middot;&nbsp; GPA 3.82",
     "Sep 2024 &ndash; Present", []),
    ("National Institute of Technology Rourkela, India",
     "B.Tech in Mechanical Engineering, with Honors &nbsp;&middot;&nbsp; CGPA 8.12/10 &nbsp;&middot;&nbsp; "
     "Coursework: Thermal Engineering, Heat Transfer, Fluid &amp; Solid Mechanics, CAD, CFD",
     "Aug 2017 &ndash; Jun 2021", []),
]

SKILLS = [
    ("CAD &amp; Drafting", "SolidWorks, AutoCAD (2D/3D)"),
    ("Simulation", "ANSYS Mechanical (Static Structural, Explicit Dynamics, Topology Optimization), "
                   "ANSYS Fluent (CFD, VOF multiphase), COMSOL Multiphysics (conjugate heat transfer, porous media)"),
    ("Engineering Analysis", "Heat transfer &amp; thermal management, pressure-part design, structural FEA, "
                             "fin and heat-exchanger sizing, psychrometrics, design trade studies"),
    ("Programming &amp; Tools", "MATLAB &amp; Simulink, Python, C++, ROS 2, OpenCV, Arduino"),
]

EXPERIENCE = [
    ("Thermax Ltd, Pune, India", "Project Engineer", "Sep 2021 &ndash; May 2024", [
        "Primary coordinator between engineering, procurement and manufacturing on capital boiler and "
        "pressure-part projects; identified critical-path delays in design approval and implemented adjustments "
        "that recovered <b>2 weeks</b> of delivery schedule.",
        "Designed a reusable transportation frame for pressure parts in AutoCAD, saving <b>$20K per project</b>.",
        "Built and trained a machine learning model predicting optimal steam drum design parameters, automating "
        "the CAD design process, saving <b>20 man-hours</b> and improving dimensional accuracy.",
    ]),
]

PROJECTS = [
    ("Thermal Modelling of a Metal Hydride Hydrogen Storage Reactor",
     "B.Tech Thesis &nbsp;&middot;&nbsp; COMSOL Multiphysics", "Dec 2020 &ndash; May 2021", [
        "Built a transient model coupling the energy equation, Darcy flow through a porous bed and Arrhenius "
        "kinetics for a 30 bar hydrogen storage vessel with 36 embedded cooling tubes and internal copper fins.",
        "Ran 13 transient studies across fin count (4&ndash;10), fin thickness (1&ndash;3 mm) and shell-side "
        "convection (100&ndash;2000 W/m&sup2;K), cutting time to 90% charge from <b>147 s to 88 s (-40%)</b>.",
        "Selected a 10 &times; 1 mm fin array hitting that target with <b>38% less parasitic copper mass</b> than "
        "the equal-speed alternative; a shell-side <i>h</i> sweep moved charge time only 1.1%, deleting a "
        "forced-convection jacket from the design.",
     ]),
    ("Design and Analysis of a Humidity / Climate Test Chamber",
     "Research Internship &nbsp;&middot;&nbsp; SolidWorks, ANSYS Fluent", "2020 &ndash; Mar 2021", [
        "Designed a two-unit environmental test chamber for 85/85 damp-heat and HALT/HASS qualification: a "
        "cross-flow finned heat exchanger setting dry-bulb temperature, feeding an atomizer humidification stage.",
        "Conjugate heat transfer analysis gave <b>30 to 23&nbsp;&deg;C per stage</b> on 0&nbsp;&deg;C chilled water, "
        "specifying three stages in series; air-side streamlines (peak 5.20 m/s) identified fin pitch as the "
        "limiting resistance.",
        "Multiphase VOF study showed the atomizer discharging a coherent liquid core (peak volume fraction "
        "<b>0.968</b>) trapped in a vortex over the first 30% of chamber length, driving nozzle placement and baffling.",
     ]),
    ("Mechanical Design Lead &nbsp;&middot;&nbsp; Autonomous Underwater Vehicle (Team of 6)",
     "Built for ROBOSUB, SAUVC and SAVe competitions", "Jan 2018 &ndash; Mar 2021", [
        "Achieved <b>42% drag reduction</b> and improved stability through hull redesign and CFD in ANSYS Fluent.",
        "Topology optimization in ANSYS Mechanical cut chassis weight <b>20%</b> while holding structural integrity "
        "at 15 ft depth (<b>1.8&times; safety factor</b>).",
        "Developed sealed subassemblies for fully submerged service: a piston ballast tank reaching full buoyancy "
        "in under 10 s at 15 ft, a torpedo launcher with 3&ndash;5 m precision, and a gripper rated to 1 kg underwater.",
     ]),
    ("Design Lead &nbsp;&middot;&nbsp; SAE Effi-Cycle Chassis and Suspension (Team of 4)",
     "Human-electric hybrid vehicle, SAE India", "Sep 2017 &ndash; Apr 2020", [
        "Led design of a competition-compliant <b>15 kg</b> chassis and suspension for a two-passenger "
        "solar-assisted vehicle, from CAD through fabrication.",
        "Ran FEA in ANSYS Workbench (Static Structural, Explicit Dynamics) across front impact, side impact, "
        "rollover and torsion; all four passed at a minimum factor of safety of <b>1.24</b>.",
     ]),
    ("ISS Active Thermal Control System &nbsp;&middot;&nbsp; ROS 2 and Gazebo",
     "Space Station OS &nbsp;&middot;&nbsp; open-source collaboration with JAXA", "Dec 2024 &ndash; Feb 2025", [
        "Implemented a two-stage active thermal control system in C++ (internal water loops to an external ammonia "
        "loop and radiators); URDF-derived lumped-capacitance network integrated with RK4, with orbital solar input "
        "from an ECI sun vector peaking at <b>13.9 kW</b> across six panels.",
     ]),
]

ACHIEVEMENTS = [
    "<b>Winners</b> &nbsp;&middot;&nbsp; SAVe 2019, IIT Madras, India &nbsp;&nbsp;|&nbsp;&nbsp; "
    "<b>Semi-Finalists</b> &nbsp;&middot;&nbsp; ROBOSUB 2019, San Diego, USA",
]


class Rule(Flowable):
    """Thin horizontal rule under a section heading."""
    def __init__(self, width, thickness=0.6, color=RULE):
        Flowable.__init__(self)
        self.width, self.thickness, self.color = width, thickness, color
        self.height = thickness

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self.width, 0)


def build(out_path):
    W, H = LETTER
    M = 0.5 * inch
    usable = W - 2 * M

    doc = BaseDocTemplate(out_path, pagesize=LETTER,
                          leftMargin=M, rightMargin=M, topMargin=0.42 * inch, bottomMargin=0.34 * inch,
                          title="Unni Aditya Mohan - Resume", author="Unni Aditya Mohan")
    doc.addPageTemplates([PageTemplate(id='main', frames=[
        Frame(M, 0.34 * inch, usable, H - 0.42 * inch - 0.34 * inch, id='f', showBoundary=0,
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)])])

    s_name = ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=18, leading=21,
                            alignment=1, textColor=ACCENT, spaceAfter=3)
    s_contact = ParagraphStyle('contact', fontName='Helvetica', fontSize=8.2, leading=11,
                               alignment=1, textColor=MUTED, spaceAfter=5)
    s_summary = ParagraphStyle('summary', fontName='Helvetica', fontSize=8.3, leading=10.4,
                               alignment=TA_JUSTIFY, textColor=colors.black, spaceAfter=2)
    s_sec = ParagraphStyle('sec', fontName='Helvetica-Bold', fontSize=9.2, leading=10.5,
                           textColor=ACCENT, spaceBefore=4, spaceAfter=1.8)
    s_role = ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=8.9, leading=10.8, spaceAfter=0)
    s_sub = ParagraphStyle('sub', fontName='Helvetica-Oblique', fontSize=8.1, leading=9.8,
                           textColor=MUTED, spaceAfter=1)
    s_bullet = ParagraphStyle('bul', fontName='Helvetica', fontSize=8.3, leading=10.3,
                              leftIndent=10, bulletIndent=1, spaceAfter=0.9,
                              alignment=TA_JUSTIFY)
    s_skill = ParagraphStyle('skill', fontName='Helvetica', fontSize=8.3, leading=10.3,
                             leftIndent=10, bulletIndent=1, spaceAfter=0.9)

    def section(title):
        return [Paragraph(title.upper(), s_sec), Rule(usable), Spacer(1, 2.2)]

    def entry(head, sub, date, bullets, style=s_bullet):
        # heading line with the date flush right, via a two-cell paragraph trick
        head_p = Paragraph(
            f'<para><font size="9.2"><b>{head}</b></font>'
            f'<font size="8.0" color="#444444"> &nbsp;&nbsp;&middot;&nbsp; {date}</font></para>', s_role)
        out = [head_p]
        if sub:
            out.append(Paragraph(sub, s_sub))
        for b in bullets:
            out.append(Paragraph(b, style, bulletText='•'))
        out.append(Spacer(1, 2.0))
        return out

    story = [Paragraph(NAME, s_name), Paragraph(CONTACT, s_contact)]
    story += section('Summary')
    story += [Paragraph(SUMMARY, s_summary)]

    story += section('Education')
    for h, s_, d, b in EDUCATION:
        story += entry(h, s_, d, b)

    story += section('Technical Skills')
    for k, v in SKILLS:
        story.append(Paragraph(f'<b>{k}:</b> {v}', s_skill, bulletText='•'))

    story += section('Professional Experience')
    for h, s_, d, b in EXPERIENCE:
        story += entry(h, s_, d, b)

    story += section('Engineering Projects')
    for h, s_, d, b in PROJECTS:
        story += [KeepTogether(entry(h, s_, d, b))]

    story += section('Achievements')
    for a in ACHIEVEMENTS:
        story.append(Paragraph(a, s_skill, bulletText='•'))

    doc.build(story)
    return out_path


if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    p = build(os.path.join(root, 'resume.pdf'))
    print('wrote', p)
