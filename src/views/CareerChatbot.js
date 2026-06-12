// Premium AI Career Coach Chatbot View
(function() {
  let chatHistory = [
    { sender: 'ai', text: 'Hello! I am your AI Placement Coach. Ask me anything about resume reviews, interview strategies, company stages, or roadmap tips!' }
  ];

  window.renderChatbotView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();

    // Suggested prompt click quick-triggers
    const quickPrompts = [
      'How to optimize my ATS score?',
      `Interview tips for ${state.userProfile.targetCompany}?`,
      'Explain the STAR method.'
    ];

    const historyHtml = chatHistory.map(msg => `
      <div class="chat-message ${msg.sender}">
        <div class="chat-bubble">
          ${msg.text}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal); height: calc(100vh - 180px); display: flex; flex-direction: column;">
        <div style="margin-bottom: 1rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Career Coach Chat</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Chat with our counselor about resume enhancements and behavioral strategies.</p>
        </div>

        <div class="chat-container" style="flex-grow: 1; display: flex; flex-direction: column;">
          <!-- Conversations scrollable area -->
          <div class="chat-history" id="chat-history-container">
            ${historyHtml}
            <div id="chat-typing-bubble" class="chat-message ai" style="display: none;">
              <div class="chat-bubble" style="display: flex; gap: 4px; padding: 0.6rem 1rem;">
                <span class="typing-dot" style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; display:inline-block; animation: typingDot 1s infinite 0s;"></span>
                <span class="typing-dot" style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; display:inline-block; animation: typingDot 1s infinite 0.2s;"></span>
                <span class="typing-dot" style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; display:inline-block; animation: typingDot 1s infinite 0.4s;"></span>
              </div>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            ${quickPrompts.map(qp => `
              <button class="btn btn-secondary" onclick="window.sendQuickPrompt('${qp.replace(/'/g, "\\'")}')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; border-radius: 20px;">
                ${qp}
              </button>
            `).join('')}
          </div>

          <!-- Input bar -->
          <form id="chat-input-form" class="chat-input-area">
            <input type="text" id="chat-user-message-input" class="input-field" placeholder="Ask about placements, resumes, DSA, etc..." autocomplete="off" />
            <button type="submit" class="btn btn-primary" style="padding: 0 1.5rem;">
              <i data-lucide="send"></i>
            </button>
          </form>
        </div>
      </div>

      <style>
        @keyframes typingDot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      </style>
    `;

    window.lucide.createIcons();
    bindChatEvents();
    scrollChatBottom();
  };

  window.sendQuickPrompt = function(promptText) {
    const input = document.getElementById('chat-user-message-input');
    if (input) {
      input.value = promptText;
      triggerChatMessageSubmit();
    }
  };

  function scrollChatBottom() {
    const chatHist = document.getElementById('chat-history-container');
    if (chatHist) {
      chatHist.scrollTop = chatHist.scrollHeight;
    }
  }

  function triggerChatMessageSubmit() {
    const input = document.getElementById('chat-user-message-input');
    const msg = input.value.trim();
    if (!msg) return;

    // Push User message
    chatHistory.push({ sender: 'user', text: msg });
    input.value = '';
    window.renderChatbotView();

    // Show Typing Bubble
    const typing = document.getElementById('chat-typing-bubble');
    if (typing) typing.style.display = 'flex';
    scrollChatBottom();

    // Simulate Coach Heuristic Answer Generation
    setTimeout(() => {
      const state = window.appState.get();
      let botResponse = `Interesting question. Regarding "${msg}", for your target role as a ${window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole)?.name || 'student'}, consistency is key. Ensure you solve the daily challenges to boost your score.`;

      // Check content keywords
      const lowercaseMsg = msg.toLowerCase();
      if (lowercaseMsg.includes('ats') || lowercaseMsg.includes('resume')) {
        botResponse = `To optimize your ATS score: 
        1. Always upload in standard clean PDF or DOCX formatting.
        2. Make sure you integrate missing technical keywords: ${window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole)?.skills.slice(0, 3).join(', ') || 'React, SQL, Python'}.
        3. Do not place tables or complex images in the header. Check out the AI Resume Analyzer module for specific audits.`;
      } else if (lowercaseMsg.includes('google') || lowercaseMsg.includes('microsoft') || lowercaseMsg.includes('tcs')) {
        const companyName = lowercaseMsg.includes('google') ? 'Google' : lowercaseMsg.includes('microsoft') ? 'Microsoft' : 'TCS';
        const insights = window.mockData.companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
        botResponse = `Preparing for ${companyName}? Here are the primary evaluation parameters:
        • Rounds: ${insights ? insights.rounds.join(' -> ') : 'Online Aptitude, Code Interview, HR review'}.
        • Core Insight: ${insights ? insights.insights : 'Maintain sound logic and explain your approach step-by-step.'}
        Check the "Placement Simulator" in the sidebar to play an interactive placement season for these companies!`;
      } else if (lowercaseMsg.includes('star')) {
        botResponse = `The STAR method is the industry standard for answering behavioral questions:
        • <b>S</b>ituation: Set the context of the project or problem (e.g. "During my final semester project...").
        • <b>T</b>ask: Define the specific goal or challenge (e.g. "We needed to build a database scale gateway...").
        • <b>A</b>ction: Describe what YOU did to solve it (e.g. "I implemented indexing and Redis caching...").
        • <b>R</b>esult: Quantify the success (e.g. "This reduced endpoint loading time by 40%").
        Use this in your "Mock Interview" responses for a higher confidence rating!`;
      }

      chatHistory.push({ sender: 'ai', text: botResponse });
      window.renderChatbotView();
    }, 1500);
  }

  function bindChatEvents() {
    const form = document.getElementById('chat-input-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerChatMessageSubmit();
      });
    }
  }
})();
