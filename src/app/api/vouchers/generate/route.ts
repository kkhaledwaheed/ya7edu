import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateRandomCode(prefix = 'YA7'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment1 = '';
  let segment2 = '';
  let segment3 = '';
  for (let i = 0; i < 4; i++) segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 2; i++) segment3 += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${prefix}-${segment1}-${segment2}-${segment3}`;
}

export async function POST(request: Request) {
  try {
    const {
      instructorId,
      subjectId,
      gradeId = 'grade_sec_3',
      duration = '1_MONTH',
      count = 10,
      priceLabel = '180 ج.م'
    } = await request.json();

    if (!instructorId || !subjectId) {
      return NextResponse.json(
        { success: false, error: 'يرجى اختيار المعلم والمادة المخصصة' },
        { status: 400 }
      );
    }

    const qty = Math.min(Math.max(1, Number(count) || 10), 100);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 10);

    const instructor = await prisma.user.findUnique({ where: { id: instructorId } });
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

    const durationLabels: Record<string, { en: string; ar: string }> = {
      '1_MONTH': { en: '1 Month Access', ar: 'اشتراك شهر واحد' },
      '3_MONTHS': { en: '3 Months Access', ar: 'اشتراك 3 أشهر' },
      'FULL_TERM': { en: 'Full Term Access', ar: 'اشتراك الترم كاملاً' },
      'FULL_YEAR': { en: 'Full Academic Year Access', ar: 'اشتراك العام كاملاً' }
    };
    const labels = durationLabels[duration] || durationLabels['1_MONTH'];
    const batchId = `BATCH-${Date.now().toString().slice(-6)}`;

    const codesToCreate = [];
    for (let i = 0; i < qty; i++) {
      codesToCreate.push({
        code: generateRandomCode('YA7'),
        instructorId,
        instructorName: instructor?.name || 'مدرس المادة',
        subjectId,
        subjectName: subject?.nameAr || 'المادة الدراسية',
        gradeId,
        duration,
        durationLabelEn: labels.en,
        durationLabelAr: labels.ar,
        batchId,
        priceLabel,
        status: 'AVAILABLE',
        expiresAt
      });
    }

    // Insert into VPS database
    await prisma.voucherCode.createMany({
      data: codesToCreate,
      skipDuplicates: true
    });

    const createdCodes = await prisma.voucherCode.findMany({
      where: {
        code: { in: codesToCreate.map(c => c.code) }
      },
      include: {
        instructor: true,
        subject: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `تم توليد وحفظ ${createdCodes.length} كارت شحن جديد في قاعدة بيانات الـ VPS بنجاح!`,
      vouchers: createdCodes.map(v => ({
        code: v.code,
        instructorId: v.instructorId,
        instructorName: v.instructor?.name || 'مدرس المادة',
        subjectId: v.subjectId,
        subjectName: v.subject?.nameAr || 'المادة',
        gradeId: v.gradeId,
        duration: v.duration,
        priceLabel: v.priceLabel,
        status: v.status,
        expiresAt: v.expiresAt.toISOString()
      }))
    });
  } catch (error: any) {
    console.error('Vouchers generation error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء توليد الكروت على السيرفر: ' + error.message },
      { status: 500 }
    );
  }
}
