'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { MessageSquare, Star, Reply, Send, CheckCircle2 } from 'lucide-react';

export default function InstructorQAPage() {
  const { currentUser, courses, replyToReview } = useLMS();
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittedReplies, setSubmittedReplies] = useState<Record<string, boolean>>({});

  const myCourses = courses.filter(
    c => c.instructorId === currentUser.id || c.instructorName.includes(currentUser.name.split(' ')[0])
  );

  const allReviews = myCourses.flatMap(c =>
    c.reviews.map(r => ({
      ...r,
      courseTitle: c.title,
      courseId: c.id
    }))
  );

  const handleSendReply = (courseId: string, reviewId: string) => {
    const text = replyTexts[reviewId];
    if (!text || !text.trim()) return;
    replyToReview(courseId, reviewId, text);
    setSubmittedReplies(prev => ({ ...prev, [reviewId]: true }));
  };

  return (
    <div className="space-y-8 font-sans text-right">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>تفاعل المعلم وإجابة الاستفسارات</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          مركز أسئلة ومراجعات الطلاب
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          الرد المباشر على استفسارات الطلاب المشتركين، توضيح النقاط الصعبة في المذكرات، وبناء مجتمع دراسي متفوق.
        </p>
      </div>

      <div className="space-y-4">
        {allReviews.map(rev => {
          const isReplied = rev.instructorReply || submittedReplies[rev.id];

          return (
            <div key={rev.id} className="p-6 rounded-3xl glass-card border border-gray-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{rev.userName}</h3>
                    <p className="text-xs text-cyan-400 font-medium">{rev.courseTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 mr-1">
                    {new Date(rev.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pr-13">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* رد المعلم الحالي */}
              {isReplied ? (
                <div className="mr-6 sm:mr-12 p-4 rounded-2xl bg-indigo-950/40 border-r-2 border-cyan-500 text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">ردك كمعلم ({currentUser.name})</span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>منشور للطلاب</span>
                    </span>
                  </div>
                  <p className="text-gray-300">{rev.instructorReply || replyTexts[rev.id]}</p>
                </div>
              ) : (
                /* حقل كتابة رد المعلم */
                <div className="mr-6 sm:mr-12 pt-2 border-t border-gray-800/80">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyTexts[rev.id] || ''}
                      onChange={e => setReplyTexts({ ...replyTexts, [rev.id]: e.target.value })}
                      placeholder="اكتب ردك أو توضيحك على استفسار الطالب هنا..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => handleSendReply(rev.courseId, rev.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 rotate-180" />
                      <span>نشر الرد</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
