'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  BookOpen,
  MapPin,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { users, currentUser, switchRole, academicGrades, setStudentGradeId } = useLMS();

  // Mode: 'LOGIN' or 'REGISTER'
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Student Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regGradeId, setRegGradeId] = useState('grade_sec_3');
  const [regStream, setRegStream] = useState('علمي علوم');
  const [regGovernorate, setRegGovernorate] = useState('القاهرة');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Automatic Role Detection & Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanInput = identifier.trim().toLowerCase();

    setTimeout(() => {
      // 1. Search for existing user by email or phone
      const matchedUser = users.find(u => {
        const uEmail = u.email ? u.email.toLowerCase() : '';
        const uPhone = u.phone ? u.phone.replace(/\s+/g, '') : '';
        const inputClean = cleanInput.replace(/\s+/g, '');
        return uEmail === cleanInput || uPhone === inputClean;
      });

      if (matchedUser) {
        // Automatic Role Detection
        switchRole(matchedUser.role);
        if (matchedUser.role === 'ADMIN') {
          router.push('/admin');
        } else if (matchedUser.role === 'INSTRUCTOR') {
          router.push('/instructor/studio');
        } else {
          router.push('/student');
        }
        return;
      }

      // 2. Fallback Smart Keyword Detection for test accounts
      if (cleanInput.includes('admin') || cleanInput.includes('vance')) {
        switchRole('ADMIN');
        router.push('/admin');
      } else if (
        cleanInput.includes('teacher') ||
        cleanInput.includes('inst') ||
        cleanInput.includes('ahmed') ||
        cleanInput.includes('samy') ||
        cleanInput.includes('mohamed')
      ) {
        switchRole('INSTRUCTOR');
        router.push('/instructor/studio');
      } else {
        // Default to student
        switchRole('STUDENT');
        router.push('/student');
      }
    }, 600);
  };

  // Student Account Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword.length < 6) {
      setErrorMsg('يجب أن تتكون كلمة المرور من 6 خانات على الأقل.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين، يرجى إعادة التأكد.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Switch role to student and update their academic grade
      switchRole('STUDENT');
      setStudentGradeId(regGradeId);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      router.push('/student');
    }, 700);
  };

  // Quick Client Demo Autofill & Login
  const handleQuickDemo = (demoId: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    setIsLoading(true);
    if (demoId === 'ADMIN') {
      setIdentifier('elena.vance@ya7edu-lms.com');
      setPassword('admin123');
      switchRole('ADMIN');
      setTimeout(() => router.push('/admin'), 400);
    } else if (demoId === 'INSTRUCTOR') {
      setIdentifier('ahmed.samy@physics-hub.com');
      setPassword('teacher123');
      switchRole('INSTRUCTOR');
      setTimeout(() => router.push('/instructor/studio'), 400);
    } else {
      setIdentifier('sophia.thanawya@student.eg');
      setPassword('student123');
      switchRole('STUDENT');
      setTimeout(() => router.push('/student'), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-amber-500/10 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl font-mono text-white">
            YA7<span className="text-cyan-400">EDU</span>
          </span>
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg rounded-3xl glass-card border border-gray-800 p-6 sm:p-8 shadow-2xl text-right relative overflow-hidden">
          {/* Main Title & Subtitle */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>منظومة التعليم الرقمي الذكية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === 'LOGIN' ? 'تسجيل الدخول إلى المنصة' : 'إنشاء حساب طالب جديد'}
            </h1>
            <p className="text-xs text-gray-400">
              {authMode === 'LOGIN'
                ? 'أدخل بيانات حسابك وسيتعرف النظام تلقائياً على نوع الحساب وتوجيهك لبوابتك'
                : 'سجّل بياناتك لتفعيل المرحلة الدراسية وبدء مشاهدة المحاضرات والامتحانات'}
            </p>
          </div>

          {/* Toggle Between Login & Create Account */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-gray-950 border border-gray-800 text-xs font-bold mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                authMode === 'LOGIN'
                  ? 'bg-cyan-500 text-gray-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                authMode === 'REGISTER'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب طالب</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: LOGIN (Automatic Role Detection)                       */}
          {/* ============================================================ */}
          {authMode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1.5">
                  رقم الهاتف أو البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="مثال: 01012345678 أو البريد الإلكتروني"
                    className="w-full pl-3 pr-10 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <Phone className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-300 font-semibold">كلمة المرور</label>
                  <a
                    href="https://wa.me/201090138676"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-[11px] text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>التعرف التلقائي على الرتبة: يتم توجيهك مباشرة كطالب أو معلم أو إدارة المنصة.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-gray-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>جاري التحقق وتوجيه الحساب...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-gray-400">
                ليس لديك حساب بعد؟{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('REGISTER')}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  إنشاء حساب طالب الآن
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* TAB 2: REGISTER NEW STUDENT ACCOUNT                          */}
          {/* ============================================================ */}
          {authMode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  اسم الطالب ثلاثي / رباعي *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="مثال: عمر خالد عبد الرحمن"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    رقم هاتف الطالب (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    رقم هاتف ولي الأمر *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regParentPhone}
                    onChange={e => setRegParentPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    المرحلة والصف الدراسي *
                  </label>
                  <select
                    value={regGradeId}
                    onChange={e => setRegGradeId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {academicGrades.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    الشعبة الدراسية
                  </label>
                  <select
                    value={regStream}
                    onChange={e => setRegStream(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="علمي علوم">علمي علوم</option>
                    <option value="علمي رياضة">علمي رياضة</option>
                    <option value="أدبي">أدبي</option>
                    <option value="عام">عام (أولى ثانوي)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">المحافظة</label>
                <input
                  type="text"
                  value={regGovernorate}
                  onChange={e => setRegGovernorate(e.target.value)}
                  placeholder="مثال: القاهرة / الجيزة / الإسكندرية..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">كلمة المرور *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">تأكيد كلمة المرور *</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>جاري إنشاء الحساب وتفعيله...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء الحساب وبدء المذاكرة الآن</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-gray-400">
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  تسجيل الدخول هنا
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Autofill Links for the Client */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 space-y-2">
            <div className="text-[11px] font-bold text-gray-400 text-center">
              حسابات تجريبية سريعة لفحص النظام وتقييم العميل:
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className="p-2.5 rounded-xl bg-gray-900/90 hover:bg-cyan-500/20 border border-gray-800 hover:border-cyan-500/40 text-gray-200 transition"
                title="دخول تلقائي كطالب"
              >
                <UserCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold block text-[11px]">طالب</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('INSTRUCTOR')}
                className="p-2.5 rounded-xl bg-gray-900/90 hover:bg-indigo-500/20 border border-gray-800 hover:border-indigo-500/40 text-gray-200 transition"
                title="دخول تلقائي كمعلم"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span className="font-bold block text-[11px]">معلم</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="p-2.5 rounded-xl bg-gray-900/90 hover:bg-rose-500/20 border border-gray-800 hover:border-rose-500/40 text-gray-200 transition"
                title="دخول تلقائي كمسؤول"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <span className="font-bold block text-[11px]">مسؤول</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-6 text-center text-xs text-gray-500">
        منصة YA7EDU التعليمية &bull; دعم العملاء والسناتر واتساب: {' '}
        <a
          href="https://wa.me/201090138676"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 font-mono font-bold hover:underline"
        >
          01090138676
        </a>
      </footer>
    </div>
  );
}
