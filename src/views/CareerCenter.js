// Premium Career Center, Jobs, Company Insights & Success Simulator View
(function() {
  let activeSectionTab = 'jobs'; // 'jobs', 'companies', 'simulator'
  let selectedCompanyId = 'c1'; // Google

  window.renderCareerCenterView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Section Toggle Menu
    const navMenuHtml = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
        <button class="btn ${activeSectionTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setCareerCenterSubTab('jobs')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="briefcase"></i> Job Recommendations
        </button>
        <button class="btn ${activeSectionTab === 'companies' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setCareerCenterSubTab('companies')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="building-2"></i> Company Insights
        </button>
        <button class="btn ${activeSectionTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setCareerCenterSubTab('simulator')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="gamepad-2"></i> Success Simulator
        </button>
      </div>
    `;

    let contentHtml = '';
    if (activeSectionTab === 'jobs') {
      contentHtml = renderJobs(state);
    } else if (activeSectionTab === 'companies') {
      contentHtml = renderCompanies(state);
    } else if (activeSectionTab === 'simulator') {
      contentHtml = renderSimulator(state);
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Career Opportunities Center</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Apply for curated roles, analyze top companies, and play the placement simulation game.</p>
        </div>

        ${navMenuHtml}
        ${contentHtml}
      </div>
    `;

    window.lucide.createIcons();
    bindCareerCenterEvents(state);
  };

  window.setCareerCenterSubTab = function(tab) {
    activeSectionTab = tab;
    window.renderCareerCenterView();
  };

  // 1. Job Recommendation Renderer
  function renderJobs(state) {
    // Filter jobs matching user's target role
    const filteredJobs = window.mockData.jobs.filter(j => j.role === state.userProfile.targetRole);
    
    const jobCardsHtml = filteredJobs.map(job => {
      const isEligible = state.readinessScore >= job.readinessRequired;
      return `
        <div class="premium-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="badge badge-info">${job.type}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${job.location}</span>
            </div>
            <h3 style="font-family: var(--font-header); font-size: 1.1rem; line-height: 1.3;">${job.title}</h3>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--accent-primary); margin-top: 0.25rem;">${job.company}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; display: flex; align-items:center; gap: 0.25rem;">
              <i data-lucide="circle-dollar-sign" style="width:14px; height:14px;"></i>
              <span>${job.package || job.stipend}</span>
            </div>
          </div>
          
          <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; display:flex; flex-direction:column; gap:0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
              <span>Min Readiness Score:</span>
              <span style="font-weight: 700; color: ${isEligible ? 'var(--accent-success)' : 'var(--accent-danger)'}">${job.readinessRequired}%</span>
            </div>
            <button class="btn ${isEligible ? 'btn-primary' : 'btn-secondary'}" onclick="window.applyForJob('${job.id}', ${isEligible})" style="width: 100%; font-size: 0.8rem; padding: 0.5rem 1rem;">
              ${isEligible ? 'Apply Now' : 'Locked (Low Score)'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="grid-container grid-3-col">
        ${jobCardsHtml}
      </div>
    `;
  }

  window.applyForJob = function(jobId, isEligible) {
    if (!isEligible) {
      window.appState.addNotification('Application Locked', 'Your placement readiness score is below this job\'s threshold. Complete tests and mocks first!');
      return;
    }
    
    window.appState.addNotification('Application Sent!', 'Applied successfully! Recruiter will contact you based on your optimized profile.');
  };

  // 2. Company Insights Renderer
  function renderCompanies(state) {
    const activeCompany = window.mockData.companies.find(c => c.id === selectedCompanyId) || window.mockData.companies[0];
    
    return `
      <div class="grid-container grid-main-side">
        <!-- Selector and General Specs -->
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="form-group">
            <label for="company-select-dd">Select Company Profile</label>
            <select id="company-select-dd" class="select-field" onchange="window.selectCompanyDetail(this.value)">
              ${window.mockData.companies.map(c => `
                <option value="${c.id}" ${selectedCompanyId === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div style="display: flex; gap: 1rem;">
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: var(--border-radius-sm); text-align: center; flex-grow:1;">
              <div style="font-size: 1.25rem; font-weight:800; color: var(--accent-danger);">${activeCompany.difficulty}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted); text-transform:uppercase;">Difficulty</div>
            </div>

            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: var(--border-radius-sm); text-align: center; flex-grow:1;">
              <div style="font-size: 1.25rem; font-weight:800; color: var(--accent-primary);">${activeCompany.hiringRate}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted); text-transform:uppercase;">Success Rate</div>
            </div>
          </div>

          <div>
            <h4 style="font-family: var(--font-header); font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--accent-primary);">Recruitment Pipeline Rounds</h4>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; padding-left: 0.5rem;">
              ${activeCompany.rounds.map((round, idx) => `
                <div style="font-size: 0.8rem; color: var(--text-secondary);"><b>${idx + 1}.</b> ${round}</div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- FAQ and Expert Tips -->
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-family: var(--font-header); display: flex; align-items:center; gap: 0.5rem;">
            <i data-lucide="award" style="color: var(--accent-primary)"></i> Frequently Asked Questions
          </h3>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${activeCompany.frequentlyAsked.map(q => `
              <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--border-radius-sm); font-size: 0.8rem;">
                <span style="font-weight: 700; color: var(--accent-primary);">Q:</span> ${q}
              </div>
            `).join('')}
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
            <h4 style="font-family: var(--font-header); font-size: 0.9rem; color: var(--accent-success); margin-bottom: 0.25rem;">Expert Audit Tip:</h4>
            <p style="font-size: 0.8rem; line-height:1.5; color: var(--text-secondary);">${activeCompany.insights}</p>
          </div>
        </div>
      </div>
    `;
  }

  window.selectCompanyDetail = function(companyId) {
    selectedCompanyId = companyId;
    window.renderCareerCenterView();
  };

  // 3. Placement Success Simulator Game Renderer
  function renderSimulator(state) {
    const sim = state.simulator;

    // Not Started Screen
    if (sim.stage === 'not-started') {
      return `
        <div class="premium-card" style="max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 3rem;">
          <div style="width: 70px; height: 70px; border-radius:50%; background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); display: flex; align-items:center; justify-content:center;">
            <i data-lucide="swords" style="width: 38px; height: 38px;"></i>
          </div>
          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.5rem;">Placement Success Simulator</h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.5;">
              Step into an interactive career quest! Choose a target company and make strategic choices in multiple interview rounds (Resume screening, online test, core coding interviews) to win the job.
            </p>
          </div>

          <div class="form-group" style="width: 100%; text-align:left;">
            <label for="sim-company-dd">Select Company to Apply</label>
            <select id="sim-company-dd" class="select-field">
              ${window.mockData.companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>

          <button id="start-sim-btn" class="btn btn-primary" style="width: 100%;">
            Start Placement Quest
          </button>
        </div>
      `;
    }

    // Game in progress
    let actionButtonsHtml = '';
    
    if (sim.stage === 'resume-round') {
      actionButtonsHtml = `
        <button class="btn btn-secondary" onclick="window.advanceSimulator(0)">Submit Default Resume</button>
        <button class="btn btn-primary" onclick="window.advanceSimulator(1)">Optimize Resume first with ATS Scorer</button>
      `;
    } else if (sim.stage === 'test-round') {
      actionButtonsHtml = `
        <button class="btn btn-primary" onclick="window.advanceSimulator(0)">Solve using speedrun formulas and patterns</button>
        <button class="btn btn-secondary" onclick="window.advanceSimulator(1)">Guess answers to finish quickly</button>
      `;
    } else if (sim.stage === 'interview-round') {
      actionButtonsHtml = `
        <button class="btn btn-primary" onclick="window.advanceSimulator(0)">Explain using STAR Framework and project metrics</button>
        <button class="btn btn-secondary" onclick="window.advanceSimulator(1)">Provide brief technical definition answers</button>
      `;
    } else { // win/lose Offered or Rejected
      actionButtonsHtml = `
        <button class="btn btn-primary" onclick="window.appState.resetSimulator()">Restart Quest</button>
      `;
    }

    const simImageMap = {
      'resume-round': 'file-search',
      'test-round': 'laptop',
      'interview-round': 'users',
      'offered': 'check-circle-2',
      'rejected': 'x-octagon'
    };

    return `
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Game Display Screen -->
        <div class="premium-card" style="display: flex; gap: 1.5rem; padding: 2rem; align-items: center;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--bg-tertiary); display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
            <i data-lucide="${simImageMap[sim.stage] || 'help-circle'}" style="color: var(--accent-primary); width: 32px; height: 32px;"></i>
          </div>
          <div>
            <span style="font-size:0.75rem; text-transform: uppercase; font-weight:700; color:var(--accent-primary);">SIMULATOR ROUND: ${sim.stage.replace('-', ' ')}</span>
            <h3 style="font-family: var(--font-header); margin-top: 0.15rem;">Quest for ${sim.company.name} Offer</h3>
          </div>
          <div style="margin-left: auto; text-align:right;">
            <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:600;">Quest Points</span>
            <div style="font-size: 1.5rem; font-weight:800; color: var(--accent-success);">${sim.score}</div>
          </div>
        </div>

        <!-- Logs Terminal terminal representation -->
        <div class="premium-card" style="background: hsl(224, 25%, 6%); border-color: hsl(224, 25%, 15%); font-family: monospace; font-size: 0.8rem; padding: 1.5rem; color: #a3e635; display: flex; flex-direction: column; gap: 0.5rem; min-height: 200px; max-height: 300px; overflow-y: auto;">
          ${sim.log.map(line => `
            <div style="line-height:1.5;">
              <span style="color: var(--text-muted);">$</span> ${line}
            </div>
          `).join('')}
        </div>

        <!-- User Choices Card -->
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem; text-align:center;">
          <h4 style="font-family: var(--font-header); font-size: 0.95rem;">Select your next action:</h4>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            ${actionButtonsHtml}
          </div>
        </div>

      </div>
    `;
  }

  window.advanceSimulator = function(actionIndex) {
    window.appState.advanceSimulatorRound(actionIndex);
    window.renderCareerCenterView();
  };

  function bindCareerCenterEvents(state) {
    const startBtn = document.getElementById('start-sim-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const companyId = document.getElementById('sim-company-dd').value;
        window.appState.startSimulator(companyId);
        window.renderCareerCenterView();
      });
    }
  }
})();
