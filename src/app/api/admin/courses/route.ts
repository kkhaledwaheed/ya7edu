import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        sections: {
          include: { lessons: true },
          orderBy: { orderIndex: 'asc' }
        },
        instructor: true,
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
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
      }))
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { courseId, status, rejectionReason } = await request.json();

    if (!courseId || !status) {
      return NextResponse.json(
        { success: false, error: 'معرّف المنهج والحالة مطلوبان' },
        { status: 400 }
      );
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        status,
        rejectionReason: rejectionReason ? rejectionReason.trim() : null,
        publishedAt: status === 'APPROVED' ? new Date() : undefined
      },
      include: {
        sections: {
          include: { lessons: true }
        },
        instructor: true,
        reviews: true
      }
    });

    return NextResponse.json({
      success: true,
      course: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        subtitle: updated.subtitle || undefined,
        description: updated.description,
        thumbnail: updated.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
        previewVideoUrl: updated.previewVideoUrl || undefined,
        price: updated.price,
        discountPrice: updated.discountPrice || undefined,
        level: updated.level as any,
        category: 'الثانوية العامة',
        status: updated.status as any,
        rejectionReason: updated.rejectionReason || undefined,
        instructorId: updated.instructorId,
        instructorName: updated.instructor?.name || 'المعلم',
        instructorAvatar: updated.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        instructorTitle: updated.instructor?.headline || 'خبير المادة التعليمية',
        averageRating: 4.95,
        totalStudents: 1420,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        sections: updated.sections.map(s => ({
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
      }
    });
  } catch (error: any) {
    console.error('Error updating course status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
