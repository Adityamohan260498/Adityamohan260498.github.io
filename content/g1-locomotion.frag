    <!-- ──── FEATURED: Unitree G1 RL Locomotion, sim → real ──── -->
    <div class="featured-project reveal">
      <div class="featured-header">
        <div>
          <div class="featured-label">In Progress · Reinforcement Learning &amp; Sim-to-Real</div>
          <div class="featured-title">Unitree G1 · RL Locomotion from Simulation onto the Real Robot</div>
          <div class="featured-subtitle">Personal research project · mjlab / MuJoCo Warp · PPO + system-ID randomisation · deployed over CycloneDDS</div>
        </div>
        <div class="featured-date">Sep 2026 – ongoing</div>
      </div>

      <div class="wip-banner">
        <span class="wip-tag">In progress</span>
        <div class="wip-text">
          <b>Working today:</b> a velocity policy trained under a measured system-ID randomisation curriculum,
          exported to ONNX and <b>walking on the physical 29-DoF Unitree G1</b> at 50 Hz over CycloneDDS.
          Five policies trained, three taken to hardware, one that walks. Also validated sim-to-sim in
          Isaac Sim on PhysX over a 56 m warehouse route. <b>Being built now:</b> RGB-D mapping from the
          robot's head camera, and a human-gait retrain to fix the shuffling stride both simulators show.
          Every number below is from my own runs or my own robot.
        </div>
      </div>

      <div class="featured-desc">
        A humanoid locomotion policy is not one problem, it is two stacked. The low level has to keep a
        29-DoF biped upright while tracking a commanded body-frame twist. The level above has to decide what
        that twist should be. Most published work stops at the first, ships a policy that takes
        <em>(v<sub>x</sub>, v<sub>y</sub>, ω<sub>z</sub>)</em>, and leaves the robot with no way to be told
        <em>"go over there"</em> — and, more often than not, never leaves simulation at all.
        <br><br>
        I trained the policy in <strong>mjlab</strong>, a MuJoCo-Warp RL framework, through 30 000 PPO
        iterations on one 8 GB laptop GPU. The version that matters is the second one: trained under a
        <strong>system-identification curriculum</strong> that randomises joint friction, damping, armature,
        actuator effort limits and PD gains, and <em>widens</em> those ranges as the policy proves it can
        cope. That is what makes the transfer survive — a policy tuned to MuJoCo's exact joint model has
        nothing to fall back on when the real gearbox behaves differently.
        <br><br>
        It then goes onto the robot: ONNX export carrying its own gains and default pose as metadata, a
        50 Hz control loop over CycloneDDS to the G1's low-level interface, and a tilt watchdog that drops to
        damping if the pelvis goes past ~53°. <strong>The interesting part is not that it walks — it is the
        list of things it does worse on hardware than in simulation,</strong> which is measured and written
        down below rather than left out.
      </div>

      <div class="featured-tech">
        <span class="skill-tag">Reinforcement Learning</span>
        <span class="skill-tag">PPO</span>
        <span class="skill-tag">Sim-to-Real</span>
        <span class="skill-tag">Domain Randomisation</span>
        <span class="skill-tag">MuJoCo / MuJoCo Warp</span>
        <span class="skill-tag">Unitree SDK2 · CycloneDDS</span>
        <span class="skill-tag">ONNX Runtime</span>
        <span class="skill-tag">ROS 2</span>
        <span class="skill-tag">PyTorch</span>
      </div>

      <div class="metric-row">
        <div class="metric">
          <div class="metric-num">0.58<small> m/s</small></div>
          <div class="metric-label">sustained walking speed on the real G1 — the transfer that worked, of three tried</div>
        </div>
        <div class="metric">
          <div class="metric-num">&minus;31<small>%</small></div>
          <div class="metric-label">held-out joint-tracking error after chirp system ID on 12 leg joints</div>
        </div>
        <div class="metric">
          <div class="metric-num">3e&minus;6</div>
          <div class="metric-label">parity between the deploy runtime and training, checked before touching hardware</div>
        </div>
        <div class="metric">
          <div class="metric-num">56<small> m</small></div>
          <div class="metric-label">Isaac Sim warehouse route on PhysX, two aisles and a box slalom, no fall</div>
        </div>
      </div>

      <!-- SIM vs REAL — same policy, same command schedule, same durations -->
      <div class="video-grid">
        <figure>
          <video src="assets/videos/g1/distance-sequence-sim.mp4" poster="assets/images/g1/poster-distance-sim.jpg"
                 autoplay loop muted playsinline controls preload="metadata"></video>
          <figcaption><b>Simulation.</b> The scripted distance sequence in mjlab — 2 m forward, 1 m back,
            0.5 m right, 0.5 m left, 1 m back, with two-second holds between moves. The blue arrow is the
            commanded twist, the magenta markers are foot contacts. This is the run the move durations were
            calibrated from.</figcaption>
        </figure>
        <figure>
          <video src="assets/videos/g1/distance-sequence-real.mp4" poster="assets/images/g1/poster-distance-real.jpg"
                 autoplay loop muted playsinline controls preload="metadata"></video>
          <figcaption><b>Real robot.</b> The same ONNX policy and the same schedule, on the physical G1 over
            CycloneDDS, recorded the same afternoon as the run on the left. The gantry strap is slack — it is
            a fall-arrest, not a support. Timings are open loop: there is no position feedback anywhere in
            this stack, so the distances come from durations calibrated in simulation.</figcaption>
        </figure>
      </div>

      <!-- TRAINING -->
      <div class="spec-block">
        <div class="block-title">Training the Policy That Actually Deployed</div>
        <div class="block-sub">Deliberately one consumer GPU. If a humanoid policy needs a cluster to reproduce, most people cannot check your work.</div>
        <div class="spec-grid">
          <div class="spec-item">
            <div class="spec-key">Robot &amp; Task</div>
            <div class="spec-val">Unitree G1, 29 actuated DoF. mjlab task <em>Velocity-Flat-Unitree-G1-SysID</em>: track a commanded body-frame twist on flat ground while the simulator's physical parameters are resampled every episode.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Observation &amp; Action</div>
            <div class="spec-val">96-dim: gyro (3) + projected gravity (3) + joint position error (29) + joint velocity (29) + previous action (29) + command (3). Action is 29 joint targets, applied as <em>q = q<sub>default</sub> + scale · a</em>. No height, no velocity estimate, nothing the real robot cannot measure.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">System-ID Randomisation</div>
            <div class="spec-val">Per-episode resampling of joint friction, damping and armature, actuator effort limits, and PD gains across six actuator groups — with the <em>ranges themselves</em> on a curriculum that widens them as the policy holds up.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Command Curriculum</div>
            <div class="spec-val">Command ranges widen as tracking error stays in tolerance: <em>v<sub>x</sub></em> [&minus;1, 1] → [&minus;2, 3] m/s, yaw rate 0.5 → 0.7 rad/s. That yaw ceiling turns out to matter a great deal — see the limits below.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Run</div>
            <div class="spec-val">30 000 iterations, ~37 800 simulation steps/s. Mean reward &minus;1.26 → 41.9; mean episode length 12.9 → 994.8 steps against a 1000-step cap; fall terminations 0.04.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Export</div>
            <div class="spec-val">ONNX, with joint names, stiffness, damping, default pose and action scale written into the model metadata — so the deployment script reads its gains off the policy instead of keeping a second copy that can drift out of sync.</div>
          </div>
        </div>
      </div>

      <div class="project-gallery">
        <div class="gallery-item">
          <img src="assets/images/g1/train-reward.png" alt="Mean reward and episode length over 30k PPO iterations for the sysid policy" loading="lazy">
          <div class="gallery-caption">Reward and episode length — the drops are command-curriculum steps</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/g1/train-sysid-dr.png" alt="System identification randomisation ranges widening over training" loading="lazy">
          <div class="gallery-caption">Physics randomisation bands widening as the policy copes</div>
        </div>
        <div class="gallery-item">
          <img src="assets/images/g1/train-curriculum.png" alt="Command velocity limits over training" loading="lazy">
          <div class="gallery-caption">Command limits — yaw never trained past 0.7 rad/s</div>
        </div>
      </div>

      <!-- DEPLOYMENT -->
      <div class="spec-block">
        <div class="block-title">Getting It Onto the Robot</div>
        <div class="block-sub">The gap between a trained checkpoint and a walking machine is mostly plumbing, and the plumbing is where it goes wrong.</div>
        <div class="spec-grid">
          <div class="spec-item">
            <div class="spec-key">Link</div>
            <div class="spec-val">Laptop to robot over Ethernet, Unitree SDK2 on CycloneDDS. Robot enters debug mode from zero-torque, hung on a gantry for every first run of a new policy.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Control Loop</div>
            <div class="spec-val">50 Hz (2 ms sim step × 4 decimation). Read low state → assemble the 96-dim observation → ONNX Runtime on CPU → 29 position targets with the policy's own kp/kd → publish with CRC.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Two Python Environments</div>
            <div class="spec-val">mjlab runs on Python 3.13; CycloneDDS 0.10 will not build there. The robot side is a separate 3.10 venv with <em>unitree_sdk2py</em>, <em>onnxruntime</em> and <em>pynput</em>. ONNX is what lets those two worlds share a policy without sharing an interpreter.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Safety</div>
            <div class="spec-val">A <em>--dry-run</em> mode that reads sensors and runs the policy but publishes nothing; START moves smoothly to the default pose over 3 s before anything else; a tilt watchdog drops to damping if projected gravity says the pelvis is past ~53°; SELECT and Ctrl+C both land in damping.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Three Ways to Drive It</div>
            <div class="spec-val">Remote-stick teleop, laptop keyboard hold-to-move (X11 global key capture, so it works from any window), and scripted timed sequences for repeatable demos and for filming.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Sim Recorder</div>
            <div class="spec-val">The same schedule file drives both the robot and a headless mjlab recording, parsed out of the script rather than duplicated — so the simulation video and the hardware run are provably the same command sequence.</div>
          </div>
        </div>
      </div>

      <!-- POLICY LEDGER -->
      <div class="results-section">
        <div class="results-title">Five Policies, Three Taken to Hardware, One That Walks</div>
        <div class="results-subtitle">Keeping the failures in the ledger is the point — the difference between the one that walks and the ones that froze is the whole result.</div>
        <table class="results-table">
          <thead>
            <tr><th>Policy</th><th>Obs</th><th>What changed</th><th>On hardware</th></tr>
          </thead>
          <tbody>
            <tr><td>#1 velocity</td><td>99</td><td>baseline; base linear velocity in the actor</td><td>froze on the ground</td></tr>
            <tr><td>#2 no-BLV</td><td>96</td><td>velocity moved to the critic; hand-tuned randomisation</td><td>never run — yaw 57% worse</td></tr>
            <tr class="chosen"><td>#3 sysID</td><td>96</td><td>randomisation from <em>measured</em> parameters</td><td><span class="sel">◆ walks · 0.578 m/s</span></td></tr>
            <tr><td>#4 payload</td><td>474</td><td>5-frame history, height command, 0–15 kg payload, pushes</td><td>froze on the ground</td></tr>
            <tr><td>#3b turn</td><td>96</td><td>#3 fine-tuned 6k iters on turn-in-place</td><td>not yet — turn 0.32 → 0.54 rad/s</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          <strong>Diagnosing the freeze mattered more than fixing it.</strong> On the policies that stalled,
          torque <em>was</em> being delivered — commanded and estimated torque agreed to within a few percent.
          The ankle pitch joint was binding at about 0.45 rad of error at 13 N·m with zero velocity, while
          hips and knees tracked fine. Since #3 walks on the same hardware with the same ankle linkage, the
          cause is not a modelling error in the ankle's four-bar approximation — it is that #1 and #4 learned
          gaits that lean on ankle authority the real actuator does not have. The MJCF had zero joint friction
          and damping, so in simulation that authority was free.
        </div>
      </div>

      <!-- SYSTEM ID -->
      <div class="results-section">
        <div class="results-title">System ID · Measuring the Robot Instead of Guessing Its Randomisation Ranges</div>
        <div class="results-subtitle">Chirp excitation on all 12 leg joints with the robot hoisted and its feet clear of the floor; pelvis welded, collisions off, legs only. Fitted on two sweeps, validated on two held out.</div>
        <table class="results-table">
          <thead>
            <tr><th>Model</th><th>Held-out sweep</th><th>Open-loop RMSE</th><th></th></tr>
          </thead>
          <tbody>
            <tr><td>Nominal MJCF</td><td>chirp_0</td><td>0.0365 rad</td><td>as shipped</td></tr>
            <tr class="chosen"><td>Identified</td><td>chirp_0</td><td><span class="sel">◆ 0.0251 rad</span></td><td>&minus;31%</td></tr>
            <tr><td>Identified</td><td>chirp at different kp</td><td>0.0246 rad</td><td>generalises off the fitted gains</td></tr>
            <tr><td colspan="2">Run-to-run repeatability floor</td><td>0.0051 rad</td><td>the best any model could do</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          Armature, damping and friction were fitted per joint, then the randomisation range for each was
          scaled by <em>how identifiable that parameter actually was</em> — wide where the fit was uncertain,
          tight where it was well constrained. That is the only substantive difference between policy #2 and
          policy #3, and it is the difference between a robot that freezes and one that walks.
          <br><br>
          <strong>What this does not cover:</strong> the sweeps were run with no ground contact, no body load
          and no base motion. The identified numbers describe a hoisted leg, not a walking one.
        </div>
      </div>

      <!-- SIM2SIM -->
      <div class="spec-block">
        <div class="block-title">Two Checks Before Any Policy Touches the Robot</div>
        <div class="block-sub">A humanoid that fails on hardware can damage itself. Both of these are cheap and catch different classes of error.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>A parity harness, down to 3e&minus;6.</b> The deployment runtime rebuilds the observation
            vector from scratch out of raw sensor packets, with its own joint ordering, scaling and history
            buffers. The harness feeds identical states through both the training environment and the ONNX
            deploy path and asserts the observations and actions agree to 3e&minus;6. A silently permuted
            joint index produces a policy that looks fine in simulation and falls over immediately — and is
            invisible to any test that only checks shapes.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>Sim-to-sim in a different physics engine.</b> The exact MJCF is converted to USD and the same
            ONNX policy is run in Isaac Sim 5.0 on PhysX — a completely independent contact solver. Policy #3
            completed a <em>56 m warehouse route</em> through two aisles, a box slalom and two 90° turns with
            no fall. Agreement across two engines is much weaker evidence than hardware, but it is far
            stronger than one simulator agreeing with itself, and it costs no robot time.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>Both simulators then agreed on something I had not been looking for.</b> Every policy steps at
            3.2–4.4 steps/s with 13–18 cm strides. A human walks at roughly 1.7 steps/s with 37 cm strides.
            The policies are not walking, they are shuffling — fast, stable and visibly wrong, with 45–50°/s
            RMS of head shake that would wreck any head-mounted camera. It is policy-intrinsic: the air-time
            and soft-landing rewards are weighted zero and there is no gait clock. A reward that only asks for
            velocity tracking and not falling gets exactly this.
          </span></div>
        </div>
      </div>

      <!-- LIMITS -->
      <div class="results-section">
        <div class="results-title">What the Hardware Says the Policy Cannot Do</div>
        <div class="results-subtitle">Measured in simulation and confirmed on the robot. These are the reasons the next training run exists.</div>
        <table class="results-table">
          <thead>
            <tr><th>Command</th><th>Behaviour</th><th>Diagnosis</th></tr>
          </thead>
          <tbody>
            <tr><td>Forward &le; 0.3 m/s</td><td>Stands still, does not step</td><td>deadband — no reward for stepping slowly</td></tr>
            <tr><td>Forward &ge; 0.45 m/s</td><td>Walks reliably</td><td>commanded 0.6 → ~0.5 m/s actual</td></tr>
            <tr><td>Sideways &lt; 0.55 m/s</td><td>Does not step</td><td>same deadband, wider</td></tr>
            <tr class="chosen"><td>Turn in place</td><td><span class="sel">◆ Unreliable</span></td><td>trained yaw only reached ±0.5 rad/s</td></tr>
            <tr><td>Turn while walking</td><td>Reliable both directions</td><td>inside the trained distribution</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          The turn-in-place failure is the instructive one. Commanding ω<sub>z</sub> = 1.0–1.2 rad/s sometimes
          works and sometimes does not — on the robot it turned right, then refused to turn left. That is not
          flakiness, it is <strong>extrapolation</strong>: the command curriculum never took yaw past
          0.7 rad/s, so every in-place turn asks the policy for something outside the distribution it was
          trained on, and whether it complies depends on the pose it happens to be in. The teleop scripts cap
          yaw at 1.2 rad/s precisely because pushing further is not more reliable, just faster when it works.
          <br><br>
          <strong>The fix belonged in training, not in the controller.</strong> Tuning the deadband out at
          the teleop layer would only have hidden it. Fine-tuning #3 for 6 000 iterations with 30% of
          environments on turn-in-place commands took yaw rate from 0.32 to <strong>0.54 rad/s</strong> and
          walking from 0.578 to 0.625 m/s — and Isaac Sim confirms it turns in place on PhysX too, at
          1.03 rad/s one way and 0.57 the other, so the asymmetry has not gone, only shrunk. That policy has
          not been put on the robot yet.
        </div>
      </div>

      <!-- FINDINGS -->
      <div class="spec-block">
        <div class="block-title">What Transferring It Taught Me</div>
        <div class="block-sub">The things that were not obvious until the policy was on a real machine.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>Randomising the physics is not enough — the range has to be on a curriculum too.</b>
            Opening joint friction, damping and armature to their final width from step zero gives a policy
            that never learns to walk at all, because no consistent gait works across the whole band. Starting
            narrow and widening as episodes survive means the policy learns a gait first and then learns to
            make it robust. Friction ended 2.1× wider than it began, and torque authority was pulled down to
            80% of nominal.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>Put the gains inside the exported model.</b> kp, kd, the default pose and the action scale are
            written into the ONNX metadata and read back at deploy time. The alternative — a constants block
            in the deployment script — is a second source of truth for numbers that must match the training
            environment exactly, and it will drift the first time a policy is retrained.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>The observation was designed backwards from the robot.</b> Gyro, projected gravity, joint
            positions and velocities, and the previous action — all of it is available from one low-state
            packet. No base linear velocity, no height above ground, no privileged state. A policy that
            consumes anything else is a policy that needs a state estimator before it can be deployed at all.
          </span></div>
          <div class="finding"><span class="finding-n">04</span><span>
            <b>Drive both the robot and the recorder from one schedule file.</b> The sim recorder parses the
            command sequence out of the robot script rather than keeping its own copy, so the comparison video
            cannot silently drift from what the hardware was actually asked to do. It is a small thing that
            makes a side-by-side comparison mean something.
          </span></div>
          <div class="finding"><span class="finding-n">05</span><span>
            <b>Open-loop distance is good enough to be useful and bad enough to be honest.</b> There is no
            position feedback anywhere in this stack: each move is a commanded velocity held for a duration
            calibrated in simulation. That lands within about ±0.3 m over a 2 m move. Fine for a demo,
            nowhere near enough for navigation — which is what the mapping work is for.
          </span></div>
        </div>
      </div>

      <!-- NEXT -->
      <div class="spec-block">
        <div class="block-title">Where This Is Going</div>
        <div class="block-sub">Three threads, in rough order of how much they would change the result.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>Retrain for a human gait.</b> Both simulators agree the policies shuffle — 3.2–4.4 steps/s at
            13–18 cm against a human's 1.7 steps/s at 37 cm. The levers are known and all in the reward:
            air time and soft landing currently carry zero weight, and there is no gait clock at all. This is
            the change that would most alter how the robot actually looks and how usable its head camera is.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>Put the turn fine-tune on hardware.</b> It is trained and validated in two simulators; only
            the gantry session is outstanding. The payload policy needs a separate look — it carries 10 kg
            and crouches to 0.52 m in simulation but froze on the ground, and it is the same ankle-authority
            story as #1.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>RGB-D mapping from the robot's own head camera.</b> The D435i into RTAB-Map over ROS 2,
            recorded to a bag during a scripted walk and replayed offline so the map is built from the robot's
            real trajectory. Once there is a map, the open-loop distance schedule can be replaced by something
            that knows where the robot is — the point at which this stops being dead reckoning. The shuffling
            gait's 45–50°/s of head shake is a direct problem for this, which is why the gait retrain comes
            first.
          </span></div>
        </div>
      </div>

      <!-- ATTRIBUTION -->
      <div class="credit-bar">
        <div class="credit mine">
          <div class="credit-who">My contribution</div>
          <div class="credit-what">
            Training and tuning the velocity policies, including the system-ID randomisation curriculum that
            made transfer work, and reading the runs to separate curriculum effects from real regressions.
            The entire real-robot deployment: ONNX export with embedded gains, the 50 Hz CycloneDDS control
            loop, tilt watchdog and dry-run mode, remote-stick and keyboard teleop, the scripted distance
            sequences, and the sim recorder that drives off the same schedule file. Network and SDK bring-up
            on the robot and the Jetson.
          </div>
        </div>
        <div class="credit">
          <div class="credit-who">Upstream · unmodified</div>
          <div class="credit-what">
            <em>mjlab</em> (MuJoCo Lab) — the MuJoCo-Warp RL framework, the G1 asset, the velocity task and
            its reward terms, and the rsl-rl PPO implementation. Unitree SDK2 (Python) and CycloneDDS for the
            robot link. Nothing in mjlab's <code>src/</code> is patched; my code sits alongside it.
          </div>
        </div>
        <div class="credit">
          <div class="credit-who">Method reference</div>
          <div class="credit-what">
            <em>Gait-Conditioned Reinforcement Learning with Multi-Phase Curriculum for Humanoid Locomotion</em>,
            Peng, Bao &amp; Zhou (UCL) — the reference for the multi-gait direction. None of their code is
            used here.
          </div>
        </div>
      </div>

      <div class="project-actions">
        <a href="https://github.com/mujocolab/mjlab" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          mjlab (upstream)
        </a>
      </div>
    </div>
