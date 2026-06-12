// Premium AI Interview Emotion Analyzer View
(function() {
  window.renderEmotionAnalyzerView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const sess = state.emotionSession;

    let displayPanel = '';
    if (sess.active) {
      // Calculate ratios based on fillers count
      const nervousRatio = Math.min(sess.fillers * 8, 40);
      const hesitantRatio = Math.min(sess.fillers * 6, 30);
      const confidentRatio = 100 - nervousRatio - hesitantRatio;

      displayPanel = `
        <div class="grid-container grid-2-col" style="margin-top: 1.5rem; animation: scaleUp 0.3s ease;">
          <!-- Left: Dummy Video Feed -->
          <div class="premium-card" style="background: #090d16; border-color: var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 320px; position: relative; overflow: hidden;">
            
            <!-- Animated scan lines -->
            <div style="position: absolute; width:100%; height: 2px; background: rgba(var(--accent-primary-rgb), 0.3); top:0; animation: scanLine 3s linear infinite;"></div>

            <!-- Pulsing audio waveform circles -->
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2rem;">
              <span class="wave-bar" style="width: 5px; height: 30px; background: var(--accent-primary); border-radius: 3px; animation: waveGrow 0.8s infinite alternate 0.1s;"></span>
              <span class="wave-bar" style="width: 5px; height: 50px; background: var(--accent-primary); border-radius: 3px; animation: waveGrow 0.8s infinite alternate 0.3s;"></span>
              <span class="wave-bar" style="width: 5px; height: 70px; background: var(--accent-primary); border-radius: 3px; animation: waveGrow 0.8s infinite alternate 0.5s;"></span>
              <span class="wave-bar" style="width: 5px; height: 40px; background: var(--accent-primary); border-radius: 3px; animation: waveGrow 0.8s infinite alternate 0.2s;"></span>
              <span class="wave-bar" style="width: 5px; height: 20px; background: var(--accent-primary); border-radius: 3px; animation: waveGrow 0.8s infinite alternate 0.4s;"></span>
            </div>

            <div style="text-align: center; z-index: 2; color: white;">
              <i data-lucide="eye" style="color: var(--accent-primary); width:32px; height:32px; margin-bottom: 0.5rem; animation: pulse 1.5s infinite;"></i>
              <div style="font-family: monospace; font-size: 0.85rem; color: #4ade80;">CAMERA FEED: SIMULATED ACTIVE</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Session Duration: ${sess.timer}s</div>
            </div>

            <!-- Bottom floating tag -->
            <div style="position: absolute; bottom: 1rem; left: 1rem; background: rgba(0,0,0,0.6); padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; color: white;">
              Face Markers Indexed: 68 points
            </div>
          </div>

          <!-- Right: Real-time Telemetry -->
          <div class="premium-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h3 style="font-family: var(--font-header);">Facial & Vocal Telemetry</h3>
            
            <!-- Detected emotion -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-sm); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Live Expression</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-top:0.15rem;">${sess.currentEmotion}</div>
              </div>
              <i data-lucide="activity" style="color: var(--accent-primary); width:28px; height:28px;"></i>
            </div>

            <!-- Vocal fillers -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-sm); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Vocal Fillers count ("uh", "um")</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: ${sess.fillers > 4 ? 'var(--accent-danger)' : 'var(--accent-success)'}; margin-top:0.15rem;">${sess.fillers} Logged</div>
              </div>
              <i data-lucide="volume-2" style="color: var(--accent-primary); width:28px; height:28px;"></i>
            </div>

            <!-- Ratios bars -->
            <div>
              <h4 style="font-size: 0.85rem; font-family: var(--font-header); margin-bottom: 0.75rem;">Emotional Ratio Distribution</h4>
              
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.2rem;">
                    <span>Confident / Neutral</span>
                    <span>${confidentRatio}%</span>
                  </div>
                  <div style="height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden;">
                    <div style="width:${confidentRatio}%; height:100%; background:var(--accent-success); border-radius:4px;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.2rem;">
                    <span>Hesitant / Pause</span>
                    <span>${hesitantRatio}%</span>
                  </div>
                  <div style="height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden;">
                    <div style="width:${hesitantRatio}%; height:100%; background:var(--accent-warning); border-radius:4px;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.2rem;">
                    <span>Nervous / Filler word spikes</span>
                    <span>${nervousRatio}%</span>
                  </div>
                  <div style="height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden;">
                    <div style="width:${nervousRatio}%; height:100%; background:var(--accent-danger); border-radius:4px;"></div>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" onclick="window.toggleEmotionSessionState(false)" style="margin-top:auto; border-top:1px solid var(--border-color);">
              <i data-lucide="stop-circle" style="color: var(--accent-danger)"></i> Stop Live Tracking
            </button>
          </div>
        </div>
      `;
    } else {
      displayPanel = `
        <div class="premium-card" style="max-width: 500px; margin: 3rem auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="smile" style="width: 36px; height: 36px;"></i>
          </div>
          <div>
            <h2 style="font-family: var(--font-header);">AI Emotion & Tone Tracker</h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.5;">
              Calibrate your interview voice and facial gestures. Open the dummy camera simulator to monitor posture, track facial markers, and calculate filler word frequencies.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.toggleEmotionSessionState(true)" style="width: 100%;">
            <i data-lucide="video"></i> Launch Video Tracker
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Interview Emotion Analyzer</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Monitor facial expressions and vocal coherence ratios to lower filler word counts.</p>
        </div>

        ${displayPanel}
      </div>

      <style>
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes waveGrow {
          0% { height: 10px; }
          100% { height: 60px; }
        }
      </style>
    `;

    window.lucide.createIcons();
  };

  window.toggleEmotionSessionState = function(active) {
    if (active) {
      window.appState.startEmotionAnalysis();
    } else {
      window.appState.stopEmotionAnalysis();
    }
    window.renderEmotionAnalyzerView();
  };
})();
