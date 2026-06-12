// Premium Success Predictor View with Interactive Radar Chart
(function() {
  window.renderPredictorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const result = state.predictorResult;

    // Skills checklist
    const commonSkills = [
      'HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python',
      'SQL/NoSQL', 'System Design', 'Git', 'Docker', 'Machine Learning'
    ];

    const targetCompanyList = window.mockData.companies;

    // Draw Radar Chart helper
    function getRadarChartSvg(metrics) {
      if (!metrics) return '';

      const size = 260;
      const center = size / 2;
      const rMax = 80;

      // 6 Dimensions: DSA, System Design, Communication, Aptitude, Projects, Academics
      const axes = [
        { label: 'DSA', val: metrics.dsa },
        { label: 'Sys Design', val: metrics.sysDesign },
        { label: 'Comm', val: metrics.comm },
        { label: 'Aptitude', val: metrics.apt },
        { label: 'Projects', val: metrics.projects },
        { label: 'Academics', val: metrics.academics }
      ];

      // Calculate coordinates for a given radius and angle index
      function getCoordinates(index, valRadius) {
        const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2;
        const x = center + valRadius * Math.cos(angle);
        const y = center + valRadius * Math.sin(angle);
        return { x, y };
      }

      // Draw concentric rings (Hexagons)
      let ringsHtml = '';
      const ringSteps = [0.2, 0.4, 0.6, 0.8, 1.0];
      ringSteps.forEach(step => {
        const radius = rMax * step;
        const points = [];
        for (let i = 0; i < 6; i++) {
          const coord = getCoordinates(i, radius);
          points.push(`${coord.x},${coord.y}`);
        }
        ringsHtml += `<polygon points="${points.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width="1" />`;
      });

      // Draw Axis Lines and Labels
      let axisLinesHtml = '';
      let labelsHtml = '';
      axes.forEach((axis, i) => {
        const outerCoord = getCoordinates(i, rMax);
        const labelCoord = getCoordinates(i, rMax + 20);
        
        // Axis line
        axisLinesHtml += `<line x1="${center}" y1="${center}" x2="${outerCoord.x}" y2="${outerCoord.y}" stroke="var(--border-color)" stroke-width="1.5" />`;
        
        // Text align adjustment
        let textAnchor = 'middle';
        if (labelCoord.x > center + 10) textAnchor = 'start';
        else if (labelCoord.x < center - 10) textAnchor = 'end';

        labelsHtml += `
          <text x="${labelCoord.x}" y="${labelCoord.y + 4}" text-anchor="${textAnchor}" fill="var(--text-secondary)" font-size="9.5" font-weight="600" font-family="var(--font-header)">
            ${axis.label}
          </text>
        `;
      });

      // Draw User Data Polygon
      const dataPoints = [];
      axes.forEach((axis, i) => {
        const valFraction = axis.val / 100;
        const radius = rMax * valFraction;
        const coord = getCoordinates(i, radius);
        dataPoints.push(`${coord.x},${coord.y}`);
      });

      const polygonPoints = dataPoints.join(' ');
      const userPolygonHtml = `
        <polygon points="${polygonPoints}" fill="rgba(var(--accent-primary-rgb), 0.25)" stroke="var(--accent-primary)" stroke-width="2.5" />
        ${axes.map((axis, i) => {
          const valFraction = axis.val / 100;
          const radius = rMax * valFraction;
          const coord = getCoordinates(i, radius);
          return `<circle cx="${coord.x}" cy="${coord.y}" r="4" fill="var(--accent-primary)" stroke="white" stroke-width="1.5" />`;
        }).join('')}
      `;

      return `
        <svg width="100%" height="260" viewBox="0 0 ${size} ${size}" style="display: block; margin: 0 auto; overflow: visible;">
          ${ringsHtml}
          ${axisLinesHtml}
          ${userPolygonHtml}
          ${labelsHtml}
        </svg>
      `;
    }

    let reportHtml = '';
    if (result) {
      const isHigh = result.probability >= 70;
      const circumference = 2 * Math.PI * 38;
      const offset = circumference - (result.probability / 100) * circumference;

      reportHtml = `
        <div style="animation: scaleUp 0.3s ease; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
          
          <!-- Quick metrics row -->
          <div class="grid-container grid-3-col">
            <!-- Probability -->
            <div class="premium-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; align-self: flex-start; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">
                <i data-lucide="percent" style="color: var(--accent-primary); width:16px;"></i> Placement Probability
              </h4>
              <div style="position: relative; width: 130px; height: 130px; margin-top: 0.5rem;">
                <svg width="130" height="130" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                  <circle cx="50" cy="50" r="38" stroke="var(--bg-tertiary)" stroke-width="6" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="var(--accent-primary)" stroke-width="6" fill="transparent" 
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition: stroke-dashoffset 0.8s ease;" />
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                  <div style="font-size: 1.75rem; font-weight:800; font-family:var(--font-header);">${result.probability}%</div>
                  <div style="font-size: 0.55rem; color: var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Chance</div>
                </div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.75rem;">
                Predicted offer status for: <b>${result.company}</b>
              </p>
            </div>

            <!-- Radar chart -->
            <div class="premium-card" style="grid-column: span 2; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; align-self: flex-start; display: flex; align-items: center; gap: 0.25rem;">
                <i data-lucide="compass" style="color: var(--accent-primary); width:16px;"></i> Readiness Radar Chart
              </h4>
              <div style="width: 100%; max-width: 300px; height: 200px; display: flex; align-items: center; justify-content: center; margin-top:-10px;">
                ${getRadarChartSvg(result.radarMetrics)}
              </div>
            </div>
          </div>

          <!-- Diagnostic output lists -->
          <div class="grid-container grid-2-col">
            <!-- Strengths and suggestions -->
            <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <h4 style="font-family: var(--font-header); color: var(--accent-success); display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
                  <i data-lucide="shield-check" style="width:16px;"></i> Core Strengths
                </h4>
                <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${result.strengths.map(s => `
                    <li style="display: flex; gap: 0.4rem; align-items: flex-start;">
                      <i data-lucide="check" style="color: var(--accent-success); width:14px; flex-shrink:0; margin-top:2px;"></i>
                      <span>${s}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <h4 style="font-family: var(--font-header); color: var(--accent-primary); display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
                  <i data-lucide="arrow-up-circle" style="width:16px;"></i> Recommended Actions
                </h4>
                <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${result.suggestions.map(s => `
                    <li style="display: flex; gap: 0.4rem; align-items: flex-start;">
                      <i data-lucide="chevron-right" style="color: var(--accent-primary); width:14px; flex-shrink:0; margin-top:2px;"></i>
                      <span>${s}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- Weaknesses and risk warnings -->
            <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid var(--accent-danger);">
              <div>
                <h4 style="font-family: var(--font-header); color: var(--accent-warning); display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
                  <i data-lucide="alert-triangle" style="width:16px; color: var(--accent-warning)"></i> Identified Gaps
                </h4>
                <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${result.weaknesses.map(w => `
                    <li style="display: flex; gap: 0.4rem; align-items: flex-start;">
                      <i data-lucide="minus" style="color: var(--accent-warning); width:14px; flex-shrink:0; margin-top:3px;"></i>
                      <span>${w}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <h4 style="font-family: var(--font-header); color: var(--accent-danger); display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
                  <i data-lucide="shield-alert" style="width:16px;"></i> Academic Filter Risks
                </h4>
                <ul style="list-style: none; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${result.risks.map(r => `
                    <li style="display: flex; gap: 0.4rem; align-items: flex-start;">
                      <i data-lucide="x" style="color: var(--accent-danger); width:14px; flex-shrink:0; margin-top:2px;"></i>
                      <span>${r}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Placement Success Predictor</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Enter candidate profile telemetry parameters to compile probability ranges and spider charts.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Parameter Form Card -->
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="sliders" style="color: var(--accent-primary)"></i> Profile Parameters
            </h3>

            <form id="calc-predictor-form" style="display: flex; flex-direction: column; gap: 1rem;">
              
              <div class="grid-container grid-2-col" style="gap: 1rem;">
                <div class="form-group">
                  <label for="p-cgpa">Academic CGPA (0.0 - 10.0)</label>
                  <input type="number" step="0.1" min="5" max="10" id="p-cgpa" class="input-field" value="${state.userProfile.cgpa}" required />
                </div>
                <div class="form-group">
                  <label for="p-comm">Communication Rating (1-5)</label>
                  <select id="p-comm" class="select-field">
                    <option value="5">5/5 - Fluent (STAR standard)</option>
                    <option value="4" selected>4/5 - Conversational / Fluent</option>
                    <option value="3">3/5 - Minor hesitation</option>
                    <option value="2">2/5 - High filler word rate</option>
                    <option value="1">1/5 - Significant practice needed</option>
                  </select>
                </div>
              </div>

              <div class="grid-container grid-2-col" style="gap: 1rem;">
                <div class="form-group">
                  <label for="p-apt">Aptitude Score (0 - 100%)</label>
                  <input type="number" min="0" max="100" id="p-apt" class="input-field" value="70" required />
                </div>
                <div class="form-group">
                  <label for="p-coding">Coding DSA Accuracy (0 - 100%)</label>
                  <input type="number" min="0" max="100" id="p-coding" class="input-field" value="65" required />
                </div>
              </div>

              <div class="grid-container grid-2-col" style="gap: 1rem;">
                <div class="form-group">
                  <label for="p-proj">Production Projects</label>
                  <input type="number" min="0" max="5" id="p-proj" class="input-field" value="2" required />
                </div>
                <div class="form-group">
                  <label for="p-intern">Completed Internships</label>
                  <input type="number" min="0" max="5" id="p-intern" class="input-field" value="0" required />
                </div>
              </div>

              <div class="form-group">
                <label for="p-company">Dream Placement Target</label>
                <select id="p-company" class="select-field">
                  ${targetCompanyList.map(c => `
                    <option value="${c.id}" ${state.userProfile.targetCompany === c.name ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Target Skill Portfolio</label>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; background: var(--bg-primary); padding: 0.75rem; border-radius: var(--border-radius-sm); border:1px solid var(--border-color);">
                  ${commonSkills.map(skill => `
                    <label style="display:flex; gap:0.4rem; align-items:center; font-size:0.8rem; cursor:pointer;">
                      <input type="checkbox" value="${skill}" class="p-skill-checkbox" ${state.userProfile.skills.includes(skill) ? 'checked' : ''} style="accent-color: var(--accent-primary);" />
                      <span>${skill}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                <i data-lucide="cpu"></i> Generate Predictive Report
              </button>
            </form>
          </div>

          <!-- Model Info -->
          <div class="premium-card" style="height: fit-content; background: rgba(var(--accent-primary-rgb), 0.05);">
            <h3 style="font-family: var(--font-header); color: var(--accent-primary); margin-bottom: 0.5rem; font-size: 1.1rem;">Predictor Class Variables</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
              This predictive engine runs a heuristic random forest classifier calculating profile readiness parameters across 6 axes.
            </p>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); margin-top: 0.5rem;">
              Ensure you upload an optimized resume and practice coding duels in <b>Battle Mode</b> to bolster your radar scores.
            </p>
          </div>
        </div>

        <div id="predictor-report-slot">
          ${reportHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindPredictorEvents();
  };

  function bindPredictorEvents() {
    const form = document.getElementById('calc-predictor-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cgpa = parseFloat(document.getElementById('p-cgpa').value);
      const comm = parseInt(document.getElementById('p-comm').value);
      const apt = parseInt(document.getElementById('p-apt').value);
      const coding = parseInt(document.getElementById('p-coding').value);
      const proj = parseInt(document.getElementById('p-proj').value);
      const intern = parseInt(document.getElementById('p-intern').value);
      const targetCompany = document.getElementById('p-company').value;

      // Collect checked skills
      const checkedBoxes = document.querySelectorAll('.p-skill-checkbox:checked');
      const selectedSkills = Array.from(checkedBoxes).map(cb => cb.value);

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Compiling telemetry...';
      window.lucide.createIcons();

      setTimeout(() => {
        window.appState.runEnhancedPredictor(cgpa, apt, coding, comm, proj, intern, selectedSkills, targetCompany);
        window.renderPredictorView();
      }, 1200);
    });
  }
})();
