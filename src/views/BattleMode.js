// Premium Placement Battle Mode View
(function() {
  window.renderBattleModeView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const battle = state.battle;

    let contentHtml = '';

    if (battle.status === 'idle') {
      contentHtml = `
        <div class="premium-card" style="max-width: 600px; margin: 2rem auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
            <i data-lucide="swords" style="width: 36px; height: 36px;"></i>
          </div>
          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.75rem;">Placement Battle Arena</h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.4rem; line-height: 1.6;">
              Test your core computer science and algorithmic speed against simulated candidate peers. Solve multiple-choice questions faster than your opponent to claim victory and boost your streak.
            </p>
          </div>

          <button id="start-battle-btn" class="btn btn-primary" style="width: 100%;">
            Find Peer Duel Match
          </button>
        </div>

        <!-- History card -->
        <div class="premium-card" style="max-width: 600px; margin: 1.5rem auto;">
          <h3 style="font-family: var(--font-header); font-size: 1.05rem; margin-bottom: 0.75rem;">Combat History</h3>
          <div style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
            ${battle.history.length === 0 ? `
              <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-size: 0.75rem;">No battles fought yet.</div>
            ` : battle.history.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                <div>
                  <span style="font-weight: 700; color: ${item.outcome === 'Won' ? 'var(--accent-success)' : 'var(--accent-danger)'};">${item.outcome}</span>
                  <span style="color: var(--text-muted); margin-left: 0.4rem;">(${item.date})</span>
                </div>
                <span>You: <b>${item.user}</b> vs Peer: <b>${item.rival}</b></span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (battle.status === 'ongoing') {
      const q = window.mockData.battleQuestions[battle.questionIndex];
      
      let optionsHtml = '';
      q.options.forEach((opt, idx) => {
        let btnStyle = 'background: var(--bg-secondary); border: 1.5px solid var(--border-color);';
        let disabledAttr = '';
        
        if (battle.userSelectedOption !== null) {
          disabledAttr = 'disabled';
          if (idx === q.correct) {
            btnStyle = 'background: rgba(var(--accent-success-rgb), 0.15); border-color: var(--accent-success); color: var(--accent-success);';
          } else if (idx === battle.userSelectedOption) {
            btnStyle = 'background: rgba(var(--accent-danger-rgb), 0.15); border-color: var(--accent-danger); color: var(--accent-danger);';
          }
        }

        optionsHtml += `
          <button class="btn" style="${btnStyle} width: 100%; text-align: left; padding: 0.85rem 1.25rem; font-size: 0.85rem; justify-content: flex-start;" onclick="window.submitBattleOption(${idx})" ${disabledAttr}>
            <span style="font-weight: 700; margin-right: 0.5rem;">${String.fromCharCode(65 + idx)}.</span>
            <span>${opt}</span>
          </button>
        `;
      });

      contentHtml = `
        <div style="max-width: 750px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Scores bar -->
          <div class="grid-container grid-2-col" style="gap: 1rem;">
            <!-- Player -->
            <div class="premium-card" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid var(--accent-success);">
              <div>
                <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">You</span>
                <div style="font-size: 1.5rem; font-weight: 800; color:var(--accent-success);">${battle.userScore}</div>
              </div>
              <i data-lucide="user" style="color: var(--accent-success); width: 28px; height: 28px;"></i>
            </div>
            
            <!-- Rival -->
            <div class="premium-card" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid var(--accent-danger);">
              <div>
                <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Rival Candidate</span>
                <div style="font-size: 1.5rem; font-weight: 800; color:var(--accent-danger);">${battle.rivalScore}</div>
              </div>
              <i data-lucide="bot" style="color: var(--accent-danger); width: 28px; height: 28px;"></i>
            </div>
          </div>

          <!-- Rival speed indicator -->
          <div class="premium-card" style="padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
              <span>Rival Thinking Progress</span>
              <span>${battle.rivalProgress}%</span>
            </div>
            <div style="height: 6px; background: var(--bg-primary); border-radius: 3px; overflow:hidden;">
              <div style="width: ${battle.rivalProgress}%; height: 100%; background: var(--accent-danger); transition: width 0.8s linear;"></div>
            </div>
          </div>

          <!-- Question card -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
              <span style="font-size: 0.7rem; color: var(--accent-primary); font-weight:700; text-transform:uppercase;">Question ${battle.questionIndex + 1} of ${window.mockData.battleQuestions.length}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Worth ${q.points} pts</span>
            </div>

            <h3 style="font-family: var(--font-header); font-size: 1.15rem; line-height: 1.5; margin:0;">${q.question}</h3>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              ${optionsHtml}
            </div>
          </div>

          <button class="btn btn-secondary" onclick="window.appState.stopBattle(); window.renderBattleModeView();" style="align-self:center;">
            <i data-lucide="log-out"></i> Leave Arena
          </button>
        </div>
      `;
    } else if (battle.status === 'ended') {
      const userWon = battle.userScore >= battle.rivalScore;
      contentHtml = `
        <div class="premium-card" style="max-width: 500px; margin: 3rem auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem; border-top: 4px solid ${userWon ? 'var(--accent-success)' : 'var(--accent-danger)'};">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: ${userWon ? 'rgba(var(--accent-success-rgb), 0.1)' : 'rgba(var(--accent-danger-rgb), 0.1)'}; color: ${userWon ? 'var(--accent-success)' : 'var(--accent-danger)'}; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="${userWon ? 'trophy' : 'frown'}" style="width: 36px; height: 36px;"></i>
          </div>
          <div>
            <h2 style="font-family: var(--font-header); font-size: 1.75rem;">${userWon ? 'Victory in the Arena!' : 'Defeated in Duel'}</h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.4rem; line-height: 1.5;">
              ${userWon ? 'You answered faster and outscored your peer competitor! Keep up the sharp syntax.' : 'Your opponent submitted correct answers faster. Practice your timing logic.'}
            </p>
          </div>

          <div style="display:flex; justify-content:space-between; width:100%; border:1px solid var(--border-color); border-radius:var(--border-radius-sm); padding:1rem; background:var(--bg-primary); margin: 0.5rem 0;">
            <div>
              <div style="font-size:0.7rem; color:var(--text-muted);">Your Score</div>
              <div style="font-size:1.25rem; font-weight:800; color:var(--accent-success);">${battle.userScore}</div>
            </div>
            <div style="border-right: 1px solid var(--border-color);"></div>
            <div>
              <div style="font-size:0.7rem; color:var(--text-muted);">Opponent Score</div>
              <div style="font-size:1.25rem; font-weight:800; color:var(--accent-danger);">${battle.rivalScore}</div>
            </div>
          </div>

          <button id="end-battle-restart-btn" class="btn btn-primary" style="width: 100%;">
            Return to Lobby
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">Placement Battle Mode</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Compete against candidates in real-time computer science coding duels.</p>
        </div>

        ${contentHtml}
      </div>
    `;

    window.lucide.createIcons();
    bindBattleEvents();
  };

  window.submitBattleOption = function(idx) {
    window.appState.submitBattleAnswer(idx);
    window.renderBattleModeView();
  };

  function bindBattleEvents() {
    const startBtn = document.getElementById('start-battle-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.appState.startBattle();
        window.renderBattleModeView();
      });
    }

    const endBtn = document.getElementById('end-battle-restart-btn');
    if (endBtn) {
      endBtn.addEventListener('click', () => {
        window.appState.stopBattle();
        window.renderBattleModeView();
      });
    }
  }
})();
