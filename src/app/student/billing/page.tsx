'use client';

import React from 'react';
import { useLMS } from '@/context/lms-context';
import { CreditCard, Download, ShieldCheck, CheckCircle2, Receipt, Smartphone } from 'lucide-react';

export default function StudentBillingPage() {
  const { currentUser, transactions } = useLMS();

  // تصفية معاملات الطالب الحالي أو المعاملات النموذجية
  const userTransactions = transactions.filter(
    t => t.studentId === currentUser.id || t.studentName.includes(currentUser.name.split(' ')[0])
  );

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>المعاملات المالية والاشتراكات</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          الفواتير وسجل عمليات الدفع والشحن
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          استعراض سجل اشتراكات المواد والمدرسين، تحميل إيصالات الدفع الإلكتروني، وإدارة وسائل الدفع المحفوظة.
        </p>
      </div>

      {/* وسائل الدفع المعتمدة */}
      <div className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">بطاقة ميزة / فيزا تنتهي بـ &bull;&bull;&bull;&bull; 4242</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                الافتراضية
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              صالحة حتى 08/2028 &bull; مدفوعات مشفرة وآمنة عبر بوابة الدفع الإلكتروني
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('إضافة وسيلة دفع جديدة (فودافون كاش أو بطاقة بنكية)')}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition"
          >
            إضافة وسيلة دفع جديدة
          </button>
        </div>
      </div>

      {/* جدول الفواتير وسجل المعاملات */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cyan-400" />
          <span>سجل العمليات والفواتير السابقة</span>
        </h2>

        <div className="rounded-2xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-4">المادة / المدرس</th>
                  <th className="py-3 px-4">تاريخ العملية</th>
                  <th className="py-3 px-4">المبلغ</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-left">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {userTransactions.length > 0 ? (
                  userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-cyan-400">{tx.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{tx.courseTitle}</td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(tx.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {tx.amount * 25} ج.م
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ناجحة ومفعلة</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <button
                          onClick={() => alert(`جاري تنزيل الفاتورة الضريبية رقم ${tx.id} بصيغة PDF`)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white inline-flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>إيصال PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      لا توجد فواتير أو معاملات مسجلة حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
