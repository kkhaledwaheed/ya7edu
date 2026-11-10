const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateBootstrap() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      grade: true
    },
    orderBy: { createdAt: 'asc' }
  });

  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || undefined,
    role: u.role,
    status: u.status,
    avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: u.headline || undefined,
    bio: u.bio || undefined,
    gradeId: (u.gradeId || undefined),
    validityType: u.validityType,
    validityDurationLabel: u.validityDurationLabel || undefined,
    validityExpiresAt: u.validityExpiresAt ? u.validityExpiresAt.toISOString() : undefined,
    joinedAt: u.joinedAt.toISOString()
  }));

  console.log('Total safe users:', safeUsers.length);
  const khaled = safeUsers.find(u => u.name === 'خالد');
  console.log('Khaled in safeUsers:', khaled);
  await prisma.$disconnect();
}
simulateBootstrap();

