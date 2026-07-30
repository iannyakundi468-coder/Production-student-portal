// Production configuration and translations for the Admin Portal


// ── Default Global Config ──────────────────────────────
export const defaultConfig = {
  language: 'en',
  xpLevelUp: 150,
  xpBadge: 300,
  badgesEnabled: true,
  leaderboardEnabled: true,
  notifyPayment: true,
  notifyPortfolio: true,
  notifyAnnouncement: true,
  dataRetentionYears: 5,
  allowParentMessaging: true,
  allowStudentLeaderboard: true,
};

// ── Translations ───────────────────────────────────────
export const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'User Management',
    classes: 'Class Setup',
    finance: 'Financial Oversight',
    timetable: 'Master Timetable',
    settings: 'System Settings',
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    pendingFees: 'Pending Fees',
    activeClasses: 'Active Classes',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    manageUsers: 'Manage Users',
    setupClasses: 'Class Setup',
    viewFinance: 'Financial Reports',
    systemSettings: 'System Settings',
  },
  sw: {
    dashboard: 'Dashibodi',
    users: 'Usimamizi wa Watumiaji',
    classes: 'Usanidi wa Darasa',
    finance: 'Usimamizi wa Fedha',
    timetable: 'Ratiba Kuu',
    settings: 'Mipangilio ya Mfumo',
    totalStudents: 'Jumla ya Wanafunzi',
    totalTeachers: 'Jumla ya Walimu',
    pendingFees: 'Ada Zinazongoja',
    activeClasses: 'Madarasa Yanayofanya Kazi',
    quickActions: 'Vitendo vya Haraka',
    recentActivity: 'Shughuli za Hivi Karibuni',
    manageUsers: 'Simamia Watumiaji',
    setupClasses: 'Sanidi Madarasa',
    viewFinance: 'Ripoti za Fedha',
    systemSettings: 'Mipangilio ya Mfumo',
  },
};
