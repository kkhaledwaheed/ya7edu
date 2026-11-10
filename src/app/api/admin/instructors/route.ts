import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name,
      email,
      phone = '01000000000',
      password = 'password123',
      assignedGradeIds = ['grade_sec_3'],
      assignedSubjectIds = ['subj_g3_phys'],
      validityType = 'LIFETIME',
      validityDurationLabel = 'مفتوح مدى الحياة',
      validityExpiresAt = null
    } = data;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'الاسم والبريد الإلكتروني مطلوبان' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر' },
        { status: 400 }
      );
    }

    const newId = `inst_${Date.now()}`;
    const avatarList = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
    ];
    const avatar = avatarList[Math.floor(Math.random() * avatarList.length)];

    // 1. Create User in MySQL
    const newUser = await prisma.user.create({
      data: {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: 'INSTRUCTOR',
        status: 'ACTIVE',
        avatar,
        headline: 'معلم معتمد على منصة YA7EDU',
        bio: 'معلم معتمد لمناهج الثانوية العامة.',
        gradeId: assignedGradeIds[0] || 'grade_sec_3',
        validityType,
        validityDurationLabel,
        validityExpiresAt: validityExpiresAt ? new Date(validityExpiresAt) : null,
        passwordHash: password
      }
    });

    // 2. Fetch subject details for content record
    const primarySubjectId = assignedSubjectIds[0] || 'subj_g3_phys';
    const subject = await prisma.subject.findUnique({
      where: { id: primarySubjectId }
    });

    const subjectName = subject?.nameAr || 'المادة الدراسية';
    const primaryGrade = assignedGradeIds[0] || 'grade_sec_3';
    const contentId = `content_${newId}`;

    // 3. Create InstructorContent in MySQL
    const newContent = await prisma.instructorContent.create({
      data: {
        id: contentId,
        instructorId: newId,
        instructorName: name.trim(),
        instructorTitle: `معلم مادة ${subjectName}`,
        instructorAvatar: avatar,
        subjectId: primarySubjectId,
        subjectName,
        gradeId: primaryGrade,
        term: 'Full Year',
        priceMonthly: 180,
        priceTerm: 450,
        priceYear: 800,
        rating: 5.0,
        totalSubscribers: 0,
        bioAr: `المحتوى المعتمد للأستاذ ${name.trim()} على منصة YA7EDU.`
      }
    });

    // 4. Create default Chapter 1
    const defaultChapter = await prisma.chapter.create({
      data: {
        id: `chap_${Date.now()}_1`,
        contentId,
        chapterNumber: 1,
        titleAr: 'الباب الأول: التأسيس والمفاهيم الأولية',
        titleEn: 'Chapter 1: Fundamentals'
      }
    });

    return NextResponse.json({
      success: true,
      instructor: newUser,
      content: {
        ...newContent,
        chapters: [{ ...defaultChapter, lessons: [] }],
        booklets: []
      }
    });
  } catch (error: any) {
    console.error('Error creating instructor in DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في حفظ المعلم في قاعدة البيانات' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { instructorId, validityType, validityDurationLabel, validityExpiresAt, assignedGradeIds } = data;

    if (!instructorId) {
      return NextResponse.json(
        { success: false, error: 'معرّف المعلم مطلوب' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: instructorId },
      data: {
        validityType: validityType || undefined,
        validityDurationLabel: validityDurationLabel || undefined,
        validityExpiresAt: validityExpiresAt ? new Date(validityExpiresAt) : null,
        gradeId: assignedGradeIds && assignedGradeIds.length > 0 ? assignedGradeIds[0] : undefined
      }
    });

    return NextResponse.json({ success: true, instructor: updated });
  } catch (error: any) {
    console.error('Error updating instructor in DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في تحديث بيانات المعلم في قاعدة البيانات' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('id');

    if (!instructorId) {
      return NextResponse.json(
        { success: false, error: 'معرّف المعلم مطلوب' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: instructorId }
    });

    return NextResponse.json({ success: true, message: 'تم حذف المعلم بنجاح من قاعدة البيانات' });
  } catch (error: any) {
    console.error('Error deleting instructor from DB:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في حذف المعلم' },
      { status: 500 }
    );
  }
}

