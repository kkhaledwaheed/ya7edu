'use client';

import React from 'react';
import { useLMS } from '@/context/lms-context';
import { CreditCard, Download, ShieldCheck, CheckCircle2, Receipt, Smartphone, Plus } from 'lucide-react';

export default function StudentBillingPage() {
  const { currentUser, transactions } = useLMS();

  // Filter transactions for student
  const userTransactions = transactions.filter(
    t => t.studentId === currentUser.id || t.studentName.includes(currentUser.name.split(' ')[0])
  );

  return (
    <div className="space-y-8 font-sans pb-16 text-right" dir="rtl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
          <span>المعاملات المالية والاشتراكات</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          الفواتير وسجل عمليات الدفع والشحن
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          استعراض سجل اشتراكات المواد والمدرسين، تحميل إيصالات الدفع الإلكتروني، وإدارة وسائل الدفع المحفوظة.
        </p>
      </div>

      {/* Payment methods card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm sm:text-base font-bold text-slate-900">بطاقة ميزة / فيزا تنتهي بـ &bull;&bull;&bull;&bull; 4242</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                الافتراضية
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              صالحة حتى 08/2028 &bull; مدفوعات مشفرة ومؤمنة عبر بوابة الدفع الإلكتروني المصرية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert('إضافة وسيلة دفع جديدة (فودافون كاش / إنستاباي / بطاقة بنكية)')}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center gap-2 border border-slate-200 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>إضافة وسيلة دفع جديدة</span>
          </button>
        </div>
      </div>

      {/* Transactions & Invoices Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          <span>سجل العمليات والفواتير السابقة</span>
        </h2>

        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-4 px-5">رقم الفاتورة</th>
                  <th className="py-4 px-5">المادة / المدرس</th>
                  <th className="py-4 px-5">تاريخ العملية</th>
                  <th className="py-4 px-5">المبلغ المدفوع</th>
                  <th className="py-4 px-5">الحالة</th>
                  <th className="py-4 px-5 text-left">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userTransactions.length > 0 ? (
                  userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-5 font-mono font-medium text-blue-600">{tx.id}</td>
                      <td className="py-4 px-5 font-bold text-slate-900">{tx.courseTitle}</td>
                      <td className="py-4 px-5 text-slate-500">
                        {new Date(tx.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-4 px-5 font-mono font-extrabold text-slate-900">
                        {tx.amount * 25} ج.م
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ناجحة ومفعلة</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-left">
                        <button
                          type="button"
                          onClick={() => alert(`جاري تصدير وتحميل الإيصال الضريبي للفاتورة ${tx.id}...`)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition border border-slate-200"
                          title="تحميل الإيصال"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      لا توجد فواتير أو عمليات دفع مسجلة حتى الآن.
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
