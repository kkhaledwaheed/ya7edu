const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma connection to MySQL on VPS 107.173.52.132...');
  const grades = await prisma.academicGrade.findMany({
    include: { subjects: true }
  });
  console.log('✅ Connection Successful!');
  console.log(`Found ${grades.length} Academic Grades:`);
  grades.forEach(g => {
    console.log(` • [${g.id}] ${g.nameAr} - ${g.subjects.length} المواد المرتبطة`);
  });

  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    include: { authoredContents: true, authoredExams: true }
  });
  console.log(`\nFound ${instructors.length} Instructors:`);
  instructors.forEach(inst => {
    console.log(` • ${inst.name} | محتوى: ${inst.authoredContents.length} | امتحانات: ${inst.authoredExams.length}`);
  });

  const vouchers = await prisma.voucherCode.findMany();
  console.log(`\nFound ${vouchers.length} Vouchers:`);
  vouchers.forEach(v => {
    console.log(` • كود: ${v.code} | المادة: ${v.subjectName} | السعر: ${v.priceLabel}`);
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Prisma connection error:', err);
  process.exit(1);
});

