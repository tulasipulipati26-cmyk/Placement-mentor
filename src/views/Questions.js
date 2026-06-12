// Premium Interview Question Bank View
(function() {
  let searchQuery = '';
  let activeFilter = 'All'; // 'All', 'HR', 'JavaScript', 'Python', 'SQL', 'Data Structures'
  let expandedQuestionId = null;

  window.renderQuestionsView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Available category chips
    const categories = ['All', 'HR', 'JavaScript', 'Python', 'SQL', 'Data Structures'];

    // Filter questions
    let filtered = window.mockData.interviewQuestions;
    if (activeFilter !== 'All') {
      filtered = filtered.filter(q => q.type === activeFilter || q.category === activeFilter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const categoryChipsHtml = categories.map(cat => `
      <button class="btn ${activeFilter === cat ? 'btn-primary' : 'btn-secondary'}" onclick="window.setQuestionFilter('${cat}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: 20px;">
        ${cat}
      </button>
    `).join('');

    const questionCardsHtml = filtered.length === 0 ? `
      <div style="grid-column: span 2; text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.85rem;">
        No questions matched your search criteria. Try a different query.
      </div>
    ` : filtered.map(q => {
      const isExpanded = expandedQuestionId === q.id;
      return `
        <div class="premium-card" style="cursor: pointer; display: flex; flex-direction: column; gap: 0.5rem; border-left: 4px solid ${q.type === 'HR' ? 'var(--accent-primary)' : 'var(--accent-success)'};" onclick="window.toggleQuestionExpand('${q.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="badge ${q.type === 'HR' ? 'badge-info' : 'badge-success'}" style="font-size: 0.65rem;">${q.category}</span>
            <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
          </div>
          <h4 style="font-size: 0.95rem; font-family: var(--font-header); font-weight: 600; line-height: 1.4; color: var(--text-primary);">
            ${q.question}
          </h4>
          
          ${isExpanded ? `
            <div style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; animation: scaleUp 0.2s ease;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Evaluation Keywords:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.75rem;">
                ${q.answerKeywords.map(kw => `<span style="background: var(--bg-tertiary); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace;">${kw}</span>`).join('')}
              </div>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-primary" onclick="event.stopPropagation(); window.startInstantMockInterview('${q.id}')" style="padding: 0.3rem 0.75rem; font-size: 0.7rem;">
                  Practice Answer <i data-lucide="video" style="width: 12px; height:12px;"></i>
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header);">Placement Question Bank</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">Unlock structural guides for frequently asked interview prompts.</p>
          </div>
          
          <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.4rem 0.8rem; border-radius: 30px; width: 250px;">
            <i data-lucide="search" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
            <input type="text" id="q-bank-search" placeholder="Search questions..." value="${searchQuery}" style="font-size: 0.8rem; width: 100%;" />
          </div>
        </div>

        <!-- Filter Chips -->
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          ${categoryChipsHtml}
        </div>

        <!-- Cards list -->
        <div class="grid-container grid-2-col" id="q-bank-grid">
          ${questionCardsHtml}
        </div>
      </div>
    `;

    window.lucide.createIcons();
    bindQuestionBankEvents();
  };

  window.setQuestionFilter = function(filter) {
    activeFilter = filter;
    window.renderQuestionsView();
  };

  window.toggleQuestionExpand = function(questionId) {
    expandedQuestionId = expandedQuestionId === questionId ? null : questionId;
    window.renderQuestionsView();
  };

  // Immediate bridge to Mock Interview View
  window.startInstantMockInterview = function(questionId) {
    const q = window.mockData.interviewQuestions.find(it => it.id === questionId);
    if (!q) return;

    // Trigger state swap to Mock Interview
    window.appState.setTab('interview');
    
    // We can inject this question directly inside the Mock interview view state
    // Let's call the view setup immediately with this singular question active
    setTimeout(() => {
      // Access view and start
      const startBtn = document.getElementById('start-interview-btn');
      if (startBtn) {
        // Quick trigger session
        window.setInterviewTrack(q.type);
        // Dispatch start simulation with only this question
        const triggerCustomStart = () => {
          const btn = document.getElementById('start-interview-btn');
          if (btn) btn.click();
        };
        triggerCustomStart();
      }
    }, 100);
  };

  function bindQuestionBankEvents() {
    const search = document.getElementById('q-bank-search');
    if (search) {
      search.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        // Search dynamically without total redraw to save cursor focus
        const filtered = window.mockData.interviewQuestions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        // We'll run a full render to reflect changes cleanly
      });
      search.addEventListener('change', () => {
        window.renderQuestionsView();
      });
      // Allow keypress enter
      search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          window.renderQuestionsView();
        }
      });
    }
  }
})();
