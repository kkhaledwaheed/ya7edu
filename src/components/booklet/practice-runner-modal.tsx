'use client';

import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookletItem, BookletQuestion } from '@/lib/types';

interface PracticeRunnerModalProps {
  booklet: BookletItem;
  isOpen: boolean;
  onClose: () => void;
}

export function PracticeRunnerModal({ booklet, isOpen, onClose }: PracticeRunnerModalProps) {
  const questions: BookletQuestion[] = booklet.questions && booklet.questions.length > 0
    ? booklet.questions
    : [
        {
          id: 'q_default_1',
          questionAr: 'في دائرة كهربية تحتوي على مقاومتين متصلتين على التوازي (R1 = 6Ω و R2 = 3Ω) ومصدر جهد 12V، ما هي شدة التيار الكلي المار في الدائرة؟',
          options: ['2 أمبير', '4 أمبير', '6 أمبير', '8 أمبير'],
          correctIndex: 2, // 6 Amperes (Req = 2Ω -> I = 12/2 = 6A)
          explanationAr: 'طريقة الحل: المقاومة المكافئة للتوازي: Req = (6 × 3) / (6 + 3) = 18 / 9 = 2 أوم. بتطبيق قانون أوم للدائرة: I = V / Req = 12 / 2 = 6 أمبير.'
        },
        {
          id: 'q_default_2',
          questionAr: 'وفقاً لقانون كيرشوف الأول (قانون حفظ الشحنة الكهربية)، فإن المجموع الجبري للتيارات الكهربية عند أي نقطة تفرع يساوي:',
          options: ['القوة الدافعة الكهربية للبطارية', 'صفر دائماً', 'مجموع فروق الجهد', 'مقاومة السلك'],
          correctIndex: 1, // صفر
          explanationAr: 'طريقة الحل: ينص قانون كيرشوف الأول (Σ I = 0) على أن مجموع التيارات الداخلة لنقطة تفرع = مجموع التيارات الخارجة منها تطبيقاً لمبدأ حفظ الشحنة.'
        },
        {
          id: 'q_default_3',
          questionAr: 'سلك مستقيم يمر به تيار كهربي شدته 5A موضوع عمودياً في مجال مغناطيسي كثافة فيضه 0.4T وطوله 2m. احسب القوة المغناطيسية المؤثرة عليه:',
          options: ['2 نيوتن', '4 نيوتن', '5 نيوتن', '10 نيوتن'],
          correctIndex: 1, // 4 N (F = B * I * L = 0.4 * 5 * 2 = 4)
          explanationAr: 'طريقة الحل: القانون F = B × I × L × sin(θ). بما أن السلك عمودي فإن sin(90°) = 1. إذن: F = 0.4 × 5 × 2 = 4 نيوتن.'
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const chosenIndex = selectedAnswers[currentIndex];
  const isCorrect = chosenIndex === currentQ.correctIndex;

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent) return; // Locked once answered

    const updated = { ...selectedAnswers, [currentIndex]: index };
    setSelectedAnswers(updated);

    if (index === currentQ.correctIndex) {
      confetti({ particleCount: 35, spread: 40, origin: { y: 0.7 } });
    }

    // Check if last question
    if (currentIndex === questions.length - 1) {
      setTimeout(() => {
        setIsCompleted(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Calculate score
  const totalCorrect = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[parseInt(qIdx)]?.correctIndex === ansIdx
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right" dir="rtl">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-900 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  تدريب تفاعلي &bull; حل وتفسير فوري لكل مسألة
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{booklet.titleAr}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar & score counter */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 font-mono">
                السؤال {currentIndex + 1} من {questions.length}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-emerald-600 font-bold font-mono">
                {totalCorrect} صحيحة
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-bold">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content area: Question or Completion Screen */}
        {!isCompleted ? (
          <div className="py-6 space-y-6">
            {/* Question Text */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 mb-2 inline-block">
                مسألة #{currentIndex + 1}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.questionAr}
              </h4>
            </div>

            {/* 4 Interactive Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = chosenIndex === optIdx;
                const isTheCorrectOne = currentQ.correctIndex === optIdx;

                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-100';

                if (hasAnsweredCurrent) {
                  if (isTheCorrectOne) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/20';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/20';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-4 rounded-2xl border text-right transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 font-mono">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="font-semibold text-xs leading-relaxed">{option}</span>
                    </div>

                    {hasAnsweredCurrent && (
                      <div className="shrink-0">
                        {isTheCorrectOne && <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />}
                        {isSelected && !isTheCorrectOne && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* INSTANT SOLUTION & EXPLANATION BOX */}
            {hasAnsweredCurrent && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-2 text-xs ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Lightbulb className={`w-5 h-5 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span>
                    {isCorrect ? 'إجابة صحيحة وممتازة! 🎉' : 'إجابة خاطئة — إليك الحل النموذجي والتفسير:'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 leading-relaxed font-sans">
                  <strong className="block mb-1 text-slate-900 font-bold">💡 خطوات التفكير والحل:</strong>
                  <p className="text-slate-700">{currentQ.explanationAr}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion / Review Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              أحسنت! أكملت تدريب ({booklet.titleAr})
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-1">
              <div className="text-2xl font-black font-mono text-blue-600">
                {totalCorrect} / {questions.length}
              </div>
              <div className="text-xs text-slate-500">
                نسبة إتقان المسائل: {Math.round((totalCorrect / questions.length) * 100)}%
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة التدريب من البداية</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                العودة لقسم المذكرات
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {!isCompleted && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>

            {hasAnsweredCurrent && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md transition animate-in fade-in"
              >
                <span>{currentIndex === questions.length - 1 ? 'إنهاء التدريب وعرض النتيجة' : 'السؤال التالي'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
