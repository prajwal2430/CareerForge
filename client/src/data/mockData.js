export const MOCK_DATA = {
  user: {
    streak: 12,
    dsaProgress: 45,
    courseProgress: 60,
    mockScore: 8,
    resumeScore: 85,
    rank: 12450
  },
  problems: {
    easy: { solved: 45, total: 100 },
    medium: { solved: 20, total: 200 },
    hard: { solved: 5, total: 150 }
  },
  weeklyActivity: [
    { day: 'Mon', hours: 2, problems: 3 },
    { day: 'Tue', hours: 3, problems: 5 },
    { day: 'Wed', hours: 1, problems: 1 },
    { day: 'Thu', hours: 4, problems: 7 },
    { day: 'Fri', hours: 2, problems: 2 },
    { day: 'Sat', hours: 5, problems: 10 },
    { day: 'Sun', hours: 6, problems: 12 },
  ],
  tasks: [
    { id: 1, title: 'Solve 2 DSA Questions', completed: true, points: 20 },
    { id: 2, title: 'Complete React Context Lecture', completed: false, points: 30 },
    { id: 3, title: 'Take Weekly Mock Assessment', completed: false, points: 50 },
  ],
  courses: [
    { id: 1, title: 'Complete DSA for Placements', instructor: 'Striver', rating: 4.9, students: '120k', duration: '50h', image: 'dsa-thumb', category: 'DSA', progress: 45 },
    { id: 2, title: 'MERN Stack Masterclass', instructor: 'Hitesh C', rating: 4.8, students: '85k', duration: '60h', image: 'mern-thumb', category: 'Web Dev', progress: 10 },
    { id: 3, title: 'System Design Interview', instructor: 'Gaurav Sen', rating: 4.9, students: '50k', duration: '20h', image: 'sd-thumb', category: 'System Design', progress: 0 },
    { id: 4, title: 'Quantitative Aptitude & Logical Reasoning', instructor: 'CareerRide', rating: 4.9, students: '150k', duration: '40h', image: 'apti-thumb', category: 'Aptitude', progress: 0, youtubeId: 'euz9GWR3ITY' },
  ],
  companies: [
    { id: 'google', name: 'Google', logo: 'google-logo', difficulty: 'Hard', roles: ['SWE', 'SRE'], package: '30-40 LPA' },
    { id: 'amazon', name: 'Amazon', logo: 'amazon-logo', difficulty: 'Medium', roles: ['SDE-1', 'AWS'], package: '25-45 LPA' },
    { id: 'microsoft', name: 'Microsoft', logo: 'microsoft-logo', difficulty: 'Medium', roles: ['SDE', 'PM'], package: '40-50 LPA' },
  ],
  roadmaps: [
    { id: 'java', title: 'Java Backend Developer', duration: '6 Months', steps: 15, progress: 40 },
    { id: 'mern', title: 'MERN Stack Developer', duration: '4 Months', steps: 12, progress: 10 },
    { id: 'data', title: 'Data Scientist', duration: '8 Months', steps: 20, progress: 0 },
  ]
};
