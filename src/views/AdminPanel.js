// Premium Admin Panel & System Telemetry View
(function() {
  window.renderAdminView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Roster rows
    const studentRowsHtml = state.admin.students.map((student, idx) => `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.8rem; height: 40px; text-align: left;">
        <td style="padding-left: 0.5rem; font-weight: 600;">${student.name}</td>
        <td>${student.cgpa}</td>
        <td>${student.target}</td>
        <td>
          <span style="font-weight:700; color:var(--accent-primary);">${student.score}%</span>
        </td>
        <td>
          <span class="badge ${student.status.includes('Placed') ? 'badge-success' : 'badge-warning'}">${student.status}</span>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="window.deleteStudentRow(${idx})" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">
            <i data-lucide="trash-2" style="width: 12px; height: 12px; color: var(--accent-danger)"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');

    // System Telemetry Metrics
    const totalStudents = state.admin.students.length + 102; // simulated baseline + current roster
    const averageReadiness = 64.5;
    const placementRate = 72;

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div>
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Placement Admin Dashboard</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Monitor overall batch statistics, manage mock tests, and view cohort telemetry.</p>
        </div>

        <!-- System Stats Grid -->
        <div class="grid-container grid-3-col">
          <div class="premium-card">
            <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Cohort Size</span>
            <div style="font-size: 2rem; font-weight:800; font-family:var(--font-header); margin-top: 0.25rem;">${totalStudents} Students</div>
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Active candidates registered in portal</p>
          </div>

          <div class="premium-card">
            <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Batch Avg Readiness</span>
            <div style="font-size: 2rem; font-weight:800; font-family:var(--font-header); margin-top: 0.25rem; color: var(--accent-primary);">${averageReadiness}%</div>
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Mean placement score across cohort</p>
          </div>

          <div class="premium-card">
            <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Placement Rate</span>
            <div style="font-size: 2rem; font-weight:800; font-family:var(--font-header); margin-top: 0.25rem; color: var(--accent-success);">${placementRate}%</div>
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Simulated offers accepted by students</p>
          </div>
        </div>

        <div class="grid-container grid-main-side">
          
          <!-- Roster -->
          <div class="premium-card" style="overflow-x: auto;">
            <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Candidate Roster</h3>
            
            <table style="width: 100%; border-collapse: collapse; min-width: 450px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); height: 35px; text-align: left;">
                  <th style="padding-left: 0.5rem;">Student Name</th>
                  <th>CGPA</th>
                  <th>Target Role</th>
                  <th>Readiness</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${studentRowsHtml}
              </tbody>
            </table>
          </div>

          <!-- Manage Tests -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Create Test -->
            <div class="premium-card">
              <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items:center; gap: 0.4rem;">
                <i data-lucide="plus-circle" style="color: var(--accent-primary)"></i> Create Mock Test
              </h3>

              <form id="admin-create-test-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="form-group">
                  <label for="adm-test-title">Test Designation Title</label>
                  <input type="text" id="adm-test-title" class="input-field" placeholder="e.g., Python OOP Core Speedrun" required />
                </div>
                <div class="form-group">
                  <label for="adm-test-qcount">Questions Count</label>
                  <select id="adm-test-qcount" class="select-field">
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="20">20 Questions</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; font-size:0.85rem; padding: 0.5rem 1rem;">
                  Add Test Package
                </button>
              </form>
            </div>

            <!-- Custom Tests List -->
            <div class="premium-card">
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; margin-bottom: 0.75rem;">Custom Created Tests</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${state.admin.customTests.map(t => `
                  <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.5rem 0.75rem; border-radius: var(--border-radius-sm); font-size: 0.75rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="font-weight:700;">${t.title}</div>
                      <div style="color:var(--text-muted); font-size:0.65rem; margin-top:0.1rem;">By: ${t.createdBy}</div>
                    </div>
                    <span class="badge badge-info">${t.questionsCount} Qs</span>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    window.lucide.createIcons();
    bindAdminEvents();
  };

  window.deleteStudentRow = function(index) {
    window.appState.deleteAdminStudent(index);
    window.renderAdminView();
  };

  function bindAdminEvents() {
    const form = document.getElementById('admin-create-test-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('adm-test-title').value;
        const count = parseInt(document.getElementById('adm-test-qcount').value);
        
        window.appState.addAdminTest(title, count);
        window.renderAdminView();
      });
    }
  }
})();
