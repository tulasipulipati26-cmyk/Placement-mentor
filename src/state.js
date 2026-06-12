// Premium Global State Management Core (Observer Pattern)
(function() {
  const LISTENERS = [];

  // Generate simulated heatmap data for past 14 weeks (98 days)
  function generateMockHeatmap() {
    const data = [];
    const seed = [0, 0, 1, 0, 2, 0, 1, 3, 0, 4, 1, 2, 0, 0, 1, 3, 2, 0, 1];
    for (let i = 0; i < 98; i++) {
      const val = seed[Math.floor(Math.random() * seed.length)];
      data.push({
        day: i,
        level: val,
        date: new Date(Date.now() - (97 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    return data;
  }

  // Define initial state
  const state = {
    theme: localStorage.getItem('app-theme') || 'dark-theme',
    activeTab: 'dashboard',
    
    // User profile configurations
    userProfile: {
      name: 'Aarav Sharma',
      cgpa: 8.4,
      targetRole: 'frontend',
      skills: ['HTML/CSS', 'JavaScript', 'Git'],
      targetCompany: 'Google',
      streak: 6,
      avatarInitials: 'AS'
    },

    // Daily Challenges
    dailyChallenges: [
      { id: 'dc1', title: 'Code Challenge', desc: 'Implement bubble sort and state its time complexity.', pts: 15, done: false },
      { id: 'dc2', title: 'Aptitude Question', desc: 'Solve: A train passes a platform in 20s. What is its length?', pts: 10, done: false }
    ],

    // Heatmap data representing study sessions
    studyHeatmap: generateMockHeatmap(),

    // Notifications
    notifications: [
      { id: 'n1', title: 'Welcome to AI Placement Mentor!', message: 'Complete your profile setup and analyze your resume to get started.', read: false, time: 'Just now' },
      { id: 'n2', title: 'Daily Challenge Available', message: 'Improve your streak by completing today\'s challenges.', read: false, time: '2 hours ago' }
    ],

    // Placement Readiness Metrics
    readinessScore: 35,

    // Submodules records
    resumeAnalysis: null,
    linkedinAnalysis: null,
    mockInterviews: [],
    testHistory: [],
    weaknessTracker: {
      'Quantitative Aptitude': 1,
      'Logical Reasoning': 0,
      'Data Structures': 1,
      'System Design': 2,
      'Coding Logic': 0
    },

    // --- NEW ENHANCED MODULE STATES ---
    smartApplications: [
      { id: 'app_1', role: 'Frontend Developer Intern', company: 'Google', stage: 'Interviewing', date: '2026-06-10' },
      { id: 'app_2', role: 'Junior Engineer', company: 'TCS Digital', stage: 'Applied', date: '2026-06-12' }
    ],

    dreamCompanies: [
      { id: 'dc_1', companyId: 'c1', name: 'Google', targetDate: '2026-08-30', stage: 'Online Assessment Prep' },
      { id: 'dc_2', companyId: 'c2', name: 'Microsoft', targetDate: '2026-09-15', stage: 'Resume Screening' }
    ],

    battle: {
      active: false,
      questionIndex: 0,
      userScore: 0,
      rivalScore: 0,
      status: 'idle', // 'idle', 'ongoing', 'ended'
      rivalProgress: 0,
      userSelectedOption: null,
      history: []
    },

    resumeJdMatch: null,

    emotionSession: {
      active: false,
      currentEmotion: 'Confident',
      fillers: 0,
      timer: 0
    },

    predictorResult: null,

    // Career Success Simulator state
    simulator: {
      stage: 'not-started',
      company: null,
      score: 0,
      log: []
    },

    // Admin Telemetry Panel Mock Info
    admin: {
      students: [
        { name: 'Aarav Sharma', cgpa: 8.4, target: 'Frontend Dev', score: 35, status: 'Preparing' },
        { name: 'Priya Patel', cgpa: 9.1, target: 'Data Scientist', score: 82, status: 'Placed (Microsoft)' },
        { name: 'Rohan Sen', cgpa: 7.8, target: 'Backend Dev', score: 58, status: 'Interviewing' },
        { name: 'Ananya Roy', cgpa: 8.9, target: 'Product Manager', score: 71, status: 'Placed (Google)' }
      ],
      customTests: [
        { title: 'System Design Crash Test', questionsCount: 5, createdBy: 'Admin' }
      ]
    }
  };

  // Pub-Sub Implementation
  window.appState = {
    // Getters
    get: () => state,

    // Subscription
    subscribe: (callback) => {
      LISTENERS.push(callback);
      callback(state);
      return () => {
        const index = LISTENERS.indexOf(callback);
        if (index > -1) LISTENERS.splice(index, 1);
      };
    },

    // Notify listeners of changes
    notify: () => {
      window.appState.calculateReadinessScore();
      LISTENERS.forEach(cb => cb(state));
    },

    // Actions
    setTab: (tabName) => {
      state.activeTab = tabName;
      window.appState.notify();
    },

    toggleTheme: () => {
      state.theme = state.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
      localStorage.setItem('app-theme', state.theme);
      document.body.className = state.theme;
      window.appState.notify();
    },

    updateProfile: (updates) => {
      state.userProfile = { ...state.userProfile, ...updates };
      window.appState.addNotification('Profile Updated', 'Your profile details and target choices have been updated.');
      window.appState.notify();
    },

    addNotification: (title, message) => {
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        title,
        message,
        read: false,
        time: 'Just now'
      });
      window.appState.notify();
      
      if (window.showToast) {
        window.showToast(title, message);
      }
    },

    markNotificationsRead: () => {
      state.notifications.forEach(n => n.read = true);
      window.appState.notify();
    },

    completeChallenge: (challengeId) => {
      const challenge = state.dailyChallenges.find(c => c.id === challengeId);
      if (challenge && !challenge.done) {
        challenge.done = true;
        state.userProfile.streak += 1;
        
        const emptyCell = state.studyHeatmap.find(c => c.level === 0);
        if (emptyCell) emptyCell.level = 2;

        window.appState.addNotification('Challenge Complete!', `Streak is now ${state.userProfile.streak} days.`);
        
        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        }
        window.appState.notify();
      }
    },

    // --- ENHANCED MODULE ACTIONS ---

    // 1. Smart Application Tracker
    addSmartApplication: (company, role, stage) => {
      state.smartApplications.push({
        id: 'app_' + Date.now(),
        company,
        role,
        stage,
        date: new Date().toLocaleDateString()
      });
      window.appState.addNotification('Application Logged', `Tracked ${role} at ${company}.`);
      window.appState.notify();
    },

    updateSmartApplicationStage: (appId, newStage) => {
      const app = state.smartApplications.find(a => a.id === appId);
      if (app) {
        app.stage = newStage;
        window.appState.addNotification('Application Moved', `${app.company} application stage: ${newStage}.`);
        window.appState.notify();
      }
    },

    // 2. Dream Company Tracker
    addDreamCompany: (companyId, targetDate) => {
      const comp = window.mockData.companies.find(c => c.id === companyId);
      if (!comp) return;
      state.dreamCompanies.push({
        id: 'dc_' + Date.now(),
        companyId,
        name: comp.name,
        targetDate,
        stage: 'Initial Contact / Review'
      });
      window.appState.addNotification('Watchlist Updated', `Monitoring hiring timeline for ${comp.name}.`);
      window.appState.notify();
    },

    removeDreamCompany: (id) => {
      state.dreamCompanies = state.dreamCompanies.filter(d => d.id !== id);
      window.appState.notify();
    },

    updateDreamCompanyStage: (id, stage) => {
      const d = state.dreamCompanies.find(dc => dc.id === id);
      if (d) {
        d.stage = stage;
        window.appState.notify();
      }
    },

    // 3. Resume vs JD Matching
    analyzeResumeVsJd: (resumeText, jdText) => {
      let match = 50;
      const missingKeywords = [];
      const foundKeywords = [];
      
      const roleData = window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole);
      const targetSkills = roleData ? roleData.skills : ['JavaScript', 'HTML/CSS', 'Git', 'APIs'];

      targetSkills.forEach(skill => {
        const lowerSkill = skill.toLowerCase();
        const inJd = jdText.toLowerCase().includes(lowerSkill);
        const inResume = resumeText.toLowerCase().includes(lowerSkill);

        if (inJd) {
          if (inResume) {
            match += 10;
            foundKeywords.push(skill);
          } else {
            missingKeywords.push(skill);
          }
        }
      });

      match = Math.min(Math.max(match, 35), 98);

      state.resumeJdMatch = {
        score: match,
        foundKeywords,
        missingKeywords,
        suggestions: [
          `Embed missing phrases: ${missingKeywords.slice(0, 3).join(', ')} directly inside your project experience listings.`,
          'Quantify actions: outline numeric impacts (e.g., speed increases, throughput metrics).',
          'Use bulleted standard formatting to avoid parser confusion.'
        ]
      };
      
      window.appState.addNotification('Resume vs JD Scored', `Match index is ${match}%.`);
      window.appState.notify();
    },

    // 4. Enhanced Success Predictor
    runEnhancedPredictor: (cgpa, apt, coding, comm, projectsCount, internshipsCount, selectedSkills, targetCompanyId) => {
      const targetCompany = window.mockData.companies.find(c => c.id === targetCompanyId) || window.mockData.companies[0];
      
      // Heuristic calculations
      const cgpaWeight = (cgpa / 10) * 30; // Max 30
      const skillsWeight = Math.min((selectedSkills.length / 8) * 20, 20); // Max 20
      const aptWeight = (apt / 100) * 15; // Max 15
      const codingWeight = (coding / 100) * 20; // Max 20
      const commWeight = (comm / 5) * 15; // Max 15
      
      const projectsBonus = projectsCount * 4; // Max 8
      const internshipsBonus = internshipsCount * 6; // Max 12

      let probability = Math.round(cgpaWeight + skillsWeight + aptWeight + codingWeight + commWeight + projectsBonus + internshipsBonus);
      probability = Math.min(Math.max(probability, 30), 99);

      // Readiness calculation breakdown
      const readiness = Math.round((cgpaWeight * 1.2) + skillsWeight + aptWeight + codingWeight + commWeight);
      const capReadiness = Math.min(readiness, 100);

      // Setup Strengths, Weaknesses, Risks
      const strengths = [];
      const weaknesses = [];
      const risks = [];
      const suggestions = [];

      if (cgpa >= 8.5) strengths.push('Outstanding Academic Standing (CGPA > 8.5) keeps you eligible for FAANG level filters.');
      else if (cgpa < 7.5) risks.push('Academic Filter Risk: CGPA below 7.5 might lock you out of Tier-1 recruitment panels.');

      if (coding >= 75) strengths.push('Strong Data Structures syntax and algorithmic accuracy.');
      else {
        weaknesses.push('Algorithmic accuracy under pressure needs optimization.');
        suggestions.push('Practice at least 2 medium-level Leetcode problems daily to optimize execution speeds.');
      }

      if (comm >= 4) strengths.push('Coherent verbal articulation and STAR framing competency.');
      else {
        weaknesses.push('Interview answering confidence is conversational but lacks structural focus.');
        suggestions.push('Complete 2 technical Mock Interviews using STAR (Situation, Task, Action, Result) templates.');
      }

      if (selectedSkills.length < 5) {
        weaknesses.push('Critical skillset gaps logged against target roles.');
        suggestions.push('Refer to the Career GPS view to identify required tech stacks.');
      }

      if (projectsCount === 0) {
        risks.push('Zero production-grade projects listed.');
        suggestions.push('Generate a new custom blueprint utilizing the AI Project Generator.');
      }

      // Radar metrics calculation coordinates (values 0-100)
      const radarMetrics = {
        dsa: Math.round(coding),
        sysDesign: Math.round(selectedSkills.length * 12.5),
        comm: Math.round(comm * 20),
        apt: Math.round(apt),
        projects: Math.round(Math.min(projectsCount * 40, 100)),
        academics: Math.round(cgpa * 10)
      };

      state.predictorResult = {
        probability,
        readiness: capReadiness,
        strengths: strengths.length > 0 ? strengths : ['Basic domain foundations.'],
        weaknesses: weaknesses.length > 0 ? weaknesses : ['No major skill weaknesses logged.'],
        risks: risks.length > 0 ? risks : ['Zero high-risk criteria items logged.'],
        suggestions: suggestions.length > 0 ? suggestions : ['Keep practicing timed skill assessments.'],
        radarMetrics,
        company: targetCompany.name
      };

      window.appState.addNotification('Prediction Finished', `Computed success chance: ${probability}%.`);
      window.appState.notify();
    },

    // 5. Battle Mode Engine
    startBattle: () => {
      state.battle.active = true;
      state.battle.questionIndex = 0;
      state.battle.userScore = 0;
      state.battle.rivalScore = 0;
      state.battle.rivalProgress = 0;
      state.battle.userSelectedOption = null;
      state.battle.status = 'ongoing';
      window.appState.notify();

      // Launch automated rival progress loop
      clearInterval(window.rivalBattleTimer);
      window.rivalBattleTimer = setInterval(() => {
        const st = state.battle;
        if (st.status !== 'ongoing') {
          clearInterval(window.rivalBattleTimer);
          return;
        }

        // Rival slowly advances progress
        st.rivalProgress += Math.floor(Math.random() * 8) + 4;
        if (st.rivalProgress >= 100) {
          // Rival answers first!
          st.rivalProgress = 0;
          st.rivalScore += Math.floor(Math.random() * 20) + 70;
          
          window.appState.addNotification('Rival Alert', 'Your rival answered the current question!');
          window.appState.advanceBattleQuestion();
        }
        window.appState.notify();
      }, 800);
    },

    submitBattleAnswer: (optionIndex) => {
      const st = state.battle;
      if (st.status !== 'ongoing') return;

      const q = window.mockData.battleQuestions[st.questionIndex];
      st.userSelectedOption = optionIndex;
      st.rivalProgress = 0; // reset speed

      if (optionIndex === q.correct) {
        st.userScore += q.points;
        window.appState.addNotification('Correct Answer!', `Earned +${q.points} battle points.`);
      } else {
        window.appState.addNotification('Incorrect Answer', 'That option is wrong.');
      }

      setTimeout(() => {
        window.appState.advanceBattleQuestion();
      }, 1000);
    },

    advanceBattleQuestion: () => {
      const st = state.battle;
      st.userSelectedOption = null;
      
      if (st.questionIndex < window.mockData.battleQuestions.length - 1) {
        st.questionIndex++;
      } else {
        // End Battle
        st.status = 'ended';
        st.active = false;
        clearInterval(window.rivalBattleTimer);
        
        const userWon = st.userScore >= st.rivalScore;
        window.appState.addNotification(
          userWon ? 'Victory!' : 'Defeat!', 
          userWon ? 'You outscored your peer in the arena!' : 'Your rival solved questions faster.'
        );

        if (userWon) {
          state.userProfile.streak += 1;
          if (window.confetti) window.confetti({ particleCount: 120 });
        }
        
        st.history.unshift({
          date: new Date().toLocaleDateString(),
          user: st.userScore,
          rival: st.rivalScore,
          outcome: userWon ? 'Won' : 'Lost'
        });
      }
      window.appState.notify();
    },

    stopBattle: () => {
      state.battle.status = 'idle';
      state.battle.active = false;
      clearInterval(window.rivalBattleTimer);
      window.appState.notify();
    },

    // 6. Camera Mock Emotion Analyzer
    startEmotionAnalysis: () => {
      state.emotionSession.active = true;
      state.emotionSession.fillers = 0;
      state.emotionSession.currentEmotion = 'Confident';
      state.emotionSession.timer = 0;
      window.appState.notify();

      clearInterval(window.emotionSessionInterval);
      window.emotionSessionInterval = setInterval(() => {
        const sess = state.emotionSession;
        if (!sess.active) {
          clearInterval(window.emotionSessionInterval);
          return;
        }

        sess.timer++;
        
        // Randomly simulate vocal fillers and emotions
        const emotions = ['Confident', 'Neutral', 'Hesitant', 'Nervous'];
        if (Math.random() < 0.25) {
          sess.currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        }
        if (Math.random() < 0.15) {
          sess.fillers++;
        }
        
        window.appState.notify();
      }, 1000);
    },

    stopEmotionAnalysis: () => {
      state.emotionSession.active = false;
      clearInterval(window.emotionSessionInterval);
      window.appState.notify();
    },

    // Standard calculations
    calculateReadinessScore: () => {
      const cgpaVal = parseFloat(state.userProfile.cgpa) || 7.0;
      const cgpaScore = Math.round((cgpaVal / 10) * 35);

      const targetRoleData = window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole);
      let skillScore = 5;
      if (targetRoleData) {
        const matches = state.userProfile.skills.filter(s => targetRoleData.skills.includes(s)).length;
        skillScore = Math.min(Math.round((matches / targetRoleData.skills.length) * 25), 25);
      }

      const resumeScore = state.resumeAnalysis ? Math.round((state.resumeAnalysis.atsScore / 100) * 15) : 0;
      const testScore = state.testHistory.length > 0 ? Math.min(state.testHistory.length * 5, 15) : 0;
      const interviewScore = state.mockInterviews.length > 0 ? 10 : 0;

      const finalScore = cgpaScore + skillScore + resumeScore + testScore + interviewScore;
      state.readinessScore = Math.min(finalScore, 100);
    },

    // AI SIMULATORS
    
    // Resume ATS Analyzer
    analyzeResume: (fileName, textSnippet) => {
      let score = 55;
      const keywords = window.mockData.targetRoles.find(r => r.id === state.userProfile.targetRole)?.skills || [];
      const matched = [];
      const missed = [];

      keywords.forEach(skill => {
        if (textSnippet.toLowerCase().includes(skill.toLowerCase())) {
          score += 6;
          matched.push(skill);
        } else {
          missed.push(skill);
        }
      });

      score = Math.min(Math.max(score, 40), 98);

      const strengths = [];
      const weaknesses = [];
      const suggestions = [];

      if (score > 75) {
        strengths.push('Excellent keyword alignment with target role.', 'Clean structural layout.', 'Solid demonstration of core technologies.');
      } else {
        strengths.push('Standard formatting and structure.', 'Clear contact and background details.');
      }

      if (missed.length > 0) {
        weaknesses.push(`Missing critical technical skills: ${missed.slice(0, 3).join(', ')}.`);
        suggestions.push(`Integrate missing keywords: ${missed.join(', ')} into your experience statements.`);
      }

      if (!textSnippet.match(/\d+%/g) && !textSnippet.match(/\$\d+/g)) {
        weaknesses.push('Lacks quantified accomplishments and metrics.');
        suggestions.push('Express experiences in terms of metrics (e.g., "Improved load time by 30%").');
      }

      suggestions.push('Format section headers using standard tags (Experience, Projects, Education).');

      state.resumeAnalysis = {
        fileName,
        atsScore: score,
        strengths,
        weaknesses,
        suggestions,
        matchedSkills: matched,
        missedSkills: missed
      };

      matched.forEach(skill => {
        if (!state.userProfile.skills.includes(skill)) {
          state.userProfile.skills.push(skill);
        }
      });

      window.appState.addNotification('Resume Analyzed', `ATS Score: ${score}/100. Target suggestions generated!`);
      window.appState.notify();
    },

    // LinkedIn Analyzer
    analyzeLinkedIn: (profileUrl, textInput) => {
      let score = 50;
      if (textInput.length > 300) score += 15;
      if (textInput.toLowerCase().includes('experience') || textInput.toLowerCase().includes('worked')) score += 15;
      if (textInput.toLowerCase().includes('education')) score += 10;
      
      const missingElements = [];
      if (!textInput.toLowerCase().includes('headline')) missingElements.push('Keyword-rich Profile Headline');
      if (!textInput.toLowerCase().includes('about') && !textInput.toLowerCase().includes('summary')) missingElements.push('Professional Summary / About Section');
      if (!textInput.toLowerCase().includes('recommendation')) missingElements.push('Peer or Supervisor Recommendations');

      state.linkedinAnalysis = {
        score: Math.min(score, 98),
        missingElements,
        suggestions: [
          'Add a compelling banner representing your technical interest.',
          'Optimize your Headline to include your target role: e.g., "Aspiring Frontend Developer | React | Open Source"',
          'List at least 5 core skills in your endorsement section.'
        ]
      };

      window.appState.addNotification('LinkedIn Profile Analyzed', `LinkedIn Score: ${state.linkedinAnalysis.score}%`);
      window.appState.notify();
    },

    // AI Mock Interview Answer Evaluator
    submitInterviewAnswer: (questionId, questionText, answerText) => {
      const question = window.mockData.interviewQuestions.find(q => q.id === questionId);
      let score = 40;
      const matchedKeywords = [];

      if (answerText.trim().length > 25) {
        score += 15;
      }
      if (answerText.trim().length > 80) {
        score += 10;
      }

      if (question && question.answerKeywords) {
        question.answerKeywords.forEach(kw => {
          if (answerText.toLowerCase().includes(kw.toLowerCase())) {
            score += 6;
            matchedKeywords.push(kw);
          }
        });
      }

      score = Math.min(score, 95);
      
      let confidenceScore = 65;
      if (answerText.toLowerCase().includes('um') || answerText.toLowerCase().includes('like') || answerText.toLowerCase().includes('maybe')) {
        confidenceScore -= 15;
      }
      if (answerText.length > 100) {
        confidenceScore += 10;
      }

      const feedback = [];
      if (matchedKeywords.length >= 3) {
        feedback.push('Solid structural framing. You covered core technical/conceptual keywords.');
      } else {
        feedback.push('Answer lacks specific technical depth or contextual details.');
      }

      if (answerText.length < 50) {
        feedback.push('Response is too brief. Try to structure your answers using the STAR method (Situation, Task, Action, Result).');
      }

      const result = {
        questionText,
        userAnswer: answerText,
        score,
        confidence: confidenceScore,
        feedback: feedback.join(' '),
        date: new Date().toLocaleDateString()
      };

      state.mockInterviews.unshift(result);
      
      if (score < 60) {
        state.weaknessTracker['Coding Logic'] = (state.weaknessTracker['Coding Logic'] || 0) + 1;
      }

      window.appState.addNotification('Mock Interview Response Evaluated', `Question score: ${score}%`);
      window.appState.notify();
    },

    // Save test result
    saveTestScore: (testId, scorePercentage, durationSpent) => {
      const test = window.mockData.tests.find(t => t.id === testId);
      state.testHistory.unshift({
        title: test ? test.title : 'General Aptitude Test',
        score: scorePercentage,
        timeSpent: durationSpent,
        date: new Date().toLocaleDateString()
      });

      if (scorePercentage < 65) {
        state.weaknessTracker['Quantitative Aptitude'] = (state.weaknessTracker['Quantitative Aptitude'] || 0) + 1;
      }

      const emptyCell = state.studyHeatmap.find(c => c.level === 0);
      if (emptyCell) emptyCell.level = 3;

      window.appState.addNotification('Test Submitted', `Scored: ${scorePercentage}% in ${test.title}`);
      window.appState.notify();
    },

    // Placement Success Simulator rounds
    startSimulator: (companyId) => {
      const company = window.mockData.companies.find(c => c.id === companyId);
      state.simulator = {
        stage: 'resume-round',
        company: company,
        score: 0,
        log: [`Started placement simulation for ${company.name}.`, `Round 1: Resume screening initialized.`]
      };
      window.appState.notify();
    },

    advanceSimulatorRound: (userActionIndex) => {
      const sim = state.simulator;
      if (!sim.company) return;

      if (sim.stage === 'resume-round') {
        const ats = state.resumeAnalysis ? state.resumeAnalysis.atsScore : 50;
        if (ats >= 70 || userActionIndex === 1) {
          sim.stage = 'test-round';
          sim.score += 25;
          sim.log.push('Resume passed screening successfully!', 'Round 2: Online Aptitude & Coding Test.');
        } else {
          sim.stage = 'rejected';
          sim.log.push('Resume rejected due to low ATS match. Tip: Update your resume in the AI Resume Analyzer.');
        }
      } else if (sim.stage === 'test-round') {
        if (userActionIndex === 0) {
          sim.stage = 'interview-round';
          sim.score += 35;
          sim.log.push('Passed Online Test with a score of 85%!', 'Round 3: Final Technical & HR Interview.');
        } else if (userActionIndex === 1) {
          sim.stage = 'rejected';
          sim.log.push('Failed test round due to insufficient speed and timing.');
        }
      } else if (sim.stage === 'interview-round') {
        if (userActionIndex === 0) {
          sim.stage = 'offered';
          sim.score += 40;
          sim.log.push('Interviewers loved your project depth and structural speaking!', `Congratulations! You received an offer from ${sim.company.name}!`);
          
          if (window.confetti) {
            window.confetti({ particleCount: 150, spread: 80 });
          }
        } else {
          sim.stage = 'rejected';
          sim.log.push('Failed final round. Interviewers noted lack of depth in system architectural projects.');
        }
      }
      window.appState.notify();
    },

    resetSimulator: () => {
      state.simulator = {
        stage: 'not-started',
        company: null,
        score: 0,
        log: []
      };
      window.appState.notify();
    },

    // Admin commands
    addAdminTest: (title, count) => {
      state.admin.customTests.push({ title, questionsCount: count, createdBy: 'You' });
      window.appState.addNotification('Test Created', `Admin test "${title}" added successfully.`);
      window.appState.notify();
    },

    deleteAdminStudent: (index) => {
      state.admin.students.splice(index, 1);
      window.appState.notify();
    }
  };

  // Run initial score calculation
  window.appState.calculateReadinessScore();
})();
