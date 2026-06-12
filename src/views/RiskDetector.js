// Premium Placement Risk Detector View
(function() {
  window.renderRiskDetectorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Heuristically identify risks
    const risks = [];
    const cgpa = parseFloat(state.userProfile.cgpa) || 7.0;
    const skillsCount = state.userProfile.skills.length;
    const mockCount = state.mockInterviews.length;
    const testCount = state.testHistory.length;

    if (cgpa < 7.5) {
      risks.push({
        title: 'Academic Filter Vulnerability',
        impact: 'High',
        desc: 'A CGPA below 7.5 exposes you to auto-filtering by Tier-1 companies (like Google/Microsoft).',
        mitigation: 'Focus on startup applications, off-campus referrals, and highlight open-source contributions.'
      });
    }

    if (skillsCount < 4) {
      risks.push({
        title: 'Tech Stack Portfolio Shortage',
        impact: 'High',
        desc: 'You have fewer than 4 verified skills mapped to your profile, triggering low ATS match rates.',
        mitigation: 'Complete the target roadmap items and add missing frameworks in the Skill Gap analyzer.'
      });
    }

    if (mockCount === 0) {
      risks.push({
        title: 'Unprepared Interview Articulation',
        impact: 'Medium',
        desc: 'No Mock Interview sessions completed. Vocal filler rates and structural coherence are unverified.',
        mitigation: 'Run a 3-question HR session in the Mock Interview simulator and verify filler word count.'
      });
    }

    if (testCount === 0) {
      risks.push({
        title: 'Assessment Speedrun Deficit',
        impact: 'Medium',
        desc: 'Zero aptitude tests attempted. Speed and accuracy limits are unindexed.',
        mitigation: 'Attempt the Quantitative & Logical Speedrun in the tests dashboard.'
      });
    }

    // Default mock risk if profile is perfect
    if (risks.length === 0) {
      risks.push({
        title: 'Unoptimized Resume Keywords',
        impact: 'Low',
        desc: 'Your resume keywords are aligned, but maintain updates for target companies.',
        mitigation: 'Run a Resume vs JD match check prior to applying to a new firm.'
      });
    }

    const riskLevel = risks.filter(r => r.impact === 'High').length > 0 ? 'High' : risks.length >= 2 ? 'Medium' : 'Low';
    const riskLevelColor = riskLevel === 'High' ? 'var(--accent-danger)' : riskLevel === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)';

    const risksHtml = risks.map(r => `
      <div class="premium-card" style="border-top: 3.5px solid ${r.impact === 'High' ? 'var(--accent-danger)' : r.impact === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h4 style="font-family: var(--font-header); font-size: 1.05rem;">${r.title}</h4>
          <span class="badge ${r.impact === 'High' ? 'badge-danger' : r.impact === 'Medium' ? 'badge-warning' : 'badge-success'}">${r.impact} Risk</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${r.desc}</p>
        
        <div style="margin-top: 0.75rem; background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--border-radius-sm); font-size: 0.8rem; color: var(--text-secondary);">
          <span style="font-weight: 700; color: var(--accent-primary);">Emergency Mitigation Plan:</span> ${r.mitigation}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header);">Placement Risk Detector</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">Scan profile indices to diagnose academic and skillset barriers.</p>
          </div>

          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.5rem 1rem; border-radius: var(--border-radius-md); box-shadow: var(--glass-shadow); display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="shield-alert" style="color: ${riskLevelColor};"></i>
            <span style="font-size:0.85rem; font-weight:700;">Overall Risk: <b style="color: ${riskLevelColor};">${riskLevel}</b></span>
          </div>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Active Risks List -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${risksHtml}
          </div>

          <!-- Diagnostic tips -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="premium-card" style="background: rgba(var(--accent-danger-rgb), 0.05);">
              <h3 style="font-family: var(--font-header); color: var(--accent-danger); font-size: 1.05rem; margin-bottom: 0.5rem;">What are Auto-Filters?</h3>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
                Enterprise recruiters configure applicant systems to auto-reject resumes failing minimum GPA thresholds (commonly 7.5 or 8.0) or lacking target skills.
              </p>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
                Resolve logged alerts below to ensure your profile stays above filtering thresholds.
              </p>
            </div>

            <div class="premium-card">
              <h3 style="font-family: var(--font-header); font-size: 1rem; margin-bottom: 0.75rem;">Action Resolution Checklist</h3>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                ${[
                  'Verify target skills map in Resume Analyzer',
                  'Perform 1 timed speedrun test to check coding logs',
                  'Simulate mock interviews to review speech filled count',
                  'Check off daily challenges to maintain streaks'
                ].map((task, idx) => `
                  <label style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.8rem; cursor:pointer;">
                    <input type="checkbox" onchange="window.resolveRiskCheck(${idx}, this)" style="accent-color: var(--accent-success);" />
                    <span>${task}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
  };

  window.resolveRiskCheck = function(index, checkbox) {
    if (checkbox.checked) {
      window.appState.addNotification('Mitigation Action Checked', 'Completed profile optimization task! +5 placement points.');
      if (window.confetti) window.confetti({ particleCount: 30 });
    }
  };
})();
