import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const grades = await prisma.academicGrade.findMany({
      include: { subjects: true },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, grades });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nameAr, nameEn, stage = 'المرحلة الثانوية', description = '' } = await request.json();
    const id = `grade_sec_${Date.now()}`;

    const newGrade = await prisma.academicGrade.create({
      data: {
        id,
        nameAr,
        nameEn: nameEn || nameAr,
        stage,
        description
      }
    });

    return NextResponse.json({ success: true, grade: newGrade });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nameAr, nameEn, stage, description } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing grade id' }, { status: 400 });

    const updated = await prisma.academicGrade.update({
      where: { id },
      data: {
        nameAr: nameAr || undefined,
        nameEn: nameEn || undefined,
        stage: stage || undefined,
        description: description !== undefined ? description : undefined
      }
    });

    return NextResponse.json({ success: true, grade: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing grade id' }, { status: 400 });

    await prisma.academicGrade.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

