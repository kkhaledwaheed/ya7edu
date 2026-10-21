'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { DollarSign, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPayoutsPage() {
  const { payoutRequests, approvePayout, rejectPayout } = useLMS();
  const [notification, setNotification] = useState<string | null>(null);

  const pendingPayouts = payoutRequests.filter(p => p.status === 'PENDING');
  const pastPayouts = payoutRequests.filter(p => p.status !== 'PENDING');

  const pendingTotal = pendingPayouts.reduce((a, b) => a + b.amount, 0);
  const paidTotal = pastPayouts.filter(p => p.status === 'PAID').reduce((a, b) => a + b.amount, 0);

  const handleApprove = (id: string, name: string, amount: number) => {
    approvePayout(id);
    setNotification(`تمت الموافقة على تحويل طلب السحب #${id} بمبلغ ${amount.toLocaleString()} ج.م للمعلم ${name} عبر انستاباي/فودافون كاش!`);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleReject = (id: string, name: string) => {
    rejectPayout(id);
    setNotification(`تم رفض طلب السحب #${id} الخاص بالمعلم ${name}.`);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>العمليات المالية وتسوية أرباح المعلمين</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          طلبات سحب وتحويل مستحقات المعلمين
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          مراجعة طلبات سحب الأرباح المقدمة من مدرسي الثانوية العامة، التحقق من الرصيد والنسب، وتنفيذ التحويلات البنكية أو المحافظ الإلكترونية.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            إغلاق
          </button>
        </div>
      )}

      {/* مؤشرات الأرقام المالية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-right">
        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">إجمالي الطلبات المعلقة</div>
          <div className="text-3xl font-extrabold text-amber-300 mt-2">{pendingTotal.toLocaleString()} ج.م</div>
          <div className="text-xs text-amber-400/80 mt-1">{pendingPayouts.length} طلبات في قائمة الانتظار</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">إجمالي الأرباح المسددة</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{paidTotal.toLocaleString()} ج.م</div>
          <div className="text-xs text-gray-400 mt-1">عبر انستاباي والمحافظ الإلكترونية</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">الحد الأدنى لطلب السحب</div>
          <div className="text-3xl font-extrabold text-white mt-2">1,000 ج.م</div>
          <div className="text-xs text-cyan-400 mt-1">محدد في سياسة المنصة</div>
        </div>
      </div>

      {/* قسم الطلبات المعلقة بانتظار الاعتماد */}
      <div className="space-y-4 text-right">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>طلبات السحب المعلقة ({pendingPayouts.length})</span>
        </h2>

        {pendingPayouts.length > 0 ? (
          <div className="space-y-3">
            {pendingPayouts.map(p => (
              <div
                key={p.id}
                className="p-5 rounded-3xl glass-card border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={p.instructorAvatar} alt={p.instructorName} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{p.instructorName}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      الوسيلة: <span className="text-gray-200 font-semibold">{p.method}</span> &bull; الحساب/الرقم: <span className="font-mono text-cyan-400">{p.accountDetails}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      تاريخ الطلب: {new Date(p.requestedAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-400 block">المبلغ المطلوب</span>
                    <span className="text-xl font-extrabold text-amber-400 font-mono">
                      {p.amount.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(p.id, p.instructorName)}
                      className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-rose-950 text-rose-400 border border-gray-700 hover:border-rose-800 text-xs font-semibold transition"
                    >
                      رفض
                    </button>
                    <button
                      onClick={() => handleApprove(p.id, p.instructorName, p.amount)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>اعتماد وصرف</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-card border border-gray-800 text-center text-gray-400">
            لا توجد أي طلبات سحب معلقة حالياً. جميع مستحقات المعلمين مسواة ومسددة بالكامل.
          </div>
        )}
      </div>

      {/* سجل طلبات السحب المكتملة والمرفوضة */}
      <div className="space-y-4 text-right">
        <h2 className="text-lg font-bold text-white">سجل العمليات السابقة ({pastPayouts.length})</h2>

        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">رقم المعاملة</th>
                  <th className="py-3.5 px-4">المعلم</th>
                  <th className="py-3.5 px-4">المبلغ</th>
                  <th className="py-3.5 px-4">طريقة التحويل</th>
                  <th className="py-3.5 px-4">تاريخ الطلب</th>
                  <th className="py-3.5 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {pastPayouts.map(p => {
                  const isPaid = p.status === 'PAID';
                  return (
                    <tr key={p.id} className="hover:bg-gray-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-cyan-400">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{p.instructorName}</td>
                      <td className="py-3.5 px-4 font-bold text-white font-mono">{p.amount.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 text-gray-300">{p.method}</td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(p.requestedAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isPaid ? 'تم التحويل والصرف' : 'مرفوض'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
