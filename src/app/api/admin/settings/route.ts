import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let config = await prisma.systemConfig.findFirst();

    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          id: 'default',
          platformCommissionRate: 15.0,
          payoutMinimumThreshold: 50.0,
          bannerAnnouncement: '🚀 مرحباً بكم في منصة YA7EDU الرقمية الذكية - العام الدراسي 2026',
          isMaintenanceMode: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      config: {
        commissionRate: config.platformCommissionRate,
        minPayoutThreshold: config.payoutMinimumThreshold,
        bannerText: config.bannerAnnouncement || '',
        bannerEnabled: Boolean(config.bannerAnnouncement && config.bannerAnnouncement.trim().length > 0),
        maintenanceMode: Boolean(config.isMaintenanceMode)
      }
    });
  } catch (error: any) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      commissionRate,
      minPayoutThreshold,
      bannerText,
      bannerEnabled,
      maintenanceMode
    } = body;

    const bannerAnnouncement = bannerEnabled ? (bannerText || '') : '';

    const updated = await prisma.systemConfig.upsert({
      where: { id: 'default' },
      update: {
        platformCommissionRate: Number(commissionRate) !== undefined ? Number(commissionRate) : 15,
        payoutMinimumThreshold: Number(minPayoutThreshold) !== undefined ? Number(minPayoutThreshold) : 50,
        bannerAnnouncement,
        isMaintenanceMode: Boolean(maintenanceMode)
      },
      create: {
        id: 'default',
        platformCommissionRate: Number(commissionRate) !== undefined ? Number(commissionRate) : 15,
        payoutMinimumThreshold: Number(minPayoutThreshold) !== undefined ? Number(minPayoutThreshold) : 50,
        bannerAnnouncement,
        isMaintenanceMode: Boolean(maintenanceMode)
      }
    });

    return NextResponse.json({
      success: true,
      config: {
        commissionRate: updated.platformCommissionRate,
        minPayoutThreshold: updated.payoutMinimumThreshold,
        bannerText: updated.bannerAnnouncement || '',
        bannerEnabled: Boolean(updated.bannerAnnouncement && updated.bannerAnnouncement.trim().length > 0),
        maintenanceMode: Boolean(updated.isMaintenanceMode)
      }
    });
  } catch (error: any) {
    console.error('Error updating platform settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

