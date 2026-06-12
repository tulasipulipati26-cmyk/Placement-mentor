// Unified Local Data Store for AI Placement Mentor
window.mockData = {
  // Available target roles for students
  targetRoles: [
    { id: 'frontend', name: 'Frontend Developer', skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Web Security', 'Git', 'System Design'] },
    { id: 'backend', name: 'Backend Developer', skills: ['Python', 'Node.js', 'SQL/NoSQL', 'System Design', 'APIs', 'Docker', 'Git', 'Data Structures'] },
    { id: 'data-scientist', name: 'Data Scientist', skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Pandas/NumPy', 'Data Visualization'] },
    { id: 'product-manager', name: 'Product Manager', skills: ['Product Strategy', 'Agile/Scrum', 'Analytics', 'UX Fundamentals', 'Market Research', 'Communication'] }
  ],

  // Interview Questions Bank
  interviewQuestions: [
    { id: 'q1', type: 'HR', category: 'Behavioral', question: 'Tell me about a time you faced a conflict in a team and how you resolved it.', answerKeywords: ['team', 'conflict', 'resolved', 'communication', 'listener', 'compromise'] },
    { id: 'q2', type: 'HR', category: 'General', question: 'Why do you want to join our company, and what makes you a good fit?', answerKeywords: ['culture', 'growth', 'alignment', 'skills', 'innovative', 'contribution'] },
    { id: 'q3', type: 'HR', category: 'Situational', question: 'Describe your greatest professional or academic accomplishment.', answerKeywords: ['achieved', 'leadership', 'result', 'metric', 'challenge', 'success'] },
    { id: 'q4', type: 'Technical', category: 'JavaScript', question: 'Explain the difference between double equals (==) and triple equals (===) in JavaScript.', answerKeywords: ['coercion', 'type', 'strict', 'comparison', 'value'] },
    { id: 'q5', type: 'Technical', category: 'Python', question: 'What are list comprehensions in Python and how do you use them?', answerKeywords: ['syntactic', 'sugar', 'loop', 'expression', 'iterable', 'readable'] },
    { id: 'q6', type: 'Technical', category: 'SQL', question: 'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?', answerKeywords: ['matching', 'records', 'nulls', 'left table', 'right table', 'intersection'] },
    { id: 'q7', type: 'Technical', category: 'Data Structures', question: 'How does a Hash Table resolve collisions internally?', answerKeywords: ['chaining', 'linked list', 'open addressing', 'linear probing', 'hash function'] }
  ],

  // Mock Aptitude & Coding Tests
  tests: [
    {
      id: 'aptitude-1',
      title: 'Quantitative & Logical Reasoning Speedrun',
      duration: 300,
      questions: [
        {
          id: 'aq1',
          question: 'A train 120 meters long passes a telegraph post in 6 seconds. Find the speed of the train in km/hr.',
          options: ['60 km/hr', '72 km/hr', '80 km/hr', '90 km/hr'],
          correct: 1
        },
        {
          id: 'aq2',
          question: 'If A is B\'s brother, B is C\'s sister, and C is D\'s father, how is A related to D?',
          options: ['Brother', 'Cousin', 'Uncle', 'Grandfather'],
          correct: 2
        },
        {
          id: 'aq3',
          question: 'What is the missing number in the series: 3, 8, 15, 24, 35, ?',
          options: ['44', '46', '48', '50'],
          correct: 2
        }
      ]
    },
    {
      id: 'coding-1',
      title: 'Core DSA Challenge (JS/Python Syntax)',
      duration: 600,
      questions: [
        {
          id: 'cq1',
          question: 'Write a function to return the longest word in a string sentence. e.g., "The quick brown fox" -> "quick". Select the correct JS syntax.',
          options: [
            'str.split(" ").reduce((a, b) => a.length > b.length ? a : b)',
            'str.split(" ").sort((a,b) => a - b)[0]',
            'str.findLongestWord()',
            'Math.max(str.split(" "))'
          ],
          correct: 0
        },
        {
          id: 'cq2',
          question: 'Which of the following sorting algorithms has the best worst-case time complexity?',
          options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'],
          correct: 3
        }
      ]
    }
  ],

  // Company Insights
  companies: [
    {
      id: 'c1',
      name: 'Google',
      difficulty: 'Hard',
      rounds: ['Resume Screening', 'Technical Phone Screen', '3-4 Coding Rounds (DSA/System Design)', 'Googliness & Leadership'],
      hiringRate: '0.2%',
      frequentlyAsked: [
        'Design a rate limiter for an API endpoint.',
        'Given a binary tree, find the maximum path sum between any two nodes.',
        'Implement a priority queue using a binary heap.'
      ],
      insights: 'Focus deeply on algorithmic complexity, optimization, and edge case testing. Communication during coding is heavily evaluated.'
    },
    {
      id: 'c2',
      name: 'Microsoft',
      difficulty: 'Hard',
      rounds: ['Online Coding Test', 'Technical Interview 1 (DSA)', 'Technical Interview 2 (System Design)', 'As Appropriate (Managerial)'],
      hiringRate: '1.5%',
      frequentlyAsked: [
        'Reverse a linked list in blocks of size K.',
        'Design a system like TinyURL.',
        'Explain virtual memory and page tables.'
      ],
      insights: 'Prefers candidates with strong fundamental knowledge of operating systems, system architecture, and robust coding principles.'
    },
    {
      id: 'c3',
      name: 'TCS Digital',
      difficulty: 'Medium',
      rounds: ['National Qualifier Test (NQT)', 'Technical Interview', 'HR Interview'],
      hiringRate: '15%',
      frequentlyAsked: [
        'Check if two strings are anagrams of each other.',
        'Explain Object Oriented Programming (OOP) concepts with real-world examples.',
        'What is a primary key vs foreign key?'
      ],
      insights: 'Excelling in the NQT exam is crucial. Strong foundational coding skills, aptitude speed, and good communication will secure the offer.'
    }
  ],

  // Job recommendations
  jobs: [
    { id: 'j1', role: 'frontend', title: 'Associate Frontend Engineer', company: 'TechNova Solutions', type: 'Full-Time', location: 'Remote', package: '$85,000 / year', readinessRequired: 65, link: '#' },
    { id: 'j2', role: 'frontend', title: 'React Developer Intern', company: 'PixelCraft Studio', type: 'Internship', location: 'New York, NY', stipend: '$2,500 / month', readinessRequired: 40, link: '#' },
    { id: 'j3', role: 'backend', title: 'Junior Cloud Developer', company: 'Nimbus Systems', type: 'Full-Time', location: 'Seattle, WA', package: '$95,000 / year', readinessRequired: 70, link: '#' },
    { id: 'j4', role: 'data-scientist', title: 'Junior ML Engineer', company: 'Cognitive AI', type: 'Full-Time', location: 'San Francisco, CA', package: '$105,000 / year', readinessRequired: 80, link: '#' },
    { id: 'j5', role: 'product-manager', title: 'Associate Product Manager', company: 'ScaleUp Labs', type: 'Full-Time', location: 'Austin, TX', package: '$90,000 / year', readinessRequired: 60, link: '#' }
  ],

  // Project Gaps
  projectRecommendations: [
    { role: 'frontend', title: 'Portfolio Builder with API Integrations', diff: 'Intermediate', time: '2 Weeks', skillsAdded: ['React', 'APIs', 'Web Security'], desc: 'Build an interactive dashboard consuming third-party REST APIs, with complete security token validation and data persistence.' },
    { role: 'backend', title: 'Microservice API Gateway', diff: 'Advanced', time: '3 Weeks', skillsAdded: ['Docker', 'Node.js', 'System Design'], desc: 'Design an API Gateway routing requests to multiple Node.js backend microservices, featuring rate limiting and token authentication.' },
    { role: 'data-scientist', title: 'E-Commerce Recommendation Engine', diff: 'Advanced', time: '4 Weeks', skillsAdded: ['Python', 'Machine Learning', 'Pandas/NumPy'], desc: 'Implement a collaborative filtering system using pandas and scikit-learn, generating real-time product recommendations from user click logs.' },
    { role: 'product-manager', title: 'PRD and Interactive Wireframe for SaaS', diff: 'Beginner', time: '1 Week', skillsAdded: ['Product Strategy', 'UX Fundamentals', 'Communication'], desc: 'Draft a comprehensive Product Requirements Document (PRD) for a CRM platform and create Figma mockups representing the core onboarding flow.' }
  ],

  chatbotFaqs: [
    { q: 'How do I improve my placement readiness score?', a: 'You can increase your score by completing daily challenges, scoring well on Aptitude & Coding tests, uploading an optimized resume, and completing mock interviews.' },
    { q: 'What is a good ATS score for placements?', a: 'Aim for an ATS score above 75. Most enterprise applicant tracking systems filter out resumes with scores below 70.' },
    { q: 'How should I structure my learning roadmap?', a: 'Focus on mastering core programming concepts (DSA) first, follow up with building 2 strong domain projects, and practice timed aptitude tests daily.' }
  ],

  // --- NEW ENHANCED DATASETS ---

  // Salary Predictor ranges
  salaryRanges: {
    frontend: { baseMin: 50, baseMax: 140, multiplier: 12.5 },
    backend: { baseMin: 55, baseMax: 155, multiplier: 13.5 },
    'data-scientist': { baseMin: 60, baseMax: 170, multiplier: 14.5 },
    'product-manager': { baseMin: 50, baseMax: 135, multiplier: 11.8 }
  },

  // Peer-to-peer coding battle questions
  battleQuestions: [
    {
      id: 'bq1',
      question: 'Which of the following is true about JavaScript Closures?',
      options: [
        'They give access to an outer function\'s scope from an inner function.',
        'They delete variables from memory immediately upon outer function return.',
        'They can only be created with the "new" keyword.',
        'They are only supported in NodeJS environments.'
      ],
      correct: 0,
      points: 100
    },
    {
      id: 'bq2',
      question: 'What is the average time complexity to search an element in a Balanced Binary Search Tree?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 1,
      points: 100
    },
    {
      id: 'bq3',
      question: 'In databases, what does the ACID property stand for?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Authentication, Connection, Integrity, Distribution',
        'Algorithm, Compression, Iteration, Deletion',
        'Active, Concurrent, Indexed, Distributed'
      ],
      correct: 0,
      points: 120
    }
  ],

  // GPS Paths
  gpsPaths: {
    frontend: [
      { role: 'Associate UI Engineer', experience: '0-2 Years', criticalSkills: ['HTML/CSS', 'JavaScript', 'Git'], description: 'Focus on translations of high-fidelity mockups, semantic layouts, and DOM manipulation.' },
      { role: 'Senior React Developer', experience: '2-5 Years', criticalSkills: ['React', 'TypeScript', 'Web Security'], description: 'Handle state management models, code splitting, architectural optimization, and token routing.' },
      { role: 'Frontend Architect / Tech Lead', experience: '5+ Years', criticalSkills: ['System Design', 'Performance Tuning', 'DevOps'], description: 'Decide core styling modules, bundle configuration, testing coverage models, and mentor junior candidates.' }
    ],
    backend: [
      { role: 'Junior Backend Developer', experience: '0-2 Years', criticalSkills: ['Python', 'SQL', 'APIs'], description: 'Integrate simple endpoints, construct table queries, and manage database connection drivers.' },
      { role: 'Node System Engineer', experience: '2-5 Years', criticalSkills: ['Node.js', 'System Design', 'Docker'], description: 'Build asynchronous microservice patterns, rate limiters, message queues, and deploy containers.' },
      { role: 'Backend Architect', experience: '5+ Years', criticalSkills: ['Distributed Systems', 'Cloud DevOps', 'Database Tuning'], description: 'Design fault-tolerant backend architectures, load balancers, and global replication frameworks.' }
    ],
    'data-scientist': [
      { role: 'Junior Data Analyst', experience: '0-2 Years', criticalSkills: ['Python', 'SQL', 'Pandas/NumPy'], description: 'Perform data scrubbing, extract reports, and assemble presentation charts.' },
      { role: 'Machine Learning Engineer', experience: '2-5 Years', criticalSkills: ['Machine Learning', 'Statistics', 'R'], description: 'Train prediction pipelines, perform hyperparameter optimization, and compile custom pipelines.' },
      { role: 'Lead AI Scientist', experience: '5+ Years', criticalSkills: ['Deep Learning', 'System Design', 'Large Language Models'], description: 'Deploy large scale AI agents, coordinate LLM fine-tuning structures, and evaluate cost/performance ratios.' }
    ],
    'product-manager': [
      { role: 'Associate Product Manager', experience: '0-2 Years', criticalSkills: ['UX Fundamentals', 'Market Research', 'Communication'], description: 'Coordinate stakeholder standups, detail user stories, and track product analytics.' },
      { role: 'Product Manager (Core Platform)', experience: '2-5 Years', criticalSkills: ['Product Strategy', 'Analytics', 'Agile/Scrum'], description: 'Determine feature lifecycles, construct roadmap milestones, and manage cross-functional teams.' },
      { role: 'Director of Product', experience: '5+ Years', criticalSkills: ['Portfolio Strategy', 'Executive Leadership', 'Corporate Finance'], description: 'Set high-level business goals, allocate department resources, and drive core product adoption.' }
    ]
  },

  // Project blueprints by category and role
  projectBlueprints: [
    { id: 'pb1', role: 'frontend', title: 'Interactive Analytics Dashboard', skills: ['React', 'TypeScript', 'Web Security'], database: 'Local Storage / IndexDB', architecture: 'Client-Side Routing with State Context', desc: 'Design an interactive metrics board utilizing grid views, supporting real-time data filtering, export options, and state caching.' },
    { id: 'pb2', role: 'backend', title: 'High-Concurrency Chat Gateway', skills: ['Node.js', 'Docker', 'System Design'], database: 'Redis Cache & PostgreSQL', architecture: 'Pub-Sub Message Queue with Websockets', desc: 'Build an asynchronous messaging gateway handling thousands of concurrent client socket channels, complete with message history database triggers.' },
    { id: 'pb3', role: 'data-scientist', title: 'Stock Movement Classifier', skills: ['Python', 'Machine Learning', 'Statistics'], database: 'TimescaleDB / CSV Streams', architecture: 'Random Forest Model Pipeline', desc: 'Construct a stock price classification model using historical pricing feeds, evaluating feature vectors like moving averages and sentiment index.' }
  ],

  // Mentor daily coaching items
  dailyMentorTips: [
    { day: 'Monday', quote: '"In programming, clarity beats cleverness." – Keep your coding test structures clean.', focus: 'DSA Structure' },
    { day: 'Tuesday', quote: '"Aptitude is the filter. Speed is the weapon." – Practice timed logical tests today.', focus: 'Aptitude Speed' },
    { day: 'Wednesday', quote: '"Your project is your proof of capability." – Ensure you can explain every line in your GitHub repository.', focus: 'Project Delivery' },
    { day: 'Thursday', quote: '"The STAR method tells a story. Storytelling sells." – Practice behavioral questions aloud.', focus: 'Mock Interviews' },
    { day: 'Friday', quote: '"Never apply blindly. Align your keywords first." – Audit your resume against specific Job Descriptions.', focus: 'ATS Matching' }
  ]
};
