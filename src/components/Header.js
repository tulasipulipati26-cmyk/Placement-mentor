// Premium Header Navigation Component
(function() {
  window.renderHeader = function() {
    const container = document.getElementById('header-container');
    if (!container) return;

    const state = window.appState.get();
    const notificationCount = state.notifications.filter(n => !n.read).length;

    container.innerHTML = `
      <div class="mobile-menu-toggle" id="mobile-menu-trigger">
        <i data-lucide="menu"></i>
      </div>

      <div class="header-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search roadmap, tests, insights..." id="search-input" />
      </div>

      <div class="header-actions">
        <!-- Streak Indicator -->
        <div class="header-stat-badge streak-badge" title="Learning Streak">
          <i data-lucide="flame"></i>
          <span>${state.userProfile.streak} Day Streak</span>
        </div>

        <!-- Readiness Score Preview -->
        <div class="header-stat-badge" title="Placement Readiness Meter Score">
          <i data-lucide="activity" style="color: var(--accent-primary)"></i>
          <span>Readiness: <b>${state.readinessScore}%</b></span>
        </div>

        <!-- Notifications Bell -->
        <div class="notification-bell-btn" id="bell-btn-trigger">
          <i data-lucide="bell"></i>
          ${notificationCount > 0 ? `<div class="bell-badge"></div>` : ''}
        </div>

        <!-- User Profile Avatar Quick Trigger -->
        <div class="profile-card" id="profile-modal-trigger" style="border: 1px solid var(--border-color)">
          <div class="avatar-wrapper">
            <div class="profile-avatar">${state.userProfile.avatarInitials}</div>
            <div class="status-indicator"></div>
          </div>
          <div class="profile-info">
            <span class="profile-name">${state.userProfile.name}</span>
            <span class="profile-role">CGPA: ${state.userProfile.cgpa}</span>
          </div>
        </div>
      </div>

      <!-- Notifications Dropdown Popover -->
      <div id="notifications-dropdown" class="premium-card" style="display: none; position: absolute; top: 75px; right: 2rem; width: 350px; z-index: 999; max-height: 400px; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h4 style="font-family: var(--font-header)">Notifications</h4>
          <span id="mark-read-trigger" style="font-size: 0.75rem; color: var(--accent-primary); cursor: pointer; font-weight: 600;">Mark all as read</span>
        </div>
        <div id="notifications-list-items" style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${state.notifications.length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
              No notifications yet.
            </div>
          ` : state.notifications.map(n => `
            <div class="notification-item" style="display: flex; gap: 0.75rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; ${!n.read ? 'border-left: 2px solid var(--accent-primary); padding-left: 0.5rem;' : ''}">
              <div style="flex-grow: 1;">
                <div style="font-weight: 600; color: var(--text-primary);">${n.title}</div>
                <div style="color: var(--text-secondary); margin-top: 0.2rem;">${n.message}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem;">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Re-trigger Lucide Icons rendering
    window.lucide.createIcons();

    // Bind Event Listeners
    bindHeaderEvents();
  };

  function bindHeaderEvents() {
    // Mobile menu trigger
    const menuBtn = document.getElementById('mobile-menu-trigger');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.getElementById('app-root').classList.toggle('sidebar-open');
      });
    }

    // Toggle Notifications dropdown
    const bellBtn = document.getElementById('bell-btn-trigger');
    const dropdown = document.getElementById('notifications-dropdown');
    if (bellBtn && dropdown) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
          // close profile dialog if open
          closeProfileModal();
        }
      });
    }

    // Mark notifications read
    const markReadBtn = document.getElementById('mark-read-trigger');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.appState.markNotificationsRead();
        window.renderHeader(); // redraw header
      });
    }

    // Close notifications on body click
    document.body.addEventListener('click', () => {
      const dropdown = document.getElementById('notifications-dropdown');
      if (dropdown) dropdown.style.display = 'none';
    });

    // Profile Click modal trigger
    const profileBtn = document.getElementById('profile-modal-trigger');
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProfileModal();
      });
    }
  }

  // Universal Profile Editing Modal
  function openProfileModal() {
    // Remove if already existing
    closeProfileModal();

    const state = window.appState.get();
    const rolesHtml = window.mockData.targetRoles.map(role => 
      `<option value="${role.id}" ${state.userProfile.targetRole === role.id ? 'selected' : ''}>${role.name}</option>`
    ).join('');

    const modal = document.createElement('div');
    modal.id = 'profile-edit-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content premium-card">
        <div class="modal-header">
          <h3 style="font-family: var(--font-header);">Student Profile Setup</h3>
          <i data-lucide="x" class="modal-close" id="profile-modal-close"></i>
        </div>
        <form id="profile-edit-form">
          <div class="form-group">
            <label for="prof-name">Full Name</label>
            <input type="text" id="prof-name" class="input-field" value="${state.userProfile.name}" required />
          </div>
          <div class="form-group">
            <label for="prof-cgpa">Academic CGPA (out of 10.0)</label>
            <input type="number" step="0.01" min="0" max="10" id="prof-cgpa" class="input-field" value="${state.userProfile.cgpa}" required />
          </div>
          <div class="form-group">
            <label for="prof-role">Target Job Role</label>
            <select id="prof-role" class="select-field">
              ${rolesHtml}
            </select>
          </div>
          <div class="form-group">
            <label for="prof-company">Dream Placement Company</label>
            <input type="text" id="prof-company" class="input-field" value="${state.userProfile.targetCompany}" required />
          </div>
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="prof-modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    window.lucide.createIcons();

    // Attach form and buttons events
    document.getElementById('profile-modal-close').addEventListener('click', closeProfileModal);
    document.getElementById('prof-modal-cancel').addEventListener('click', closeProfileModal);
    
    document.getElementById('profile-edit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-name').value;
      const cgpa = parseFloat(document.getElementById('prof-cgpa').value);
      const targetRole = document.getElementById('prof-role').value;
      const targetCompany = document.getElementById('prof-company').value;
      
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      window.appState.updateProfile({
        name,
        cgpa,
        targetRole,
        targetCompany,
        avatarInitials: initials
      });

      closeProfileModal();
      // Force active view to re-render to reflect new target role info
      if (window.renderActiveView) {
        window.renderActiveView();
      }
    });
  }

  function closeProfileModal() {
    const modal = document.getElementById('profile-edit-modal');
    if (modal) {
      modal.remove();
    }
  }
})();
