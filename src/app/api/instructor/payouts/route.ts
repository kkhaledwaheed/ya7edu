import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payouts = await prisma.payout.findMany({
      include: {
        instructor: true
      },
      orderBy: { requestedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      payouts: payouts.map(p => ({
        id: p.id,
        instructorId: p.instructorId,
        instructorName: p.instructor?.name || 'المعلم',
        instructorAvatar: p.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        amount: p.amount,
        status: p.status,
        requestedAt: p.requestedAt.toISOString(),
        payoutMethod: p.payoutMethod,
        accountDetails: p.accountDetails || undefined
      }))
    });
  } catch (error: any) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { instructorId, amount, method, account } = await request.json();

    if (!instructorId || !amount) {
      return NextResponse.json(
        { success: false, error: 'بيانات طلب السحب غير مكتملة' },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.create({
      data: {
        id: `pay_${Date.now()}`,
        instructorId,
        amount: Number(amount) || 1000,
        status: 'PENDING',
        payoutMethod: method || 'انستاباي (InstaPay Egypt)',
        accountDetails: account || null
      },
      include: {
        instructor: true
      }
    });

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        instructorId: payout.instructorId,
        instructorName: payout.instructor?.name || 'المعلم',
        instructorAvatar: payout.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        amount: payout.amount,
        status: payout.status,
        requestedAt: payout.requestedAt.toISOString(),
        payoutMethod: payout.payoutMethod,
        accountDetails: payout.accountDetails || undefined
      }
    });
  } catch (error: any) {
    console.error('Payout request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'معرّف الطلب والحالة مطلوبان' },
        { status: 400 }
      );
    }

    const updated = await prisma.payout.update({
      where: { id },
      data: {
        status,
        processedAt: status === 'PAID' ? new Date() : null
      },
      include: {
        instructor: true
      }
    });

    return NextResponse.json({
      success: true,
      payout: {
        id: updated.id,
        instructorId: updated.instructorId,
        instructorName: updated.instructor?.name || 'المعلم',
        instructorAvatar: updated.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        amount: updated.amount,
        status: updated.status,
        requestedAt: updated.requestedAt.toISOString(),
        payoutMethod: updated.payoutMethod,
        accountDetails: updated.accountDetails || undefined
      }
    });
  } catch (error: any) {
    console.error('Payout update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
