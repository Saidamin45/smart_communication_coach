import { PracticeSession, UserProfile, DailyPracticeTrack, UserSettings } from '../types';

export const DEFAULT_USER: UserProfile = {
  id: 'user_alex_123',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  role: 'student',
  targetGoal: 'Prepare for Tech Interviews & Achieve IELTS Band 8.0',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-06-01T00:00:00.000Z',
  streakDays: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  targetIELTSBand: 8.0,
  targetInterviewScore: 85,
};

export const DEFAULT_SETTINGS: UserSettings = {
  darkMode: true,
  aiVoiceEnabled: true,
  voiceGender: 'female',
  speechRate: 1.0,
  autoRecordAudio: false,
  showTimer: true,
  preferredLanguage: 'English (US)',
};

export const INITIAL_SESSIONS: PracticeSession[] = [
  {
    id: 'session_001',
    userId: 'user_alex_123',
    mode: 'interview',
    title: 'Software Engineer Behavioral Interview',
    topicOrRole: 'Frontend Developer',
    durationSeconds: 420,
    completedAt: '2026-07-25T14:30:00.000Z',
    scores: {
      grammar: 88,
      vocabulary: 84,
      fluency: 82,
      confidence: 86,
      relevance: 90,
      criticalThinking: 85,
      professionalism: 92,
      overallScore: 87,
    },
    transcript: [
      {
        speaker: 'ai',
        text: 'Welcome Alex! Tell me about a challenging technical conflict you had with a team member and how you resolved it using communication.',
        timestamp: 0,
      },
      {
        speaker: 'user',
        text: 'In our final year capstone project, my teammate wanted to use Redux for simple local state, but I believed React Context would reduce boilerplate. Instead of arguing, I benchmarked both approaches and presented a quick 5-minute trade-off demo. We agreed to use Context for auth and local state, which saved us development time.',
        timestamp: 15,
      },
      {
        speaker: 'ai',
        text: 'Excellent use of data-driven persuasion! How did you ensure your team member felt heard and respected during that discussion?',
        timestamp: 45,
      },
      {
        speaker: 'user',
        text: 'I started by explicitly acknowledging the benefits of Redux for complex state machines, agreeing that his architectural vision was valid. I invited him to co-author the benchmarking criteria so it was a collaborative evaluation rather than a personal debate.',
        timestamp: 60,
      }
    ],
    keyStrengths: [
      'Used structured STAR method (Situation, Task, Action, Result) seamlessly.',
      'Demonstrated collaborative empathy and data-driven conflict resolution.',
      'Clear, professional tone with strong tech-domain vocabulary.'
    ],
    areasToImprove: [
      'Could incorporate quantitative metrics for impact (e.g., % reduction in bundle size or dev time).',
      'Slight hesitation around technical terminology transitions.'
    ],
    actionableTips: [
      'Quantify results in behavioral answers: e.g. "reduced code boilerplate by 40%".',
      'Use pause phrases like "That is a nuanced point" rather than filler words.'
    ],
    modelAnswerSummary: 'A stellar STAR response explicitly framing problem, empathetic collaboration, objective benchmarking, and project success metrics.'
  },
  {
    id: 'session_002',
    userId: 'user_alex_123',
    mode: 'ielts',
    title: 'IELTS Part 2 Cue Card - Environment & Climate',
    topicOrRole: 'Describe an environmental rule or policy you support',
    durationSeconds: 300,
    completedAt: '2026-07-24T10:15:00.000Z',
    scores: {
      grammar: 85,
      vocabulary: 88,
      fluency: 80,
      confidence: 83,
      relevance: 92,
      criticalThinking: 86,
      professionalism: 88,
      overallScore: 86,
      ieltsBandScore: 7.5,
    },
    transcript: [
      {
        speaker: 'ai',
        text: 'Your cue card topic is: Describe a government policy to combat plastic pollution. You have 1 minute to prepare.',
        timestamp: 0,
      },
      {
        speaker: 'user',
        text: 'I would like to speak about the single-use plastic ban introduced in several municipal regions. This policy prohibits stores from distributing lightweight plastic packaging. In my opinion, this regulation is paramount because plastic decomposition takes centuries, devastating marine ecosystems and entering the food chain via microplastics. Additionally, it incentivizes green innovation in biodegradable alternatives.',
        timestamp: 60,
      }
    ],
    keyStrengths: [
      'Rich vocabulary: "paramount", "marine ecosystems", "incentivizes green innovation".',
      'Logical cohesion with discourse markers ("In my opinion", "Additionally").'
    ],
    areasToImprove: [
      'Slight pacing rush near the 90-second mark; maintain steady intonation.',
      'Incorporate more complex conditional structures (e.g. "Had this policy been enacted earlier...").'
    ],
    actionableTips: [
      'Practice varied sentence structures (conditionals, passive voice) to boost Grammatical Range score to Band 8+.',
      'Maintain eye contact with the visual camera prompt during cue card delivery.'
    ],
    ieltsPartDetails: {
      part1Score: 7.5,
      part2Score: 7.5,
      part3Score: 8.0,
    }
  },
  {
    id: 'session_003',
    userId: 'user_alex_123',
    mode: 'debate',
    title: 'Debate - AI in Higher Education (Pro Position)',
    topicOrRole: 'AI tools should be fully integrated into university curricula',
    durationSeconds: 540,
    completedAt: '2026-07-22T16:45:00.000Z',
    scores: {
      grammar: 90,
      vocabulary: 89,
      fluency: 86,
      confidence: 91,
      relevance: 94,
      criticalThinking: 92,
      professionalism: 93,
      overallScore: 91,
    },
    transcript: [
      {
        speaker: 'ai',
        text: 'Opponent Opening: Integrating generative AI into university coursework undermines critical thinking and leads to academic dishonesty.',
        timestamp: 0,
      },
      {
        speaker: 'user',
        text: 'Rebuttal: Opposing AI integration misunderstands the objective of higher education. Just as calculators elevated mathematics from manual arithmetic to high-level conceptual problem solving, AI assistants liberate students from routine synthesis, enabling deeper evaluation, critical inquiry, and prompt mastery—skills essential for the modern workforce.',
        timestamp: 20,
      }
    ],
    keyStrengths: [
      'Powerful analogy (calculators in math) establishing strong logical weight.',
      'High confidence and articulate counter-rebuttal vocabulary.'
    ],
    areasToImprove: [
      'Anticipate counter-arguments regarding assessment integrity and plagiarism detection.'
    ],
    actionableTips: [
      'Structure debate rebuttals into 3 parts: Acknowledge, Deconstruct, Re-anchor argument.'
    ]
  }
];

