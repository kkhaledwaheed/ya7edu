'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { VoucherDuration } from '@/lib/types';
import {
  X,
  CreditCard,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Calendar,
  Smartphone,
  ShieldCheck,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  subjectId: string;
  subjectName: string;
  onSuccess?: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  instructorId,
  instructorName,
  instructorAvatar,
  subjectId,
  subjectName,
  onSuccess
}: SubscriptionModalProps) {
  const { subscribeWithPayment, redeemVoucher, vouchers } = useLMS();

  const [activeTab, setActiveTab] = useState<'voucher' | 'direct_pay'>('voucher');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // حالة الدفع الإلكتروني
  const [selectedDuration, setSelectedDuration] = useState<VoucherDuration>('FULL_TERM');
  const [payMethod, setPayMethod] = useState<'CREDIT_CARD' | 'DIGITAL_WALLET'>('CREDIT_CARD');
  const [processingPay, setProcessingPay] = useState(false);

  if (!isOpen) return null;

  // كارت تجريبي للاستخدام السريع
  const sampleVoucher =
    vouchers.find(v => v.status === 'AVAILABLE' && (v.instructorId === instructorId || v.subjectId === subjectId)) ||
    vouchers.find(v => v.status === 'AVAILABLE');

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);
    setVoucherSuccess(null);

    if (!voucherInput.trim()) {
      setVoucherError('يرجى كتابة كود الكارت أولاً.');
      return;
    }

    const res = redeemVoucher(voucherInput);
    if (res.success) {
      setVoucherSuccess(res.message);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } else {
      setVoucherError(res.message);
    }
  };

  const handleDirectPay = () => {
    setProcessingPay(true);
    setTimeout(() => {
      subscribeWithPayment(instructorId, subjectId, selectedDuration, payMethod);
      setProcessingPay(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onClose();
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans text-right" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl glass-card border border-cyan-500/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3.5 mb-5 pl-8">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-cyan-500/40 shrink-0"
          />
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              اشتراك المعلم المعتمد
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight">
              الاشتراك مع {instructorName}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{subjectName}</p>
          </div>
        </div>

        {/* أزرار التبديل بين الشحن بالكارت والدفع الإلكتروني */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-900 border border-gray-800 mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('voucher')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'voucher'
                ? 'bg-amber-500 text-gray-950 shadow-md font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>كارت الشحن الورقي (كود السنتر)</span>
          </button>

          <button
            onClick={() => setActiveTab('direct_pay')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'direct_pay'
                ? 'bg-cyan-500 text-gray-950 shadow-md font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>دفع إلكتروني فوري</span>
          </button>
        </div>

        {/* الخيار الأول: كارت الشحن الورقي */}
        {activeTab === 'voucher' && (
          <form onSubmit={handleRedeemVoucher} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>تفعيل كارت المنصة الورقي المعتمد</span>
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                أدخل الكود المطبوع على كارت السنتر أو المكتبة المعتمدة لتفعيل الاشتراك فوراً للمدة المحددة (شهر / 3 أشهر / ترم / سنة).
              </p>
            </div>

            {/* مساعد الكود التجريبي */}
            {sampleVoucher && (
              <div className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-gray-400 truncate pl-2">
                  <span>كارت تجريبي متاح: </span>
                  <span className="font-mono text-amber-400 font-bold">{sampleVoucher.code}</span>
                  <span className="text-[10px] text-gray-400 block">{sampleVoucher.durationLabelAr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoucherInput(sampleVoucher.code)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-gray-950 text-cyan-300 text-[11px] font-bold shrink-0 transition"
                >
                  استخدم الكود
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                أدخل كود الكارت المكون من 12 خانة
              </label>
              <input
                type="text"
                value={voucherInput}
                onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="مثال: YA7EDU-PHY-1M"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-base text-white font-mono uppercase tracking-wider text-center focus:outline-none focus:border-amber-500"
              />
            </div>

            {voucherError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{voucherError}</span>
              </div>
            )}

            {voucherSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{voucherSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-gray-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>شحن وتفعيل الاشتراك الآن</span>
            </button>
          </form>
        )}

        {/* الخيار الثاني: الدفع الإلكتروني المباشر */}
        {activeTab === 'direct_pay' && (
          <div className="space-y-4 text-xs">
            {/* مدة الاشتراك */}
            <div>
              <label className="font-bold text-gray-300 block mb-2">اختر مدة وباقة الاشتراك</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDuration('1_MONTH')}
                  className={`p-3 rounded-xl border text-right transition ${
                    selectedDuration === '1_MONTH'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <div className="text-xs">اشتراك شهر واحد</div>
                  <div className="text-base font-mono font-bold text-cyan-300 mt-1">180 جنيه</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDuration('FULL_TERM')}
                  className={`p-3 rounded-xl border text-right transition relative ${
                    selectedDuration === 'FULL_TERM'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <span className="absolute -top-2 left-2 text-[9px] bg-emerald-500 text-gray-950 px-2 py-0.2 rounded-full font-bold">
                    الأكثر طلباً
                  </span>
                  <div className="text-xs">اشتراك الفصل الدراسي كاملاً</div>
                  <div className="text-base font-mono font-bold text-emerald-400 mt-1">450 جنيه</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDuration('FULL_YEAR')}
                  className={`col-span-2 p-3.5 rounded-xl border text-right transition ${
                    selectedDuration === 'FULL_YEAR'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">اشتراك العام الدراسي كاملاً (VIP)</div>
                      <div className="text-[10px] text-gray-400">يشمل مذكرات YA7EDU الحصرية والمراجعات النهائية وليالي الامتحان</div>
                    </div>
                    <div className="text-base font-mono font-extrabold text-amber-300">800 جنيه</div>
                  </div>
                </button>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div>
              <label className="font-bold text-gray-300 block mb-2">طريقة الدفع المعتمدة</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('CREDIT_CARD')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    payMethod === 'CREDIT_CARD'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>بطاقة بنكية (فيزا / ماستركارد)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('DIGITAL_WALLET')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    payMethod === 'DIGITAL_WALLET'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>فودافون كاش / انستاباي</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleDirectPay}
              disabled={processingPay}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-gray-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{processingPay ? 'جاري تأكيد الدفع...' : 'إتمام الاشتراك وتأكيد الدفع الآمن'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
