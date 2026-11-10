'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  Ticket,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionModal } from '@/components/subscription/subscription-modal';

export default function StudentSubscriptionsPage() {
  const { currentUser, subscriptions, redeemVoucher, vouchers } = useLMS();

  const [inputCode, setInputCode] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mountedTime, setMountedTime] = useState<number | null>(null);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);

  const mySubs = subscriptions.filter(s => s.studentId === currentUser.id);
  const activeSubs = mySubs.filter(s => s.status === 'ACTIVE');

  // Sample voucher code to test with
  const availableTestVoucher = vouchers.find(v => v.status === 'AVAILABLE');

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!inputCode.trim()) return;

    const res = redeemVoucher(inputCode);
    if (res.success) {
      setAlert({ type: 'success', text: res.message });
      setInputCode('');
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } else {
      setAlert({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16 text-right" dir="rtl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Ticket className="w-3.5 h-3.5 text-blue-600" />
          <span>إدارة اشتراكات المدرسين وشحن الكروت</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          اشتراكاتك وكروت الشحن المفعلة
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          متابعة فترات صلاحية اشتراكاتك مع مدرسي المواد، وتفعيل كروت الشحن الورقية المشتراة من السنتر أو المكتبة.
        </p>
      </div>

      {/* Quick Redeem Voucher Card Box */}
      <form onSubmit={handleRedeem} className="p-6 sm:p-8 rounded-3xl bg-amber-50 border border-amber-200 space-y-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center ring-2 ring-amber-200 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">تفعيل كارت شحن جديد (أكواد السنتر والمكتبات)</h3>
              <p className="text-xs text-slate-500 mt-0.5">أدخل الكود المطبوع تحت طبقة الكشط على ظهر الكارت</p>
            </div>
          </div>

          {availableTestVoucher && (
            <button
              type="button"
              onClick={() => setInputCode(availableTestVoucher.code)}
              className="text-xs font-mono text-amber-800 hover:underline bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto font-bold"
            >
              استخدم كوداً تجريبياً ({availableTestVoucher.code})
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={e => setInputCode(e.target.value.toUpperCase())}
            placeholder="مثال: YA7EDU-PHY-1M"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono uppercase tracking-wider focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-2xs"
          />

          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>شحن الكارت فوراً</span>
          </button>
        </div>

        {alert && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
              alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{alert.text}</span>
          </div>
        )}
      </form>

      {/* WhatsApp Subscription CTA Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-2 ring-emerald-200 shrink-0">
            <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              معاكش كارت شحن؟ اشترك وحوّل عبر واتساب الإدارة فوراً
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              حوّل قيمة اشتراكك على فودافون كاش أو انستاباي (<strong>01090138676</strong>)، وهيفعلك الأدمن فور استلام الإيصال!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSubscribeModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition hover:scale-105 shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>اشتراك وتحويل عبر واتساب</span>
        </button>
      </div>

      {subscribeModalOpen && (
        <SubscriptionModal
          isOpen={subscribeModalOpen}
          onClose={() => setSubscribeModalOpen(false)}
          instructorId="inst_ahmed_samy"
          instructorName="الأستاذ أحمد سامي"
          instructorAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
          subjectId="subj_g3_phys"
          subjectName="الفيزياء (Physics)"
        />
      )}

      {/* Active Subscriptions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>الاشتراكات النشطة حالياً ({activeSubs.length})</span>
        </h2>

        {activeSubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeSubs.map(sub => {
              const expDate = new Date(sub.expiresAt);
              const daysRemaining = mountedTime
                ? Math.max(0, Math.ceil((expDate.getTime() - mountedTime) / (1000 * 3600 * 24)))
                : 30;

              return (
                <div
                  key={sub.id}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 p-5 flex flex-col justify-between transition-all duration-300 group shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.paymentMethod === 'VOUCHER_CARD' ? 'كارت سنتر' : 'دفع إلكتروني'}
                      </span>
                      <span className="text-xs text-amber-700 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>متبقي {daysRemaining} يوم</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img
                        src={sub.instructorAvatar}
                        alt={sub.instructorName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {sub.instructorName}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold">{sub.subjectName}</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-medium">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>تاريخ التفعيل:</span>
                        <span className="text-slate-800">{new Date(sub.activatedAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>تاريخ الانتهاء:</span>
                        <span className="text-slate-800">{new Date(sub.expiresAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      {sub.voucherCodeUsed && (
                        <div className="flex justify-between text-amber-700 text-[11px] font-mono pt-1 border-t border-slate-200">
                          <span>كود الكارت:</span>
                          <span className="font-bold">{sub.voucherCodeUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100">
                    <Link
                      href={`/student/player?instructorId=${sub.instructorId}&subjectId=${sub.subjectId}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition hover:scale-[1.01]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>فتح المحاضرات والمذكرات</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs space-y-2 shadow-2xs">
            <Ticket className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-900">لا توجد اشتراكات نشطة حالياً</p>
            <p>اشحن كارت السنتر بالأعلى أو اشترك مع مدرسك المفضل لبدء المذاكرة.</p>
          </div>
        )}
      </div>
    </div>
  );
}
