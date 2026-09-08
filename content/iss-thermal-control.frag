    <!-- ──── FEATURED: ISS Active Thermal Control System (Space Station OS / JAXA) ──── -->
    <div class="featured-project reveal">
      <div class="featured-header">
        <div>
          <div class="featured-label">Featured · Thermal Controls &amp; Real-Time Simulation</div>
          <div class="featured-title">ISS Active Thermal Control System · ROS 2 &amp; Gazebo</div>
          <div class="featured-subtitle">Space Station OS · open-source collaboration with JAXA · HAVEN-2 station configuration</div>
        </div>
        <div class="featured-date">Dec 2024 – Feb 2025</div>
      </div>
      <div class="featured-desc">
        In orbit there is no convection and nothing to conduct into, so the <em>only</em> way heat leaves a space
        station is radiation off the panels. So every watt of avionics, payload and metabolic load has to be
        physically walked out to a radiator through a chain of conduction paths and pumped fluid loops. The ISS
        does this in two stages for a specific reason: <strong>internal loops run water because it is safe inside
        a crewed volume, external loops run ammonia because water would freeze solid outside</strong>, and the two
        are coupled through an interface heat exchanger that never lets them mix.
        <br><br>
        I built that architecture as a ROS 2 package: a thermal network solver that turns the station URDF into
        a lumped-capacitance conduction graph, orbital solar flux driven by a real ECI sun vector, and a
        two-stage coolant control system that requests cooling as a service and handles being refused.
      </div>
      <div class="featured-tech">
        <span class="skill-tag">ROS 2 Humble</span>
        <span class="skill-tag">C++17</span>
        <span class="skill-tag">Gazebo Harmonic</span>
        <span class="skill-tag">RK4 Integration</span>
        <span class="skill-tag">Lumped-Capacitance Thermal Modeling</span>
        <span class="skill-tag">Control Architecture</span>
      </div>

      <div class="metric-row">
        <div class="metric">
          <div class="metric-num">13.9<small> kW</small></div>
          <div class="metric-label">peak solar load across 6 panels at normal incidence (2.31 kW each)</div>
        </div>
        <div class="metric">
          <div class="metric-num">RK4</div>
          <div class="metric-label">integration at dt = 0.5 s, stepped on a 10 Hz wall timer</div>
        </div>
        <div class="metric">
          <div class="metric-num">2<small>-stage</small></div>
          <div class="metric-label">coolant architecture, water internal and ammonia external</div>
        </div>
        <div class="metric">
          <div class="metric-num">1553</div>
          <div class="metric-label">lines of C++ across 7 nodes, 8 messages and 5 services</div>
        </div>
      </div>

      <!-- ARCHITECTURE DIAGRAM -->
      <div class="arch-block">
        <div class="block-title" style="margin-bottom:1rem;">System Architecture</div>
        <svg id="ssos-arch" viewBox="0 0 980 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thermal control system architecture diagram">
          <defs>
            <marker id="ssos-ah" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#c78c3c"/>
            </marker>
          </defs>
          <style>
            #ssos-arch .bx  { fill:#12121c; stroke:#2a2a3e; stroke-width:1; }
            #ssos-arch .acc { fill:#c78c3c; }
            #ssos-arch .nm  { font-family:'JetBrains Mono',monospace; font-size:12.5px; fill:#e8e4de; }
            #ssos-arch .dt  { font-family:'Inter',sans-serif; font-size:11px; fill:#9a9aac; }
            #ssos-arch .lb  { font-family:'JetBrains Mono',monospace; font-size:10.5px; fill:#c78c3c; }
            #ssos-arch .ln  { stroke:#c78c3c; stroke-width:1.4; fill:none; marker-end:url(#ssos-ah); }
            #ssos-arch .dash{ stroke:#3d3d55; stroke-width:1.2; fill:none; stroke-dasharray:4 4; }
            #ssos-arch .hd  { font-family:'JetBrains Mono',monospace; font-size:10px; fill:#5e5e72; letter-spacing:.08em; }
          </style>

          <text class="hd" x="20" y="18">ENVIRONMENT → HEAT INPUT</text>

          <rect class="bx" x="20" y="30" width="215" height="86" rx="8"/>
          <rect class="acc" x="20" y="30" width="2.5" height="86"/>
          <text class="nm" x="36" y="55">sun_vector</text>
          <text class="dt" x="36" y="76">Sun position in ECI from Julian</text>
          <text class="dt" x="36" y="92">date, rotated to body frame by</text>
          <text class="dt" x="36" y="108">quaternion conjugation</text>

          <line class="ln" x1="242" y1="73" x2="288" y2="73"/>

          <rect class="bx" x="295" y="30" width="235" height="86" rx="8"/>
          <rect class="acc" x="295" y="30" width="2.5" height="86"/>
          <text class="nm" x="311" y="55">solar_heat_node</text>
          <text class="dt" x="311" y="76">Q = α·A·S·max(0, n̂·ŝ)</text>
          <text class="dt" x="311" y="92">S = 1361 W/m², α = 0.85, A = 2 m²</text>
          <text class="dt" x="311" y="108">6 panels: lsa_1–3, rsa_1–3</text>

          <line class="ln" x1="537" y1="73" x2="583" y2="73"/>

          <rect class="bx" x="590" y="30" width="370" height="86" rx="8"/>
          <rect class="acc" x="590" y="30" width="2.5" height="86"/>
          <text class="nm" x="606" y="55">thermal_solver_node</text>
          <text class="dt" x="606" y="76">URDF joints → lumped-capacitance nodes; links →</text>
          <text class="dt" x="606" y="92">conduction paths. RK4, dt = 0.5 s @ 10 Hz.</text>
          <text class="dt" x="606" y="108">Ṫ = (P_int + Σ k_ij (T_j − T_i)) / C</text>

          <path class="ln" d="M775,120 L775,206"/>
          <text class="lb" x="789" y="167">mean node T &gt; 400 K</text>

          <text class="hd" x="20" y="200">ACTIVE THERMAL CONTROL · TWO-STAGE REJECTION</text>

          <rect class="bx" x="610" y="212" width="350" height="86" rx="8"/>
          <rect class="acc" x="610" y="212" width="2.5" height="86"/>
          <text class="nm" x="626" y="237">coolant · internal loops A + B</text>
          <text class="dt" x="626" y="258">Water, c_p = 4.186 kJ/kg·K, safe inside</text>
          <text class="dt" x="626" y="274">the crewed volume. Q = m·c_p·ΔT absorbed</text>
          <text class="dt" x="626" y="290">from the node network on request.</text>

          <path class="ln" d="M605,255 L547,255"/>
          <text class="lb" x="575" y="243" text-anchor="middle">45 °C</text>

          <rect class="bx" x="305" y="212" width="235" height="86" rx="8"/>
          <rect class="acc" x="305" y="212" width="2.5" height="86"/>
          <text class="nm" x="321" y="237">external_loop</text>
          <text class="dt" x="321" y="258">Ammonia, c_p = 4.7 kJ/kg·K, 5 kg.</text>
          <text class="dt" x="321" y="274">Water would freeze outside. Tank</text>
          <text class="dt" x="321" y="290">pressure tracked with temperature.</text>

          <path class="ln" d="M300,255 L242,255"/>
          <text class="lb" x="270" y="243" text-anchor="middle">vent</text>

          <rect class="bx" x="20" y="212" width="215" height="86" rx="8"/>
          <rect class="acc" x="20" y="212" width="2.5" height="86"/>
          <text class="nm" x="36" y="237">radiators</text>
          <text class="dt" x="36" y="258">Final rejection to deep space,</text>
          <text class="dt" x="36" y="274">the only sink available.</text>
          <text class="dt" x="36" y="290">Animated, not yet radiative.</text>

          <text class="hd" x="20" y="345">SIMULATION + TRANSPORT LAYER</text>
          <rect class="bx" x="20" y="357" width="940" height="88" rx="8"/>
          <rect class="acc" x="20" y="357" width="2.5" height="88"/>
          <text class="nm" x="36" y="382">Gazebo Harmonic (gz-sim8) system plugin · protobuf bridge</text>
          <text class="dt" x="36" y="404">ThermalNodeData / ThermalLinkFlow protos · 8 custom ROS 2 messages · 5 services</text>
          <text class="dt" x="36" y="420">(CoolantFlow, InternalLoop, NodeHeatFlow, VentHeat, GetSubTopic)</text>
          <text class="dt" x="36" y="436">Station model, URDF and GNC sourced from space_station_os</text>

          <path class="dash" d="M300,357 L300,306"/>
          <path class="dash" d="M700,357 L700,306"/>
        </svg>
      </div>

      <!-- MODEL SETUP -->
      <div class="spec-block">
        <div class="block-title">Implementation Detail</div>
        <div class="block-sub">The physics is deliberately simple and explicit. The value is in the architecture behaving like a real ATCS, including its failure paths.</div>
        <div class="spec-grid">
          <div class="spec-item">
            <div class="spec-key">Thermal Network Construction</div>
            <div class="spec-val">The solver subscribes to <em>/robot_description</em> and parses the station URDF: every joint becomes a thermal node, every parent→child link becomes a conduction path with its own conductance. The topology of the thermal model is inherited from the mechanical model rather than hand-built.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Node Model</div>
            <div class="spec-val">Lumped capacitance. Initialised across physical ranges: <em>T</em> 290–310 K, <em>C</em> 500–1500 J/K, internal dissipation 30–60 W, link conductance 0.05–2.0 W/K.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Integration</div>
            <div class="spec-val">Classical 4th-order Runge–Kutta over the whole temperature vector, <em>dt</em> = 0.5 s, stepped by a 100 ms wall timer. Node time constants <em>C/k</em> span ≈250 s to ≈3×10⁴ s, a 120× spread, so the scheme is chosen to keep the fastest nodes accurate, not just stable.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Solar Flux</div>
            <div class="spec-val"><em>Q = α·A·S·max(0, n̂·ŝ)</em> per panel, with the cosine clamped at zero so shadowed panels contribute nothing. Flux swings 0 → 2.31 kW per panel over an orbit; 13.9 kW across all six at normal incidence.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Sun Vector</div>
            <div class="spec-val">Solar position computed in ECI from Julian date and Julian centuries, differenced against spacecraft position, then rotated into the body frame by quaternion conjugation, so incidence angle responds to real attitude from the GNC stack.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Internal Loops</div>
            <div class="spec-val">Two water loops (A and B), <em>c<sub>p</sub></em> = 4.186 kJ/kg·K. Heat absorbed as <em>Q = m·c<sub>p</sub>·ΔT</em>, triggered when mean node temperature crosses 400 K. Loop fill is itself a service request against a water supply that can decline.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">External Loop</div>
            <div class="spec-val">Ammonia, <em>c<sub>p</sub></em> = 4.7 kJ/kg·K, 5 kg charge, engaging only once loop A exceeds 45 °C. Tank pressure tracked as a linear function of ammonia temperature so the loop reports a plausible state to mission control.</div>
          </div>
          <div class="spec-item">
            <div class="spec-key">Interfaces</div>
            <div class="spec-val">8 custom messages and 5 services. Every cooling action is an explicit request/response with a success flag, so the requester handles refusal and unavailable services rather than assuming cooling always happens.</div>
          </div>
        </div>
      </div>

      <!-- CODE -->
      <div class="code-block">
        <div class="code-head">thermal_solver.cpp · per-node heat balance</div>
