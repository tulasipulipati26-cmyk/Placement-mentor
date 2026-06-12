// Premium Standalone LinkedIn Profile Optimizer View
(function() {
  window.renderLinkedInOptimizerView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const analysis = state.linkedinAnalysis;

    let auditResultHtml = '';
    if (analysis) {
      auditResultHtml = `
        <div class="premium-card" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.25rem; animation: scaleUp 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-header)">LinkedIn Audit Scorecard</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem;">Interactive completeness telemetry</p>
            </div>
            <span class="badge ${analysis.score >= 75 ? 'badge-success' : 'badge-warning'}" style="font-size: 1rem; padding: 0.4rem 0.8rem;">
              Audit Score: ${analysis.score}%
            </span>
          </div>

          <div class="grid-container grid-2-col">
            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; color: var(--accent-danger); margin-bottom: 0.5rem;">Missing Sections</h4>
              <ul style="list-style-position: inside; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                ${analysis.missingElements.length === 0 ? `<li>All core sections detected!</li>` : analysis.missingElements.map(e => `<li>${e}</li>`).join('')}
              </ul>
            </div>

            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; color: var(--accent-primary); margin-bottom: 0.5rem;">Action Items</h4>
              <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
                ${analysis.suggestions.map(s => `
                  <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <i data-lucide="check" style="color: var(--accent-success); width:16px; height:16px; flex-shrink:0; margin-top:2px;"></i>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">LinkedIn Optimizer</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Audit and upgrade your social profiles to increase recruiter search appearances.</p>
        </div>

        <div class="grid-container grid-main-side">
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="linkedin" style="color: #0077b5"></i> Profile Completeness Auditor
            </h3>
            
            <div class="form-group">
              <label for="li-profile-url">LinkedIn Profile URL</label>
              <input type="url" id="li-profile-url" class="input-field" placeholder="https://linkedin.com/in/yourprofile" />
            </div>

            <div class="form-group">
              <label for="li-about-text">Paste "About" or experience copy-paste dump</label>
              <textarea id="li-about-text" class="textarea-field" rows="6" placeholder="Paste summary headline, about details, or work experience description..."></textarea>
            </div>

            <button id="analyze-linkedin-btn" class="btn btn-primary" style="width: 100%;">
              <i data-lucide="shield-check"></i> Audit Profile
            </button>
          </div>

          <div class="premium-card" style="background: rgba(0, 119, 181, 0.05);">
            <h3 style="font-family: var(--font-header); margin-bottom: 0.5rem; font-size: 1rem; color: #0077b5;">Social Selling Index</h3>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
              Recruiters use LinkedIn to source passive candidates. Profiles with keyword-dense bios, headlines, and matching experiences get 14x more profile views.
            </p>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
              Complete our audit scorecard to optimize your outreach profile.
            </p>
          </div>
        </div>

        <div id="linkedin-report-container">
          ${auditResultHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindLinkedInEvents();
  };

  function bindLinkedInEvents() {
    const analyzeLiBtn = document.getElementById('analyze-linkedin-btn');
    if (analyzeLiBtn) {
      analyzeLiBtn.addEventListener('click', () => {
        const profileUrl = document.getElementById('li-profile-url').value;
        const details = document.getElementById('li-about-text').value;

        if (!details) {
          window.appState.addNotification('Auditor Error', 'Please paste profile overview details.');
          return;
        }

        analyzeLiBtn.disabled = true;
        analyzeLiBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Auditing...';
        window.lucide.createIcons();

        setTimeout(() => {
          window.appState.analyzeLinkedIn(profileUrl, details);
          window.renderLinkedInOptimizerView();
        }, 1200);
      });
    }
  }
})();
