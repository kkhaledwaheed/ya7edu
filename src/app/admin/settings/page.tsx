'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { Settings, Shield, Bell, CheckCircle2, History, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { platformConfig, updatePlatformConfig, auditLogs } = useLMS();

  const [commissionRate, setCommissionRate] = useState(platformConfig.commissionRate);
  const [minThreshold, setMinThreshold] = useState(platformConfig.minPayoutThreshold);
  const [bannerText, setBannerText] = useState(platformConfig.bannerText);
  const [bannerEnabled, setBannerEnabled] = useState(platformConfig.bannerEnabled);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig({
      commissionRate,
      minPayoutThreshold: minThreshold,
      bannerText,
      bannerEnabled
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl text-right">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>حوكمة وسياسات منصة YA7EDU</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          إعدادات النظام والسياسات وسجل التدقيق
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          تحديد نسبة عمولة المنصة من اشتراكات المواد، إدارة الشريط الإعلاني العام، ومتابعة سجل العمليات الحساسة.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>تم حفظ وتحديث إعدادات وسياسات المنصة بنجاح على جميع البوابات!</span>
        </div>
      )}

      {/* نموذج الإعدادات */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl glass-card border border-gray-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-400" />
          <span>قواعد السياسة المالية والعمولات</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">
              نسبة عمولة المنصة التشغيلية (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={commissionRate}
              onChange={e => setCommissionRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">
              النسبة المقتطعة تلقائياً من قيمة كل اشتراك أو كارت شحن يتم استهلاكه.
            </span>
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">
              الحد الأدنى لطلب السحب للمعلم (ج.م)
            </label>
            <input
              type="number"
              min="100"
              value={minThreshold}
              onChange={e => setMinThreshold(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">
              الحد الأدنى للرصيد المستحق الذي يسمح للمعلم بتقديم طلب سحب أرباح.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>الشريط الإعلاني العلوي للمنصة</span>
          </h2>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="banner-toggle"
              checked={bannerEnabled}
              onChange={e => setBannerEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 bg-gray-900 border-gray-700 focus:ring-cyan-500"
            />
            <label htmlFor="banner-toggle" className="text-xs font-semibold text-gray-200">
              تفعيل ظهور شريط الإعلانات العاجلة أعلى كافة الصفحات
            </label>
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1.5 text-xs">نص الإعلان المنشور</label>
            <input
              type="text"
              value={bannerText}
              onChange={e => setBannerText(e.target.value)}
              placeholder="مثال: خصم 20% على اشتراكات الفصل الدراسي الثاني لفترة محدودة..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
          >
            حفظ وتطبيق التغييرات
          </button>
        </div>
      </form>

      {/* سجل تدقيق العمليات الحساسة (Audit Logs) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>سجل الرقابة والتدقيق الأمني (Audit Logs)</span>
        </h2>

        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">رقم السجل</th>
                  <th className="py-3.5 px-4">نوع الإجراء</th>
                  <th className="py-3.5 px-4">المنفذ</th>
                  <th className="py-3.5 px-4">التفاصيل والتأثير</th>
                  <th className="py-3.5 px-4 text-left">التاريخ والتوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{log.action}</td>
                    <td className="py-3.5 px-4 text-gray-300">{log.performedBy}</td>
                    <td className="py-3.5 px-4 text-gray-400 max-w-sm truncate">{log.details}</td>
                    <td className="py-3.5 px-4 text-left text-gray-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
