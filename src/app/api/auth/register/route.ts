import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      parentPhone,
      email,
      password,
      gradeId = 'grade_sec_3',
      stream = 'علمي علوم',
      governorate = 'القاهرة'
    } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى ملء الحقول الإلزامية: الاسم بالكامل، رقم الهاتف، وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : `student_${cleanPhone}@ya7edu.com`;

    // 1. Check if phone or email already registered in VPS database
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: cleanPhone }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'رقم الهاتف أو البريد الإلكتروني مسجل بالفعل في منصة YA7EDU. يرجى تسجيل الدخول.' },
        { status: 409 }
      );
    }

    // 2. Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user in VPS MySQL database
    const newUser = await prisma.user.create({
      data: {
        id: `user_student_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        gradeId,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        headline: `طالب مسجل في ${gradeId === 'grade_sec_3' ? 'الصف الثالث الثانوي' : 'المرحلة الثانوية'}`,
        profile: {
          create: {
            notificationsEnabled: true
          }
        }
      },
      include: {
        profile: true,
        grade: true
      }
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || undefined,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      gradeId: newUser.gradeId || undefined,
      headline: newUser.headline || undefined,
      joinedAt: newUser.joinedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حساب الطالب بنجاح وحفظه في قاعدة بيانات المنصة!',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ الحساب في قاعدة البيانات: ' + error.message },
      { status: 500 }
    );
  }
}
