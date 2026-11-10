import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { examId, studentId, studentName, answers, totalScore, maxScore, scorePercent, passed, isUnlocked } = await request.json();

    const attempt = await prisma.studentExamAttempt.upsert({
      where: {
        id: `attempt_${studentId}_${examId}`
      },
      update: {
        answers: JSON.stringify(answers),
        totalScore,
        maxScore,
        scorePercent,
        passed,
        isUnlocked,
        submittedAt: new Date()
      },
      create: {
        id: `attempt_${studentId}_${examId}`,
        examId,
        studentId,
        studentName,
        answers: JSON.stringify(answers),
        totalScore,
        maxScore,
        scorePercent,
        passed,
        isUnlocked,
        submittedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    console.error('Exam submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

