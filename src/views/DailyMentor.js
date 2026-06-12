// Premium AI Daily Mentor Coaching View
(function() {
  window.renderDailyMentorView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Pick daily quote based on current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];
    const dailyTip = window.mockData.dailyMentorTips.find(t => t.day === currentDay) || window.mockData.dailyMentorTips[0];

    // Build challenges checklist
    let challengesHtml = '';
    state.dailyChallenges.forEach(c => {
      challengesHtml += `
        <div class="premium-card" style="display:flex; justify-content:space-between; align-items:center; border-left: 3.5px solid ${c.done ? 'var(--accent-success)' : 'var(--accent-primary)'}; background: var(--bg-tertiary);">
          <div style="flex-grow:1; padding-right:1rem;">
            <div style="font-size:0.65rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:flex; gap:0.3rem; align-items:center;">
              <i data-lucide="award" style="width:12px; height:12px; color:var(--accent-primary);"></i>
              Reward: +${c.pts} Points
            </div>
            <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin: 0.2rem 0 0.1rem 0;">${c.title}</h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">${c.desc}</p>
          </div>
          
          <button class="btn ${c.done ? 'btn-secondary' : 'btn-primary'}" onclick="window.submitDailyChallenge('${c.id}')" ${c.done ? 'disabled' : ''} style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
            ${c.done ? '<i data-lucide="check-circle-2"></i> Done' : 'Submit Solved'}
          </button>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); display:flex; flex-direction:column; gap:1.5rem;">
        <div>
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Daily Mentor</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Unlock daily strategic coaching and clear milestones to claim placement points.</p>
        </div>

        <div class="grid-container grid-main-side">
          <!-- Left: Challenges & Progress -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <h3 style="font-family:var(--font-header); font-size:1.15rem; margin:0; display:flex; align-items:center; gap:0.4rem;">
              <i data-lucide="compass" style="color:var(--accent-primary);"></i> Active Daily Challenges
            </h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${challengesHtml}
            </div>
          </div>

          <!-- Right: Daily mentor advice quote card -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <!-- Quote card -->
            <div class="premium-card" style="background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.1) 0%, rgba(var(--accent-primary-rgb), 0.02) 100%); border-color: rgba(var(--accent-primary-rgb), 0.2); position:relative; overflow:hidden;">
              <div style="position:absolute; right:-20px; top:-20px; font-size:8rem; font-weight:800; font-family:var(--font-header); color:rgba(var(--accent-primary-rgb), 0.03); line-height:1; user-select:none;">“</div>
              <span style="font-size:0.65rem; color:var(--accent-primary); font-weight:700; text-transform:uppercase;">Quote of the Day (${dailyTip.day})</span>
              <p style="font-size:1rem; font-family:var(--font-header); font-style:italic; line-height:1.6; color:var(--text-primary); margin:0.5rem 0 0.75rem 0;">
                ${dailyTip.quote}
              </p>
              <div style="border-top:1px solid var(--border-color); padding-top:0.6rem; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Focus Area: <b>${dailyTip.focus}</b></span>
                <i data-lucide="shield-check" style="color:var(--accent-primary); width:16px;"></i>
              </div>
            </div>

            <!-- Streak card -->
            <div class="premium-card" style="display:flex; gap:1rem; align-items:center;">
              <div style="width: 44px; height: 44px; border-radius:50%; background:rgba(255, 100, 0, 0.1); color: rgb(255, 100, 0); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.2rem;">
                <i data-lucide="flame"></i>
              </div>
              <div>
                <h4 style="font-size:0.9rem; margin:0;">Consistency Streak</h4>
                <span style="font-size:0.75rem; color:var(--text-muted);">Streak status: <b>${state.userProfile.streak} Days Active</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
  };

  window.submitDailyChallenge = function(challengeId) {
    window.appState.completeChallenge(challengeId);
    window.renderDailyMentorView();
  };
})();
