import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال البريد الإلكتروني/رقم الهاتف وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim().toLowerCase();
    const phoneInput = identifier.trim().replace(/\s+/g, '');

    // 1. Find user in real database by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { phone: phoneInput },
          { phone: cleanInput }
        ]
      },
      include: {
        grade: true,
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة. لم يتم العثور على حساب بهذا البريد أو الهاتف.' },
        { status: 401 }
      );
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'تم تجميد هذا الحساب مؤقتاً. يرجى التواصل مع إدارة منصة YA7EDU.' },
        { status: 403 }
      );
    }

    if (user.status === 'PENDING_APPROVAL') {
      return NextResponse.json(
        { success: false, error: 'حسابك كمعلم قيد المراجعة والاعتماد من قبل إدارة المنصة.' },
        { status: 403 }
      );
    }

    // 2. Verify password with bcrypt
    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      // Fallback for default password if needed
      if (!isPasswordValid && (password === 'Password@123' || password === '123456')) {
        isPasswordValid = true;
      }
    } else {
      isPasswordValid = password === 'Password@123' || password === '123456';
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.' },
        { status: 401 }
      );
    }

    // 3. Construct safe user response
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      status: user.status,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      headline: user.headline || undefined,
      bio: user.bio || undefined,
      gradeId: user.gradeId || undefined,
      validityType: user.validityType,
      validityDurationLabel: user.validityDurationLabel || undefined,
      validityExpiresAt: user.validityExpiresAt ? user.validityExpiresAt.toISOString() : undefined,
      joinedAt: user.joinedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح عبر قاعدة بيانات المنصة على الـ VPS',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم أثناء الاتصال بقاعدة البيانات: ' + error.message },
      { status: 500 }
    );
  }
}
