'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info,
  CalendarDays,
  MessageCircle
} from 'lucide-react';

interface InstructorSubscriptionCardProps {
  instructor: User;
  showRenewalAction?: boolean;
}

export function InstructorSubscriptionCard({
  instructor,
  showRenewalAction = true
}: InstructorSubscriptionCardProps) {
  const [mountedTime, setMountedTime] = useState<number>(() => Date.now());

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);

  const isLifetime = instructor.validityType === 'LIFETIME';
  const startDate = new Date(instructor.joinedAt || '2024-09-01T00:00:00Z');
  const now = new Date(mountedTime);

  // 1. حساب "مشترك قد إيه" (Elapsed Time)
  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const elapsedDays = Math.floor(elapsedMs / (1000 * 3600 * 24));
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedDaysRemainder = elapsedDays % 30;

  const formattedElapsedText =
    elapsedMonths > 0
      ? `${elapsedMonths} شهر ${elapsedDaysRemainder > 0 ? `و ${elapsedDaysRemainder} يوم` : ''}`
      : `${elapsedDays} يوم`;

  // 2. حساب "لسه له قد إيه عشان اشتراكو يخلص" (Time Remaining)
  const expiresDate = instructor.validityExpiresAt ? new Date(instructor.validityExpiresAt) : null;
  const remainingMs = expiresDate ? expiresDate.getTime() - now.getTime() : null;
  const isExpired = remainingMs !== null && remainingMs <= 0;
  const remainingDays = remainingMs !== null ? Math.max(0, Math.ceil(remainingMs / (1000 * 3600 * 24))) : null;
  const remainingMonths = remainingDays !== null ? Math.floor(remainingDays / 30) : null;
  const remainingDaysRemainder = remainingDays !== null ? remainingDays % 30 : null;

  const formattedRemainingText =
    remainingMonths !== null
      ? remainingMonths > 0
        ? `${remainingMonths} شهر ${remainingDaysRemainder && remainingDaysRemainder > 0 ? `و ${remainingDaysRemainder} يوم` : ''}`
        : `${remainingDays} يوم`
      : 'غير محدد';

  // حساب نسبة شريط التقدم الزمني
  let progressPercent = 0;
  if (!isLifetime && expiresDate) {
    const totalDurationMs = expiresDate.getTime() - startDate.getTime();
    if (totalDurationMs > 0) {
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));
    }
  }

  // واتساب الإدارة المعتمد لتجديد الاشتراكات: 01090138676
  const whatsappNumber = '201090138676';
  const whatsappDisplayNumber = '01090138676';
  const whatsappMessage = encodeURIComponent(
    `السلام عليكم إدارة منصة YA7EDU،\n` +
    `أرغب في طلب تجديد / تمديد اشتراك حسابي كمعلم على المنصة.\n\n` +
    `• اسم المعلم: ${instructor.name}\n` +
    `• البريد الإلكتروني: ${instructor.email}\n` +
    (instructor.phone ? `• رقم الهاتف: ${instructor.phone}\n` : '') +
    `• نوع الاشتراك الحالي: ${instructor.validityDurationLabel || (isLifetime ? 'مفتوح مدى الحياة' : 'محدد المدة')}\n` +
    (expiresDate ? `• تاريخ انتهاء الصلاحية: ${expiresDate.toLocaleDateString('ar-EG')}\n` : '') +
    (remainingDays !== null ? `• الأيام المتبقية: ${remainingDays} يوم\n` : '') +
    `\nيرجى التواصل لتجديد وتمديد الصلاحية.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="rounded-3xl glass-card border border-indigo-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-gray-900 to-slate-950">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400">حالة وخطة اشتراك المعلم في المنصة</div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{instructor.validityDurationLabel || (isLifetime ? 'مفتوح مدى الحياة' : 'محدد المدة')}</span>
                {isLifetime ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>مفتوح مدى الحياة ♾️</span>
                  </span>
                ) : isExpired ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>منتهي الصلاحية</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>ساري ونشط</span>
                  </span>
                )}
              </h3>
            </div>
          </div>

          {showRenewalAction && !isLifetime && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition" />
              <span>طلب تجديد الاشتراك عبر واتساب ({whatsappDisplayNumber})</span>
            </a>
          )}
        </div>

        {/* The Two Critical Metrics: (1) مشترك قد إيه + (2) لسه له قد إيه */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box 1: هو مشترك قد إيه */}
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>المدة المنقضية (مشترك قد إيه)</span>
              </span>
              <span className="font-mono text-[11px] text-gray-500">
                بدأ في: {startDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' })}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-baseline gap-2">
              <span>مشترك منذ {formattedElapsedText}</span>
              <span className="text-xs text-gray-400 font-normal">({elapsedDays} يوماً)</span>
            </div>
            <p className="text-[11px] text-gray-400">
              حساب المعلم مفعل وينشر محتواه على YA7EDU بنجاح منذ تاريخ البدء.
            </p>
          </div>

          {/* Box 2: لسه له قد إيه عشان اشتراكو يخلص */}
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>المدة المتبقية (لسه له قد إيه)</span>
              </span>
              {expiresDate && (
                <span className="font-mono text-[11px] text-amber-400">
                  ينتهي في: {expiresDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                </span>
              )}
            </div>

            {isLifetime ? (
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
                  <span>صلاحية دائمة مدى الحياة</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  لا يوجد تاريخ انتهاء لاشتراكك. حسابك مفتوح دائم بدون أي قيود زمنية.
                </p>
              </div>
            ) : isExpired ? (
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-black text-rose-400 flex items-center gap-2">
                  <span>انتهت الصلاحية!</span>
                </div>
                <p className="text-[11px] text-rose-300/80">
                  انتهت فترة اشتراكك في المنصة. تواصل مع الإدارة لتجديد وتمديد فترة الاشتراك فوراً.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>تجديد فوري عبر واتساب ({whatsappDisplayNumber})</span>
                </a>
              </div>
            ) : (
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono flex items-baseline gap-2">
                  <span>متبقي {formattedRemainingText}</span>
                  <span className="text-xs text-gray-400 font-normal">({remainingDays} يوماً)</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  ساري حتى نهاية الفترة المحددة، ويمكنك طلب التمديد في أي وقت قبل الانتهاء.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Visual Progress Bar (if time limited and not expired) */}
        {!isLifetime && expiresDate && !isExpired && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <span>الجدول الزمني للاشتراك</span>
                <span className="text-gray-500 text-[10px]">({progressPercent}% منقضي)</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold text-xs">
                متبقي {100 - progressPercent}% من المدة
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