<pre><b>double</b> ThermalSolverNode::compute_dTdt(<b>const</b> std::string &amp;name,
                                        <b>const</b> std::unordered_map&lt;std::string, <b>double</b>&gt; &amp;temps)
{
  <b>const auto</b> &amp;node = thermal_nodes_[name];
  <b>double</b> q_total = node.internal_power;          <i>// avionics + metabolic dissipation</i>

  <b>for</b> (<b>const auto</b> &amp;link : thermal_links_) {     <i>// conduction with every neighbour</i>
    <b>if</b> (link.from == name &amp;&amp; temps.count(link.to))
      q_total += link.conductance * (temps.at(link.to)   - temps.at(name));
    <b>else if</b> (link.to == name &amp;&amp; temps.count(link.from))
      q_total += link.conductance * (temps.at(link.from) - temps.at(name));
  }

  <b>return</b> q_total / node.heat_capacity;            <i>// Ṫ = q̇ / C</i>
}</pre>
      </div>

      <!-- FINDINGS -->
      <div class="spec-block">
        <div class="block-title">Engineering Notes</div>
        <div class="block-sub">Why the system is built the way it is, and where the model stops.</div>
        <div class="findings">
          <div class="finding"><span class="finding-n">01</span><span>
            <b>The two-stage loop is a materials constraint, not a design flourish.</b>
            Water is the better coolant and the only one you want circulating through a crewed pressure vessel,
            but external radiator lines see deep space and water freezes. Ammonia stays liquid out there and is
            lethal inside. The interface heat exchanger exists purely so those two requirements never have to
            meet, and the software mirrors that split exactly.
          </span></div>
          <div class="finding"><span class="finding-n">02</span><span>
            <b>Cooling is modelled as a request that can fail.</b>
            The solver calls <em>/internal_loop_cooling</em> asynchronously, checks service availability, and
            handles both a refused request and an absent service. That is the difference between simulating a
            control <em>architecture</em> and simulating a differential equation. On real hardware, the pump you
            asked for is sometimes not there.
          </span></div>
          <div class="finding"><span class="finding-n">03</span><span>
            <b>Thermal topology is derived, not authored.</b>
            Parsing the URDF for nodes and links means the thermal graph automatically tracks the mechanical
            model. Add a module to the station and it gets a thermal node and conduction paths for free, which
            is the only way this stays maintainable across a station configuration that keeps changing.
          </span></div>
          <div class="finding"><span class="finding-n">04</span><span>
            <b>Solar load is attitude-driven, and that is the whole point.</b>
            Because the sun vector comes from real ECI geometry and the panel normals are rotated into the body
            frame, the heat input responds to how the station is actually flying. A panel that rotates edge-on
            drops to zero flux; the same panel at normal incidence puts 2.31 kW into the network.
          </span></div>
        </div>
      </div>

      <div class="results-section">
        <div class="results-title">Model Scope &amp; Limitations</div>
        <div class="results-subtitle">This is an architecture and controls demonstrator, not a validated ISS thermal model. Stated plainly.</div>
        <table class="results-table">
          <thead>
            <tr><th>Aspect</th><th>Status</th><th>Detail</th></tr>
          </thead>
          <tbody>
            <tr><td>Control architecture</td><td><span class="pass">✓ Implemented</span></td><td>Two-stage water→ammonia rejection with service-based triggers, thresholds and failure handling.</td></tr>
            <tr><td>Conduction network</td><td><span class="pass">✓ Implemented</span></td><td>URDF-derived graph integrated with RK4 at 10 Hz.</td></tr>
            <tr><td>Solar heat input</td><td><span class="pass">✓ Implemented</span></td><td>ECI sun vector, body-frame incidence, per-panel absorptivity and area.</td></tr>
            <tr><td>Node thermal properties</td><td>Randomised</td><td>Heat capacities, dissipation and conductances are sampled from physical ranges, not derived from ISS mass properties or real rack loads.</td></tr>
            <tr><td>Radiator rejection</td><td>Not modelled</td><td>Radiators are currently animated by rotating the solar arrays. Stefan–Boltzmann rejection with view factors and sink temperature is the next piece of physics required.</td></tr>
            <tr><td>Validation</td><td>Open</td><td>No comparison against published ISS ATCS thermal data.</td></tr>
          </tbody>
        </table>
        <div class="results-note">
          Contributed as part of the open-source Space Station OS effort in partnership with JAXA. The
          station model, GNC stack and URDF come from the upstream <em>space_station_os</em> project; the
          thermal control package described here is my contribution.
        </div>
      </div>

      <div class="project-actions">
        <a href="https://github.com/space-station-os/demo_thermal_control" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          thermal_control Repo
        </a>
        <a href="https://github.com/space-station-os/space_station_os" class="project-link" target="_blank">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Space Station OS
        </a>
      </div>
    </div>

