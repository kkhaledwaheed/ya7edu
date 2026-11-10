import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const {
      studentId,
      instructorId,
      subjectId,
      duration = '1_MONTH',
      paymentMethod = 'WHATSAPP_ADMIN_TRANSFER'
    } = await request.json();

    if (!studentId || !instructorId || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      );
    }

    const [student, instructor, subject] = await Promise.all([
      prisma.user.findUnique({ where: { id: studentId } }),
      prisma.user.findUnique({ where: { id: instructorId } }),
      prisma.subject.findUnique({ where: { id: subjectId } })
    ]);

    if (!student || !instructor || !subject) {
      return NextResponse.json({ success: false, error: 'تعذر العثور على أطراف الاشتراك' }, { status: 404 });
    }

    const durationDaysMap: Record<string, { days: number; label: string; price: string }> = {
      '1_MONTH': { days: 30, label: 'شهر واحد', price: '180 ج.م' },
      '3_MONTHS': { days: 90, label: '3 أشهر', price: '450 ج.م' },
      'FULL_TERM': { days: 120, label: 'الترم كاملاً', price: '450 ج.م' },
      'FULL_YEAR': { days: 300, label: 'العام كاملاً', price: '800 ج.م' }
    };

    const config = durationDaysMap[duration] || durationDaysMap['1_MONTH'];
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + config.days);

    const subscriptionId = `sub_${studentId}_${instructorId}_${subjectId}`;

    // Create or update subscription record with PENDING_ADMIN_PAYMENT
    const sub = await prisma.teacherSubscription.upsert({
      where: { id: subscriptionId },
      update: {
        status: 'PENDING_ADMIN_PAYMENT',
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
        status: 'PENDING_ADMIN_PAYMENT',
        durationLabel: config.label,
        paymentMethod,
        activatedAt: now,
        expiresAt
      }
    });

    const orderRef = `REF-${Date.now().toString().slice(-6)}`;

    // Build WhatsApp message
    const waText = 
`السلام عليكم ورحمة الله،
أنا الطالب: ${student.name}
رقم الهاتف: ${student.phone || 'غير مسجل'}
البريد المسجل: ${student.email}

أرغب في تفعيل اشتراك مع المعلم: ${instructor.name}
المادة الدراسية: ${subject.nameAr}
باقة الاشتراك المطلوبة: ${config.label} (بقيمة: ${config.price})
طريقة التحويل المفضلة: ${paymentMethod === 'VODAFONE_CASH' ? 'فودافون كاش' : paymentMethod === 'INSTAPAY' ? 'انستاباي' : 'تحويل محفظة'} على رقمكم المعتمد 01090138676

مرفق صورة إيصال التحويل لتفعيل الاشتراك على حسابي فوراً.
كود الطلب المرجعي: ${orderRef}`;

    const whatsappUrl = `https://wa.me/201090138676?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      orderRef,
      whatsappUrl,
      subscriptionId: sub.id,
      message: 'تم تسجيل طلب الاشتراك وتجهيز رابط واتساب الإدارة'
    });
  } catch (error: any) {
    console.error('Subscription request error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

