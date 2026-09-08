    <!-- ──── FEATURED: SAE Effi-Cycle ──── -->
    <div class="featured-project reveal">
      <div class="featured-header">
        <div>
          <div class="featured-label">Featured · CAD &amp; Structural Simulation</div>
          <div class="featured-title">SAE Effi-Cycle · Chassis &amp; Suspension Design</div>
          <div class="featured-subtitle">Human-electric hybrid vehicle for SAE India · Team of 4</div>
        </div>
        <div class="featured-date">Sep 2017 – Apr 2020</div>
      </div>
      <div class="featured-desc">
        Led the design of a 15 kg chassis and suspension system for a solar-powered, two-passenger
        Effi-Cycle built for the SAE India competition. Ran FEA in ANSYS Workbench across four load
        cases: front impact, side impact, rollover and torsion, then iterated the frame until all
        of them passed stress, deformation, and factor-of-safety targets.
      </div>
      <div class="featured-tech">
        <span class="skill-tag">SolidWorks</span>
        <span class="skill-tag">ANSYS Mechanical</span>
        <span class="skill-tag">Explicit Dynamics</span>
        <span class="skill-tag">Static Structural FEA</span>
        <span class="skill-tag">Topology Optimization</span>
      </div>

      <!-- IMAGE GALLERY: uses relative paths from assets/ folder -->
      <div class="project-gallery">
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/cad-topview.png" alt="CAD Top View" loading="lazy">
          <div class="gallery-caption">CAD Top View</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/isometric.jpg" alt="Isometric View" loading="lazy">
          <div class="gallery-caption">Isometric View</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/mesh.png" alt="FE Mesh Model" loading="lazy">
          <div class="gallery-caption">FE Mesh Model</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/stress.png" alt="Von Mises Stress" loading="lazy">
          <div class="gallery-caption">Equivalent Stress (Front Impact)</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/deformation.png" alt="Total Deformation" loading="lazy">
          <div class="gallery-caption">Total Deformation</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/effi-cycle/fos.png" alt="Factor of Safety" loading="lazy">
          <div class="gallery-caption">Factor of Safety</div>
        </div>
      </div>

      <!-- FEA RESULTS TABLE -->
      <div class="results-section">
        <div class="results-title">FEA Results Summary</div>
        <div class="results-subtitle">All load cases met structural integrity targets</div>
        <table class="results-table">
          <thead>
            <tr><th>Load Case</th><th>Max Stress (MPa)</th><th>Max Deformation (mm)</th><th>Min FoS</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Front Impact</td><td>326.9</td><td>1.62</td><td>1.41</td><td><span class="pass">✓ Pass</span></td></tr>
            <tr><td>Side Impact</td><td>140.9</td><td>1.79</td><td>3.10</td><td><span class="pass">✓ Pass</span></td></tr>
            <tr><td>Rollover</td><td>308.9</td><td>5.83</td><td>1.49</td><td><span class="pass">✓ Pass</span></td></tr>
            <tr><td>Torsion</td><td>370.6</td><td>2.83</td><td>1.24</td><td><span class="pass">✓ Pass</span></td></tr>
          </tbody>
        </table>
      </div>

      <!--
        TO ADD A VIDEO: uncomment and replace the src
        <div class="project-video">
          <video controls preload="metadata" poster="assets/images/effi-cycle/thumbnail.jpg">
            <source src="assets/videos/effi-cycle-demo.mp4" type="video/mp4">
          </video>
        </div>

        TO EMBED A YOUTUBE VIDEO:
        <div class="project-video">
          <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" allowfullscreen></iframe>
        </div>
      -->

      <!-- REPO / EXTERNAL LINKS -->
      <div class="project-actions">
        <!--
        <a href="https://github.com/adityamohan/effi-cycle" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub Repo
        </a>
        -->
      </div>
    </div>

