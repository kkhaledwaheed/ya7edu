export const mockRevenueTrends = [
  { month: 'Oct 2023', revenue: 14200, platformCut: 2130, payouts: 12070, newStudents: 410 },
  { month: 'Nov 2023', revenue: 18900, platformCut: 2835, payouts: 16065, newStudents: 590 },
  { month: 'Dec 2023', revenue: 26500, platformCut: 3975, payouts: 22525, newStudents: 820 },
  { month: 'Jan 2024', revenue: 31200, platformCut: 4680, payouts: 26520, newStudents: 960 },
  { month: 'Feb 2024', revenue: 39800, platformCut: 5970, payouts: 33830, newStudents: 1240 },
  { month: 'Mar 2024', revenue: 47600, platformCut: 7140, payouts: 40460, newStudents: 1530 },
];

export const mockCategoryDistribution = [
  { name: 'Artificial Intelligence', value: 42, color: '#6366f1' },
  { name: 'Web Development', value: 28, color: '#06b6d4' },
  { name: 'DevOps & Cloud', value: 18, color: '#10b981' },
  { name: 'UI/UX Design', value: 12, color: '#f59e0b' },
];

export const mockInstructorCoursePerformance = [
  {
    courseName: 'Autonomous AI & Multi-Agent Systems',
    enrollments: 1420,
    grossRevenue: 212985,
    instructorNet: 181037,
    rating: 4.95,
    completionRate: 64
  },
  {
    courseName: 'Enterprise Next.js 15 Masterclass',
    enrollments: 980,
    grossRevenue: 117590,
    instructorNet: 99951,
    rating: 4.88,
    completionRate: 72
  },
  {
    courseName: 'Practical Quantum Computing (Draft)',
    enrollments: 0,
    grossRevenue: 0,
    instructorNet: 0,
    rating: 0,
    completionRate: 0
  }
];

export const mockAdminStats = {
  totalRevenue: 178200,
  mrr: 47600,
  platformCommissionCut: 26730,
  totalStudents: 5550,
  totalInstructors: 48,
  activeCourses: 28,
  pendingApprovals: 3,
  pendingPayoutsAmount: 6100,
  averageCompletionRate: 68.4,
  churnRate: 2.1
};

export const mockInstructorStats = {
  totalEarnings: 82450,
  pendingPayout: 4250,
  totalStudents: 2400,
  averageRating: 4.92,
  totalCourses: 3,
  publishedCourses: 2,
  draftCourses: 1
};
