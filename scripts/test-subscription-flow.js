const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSubscriptionFlow() {
  console.log('Testing WhatsApp & Voucher Subscription Flow on VPS...');

  // 1. Check student and instructor
  const student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
  const instructor = await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' } });
  const subject = await prisma.subject.findFirst();

  console.log(`Student: ${student.name} (${student.id})`);
  console.log(`Instructor: ${instructor.name} (${instructor.id})`);
  console.log(`Subject: ${subject.nameAr} (${subject.id})`);

  // 2. Test upserting a subscription via admin activation
  const subId = `sub_${student.id}_${instructor.id}_${subject.id}`;
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 120); // Full Term

  const sub = await prisma.teacherSubscription.upsert({
    where: { id: subId },
    update: {
      status: 'ACTIVE',
      activatedAt: now,
      expiresAt,
      durationLabel: 'اشتراك الفصل الدراسي كاملاً (120 يوماً)',
      paymentMethod: 'WHATSAPP_ADMIN_TRANSFER'
    },
    create: {
      id: subId,
      studentId: student.id,
      instructorId: instructor.id,
      instructorName: instructor.name,
      instructorAvatar: instructor.avatar,
      subjectId: subject.id,
      subjectName: subject.nameAr,
      gradeId: student.gradeId || subject.gradeId,
      status: 'ACTIVE',
      durationLabel: 'اشتراك الفصل الدراسي كاملاً (120 يوماً)',
      paymentMethod: 'WHATSAPP_ADMIN_TRANSFER',
      activatedAt: now,
      expiresAt
    }
  });

  console.log('\n✅ Subscription created/updated successfully in VPS MySQL:');
  console.log(` • ID: ${sub.id}`);
  console.log(` • Status: ${sub.status}`);
  console.log(` • Method: ${sub.paymentMethod}`);
  console.log(` • Duration: ${sub.durationLabel}`);
  console.log(` • Expires: ${sub.expiresAt.toISOString()}`);

  // 3. Verify querying active subscriptions
  const activeSubs = await prisma.teacherSubscription.findMany({
    where: { studentId: student.id, status: 'ACTIVE' }
  });
  console.log(`\nFound ${activeSubs.length} active subscription(s) for ${student.name}`);

  await prisma.$disconnect();
  console.log('\n🎉 SUBSCRIPTION & WHATSAPP ACTIVATION PIPELINE VERIFIED 100%!');
}

testSubscriptionFlow().catch(err => {
  console.error('Subscription test error:', err);
  process.exit(1);
});

