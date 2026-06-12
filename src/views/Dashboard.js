// Premium Dashboard View Component
(function() {
  window.renderDashboardView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Calculate SVG circular path offsets for Readiness Meter
    const radius = 50;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (state.readinessScore / 100) * circumference;

    // Render daily challenges checklist
    const challengesHtml = state.dailyChallenges.map(challenge => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: var(--border-radius-sm); background: var(--bg-primary); border: 1px solid var(--border-color); margin-bottom: 0.5rem; transition: all 0.3s ease;">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <i data-lucide="${challenge.done ? 'check-circle' : 'circle'}" style="color: ${challenge.done ? 'var(--accent-success)' : 'var(--text-muted)'}; cursor: pointer;" onclick="window.appState.completeChallenge('${challenge.id}')"></i>
          <div>
            <div style="font-size: 0.85rem; font-weight: 600; text-decoration: ${challenge.done ? 'line-through' : 'none'}; color: ${challenge.done ? 'var(--text-muted)' : 'var(--text-primary)'};">${challenge.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.1rem;">${challenge.desc}</div>
          </div>
        </div>
        <span class="badge ${challenge.done ? 'badge-success' : 'badge-info'}">+${challenge.pts} pts</span>
      </div>
    `).join('');

    // Peer Benchmark chart bars
    const userScore = state.readinessScore;
    const cohortAverage = 65;
    const topperScore = 94;

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <!-- Welcome banner -->
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-family: var(--font-header); font-weight: 800; background: linear-gradient(90deg, var(--text-primary) 30%, var(--accent-primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Welcome back, ${state.userProfile.name}!
          </h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem; font-size: 0.95rem;">
            You have active target milestones to complete for your target placement at <b>${state.userProfile.targetCompany}</b>.
          </p>
        </div>

        <!-- Main Dashboard Widgets Grid -->
        <div class="grid-container grid-main-side">
          
          <!-- Column Left: Analytics and charts -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Stats row -->
            <div class="grid-container grid-3-col">
              <!-- Circular Readiness Meter -->
              <div class="premium-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 1rem; align-self: flex-start; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="gauge" style="color: var(--accent-primary)"></i> Readiness Score
                </h3>
                <div class="readiness-meter-wrapper">
                  <svg width="180" height="180" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                    <circle cx="50" cy="50" r="${normalizedRadius}" stroke="var(--bg-tertiary)" stroke-width="${strokeWidth}" fill="transparent" />
                    <circle cx="50" cy="50" r="${normalizedRadius}" stroke="var(--accent-primary)" stroke-width="${strokeWidth}" fill="transparent" 
                      stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" style="transition: stroke-dashoffset 0.8s ease;" />
                  </svg>
                  <div class="readiness-score-text">
                    <div class="readiness-score-val">${state.readinessScore}</div>
                    <div class="readiness-score-lbl">Ready</div>
                  </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                  Your target score is 85+ for top tier placements.
                </p>
              </div>

              <!-- Progress Chart Widget -->
              <div class="premium-card" style="grid-column: span 2;">
                <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="activity" style="color: var(--accent-primary)"></i> Readiness Trend
                </h3>
                <div style="height: 150px; position: relative;">
                  <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style="overflow: visible;">
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line x1="0" y1="20" x2="300" y2="20" stroke="var(--border-color)" stroke-dasharray="4,4" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="var(--border-color)" stroke-dasharray="4,4" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="var(--border-color)" stroke-dasharray="4,4" />
                    
                    <!-- Line Area Glow -->
                    <path d="M0,90 Q50,75 100,85 T200,60 T300,${100 - state.readinessScore} L300,100 L0,100 Z" fill="url(#chart-glow)" />
                    <!-- The Chart Line -->
                    <path d="M0,90 Q50,75 100,85 T200,60 T300,${100 - state.readinessScore}" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" />
                    
                    <!-- Dot at Current Score -->
                    <circle cx="300" cy="${100 - state.readinessScore}" r="5" fill="var(--accent-primary)" stroke="white" stroke-width="2" />
                  </svg>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            <!-- Peer Benchmark Comparison Chart -->
            <div class="premium-card">
              <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="bar-chart-2" style="color: var(--accent-primary)"></i> Peer Benchmark Comparison
              </h3>
              
              <!-- Bars container -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Student Bar -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.35rem;">
                    <span>You (Aarav Sharma)</span>
                    <span style="color: var(--accent-primary)">${userScore}%</span>
                  </div>
                  <div style="height: 12px; background: var(--bg-primary); border-radius: 6px; overflow: hidden;">
                    <div style="width: ${userScore}%; height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-primary-hover)); border-radius: 6px; transition: width 0.8s ease;"></div>
                  </div>
                </div>

                <!-- Average Student -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--text-secondary)">
                    <span>Cohort Average</span>
                    <span>${cohortAverage}%</span>
                  </div>
                  <div style="height: 12px; background: var(--bg-primary); border-radius: 6px; overflow: hidden;">
                    <div style="width: ${cohortAverage}%; height: 100%; background: var(--text-muted); border-radius: 6px;"></div>
                  </div>
                </div>

                <!-- Class Topper -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--text-secondary)">
                    <span>Cohort Top Scorers</span>
                    <span style="color: var(--accent-success)">${topperScore}%</span>
                  </div>
                  <div style="height: 12px; background: var(--bg-primary); border-radius: 6px; overflow: hidden;">
                    <div style="width: ${topperScore}%; height: 100%; background: linear-gradient(90deg, var(--accent-success), #4ade80); border-radius: 6px;"></div>
                  </div>
                </div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                You are outperforming <b>64%</b> of students in your academic batch. Keep practicing to reach the topper standard!
              </p>
            </div>

          </div>

          <!-- Column Right: Streaks, Heatmaps, Activity -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Daily Challenges Card -->
            <div class="premium-card glow-success">
              <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="target" style="color: var(--accent-success)"></i> Daily Placement Challenges
              </h3>
              <div style="margin-bottom: 1rem;">
                ${challengesHtml}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="info" style="width: 14px; height: 14px;"></i>
                <span>Complete challenges daily to maintain your placement streak.</span>
              </div>
            </div>

            <!-- Skill Progress Heatmap -->
            <div class="premium-card">
              <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="grid" style="color: var(--accent-primary)"></i> Learning Streak Heatmap
              </h3>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">
                Contributions and coding test activity over the past 14 weeks.
              </p>
              
              <!-- Heatmap Grid -->
              <div class="heatmap-grid" id="heatmap-cell-container">
                ${state.studyHeatmap.map(cell => `
                  <div class="heatmap-cell" data-level="${cell.level}" title="${cell.date}: Level ${cell.level} Activity"></div>
                `).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.7rem; color: var(--text-muted);">
                <span>14 Weeks Ago</span>
                <div style="display: flex; gap: 3px; align-items: center;">
                  <span>Less</span>
                  <div style="width:8px; height:8px; background:var(--bg-tertiary); border-radius:1px;"></div>
                  <div style="width:8px; height:8px; background:rgba(34,197,94,0.2); border-radius:1px;"></div>
                  <div style="width:8px; height:8px; background:rgba(34,197,94,0.5); border-radius:1px;"></div>
                  <div style="width:8px; height:8px; background:rgba(34,197,94,0.8); border-radius:1px;"></div>
                  <div style="width:8px; height:8px; background:var(--accent-success); border-radius:1px;"></div>
                  <span>More</span>
                </div>
                <span>Today</span>
              </div>
            </div>

            <!-- Recent Activity Widget -->
            <div class="premium-card">
              <h3 style="font-size: 0.95rem; font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="clock" style="color: var(--accent-primary)"></i> Recent Activities
              </h3>
              
              <div style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 250px; overflow-y: auto;">
                ${state.testHistory.length === 0 && state.mockInterviews.length === 0 && !state.resumeAnalysis ? `
                  <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                    No activities recorded yet. Start practicing!
                  </div>
                ` : ''}

                ${state.testHistory.slice(0, 3).map(score => `
                  <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-primary)"></div>
                    <div style="flex-grow: 1;">
                      <span style="font-weight:600;">Scored ${score.score}%</span> in <span style="color:var(--text-secondary);">${score.title}</span>
                    </div>
                    <span style="color: var(--text-muted); font-size: 0.7rem;">${score.date}</span>
                  </div>
                `).join('')}

                ${state.mockInterviews.slice(0, 2).map(int => `
                  <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-success)"></div>
                    <div style="flex-grow: 1;">
                      Completed Mock Session: <span style="font-weight:600;">Score ${int.score}%</span>
                    </div>
                    <span style="color: var(--text-muted); font-size: 0.7rem;">${int.date}</span>
                  </div>
                `).join('')}

                ${state.resumeAnalysis ? `
                  <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-warning)"></div>
                    <div style="flex-grow: 1;">
                      Uploaded & Analyzed resume: <span style="font-weight:600;">ATS: ${state.resumeAnalysis.atsScore}%</span>
                    </div>
                    <span style="color: var(--text-muted); font-size: 0.7rem;">Today</span>
                  </div>
                ` : ''}
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    // Re-create Icons for dynamic elements
    window.lucide.createIcons();
  };
})();
