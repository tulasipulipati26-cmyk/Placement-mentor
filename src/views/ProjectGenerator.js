// Premium AI Project Generator View
(function() {
  let selectedBlueprint = null;
  let activeCategory = 'all'; // 'all', 'frontend', 'backend', 'data-scientist'

  window.renderProjectGeneratorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const blueprints = window.mockData.projectBlueprints;

    // Filter blueprints
    const filteredBlueprints = blueprints.filter(pb => {
      if (activeCategory === 'all') return true;
      return pb.role === activeCategory;
    });

    let blueprintsCardsHtml = '';
    filteredBlueprints.forEach(pb => {
      const isSelected = selectedBlueprint && selectedBlueprint.id === pb.id;
      
      let skillsBadges = pb.skills.map(s => `
        <span class="badge badge-info" style="font-size:0.65rem;">${s}</span>
      `).join('');

      blueprintsCardsHtml += `
        <div class="premium-card ${isSelected ? 'active-border' : ''}" style="display:flex; flex-direction:column; gap:0.75rem; cursor:pointer; border: 1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}; background: var(--bg-tertiary); transition: border-color 0.25s;" onclick="window.selectProjectBlueprint('${pb.id}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <span style="font-size:0.65rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Role: ${pb.role.toUpperCase()}</span>
            ${isSelected ? '<span class="badge badge-success" style="font-size:0.6rem;">Selected</span>' : ''}
          </div>
          <h3 style="font-family:var(--font-header); font-size:1.05rem; margin:0;">${pb.title}</h3>
          <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin:0; flex-grow:1;">${pb.desc}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.3rem; border-top:1px solid var(--border-color); padding-top:0.6rem; margin-top:0.25rem;">
            ${skillsBadges}
          </div>
        </div>
      `;
    });

    // Output Guide block
    let guideHtml = '';
    if (selectedBlueprint) {
      guideHtml = `
        <div class="premium-card" style="display:flex; flex-direction:column; gap:1.25rem; border-top:3.5px solid var(--accent-success); animation: scaleUp 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
            <div>
              <span style="font-size:0.65rem; color:var(--accent-success); font-weight:700; text-transform:uppercase;">Custom Architectural Blueprint</span>
              <h3 style="font-family:var(--font-header); font-size:1.25rem; margin-top:0.15rem;">${selectedBlueprint.title}</h3>
            </div>
            <button class="btn btn-secondary" onclick="window.triggerProjectCodeDownload()" style="padding:0.35rem 0.75rem; font-size:0.75rem;">
              <i data-lucide="download"></i> Download Spec
            </button>
          </div>

          <div class="grid-container grid-2-col" style="gap:1rem;">
            <!-- Stack details -->
            <div style="display:flex; flex-direction:column; gap:0.8rem;">
              <div>
                <h4 style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem; font-weight:700;">Database Schema</h4>
                <div style="font-family:monospace; font-size:0.8rem; background:var(--bg-primary); border:1px solid var(--border-color); padding:0.6rem; border-radius:var(--border-radius-sm); color: hsl(200, 95%, 70%);">
                  ${selectedBlueprint.database}
                </div>
              </div>

              <div>
                <h4 style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem; font-weight:700;">Infrastructure Architecture</h4>
                <div style="font-family:monospace; font-size:0.8rem; background:var(--bg-primary); border:1px solid var(--border-color); padding:0.6rem; border-radius:var(--border-radius-sm); color: hsl(280, 95%, 75%);">
                  ${selectedBlueprint.architecture}
                </div>
              </div>
            </div>

            <!-- Steps checklist -->
            <div>
              <h4 style="font-size:0.85rem; font-family:var(--font-header); margin-bottom:0.5rem; color:var(--accent-primary)">Execution Milestones</h4>
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                ${[
                  'Phase 1: Spin up local environment, docker container clusters, or index structures.',
                  'Phase 2: Establish data schema connections & initialize repository repositories.',
                  'Phase 3: Code core backend gateway middlewares or routing layouts.',
                  'Phase 4: Implement state optimization bundles and compile production builds.'
                ].map((step, sIdx) => `
                  <label style="display:flex; gap:0.5rem; align-items:center; font-size:0.8rem; cursor:pointer;">
                    <input type="checkbox" onchange="window.completeProjectStep(${sIdx}, this)" style="accent-color:var(--accent-success);" />
                    <span>${step}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      guideHtml = `
        <div style="text-align: center; padding: 3rem; border: 1.5px dashed var(--border-color); border-radius: var(--border-radius-md); color: var(--text-muted); font-size: 0.85rem;">
          Select a template from the list above and configure details to compile your customized deployment roadmap.
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); display:flex; flex-direction:column; gap:1.5rem;">
        <div>
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Project Generator</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Generate customized production-grade blueprints, database schemas, and architectural outlines.</p>
        </div>

        <!-- Filters Row -->
        <div style="display:flex; gap:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
          ${['all', 'frontend', 'backend', 'data-scientist'].map(cat => {
            const label = cat === 'all' ? 'All Roles' : cat === 'data-scientist' ? 'Data Science' : cat.charAt(0).toUpperCase() + cat.slice(1);
            const active = activeCategory === cat;
            return `
              <button class="btn ${active ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterProjectCategory('${cat}')" style="padding:0.4rem 0.8rem; font-size:0.75rem;">
                ${label}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Templates Grid -->
        <div class="grid-container grid-3-col" style="gap:1rem;">
          ${blueprintsCardsHtml}
        </div>

        <!-- Output Slot -->
        <div id="project-guide-slot">
          ${guideHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
  };

  window.filterProjectCategory = function(cat) {
    activeCategory = cat;
    selectedBlueprint = null;
    window.renderProjectGeneratorView();
  };

  window.selectProjectBlueprint = function(id) {
    selectedBlueprint = window.mockData.projectBlueprints.find(pb => pb.id === id);
    window.renderProjectGeneratorView();
  };

  window.completeProjectStep = function(index, checkbox) {
    if (checkbox.checked) {
      window.appState.addNotification('Blueprint Phase Done', `Completed Project Setup Milestone: Phase ${index + 1}!`);
      if (window.confetti) window.confetti({ particleCount: 30 });
    }
  };

  window.triggerProjectCodeDownload = function() {
    window.appState.addNotification('Blueprint Saved', 'Exported architectural blueprint specifications package.');
  };
})();
