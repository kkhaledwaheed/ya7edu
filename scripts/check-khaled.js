const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkKhaled() {
  const user = await prisma.user.findFirst({
    where: { phone: '01030370718' },
    include: { profile: true, grade: true }
  });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}
checkKhaled();

