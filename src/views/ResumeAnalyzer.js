// Premium Resume Analyzer & Career Hub
(function() {
  let activeSubTab = 'resume'; // 'resume', 'linkedin', 'cover-letter'

  window.renderResumeView = function() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const state = window.appState.get();
    const targetRoleData = window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole);
    
    // Sub-Navigation Tabs Menu
    const tabsHtml = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
        <button class="btn ${activeSubTab === 'resume' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setResumeSubTab('resume')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="file-text"></i> Resume Analyzer
        </button>
        <button class="btn ${activeSubTab === 'linkedin' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setResumeSubTab('linkedin')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="linkedin"></i> LinkedIn Audit
        </button>
        <button class="btn ${activeSubTab === 'cover-letter' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setResumeSubTab('cover-letter')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i data-lucide="wand-2"></i> Cover Letter Builder
        </button>
      </div>
    `;

    let activeContentHtml = '';

    if (activeSubTab === 'resume') {
      activeContentHtml = renderResumeAnalyzer(state, targetRoleData);
    } else if (activeSubTab === 'linkedin') {
      activeContentHtml = renderLinkedInAnalyzer(state);
    } else if (activeSubTab === 'cover-letter') {
      activeContentHtml = renderCoverLetterGenerator(state);
    }

    container.innerHTML = `
      <div style="animation: fadeIn var(--transition-normal);">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-family: var(--font-header);">AI Career Coach Hub</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">Optimize your professional profiles and generate customized cover letters.</p>
        </div>

        ${tabsHtml}
        ${activeContentHtml}
      </div>
    `;

    // Rebind Lucide
    window.lucide.createIcons();
    
    // Bind respective events
    bindSubTabEvents(state);
  };

  // Switch Subtabs
  window.setResumeSubTab = function(subTab) {
    activeSubTab = subTab;
    window.renderResumeView();
  };

  // 1. Resume Section Renderer
  function renderResumeAnalyzer(state, targetRoleData) {
    const analysis = state.resumeAnalysis;
    const targetRoleName = targetRoleData ? targetRoleData.name : 'Target Role';

    let resultPanelHtml = '';
    if (analysis) {
      const isGood = analysis.atsScore >= 75;
      resultPanelHtml = `
        <div class="premium-card" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h2 style="font-family: var(--font-header)">ATS Optimization Report</h2>
              <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.2rem;">File: ${analysis.fileName}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="badge ${isGood ? 'badge-success' : 'badge-warning'}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                ATS Score: ${analysis.atsScore}/100
              </span>
            </div>
          </div>

          <div class="grid-container grid-2-col">
            <!-- Strengths and Weaknesses -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <h4 style="font-family: var(--font-header); color: var(--accent-success); display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; margin-bottom: 0.5rem;">
                  <i data-lucide="check-circle-2"></i> Key Strengths
                </h4>
                <ul style="list-style-position: inside; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${analysis.strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              
              <div>
                <h4 style="font-family: var(--font-header); color: var(--accent-danger); display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; margin-bottom: 0.5rem;">
                  <i data-lucide="alert-triangle"></i> Identified Weaknesses
                </h4>
                <ul style="list-style-position: inside; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Suggestions and Skill matches -->
            <div style="display: flex; flex-direction: column; gap: 1rem; background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
              <h4 style="font-family: var(--font-header); color: var(--accent-primary); display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem;">
                <i data-lucide="sparkles"></i> Recommendations for improvement
              </h4>
              <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
                ${analysis.suggestions.map(s => `
                  <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <i data-lucide="arrow-right-circle" style="color: var(--accent-primary); width:16px; height:16px; flex-shrink:0; margin-top: 2px;"></i>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Keywords analysis -->
          <div>
            <h4 style="font-family: var(--font-header); margin-bottom: 0.75rem; font-size: 0.95rem;">Keyword Density for: ${targetRoleName}</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${analysis.matchedSkills.map(s => `
                <span class="badge badge-success" style="gap: 0.3rem;"><i data-lucide="check" style="width: 12px; height: 12px;"></i> ${s}</span>
              `).join('')}
              ${analysis.missedSkills.map(s => `
                <span class="badge badge-danger" style="gap: 0.3rem;"><i data-lucide="x" style="width: 12px; height: 12px;"></i> ${s} (Missing)</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid-container grid-main-side">
        <!-- Input area -->
        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="upload-cloud" style="color: var(--accent-primary)"></i> Resume Scanner
          </h3>
          
          <div id="drag-drop-zone" style="border: 2px dashed var(--border-color); border-radius: var(--border-radius-sm); padding: 2rem; text-align: center; cursor: pointer; transition: border-color 0.3s; margin-bottom: 1.5rem;">
            <i data-lucide="file-up" style="width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
            <div style="font-size: 0.9rem; font-weight: 600;" id="upload-status-text">Click to choose a file (PDF, DOCX)</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Or drag and drop your file here</div>
            <input type="file" id="resume-file-input" style="display: none;" accept=".pdf,.docx,.txt" />
          </div>

          <div class="form-group">
            <label for="resume-paste-text">Or paste your Resume plain text description</label>
            <textarea id="resume-paste-text" class="textarea-field" rows="6" placeholder="Paste work history, summary, skills and accomplishments..."></textarea>
          </div>

          <button id="analyze-resume-btn" class="btn btn-primary" style="width: 100%;">
            <i data-lucide="cpu"></i> Analyze Resume
          </button>
        </div>

        <!-- Explainer Panel -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="premium-card" style="background: rgba(var(--accent-primary-rgb), 0.05);">
            <h3 style="font-family: var(--font-header); margin-bottom: 0.75rem; font-size: 1rem; color: var(--accent-primary);">Why ATS Matching?</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
              90% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter candidate applications before a human recruiter reviews them.
            </p>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); margin-top: 0.5rem;">
              Our AI parses your resume against critical keywords defined for the <b>${targetRoleName}</b> profile.
            </p>
          </div>

          <div class="premium-card">
            <h4 style="font-family: var(--font-header); font-size: 0.9rem; margin-bottom: 0.5rem;">Target Skills to Include:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${targetRoleData ? targetRoleData.skills.map(s => `<span class="badge badge-info">${s}</span>`).join('') : ''}
            </div>
          </div>
        </div>
      </div>

      <div id="resume-report-container">
        ${resultPanelHtml}
      </div>
    `;
  }

  // 2. LinkedIn Auditor Renderer
  function renderLinkedInAnalyzer(state) {
    const analysis = state.linkedinAnalysis;

    let auditResultHtml = '';
    if (analysis) {
      auditResultHtml = `
        <div class="premium-card" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-header)">LinkedIn Audit Scorecard</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem;">Interactive completeness telemetry</p>
            </div>
            <span class="badge ${analysis.score >= 75 ? 'badge-success' : 'badge-warning'}" style="font-size: 1rem; padding: 0.4rem 0.8rem;">
              Audit Score: ${analysis.score}%
            </span>
          </div>

          <div class="grid-container grid-2-col">
            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; color: var(--accent-danger); margin-bottom: 0.5rem;">Missing Sections</h4>
              <ul style="list-style-position: inside; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                ${analysis.missingElements.length === 0 ? `<li>All core sections detected!</li>` : analysis.missingElements.map(e => `<li>${e}</li>`).join('')}
              </ul>
            </div>

            <div>
              <h4 style="font-family: var(--font-header); font-size: 0.9rem; color: var(--accent-primary); margin-bottom: 0.5rem;">Action Items</h4>
              <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
                ${analysis.suggestions.map(s => `
                  <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <i data-lucide="check" style="color: var(--accent-success); width:16px; height:16px; flex-shrink:0; margin-top:2px;"></i>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid-container grid-main-side">
        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="linkedin" style="color: #0077b5"></i> Profile Completeness Auditor
          </h3>
          
          <div class="form-group">
            <label for="li-profile-url">LinkedIn Profile URL</label>
            <input type="url" id="li-profile-url" class="input-field" placeholder="https://linkedin.com/in/yourprofile" />
          </div>

          <div class="form-group">
            <label for="li-about-text">Paste "About" or experience copy-paste dump</label>
            <textarea id="li-about-text" class="textarea-field" rows="6" placeholder="Paste summary headline, about details, or work experience description..."></textarea>
          </div>

          <button id="analyze-linkedin-btn" class="btn btn-primary" style="width: 100%;">
            <i data-lucide="shield-check"></i> Audit Profile
          </button>
        </div>

        <div class="premium-card" style="background: rgba(0, 119, 181, 0.05);">
          <h3 style="font-family: var(--font-header); margin-bottom: 0.5rem; font-size: 1rem; color: #0077b5;">Social Selling Index</h3>
          <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
            Recruiters use LinkedIn to source passive candidates. Profiles with keyword-dense bios, headlines, and matching experiences get 14x more profile views.
          </p>
          <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
            Complete our audit scorecard to optimize your outreach profile.
          </p>
        </div>
      </div>

      <div id="linkedin-report-container">
        ${auditResultHtml}
      </div>
    `;
  }

  // 3. Cover Letter Builder Renderer
  function renderCoverLetterGenerator(state) {
    return `
      <div class="grid-container grid-main-side">
        <div class="premium-card">
          <h3 style="font-family: var(--font-header); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="wand-2" style="color: var(--accent-primary)"></i> AI Cover Letter Builder
          </h3>

          <div class="form-group">
            <label for="cl-role">Job Designation</label>
            <input type="text" id="cl-role" class="input-field" value="${window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole)?.name || ''}" placeholder="e.g., Software Engineering Intern" />
          </div>

          <div class="form-group">
            <label for="cl-company">Target Company</label>
            <input type="text" id="cl-company" class="input-field" value="${state.userProfile.targetCompany}" placeholder="e.g., Google" />
          </div>

          <div class="form-group">
            <label for="cl-jd">Paste Job Requirements / Description</label>
            <textarea id="cl-jd" class="textarea-field" rows="4" placeholder="Paste requirements here (e.g., React, JavaScript, CI/CD experience)..."></textarea>
          </div>

          <div class="form-group">
            <label for="cl-tone">Write Tone</label>
            <select id="cl-tone" class="select-field">
              <option value="professional">Professional & Technical</option>
              <option value="enthusiastic">Enthusiastic & High Growth</option>
              <option value="creative">Creative & Product Oriented</option>
            </select>
          </div>

          <button id="generate-cl-btn" class="btn btn-primary" style="width: 100%;">
            <i data-lucide="cpu"></i> Generate Cover Letter
          </button>
        </div>

        <!-- Generator Output -->
        <div class="premium-card" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-family: var(--font-header); font-size: 1rem;">Generated Result</h3>
            <button id="copy-cl-btn" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" disabled>
              <i data-lucide="copy"></i> Copy
            </button>
          </div>
          
          <textarea id="cl-output-text" class="textarea-field" rows="12" style="font-family: monospace; font-size: 0.8rem;" readonly placeholder="Cover letter will display here after you click generate..."></textarea>
        </div>
      </div>
    `;
  }

  // Bind sub-navigation events
  function bindSubTabEvents(state) {
    if (activeSubTab === 'resume') {
      const fileZone = document.getElementById('drag-drop-zone');
      const fileInput = document.getElementById('resume-file-input');
      const statusText = document.getElementById('upload-status-text');

      if (fileZone && fileInput) {
        fileZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            const file = e.target.files[0];
            statusText.innerText = `File Selected: ${file.name}`;
            window.selectedResumeFile = file.name;
          }
        });
      }

      const analyzeBtn = document.getElementById('analyze-resume-btn');
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
          const pasteText = document.getElementById('resume-paste-text').value;
          const fileName = window.selectedResumeFile || 'custom_resume.txt';
          
          if (!pasteText && !window.selectedResumeFile) {
            window.appState.addNotification('Parsing Error', 'Please choose a file or paste resume details.');
            return;
          }

          analyzeBtn.disabled = true;
          analyzeBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Reading Resume...';
          window.lucide.createIcons();

          setTimeout(() => {
            window.appState.analyzeResume(fileName, pasteText || 'React developer, Javascript, Git, CGPA 8.5');
            window.renderResumeView();
          }, 1500);
        });
      }
    }

    if (activeSubTab === 'linkedin') {
      const analyzeLiBtn = document.getElementById('analyze-linkedin-btn');
      if (analyzeLiBtn) {
        analyzeLiBtn.addEventListener('click', () => {
          const profileUrl = document.getElementById('li-profile-url').value;
          const details = document.getElementById('li-about-text').value;

          if (!details) {
            window.appState.addNotification('Auditor Error', 'Please paste profile overview details.');
            return;
          }

          analyzeLiBtn.disabled = true;
          analyzeLiBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Auditing...';
          window.lucide.createIcons();

          setTimeout(() => {
            window.appState.analyzeLinkedIn(profileUrl, details);
            window.renderResumeView();
          }, 1200);
        });
      }
    }

    if (activeSubTab === 'cover-letter') {
      const generateBtn = document.getElementById('generate-cl-btn');
      const copyBtn = document.getElementById('copy-cl-btn');
      const outputText = document.getElementById('cl-output-text');

      if (generateBtn && outputText) {
        generateBtn.addEventListener('click', () => {
          const role = document.getElementById('cl-role').value || 'Software Engineer';
          const company = document.getElementById('cl-company').value || 'Target Company';
          const jd = document.getElementById('cl-jd').value;
          const tone = document.getElementById('cl-tone').value;

          generateBtn.disabled = true;
          generateBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Generating Cover Letter...';
          window.lucide.createIcons();

          setTimeout(() => {
            const skills = state.userProfile.skills.join(', ');
            let letter = `Dear Hiring Manager at ${company},

I am writing to express my enthusiastic interest in the ${role} position. With an academic CGPA of ${state.userProfile.cgpa} and hands-on capability in ${skills}, I am excited about the opportunity to contribute to your engineering goals.

`;
            if (tone === 'professional') {
              letter += `My technical roadmap is aligned with production standards. Having built projects and practiced algorithmic logic, I am confident in my capacity to write maintainable code and integrate with your technology stack. Specifically, your requirement for "${jd.substring(0, 50) || 'industry standards'}" aligns perfectly with my project experience.`;
            } else if (tone === 'enthusiastic') {
              letter += `I thrive in fast-paced environments where innovation is the core. I am constantly expanding my skillset, as evidenced by my learning consistency tracker. Joining ${company} represents a massive milestone where my energy, adaptability, and base skills in ${skills} can be fully leveraged.`;
            } else {
              letter += `I enjoy translating product concepts into functional code. Having designed dashboard applications and simulated user flows, I bring a unique combination of logical architecture and UX empathy, perfectly suiting the creative requirements of this role.`;
            }

            letter += `\n\nThank you for your time and consideration. I look forward to discussing how my background aligns with ${company}'s targets.

Sincerely,
${state.userProfile.name}
Phone: (Simulated Candidate Info)`;

            outputText.value = letter;
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i data-lucide="cpu"></i> Generate Cover Letter';
            copyBtn.disabled = false;
            window.lucide.createIcons();
          }, 1500);
        });
      }

      if (copyBtn && outputText) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(outputText.value);
          window.appState.addNotification('Copied', 'Cover letter copied to clipboard!');
        });
      }
    }
  }
})();
