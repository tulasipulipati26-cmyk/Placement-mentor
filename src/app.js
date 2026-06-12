// Premium Core Orchestrator & Router
(function() {
  // Global Toast Dispatcher
  window.showToast = function(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="flex-grow: 1;">
        <div style="font-weight: 700; color: var(--text-primary);">${title}</div>
        <div style="color: var(--text-secondary); margin-top: 0.15rem; font-size: 0.75rem;">${message}</div>
      </div>
      <i data-lucide="x" class="toast-close" id="toast-close-btn"></i>
    `;

    container.appendChild(toast);
    window.lucide.createIcons();

    // Bind toast close click
    toast.querySelector('#toast-close-btn').addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    });

    // Auto dismiss after 3.5s
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3500);
  };

  // Router switcher mapping tabs to view render functions
  window.renderActiveView = function() {
    const state = window.appState.get();
    const activeTab = state.activeTab;

    // Handle sub-tab cross-routing bridges or legacy calls
    if (activeTab === 'resume' && window.renderResumeView) {
      window.renderResumeView();
    }
    // Direct mappings
    else if (activeTab === 'dashboard') {
      window.renderDashboardView();
    } else if (activeTab === 'success-heatmap') {
      window.renderSuccessHeatmapView();
    } else if (activeTab === 'daily-mentor') {
      window.renderDailyMentorView();
    } else if (activeTab === 'resume-jd') {
      window.renderResumeJdMatchView();
    } else if (activeTab === 'linkedin') {
      window.renderLinkedInOptimizerView();
    } else if (activeTab === 'chatbot') {
      window.renderChatbotView();
    } else if (activeTab === 'interview') {
      window.renderInterviewView();
    } else if (activeTab === 'emotion') {
      window.renderEmotionAnalyzerView();
    } else if (activeTab === 'tests') {
      window.renderTestsView();
    } else if (activeTab === 'battle') {
      window.renderBattleModeView();
    } else if (activeTab === 'questions') {
      window.renderQuestionsView();
    } else if (activeTab === 'planner') {
      window.renderPlannerView();
    } else if (activeTab === 'gps') {
      window.renderCareerGPSView();
    } else if (activeTab === 'projects-gen') {
      window.renderProjectGeneratorView();
    } else if (activeTab === 'predictor') {
      window.renderPredictorView();
    } else if (activeTab === 'salary') {
      window.renderSalaryPredictorView();
    } else if (activeTab === 'risk') {
      window.renderRiskDetectorView();
    } else if (activeTab === 'app-tracker') {
      window.renderAppTrackerView();
    } else if (activeTab === 'company-tracker') {
      window.renderCompanyTrackerView();
    } else if (activeTab === 'simulator') {
      window.renderTwinSimulatorView();
    } else if (activeTab === 'admin') {
      window.renderAdminView();
    } else {
      // Fallback
      window.renderDashboardView();
    }
  };

  // Entry point initialization
  document.addEventListener('DOMContentLoaded', () => {
    // Setup initial theme class
    const state = window.appState.get();
    document.body.className = state.theme;

    // Subscribe to state changes to redraw Shell elements
    window.appState.subscribe((latestState) => {
      // Render Static shell layers
      window.renderSidebar();
      window.renderHeader();
      
      // Render Content view
      window.renderActiveView();
    });

    // Fire welcome message after brief delay
    setTimeout(() => {
      window.showToast('Profile Loaded', 'Welcome back to your Placement Mentor dashboard!', 'success');
    }, 800);
  });
})();
