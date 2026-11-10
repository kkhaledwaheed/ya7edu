import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, studentId, instructorId, subjectId } = await request.json();

    if (!code || !studentId) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال كود الكارت ومعرف الطالب' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Find voucher in VPS database
    const voucher = await prisma.voucherCode.findUnique({
      where: { code: cleanCode },
      include: {
        instructor: true,
        subject: true
      }
    });

    if (!voucher) {
      return NextResponse.json(
        { success: false, error: 'كود الكارت غير صحيح، يرجى التأكد من كتابة الرموز بدقة.' },
        { status: 404 }
      );
    }

    if (voucher.status === 'REDEEMED') {
      return NextResponse.json(
        { success: false, error: 'تم استخدام وشحن كود هذا الكارت مسبقاً.' },
        { status: 400 }
      );
    }

    if (voucher.status === 'EXPIRED' || new Date(voucher.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'انتهت صلاحية هذا الكارت ولم يعد قابلاً للتفعيل.' },
        { status: 400 }
      );
    }

    // 2. Calculate subscription expiration based on duration
    const now = new Date();
    let expiresAt = new Date(now);
    let durationLabel = 'شهر واحد كامل';

    if (voucher.duration === '1_MONTH') {
      expiresAt.setDate(expiresAt.getDate() + 30);
      durationLabel = 'شهر واحد (30 يوماً)';
    } else if (voucher.duration === 'FULL_TERM' || voucher.duration === '3_MONTHS') {
      expiresAt.setDate(expiresAt.getDate() + 120);
      durationLabel = 'تيرم كامل (فصل دراسي)';
    } else if (voucher.duration === 'FULL_YEAR') {
      expiresAt.setDate(expiresAt.getDate() + 300);
      durationLabel = 'عام دراسي كامل';
    }

    // 3. Execute atomic transaction on VPS database
    const targetInstructorId = voucher.instructorId || instructorId || 'inst_ahmed_samy';
    const targetSubjectId = voucher.subjectId || subjectId || 'subj_g3_phys';

    const [updatedVoucher, newSub] = await prisma.$transaction([
      prisma.voucherCode.update({
        where: { code: cleanCode },
        data: {
          status: 'REDEEMED',
          redeemedByUserId: studentId,
          redeemedAt: now
        }
      }),
      prisma.teacherSubscription.upsert({
        where: {
          id: `sub_${studentId}_${targetInstructorId}_${targetSubjectId}`
        },
        update: {
          status: 'ACTIVE',
          expiresAt,
          durationLabel,
          voucherCodeUsed: cleanCode
        },
        create: {
          id: `sub_${studentId}_${targetInstructorId}_${targetSubjectId}`,
          studentId,
          instructorId: targetInstructorId,
          instructorName: voucher.instructorName || 'مدرس المادة',
          instructorAvatar: voucher.instructor?.avatar || null,
          subjectId: targetSubjectId,
          subjectName: voucher.subjectName || 'المادة الدراسية',
          gradeId: voucher.gradeId,
          status: 'ACTIVE',
          durationLabel,
          paymentMethod: 'VOUCHER_CARD',
          voucherCodeUsed: cleanCode,
          activatedAt: now,
          expiresAt
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: `تم شحن الكارت وتفعيل الاشتراك بنجاح لمدة ${durationLabel}!`,
      voucher: {
        code: updatedVoucher.code,
        status: updatedVoucher.status,
        redeemedAt: updatedVoucher.redeemedAt?.toISOString()
      },
      subscription: {
        id: newSub.id,
        instructorId: newSub.instructorId,
        subjectId: newSub.subjectId,
        durationLabel: newSub.durationLabel,
        expiresAt: newSub.expiresAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Voucher redeem error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء شحن الكارت على السيرفر: ' + error.message },
      { status: 500 }
    );
  }
}
