// Premium Dream Company Tracker View
(function() {
  window.renderCompanyTrackerView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Map watchlist rows
    const watchlistHtml = state.dreamCompanies.length === 0 ? `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.85rem;">
        No companies watched yet. Add your dream company using the setup portal.
      </div>
    ` : state.dreamCompanies.map(dc => {
      // Map stages to steps count
      const stagesList = ['Resume Screening', 'Online Assessment Prep', 'Technical Interviews', 'HR round', 'Offer Secured'];
      const currentIdx = stagesList.indexOf(dc.stage);
      
      return `
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem; border-left: 4px solid var(--accent-primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-family: var(--font-header); font-size: 1.25rem;">${dc.name}</h3>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Target Placement Date: <b>${dc.targetDate}</b></p>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select class="select-field" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; width: auto;" onchange="window.updateCompanyStage('${dc.id}', this.value)">
                ${stagesList.map(st => `<option value="${st}" ${dc.stage === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
              <button class="btn btn-secondary" onclick="window.removeCompanyWatch('${dc.id}')" style="padding: 0.35rem; border-radius: var(--border-radius-sm);">
                <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--accent-danger)"></i>
              </button>
            </div>
          </div>

          <!-- Milestones timeline checklist dots -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; position: relative;">
            <div style="position: absolute; left: 0; right: 0; top: 10px; height: 2px; background: var(--border-color); z-index: 1;"></div>
            ${stagesList.map((st, idx) => {
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              return `
                <div style="display: flex; flex-direction: column; align-items: center; z-index: 2; width: 60px; text-align: center;">
                  <div style="width: 20px; height: 20px; border-radius: 50%; background: ${active ? 'var(--accent-primary)' : done ? 'var(--accent-success)' : 'var(--bg-secondary)'}; border: 2.5px solid ${done || active ? 'transparent' : 'var(--border-color)'}; display:flex; align-items:center; justify-content:center; color: white;">
                    ${done && !active ? '<i data-lucide="check" style="width:10px; height:10px;"></i>' : ''}
                  </div>
                  <span style="font-size: 0.6rem; color: ${active ? 'var(--text-primary)' : 'var(--text-muted)'}; font-weight: 600; margin-top: 0.35rem; line-height: 1.2;">
                    ${st.split(' ')[0]}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Dream Company Tracker</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Monitor application dates and track preparation steps for your targeted companies.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Watchlist Items -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${watchlistHtml}
          </div>

          <!-- Add company portal -->
          <div class="premium-card" style="height: fit-content;">
            <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="plus" style="color: var(--accent-primary)"></i> Track Dream Company
            </h3>

            <form id="add-dream-company-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label for="track-comp-dd">Select Company</label>
                <select id="track-comp-dd" class="select-field">
                  ${window.mockData.companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="track-comp-date">Target Placement Date</label>
                <input type="date" id="track-comp-date" class="input-field" required />
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%;">
                Add to Watchlist
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindCompanyTrackerEvents();
  };

  window.removeCompanyWatch = function(id) {
    window.appState.removeDreamCompany(id);
    window.renderCompanyTrackerView();
  };

  window.updateCompanyStage = function(id, stage) {
    window.appState.updateDreamCompanyStage(id, stage);
    window.renderCompanyTrackerView();
  };

  function bindCompanyTrackerEvents() {
    const form = document.getElementById('add-dream-company-form');
    if (!form) return;

    // Default target date to 2 months from today
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    document.getElementById('track-comp-date').value = futureDate.toISOString().split('T')[0];

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const companyId = document.getElementById('track-comp-dd').value;
      const targetDate = document.getElementById('track-comp-date').value;

      window.appState.addDreamCompany(companyId, targetDate);
      window.renderCompanyTrackerView();
    });
  }
})();
