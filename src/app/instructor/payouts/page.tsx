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
    <div className="space-y-8 font-sans text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>الأرباح والتحويلات المالية للمعلم</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مستحقات الاشتراكات وسحب الأرباح
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            متابعة إجمالي دخل مادتك الدراسية وكروت الشحن المستهلكة، وطلب سحب الرصيد إلى حسابك البنكي أو محفظتك.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>طلب سحب أرباح جديد</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* بطاقات الإحصائيات المالية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">إجمالي الأرباح المحققة</div>
          <div className="text-3xl font-extrabold text-white mt-2">{totalEarned.toLocaleString()} ج.م</div>
          <div className="text-xs text-emerald-400 mt-1 font-semibold">بعد خصم نسبة المنصة (15%)</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">تم صرفه وتحويله بالفعل</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{totalPaid.toLocaleString()} ج.م</div>
          <div className="text-xs text-gray-400 mt-1">عبر انستاباي / فودافون كاش</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">الرصيد قيد التحويل والمراجعة</div>
          <div className="text-3xl font-extrabold text-amber-300 mt-2">{pendingAmount.toLocaleString()} ج.م</div>
          <div className="text-xs text-amber-300 mt-1">بانتظار موافقة الإدارة</div>
        </div>
      </div>

      {/* جدول طلبات السحب */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">سجل طلبات السحب والتحويل</h2>

        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">رقم المعاملة</th>
                  <th className="py-3.5 px-4">المبلغ المطلوب</th>
                  <th className="py-3.5 px-4">طريقة التحويل</th>
                  <th className="py-3.5 px-4">الحساب / المحفظة</th>
                  <th className="py-3.5 px-4">تاريخ الطلب</th>
                  <th className="py-3.5 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {myPayouts.length > 0 ? (
                  myPayouts.map(p => {
                    const isPaid = p.status === 'PAID';
                    const isPending = p.status === 'PENDING';

                    return (
                      <tr key={p.id} className="hover:bg-gray-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-cyan-400">{p.id}</td>
                        <td className="py-3.5 px-4 font-bold text-white font-mono">
                          {p.amount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3.5 px-4 text-gray-300">{p.method}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">{p.accountDetails}</td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {new Date(p.requestedAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isPending
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isPaid ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>تم الصرف</span>
                              </>
                            ) : isPending ? (
                              <>
                                <Clock className="w-3 h-3" />
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
                    <td colSpan={6} className="py-8 text-center text-gray-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative text-right">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">طلب سحب أرباح جديد</h3>
                <p className="text-xs text-gray-400">تحويل المستحقات لحسابك الشخصي عبر انستاباي أو المحفظة الذكية</p>
              </div>
            </div>

            <form onSubmit={handleSubmitPayout} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  المبلغ المراد سحبه (ج.م)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="100000"
                  step="500"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  الحد الأدنى لطلب السحب هو 1,000 ج.م
                </span>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">وسيلة التحويل المفضلة</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="انستاباي (InstaPay Egypt)">انستاباي (InstaPay Egypt - تحويل لحظي)</option>
                  <option value="فودافون كاش (Vodafone Cash)">فودافون كاش (Vodafone Cash)</option>
                  <option value="محفظة أورنج / اتصالات كاش">محفظة أورنج / اتصالات كاش</option>
                  <option value="تحويل بنكي مصري (البنك الأهلي / CIB)">تحويل بنكي مصري (البنك الأهلي / مصر / CIB)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  بيانات الحساب / عنوان الدفع IPA أو رقم الهاتف
                </label>
                <input
                  type="text"
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  placeholder="مثال: name@instapay أو 010xxxxxxxx"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition"
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
