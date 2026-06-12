// Premium Timed Test Engine
(function() {
  let testState = 'listing'; // 'listing', 'testing', 'scoreboard'
  let activeTest = null;
  let currentQIndex = 0;
  let selectedAnswers = {}; // questionId -> selectedOptionIndex
  let timeRemaining = 0;
  let testTimerInterval = null;
  let timeSpent = 0;

  window.renderTestsView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    let contentHtml = '';

    if (testState === 'listing') {
      contentHtml = renderListing(state);
    } else if (testState === 'testing') {
      contentHtml = renderTesting();
    } else if (testState === 'scoreboard') {
      contentHtml = renderScoreboard(state);
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header);">Timed Aptitude & Coding Tests</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">Practice speed runs to pass round 1 online assessment screens.</p>
          </div>
          ${testState === 'testing' ? `
            <button class="btn btn-secondary" onclick="window.abortTest()">
              <i data-lucide="alert-octagon"></i> Abort Test
            </button>
          ` : ''}
        </div>

        ${contentHtml}
      </div>
    `;

    window.lucide.createIcons();
    bindTestEvents();
  };

  // 1. Listing Panel
  function renderListing(state) {
    const testListHtml = window.mockData.tests.map(test => `
      <div class="premium-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
        <div>
          <span class="badge badge-info" style="margin-bottom: 0.5rem;">Timed Speedrun</span>
          <h3 style="font-family: var(--font-header); font-size: 1.15rem; line-height:1.3;">${test.title}</h3>
          <div style="display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-secondary);">
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <i data-lucide="help-circle" style="width: 14px; height: 14px;"></i> ${test.questions.length} Questions
            </span>
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${Math.floor(test.duration / 60)} Mins
            </span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.startMockTest('${test.id}')" style="width: 100%;">
          Start Speedrun <i data-lucide="play"></i>
        </button>
      </div>
    `).join('');

    const historyHtml = state.testHistory.length === 0 ? `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
        No test speedruns attempted yet. Select one above.
      </div>
    ` : state.testHistory.map(hist => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: var(--border-radius-sm); background: var(--bg-primary); border: 1px solid var(--border-color); margin-bottom: 0.5rem;">
        <div>
          <div style="font-size: 0.85rem; font-weight: 700;">${hist.title}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.1rem;">Attempted on ${hist.date} • Duration: ${hist.timeSpent}s</div>
        </div>
        <span class="badge ${hist.score >= 70 ? 'badge-success' : 'badge-danger'}" style="font-size: 0.85rem;">
          Score: ${hist.score}%
        </span>
      </div>
    `).join('');

    return `
      <div class="grid-container" style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Test Cards Grid -->
        <div class="grid-container grid-2-col">
          ${testListHtml}
        </div>

        <!-- History Records -->
        <div class="premium-card" style="max-width: 800px;">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Past Speedrun Records</h3>
          <div>
            ${historyHtml}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Active Test Panel
  function renderTesting() {
    const q = activeTest.questions[currentQIndex];
    const optionsHtml = q.options.map((opt, i) => `
      <label style="display: flex; gap: 0.75rem; align-items: center; padding: 0.85rem 1rem; border-radius: var(--border-radius-sm); background: var(--bg-primary); border: 1px solid ${selectedAnswers[q.id] === i ? 'var(--accent-primary)' : 'var(--border-color)'}; cursor: pointer; transition: all 0.2s;">
        <input type="radio" name="test-q-options" value="${i}" ${selectedAnswers[q.id] === i ? 'checked' : ''} onchange="window.saveOptionSelection('${q.id}', ${i})" style="accent-color: var(--accent-primary);" />
        <span style="font-size: 0.85rem; color: var(--text-primary);">${opt}</span>
      </label>
    `).join('');

    return `
      <div style="max-width: 800px; margin: 0 auto;">
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">${activeTest.title}</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">Question ${currentQIndex + 1} of ${activeTest.questions.length}</div>
            </div>
            <div class="badge badge-danger" style="font-size: 1rem; font-family: monospace; padding: 0.4rem 0.8rem;" id="test-countdown-badge">
              00:00
            </div>
          </div>

          <!-- Question prompt -->
          <div>
            <p style="font-size: 1.1rem; line-height: 1.5; font-weight: 500;">
              ${q.question}
            </p>
          </div>

          <!-- Options Checklist -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${optionsHtml}
          </div>

          <!-- Footer Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <button class="btn btn-secondary" onclick="window.prevTestQuestion()" ${currentQIndex === 0 ? 'disabled' : ''}>
              <i data-lucide="chevron-left"></i> Previous
            </button>
            
            ${currentQIndex < activeTest.questions.length - 1 ? `
              <button class="btn btn-secondary" onclick="window.nextTestQuestion()">
                Next <i data-lucide="chevron-right"></i>
              </button>
            ` : `
              <button class="btn btn-primary" onclick="window.submitMockTest()">
                Submit Speedrun <i data-lucide="check"></i>
              </button>
            `}
          </div>

        </div>
      </div>
    `;
  }

  // 3. Scoreboard analytics panel
  function renderScoreboard(state) {
    const scores = state.testHistory[0]; // most recent
    const isPass = scores.score >= 70;

    return `
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="premium-card" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 2.5rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: ${isPass ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)'}; color: ${isPass ? 'var(--accent-success)' : 'var(--accent-danger)'}; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="${isPass ? 'check-circle' : 'x-circle'}" style="width: 44px; height: 44px;"></i>
          </div>

          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.75rem;">Speedrun Completed!</h2>
            <p style="color: var(--text-secondary); font-size: 0.90rem; margin-top: 0.2rem;">Your test results have been registered in your profile analytics.</p>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 0.75rem;">
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.8rem 1.75rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--accent-primary);">${scores.score}%</div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight:600; margin-top:0.2rem;">Your Score</div>
            </div>

            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.8rem 1.75rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-secondary);">${scores.timeSpent}s</div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight:600; margin-top:0.2rem;">Time Taken</div>
            </div>
          </div>
        </div>

        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Diagnosis & Recommendation</h3>
          <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
            ${isPass ? `
              Excellent job! You passed the qualifying speedrun parameters. Your logical accuracy aligns with target roles.
            ` : `
              Your accuracy is currently below target requirements. Logical Reasoning and Speed timing need review. We recommend practicing Aptitude logs in the Question Bank.
            `}
          </p>
          
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="window.exitScoreboard()">
              Back to List
            </button>
            <button class="btn btn-primary" onclick="window.exitScoreboard()">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Active triggers
  window.startMockTest = function(testId) {
    const test = window.mockData.tests.find(t => t.id === testId);
    if (!test) return;

    activeTest = test;
    currentQIndex = 0;
    selectedAnswers = {};
    timeRemaining = test.duration;
    timeSpent = 0;
    testState = 'testing';
    
    window.renderTestsView();
    startCountdown();
  };

  window.abortTest = function() {
    clearInterval(testTimerInterval);
    testState = 'listing';
    activeTest = null;
    window.renderTestsView();
  };

  window.saveOptionSelection = function(questionId, optionIndex) {
    selectedAnswers[questionId] = optionIndex;
    window.renderTestsView();
  };

  window.nextTestQuestion = function() {
    currentQIndex++;
    window.renderTestsView();
  };

  window.prevTestQuestion = function() {
    currentQIndex--;
    window.renderTestsView();
  };

  window.submitMockTest = function() {
    clearInterval(testTimerInterval);
    
    // Evaluate correctness
    let correctCount = 0;
    activeTest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / activeTest.questions.length) * 100);
    const durationSpent = activeTest.duration - timeRemaining;

    // Save state
    window.appState.saveTestScore(activeTest.id, percent, durationSpent);

    testState = 'scoreboard';
    window.renderTestsView();

    if (percent >= 70 && window.confetti) {
      window.confetti({ particleCount: 100, spread: 60 });
    }
  };

  window.exitScoreboard = function() {
    testState = 'listing';
    activeTest = null;
    window.renderTestsView();
  };

  // Timer logic
  function startCountdown() {
    clearInterval(testTimerInterval);
    updateCountdownDisplay();

    testTimerInterval = setInterval(() => {
      timeRemaining--;
      updateCountdownDisplay();

      if (timeRemaining <= 0) {
        clearInterval(testTimerInterval);
        window.submitMockTest(); // auto submit
      }
    }, 1000);
  }

  function updateCountdownDisplay() {
    const badge = document.getElementById('test-countdown-badge');
    if (!badge) return;
    
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    badge.innerText = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  function bindTestEvents() {
    // Dynamic binding not required since clicks have inlined onclick targets
  }
})();
