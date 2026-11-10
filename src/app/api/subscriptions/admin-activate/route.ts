import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const {
      studentId,
      instructorId,
      subjectId,
      duration = '1_MONTH',
      paymentMethod = 'WHATSAPP_ADMIN_TRANSFER',
      notes
    } = await request.json();

    if (!studentId || !instructorId || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'يرجى تحديد الطالب والمعلم والمادة الدراسية.' },
        { status: 400 }
      );
    }

    const [student, instructor, subject] = await Promise.all([
      prisma.user.findUnique({ where: { id: studentId } }),
      prisma.user.findUnique({ where: { id: instructorId } }),
      prisma.subject.findUnique({ where: { id: subjectId } })
    ]);

    if (!student) {
      return NextResponse.json({ success: false, error: 'الطالب غير موجود.' }, { status: 404 });
    }
    if (!instructor) {
      return NextResponse.json({ success: false, error: 'المعلم غير موجود.' }, { status: 404 });
    }
    if (!subject) {
      return NextResponse.json({ success: false, error: 'المادة الدراسية غير موجودة.' }, { status: 404 });
    }

    const durationDaysMap: Record<string, { days: number; label: string }> = {
      '1_MONTH': { days: 30, label: 'اشتراك شهر واحد (30 يوماً)' },
      '3_MONTHS': { days: 90, label: 'اشتراك 3 أشهر (90 يوماً)' },
      'FULL_TERM': { days: 120, label: 'اشتراك الترم كاملاً (120 يوماً)' },
      'FULL_YEAR': { days: 300, label: 'اشتراك العام كاملاً (300 يوماً)' }
    };

    const config = durationDaysMap[duration] || durationDaysMap['1_MONTH'];
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + config.days);

    const subscriptionId = `sub_${studentId}_${instructorId}_${subjectId}`;

    const subscription = await prisma.teacherSubscription.upsert({
      where: { id: subscriptionId },
      update: {
        status: 'ACTIVE',
        activatedAt: now,
        expiresAt,
        durationLabel: config.label,
        paymentMethod
      },
      create: {
        id: subscriptionId,
        studentId,
        instructorId,
        instructorName: instructor.name,
        instructorAvatar: instructor.avatar || null,
        subjectId,
        subjectName: subject.nameAr,
        gradeId: student.gradeId || subject.gradeId || 'grade_sec_3',
        status: 'ACTIVE',
        durationLabel: config.label,
        paymentMethod,
        activatedAt: now,
        expiresAt
      }
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_ACTIVATED_SUBSCRIPTION',
        entityType: 'TeacherSubscription',
        entityId: subscription.id,
        metadata: JSON.stringify({
          studentName: student.name,
          studentEmail: student.email,
          instructorName: instructor.name,
          subjectName: subject.nameAr,
          duration: config.label,
          paymentMethod,
          notes: notes || 'تفعيل مباشر من الأدمن بعد تحويل الواتساب'
        })
      }
    }).catch(e => console.warn('AuditLog notice:', e));

    return NextResponse.json({
      success: true,
      message: `تم تفعيل اشتراك الطالب (${student.name}) مع (${instructor.name}) بنجاح!`,
      subscription: {
        id: subscription.id,
        studentId: subscription.studentId,
        instructorId: subscription.instructorId,
        instructorName: subscription.instructorName,
        instructorAvatar: subscription.instructorAvatar,
        subjectId: subscription.subjectId,
        subjectName: subscription.subjectName,
        gradeId: subscription.gradeId,
        activatedAt: subscription.activatedAt.toISOString(),
        expiresAt: subscription.expiresAt.toISOString(),
        durationLabel: subscription.durationLabel,
        paymentMethod: subscription.paymentMethod,
        status: subscription.status
      }
    });
  } catch (error: any) {
    console.error('Admin activate subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تفعيل الاشتراك: ' + error.message },
      { status: 500 }
    );
  }
}

