import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // 1. Fetch grades and subjects
    const grades = await prisma.academicGrade.findMany({
      include: {
        subjects: true
      },
      orderBy: { id: 'asc' }
    });

    const subjects = await prisma.subject.findMany({
      include: { grade: true },
      orderBy: { id: 'asc' }
    });

    // 2. Fetch users
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        grade: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // 3. Fetch instructor contents (chapters, lessons, booklets)
    const instructorContents = await prisma.instructorContent.findMany({
      include: {
        chapters: {
          include: {
            lessons: true
          },
          orderBy: { chapterNumber: 'asc' }
        },
        booklets: {
          include: {
            questions: true
          }
        },
        instructor: true,
        subject: true
      }
    });

    // 4. Fetch instructor exams
    const exams = await prisma.instructorExam.findMany({
      include: {
        questions: true,
        instructor: true,
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 5. Fetch student exam attempts
    const attempts = await prisma.studentExamAttempt.findMany({
      include: {
        student: true,
        exam: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    // 6. Fetch vouchers
    const vouchers = await prisma.voucherCode.findMany({
      include: {
        instructor: true,
        subject: true,
        grade: true,
        redeemedByUser: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 7. Fetch active subscriptions
    const subscriptions = await prisma.teacherSubscription.findMany({
      include: {
        instructor: true,
        student: true,
        subject: true
      }
    });

    // 8. Fetch courses
    const courses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            lessons: true
          }
        },
        instructor: true,
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 9. Fetch payouts
    const payouts = await prisma.payout.findMany({
      include: { instructor: true },
      orderBy: { requestedAt: 'desc' }
    });

    // 10. Fetch platform system config
    let systemConfig = await prisma.systemConfig.findFirst();
    if (!systemConfig) {
      systemConfig = await prisma.systemConfig.create({
        data: {
          id: 'default',
          platformCommissionRate: 15.0,
          payoutMinimumThreshold: 50.0,
          bannerAnnouncement: '🚀 مرحباً بكم في منصة YA7EDU الرقمية الذكية - العام الدراسي 2026',
          isMaintenanceMode: false
        }
      });
    }

    // Format safe users list
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || undefined,
      role: u.role as any,
      status: u.status as any,
      avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      headline: u.headline || undefined,
      bio: u.bio || undefined,
      gradeId: (u.gradeId || undefined) as any,
      validityType: u.validityType as any,
      validityDurationLabel: u.validityDurationLabel || undefined,
      validityExpiresAt: u.validityExpiresAt ? u.validityExpiresAt.toISOString() : undefined,
      joinedAt: u.joinedAt.toISOString()
    }));

    // Format formatted instructor contents
    const formattedContents = instructorContents.map(c => ({
      id: c.id,
      instructorId: c.instructorId,
      instructorName: c.instructor?.name || 'مدرس المادة',
      instructorAvatar: c.instructor?.avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
      subjectId: c.subjectId,
      subjectName: c.subject?.nameAr || 'المادة الدراسية',
      gradeId: c.gradeId as any,
      rating: 4.96,
      totalSubscribers: 4820,
      monthlyPrice: c.priceMonthly,
      chapters: c.chapters.map(ch => ({
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        titleAr: ch.titleAr,
        titleEn: ch.titleEn,
        lessons: ch.lessons.map(les => ({
          id: les.id,
          titleAr: les.titleAr,
          titleEn: les.titleEn,
          durationMinutes: les.durationMinutes,
          videoUrl: les.videoUrl,
          isFree: les.isFree,
          isCompleted: false,
          notes: les.notes || undefined
        }))
      })),
      booklets: c.booklets.filter(b => b.type === 'BOOKLET').map(b => ({
        id: b.id,
        titleAr: b.titleAr,
        titleEn: b.titleEn,
        pageCount: b.pageCount,
        fileSize: b.fileSize,
        downloadUrl: b.downloadUrl || '#',
        format: b.format as any,
        isFree: b.isFree,
        type: 'BOOKLET' as const,
        questions: b.questions.map(q => {
          let parsedOpts = ['أ', 'ب', 'ج', 'د'];
          try {
            if (q.options) parsedOpts = JSON.parse(q.options);
          } catch {}
          return {
            id: q.id,
            questionAr: q.questionAr,
            options: parsedOpts,
            correctIndex: q.correctIndex,
            explanationAr: q.explanationAr
          };
        })
      })),
      revisions: c.booklets.filter(b => b.type === 'REVISION').map(b => ({
        id: b.id,
        titleAr: b.titleAr,
        titleEn: b.titleEn,
        pageCount: b.pageCount,
        fileSize: b.fileSize,
        downloadUrl: b.downloadUrl || '#',
        format: b.format as any,
        isFree: b.isFree,
        type: 'REVISION' as const,
        videoUrl: b.videoUrl || undefined,
        durationMinutes: b.durationMinutes || undefined
      })),
      ya7eduBooklets: c.booklets.filter(b => b.type === 'YA7EDU_EXCLUSIVE').map(b => ({
        id: b.id,
        titleAr: b.titleAr,
        titleEn: b.titleEn,
        pageCount: b.pageCount,
        fileSize: b.fileSize,
        downloadUrl: b.downloadUrl || '#',
        isFree: b.isFree,
        type: 'YA7EDU_EXCLUSIVE' as const
      }))
    }));

    // Format formatted vouchers
    const formattedVouchers = vouchers.map(v => ({
      code: v.code,
      instructorId: v.instructorId,
      instructorName: v.instructor?.name || 'مدرس المادة',
      subjectId: v.subjectId,
      subjectName: v.subject?.nameAr || 'المادة الدراسية',
      gradeId: v.gradeId as any,
      duration: v.duration as any,
      status: v.status as any,
      priceLabel: v.priceLabel || undefined,
      redeemedByStudentId: v.redeemedByUserId || undefined,
      redeemedByStudentName: v.redeemedByUser?.name || undefined,
      redeemedAt: v.redeemedAt ? v.redeemedAt.toISOString() : undefined,
      expiresAt: v.expiresAt.toISOString()
    }));

    // Format formatted exams
    const formattedExams = exams.map(e => ({
      id: e.id,
      instructorId: e.instructorId,
      instructorName: e.instructor?.name || 'مدرس المادة',
      instructorAvatar: e.instructor?.avatar || undefined,
      subjectId: e.subjectId,
      subjectName: e.subject?.nameAr || 'المادة',
      gradeId: e.gradeId as any,
      title: e.title,
      description: e.description || '',
      durationMinutes: e.durationMinutes,
      startDate: e.startDate || undefined,
      startTime: e.startTime || undefined,
      endDate: e.endDate || undefined,
      endTime: e.endTime || undefined,
      passingPercent: e.passingPercent,
      totalMarks: e.totalMarks,
      isPublished: e.isPublished,
      hideResultUntilDurationEnds: e.hideResultUntilDurationEnds,
      questions: e.questions.map(q => {
        let parsedOpts = ['أ', 'ب', 'ج', 'د'];
        try {
          if (q.options) parsedOpts = JSON.parse(q.options);
        } catch {}
        return {
          id: q.id,
          questionText: q.questionText,
          options: parsedOpts,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
          marks: q.marks
        };
      })
    }));

    return NextResponse.json({
      success: true,
      source: 'VPS_DATABASE_107_173_52_132',
      grades: grades.map(g => ({
        id: g.id,
        nameEn: g.nameEn,
        nameAr: g.nameAr,
        stage: g.stage,
        description: g.description || ''
      })),
      subjects: subjects.map(s => ({
        id: s.id,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        gradeId: s.gradeId,
        icon: s.icon,
        color: s.color,
        description: s.description || ''
      })),
      users: safeUsers,
      instructorContents: formattedContents,
      vouchers: formattedVouchers,
      instructorExams: formattedExams,
      subscriptions: subscriptions.map(s => ({
        id: s.id,
        studentId: s.studentId,
        instructorId: s.instructorId,
        instructorName: s.instructorName,
        instructorAvatar: s.instructorAvatar || s.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        subjectId: s.subjectId,
        subjectName: s.subjectName,
        gradeId: s.gradeId as any,
        activatedAt: s.activatedAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
        durationLabel: s.durationLabel,
        paymentMethod: s.paymentMethod as any,
        voucherCodeUsed: s.voucherCodeUsed || undefined,
        status: s.status as any
      })),
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        subtitle: c.subtitle || undefined,
        description: c.description,
        thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
        previewVideoUrl: c.previewVideoUrl || undefined,
        price: c.price,
        discountPrice: c.discountPrice || undefined,
        level: c.level as any,
        category: 'الثانوية العامة',
        status: c.status as any,
        rejectionReason: c.rejectionReason || undefined,
        instructorId: c.instructorId,
        instructorName: c.instructor?.name || 'المعلم',
        instructorAvatar: c.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        instructorTitle: c.instructor?.headline || 'خبير المادة التعليمية',
        averageRating: 4.95,
        totalStudents: 1420,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        sections: c.sections.map(s => ({
          id: s.id,
          title: s.title,
          lessons: s.lessons.map(l => ({
            id: l.id,
            title: l.title,
            durationMinutes: Math.round((l.durationSeconds || 900) / 60) || 15,
            videoUrl: l.videoUrl || '',
            isPreview: l.isPreview,
            notes: l.description || l.articleContent || undefined
          }))
        }))
      })),
      payoutRequests: payouts.map(p => ({
        id: p.id,
        instructorId: p.instructorId,
        instructorName: p.instructor?.name || 'المعلم',
        instructorAvatar: p.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        amount: p.amount,
        status: p.status as any,
        requestedAt: p.requestedAt.toISOString(),
        payoutMethod: p.payoutMethod,
        accountDetails: p.accountDetails || undefined
      })),
      platformConfig: {
        commissionRate: systemConfig.platformCommissionRate,
        minPayoutThreshold: systemConfig.payoutMinimumThreshold,
        bannerText: systemConfig.bannerAnnouncement || '',
        bannerEnabled: Boolean(systemConfig.bannerAnnouncement && systemConfig.bannerAnnouncement.trim().length > 0),
        maintenanceMode: Boolean(systemConfig.isMaintenanceMode)
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('LMS Bootstrap error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch LMS data from VPS: ' + error.message },
      { status: 500 }
    );
  }
}
