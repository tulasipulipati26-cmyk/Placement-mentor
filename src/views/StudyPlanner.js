// Premium AI Study Planner Component View
(function() {
  let intensity = 'focused'; // 'casual', 'focused', 'bootcamp'
  let focusTopic = 'DSA'; // 'DSA', 'WebDev', 'DataSci', 'Aptitude'
  let scheduleTasks = [
    { day: 'Monday', task: 'Revise Hash Table collisions & Linear Probing', type: 'DSA', checked: false },
    { day: 'Tuesday', task: 'Complete 1 Aptitude logical reasoning test', type: 'Aptitude', checked: false },
    { day: 'Wednesday', task: 'Design rate limiter API mock schematic', type: 'SysDesign', checked: false },
    { day: 'Thursday', task: 'Optimize Resume bullet metrics in Scanner', type: 'Resume', checked: false },
    { day: 'Friday', task: 'Perform 1 technical mock interview mock run', type: 'Interview', checked: false },
    { day: 'Saturday', task: 'Build standard portfolio dashboard page', type: 'WebDev', checked: false },
    { day: 'Sunday', task: 'Reflect on weakness tracker and log review', type: 'Review', checked: false }
  ];

  window.renderPlannerView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    const taskItemsHtml = scheduleTasks.map((item, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border-radius: var(--border-radius-sm); background: var(--bg-primary); border: 1px solid ${item.checked ? 'var(--border-color)' : 'rgba(var(--accent-primary-rgb), 0.15)'}; margin-bottom: 0.5rem; transition: all 0.3s;">
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-grow: 1;">
          <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="window.togglePlannerTask(${idx})" style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;" />
          <div style="margin-left: 0.25rem;">
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; display: block; margin-bottom: 0.1rem;">${item.day}</span>
            <span style="font-size: 0.85rem; font-weight: 500; color: ${item.checked ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${item.checked ? 'line-through' : 'none'};">${item.task}</span>
          </div>
        </div>
        <span class="badge badge-info" style="font-size: 0.65rem;">${item.type}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Study & Placement Planner</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Structure a customized preparation schedule based on your dream company timeline.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Left: Task Schedule List -->
          <div class="premium-card">
            <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="check-square" style="color: var(--accent-primary)"></i> Weekly Preparation Log
            </h3>
            
            <div id="planner-tasks-list">
              ${taskItemsHtml}
            </div>

            <div style="display: flex; gap: 0.5rem; align-items:center; margin-top: 1rem; background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-sm); font-size: 0.75rem; border: 1px solid var(--border-color); color: var(--text-secondary);">
              <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0; color: var(--accent-primary);"></i>
              <span>Checking tasks off increments your streak count and updates your readiness meter score.</span>
            </div>
          </div>

          <!-- Right: Setup Scheduler Params -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Parameters Card -->
            <div class="premium-card">
              <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Customize Schedule</h3>
              
              <form id="planner-setup-form" style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div class="form-group">
                  <label for="plan-intensity">Daily Prep Intensity</label>
                  <select id="plan-intensity" class="select-field" onchange="window.setPlannerIntensity(this.value)">
                    <option value="casual" ${intensity === 'casual' ? 'selected' : ''}>Casual (1 Hour/day)</option>
                    <option value="focused" ${intensity === 'focused' ? 'selected' : ''}>Focused (3 Hours/day)</option>
                    <option value="bootcamp" ${intensity === 'bootcamp' ? 'selected' : ''}>Boot Camp (5+ Hours/day)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="plan-topic">Target Focus Track</label>
                  <select id="plan-topic" class="select-field" onchange="window.setPlannerTopic(this.value)">
                    <option value="DSA" ${focusTopic === 'DSA' ? 'selected' : ''}>Data Structures & Algorithms</option>
                    <option value="WebDev" ${focusTopic === 'WebDev' ? 'selected' : ''}>Web Development (React/APIs)</option>
                    <option value="DataSci" ${focusTopic === 'DataSci' ? 'selected' : ''}>Data Science (ML/Python)</option>
                    <option value="Aptitude" ${focusTopic === 'Aptitude' ? 'selected' : ''}>Aptitude & Speedruns</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem 1rem;">
                  <i data-lucide="cpu"></i> Generate Plan
                </button>
              </form>
            </div>

            <!-- Calendar representation preview -->
            <div class="premium-card">
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; margin-bottom: 0.5rem;">Study Timeline Blocks</h4>
              <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem;">
                ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => `
                  <div style="aspect-ratio: 1; border-radius: 4px; display:flex; align-items:center; justify-content:center; background: ${scheduleTasks[idx].checked ? 'var(--accent-success)' : 'var(--bg-tertiary)'}; font-size: 0.7rem; font-weight:700; color: ${scheduleTasks[idx].checked ? 'white' : 'var(--text-muted)'}; border: 1px solid var(--border-color);">
                    ${day}
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindPlannerEvents();
  };

  window.setPlannerIntensity = function(val) {
    intensity = val;
  };

  window.setPlannerTopic = function(val) {
    focusTopic = val;
  };

  window.togglePlannerTask = function(index) {
    scheduleTasks[index].checked = !scheduleTasks[index].checked;
    
    // Add streak points if checked
    if (scheduleTasks[index].checked) {
      const state = window.appState.get();
      state.userProfile.streak += 1;
      
      // dark green random heatmap dot
      const emptyDot = state.studyHeatmap.find(c => c.level === 0);
      if (emptyDot) emptyDot.level = 1;

      window.appState.addNotification('Milestone Task Done', `Successfully completed target checklist: +1 streak day.`);
      
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 40 });
      }
    }

    window.renderPlannerView();
  };

  function bindPlannerEvents() {
    const form = document.getElementById('planner-setup-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Organizing Blocks...';
        window.lucide.createIcons();

        setTimeout(() => {
          // Regenerate schedule tasks based on selection
          const state = window.appState.get();
          if (focusTopic === 'DSA') {
            scheduleTasks = [
              { day: 'Monday', task: 'Master Binary Search Bounds & Range searches', type: 'DSA', checked: false },
              { day: 'Tuesday', task: 'Revise recursion memoization patterns', type: 'DSA', checked: false },
              { day: 'Wednesday', task: 'Solve 2 Matrix traversing problems on Leetcode', type: 'DSA', checked: false },
              { day: 'Thursday', task: 'Revise binary tree depth path algorithms', type: 'DSA', checked: false },
              { day: 'Friday', task: 'Practice stack mock questions in bank', type: 'DSA', checked: false },
              { day: 'Saturday', task: 'Solve timed coding tests core speedrun', type: 'Coding', checked: false },
              { day: 'Sunday', task: 'Log custom weaknesses in tracking database', type: 'Review', checked: false }
            ];
          } else if (focusTopic === 'WebDev') {
            scheduleTasks = [
              { day: 'Monday', task: 'Implement custom state Pub/Sub architecture', type: 'React', checked: false },
              { day: 'Tuesday', task: 'Complete CSS glassmorphism alignment cards', type: 'CSS', checked: false },
              { day: 'Wednesday', task: 'Audit target API CORS request structures', type: 'APIs', checked: false },
              { day: 'Thursday', task: 'Draft mock cover letters with prompt selector', type: 'Resume', checked: false },
              { day: 'Friday', task: 'Solve JS Closure scope question files', type: 'JS', checked: false },
              { day: 'Saturday', task: 'Build final mockup dashboard view script', type: 'WebDev', checked: false },
              { day: 'Sunday', task: 'Audit target role checklist statistics', type: 'Review', checked: false }
            ];
          } else if (focusTopic === 'DataSci') {
            scheduleTasks = [
              { day: 'Monday', task: 'Revise Linear Regression matrix formulas', type: 'Math', checked: false },
              { day: 'Tuesday', task: 'Implement pandas column aggregation scripts', type: 'Python', checked: false },
              { day: 'Wednesday', task: 'Build scikit-learn recommendation matrix model', type: 'ML', checked: false },
              { day: 'Thursday', task: 'Draft Data Science resume keyword templates', type: 'Resume', checked: false },
              { day: 'Friday', task: 'Explain SQL inner left right differences', type: 'SQL', checked: false },
              { day: 'Saturday', task: 'Complete Data Science core speedrun test', type: 'Tests', checked: false },
              { day: 'Sunday', task: 'Review mock question answers and keywords', type: 'Review', checked: false }
            ];
          } else { // Aptitude
            scheduleTasks = [
              { day: 'Monday', task: 'Revise train relative speed calculations', type: 'Aptitude', checked: false },
              { day: 'Tuesday', task: 'Solve blood relation diagram maps', type: 'Reasoning', checked: false },
              { day: 'Wednesday', task: 'Attempt quantitative assessment test 1', type: 'Tests', checked: false },
              { day: 'Thursday', task: 'Review speedrun incorrect test history logs', type: 'Aptitude', checked: false },
              { day: 'Friday', task: 'Solve missing number sequence problems', type: 'Reasoning', checked: false },
              { day: 'Saturday', task: 'Solve timed coding tests core speedrun', type: 'Tests', checked: false },
              { day: 'Sunday', task: 'Verify overall placement readiness score', type: 'Review', checked: false }
            ];
          }

          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i data-lucide="cpu"></i> Generate Plan';
          
          window.appState.addNotification('Planner Updated', `Generated customized study schedule focused on ${focusTopic}`);
          window.renderPlannerView();
        }, 1200);
      });
    }
  }
})();
