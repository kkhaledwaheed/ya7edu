'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { Course, CourseLevel, Section, Lesson } from '@/lib/types';
import {
  Sparkles,
  BookOpen,
  DollarSign,
  Layers,
  Send,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';

function CourseStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { courses, saveCourse } = useLMS();

  const existingCourse = editId ? courses.find(c => c.id === editId) : null;

  // خطوات المعالج
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // حقول البيانات
  const [title, setTitle] = useState(existingCourse?.title || '');
  const [subtitle, setSubtitle] = useState(existingCourse?.subtitle || '');
  const [description, setDescription] = useState(existingCourse?.description || '');
  const [category, setCategory] = useState(existingCourse?.category || 'الفيزياء');
  const [level, setLevel] = useState<CourseLevel>(existingCourse?.level || 'ALL_LEVELS');
  const [thumbnail, setThumbnail] = useState(
    existingCourse?.thumbnail ||
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80'
  );
  const [previewVideoUrl, setPreviewVideoUrl] = useState(
    existingCourse?.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );
  const [price, setPrice] = useState(existingCourse?.price ? existingCourse.price * 25 : 250);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(
    existingCourse?.discountPrice ? existingCourse.discountPrice * 25 : 200
  );

  // الأبواب والحصص
  const [sections, setSections] = useState<Section[]>(
    existingCourse?.sections || [
      {
        id: 'sec_new_1',
        title: 'الباب الأول: التيار الكهربي وقانون أوم وكيرشوف',
        lessons: [
          {
            id: 'les_new_1',
            title: 'المحاضرة 1: شدة التيار وفرق الجهد والمقاومة النوعية',
            durationMinutes: 45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notes: 'شرح تفصيلي للمفاهيم الفيزيائية مع استنتاج قانون المقاومة الكهربية وعلاقتها بدرجة الحرارة.',
            resources: [{ id: 'res_1', name: 'مذكرة شرح وأمثلة الباب الأول.pdf', url: 'https://example.com/notes.pdf', size: '3.4 MB', type: 'pdf' }]
          }
        ]
      }
    ]
  );

  const [notification, setNotification] = useState<string | null>(null);

  // إضافة باب جديد
  const handleAddSection = () => {
    const newSec: Section = {
      id: `sec_${Date.now()}`,
      title: `الباب ${sections.length + 1}: عنوان الباب الدراسي الجديد`,
      lessons: []
    };
    setSections([...sections, newSec]);
  };

  // حذف باب
  const handleDeleteSection = (secId: string) => {
    setSections(sections.filter(s => s.id !== secId));
  };

  // تعديل عنوان الباب
  const handleSectionTitleChange = (secId: string, newTitle: string) => {
    setSections(sections.map(s => (s.id === secId ? { ...s, title: newTitle } : s)));
  };

  // إضافة حصة في باب
  const handleAddLesson = (secId: string) => {
    const target = sections.find(s => s.id === secId);
    if (!target) return;
    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      title: `المحاضرة ${target.lessons.length + 1}: شرح مسألة جديدة`,
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      notes: 'ملاحظات وتدريبات عملية على المحاضرة.'
    };
    setSections(
      sections.map(s => (s.id === secId ? { ...s, lessons: [...s.lessons, newLesson] } : s))
    );
  };

  // حذف حصة
  const handleDeleteLesson = (secId: string, lesId: string) => {
    setSections(
      sections.map(s =>
        s.id === secId ? { ...s, lessons: s.lessons.filter(l => l.id !== lesId) } : s
      )
    );
  };

  // حفظ وإرسال المنهج
  const handleSave = (submitForReview: boolean) => {
    if (!title.trim()) {
      alert('يرجى إدخال اسم المنهج الدراسي!');
      return;
    }

    const courseData: Partial<Course> = {
      title,
      subtitle,
      description,
      category,
      level,
      thumbnail,
      previewVideoUrl,
      price: price / 25,
      discountPrice: discountPrice ? discountPrice / 25 : undefined,
      sections,
      status: submitForReview ? 'PENDING_REVIEW' : 'DRAFT'
    };

    if (existingCourse) {
      courseData.id = existingCourse.id;
    }

    saveCourse(courseData);

    if (submitForReview) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setNotification('تم إرسال المنهج بنجاح لفريق الرقابة والاعتماد الأكاديمي لمنصة YA7EDU!');
      setTimeout(() => router.push('/instructor/courses'), 2000);
    } else {
      setNotification('تم حفظ المسودة بنجاح.');
      setTimeout(() => router.push('/instructor/courses'), 1500);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto text-right">
      {/* الترويسة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/instructor/courses')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المناهج</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {existingCourse ? 'تعديل وتحديث المنهج' : 'إعداد ورفع منهج دراسي جديد'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            صمم هيكل الأبواب والمحاضرات، ارفع مذكرات الشرح والواجبات، وأرسل المنهج للاعتماد والنشر.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ كمسودة</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition"
          >
            <Send className="w-4 h-4 rotate-180" />
            <span>إرسال للاعتماد والنشر</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* مؤشر الخطوات */}
      <div className="grid grid-cols-4 gap-2 border-b border-gray-800 pb-4">
        {[
          { id: 1, label: 'البيانات الأساسية' },
          { id: 2, label: 'الأبواب والمحاضرات' },
          { id: 3, label: 'الاشتراك والتسعير' },
          { id: 4, label: 'المعاينة والإرسال' }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setStep(s.id as any)}
            className={`text-center py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              step === s.id
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px]">
              {s.id}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* الخطوة 1: البيانات الأساسية */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>المعلومات العامة للمنهج</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">اسم المنهج الدراسي</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: منهج الفيزياء للثانوية العامة 2026 - الكهربية والمغناطيسية"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">الوصف المختصر</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="مثال: كورس شامل يغطي منهج الفيزياء كاملاً مع حل بنك أسئلة الوزارة"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">المادة الدراسية</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="الفيزياء">الفيزياء (Physics)</option>
                  <option value="الرياضيات">الرياضيات (Mathematics)</option>
                  <option value="الكيمياء">الكيمياء (Chemistry)</option>
                  <option value="الأحياء والجيولوجيا">الأحياء والجيولوجيا (Biology)</option>
                  <option value="اللغة العربية">اللغة العربية</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">المرحلة الدراسية</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ALL_LEVELS">الصف الثالث الثانوي (الثانوية العامة)</option>
                  <option value="INTERMEDIATE">الصف الثاني الثانوي</option>
                  <option value="BEGINNER">الصف الأول الثانوي</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">وصف المنهج وأهداف التعلم</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="اشرح للطلاب محتويات المنهج وما سيتم تغطيته في الأبواب المختلفة..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                التالي: إضافة الأبواب والحصص
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 2: الأبواب والمحاضرات */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>هيكل الأبواب والمحاضرات ({sections.length} أبواب)</span>
            </h2>

            <button
              type="button"
              onClick={handleAddSection}
              className="px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة باب دراسي جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((sec, sIdx) => (
              <div key={sec.id} className="p-5 rounded-3xl glass-card border border-gray-800 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-xs text-cyan-400 shrink-0">
                      {sIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={e => handleSectionTitleChange(sec.id, e.target.value)}
                      className="flex-1 bg-gray-900/80 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                    title="حذف الباب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* الحصص التابعة */}
                <div className="mr-8 space-y-2 border-r-2 border-gray-800 pr-4">
                  {sec.lessons.map((les, lIdx) => (
                    <div
                      key={les.id}
                      className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium">{les.title}</span>
                        <span className="text-gray-500">({les.durationMinutes} دقيقة)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteLesson(sec.id, les.id)}
                        className="text-gray-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddLesson(sec.id)}
                    className="w-full py-2 rounded-xl border border-dashed border-gray-700 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة محاضرة فيديو داخل هذا الباب</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              التالي: تحديد رسوم الاشتراك
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 3: التسعير والاشتراك */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span>رسوم الاشتراك الشهري وكروت الشحن</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">
                سعر الاشتراك الشهري الأساسي (ج.م)
              </label>
              <input
                type="number"
                min="50"
                step="25"
                value={price}
                onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                السعر المعلن للاشتراك المباشر بالفيزا أو المحافظ الإلكترونية.
              </span>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">
                سعر كارت الشحن الورقي للسناتر (ج.م)
              </label>
              <input
                type="number"
                min="50"
                step="25"
                value={discountPrice || price}
                onChange={e => setDiscountPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                القيمة التي يتم طباعتها على كارت الخدش للطلاب في السناتر.
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              التالي: مراجعة المنهج والإرسال
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 4: المراجعة والإرسال */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">المراجعة النهائية قبل النشر</h2>
              <p className="text-xs text-gray-400">تحقق من اكتمال كافة الفصول والمذكرات قبل إرسال المنهج للرقابة</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">اسم المنهج:</span>
              <span className="font-bold text-white">{title || 'لم يُحدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">المادة:</span>
              <span className="font-bold text-cyan-300">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">عدد الأبواب:</span>
              <span className="font-bold text-white">{sections.length} أبواب</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">إجمالي المحاضرات:</span>
              <span className="font-bold text-white">
                {sections.reduce((acc, s) => acc + s.lessons.length, 0)} محاضرة
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">سعر الاشتراك الشهري:</span>
              <span className="font-bold text-emerald-400 font-mono">{price} ج.م</span>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>تأكيد الإرسال للاعتماد الأكاديمي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">جاري تحميل استوديو المناهج...</div>}>
      <CourseStudioContent />
    </Suspense>
  );
}
