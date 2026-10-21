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
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentSubscriptionsPage() {
  const { currentUser, subscriptions, redeemVoucher, vouchers } = useLMS();

  const [inputCode, setInputCode] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mountedTime, setMountedTime] = useState<number | null>(null);

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
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Ticket className="w-3.5 h-3.5" />
          <span>إدارة اشتراكات المدرسين وشحن الكروت</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          اشتراكاتك وكروت الشحن المفعلة
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          متابعة فترات صلاحية اشتراكاتك مع مدرسي المواد، وتفعيل كروت الشحن الجديدة.
        </p>
      </div>

      {/* Quick Redeem Voucher Card Box */}
      <form onSubmit={handleRedeem} className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-amber-950/30 border border-amber-500/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تفعيل كارت شحن جديد (أكواد السنتر والمكتبات)</h3>
              <p className="text-[11px] text-gray-400">أدخل الكود المطبوع على ظهر الكارت</p>
            </div>
          </div>

          {availableTestVoucher && (
            <button
              type="button"
              onClick={() => setInputCode(availableTestVoucher.code)}
              className="text-[11px] font-mono text-amber-400 hover:underline hidden sm:inline"
            >
              استخدم كود تجريبي ({availableTestVoucher.code})
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={e => setInputCode(e.target.value.toUpperCase())}
            placeholder="مثال: YA7EDU-PHY-1M"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>شحن الكارت فوراً</span>
          </button>
        </div>

        {alert && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              alert.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{alert.text}</span>
          </div>
        )}
      </form>

      {/* Active Subscriptions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
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
                  className="rounded-3xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {sub.paymentMethod === 'VOUCHER_CARD' ? 'كارت شحن' : 'دفع إلكتروني'}
                      </span>
                      <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>متبقي {daysRemaining} يوم</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={sub.instructorAvatar}
                        alt={sub.instructorName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                          {sub.instructorName}
                        </h3>
                        <p className="text-xs text-cyan-400 font-semibold">{sub.subjectName}</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-gray-900/60 text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between text-gray-400 text-[11px]">
                        <span>تاريخ التفعيل:</span>
                        <span>{new Date(sub.activatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 text-[11px]">
                        <span>تاريخ الانتهاء:</span>
                        <span>{new Date(sub.expiresAt).toLocaleDateString()}</span>
                      </div>
                      {sub.voucherCodeUsed && (
                        <div className="flex justify-between text-amber-400 text-[11px] font-mono">
                          <span>كود الكارت:</span>
                          <span>{sub.voucherCodeUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-800">
                    <Link
                      href={`/student/player?instructorId=${sub.instructorId}&subjectId=${sub.subjectId}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
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
          <div className="p-8 rounded-2xl glass-card border border-gray-800 text-center text-gray-400 text-xs">
            لا توجد اشتراكات نشطة حالياً. اشحن كارت أو اشترك مع مدرس لبدء الدراسة!
          </div>
        )}
      </div>
    </div>
  );
}
