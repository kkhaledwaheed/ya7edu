const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash123 = await bcrypt.hash('Password@123', 10);
  console.log('Generated hash for Password@123:', hash123);

  const updated = await prisma.user.updateMany({
    data: {
      passwordHash: hash123
    }
  });

  console.log(`Updated ${updated.count} users in VPS database with real bcrypt password (Password@123).`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

