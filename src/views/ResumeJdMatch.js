// Premium Resume vs Job Description Match Analyzer View
(function() {
  window.renderResumeJdMatchView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const match = state.resumeJdMatch;

    let resultHtml = '';
    if (match) {
      const isGood = match.score >= 75;
      const circumference = 2 * Math.PI * 38;
      const offset = circumference - (match.score / 100) * circumference;

      resultHtml = `
        <div class="premium-card" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; animation: scaleUp 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-header);">Resume-to-JD Correlation Report</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem;">Algorithmic keyword optimization metrics</p>
            </div>
            <span class="badge ${isGood ? 'badge-success' : 'badge-warning'}" style="font-size: 0.95rem; padding: 0.4rem 0.8rem;">
              ATS Match: ${match.score}%
            </span>
          </div>

          <div class="grid-container grid-main-side" style="align-items: center;">
            <!-- Score Gauge -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="position: relative; width: 120px; height: 120px;">
                <svg width="120" height="120" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                  <circle cx="50" cy="50" r="38" stroke="var(--bg-tertiary)" stroke-width="6" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="var(--accent-primary)" stroke-width="6" fill="transparent" 
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" />
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                  <span style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-header);">${match.score}%</span>
                  <div style="font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase;">Match</div>
                </div>
              </div>
            </div>

            <!-- Bullet tips -->
            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--accent-primary);">AI Re-Writing Suggestions</h4>
              <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                ${match.suggestions.map(s => `
                  <li style="display: flex; gap: 0.4rem; align-items: flex-start;">
                    <i data-lucide="arrow-right-circle" style="color: var(--accent-primary); width:14px; flex-shrink:0; margin-top:2px;"></i>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Keywords grid -->
          <div class="grid-container grid-2-col" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.85rem; color: var(--accent-success); margin-bottom: 0.5rem;">Matched Keywords</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${match.foundKeywords.length === 0 ? '<span style="font-size:0.8rem; color:var(--text-muted);">None found</span>' : match.foundKeywords.map(k => `
                  <span class="badge badge-success" style="gap: 0.25rem;"><i data-lucide="check" style="width: 12px; height: 12px;"></i> ${k}</span>
                `).join('')}
              </div>
            </div>

            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.85rem; color: var(--accent-danger); margin-bottom: 0.5rem;">Missing Keywords</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${match.missingKeywords.length === 0 ? '<span class="badge badge-success">0 keywords missing!</span>' : match.missingKeywords.map(k => `
                  <span class="badge badge-danger" style="gap: 0.25rem;"><i data-lucide="x" style="width: 12px; height: 12px;"></i> ${k}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Resume vs Job Description Match</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Compare your resume text against a target JD to highlight missing skill keywords.</p>
        </div>

        <div class="grid-container grid-2-col">
          <!-- Resume Input -->
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="file-text" style="color: var(--accent-primary)"></i> Copy Paste Resume
            </h3>
            <textarea id="r-jd-resume-text" class="textarea-field" rows="12" placeholder="Paste your resume work history, summary, skills and accomplishments dump..."></textarea>
          </div>

          <!-- JD Input -->
          <div class="premium-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-family: var(--font-header); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="file-search" style="color: var(--accent-primary)"></i> Target Job Description
              </h3>
              <textarea id="r-jd-job-text" class="textarea-field" rows="8" placeholder="Paste the job advertisement, requirements, roles and responsibilities..."></textarea>
            </div>
            
            <button id="r-jd-analyze-btn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
              <i data-lucide="cpu"></i> Analyze Match Percentage
            </button>
          </div>
        </div>

        <div id="resume-jd-report-slot">
          ${resultHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindResumeJdEvents();
  };

  function bindResumeJdEvents() {
    const btn = document.getElementById('r-jd-analyze-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const resume = document.getElementById('r-jd-resume-text').value;
      const jd = document.getElementById('r-jd-job-text').value;

      if (!resume || !jd) {
        window.appState.addNotification('Input Required', 'Please paste both your resume content and the job description.');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Parsing keywords...';
      window.lucide.createIcons();

      setTimeout(() => {
        window.appState.analyzeResumeVsJd(resume, jd);
        window.renderResumeJdMatchView();
      }, 1500);
    });
  }
})();
