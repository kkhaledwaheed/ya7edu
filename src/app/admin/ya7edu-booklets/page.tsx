'use client';

import React, { useState, useRef } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Download,
  BookOpen,
  Plus,
  Layers,
  Search,
  FileUp,
  Award,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminYa7eduBookletsPage() {
  const {
    instructorContents,
    addBookletItem,
    deleteBookletItem,
    gradeSubjects
  } = useLMS();

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [pages, setPages] = useState(40);
  const [targetContentId, setTargetContentId] = useState(instructorContents[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all YA7EDU exclusive booklets across all instructor contents
  const allExclusiveBooklets = instructorContents.flatMap(c =>
    (c.ya7eduBooklets || []).map(b => ({
      ...b,
      contentId: c.id,
      instructorName: c.instructorName,
      subjectName: c.subjectName
    }))
  );

  const filteredBooklets = allExclusiveBooklets.filter(b =>
    b.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFileSize(`${sizeMb} MB`);
      setIsUploading(true);
      setUploadProgress(25);

      const objectUrl = URL.createObjectURL(file);
      setUploadedFileUrl(objectUrl);

      if (!titleAr) {
        setTitleAr(file.name.replace(/\.pdf$/i, ''));
      }

      setTimeout(() => setUploadProgress(70), 250);
      setTimeout(() => {
        setUploadProgress(100);
        setIsUploading(false);
      }, 500);
    }
  };

  const handleCreateBooklet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return alert('يرجى إدخال اسم المذكرة الحصرية');

    const targetContent = instructorContents.find(c => c.id === targetContentId) || instructorContents[0];
    if (!targetContent) return;

    addBookletItem(targetContent.id, {
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || 'YA7EDU Official VIP Handout',
      pageCount: Number(pages) || 40,
      fileSize: uploadedFileSize || '6.5 MB',
      downloadUrl: uploadedFileUrl || '#',
      type: 'YA7EDU_EXCLUSIVE',
      format: 'PDF',
      isExclusive: true
    });

    // Reset Form
    setTitleAr('');
    setTitleEn('');
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setUploadedFileUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setAlertMsg('تم إصدار ونشر مذكرة YA7EDU الحصرية بنجاح!');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleDelete = (contentId: string, itemId: string, itemTitle: string) => {
    if (confirm(`هل أنت متأكد من حذف المذكرة الحصرية "${itemTitle}"؟`)) {
      deleteBookletItem(contentId, itemId);
      setAlertMsg('تم حذف المذكرة بنجاح.');
      setTimeout(() => setAlertMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-16 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>لوحة تحكم الإدارة &bull; الإصدارات الرسمية والمذكرات الحصرية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إدارة وإصدار مذكرات YA7EDU الحصرية VIP
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            رفع ملفات المذكرات الحصرية برعاية المنصة وتحديد المادة والمعلم المخصص، ليتمكن الطلاب المشتركون فقط من تحميلها وتصفحها.
          </p>
        </div>

        <a
          href="/student/player"
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center gap-2 transition shrink-0"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>معاينة في مشغل الطالب</span>
        </a>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Form Card: Create Exclusive Booklet */}
      <div className="p-6 rounded-3xl glass-card border border-amber-500/30 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <FileUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">إصدار ونشر مذكرة حصرية جديدة (Exclusive PDF)</h3>
            <span className="text-[11px] text-gray-400">خاصة بالإدارة المركزية لمنصة YA7EDU</span>
          </div>
        </div>

        <form onSubmit={handleCreateBooklet} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-gray-300 font-semibold block mb-1">اسم المذكرة الحصرية بالعربية *</label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={e => setTitleAr(e.target.value)}
                placeholder="مثال: كتيب YA7EDU الحصري: كبسولة مراجعة ليلة الامتحان ونقاط التريكات"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">المادة والمعلم المستهدف *</label>
              <select
                value={targetContentId}
                onChange={e => setTargetContentId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-amber-500"
              >
                {instructorContents.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.subjectName} &bull; {c.instructorName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">الاسم بالإنجليزية (اختياري)</label>
              <input
                type="text"
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                placeholder="YA7EDU Physics VIP Capsule Booklet"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">عدد الصفحات التقديري</label>
              <input
                type="number"
                value={pages}
                onChange={e => setPages(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* مساحة رفع ملف الـ PDF الحقيقي */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <label className="text-gray-300 font-semibold text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-amber-400" />
                <span>رفع ملف المذكرة (PDF File) *</span>
              </span>
              <span className="text-[11px] text-gray-500">اختر الملف من جهازك</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!uploadedFileName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-gray-800 hover:border-amber-500/70 bg-gray-950/40 hover:bg-gray-950/80 cursor-pointer transition text-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 flex items-center justify-center mx-auto transition">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">
                  اضغط لاختيار ملف المذكرة (PDF) من جهاز الكمبيوتر أو اسحبه وأفلته هنا
                </div>
                <p className="text-[11px] text-gray-400">
                  يدعم صيغة PDF حتى 50 ميجابايت كحد أقصى
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-900 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{uploadedFileName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                          {uploadedFileSize}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم تجهيز ورفع ملف المذكرة بنجاح للنشر</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName(null);
                      setUploadedFileSize(null);
                      setUploadedFileUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[11px] text-rose-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition"
                  >
                    تغيير الملف
                  </button>
                </div>

                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>جاري معالجة ورفع الملف...</span>
                      <span className="font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>إصدار ونشر المذكرة الحصرية في المنصة</span>
            </button>
          </div>
        </form>
      </div>

      {/* Table: Published Exclusive Booklets */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم المذكرة أو المادة أو المعلم..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="text-xs text-gray-400">
            إجمالي المذكرات الحصرية المنشورة: {allExclusiveBooklets.length}
          </span>
        </div>

        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">عنوان المذكرة الحصرية</th>
                  <th className="py-4 px-6">المادة والمعلم المخصص</th>
                  <th className="py-4 px-6">الصفحات والحجم</th>
                  <th className="py-4 px-6">تاريخ الإصدار</th>
                  <th className="py-4 px-6">حالة الصلاحية</th>
                  <th className="py-4 px-6 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredBooklets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                      لا توجد مذكرات حصرية مطابقة. استخدم النموذج أعلاه لرفع مذكرة حصرية جديدة.
                    </td>
                  </tr>
                ) : (
                  filteredBooklets.map(bkt => (
                    <tr key={bkt.id} className="hover:bg-gray-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{bkt.titleAr}</div>
                            <div className="text-[11px] text-gray-400">{bkt.titleEn}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold text-[10px]">
                            {bkt.subjectName}
                          </span>
                          <span className="text-gray-400 block text-[11px] mt-0.5">
                            {bkt.instructorName}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-gray-300">
                        <div>{bkt.pageCount} صفحة</div>
                        <div className="text-[10px] text-amber-400 font-bold">{bkt.fileSize || 'PDF'}</div>
                      </td>

                      <td className="py-4 px-6 font-mono text-gray-400 text-[11px]">
                        {bkt.uploadDate}
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 flex items-center gap-1 w-fit">
                          <Award className="w-3 h-3" />
                          <span>حصري VIP للمشتركين</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {bkt.downloadUrl && bkt.downloadUrl !== '#' && (
                            <a
                              href={bkt.downloadUrl}
                              download={`${bkt.titleAr}.pdf`}
                              className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition"
                              title="تحميل الملف"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(bkt.contentId, bkt.id, bkt.titleAr)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                            title="حذف المذكرة الحصرية"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
