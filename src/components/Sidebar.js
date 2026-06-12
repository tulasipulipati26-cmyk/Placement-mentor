// Premium Sidebar Navigation Component with Enhanced Modules
(function() {
  window.renderSidebar = function() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    const state = window.appState.get();
    
    // Grouped nav structure for 20+ modules
    const navigationGroups = [
      {
        title: 'Core Panel',
        items: [
          { tab: 'dashboard', label: 'Overview', icon: 'layout-dashboard' },
          { tab: 'success-heatmap', label: 'Success Heatmap', icon: 'grid' },
          { tab: 'daily-mentor', label: 'AI Daily Mentor', icon: 'user-check' }
        ]
      },
      {
        title: 'AI Resume & Coach',
        items: [
          { tab: 'resume-jd', label: 'Resume vs JD Match', icon: 'file-check-2' },
          { tab: 'linkedin', label: 'LinkedIn Optimizer', icon: 'linkedin' },
          { tab: 'chatbot', label: 'AI Career Chatbot', icon: 'message-square' }
        ]
      },
      {
        title: 'Arena & Assessments',
        items: [
          { tab: 'interview', label: 'Mock Interview', icon: 'video' },
          { tab: 'emotion', label: 'Emotion Analyzer', icon: 'smile' },
          { tab: 'tests', label: 'Timed Skill Tests', icon: 'timer' },
          { tab: 'battle', label: 'Placement Battle Mode', icon: 'swords' },
          { tab: 'questions', label: 'Question Bank', icon: 'help-circle' },
          { tab: 'planner', label: 'AI Study Planner', icon: 'calendar' }
        ]
      },
      {
        title: 'Career GPS & Gaps',
        items: [
          { tab: 'gps', label: 'AI Career GPS', icon: 'navigation' },
          { tab: 'projects-gen', label: 'AI Project Generator', icon: 'folder-git' }
        ]
      },
      {
        title: 'Analytics & Models',
        items: [
          { tab: 'predictor', label: 'Success Predictor', icon: 'trending-up' },
          { tab: 'salary', label: 'AI Salary Predictor', icon: 'circle-dollar-sign' },
          { tab: 'risk', label: 'Placement Risk Detector', icon: 'shield-alert' }
        ]
      },
      {
        title: 'Trackers & Simulations',
        items: [
          { tab: 'app-tracker', label: 'Smart App Tracker', icon: 'list-todo' },
          { tab: 'company-tracker', label: 'Dream Company Tracker', icon: 'building-2' },
          { tab: 'simulator', label: 'Twin Simulator', icon: 'gamepad-2' }
        ]
      },
      {
        title: 'System',
        items: [
          { tab: 'admin', label: 'Admin Dashboard', icon: 'shield' }
        ]
      }
    ];

    let menuHtml = '';
    navigationGroups.forEach(group => {
      menuHtml += `<div class="menu-category" style="margin-top:0.75rem;">${group.title}</div>`;
      group.items.forEach(item => {
        const isActive = state.activeTab === item.tab;
        menuHtml += `
          <div class="menu-item ${isActive ? 'active' : ''}" data-tab-target="${item.tab}" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; margin-bottom: 0.15rem;">
            <i data-lucide="${item.icon}" style="width:16px; height:16px;"></i>
            <span>${item.label}</span>
          </div>
        `;
      });
    });

    const isDark = state.theme === 'dark-theme';

    container.innerHTML = `
      <div class="sidebar-brand" style="padding: 1.25rem 1rem;">
        <i data-lucide="graduation-cap"></i>
        <span style="font-size:1.15rem;">Placement Mentor</span>
      </div>

      <div class="sidebar-menu" style="padding: 0.5rem 0.5rem 2rem; overflow-y: auto;">
        ${menuHtml}
      </div>

      <div class="sidebar-footer" style="padding: 0.75rem;">
        <div class="sidebar-actions">
          <button class="theme-toggle-btn" id="theme-toggle-trigger" style="padding: 0.4rem; font-size: 0.75rem;">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" style="width: 14px; height: 14px;"></i>
            <span>${isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
        <div class="profile-card" style="margin-top: 0.5rem; background: var(--bg-tertiary); padding: 0.4rem;">
          <div class="profile-avatar" style="width: 32px; height: 32px; font-size: 0.8rem; background: linear-gradient(135deg, var(--accent-primary) 0%, hsl(280, 85%, 60%) 100%);">
            ${state.userProfile.avatarInitials}
          </div>
          <div class="profile-info">
            <span class="profile-name" style="font-size: 0.8rem; font-weight: 700;">${state.userProfile.name}</span>
            <span class="profile-role" style="font-size: 0.65rem;">CGPA: ${state.userProfile.cgpa}</span>
          </div>
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindSidebarEvents();
  };

  function bindSidebarEvents() {
    const items = document.querySelectorAll('[data-tab-target]');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab-target');
        window.appState.setTab(targetTab);
        document.getElementById('app-root').classList.remove('sidebar-open');
      });
    });

    const themeBtn = document.getElementById('theme-toggle-trigger');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        window.appState.toggleTheme();
      });
    }
  }
})();
