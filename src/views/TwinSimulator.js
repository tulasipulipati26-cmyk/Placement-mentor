// Premium AI Placement Twin Simulator View
(function() {
  window.renderTwinSimulatorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const sim = state.simulator;

    let contentHtml = '';

    if (sim.stage === 'not-started') {
      contentHtml = `
        <div class="premium-card" style="max-width: 650px; margin: 2rem auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="gamepad-2" style="width: 36px; height: 36px;"></i>
          </div>
          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.75rem;">AI Placement Twin Simulator</h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.4rem; line-height: 1.6;">
              Test your decision-making against an AI-optimized "Placement Twin" (your profile model upgraded to maximum readiness scores). Select a target firm, and make strategic choices through resume screens, coding assessments, and system design interviews to beat the selection criteria.
            </p>
          </div>

          <!-- Comparison Specs -->
          <div style="display: flex; gap: 1rem; width: 100%; text-align: left; margin: 0.5rem 0;">
            <div style="flex-grow: 1; background: var(--bg-primary); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight:700; text-transform:uppercase;">Your Stats</div>
              <div style="font-size: 1.15rem; font-weight: 800; margin-top: 0.25rem;">Readiness: ${state.readinessScore}%</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">CGPA: ${state.userProfile.cgpa}</div>
            </div>

            <div style="flex-grow: 1; background: rgba(var(--accent-primary-rgb), 0.05); border: 1px solid rgba(var(--accent-primary-rgb), 0.2); padding: 1rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight:700; text-transform:uppercase;">AI Twin Stats</div>
              <div style="font-size: 1.15rem; font-weight: 800; margin-top: 0.25rem; color: var(--accent-primary);">Readiness: 98%</div>
              <div style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 0.2rem;">CGPA: 9.8 (Optimized)</div>
            </div>
          </div>

          <div class="form-group" style="width: 100%; text-align: left;">
            <label for="twin-company-select">Select Dream Company Target</label>
            <select id="twin-company-select" class="select-field">
              ${window.mockData.companies.map(c => `
                <option value="${c.id}">${c.name} (${c.difficulty})</option>
              `).join('')}
            </select>
          </div>

          <button id="start-twin-sim-btn" class="btn btn-primary" style="width: 100%;">
            Launch Twin Simulation
          </button>
        </div>
      `;
    } else {
      let actionButtonsHtml = '';
      if (sim.stage === 'resume-round') {
        actionButtonsHtml = `
          <button class="btn btn-secondary" onclick="window.stepTwinSim(0)">Apply with standard profile (Resume ATS Match: 50%)</button>
          <button class="btn btn-primary" onclick="window.stepTwinSim(1)">Mimic Twin: Conduct keyword optimization (Resume Match: 88%)</button>
        `;
      } else if (sim.stage === 'test-round') {
        actionButtonsHtml = `
          <button class="btn btn-primary" onclick="window.stepTwinSim(0)">Mimic Twin: Apply logical formulas and speedrun parameters</button>
          <button class="btn btn-secondary" onclick="window.stepTwinSim(1)">Attempt coding solutions without prep parameters</button>
        `;
      } else if (sim.stage === 'interview-round') {
        actionButtonsHtml = `
          <button class="btn btn-primary" onclick="window.stepTwinSim(0)">Mimic Twin: Frame answers using STAR framework & metrics</button>
          <button class="btn btn-secondary" onclick="window.stepTwinSim(1)">Provide brief definitions without project details</button>
        `;
      } else {
        // win / loss Offered or Rejected
        const isWin = sim.stage === 'offered';
        actionButtonsHtml = `
          <button class="btn btn-primary" onclick="window.appState.resetSimulator(); window.renderTwinSimulatorView();">Restart Simulator</button>
        `;
      }

      const stageIcons = {
        'resume-round': 'file-search',
        'test-round': 'laptop',
        'interview-round': 'users',
        'offered': 'check-circle-2',
        'rejected': 'x-octagon'
      };

      contentHtml = `
        <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Round Telemetry -->
          <div class="premium-card" style="display: flex; gap: 1.5rem; align-items: center;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--bg-tertiary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="${stageIcons[sim.stage] || 'help-circle'}" style="color: var(--accent-primary);"></i>
            </div>
            <div>
              <span style="font-size:0.7rem; font-weight:700; color:var(--accent-primary); text-transform:uppercase;">ROUND: ${sim.stage.replace('-', ' ')}</span>
              <h3 style="font-family: var(--font-header); margin-top: 0.1rem;">Quest Stage: ${sim.company.name} Offer</h3>
            </div>
            <div style="margin-left:auto; text-align:right;">
              <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:600;">Quest Points</span>
              <div style="font-size: 1.25rem; font-weight:800; color:var(--accent-success);">${sim.score}</div>
            </div>
          </div>

          <!-- Logs -->
          <div class="premium-card" style="background: hsl(224, 25%, 5%); border-color: var(--border-color); font-family: monospace; font-size: 0.8rem; padding: 1.5rem; color: #bef264; min-height: 200px; max-height: 300px; overflow-y: auto;">
            ${sim.log.map(line => `
              <div style="margin-bottom:0.4rem;">
                <span style="color:var(--text-muted);">$</span> ${line}
              </div>
            `).join('')}
          </div>

          <!-- Decision Options -->
          <div class="premium-card" style="text-align: center; display: flex; flex-direction: column; gap: 1rem;">
            <h4 style="font-family: var(--font-header); font-size: 0.95rem;">Select your strategic action:</h4>
            <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
              ${actionButtonsHtml}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Placement Twin Simulator</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Compare decisions against an AI-optimized model to secure dream placements.</p>
        </div>

        ${contentHtml}
      </div>
    `;

    window.lucide.createIcons();
    bindTwinEvents();
  };

  window.stepTwinSim = function(choice) {
    window.appState.advanceSimulatorRound(choice);
    window.renderTwinSimulatorView();
  };

  function bindTwinEvents() {
    const startBtn = document.getElementById('start-twin-sim-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const companyId = document.getElementById('twin-company-select').value;
        window.appState.startSimulator(companyId);
        window.renderTwinSimulatorView();
      });
    }
  }
})();
