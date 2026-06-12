// Premium AI Career GPS View with Career Progression Timelines
(function() {
  let viewingRole = null;

  window.renderCareerGPSView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Default to the student's target role
    if (!viewingRole) {
      viewingRole = state.userProfile.targetRole || 'frontend';
    }

    const pathData = window.mockData.gpsPaths[viewingRole] || window.mockData.gpsPaths['frontend'];
    const selectedRoleData = window.mockData.targetRoles.find(r => r.id === viewingRole);

    let timelineHtml = '';
    pathData.forEach((step, idx) => {
      const isLast = idx === pathData.length - 1;
      
      let skillsHtml = '';
      step.criticalSkills.forEach(s => {
        const hasSkill = state.userProfile.skills.includes(s);
        skillsHtml += `
          <span class="badge ${hasSkill ? 'badge-success' : 'badge-info'}" style="font-size:0.7rem; gap:0.25rem;">
            ${hasSkill ? '<i data-lucide="check" style="width:10px; height:10px;"></i>' : ''} ${s}
          </span>
        `;
      });

      timelineHtml += `
        <div style="display: flex; gap: 1.5rem; position: relative;">
          <!-- Node / Line indicator -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 40px; flex-shrink: 0;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-tertiary); border: 2.5px solid var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent-primary); font-size: 0.85rem; z-index: 2; box-shadow: 0 0 10px rgba(var(--accent-primary-rgb), 0.25);">
              ${idx + 1}
            </div>
            ${!isLast ? `<div style="width: 2.5px; flex-grow: 1; background: linear-gradient(to bottom, var(--accent-primary) 0%, var(--border-color) 100%); margin: 0.5rem 0; z-index: 1;"></div>` : ''}
          </div>

          <!-- Card Content -->
          <div class="premium-card" style="flex-grow: 1; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-family: var(--font-header); font-size: 1.15rem; margin:0;">${step.role}</h3>
                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Band Target: ${step.experience}</span>
              </div>
              <span class="badge badge-primary" style="font-size:0.7rem; padding:0.25rem 0.5rem;">Phase ${idx + 1}</span>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin:0;">${step.description}</p>

            <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top:0.25rem;">
              <div style="font-size: 0.7rem; color: var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem;">Critical Skills Needed:</div>
              <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                ${skillsHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Career GPS</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">Explore skill roadmaps and vertical career progression tracks.</p>
          </div>

          <div style="display:flex; align-items:center; gap:0.5rem;">
            <label for="gps-role-select" style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Explore Track:</label>
            <select id="gps-role-select" class="select-field" style="width:auto; padding:0.4rem 1rem;">
              ${window.mockData.targetRoles.map(r => `<option value="${r.id}" ${viewingRole === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Timeline Progression Column -->
          <div style="display: flex; flex-direction: column;">
            ${timelineHtml}
          </div>

          <!-- Side Advice -->
          <div style="display:flex; flex-direction:column; gap:1.5rem;">
            <div class="premium-card" style="background: rgba(var(--accent-primary-rgb), 0.05);">
              <h3 style="font-family: var(--font-header); color: var(--accent-primary); font-size:1.1rem; margin-bottom:0.5rem;">Progression Velocity</h3>
              <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary);">
                This roadmap charts milestones from junior engineer roles to architect tiers. Green skills indicate technologies already verified in your student profile.
              </p>
              <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary); margin-top:0.5rem;">
                Complete timed skill tests and build projects to unlock locked milestones.
              </p>
            </div>

            <div class="premium-card">
              <h3 style="font-family: var(--font-header); font-size:1rem; margin-bottom:0.75rem;">Your Goal Target</h3>
              <div style="display:flex; gap:0.75rem; align-items:center;">
                <div style="width: 40px; height: 40px; border-radius:50%; background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <i data-lucide="compass"></i>
                </div>
                <div>
                  <h4 style="font-size:0.85rem; margin:0;">${selectedRoleData ? selectedRoleData.name : 'Target Target'}</h4>
                  <span style="font-size:0.7rem; color:var(--text-muted);">Configured in profile parameters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindGPSEvents();
  };

  function bindGPSEvents() {
    const selector = document.getElementById('gps-role-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        viewingRole = e.target.value;
        window.renderCareerGPSView();
      });
    }
  }
})();
