// Premium Skill Gap, Project Recommendations & Roadmap View
(function() {
  window.renderSkillGapView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Fetch target role definition
    const targetRole = window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole) 
      || window.mockData.targetRoles[0]; // fallback

    const matched = [];
    const missing = [];

    targetRole.skills.forEach(skill => {
      if (state.userProfile.skills.includes(skill)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchPercentage = Math.round((matched.length / targetRole.skills.length) * 100);

    // Filter project recommendations based on missing skills
    const relevantProjects = window.mockData.projectRecommendations.filter(proj => {
      // Recommend projects that add at least one missing skill, or fall back to matching role
      return proj.role === state.userProfile.targetRole;
    });

    // Generate Weekly Timeline Roadmap items
    const roadmapSteps = [
      { week: 'Week 1', title: 'Fill Core Technical Gaps', desc: `Master missing target topics: ${missing.length > 0 ? missing.slice(0, 2).join(', ') : 'Advanced Concepts'}.`, done: false },
      { week: 'Week 2', title: 'Complete Domain Project', desc: `Build a portfolio project to demonstrate practical ${matched.join(', ')} skills.`, done: false },
      { week: 'Week 3', title: 'Aptitude & Coding Speedruns', desc: 'Attempt at least 3 timed tests on logical reasoning and programming syntax.', done: false },
      { week: 'Week 4', title: 'Mock Interviews & Company Focus', desc: `Select target company profiles and simulate final mock interviews.`, done: false }
    ];

    // Weakness logs
    const weaknessesList = Object.entries(state.weaknessTracker).map(([topic, count]) => `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
        <span style="font-weight: 500;">${topic}</span>
        <span class="badge ${count > 0 ? 'badge-danger' : 'badge-success'}">${count} Failures Logged</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Skill Gap & Personalized Roadmap</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Compare your profile capabilities against the target role requirements and unlock custom project ideas.</p>
        </div>

        <div class="grid-container grid-2-col">
          
          <!-- Box 1: Skill Gap comparison -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-family: var(--font-header); display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="shield-alert" style="color: var(--accent-primary)"></i> Target Role Gap: ${targetRole.name}
            </h3>
            
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="background: rgba(var(--accent-primary-rgb), 0.1); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: var(--border-radius-sm);">
                <div style="font-size: 1.5rem; font-weight:800; color: var(--accent-primary);">${matchPercentage}%</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform:uppercase;">Skill Match</div>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                You possess <b>${matched.length} of ${targetRole.skills.length}</b> required skills for this profile. Focus on filling the red gaps.
              </p>
            </div>

            <div style="margin-top: 0.5rem;">
              <h4 style="font-size: 0.85rem; font-family: var(--font-header); margin-bottom: 0.5rem; color: var(--accent-success);">Possessed Skills</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem;">
                ${matched.length === 0 ? '<span style="font-size:0.8rem; color:var(--text-muted)">None verified yet.</span>' : matched.map(s => `
                  <span class="badge badge-success" style="gap: 0.25rem;"><i data-lucide="check" style="width: 12px; height: 12px;"></i> ${s}</span>
                `).join('')}
              </div>

              <h4 style="font-size: 0.85rem; font-family: var(--font-header); margin-bottom: 0.5rem; color: var(--accent-danger);">Missing Technical Gaps</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${missing.length === 0 ? '<span class="badge badge-success" style="gap: 0.25rem;"><i data-lucide="party-popper" style="width: 12px; height: 12px;"></i> Zero Skill Gaps!</span>' : missing.map(s => `
                  <span class="badge badge-danger" style="gap: 0.25rem;"><i data-lucide="x" style="width: 12px; height: 12px;"></i> ${s}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Box 2: Weakness tracker -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="font-family: var(--font-header); display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="search-code" style="color: var(--accent-danger)"></i> Interview Weakness Tracker
            </h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
              This diagnostic tracker logs performance topics from mock tests and interview answers. Keep your failures at zero.
            </p>
            <div>
              ${weaknessesList}
            </div>
          </div>

        </div>

        <div class="grid-container grid-main-side" style="margin-top: 1.5rem;">
          
          <!-- Roadmap timeline -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-family: var(--font-header); display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="map" style="color: var(--accent-primary)"></i> Personalized 4-Week Roadmap
            </h3>

            <!-- Roadmap timeline container -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem; position: relative; padding-left: 1rem; margin-top: 0.5rem;">
              <div style="position: absolute; left: 4px; top: 0; bottom: 0; width: 2px; background: var(--border-color);"></div>

              ${roadmapSteps.map((step, idx) => `
                <div style="display: flex; gap: 1.5rem; position: relative;">
                  <!-- Bullet node -->
                  <div style="position: absolute; left: -19px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg-secondary); border: 2px solid var(--accent-primary); z-index: 2;"></div>
                  
                  <div style="flex-grow: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">${step.week}</span>
                    </div>
                    <h4 style="font-size: 0.95rem; font-family: var(--font-header); margin-top: 0.15rem;">${step.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.4;">${step.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Project recommendations -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="font-family: var(--font-header); display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="folder-git" style="color: var(--accent-primary)"></i> AI Project Recommendations
            </h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              Complete these targeted projects to add critical missing keywords directly to your resume.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; overflow-y: auto; max-height: 300px;">
              ${relevantProjects.map(proj => `
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--border-radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 0.85rem;">${proj.title}</span>
                    <span class="badge badge-info" style="font-size: 0.65rem;">${proj.diff}</span>
                  </div>
                  <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem; line-height:1.4;">${proj.desc}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem; font-size: 0.7rem; color: var(--text-muted);">
                    <span>Timeline: ${proj.time}</span>
                    <span style="color: var(--accent-success); font-weight: 600;">+ ${proj.skillsAdded.join(', ')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    window.lucide.createIcons();
  };
})();
