    <!-- ──── FEATURED: FASTER for Dynamic Environments ──── -->
    <div class="featured-project reveal">
      <div class="featured-header">
        <div>
          <div class="featured-label">Featured · Motion Planning &amp; Perception</div>
          <div class="featured-title">FASTER+Predict · High-Speed Flight Through Moving Obstacles</div>
          <div class="featured-subtitle">EECE 5550 Mobile Robotics · Northeastern University · ROS / Gazebo / Gurobi · with Anurag Girish Kadkol</div>
        </div>
        <div class="featured-date">Mar – Apr 2026</div>
      </div>
      <div class="featured-desc">
        FASTER (Tordesillas et al., T-RO 2022) flies a drone fast through an unknown map by solving two
        trajectories every replan cycle: a <strong>Whole</strong> trajectory that optimistically cuts through
        unknown space for speed, and a <strong>Safe</strong> trajectory confined to space the robot has actually
        confirmed free, held in reserve as a guaranteed stopping maneuver. The robot only ever commits to
        <em>whole-up-to-R</em> + <em>safe</em>, which is why it can fly at 7.8 m/s without gambling.
        <br><br>
        That guarantee rests on one line of the proof: the invariance condition
        <em>F<sub>k</sub> ∪ FU<sub>k</sub> = F<sub>k+1</sub> ∪ FU<sub>k+1</sub></em> — space classified free
        never becomes occupied. <strong>A moving obstacle violates it directly.</strong> The committed trajectory
        is computed against an occupancy snapshot that is already stale by the time the drone flies through it,
        so the safety argument quietly stops applying.
        <br><br>
        I reproduced FASTER in 2-D (Python, from scratch, against four baselines) and in 3-D (ROS/Gazebo with
        Gurobi), then built <strong>FASTER+Predict</strong>: a constant-velocity obstacle predictor feeding a
        two-boundary inflation scheme. The design constraint I set was that
        <strong>the MIQP, the convex-corridor decomposition and the committed-trajectory logic must not be
        touched</strong> — the extension had to live entirely at the perception layer, so the original
        whole/safe guarantee would carry over instead of needing a new proof.
      </div>
      <div class="featured-tech">
        <span class="skill-tag">ROS</span>
        <span class="skill-tag">Gazebo</span>
        <span class="skill-tag">C++ / Python</span>
        <span class="skill-tag">MIQP · Gurobi</span>
        <span class="skill-tag">Trajectory Optimization</span>
        <span class="skill-tag">Occupancy Mapping</span>
        <span class="skill-tag">Obstacle Prediction</span>
        <span class="skill-tag">JPS / A*</span>
        <span class="skill-tag">Docker</span>
      </div>

      <div class="metric-row">
        <div class="metric">
          <div class="metric-num">9<small>/9</small></div>
          <div class="metric-label">runs reached the goal, up from 6/9 on vanilla FASTER in the same world</div>
        </div>
        <div class="metric">
          <div class="metric-num">&plusmn;0.4<small> m</small></div>
          <div class="metric-label">path-length spread across runs, down from &plusmn;10.2 m — the planner stopped improvising</div>
        </div>
        <div class="metric">
          <div class="metric-num">50<small> Hz</small></div>
          <div class="metric-label">augmented occupancy + unknown grids republished, off a 20 Hz mapper</div>
        </div>
        <div class="metric">
          <div class="metric-num">0<small> lines</small></div>
          <div class="metric-label">of the MIQP formulation modified — the whole/safe guarantee carries over intact</div>
        </div>
      </div>

      <!-- DYNAMIC RUNS -->
      <div class="video-grid">
        <figure>
          <video src="assets/videos/faster/corridor-rviz.mp4" poster="assets/images/faster/poster-corridor-rviz.jpg"
                 autoplay loop muted playsinline controls preload="metadata"></video>
          <figcaption><b>Planner internals.</b> Orange voxels are confirmed occupancy, cyan is unknown space,
            the blue wireframe is the convex polyhedron the MIQP is constrained inside, green is the committed
            trajectory. The inflated bubbles around moving panels enter as occupancy before the drone gets there.</figcaption>
        </figure>
        <figure>
          <video src="assets/videos/faster/corridor-gazebo.mp4" poster="assets/images/faster/poster-corridor-gazebo.jpg"
                 autoplay loop muted playsinline controls preload="metadata"></video>
          <figcaption><b>The same run in Gazebo.</b> L-corridor world, panels sweeping across the passage.
            Physics stays enabled throughout, so any drone–obstacle overlap is logged as a real collision
            rather than a proximity warning.</figcaption>
        </figure>
      </div>

      <!-- SETUP -->
      <div class="spec-block">
        <div class="block-title">Benchmark Setup</div>
        <div class="block-sub">A 70 m corridor is a deliberately unfair test: there is no way around the obstacle field, only through it, so every cylinder has to be solved rather than avoided at the global-plan level.</div>
        <div class="spec-grid">
          <div class="spec-item">
            <div class="spec-key">World</div>
            <div class="spec-val">"Moving Wall Hall" — 70 m × 5 m straight corridor, 3 m walls. Eight cylinders (Ø0.8 m × 2.5 m) at <em>x</em> ≈ 8–64 m, each sweeping sinusoidally across the corridor at 0.5–1.0 m/s with randomized amplitude and phase so they never share a rhythm.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Robot</div>
            <div class="spec-val">Quadrotor with an Asus Xtion Pro depth camera (90° HFoV, 320×240, 60 Hz, 7 m range). Triple-integrator dynamics, <em>v</em><sub>max</sub> = 5 m/s, <em>a</em><sub>max</sub> = 5 m/s², <em>j</em><sub>max</sub> = 8 m/s³. Start (2, 0, 0.3) → goal (68, 0, 1).</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Mapping &amp; Planning</div>
            <div class="spec-val">Depth cloud fused into a 0.15 m voxel grid at 20 Hz by the global mapper. JPS for the global path, convex decomposition into overlapping polyhedra, MIQP solved twice per cycle (Whole + Safe) in Gurobi.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Prediction</div>
            <div class="spec-val">Constant-velocity model with EMA-smoothed finite differencing, α = 0.7. Sensing radius <em>R<sub>s</sub></em> = 10 m; only the <em>N</em><sub>near</sub> = 4 closest obstacles are inflated, to keep the corridor from being choked by obstacles that do not matter yet.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Inflation Constants</div>
            <div class="spec-val"><em>K</em> = 0.2, δ<sub>min</sub> = 0.05 m, δ<sub>max</sub> = 0.3 m, Δ<em>s</em> = 0.4 m, voxel resolution <em>r<sub>v</sub></em> = 0.15 m. Augmented grids republished at 50 Hz, faster than the mapper, so the prediction stays ahead of the map.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Campaign</div>
            <div class="spec-val">9 independent trials per arm, cylinder phase randomized between runs, 90 s cap. Collision monitor logs every drone–cylinder overlap with timestamp and obstacle ID; the whole 18-run sweep runs unattended in Docker.</div>
          </div>
        </div>
      </div>

      <!-- MATH -->
      <div class="eqn-list">
        <div class="eqn">min<sub>j,b</sub> Σ<sub>n</sub> ‖j<sub>n</sub>‖² d<sub>t</sub><i>MIQP objective — minimum jerk over the spline</i></div>
        <div class="eqn">b<sub>np</sub> = 1 ⟹ A<sub>p</sub> r<sub>nj</sub> ≤ c<sub>p</sub> , ∀j<i>Bézier control points of interval n inside polyhedron p — convex-hull containment does the rest</i></div>
        <div class="eqn">q̂<sub>i</sub>(t) = q<sub>i</sub>(t₀) + q̇<sub>i</sub>(t₀)(t − t₀)<i>constant-velocity obstacle prediction</i></div>
        <div class="eqn">v̂<sub>i</sub>(t) = α·[p<sub>i</sub>(t) − p<sub>i</sub>(t−Δt)]/Δt + (1−α)·v̂<sub>i</sub>(t−Δt)<i>EMA-smoothed velocity estimate, α = 0.7</i></div>
        <div class="eqn">δ<sub>i</sub> = clip( K·r̃<sub>i</sub>·d<sub>i</sub> / (v<sub>d</sub>* + ε<sub>v</sub>), δ<sub>min</sub>, δ<sub>max</sub> )<i>adaptive inner bubble: grows with obstacle size and distance, shrinks with drone speed</i></div>
        <div class="eqn">R<sub>i</sub><sup>in</sup> = r̃<sub>i</sub> + δ<sub>i</sub> → occupancy grid&nbsp;&nbsp;·&nbsp;&nbsp;R<sub>i</sub><sup>out</sup> = R<sub>i</sub><sup>in</sup> + Δs → unknown grid<i>the two-boundary split that does all the work</i></div>
        <div class="eqn">Δs ≥ ½·a<sub>obs,max</sub>·T<sub>plan</sub>² + r<sub>v</sub><i>outer margin sized to absorb unmodelled obstacle acceleration + voxel quantisation</i></div>
      </div>

      <!-- THE IDEA -->
      <div class="spec-block">
        <div class="block-title">Why Two Boundaries</div>
        <div class="block-sub">The extension is small on purpose. It reuses machinery FASTER already has instead of adding new machinery that would need a new proof.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>The inner disk is published as occupancy.</b> That makes it a hard constraint on
            <em>both</em> trajectories. The Whole trajectory may approach the predicted obstacle position but
            can never enter it, exactly as it treats a static wall.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>The outer annulus is published as <em>unknown</em>, not occupied.</b> This is the whole trick.
            The Whole trajectory is allowed through unknown space, so the drone keeps its speed and its
            optimistic long horizon. But the Safe trajectory is by definition confined to free-<em>known</em>
            space, so it is forced to stay outside <em>R<sub>i</sub><sup>out</sup></em> — the backup maneuver
            automatically reserves a clearance of Δs that the fast path is allowed to spend.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>So prediction error is absorbed by a mechanism that already existed.</b> FASTER's own
            whole-vs-safe asymmetry becomes the margin for "my constant-velocity guess might be wrong,"
            without a single constraint being added to the optimization.
          </span></div>
        </div>
      </div>

      <!-- REPRODUCTION -->
      <div class="video-grid">
        <figure>
          <video src="assets/videos/faster/forest-rviz.mp4" poster="assets/images/faster/poster-forest-rviz.jpg"
                 loop muted playsinline controls preload="none"></video>
          <figcaption><b>Reproduction, planner view.</b> Random-forest world. The cyan shell is the frontier of
            explored space sweeping forward as the depth camera reveals the map — this is the region vanilla
            FASTER is willing to fly through and a conservative planner is not.</figcaption>
        </figure>
        <figure>
          <video src="assets/videos/faster/forest-gazebo.mp4" poster="assets/images/faster/poster-forest-gazebo.jpg"
                 loop muted playsinline controls preload="none"></video>
          <figcaption><b>Reproduction, world view.</b> Blue cylinders are static, red cylinders move. Rebuilding
            the paper's benchmark first was what made the dynamic result trustworthy — without it there is no
            way to tell a broken port from a real limitation of the algorithm.</figcaption>
        </figure>
      </div>

      <!-- 2-D STUDY -->
      <div class="results-section">
        <div class="results-title">Stage 1 · 2-D Reproduction Against Four Baselines</div>
        <div class="results-subtitle">Python, 400 × 400 grid, mean ± std over 10 seeds. Every method shares the same map, start and goal per seed. Built before touching ROS, so algorithmic bugs could not hide behind simulator complexity.</div>
        <table class="results-table">
          <thead>
            <tr><th>Method</th><th>Distance</th><th>Time (s)</th><th>Collisions</th><th>Goal %</th></tr>
          </thead>
          <tbody>
            <tr><td>QP (full knowledge)</td><td>503.4 ± 16.5</td><td>2.72 ± 0.12</td><td>3.1 ± 1.9</td><td>100%</td></tr>
            <tr><td>MIQP (full knowledge)</td><td>542.6 ± 94.8</td><td>1.40 ± 0.52</td><td>3.2 ± 2.6</td><td>40%</td></tr>
            <tr><td>Optimistic RRT*</td><td>517.7 ± 23.6</td><td>3.05 ± 0.52</td><td>8.1 ± 7.5</td><td>100%</td></tr>
            <tr><td>Conservative RRT*</td><td>507.8 ± 27.1</td><td>4.52 ± 0.21</td><td>8.9 ± 6.0</td><td>100%</td></tr>
            <tr class="chosen"><td>FASTER</td><td>508.7 ± 26.7</td><td>2.74 ± 0.16</td><td>3.1 ± 2.4</td><td><span class="sel">◆ 100%</span></td></tr>
          </tbody>
        </table>
        <div class="results-note">
          Static environment. FASTER matches the full-knowledge QP baseline on both time (2.74 vs 2.72 s) and
          collisions (3.1 vs 3.1) while only ever seeing part of the map — which is the paper's central claim,
          reproduced. The single-shot MIQP is the cautionary result: fastest on paper at 1.40 s, but it only
          finishes 40% of the time because an open-loop mixed-integer solve is brittle.
        </div>
      </div>

      <div class="results-section">
        <div class="results-title">Stage 2 · Same Baselines, Obstacles Now Moving</div>
        <div class="results-subtitle">8 dynamic obstacles at 30–70 grid-cells/s, mean ± std over 10 seeds.</div>
        <table class="results-table">
          <thead>
            <tr><th>Method</th><th>Distance</th><th>Time (s)</th><th>Collisions</th><th>Goal %</th></tr>
          </thead>
          <tbody>
            <tr><td>QP (full knowledge)</td><td>485.0 ± 16.9</td><td>2.58 ± 0.08</td><td>3.6 ± 5.4</td><td>50%</td></tr>
            <tr><td>MIQP (full knowledge)</td><td>502.4 ± 45.8</td><td>1.31 ± 0.41</td><td>2.1 ± 3.3</td><td>90%</td></tr>
            <tr><td>QP (partial-obs.)</td><td>487.6 ± 15.6</td><td>2.64 ± 0.10</td><td>2.6 ± 3.6</td><td>100%</td></tr>
            <tr><td>Optimistic RRT*</td><td>496.7 ± 36.9</td><td>2.33 ± 0.23</td><td>2.5 ± 3.7</td><td>100%</td></tr>
            <tr><td>Conservative RRT*</td><td>482.1 ± 11.7</td><td>3.19 ± 0.15</td><td>2.5 ± 3.4</td><td>100%</td></tr>
            <tr class="chosen"><td>FASTER</td><td>487.8 ± 15.4</td><td>2.64 ± 0.10</td><td><span class="sel">◆ 1.9 ± 2.1</span></td><td>100%</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          The full-knowledge QP collapses from 100% to 50% — it plans once on the initial configuration and
          that trajectory is simply wrong by the time it is flown. FASTER records the lowest collision count of
          all six methods <em>without any dynamic obstacle model at all</em>, purely because it recomputes a
          fresh safe backup every cycle. That result is what made the 3-D extension worth building: the
          replanning architecture was already most of the way there.
        </div>
      </div>

      <!-- 3-D BENCHMARK -->
      <div class="results-section">
        <div class="results-title">Stage 3 · FASTER vs FASTER+Predict in the 70 m Moving Corridor</div>
        <div class="results-subtitle">9 trials per arm, Gazebo with physics enabled, 90 s cap. Collisions counted as unique cylinders contacted, on identical terms for both arms.</div>
        <table class="results-table">
          <thead>
            <tr><th>Metric</th><th>Vanilla FASTER</th><th>FASTER+Predict</th><th>Change</th></tr>
          </thead>
          <tbody>
            <tr class="chosen"><td>Goal reached</td><td>6 / 9</td><td>9 / 9</td><td><span class="sel">◆ +3 runs</span></td></tr>
            <tr><td>Timeouts / stalls</td><td>3</td><td>0</td><td>eliminated</td></tr>
            <tr><td>Travel time (successful runs)</td><td>31.7 ± 9.0 s</td><td>29.4 ± 5.6 s</td><td>&minus;7%, spread halved</td></tr>
            <tr class="chosen"><td>Path length (successful runs)</td><td>76.1 ± 10.2 m</td><td>65.5 ± 0.4 m</td><td><span class="sel">◆ ±10.2 → ±0.4 m</span></td></tr>
            <tr><td>Unique cylinders contacted</td><td>3.4 ± 1.6</td><td>3.1 ± 1.2</td><td>&minus;10%</td></tr>
            <tr><td>Worst single run</td><td>90 s, 16.3 m travelled</td><td>38.7 s, goal reached</td><td>&mdash;</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          Straight-line goal distance is 66 m. FASTER+Predict flies 65.5 ± 0.4 m — it is not taking a wider
          route, it is taking <em>the same</em> route every time, adding only the lateral excursion needed to
          clear each cylinder. Vanilla's 76.1 ± 10.2 m is the signature of a planner improvising: run 2
          wandered 134 m without finishing, run 6 covered 16 m in 90 s stuck behind a cylinder.
          <br><br>
          On collisions, the table above counts both arms on identical terms. The plotted chart below reads
          lower for Predict (2.4) because it drops the first cylinder, which sits close enough to the spawn
          point that the velocity filter has not converged before the drone reaches it. Either way the
          collision result is the weak one — the reliability and path-consistency numbers are what carry
          this comparison.
        </div>
      </div>

      <!-- PLOTS -->
      <div class="project-gallery">
        <div class="gallery-item">
          <img src="assets/images/faster/bench-travel-time.png" alt="Travel time to goal per run, FASTER vs FASTER+Predict" loading="lazy">
          <div class="gallery-caption">Time to goal per run — three vanilla failures, none for Predict</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/faster/bench-collisions.png" alt="Unique obstacles collided per run" loading="lazy">
          <div class="gallery-caption">Unique cylinders contacted per run — chart excludes the spawn-adjacent first cylinder for Predict</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/faster/bench-distance.png" alt="Total distance travelled per run" loading="lazy">
          <div class="gallery-caption">Distance travelled — Predict is flat, vanilla is not</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/faster/bench-velocity.png" alt="Speed profile averaged across runs" loading="lazy">
          <div class="gallery-caption">Speed profile, mean ± σ over 9 runs</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/faster/bench-acceleration.png" alt="Acceleration magnitude profile averaged across runs" loading="lazy">
          <div class="gallery-caption">Acceleration magnitude — less time at the kinodynamic limit</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/faster/overview-composite.jpg" alt="Gazebo, RViz and depth camera views during a reproduction run" loading="lazy">
          <div class="gallery-caption">Full stack running: world, map and the depth feed driving it</div>
        </div>
      </div>

      <!-- FINDINGS -->
      <div class="spec-block">
        <div class="block-title">What the Benchmark Actually Decided</div>
        <div class="block-sub">The conclusions that changed the design, plus the ones that constrain what this result is allowed to claim.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>The headline win is reliability, not speed.</b> Collision count barely moved (3.4 → 3.1 unique
            cylinders). Goal completion went 6/9 → 9/9 and path spread went ±10.2 m → ±0.4 m. The failure mode
            being fixed is not "the drone hits things" — it is <em>stall-and-wait</em>: vanilla FASTER ends up
            flying parallel to an approaching cylinder with no gap, brakes, loses its corridor, and never
            recovers. Anticipating the swept region a second ahead is what prevents entering that state.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>The velocity-adaptive term is what keeps the corridor navigable.</b> δ<sub>i</sub> ∝ 1/v<sub>d</sub>*
            shrinks the bubble when the drone is already moving fast near an obstacle, so it threads the gap
            instead of braking; δ<sub>i</sub> ∝ d<sub>i</sub> grows it when the obstacle is still far, so the
            detour gets committed early and cheaply. A fixed-radius bubble large enough to be safe at the
            turnaround points choked the 5 m corridor and made the Safe trajectory infeasible.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>Only inflating the four nearest obstacles was a correctness fix, not an optimization.</b>
            Inflating all eight filled the corridor with predicted-occupied voxels, JPS could not find a global
            path, and the planner had nothing to optimize inside. Capping at <em>N</em><sub>near</sub> = 4
            within <em>R<sub>s</sub></em> = 10 m keeps the free space the MIQP needs to exist.
          </span></div>
          <div class="finding"><span class="finding-n">04</span><span>
            <b>Reproducing the static baseline first was the load-bearing decision.</b> The 2-D study showed
            vanilla FASTER already achieving the lowest collision rate of six methods under moving obstacles,
            with no dynamic model. That told me the replanning loop was sound and the gap was purely
            informational — which is why the fix belonged in perception, and why a 200-line predictor node was
            the right size of change rather than a reformulated optimizer.
          </span></div>
          <div class="finding"><span class="finding-n">05</span><span>
            <b>What this result is not.</b> Obstacle positions are read from the simulator's model-state
            channel and passed through the same velocity filter a real tracker would use, rather than from
            point-cloud clustering — the stock mapper decays stale voxels at &minus;0.01 per miss and leaves
            trails behind moving obstacles that corrupt centroids. That isolates the inflation model from a
            mapping artifact, but it does mean <em>perception is assumed solved</em>. Collisions are also not
            eliminated: residual contacts concentrate where a cylinder sits near the wall and leaves no
            passable gap, or where turnaround acceleration briefly exceeds the
            <em>a</em><sub>obs,max</sub> ≈ 1.1 m/s² the margin in Δs was sized for.
          </span></div>
        </div>
      </div>

      <!-- ATTRIBUTION -->
      <div class="credit-bar">
        <div class="credit mine">
          <div class="credit-who">My contribution</div>
          <div class="credit-what">
            The dynamic extension end to end: predictor node, two-boundary inflation and grid augmentation,
            and the parameter study behind <em>K</em>/δ<sub>max</sub>/Δs. The 2-D reproduction environment
            and all four baseline planners behind Stage 1 and Stage 2. Gazebo world generators, the collision
            monitor, and the automated 18-run benchmark harness with its plotting pipeline. Docker and Gurobi
            bring-up for the original stack.
          </div>
        </div>
        <div class="credit">
          <div class="credit-who">Upstream · unmodified</div>
          <div class="credit-what">
            The FASTER reference implementation by Tordesillas et al. (MIT ACL) — the C++ MIQP core, JPS
            global planner and DecompROS convex decomposition. Left untouched by design; that was the point
            of the exercise.
          </div>
        </div>
      </div>

      <div class="project-actions">
        <a href="assets/docs/faster-dynamic-planner-report.pdf" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          Full Report (PDF)
        </a>
        <a href="https://github.com/Adityamohan260498/FASTER-for-dynamic-environment-" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          3-D Stack &amp; Benchmarks
        </a>
        <a href="https://github.com/kadkola08/faster_2d_dynamic" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          2-D Study
        </a>
        <a href="https://doi.org/10.1109/TRO.2021.3120185" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Original FASTER Paper
        </a>
      </div>
    </div>
