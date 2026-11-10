const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    include: { profile: true, grade: true }
  });
  console.log('Prisma users in DB:', users.map(u => ({ id: u.id, name: u.name, phone: u.phone, email: u.email })));
  await prisma.$disconnect();
}
check();

