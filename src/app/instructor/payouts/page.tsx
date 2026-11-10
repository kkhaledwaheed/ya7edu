'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { DollarSign, Clock, CheckCircle2, AlertCircle, Plus, X, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InstructorPayoutsPage() {
  const { currentUser, payoutRequests, requestInstructorPayout } = useLMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(15000);
  const [method, setMethod] = useState('انستاباي (InstaPay Egypt)');
  const [account, setAccount] = useState('ahmed_samy@instapay');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const myPayouts = payoutRequests.filter(
    p => p.instructorId === currentUser.id || p.instructorName.includes(currentUser.name.split(' ')[0])
  );

  const totalEarned = 148500;
  const totalPaid = myPayouts.filter(p => p.status === 'PAID').reduce((a, b) => a + b.amount, 0);
  const pendingAmount = myPayouts.filter(p => p.status === 'PENDING').reduce((a, b) => a + b.amount, 0);

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    requestInstructorPayout(amount, method, account);
    setModalOpen(false);
    setAlertMsg(`تم إرسال طلب سحب أرباح بمبلغ ${amount.toLocaleString()} ج.م بنجاح، وهو قيد مراجعة إدارة منصة YA7EDU.`);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-8 font-sans text-right pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>الأرباح والتحويلات المالية للمعلم</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            مستحقات الاشتراكات وسحب الأرباح
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            متابعة إجمالي دخل مادتك الدراسية وكروت الشحن المستهلكة، وطلب سحب الرصيد إلى حسابك البنكي أو محفظتك.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>طلب سحب أرباح جديد</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* بطاقات الإحصائيات المالية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">إجمالي الأرباح المحققة</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{totalEarned.toLocaleString()} ج.م</div>
          <div className="text-xs text-blue-600 mt-1 font-semibold">بعد خصم نسبة المنصة (15%)</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">تم صرفه وتحويله بالفعل</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">{totalPaid.toLocaleString()} ج.م</div>
          <div className="text-xs text-slate-500 mt-1">عبر انستاباي / فودافون كاش</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">الرصيد قيد التحويل والمراجعة</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">{pendingAmount.toLocaleString()} ج.م</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">بانتظار موافقة الإدارة</div>
        </div>
      </div>

      {/* جدول طلبات السحب */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">سجل طلبات السحب والتحويل</h2>

        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">رقم المعاملة</th>
                  <th className="py-3.5 px-4">المبلغ المطلوب</th>
                  <th className="py-3.5 px-4">طريقة التحويل</th>
                  <th className="py-3.5 px-4">الحساب / المحفظة</th>
                  <th className="py-3.5 px-4">تاريخ الطلب</th>
                  <th className="py-3.5 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myPayouts.length > 0 ? (
                  myPayouts.map(p => {
                    const isPaid = p.status === 'PAID';
                    const isPending = p.status === 'PENDING';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-blue-600">{p.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                          {p.amount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{p.method}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{p.accountDetails}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(p.requestedAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isPending
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isPaid ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>تم الصرف</span>
                              </>
                            ) : isPending ? (
                              <>
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>قيد المراجعة</span>
                              </>
                            ) : (
                              <span>مرفوض</span>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      لم يتم تسجيل أي طلبات سحب حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* نافذة طلب السحب */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl relative text-right">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">طلب سحب أرباح جديد</h3>
                <p className="text-xs text-slate-500">تحويل المستحقات لحسابك الشخصي عبر انستاباي أو المحفظة الذكية</p>
              </div>
            </div>

            <form onSubmit={handleSubmitPayout} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  المبلغ المراد سحبه (ج.م)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="100000"
                  step="500"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  الحد الأدنى لطلب السحب هو 1,000 ج.م
                </span>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">وسيلة التحويل المفضلة</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="انستاباي (InstaPay Egypt)">انستاباي (InstaPay Egypt - تحويل لحظي)</option>
                  <option value="فودافون كاش (Vodafone Cash)">فودافون كاش (Vodafone Cash)</option>
                  <option value="محفظة أورنج / اتصالات كاش">محفظة أورنج / اتصالات كاش</option>
                  <option value="تحويل بنكي مصري (البنك الأهلي / CIB)">تحويل بنكي مصري (البنك الأهلي / مصر / CIB)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  بيانات الحساب / عنوان الدفع IPA أو رقم الهاتف
                </label>
                <input
                  type="text"
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  placeholder="مثال: name@instapay أو 010xxxxxxxx"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition"
                >
                  تأكيد وإرسال الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
