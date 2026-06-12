// Premium Application Tracker View with Kanban Stages
(function() {
  window.renderAppTrackerView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const apps = state.smartApplications;

    const stages = ['Applied', 'Online Assessment', 'Interviewing', 'Offered', 'Rejected'];

    // Stage colors
    const stageColors = {
      'Applied': 'var(--accent-primary)',
      'Online Assessment': 'hsl(280, 85%, 60%)',
      'Interviewing': 'hsl(200, 85%, 50%)',
      'Offered': 'var(--accent-success)',
      'Rejected': 'var(--accent-danger)'
    };

    // Build Kanban columns
    let columnsHtml = '';
    stages.forEach(stage => {
      const stageApps = apps.filter(a => a.stage === stage);
      
      let cardsHtml = '';
      if (stageApps.length === 0) {
        cardsHtml = `
          <div style="text-align: center; padding: 2rem 1rem; border: 1px dashed var(--border-color); border-radius: var(--border-radius-sm); color: var(--text-muted); font-size: 0.75rem;">
            No applications here
          </div>
        `;
      } else {
        stageApps.forEach(app => {
          cardsHtml += `
            <div class="premium-card" style="padding: 1rem; border-left: 3px solid ${stageColors[stage] || 'var(--border-color)'}; display:flex; flex-direction:column; gap:0.6rem; margin-bottom:0.75rem; background: var(--bg-tertiary);">
              <div>
                <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin:0;">${app.role}</h4>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-top:0.15rem;">${app.company}</div>
              </div>
              
              <div style="display:flex; justify-content:space-between; align-items:center; font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top:0.25rem;">
                <span>Logged: ${app.date}</span>
                
                <select class="select-field" style="padding: 0.2rem 0.4rem; font-size: 0.65rem; width: auto; background: var(--bg-primary); border-color: var(--border-color); height: auto;" onchange="window.moveAppStage('${app.id}', this.value)">
                  ${stages.map(st => `<option value="${st}" ${app.stage === st ? 'selected' : ''}>${st}</option>`).join('')}
                </select>
              </div>
            </div>
          `;
        });
      }

      columnsHtml += `
        <div style="flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 0.75rem; background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid ${stageColors[stage] || 'var(--border-color)'}; padding-bottom: 0.5rem; margin-bottom:0.5rem;">
            <h3 style="font-size: 0.9rem; font-family: var(--font-header); font-weight: 700; margin:0; display:flex; align-items:center; gap:0.4rem;">
              <span style="display:inline-block; width: 8px; height: 8px; border-radius:50%; background: ${stageColors[stage] || 'transparent'};"></span>
              ${stage}
            </h3>
            <span style="font-size: 0.7rem; background: var(--bg-tertiary); padding: 0.15rem 0.4rem; border-radius: 10px; font-weight: 600;">${stageApps.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto; max-height: 500px;">
            ${cardsHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); display:flex; flex-direction:column; gap:1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header); margin: 0;">Smart Application Tracker</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem; margin-bottom:0;">Organize and move your job and internship applications through standard hiring pipelines.</p>
          </div>
          <button id="add-app-trigger-btn" class="btn btn-primary" style="display:flex; align-items:center; gap:0.4rem;">
            <i data-lucide="plus"></i> Add New Application
          </button>
        </div>

        <!-- Pop-out modal or inline expander for adding a new application -->
        <div id="add-app-inline-form-card" class="premium-card" style="display: none; animation: slideDown 0.3s ease;">
          <h3 style="font-family: var(--font-header); font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.4rem;">
            <i data-lucide="list-todo" style="color: var(--accent-primary)"></i> Track Application Details
          </h3>
          <form id="new-app-form" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
            <div class="form-group">
              <label for="app-company">Company Name</label>
              <input type="text" id="app-company" class="input-field" placeholder="e.g. Google" required />
            </div>
            <div class="form-group">
              <label for="app-role">Designation / Role</label>
              <input type="text" id="app-role" class="input-field" placeholder="e.g. Frontend Engineer Intern" required />
            </div>
            <div class="form-group">
              <label for="app-stage">Current Stage</label>
              <select id="app-stage" class="select-field">
                ${stages.map(st => `<option value="${st}">${st}</option>`).join('')}
              </select>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="submit" class="btn btn-primary" style="flex:1;">Save Application</button>
              <button type="button" id="cancel-add-app-btn" class="btn btn-secondary" style="padding:0.6rem;">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Kanban Board Row -->
        <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; align-items: stretch;">
          ${columnsHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindAppTrackerEvents();
  };

  window.moveAppStage = function(appId, newStage) {
    window.appState.updateSmartApplicationStage(appId, newStage);
    window.renderAppTrackerView();
  };

  function bindAppTrackerEvents() {
    const triggerBtn = document.getElementById('add-app-trigger-btn');
    const formCard = document.getElementById('add-app-inline-form-card');
    const cancelBtn = document.getElementById('cancel-add-app-btn');
    const form = document.getElementById('new-app-form');

    if (triggerBtn && formCard) {
      triggerBtn.addEventListener('click', () => {
        const isHidden = formCard.style.display === 'none';
        formCard.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (cancelBtn && formCard) {
      cancelBtn.addEventListener('click', () => {
        formCard.style.display = 'none';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const company = document.getElementById('app-company').value.trim();
        const role = document.getElementById('app-role').value.trim();
        const stage = document.getElementById('app-stage').value;

        window.appState.addSmartApplication(company, role, stage);
        form.reset();
        formCard.style.display = 'none';
        window.renderAppTrackerView();
      });
    }
  }
})();
