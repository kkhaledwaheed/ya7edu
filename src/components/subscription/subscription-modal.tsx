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
  Smartphone,
  ShieldCheck,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Clock,
  ArrowRight
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
  const { currentUser, redeemVoucher, vouchers, activeGradeDetails } = useLMS();

  const [activeTab, setActiveTab] = useState<'voucher' | 'direct_pay'>('direct_pay');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // حالة التحويل عبر واتساب
  const [selectedDuration, setSelectedDuration] = useState<VoucherDuration>('FULL_TERM');
  const [payMethod, setPayMethod] = useState<'VODAFONE_CASH' | 'INSTAPAY' | 'SMART_WALLET'>('VODAFONE_CASH');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [processingPay, setProcessingPay] = useState(false);
  const [whatsappSentSuccess, setWhatsappSentSuccess] = useState<{
    orderRef: string;
    whatsappUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const adminPhoneNumber = '01090138676';
  const adminWaInternational = '201090138676';

  const priceMap: Record<VoucherDuration, { amount: number; label: string; periodLabel: string }> = {
    '1_MONTH': { amount: 180, label: 'اشتراك شهر واحد', periodLabel: '30 يوماً كاملة' },
    '3_MONTHS': { amount: 450, label: 'اشتراك 3 أشهر', periodLabel: '90 يوماً كاملة' },
    'FULL_TERM': { amount: 450, label: 'اشتراك الفصل الدراسي كاملاً', periodLabel: 'الفصل الدراسي كاملاً' },
    'FULL_YEAR': { amount: 800, label: 'اشتراك العام كاملاً (VIP)', periodLabel: 'العام كاملاً مع مذكرات YA7EDU' }
  };

  const currentPrice = priceMap[selectedDuration] || priceMap['FULL_TERM'];

  // كارت متاح لتجربة الشحن السريع
  const sampleVoucher =
    vouchers.find(v => v.status === 'AVAILABLE' && (v.instructorId === instructorId || v.subjectId === subjectId)) ||
    vouchers.find(v => v.status === 'AVAILABLE');

  const handleCopyAdminNumber = () => {
    navigator.clipboard.writeText(adminPhoneNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // 1. تفعيل كارت الشحن (لو معاه كود خلاص بيشحن فوراً)
  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);
    setVoucherSuccess(null);

    if (!voucherInput.trim()) {
      setVoucherError('يرجى إدخال كود الكارت أولاً.');
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

  // 2. التحويل المالي عبر واتساب الإدارة (الادمن هيستلم ويفعل)
  const handleWhatsAppPayment = async () => {
    setProcessingPay(true);
    try {
      const res = await fetch('/api/subscriptions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          instructorId,
          subjectId,
          duration: selectedDuration,
          paymentMethod: payMethod
        })
      });

      const data = await res.json();

      const orderRef = data.orderRef || `REF-${Date.now().toString().slice(-6)}`;
      let finalWaUrl = data.whatsappUrl;

      if (!finalWaUrl) {
        const payMethodName =
          payMethod === 'VODAFONE_CASH'
            ? 'فودافون كاش'
            : payMethod === 'INSTAPAY'
            ? 'انستاباي (InstaPay)'
            : 'محفظة بنكية';

        const waText = 
`السلام عليكم ورحمة الله،
أنا الطالب: ${currentUser.name}
رقم هاتفي المسجل: ${currentUser.phone || 'غير مسجل'}
البريد الإلكتروني: ${currentUser.email}

أرغب في الاشتراك مع المعلم: ${instructorName}
المادة الدراسية: ${subjectName} (${activeGradeDetails?.nameAr || 'الثانوية العامة'})

الباقة المطلوبة: ${currentPrice.label} - بقيمة: ${currentPrice.amount} ج.م
طريقة التحويل المفضلة: ${payMethodName} (على رقمكم 01090138676)

سأقوم بتحويل المبلغ على رقم فودافون كاش / انستاباي المعتمد: 01090138676 ومرفق صورة إيصال التحويل في هذه الرسالة لتفعيل اشتراكي فوراً.
كود الطلب المرجعي: ${orderRef}`;

        finalWaUrl = `https://wa.me/${adminWaInternational}?text=${encodeURIComponent(waText)}`;
      }

      setWhatsappSentSuccess({
        orderRef,
        whatsappUrl: finalWaUrl
      });

      // فتح محادثة الواتساب في نافذة جديدة
      window.open(finalWaUrl, '_blank');

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('WhatsApp payment request error:', err);
      // Fallback direct url
      const fallbackUrl = `https://wa.me/${adminWaInternational}?text=${encodeURIComponent(
        `السلام عليكم، أنا الطالب: ${currentUser.name} (${currentUser.phone || ''})\nأرغب في تفعيل اشتراك مع المعلم: ${instructorName} في مادة: ${subjectName}\nالباقة: ${currentPrice.label} (${currentPrice.amount} ج.م)\nسأقوم بالتحويل على رقم 01090138676 وأرسل صورة الإيصال لتفعيل الاشتراك فوراً.`
      )}`;
      window.open(fallbackUrl, '_blank');
      setWhatsappSentSuccess({
        orderRef: `REF-${Date.now().toString().slice(-6)}`,
        whatsappUrl: fallbackUrl
      });
    } finally {
      setProcessingPay(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl relative overflow-hidden text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="flex items-center gap-3.5 mb-5 pl-8">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          <div>
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              بوابة اشتراكات المدرسين
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              الاشتراك مع {instructorName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{subjectName}</p>
          </div>
        </div>

        {/* أزرار التبديل بين الدفع عبر الواتساب والشحن بالكارت */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('direct_pay');
              setWhatsappSentSuccess(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'direct_pay'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>تحويل ودفع عبر واتساب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('voucher');
              setWhatsappSentSuccess(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'voucher'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>معايا كارت شحن (كود PIN)</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* الخيار الأول: الدفع والتحويل عبر واتساب الإدارة (الادمن هيدفعو و يشتركلو) */}
        {/* ======================================================== */}
        {activeTab === 'direct_pay' && (
          <div className="space-y-4 text-xs">
            {whatsappSentSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-right space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم توجيهك إلى واتساب إدارة YA7EDU بنجاح!</span>
                </div>

                <p className="text-xs text-emerald-700 leading-relaxed">
                  تم فتح محادثة الواتساب مع رقم إدارة المنصة المعتمد (<strong>01090138676</strong>) وبها كافة بيانات اشتراكك.
                </p>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>كود الطلب المرجعي:</span>
                    <strong className="text-emerald-700">{whatsappSentSuccess.orderRef}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>المعلم والمادة:</span>
                    <span className="text-slate-900 font-bold">{instructorName} - {subjectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المبلغ المطلوب:</span>
                    <strong className="text-emerald-700">{currentPrice.amount} جنيه</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-300 text-emerald-900 text-xs">
                  <strong>الخطوة الأخيرة:</strong> أرسل صورة إيصال التحويل (فودافون كاش أو انستاباي) في الشات، وسيقوم مسؤول المنصة بمراجعتها وتفعيل اشتراكك فوراً على المنصة!
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href={whatsappSentSuccess.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>إعادة فتح محادثة واتساب</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. اختيار باقة ومدة الاشتراك */}
                <div>
                  <label className="font-bold text-slate-800 block mb-2">1. اختر باقة ومدة الاشتراك</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDuration('1_MONTH')}
                      className={`p-3 rounded-xl border text-right transition ${
                        selectedDuration === '1_MONTH'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs">اشتراك شهر واحد</div>
                      <div className="text-base font-mono font-black text-blue-600 mt-1">180 ج.م</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">30 يوماً كاملة</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDuration('FULL_TERM')}
                      className={`p-3 rounded-xl border text-right transition relative ${
                        selectedDuration === 'FULL_TERM'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="absolute -top-2 left-2 text-[9px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold">
                        الأكثر طلباً
                      </span>
                      <div className="text-xs">اشتراك الفصل الدراسي</div>
                      <div className="text-base font-mono font-black text-emerald-600 mt-1">450 ج.م</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">الترم كاملاً حتى الامتحان</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDuration('FULL_YEAR')}
                      className={`col-span-2 p-3.5 rounded-xl border text-right transition ${
                        selectedDuration === 'FULL_YEAR'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>اشتراك العام الدراسي كاملاً (VIP)</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                              الأوفر
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            يشمل كافة الحصص ومذكرات YA7EDU الحصرية والمراجعات النهائية
                          </div>
                        </div>
                        <div className="text-base font-mono font-black text-amber-600">800 ج.م</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. اختيار وسيلة التحويل المفضلة */}
                <div>
                  <label className="font-bold text-slate-800 block mb-2">2. طريقة التحويل المفضلة</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayMethod('VODAFONE_CASH')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                        payMethod === 'VODAFONE_CASH'
                          ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>فودافون كاش (Vodafone)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod('INSTAPAY')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                        payMethod === 'INSTAPAY'
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>انستاباي (InstaPay)</span>
                    </button>
                  </div>
                </div>

                {/* 3. صندوق بيانات التحويل المعتمدة للإدارة (رقم م. يحيى عادل) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-slate-800 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-xs text-emerald-900">
                        رقم محفظة الإدارة المعتمد للتحويل
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      فودافون كاش & انستاباي
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        الاسم: م. يحيى عادل (إدارة YA7EDU)
                      </div>
                      <div className="text-base font-black font-mono text-emerald-700 tracking-wider">
                        {adminPhoneNumber}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAdminNumber}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60 font-semibold text-slate-700">
                    <span>المبلغ المطلوب تحويله:</span>
                    <strong className="text-emerald-700 font-mono text-sm font-extrabold">{currentPrice.amount} جنيه مصري</strong>
                  </div>
                </div>

                {/* 4. زر التوجيه للواتساب لإرسال الإيصال للأدمن */}
                <button
                  type="button"
                  onClick={handleWhatsAppPayment}
                  disabled={processingPay}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>
                    {processingPay
                      ? 'جاري تجهيز محادثة واتساب...'
                      : `تحويل ${currentPrice.amount} ج.م وإرسال الإيصال عبر واتساب`}
                  </span>
                </button>

                <p className="text-[11px] text-center text-slate-500 leading-relaxed">
                  بمجرد تحويل المبلغ وإرسال صورة الإيصال عبر محادثة الواتساب، سيقوم الأدمن بمراجعة التحويل وتفعيل اشتراكك فوراً!
                </p>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* الخيار الثاني: كارت الشحن الورقي (لو معاه كود خلاص بيشحن فوراً) */}
        {/* ======================================================== */}
        {activeTab === 'voucher' && (
          <form onSubmit={handleRedeemVoucher} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>تفعيل فوري بكارت السنتر أو المكتبة (بدون وسيط)</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                لو اشتريت كارت شحن ورقي من السنتر أو المكتبة المعتمدة، اكتب الكود المطبوع هنا وهيتم تفعيل اشتراكك فوراً في نفس اللحظة بدون أي انتظار!
              </p>
            </div>

            {/* مساعد الكود المتاح */}
            {sampleVoucher && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-600 truncate pl-2">
                  <span>كارت متاح للتجربة: </span>
                  <span className="font-mono text-amber-700 font-bold">{sampleVoucher.code}</span>
                  <span className="text-[10px] text-slate-500 block">{sampleVoucher.durationLabelAr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoucherInput(sampleVoucher.code)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-[11px] font-bold shrink-0 transition cursor-pointer"
                >
                  استخدم الكود
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                أدخل كود الكارت المكون من 12 إلى 16 خانة
              </label>
              <input
                type="text"
                value={voucherInput}
                onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="مثال: YA7-PHY-9821-X9"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 font-mono uppercase tracking-wider text-center focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-2xs"
              />
            </div>

            {voucherError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{voucherError}</span>
              </div>
            )}

            {voucherSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{voucherSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>شحن وتفعيل الاشتراك فوراً</span>
            </button>

            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('direct_pay')}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                معاكش كارت؟ اضغط هنا للتحويل عبر واتساب الإدارة
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
