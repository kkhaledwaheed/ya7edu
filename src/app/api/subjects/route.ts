import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: { grade: true },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, subjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nameAr, nameEn, gradeId, icon = 'BookOpen', color = '#2563eb', description = '' } = await request.json();
    const id = `subj_${Date.now()}`;

    const newSubj = await prisma.subject.create({
      data: {
        id,
        nameAr,
        nameEn: nameEn || nameAr,
        gradeId,
        icon,
        color,
        description
      }
    });

    return NextResponse.json({ success: true, subject: newSubj });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nameAr, nameEn, icon, color, description } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing subject id' }, { status: 400 });

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        nameAr: nameAr || undefined,
        nameEn: nameEn || undefined,
        icon: icon || undefined,
        color: color || undefined,
        description: description !== undefined ? description : undefined
      }
    });

    return NextResponse.json({ success: true, subject: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing subject id' }, { status: 400 });

    await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

