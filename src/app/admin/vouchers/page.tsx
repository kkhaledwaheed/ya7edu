'use client';

import React, { useState, useEffect } from 'react';
import { useLMS } from '@/context/lms-context';
import { VoucherDuration, AcademicGradeId, VoucherCode } from '@/lib/types';
import { mockAcademicGrades, mockSubjects } from '@/lib/mock-data/grades-subjects';
import {
  Ticket,
  PlusCircle,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Download,
  Printer,
  X,
  FileText,
  DollarSign,
  GraduationCap,
  Layers,
  Scissors,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminVouchersPage() {
  const { vouchers, generateVouchers, users, academicGrades, allSubjects } = useLMS();

  const instructors = users.filter(u => u.role === 'INSTRUCTOR');
  const [printDateStr, setPrintDateStr] = useState('2026/10/21');

  useEffect(() => {
    setPrintDateStr(new Date().toLocaleDateString('ar-EG'));
  }, []);

  // نموذج التوليد
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructors[0]?.id || 'inst_ahmed_samy');
  const [selectedSubjectId, setSelectedSubjectId] = useState(allSubjects[0]?.id || 'subj_g3_phys');
  const [selectedGradeId, setSelectedGradeId] = useState<AcademicGradeId>('grade_sec_3');
  const [selectedDuration, setSelectedDuration] = useState<VoucherDuration>('1_MONTH');
  const [cardPrice, setCardPrice] = useState('180 ج.م');
  const [batchCount, setBatchCount] = useState(10);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterTeacher, setFilterTeacher] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // حالة نافذة الطباعة ومعاينة كروت A4
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printCardsList, setPrintCardsList] = useState<VoucherCode[]>([]);

  // المعلم المختار في النموذج
  const currentInstructor = instructors.find(i => i.id === selectedInstructorId) || instructors[0];

  // توليد دفعة كروت جديدة
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCards = generateVouchers(
      selectedInstructorId,
      selectedSubjectId,
      selectedGradeId,
      selectedDuration,
      batchCount,
      cardPrice
    );

    setNotification(`تم توليد دفعة جديدة مكونة من ${newCards.length} كارت شحن بنجاح! جاهزة الآن للطباعة أو الاستخدام.`);
    setPrintCardsList(newCards);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // تصفية الكروت
  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (filterTeacher !== 'ALL' && v.instructorId !== filterTeacher) return false;
    return true;
  });

  // فتح نافذة الطباعة لجميع الكروت المفلترة أو الدفعة
  const handleOpenPrintModal = (cardsToPrint?: VoucherCode[]) => {
    const list = cardsToPrint && cardsToPrint.length > 0 ? cardsToPrint : filteredVouchers.slice(0, 20);
    setPrintCardsList(list);
    setPrintModalOpen(true);
  };

  // تشغيل أمر الطباعة في المتصفح
  const triggerPrint = () => {
    window.print();
  };

  const durationNameMap: Record<VoucherDuration, string> = {
    '1_MONTH': 'شهر واحد كامل',
    '3_MONTHS': 'فصل دراسي كامل (ترم)',
    'FULL_TERM': 'فصل دراسي كامل (ترم)',
    'FULL_YEAR': 'العام الدراسي كاملاً'
  };

  const gradeNameMap: Record<string, string> = {
    grade_sec_3: 'الصف الثالث الثانوي',
    grade_sec_2: 'الصف الثاني الثانوي',
    grade_sec_1: 'الصف الأول الثانوي'
  };

  return (
    <div className="space-y-8 font-sans text-right">
      {/* رأس الصفحة والإجراءات السريعة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>إدارة وإصدار كروت الشحن (Vouchers Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مولّد ومصدّر كروت الشحن المطبوعة (A4 Printable PDF)
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            توليد كروت الخدش الورقية للسناتر والمكتبات، وطباعتها وتصديرها بصيغة A4 منظمة (شبكة كروت مع خطوط قص دقيقة).
          </p>
        </div>

        <button
          onClick={() => handleOpenPrintModal(filteredVouchers.filter(v => v.status === 'AVAILABLE'))}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>تصدير وطباعة الكروت المتاحة (A4 PDF)</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <div className="flex items-center gap-2">
            {printCardsList.length > 0 && (
              <button
                onClick={() => setPrintModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
              >
                معاينة وطباعة الدفعة الآن ({printCardsList.length} كارت)
              </button>
            )}
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نموذج توليد كروت الشحن (Voucher Generator Form) */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-7 rounded-3xl glass-card border border-indigo-500/30 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <span>توليد دفعة كروت شحن لمعلم محدد</span>
          </h2>
          <span className="text-[11px] text-gray-400">
            تنشأ الأكواد تلقائياً ويتم حفظها فوراً في قاعدة بيانات المنصة لتجربتها كطالب.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* اختيار المدرس */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">اختيار المدرس *</label>
            <select
              value={selectedInstructorId}
              onChange={e => setSelectedInstructorId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              {instructors.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>

          {/* اختيار المادة */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">المادة التخصصية *</label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              {allSubjects.filter(s => s.gradeId === selectedGradeId).map(s => (
                <option key={s.id} value={s.id}>{s.nameAr}</option>
              ))}
            </select>
          </div>

          {/* اختيار الصف الدراسي */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">الصف الدراسي *</label>
            <select
              value={selectedGradeId}
              onChange={e => {
                const newG = e.target.value as AcademicGradeId;
                setSelectedGradeId(newG);
                const firstSub = allSubjects.find(s => s.gradeId === newG);
                if (firstSub) setSelectedSubjectId(firstSub.id);
              }}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              {(academicGrades || mockAcademicGrades).map(g => (
                <option key={g.id} value={g.id}>{g.nameAr}</option>
              ))}
            </select>
          </div>

          {/* مدة صلاحية الكارت للطالب */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">مدة صلاحية الكارت للطالب *</label>
            <select
              value={selectedDuration}
              onChange={e => setSelectedDuration(e.target.value as VoucherDuration)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="1_MONTH">شهر واحد (30 يوم)</option>
              <option value="FULL_TERM">تيرم كامل (فصل دراسي)</option>
              <option value="FULL_YEAR">سنة دراسية كاملة</option>
            </select>
          </div>

          {/* السعر الظاهر على الكارت */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1.5">السعر المطبوع على الكارت</label>
            <input
              type="text"
              value={cardPrice}
              onChange={e => setCardPrice(e.target.value)}
              placeholder="مثال: 180 ج.م"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-center"
            />
          </div>
        </div>

        {/* تحديد الكمية والإرسال */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-800/80">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-300 font-semibold">العدد المطلوب:</span>
            {[10, 20, 50, 100].map(qty => (
              <button
                type="button"
                key={qty}
                onClick={() => setBatchCount(qty)}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition ${
                  batchCount === qty
                    ? 'bg-cyan-500 text-gray-950 shadow-md'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {qty} كارت
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="200"
              value={batchCount}
              onChange={e => setBatchCount(parseInt(e.target.value) || 1)}
              className="w-20 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1 text-white font-mono text-center text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-gray-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>إصدار وتوليد الكروت فوراً ({batchCount} كارت)</span>
          </button>
        </div>
      </form>

      {/* سجل كروت الشحن في المنصة */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-400" />
            <span>سجل كروت الشحن الصادرة ({filteredVouchers.length} كارت)</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-56">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث بكود الكارت أو المعلم..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={filterTeacher}
              onChange={e => setFilterTeacher(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">جميع المعلمين</option>
              {instructors.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="AVAILABLE">متاح للشحن (غير مستخدم)</option>
              <option value="REDEEMED">تم الشحن والاستهلاك</option>
              <option value="EXPIRED">منتهي الصلاحية</option>
            </select>

            {filteredVouchers.length > 0 && (
              <button
                onClick={() => handleOpenPrintModal(filteredVouchers)}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-gray-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة المعروض ({filteredVouchers.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">كود الكارت</th>
                  <th className="py-3.5 px-4">المعلم المعتمد</th>
                  <th className="py-3.5 px-4">المادة والصف</th>
                  <th className="py-3.5 px-4">المدة والقيمة</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">تاريخ الصلاحية</th>
                  <th className="py-3.5 px-4 text-left">نسخ / طباعة فردية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {filteredVouchers.map(v => {
                  const isAvailable = v.status === 'AVAILABLE';
                  const isRedeemed = v.status === 'REDEEMED';

                  return (
                    <tr key={v.code} className="hover:bg-gray-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 text-sm">
                        {v.code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {v.instructorName}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div>{v.subjectName}</div>
                        <div className="text-[10px] text-gray-500">{gradeNameMap[v.gradeId] || 'الثانوية العامة'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">{durationNameMap[v.duration]}</span>
                        {v.priceLabel && (
                          <span className="text-[11px] text-amber-300 font-mono block">
                            {v.priceLabel}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isRedeemed
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isAvailable
                            ? 'متاح للشحن'
                            : isRedeemed
                            ? `تم استهلاكه (${v.redeemedByStudentName || 'طالب'})`
                            : 'منتهي الصلاحية'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(v.expiresAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(v.code)}
                            className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white inline-flex items-center gap-1 transition text-[11px]"
                            title="نسخ كود الكارت"
                          >
                            {copiedCode === v.code ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">تم</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>نسخ</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenPrintModal([v])}
                            className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white transition"
                            title="معاينة وطباعة هذا الكارت"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* نافذة معاينة وطباعة كروت A4 (Printable PDF Modal / Page) */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-5xl h-[95vh] rounded-3xl bg-gray-900 border border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden text-right">
            {/* شريط أدوات الطباعة العلوي (لا يظهر في الطباعة الورقية) */}
            <div className="p-4 border-b border-gray-800 bg-[#0d1322] flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    معاينة طباعة كروت الشحن المعتمدة (تنسيق A4 للسناتر والمكتبات)
                  </h3>
                  <p className="text-xs text-gray-400">
                    تم تجهيز {printCardsList.length} كارت بنظام شبكة 2 عمود مع خطوط قص واضحة.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrint}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية / حفظ كـ PDF (Print)</span>
                </button>

                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* صفحة المعاينة الشبيهة بورقة A4 المطبوعة */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
              {/* الحاوية المطبوعة الفعلية على ورق A4 أبيض */}
              <div
                id="printable-a4-sheet"
                className="printable-page w-full max-w-[210mm] bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-300 font-sans"
                style={{ minHeight: '297mm' }}
              >
                {/* ترويسة ورقة A4 للسنتر */}
                <div className="border-b-2 border-gray-800 pb-3 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 text-cyan-400 flex items-center justify-center font-bold text-base font-mono">
                      Y7
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-gray-950">
                        منصة YA7EDU التعليمية &bull; كروت شحن الطلاب
                      </h2>
                      <p className="text-[11px] text-gray-600 font-semibold">
                        مطبوعات السناتر والمكتبات المعتمدة للثانوية العامة &bull; {printDateStr}
                      </p>
                    </div>
                  </div>

                  <div className="text-left text-xs font-mono font-bold text-gray-700">
                    <div>إجمالي الكروت: {printCardsList.length}</div>
                    <div className="text-[10px] text-gray-500">A4 Cut Sheet Grid</div>
                  </div>
                </div>

                {/* شبكة الكروت: 2 عمود × صفوف مع خطوط قص مقطعة دقيقة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {printCardsList.map((card, idx) => (
                    <div
                      key={card.code + idx}
                      className="border-2 border-dashed border-gray-400 rounded-2xl p-4 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 relative flex flex-col justify-between shadow-sm overflow-hidden"
                      style={{ minHeight: '190px' }}
                    >
                      {/* علامة مقص القص */}
                      <div className="absolute top-1 left-1 opacity-25">
                        <Scissors className="w-3.5 h-3.5 text-gray-700" />
                      </div>

                      {/* رأس الكارت */}
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-gray-950 font-mono tracking-wider">
                              YA7<span className="text-cyan-600">EDU</span>
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800">
                              ثانوية عامة
                            </span>
                          </div>

                          <div className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            {card.priceLabel || '180 ج.م'}
                          </div>
                        </div>

                        {/* معلومات المدرس والمادة */}
                        <div className="mt-2.5">
                          <div className="text-[10px] text-gray-500 font-semibold">
                            كارت اشتراك معتمد مع:
                          </div>
                          <div className="text-sm font-extrabold text-gray-950">
                            الأستاذ / {card.instructorName}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-700 mt-1 font-semibold">
                            <span>{card.subjectName} &bull; {gradeNameMap[card.gradeId] || 'الصف الثالث الثانوي'}</span>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {durationNameMap[card.duration]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* صندوق الكود السري التفعيلي */}
                      <div className="my-3 p-2.5 rounded-xl bg-gray-950 text-white text-center border border-gray-800">
                        <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">
                          كود الشحن والتفعيل السري:
                        </div>
                        <div className="font-mono text-base font-black tracking-widest text-cyan-300 select-all">
                          {card.code}
                        </div>
                        <div className="text-[8px] text-gray-400 mt-0.5">
                          ادخل على حسابك في www.ya7edu.com واضغط &quot;شحن كارت&quot;
                        </div>
                      </div>

                      {/* تذييل الكارت والدعم الفني */}
                      <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between text-[9px] text-gray-600">
                        <span>الدعم الفني: 01012345678</span>
                        <span>صالح حتى: {new Date(card.expiresAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* تذييل الورقة */}
                <div className="mt-8 pt-3 border-t border-gray-300 text-center text-[10px] text-gray-500">
                  منصة YA7EDU التعليمية الذكية &bull; جميع الحقوق محفوظة &bull; الأكواد مخصصة للاستخدام الفردي فقط
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
