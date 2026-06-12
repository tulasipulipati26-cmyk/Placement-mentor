// Premium AI Mock Interview Engine
(function() {
  let sessionState = 'setup'; // 'setup', 'interviewing', 'evaluation'
  let selectedTrack = 'HR'; // 'HR', 'Technical'
  let currentQuestionIndex = 0;
  let activeQuestions = [];
  let userResponses = [];

  window.renderInterviewView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    let contentHtml = '';

    if (sessionState === 'setup') {
      contentHtml = renderSetup(state);
    } else if (sessionState === 'interviewing') {
      contentHtml = renderInterviewing();
    } else if (sessionState === 'evaluation') {
      contentHtml = renderEvaluation(state);
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Mock Interview Simulator</h1>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">Practice answering HR behavioral questions and technical prompts.</p>
          </div>
          ${sessionState !== 'setup' ? `
            <button class="btn btn-secondary" onclick="window.resetInterviewSession()">
              <i data-lucide="corner-up-left"></i> Exit Session
            </button>
          ` : ''}
        </div>

        ${contentHtml}
      </div>
    `;

    window.lucide.createIcons();
    bindInterviewEvents();
  };

  // 1. Setup Panel
  function renderSetup(state) {
    // Collect past evaluations
    const historyHtml = state.mockInterviews.length === 0 ? `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
        No mock interviews recorded yet. Choose a track and click start.
      </div>
    ` : state.mockInterviews.map((int, i) => `
      <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border-radius: var(--border-radius-sm); background: var(--bg-primary); border: 1px solid var(--border-color); margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 0.85rem;">Session Answer ${i+1}</span>
          <div style="display: flex; gap: 0.5rem;">
            <span class="badge badge-info">Score: ${int.score}%</span>
            <span class="badge badge-success">Confidence: ${int.confidence}%</span>
          </div>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary);"><b style="color: var(--text-primary);">Q:</b> ${int.questionText}</p>
        <p style="font-size: 0.8rem; color: var(--text-secondary);"><b style="color: var(--text-primary);">Your Answer:</b> "${int.userAnswer}"</p>
        <p style="font-size: 0.8rem; color: var(--accent-primary);"><b style="color: var(--text-primary);">AI Feedback:</b> ${int.feedback}</p>
      </div>
    `).join('');

    return `
      <div class="grid-container grid-main-side">
        <!-- Setup Settings -->
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-family: var(--font-header);">Configure Interview Session</h3>
          
          <div class="form-group">
            <label>Select Mock Category</label>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
              <button class="btn ${selectedTrack === 'HR' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setInterviewTrack('HR')" style="flex-grow: 1;">
                HR & Behavioral
              </button>
              <button class="btn ${selectedTrack === 'Technical' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setInterviewTrack('Technical')" style="flex-grow: 1;">
                Technical Core
              </button>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
            <div style="font-weight:600; color: var(--text-primary); margin-bottom: 0.25rem;">Session Details:</div>
            <div>• Rounds: 3 randomized prompts</div>
            <div>• Simulated feedback parameters: Keyword presence, structural length, speech filler count</div>
            <div>• Recommended Answer format: STAR method (2-3 sentences minimum)</div>
          </div>

          <button id="start-interview-btn" class="btn btn-primary" style="width: 100%;">
            <i data-lucide="play-circle"></i> Start Simulation
          </button>
        </div>

        <!-- History / Review -->
        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Past Session Telemetry</h3>
          <div style="max-height: 400px; overflow-y: auto;">
            ${historyHtml}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Active Session Panel
  function renderInterviewing() {
    const q = activeQuestions[currentQuestionIndex];
    return `
      <div style="max-width: 800px; margin: 0 auto;">
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">QUESTION ${currentQuestionIndex + 1} OF ${activeQuestions.length}</span>
            <span class="badge badge-info" id="interview-timer-badge">0:00</span>
          </div>

          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.5rem; line-height: 1.4;">
              ${q.question}
            </h2>
          </div>

          <div class="form-group">
            <label for="interview-answer-text">Type your response below:</label>
            <textarea id="interview-answer-text" class="textarea-field" rows="8" placeholder="Start typing your response here... (Try to cover key technical keywords)"></textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button id="interview-mic-btn" class="btn btn-secondary" style="border-radius: 30px;">
              <i data-lucide="mic"></i> <span id="mic-status-lbl">Simulate Voice Input</span>
            </button>
            
            <button id="submit-interview-answer-btn" class="btn btn-primary">
              Submit Answer <i data-lucide="chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Evaluation Dashboard Panel
  function renderEvaluation(state) {
    const lastEvaluation = state.mockInterviews[0]; // most recent
    const isSuccess = lastEvaluation.score >= 70;

    return `
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Score Overview Card -->
        <div class="premium-card" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2.5rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: ${isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)'}; color: ${isSuccess ? 'var(--accent-success)' : 'var(--accent-danger)'}; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="${isSuccess ? 'award' : 'alert-circle'}" style="width: 48px; height: 48px;"></i>
          </div>

          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.75rem;">AI Response Evaluation</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">Our NLP model evaluated your verbal articulation and vocabulary.</p>
          </div>

          <div style="display: flex; gap: 1.5rem; margin-top: 1rem;">
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 1rem 2rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-primary);">${lastEvaluation.score}%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight:600; margin-top: 0.25rem;">Completeness Score</div>
            </div>

            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 1rem 2rem; border-radius: var(--border-radius-sm);">
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-success);">${lastEvaluation.confidence}%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight:600; margin-top: 0.25rem;">Confidence Level</div>
            </div>
          </div>
        </div>

        <!-- Breakdown Feedback -->
        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem;">Granular Feedback Breakdown</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="border-left: 3px solid var(--accent-primary); padding-left: 1rem;">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">Evaluated Prompt:</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">"${lastEvaluation.questionText}"</p>
            </div>

            <div style="border-left: 3px solid var(--text-muted); padding-left: 1rem;">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">Your Answer submission:</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; font-style: italic;">"${lastEvaluation.userAnswer}"</p>
            </div>

            <div style="border-left: 3px solid var(--accent-success); padding-left: 1rem;">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">AI Recommendation Insights:</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.5;">${lastEvaluation.feedback}</p>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="window.resetInterviewSession()">
              Dashboard Home
            </button>
            ${currentQuestionIndex < activeQuestions.length - 1 ? `
              <button class="btn btn-primary" onclick="window.nextInterviewQuestion()">
                Next Question <i data-lucide="chevron-right"></i>
              </button>
            ` : `
              <button class="btn btn-primary" onclick="window.resetInterviewSession()">
                Complete Interview <i data-lucide="check-square"></i>
              </button>
            `}
          </div>
        </div>

      </div>
    `;
  }

  // Window functions for tab actions
  window.setInterviewTrack = function(track) {
    selectedTrack = track;
    window.renderInterviewView();
  };

  window.resetInterviewSession = function() {
    sessionState = 'setup';
    currentQuestionIndex = 0;
    activeQuestions = [];
    userResponses = [];
    clearInterval(window.interviewTimerInterval);
    window.renderInterviewView();
  };

  window.nextInterviewQuestion = function() {
    currentQuestionIndex++;
    sessionState = 'interviewing';
    window.renderInterviewView();
    startInterviewTimer();
  };

  // Helper Timer logic
  let secondsElapsed = 0;
  function startInterviewTimer() {
    secondsElapsed = 0;
    clearInterval(window.interviewTimerInterval);
    
    window.interviewTimerInterval = setInterval(() => {
      secondsElapsed++;
      const min = Math.floor(secondsElapsed / 60);
      const sec = secondsElapsed % 60;
      const displayStr = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      const badge = document.getElementById('interview-timer-badge');
      if (badge) badge.innerText = displayStr;
    }, 1000);
  }

  // Bind interview events
  function bindInterviewEvents() {
    // Start Simulation Button
    const startBtn = document.getElementById('start-interview-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // filter questions by category
        const allQ = window.mockData.interviewQuestions;
        activeQuestions = allQ.filter(q => q.type === selectedTrack);
        
        // Shuffle active list
        activeQuestions = activeQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        currentQuestionIndex = 0;
        userResponses = [];
        sessionState = 'interviewing';
        window.renderInterviewView();
        startInterviewTimer();
      });
    }

    // Submit response
    const submitBtn = document.getElementById('submit-interview-answer-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const text = document.getElementById('interview-answer-text').value;
        if (text.trim().length < 10) {
          window.appState.addNotification('Mock Error', 'Please write a substantial answer for evaluation.');
          return;
        }

        clearInterval(window.interviewTimerInterval);
        const q = activeQuestions[currentQuestionIndex];
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing NLP...';
        window.lucide.createIcons();

        setTimeout(() => {
          window.appState.submitInterviewAnswer(q.id, q.question, text);
          sessionState = 'evaluation';
          window.renderInterviewView();
        }, 1500);
      });
    }

    // Mic simulator button
    const micBtn = document.getElementById('interview-mic-btn');
    const txtArea = document.getElementById('interview-answer-text');
    if (micBtn && txtArea) {
      micBtn.addEventListener('click', () => {
        micBtn.disabled = true;
        micBtn.className = 'btn btn-primary';
        document.getElementById('mic-status-lbl').innerText = 'Listening... Speak now.';
        
        let speakCount = 0;
        const speechPresets = [
          'Well, in my experience, the STAR model is the best method to highlight accomplishments.',
          ' I worked on a team-based React dashboard project recently where we collaborated using git branches.',
          ' We faced a significant conflict regarding data flow design, but resolved it through active technical discussions.',
          ' Ultimately, the result was a 25% performance improvement in screen loading speeds.'
        ];

        const speechInterval = setInterval(() => {
          if (speakCount < speechPresets.length) {
            txtArea.value += speechPresets[speakCount];
            speakCount++;
          } else {
            clearInterval(speechInterval);
            micBtn.disabled = false;
            micBtn.className = 'btn btn-secondary';
            document.getElementById('mic-status-lbl').innerText = 'Simulate Voice Input';
          }
        }, 1000);
      });
    }
  }
})();
