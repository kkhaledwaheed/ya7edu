import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('--> /api/instructor/content called with action:', body?.action);
    const { action } = body;

    // -------------------------------------------------------------
    // 1. ADD CHAPTER
    // -------------------------------------------------------------
    if (action === 'ADD_CHAPTER') {
      const { contentId, titleAr, titleEn, chapterNumber } = body;

      if (!contentId || !titleAr) {
        return NextResponse.json(
          { success: false, error: 'بيانات الباب الدراسي غير مكتملة' },
          { status: 400 }
        );
      }

      // Check if content exists
      const content = await prisma.instructorContent.findUnique({
        where: { id: contentId },
        include: { chapters: true }
      });

      if (!content) {
        return NextResponse.json(
          { success: false, error: 'محتوى المدرس غير موجود في قاعدة البيانات' },
          { status: 404 }
        );
      }

      const nextNumber = chapterNumber || content.chapters.length + 1;
      const newChapId = `chap_${Date.now()}`;

      const newChap = await prisma.chapter.create({
        data: {
          id: newChapId,
          contentId,
          chapterNumber: Number(nextNumber),
          titleAr: titleAr.trim(),
          titleEn: (titleEn || titleAr).trim()
        }
      });

      return NextResponse.json({
        success: true,
        chapter: {
          id: newChap.id,
          chapterNumber: newChap.chapterNumber,
          titleAr: newChap.titleAr,
          titleEn: newChap.titleEn,
          lessons: []
        }
      });
    }

    // -------------------------------------------------------------
    // 2. ADD LESSON
    // -------------------------------------------------------------
    if (action === 'ADD_LESSON') {
      const { chapterId, lesson } = body;

      if (!chapterId || !lesson || !lesson.titleAr) {
        return NextResponse.json(
          { success: false, error: 'بيانات المحاضرة غير مكتملة' },
          { status: 400 }
        );
      }

      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        include: { lessons: true }
      });

      if (!chapter) {
        return NextResponse.json(
          { success: false, error: 'الباب الدراسي غير موجود في قاعدة البيانات' },
          { status: 404 }
        );
      }

      const newLessonId = `les_${Date.now()}`;
      const nextOrder = chapter.lessons.length + 1;

      const newLesson = await prisma.lessonVideo.create({
        data: {
          id: newLessonId,
          chapterId,
          titleAr: lesson.titleAr.trim(),
          titleEn: (lesson.titleEn || lesson.titleAr).trim(),
          durationMinutes: Number(lesson.durationMinutes) || 45,
          videoUrl: lesson.videoUrl || '',
          order: nextOrder,
          isFree: Boolean(lesson.isFree),
          notes: lesson.notes ? lesson.notes.trim() : null
        }
      });

      return NextResponse.json({
        success: true,
        lesson: {
          id: newLesson.id,
          titleAr: newLesson.titleAr,
          titleEn: newLesson.titleEn,
          durationMinutes: newLesson.durationMinutes,
          videoUrl: newLesson.videoUrl,
          isFree: newLesson.isFree,
          isCompleted: false,
          notes: newLesson.notes || undefined
        }
      });
    }

    // -------------------------------------------------------------
    // 3. DELETE LESSON
    // -------------------------------------------------------------
    if (action === 'DELETE_LESSON') {
      const { lessonId } = body;
      if (!lessonId) {
        return NextResponse.json({ success: false, error: 'معرّف المحاضرة مطلوب' }, { status: 400 });
      }

      await prisma.lessonVideo.delete({
        where: { id: lessonId }
      });

      return NextResponse.json({ success: true, message: 'تم حذف المحاضرة بنجاح من قاعدة البيانات' });
    }

    // -------------------------------------------------------------
    // 4. ADD BOOKLET / REVISION ITEM
    // -------------------------------------------------------------
    if (action === 'ADD_BOOKLET') {
      const { contentId, item } = body;

      if (!contentId || !item || !item.titleAr) {
        return NextResponse.json(
          { success: false, error: 'بيانات الملف غير مكتملة' },
          { status: 400 }
        );
      }

      const newItemId = `bk_${Date.now()}`;
      const isRevision = item.type === 'REVISION';
      const isExclusive = item.type === 'YA7EDU_EXCLUSIVE';

      const created = await prisma.bookletItem.create({
        data: {
          id: newItemId,
          contentId,
          titleAr: item.titleAr.trim(),
          titleEn: (item.titleEn || item.titleAr).trim(),
          chapterTitle: item.chapterTitle || 'عام',
          pageCount: Number(item.pageCount) || (isRevision ? 30 : 25),
          fileSize: item.fileSize || '15 MB',
          downloadUrl: item.downloadUrl || '#',
          type: item.type || (isRevision ? 'REVISION' : 'BOOKLET'),
          uploadDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          isExclusive: Boolean(isExclusive),
          isFree: Boolean(item.isFree),
          format: item.format || 'PDF',
          videoUrl: item.videoUrl || null,
          durationMinutes: item.durationMinutes ? Number(item.durationMinutes) : null
        }
      });

      // Handle interactive practice questions if provided
      if (item.questions && Array.isArray(item.questions) && item.questions.length > 0) {
        for (let i = 0; i < item.questions.length; i++) {
          const q = item.questions[i];
          if (q.questionAr && q.questionAr.trim()) {
            await prisma.bookletQuestion.create({
              data: {
                id: `bq_${Date.now()}_${i + 1}`,
                bookletId: newItemId,
                questionAr: q.questionAr.trim(),
                options: JSON.stringify(q.options || ['أ', 'ب', 'ج', 'د']),
                correctIndex: Number(q.correctIndex) || 0,
                explanationAr: q.explanationAr ? q.explanationAr.trim() : ''
              }
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        item: {
          id: created.id,
          titleAr: created.titleAr,
          titleEn: created.titleEn,
          chapterTitle: created.chapterTitle,
          pageCount: created.pageCount,
          fileSize: created.fileSize,
          downloadUrl: created.downloadUrl,
          type: created.type,
          format: created.format,
          isFree: created.isFree,
          videoUrl: created.videoUrl || undefined,
          durationMinutes: created.durationMinutes || undefined,
          questions: item.questions || []
        }
      });
    }

    // -------------------------------------------------------------
    // 5. DELETE BOOKLET / REVISION ITEM
    // -------------------------------------------------------------
    if (action === 'DELETE_BOOKLET') {
      const { itemId } = body;
      if (!itemId) {
        return NextResponse.json({ success: false, error: 'معرّف الملف مطلوب' }, { status: 400 });
      }

      await prisma.bookletItem.delete({
        where: { id: itemId }
      });

      return NextResponse.json({ success: true, message: 'تم حذف الملف بنجاح من قاعدة البيانات' });
    }

    // -------------------------------------------------------------
    // 6. CREATE EXAM
    // -------------------------------------------------------------
    if (action === 'CREATE_EXAM') {
      const { exam } = body;
      if (!exam || !exam.title || !exam.instructorId || !exam.subjectId) {
        return NextResponse.json(
          { success: false, error: 'بيانات الامتحان غير مكتملة' },
          { status: 400 }
        );
      }

      const newExamId = `exam_${Date.now()}`;

      const createdExam = await prisma.instructorExam.create({
        data: {
          id: newExamId,
          instructorId: exam.instructorId,
          instructorName: exam.instructorName || 'المعلم',
          instructorAvatar: exam.instructorAvatar || null,
          subjectId: exam.subjectId,
          subjectName: exam.subjectName || 'المادة الدراسية',
          gradeId: exam.gradeId || 'grade_sec_3',
          title: exam.title.trim(),
          description: exam.description ? exam.description.trim() : '',
          durationMinutes: Number(exam.durationMinutes) || 60,
          startDate: exam.startDate || null,
          startTime: exam.startTime || null,
          endDate: exam.endDate || null,
          endTime: exam.endTime || null,
          passingPercent: Number(exam.passingPercent) || 60,
          totalMarks: Number(exam.totalMarks) || 50,
          isPublished: exam.isPublished !== undefined ? Boolean(exam.isPublished) : true,
          hideResultUntilDurationEnds: exam.hideResultUntilDurationEnds !== undefined ? Boolean(exam.hideResultUntilDurationEnds) : true
        }
      });

      if (exam.questions && Array.isArray(exam.questions)) {
        for (let i = 0; i < exam.questions.length; i++) {
          const q = exam.questions[i];
          if (q.questionText && q.questionText.trim()) {
            await prisma.instructorExamQuestion.create({
              data: {
                id: `eq_${Date.now()}_${i + 1}`,
                examId: newExamId,
                questionText: q.questionText.trim(),
                options: JSON.stringify(q.options || []),
                correctOptionIndex: Number(q.correctOptionIndex) || 0,
                explanation: q.explanation || '',
                marks: Number(q.marks) || 2
              }
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        examId: createdExam.id,
        exam: createdExam
      });
    }

    // -------------------------------------------------------------
    // 7. DELETE EXAM
    // -------------------------------------------------------------
    if (action === 'DELETE_EXAM') {
      const { examId } = body;
      if (!examId) {
        return NextResponse.json({ success: false, error: 'معرّف الامتحان مطلوب' }, { status: 400 });
      }

      await prisma.instructorExamQuestion.deleteMany({ where: { examId } });
      await prisma.studentExamAttempt.deleteMany({ where: { examId } });
      await prisma.instructorExam.delete({ where: { id: examId } });

      return NextResponse.json({ success: true, message: 'تم حذف الامتحان بنجاح من قاعدة البيانات' });
    }

    // -------------------------------------------------------------
    // 8. DELETE CHAPTER
    // -------------------------------------------------------------
    if (action === 'DELETE_CHAPTER') {
      const { chapterId } = body;
      if (!chapterId) {
        return NextResponse.json({ success: false, error: 'معرّف الباب مطلوب' }, { status: 400 });
      }

      await prisma.lessonVideo.deleteMany({ where: { chapterId } });
      await prisma.chapter.delete({ where: { id: chapterId } });

      return NextResponse.json({ success: true, message: 'تم حذف الباب الدراسي بنجاح من قاعدة البيانات' });
    }

    return NextResponse.json({ success: false, error: 'الإجراء المطلوب غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Content update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'حدث خطأ في قاعدة البيانات' }, { status: 500 });
  }
}
