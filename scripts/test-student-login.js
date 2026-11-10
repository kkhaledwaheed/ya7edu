const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin() {
  const identifier = '01030370718';
  console.log(`Testing login query for identifier: ${identifier}`);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier.trim().toLowerCase() },
        { phone: identifier.trim() }
      ]
    },
    include: { profile: true, grade: true }
  });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log('✅ User found in DB:');
  console.log('ID:', user.id);
  console.log('Name:', user.name);
  console.log('Role:', user.role);
  console.log('Phone:', user.phone);
  console.log('Email:', user.email);
  console.log('Password hash exists:', !!user.passwordHash);

  await prisma.$disconnect();
}

testLogin();

