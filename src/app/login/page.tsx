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
  Check,
  Ticket,
  Shield,
  Play,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { academicGrades, loginUser } = useLMS();

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

  // Real Login against VPS Database
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
        setIsLoading(false);
        return;
      }

      // Successfully authenticated against VPS MySQL Database!
      loginUser(data.user);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Role-based real routing
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user.role === 'INSTRUCTOR') {
        router.push('/instructor/studio');
      } else {
        router.push('/student');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('حدث خطأ أثناء الاتصال بقاعدة البيانات على السيرفر: ' + err.message);
      setIsLoading(false);
    }
  };

  // Real Student Registration in VPS Database
  const handleRegisterSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regFullName,
          phone: regPhone,
          parentPhone: regParentPhone,
          password: regPassword,
          gradeId: regGradeId,
          stream: regStream,
          governorate: regGovernorate
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'فشل إنشاء الحساب، يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
        return;
      }

      // Saved in VPS MySQL database!
      loginUser(data.user);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      router.push('/student');
    } catch (err: any) {
      console.error('Register error:', err);
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Glows (White & Blue) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-sky-400/10 to-indigo-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 sm:px-12 flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-2xs"
        >
          <ArrowRight className="w-4 h-4 text-blue-600" />
          <span>العودة للرئيسية</span>
        </Link>

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block font-mono">
              YA7<span className="text-blue-600">EDU</span>
            </span>
            <span className="text-[10px] text-slate-500 block -mt-1 font-semibold">
              المنظومة التعليمية الذكية للثانوية العامة
            </span>
          </div>
        </Link>
      </header>

      {/* Main Dual-Pane Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 z-10">
        <div className="w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Decorative/Informational Enterprise Pane */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl -z-10" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>قاعدة بيانات سحابية متصلة بالـ VPS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                منصة الثانوية العامة الأولى في مصر 🎓
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-3 leading-relaxed">
                حسابك يوفر لك وصولاً مباشراً لنخبة مدرسي مصر، وتدريبات الحل الذاتي مع التفسير الفوري، وأمان تام لمنع تسريب الامتحانات.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>حصتان كاملتان شرح مجاناً لكل مادة لمعاينة الشرح</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>شحن اشتراكات السناتر بكروت الخدش الورقية فوراً</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>نظام حجب النتيجة والحل لمنع تسريب الامتحانات</span>
                </div>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="mt-8 pt-6 border-t border-white/20 text-xs text-blue-100 flex items-center justify-between">
              <span>هل تواجه مشكلة في تسجيل الدخول؟</span>
              <a
                href="https://wa.me/201090138676"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>الدعم الفني</span>
              </a>
            </div>
          </div>

          {/* Right Form Pane: Login or Register */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-right">
            {/* Tabs: Login vs Register */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'LOGIN'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
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
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'REGISTER'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب طالب جديد</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {authMode === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">تسجيل الدخول للمنظومة</h3>
                  <p className="text-xs text-slate-500">
                    أدخل رقم الهاتف أو البريد الإلكتروني وكلمة المرور للدخول المباشر.
                  </p>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    رقم الهاتف أو البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="مثال: 01012345678 أو email@example.com"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-sans"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold block">كلمة المرور</label>
                    <a
                      href="https://wa.me/201090138676?text=نسيت%20كلمة%20المرور%20في%20منصة%20YA7EDU"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>جاري التحقق من الحساب على السيرفر...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>دخول الحساب</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2 text-xs text-slate-500">
                  طالب جديد؟{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('REGISTER')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    أنشئ حسابك الآن مجاناً
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">تسجيل طالب جديد</h3>
                  <p className="text-xs text-slate-500">
                    سجل بياناتك للوصول الفوري للمحاضرات المجانية وبدء المذاكرة.
                  </p>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    اسم الطالب ثلاثي أو رباعي بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي حسن"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      رقم هاتف الطالب (واتساب) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      رقم هاتف ولي الأمر *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regParentPhone}
                      onChange={e => setRegParentPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      الصف الدراسي *
                    </label>
                    <select
                      value={regGradeId}
                      onChange={e => setRegGradeId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      {academicGrades.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      الشعبة الدراسية
                    </label>
                    <select
                      value={regStream}
                      onChange={e => setRegStream(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="علمي علوم">علمي علوم</option>
                      <option value="علمي رياضة">علمي رياضة</option>
                      <option value="أدبي">أدبي</option>
                      <option value="عام">عام (أولى ثانوي)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={regGovernorate}
                    onChange={e => setRegGovernorate(e.target.value)}
                    placeholder="مثال: القاهرة / الجيزة / الإسكندرية..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">تأكيد كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>جاري حفظ الحساب في قاعدة البيانات...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب وبدء المذاكرة الآن</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1 text-xs text-slate-500">
                  لديك حساب بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('LOGIN')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    تسجيل الدخول هنا
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        منصة YA7EDU التعليمية &bull; دعم العملاء والسناتر واتساب:{' '}
        <a
          href="https://wa.me/201090138676"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 font-mono font-bold hover:underline inline-flex items-center gap-1"
        >
          <PhoneCall className="w-3 h-3" />
          <span>01090138676</span>
        </a>
      </footer>
    </div>
  );
}
