// Premium Placement Success Predictor View
(function() {
  window.renderPredictionView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Generate skills selection checklist
    const allCommonSkills = [
      'HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python',
      'SQL/NoSQL', 'System Design', 'Git', 'Docker', 'Machine Learning'
    ];

    const skillsCheckboxes = allCommonSkills.map(skill => {
      const hasSkill = state.userProfile.skills.includes(skill);
      return `
        <label style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.85rem; cursor: pointer;">
          <input type="checkbox" value="${skill}" class="pred-skill-check" ${hasSkill ? 'checked' : ''} style="accent-color: var(--accent-primary);" />
          <span>${skill}</span>
        </label>
      `;
    }).join('');

    const latestPrediction = state.predictions[0]; // most recent
    
    let predictionResultHtml = '';
    if (latestPrediction) {
      const isHigh = latestPrediction.probability >= 75;
      const progressCircle = 2 * Math.PI * 38;
      const progressOffset = progressCircle - (latestPrediction.probability / 100) * progressCircle;

      predictionResultHtml = `
        <div class="premium-card" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-header);">Placement Telemetry Result</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;">Generated on ${latestPrediction.date}</p>
            </div>
            <span class="badge ${isHigh ? 'badge-success' : 'badge-warning'}" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
              Class Chance: ${isHigh ? 'High Probability' : 'Moderate Probability'}
            </span>
          </div>

          <div class="grid-container grid-2-col" style="align-items: center;">
            <!-- Circle Gauge -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <div style="position: relative; width: 140px; height: 140px;">
                <svg width="140" height="140" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                  <circle cx="50" cy="50" r="38" stroke="var(--bg-tertiary)" stroke-width="6" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="var(--accent-primary)" stroke-width="6" fill="transparent" 
                    stroke-dasharray="${progressCircle}" stroke-dashoffset="${progressOffset}" stroke-linecap="round" style="transition: stroke-dashoffset 0.8s ease;" />
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                  <span style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-header);">${latestPrediction.probability}%</span>
                  <div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Probability</div>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="sparkles" style="color: var(--accent-primary)"></i> Strategic Recommendations
              </h4>
              <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
                ${latestPrediction.recommendations.map(rec => `
                  <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <i data-lucide="arrow-right-circle" style="color: var(--accent-primary); width:14px; height:14px; flex-shrink:0; margin-top:2px;"></i>
                    <span>${rec}</span>
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
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Placement Success Predictor</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Predict your placement possibility based on profile, skill diversity, and performance scores.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Inputs Card -->
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="settings" style="color: var(--accent-primary)"></i> Profile Configuration Parameters
            </h3>

            <form id="prediction-calc-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label for="pred-cgpa">Academic CGPA Score: <span id="pred-cgpa-val" style="color: var(--accent-primary); font-weight:700;">${state.userProfile.cgpa}</span></label>
                <input type="range" id="pred-cgpa" min="5" max="10" step="0.1" value="${state.userProfile.cgpa}" class="slider" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>

              <div class="form-group">
                <label>Select Your Mastered Skills</label>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.25rem; background: var(--bg-primary); padding: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                  ${skillsCheckboxes}
                </div>
              </div>

              <div class="form-group">
                <label for="pred-apt">Simulated Aptitude Test Score (%): <span id="pred-apt-val" style="color: var(--accent-primary); font-weight:700;">70%</span></label>
                <input type="range" id="pred-apt" min="20" max="100" step="5" value="70" class="slider" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>

              <div class="form-group">
                <label for="pred-comm">Interview Articulation & Communication (1-5 Rating)</label>
                <select id="pred-comm" class="select-field">
                  <option value="5">5/5 - Fluent & Structurally Coherent (STAR format)</option>
                  <option value="4" selected>4/5 - Professional & Competent</option>
                  <option value="3">3/5 - Conversational but lacks specific terms</option>
                  <option value="2">2/5 - Hesitant or high filler word frequency</option>
                  <option value="1">1/5 - Needs significant practice</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                <i data-lucide="trending-up"></i> Compute Placement Probability
              </button>
            </form>
          </div>

          <!-- Predictive Model Info -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="premium-card" style="background: rgba(var(--accent-primary-rgb), 0.05);">
              <h3 style="font-family: var(--font-header); font-size: 1rem; color: var(--accent-primary); margin-bottom: 0.5rem;">How is this computed?</h3>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
                Our simulated random forest classifier weighs indices such as:
              </p>
              <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <li>• <b>CGPA Metric</b>: Weighted at 40% (determines eligibility filters)</li>
                <li>• <b>Skill Diversity</b>: Weighted at 20% (domain matches)</li>
                <li>• <b>Aptitude Speedrun</b>: Weighted at 25% (round 1 assessments)</li>
                <li>• <b>Interview Fluency</b>: Weighted at 15% (technical reviews)</li>
              </ul>
            </div>

            <!-- History Logs -->
            <div class="premium-card">
              <h3 style="font-family: var(--font-header); font-size: 0.95rem; margin-bottom: 0.75rem;">Historical Predictions</h3>
              <div style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                ${state.predictions.length <= 1 ? `
                  <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-size: 0.75rem;">No past telemetry items.</div>
                ` : state.predictions.slice(1).map(pred => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.35rem;">
                    <span>CGPA: ${pred.cgpa} • Apt: ${pred.aptitudeScore}%</span>
                    <span style="font-weight: 700; color: var(--accent-primary);">${pred.probability}% Chance</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div id="prediction-report-container">
          ${predictionResultHtml}
        </div>
      </div>
    `;

    // Rebuild icons
    window.lucide.createIcons();

    // Bind event listeners
    bindPredictionEvents();
  };

  function bindPredictionEvents() {
    const cgpaRange = document.getElementById('pred-cgpa');
    const cgpaVal = document.getElementById('pred-cgpa-val');
    if (cgpaRange && cgpaVal) {
      cgpaRange.addEventListener('input', (e) => {
        cgpaVal.innerText = parseFloat(e.target.value).toFixed(1);
      });
    }

    const aptRange = document.getElementById('pred-apt');
    const aptVal = document.getElementById('pred-apt-val');
    if (aptRange && aptVal) {
      aptRange.addEventListener('input', (e) => {
        aptVal.innerText = `${e.target.value}%`;
      });
    }

    const form = document.getElementById('prediction-calc-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cgpa = parseFloat(document.getElementById('pred-cgpa').value);
        const aptScore = parseInt(document.getElementById('pred-apt').value);
        const commRating = parseInt(document.getElementById('pred-comm').value);
        
        // Count checked checkboxes
        const checkedSkills = document.querySelectorAll('.pred-skill-check:checked');
        const skillsCount = checkedSkills.length;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Analyzing Profile Gaps...';
        window.lucide.createIcons();

        setTimeout(() => {
          window.appState.predictPlacementChance(cgpa, skillsCount, aptScore, commRating);
          window.renderPredictionView();
        }, 1200);
      });
    }
  }
})();
