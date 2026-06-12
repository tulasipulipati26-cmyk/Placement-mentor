// Premium Success Heatmap View (GitHub-style Activity Calendar Grid)
(function() {
  window.renderSuccessHeatmapView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const heatmap = state.studyHeatmap;

    // Heatmap cell level colors
    const colors = [
      'var(--bg-primary)', // level 0 - no activity
      'rgba(var(--accent-primary-rgb), 0.25)', // level 1 - low activity
      'rgba(var(--accent-primary-rgb), 0.55)', // level 2 - mid activity
      'rgba(var(--accent-primary-rgb), 0.8)', // level 3 - high activity
      'var(--accent-primary)' // level 4 - peak activity
    ];

    // Chunk the 98 days into 14 weeks (columns) of 7 days (rows)
    let weeksHtml = '';
    for (let w = 0; w < 14; w++) {
      const weekDays = heatmap.slice(w * 7, (w + 1) * 7);
      let cellsHtml = '';
      
      weekDays.forEach(dayInfo => {
        const bg = colors[dayInfo.level] || colors[0];
        cellsHtml += `
          <div class="heatmap-cell" style="width:13px; height:13px; background:${bg}; border-radius:2px; border: 1px solid var(--border-color);" title="${dayInfo.date}: Level ${dayInfo.level} intensity"></div>
        `;
      });

      weeksHtml += `
        <div style="display:flex; flex-direction:column; gap:4px;">
          ${cellsHtml}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); display:flex; flex-direction:column; gap:1.5rem;">
        <div>
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Learning Consistency Heatmap</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Monitor your daily study hours, speedrun test performance, and consistency logs.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Left: Heatmap Grid -->
          <div class="premium-card" style="display:flex; flex-direction:column; gap:1rem;">
            <h3 style="font-family:var(--font-header); font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.4rem;">
              <i data-lucide="grid" style="color:var(--accent-primary)"></i> Activity Grid (Past 14 Weeks)
            </h3>
            
            <!-- Heatmap calendar block -->
            <div style="display:flex; gap:6px; overflow-x:auto; padding: 1.5rem 0.5rem; background: var(--bg-secondary); border-radius: var(--border-radius-md); border:1px solid var(--border-color); justify-content:center;">
              <!-- Day names side column -->
              <div style="display:flex; flex-direction:column; gap:4px; font-size:0.6rem; color:var(--text-muted); justify-content:space-around; margin-right:4px; font-weight:700;">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
              
              ${weeksHtml}
            </div>

            <!-- Legend -->
            <div style="display:flex; justify-content:flex-end; align-items:center; gap:0.4rem; font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem;">
              <span>Less</span>
              ${colors.map(c => `<div style="width:10px; height:10px; background:${c}; border-radius:1px; border: 1px solid var(--border-color);"></div>`).join('')}
              <span>More</span>
            </div>
          </div>

          <!-- Right: Summary widgets -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div class="premium-card" style="background: rgba(var(--accent-primary-rgb), 0.05);">
              <h3 style="font-family:var(--font-header); font-size:1.05rem; color:var(--accent-primary); margin-bottom:0.5rem;">Consistency Impact</h3>
              <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary);">
                Recruitment success models value learning consistency. Daily active logs raise candidate profile visibility weights by up to 20% on peer pools.
              </p>
            </div>

            <div class="premium-card" style="display:flex; gap:0.75rem; align-items:center;">
              <i data-lucide="timer" style="color:var(--accent-success); width:28px; height:28px;"></i>
              <div>
                <h4 style="font-size:0.85rem; margin:0;">Target Daily Practice</h4>
                <span style="font-size:0.75rem; color:var(--text-muted);">Aim for 45 minutes of learning daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
  };
})();