export const MOCK_DAILY_TRACKS: DailyPracticeTrack[] = [
  { date: '2026-07-20', minutesPracticed: 15, sessionsCompleted: 1, averageScore: 81 },
  { date: '2026-07-21', minutesPracticed: 25, sessionsCompleted: 2, averageScore: 83 },
  { date: '2026-07-22', minutesPracticed: 30, sessionsCompleted: 2, averageScore: 91 },
  { date: '2026-07-23', minutesPracticed: 20, sessionsCompleted: 1, averageScore: 85 },
  { date: '2026-07-24', minutesPracticed: 35, sessionsCompleted: 2, averageScore: 86 },
  { date: '2026-07-25', minutesPracticed: 45, sessionsCompleted: 3, averageScore: 87 },
  { date: '2026-07-26', minutesPracticed: 15, sessionsCompleted: 1, averageScore: 89 },
];

export const INTERVIEW_DOMAINS = [
  { id: 'swe', name: 'Software Engineering', icon: 'Code', description: 'System design, algorithm trade-offs, bug debugging, team conflict, agile sprints' },
  { id: 'pm', name: 'Product Management', icon: 'Briefcase', description: 'Product roadmap prioritization, metric drop analysis, cross-functional stakeholder buy-in' },
  { id: 'da', name: 'Data & Analytics', icon: 'BarChart2', description: 'A/B testing interpretation, data hygiene storytelling, executive presentation' },
  { id: 'marketing', name: 'Marketing & Growth', icon: 'Megaphone', description: 'Campaign performance pitch, brand positioning, crisis PR communication' },
  { id: 'hr', name: 'Human Resources & Talent', icon: 'Users', description: 'De-escalation scenarios, workplace culture policies, performance review delivery' },
  { id: 'finance', name: 'Finance & Consulting', icon: 'TrendingUp', description: 'Financial model defense, strategic recommendations, client objection handling' },
];

export const IELTS_TOPICS = [
  { id: 'tech_edu', title: 'Education & AI Technology', description: 'Discussing online learning, AI tools in universities, and digital literacy.' },
  { id: 'env_sustain', title: 'Climate Change & Sustainability', description: 'Evaluating plastic bans, renewable energy adoption, and individual responsibility.' },
  { id: 'work_future', title: 'Future of Work & Automation', description: 'Examining four-day work weeks, remote employment, and career mobility.' },
  { id: 'culture_art', title: 'Arts, Heritage & Globalization', description: 'Debating government funding for museums, local traditions vs global media.' },
  { id: 'health_society', title: 'Public Health & Modern Lifestyles', description: 'Analyzing urban stress, preventative medicine, and digital detoxing.' },
];

export const DEBATE_TOPICS = [
  { id: 'ai_curriculum', title: 'Generative AI in University Curricula', description: 'Should universities require AI prompt engineering or enforce strict AI bans?' },
  { id: 'remote_work', title: 'Mandatory Office Returns vs Remote Work', description: 'Is in-person collaboration superior to asynchronous remote productivity?' },
  { id: 'social_media_age', title: 'Minimum Age Limit of 16 for Social Media', description: 'Should governments restrict social media usage for minors to combat mental health crises?' },
  { id: 'degree_relevance', title: 'University Degree vs Skills-Based Certifications', description: 'Are traditional 4-year college degrees becoming obsolete in the tech industry?' },
  { id: 'carbon_tax', title: 'Global Carbon Tax on Multinational Corporations', description: 'Should heavy polluters face mandatory global financial penalties?' },
];
