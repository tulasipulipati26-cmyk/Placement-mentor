// Premium AI Salary Predictor View with SVG Distribution Curve
(function() {
  let selectedRole = 'frontend';
  let companyTier = 'tier-1'; // 'tier-1', 'tier-2', 'tier-3'
  let region = 'US'; // 'US', 'IN', 'Remote'
  let resultSalary = null;

  window.renderSalaryPredictorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Generate bell curve SVG
    function getSalaryDistributionSvg(predictedVal) {
      const width = 300;
      const height = 120;
      
      // Draw bell curve path using bezier control coordinates
      // Peak of curve is at x=150, y=20
      const curvePath = "M 20 110 Q 80 110 110 70 T 150 20 T 190 70 T 280 110";
      
      // Calculate marker x position (fractional placement based on salary tier)
      let markerX = 150;
      if (companyTier === 'tier-1') markerX = 210; // high end
      else if (companyTier === 'tier-3') markerX = 90; // lower end
      
      return `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible; display:block; margin:0 auto;">
          <!-- Grid base -->
          <line x1="10" y1="110" x2="290" y2="110" stroke="var(--border-color)" stroke-width="2" />
          
          <!-- Bell curve -->
          <path d="${curvePath}" fill="rgba(var(--accent-primary-rgb), 0.1)" stroke="var(--accent-primary)" stroke-width="2.5" />
          
          <!-- Projected salary marker -->
          <line x1="${markerX}" y1="20" x2="${markerX}" y2="110" stroke="var(--accent-success)" stroke-width="2" stroke-dasharray="3,3" />
          <circle cx="${markerX}" cy="60" r="5" fill="var(--accent-success)" stroke="white" stroke-width="1.5" />
          
          <text x="${markerX}" y="15" text-anchor="middle" fill="var(--accent-success)" font-size="9" font-weight="700">Projected</text>
          <text x="50" y="125" text-anchor="middle" fill="var(--text-muted)" font-size="8">Min</text>
          <text x="150" y="125" text-anchor="middle" fill="var(--text-muted)" font-size="8">Median</text>
          <text x="250" y="125" text-anchor="middle" fill="var(--text-muted)" font-size="8">Max</text>
        </svg>
      `;
    }

    let resultHtml = '';
    if (resultSalary) {
      const regionSymbol = region === 'IN' ? '₹' : '$';
      const formattedSalary = resultSalary.total.toLocaleString();
      
      resultHtml = `
        <div class="premium-card" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; animation: scaleUp 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-header);">Salary Projection Analysis</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem;">Compensation evaluation index</p>
            </div>
            <span class="badge badge-success" style="font-size: 1rem; padding: 0.4rem 0.8rem;">
              Predicted CTC: ${regionSymbol}${formattedSalary} / year
            </span>
          </div>

          <div class="grid-container grid-2-col" style="align-items: center;">
            <!-- Bell curve -->
            <div style="text-align: center;">
              <h4 style="font-family: var(--font-header); font-size:0.85rem; color:var(--text-secondary); margin-bottom: 1rem;">Industry Compensation Range Mapping</h4>
              <div style="width: 100%; max-width: 320px; margin: 0 auto; height: 130px;">
                ${getSalaryDistributionSvg(resultSalary.total)}
              </div>
            </div>

            <!-- Pay Details -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <h4 style="font-family: var(--font-header); font-size: 0.95rem; color: var(--accent-primary);">Compensation Components Breakdown</h4>
              
              <div style="display:flex; justify-content:space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Base Salary Pay</span>
                <span style="font-weight: 700; color: var(--text-primary);">${regionSymbol}${resultSalary.base.toLocaleString()}</span>
              </div>

              <div style="display:flex; justify-content:space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Stock / Equity Units</span>
                <span style="font-weight: 700; color: var(--text-primary);">${regionSymbol}${resultSalary.stocks.toLocaleString()}</span>
              </div>

              <div style="display:flex; justify-content:space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Annual Performance Bonus</span>
                <span style="font-weight: 700; color: var(--text-primary);">${regionSymbol}${resultSalary.bonus.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Salary Predictor</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Estimate target packages based on skills, company tier filters, and GPA indices.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Input settings -->
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="circle-dollar-sign" style="color: var(--accent-primary)"></i> Parameters Configuration
            </h3>

            <form id="salary-calc-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label for="sal-role">Target Developer Role</label>
                <select id="sal-role" class="select-field">
                  ${window.mockData.targetRoles.map(r => `<option value="${r.id}" ${selectedRole === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="sal-tier">Company Target Tier</label>
                <select id="sal-tier" class="select-field">
                  <option value="tier-1" ${companyTier === 'tier-1' ? 'selected' : ''}>Tier 1 (FAANG / Fortune 100)</option>
                  <option value="tier-2" ${companyTier === 'tier-2' ? 'selected' : ''}>Tier 2 (Hyper-Growth Unicorns)</option>
                  <option value="tier-3" ${companyTier === 'tier-3' ? 'selected' : ''}>Tier 3 (Service / Consulting IT)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="sal-region">Target Placement Region</label>
                <select id="sal-region" class="select-field">
                  <option value="US" ${region === 'US' ? 'selected' : ''}>United States (USD)</option>
                  <option value="IN" ${region === 'IN' ? 'selected' : ''}>India (INR)</option>
                  <option value="Remote" ${region === 'Remote' ? 'selected' : ''}>Global Remote (USD)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%;">
                Compute Projected Salary CTC
              </button>
            </form>
          </div>

          <!-- Helper card -->
          <div class="premium-card" style="height: fit-content; background: rgba(var(--accent-primary-rgb), 0.05);">
            <h3 style="font-family: var(--font-header); color: var(--accent-primary); margin-bottom: 0.5rem; font-size: 1.05rem;">Compensation Ratios</h3>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
              Salary projections weigh geographic variables, domain matches (Data Science carries a 10% premium), and recruitment tier scales.
            </p>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
              Increase your overall profile score to land interview rounds at higher-paying Tier-1 firms.
            </p>
          </div>
        </div>

        <div id="salary-result-slot">
          ${resultHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindSalaryEvents();
  };

  function bindSalaryEvents() {
    const form = document.getElementById('salary-calc-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      selectedRole = document.getElementById('sal-role').value;
      companyTier = document.getElementById('sal-tier').value;
      region = document.getElementById('sal-region').value;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Fetching market rates...';
      window.lucide.createIcons();

      setTimeout(() => {
        // Compute salary
        const baseRanges = window.mockData.salaryRanges[selectedRole] || { baseMin: 50, baseMax: 120, multiplier: 10 };
        let basePay = baseRanges.baseMin + (parseFloat(window.appState.get().userProfile.cgpa) - 6.0) * baseRanges.multiplier;
        
        // Adjust for tier
        let multiplier = 1;
        if (companyTier === 'tier-1') multiplier = 1.6;
        else if (companyTier === 'tier-2') multiplier = 1.15;
        else multiplier = 0.5;

        // Adjust for region
        if (region === 'IN') {
          // Convert USD thousands base to Lakhs INR (e.g. $80k -> 80 * 2.5 = 20 Lakhs)
          basePay = basePay * 25000;
          basePay = Math.round(basePay * multiplier);
          
          const stocks = Math.round(basePay * 0.25);
          const bonus = Math.round(basePay * 0.12);
          resultSalary = {
            base: basePay,
            stocks,
            bonus,
            total: basePay + stocks + bonus
          };
        } else {
          basePay = basePay * 1000;
          basePay = Math.round(basePay * multiplier);
          const stocks = Math.round(basePay * 0.3);
          const bonus = Math.round(basePay * 0.15);
          resultSalary = {
            base: basePay,
            stocks,
            bonus,
            total: basePay + stocks + bonus
          };
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Compute Projected Salary CTC';
        window.renderSalaryPredictorView();
      }, 1000);
    });
  }
})();
