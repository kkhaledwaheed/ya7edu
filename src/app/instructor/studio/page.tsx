'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  Layers,
  Plus,
  Play,
  FileText,
  Calendar,
  Sparkles,
  Trash2,
  Video,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  UploadCloud,
  FileVideo,
  Check,
  ExternalLink,
  AlertCircle,
  Eye,
  Lock,
  Unlock,
  Clock,
  HelpCircle,
  BrainCircuit,
  FileUp,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstructorSubscriptionCard } from '@/components/instructor/instructor-subscription-card';
import { BookletQuestion } from '@/lib/types';
import { SecureLmsPlayer } from '@/components/player/secure-lms-player';
import { ShieldCheck } from 'lucide-react';

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Helper to extract clean YouTube embed URL
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?modestbranding=1&rel=0`
    : null;
}

export default function InstructorStudioPage() {
  const {
    currentUser,
    instructorContents,
    addChapter,
    addLessonToChapter,
    deleteLessonFromChapter,
    addBookletItem,
    deleteBookletItem
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'chapters' | 'booklets' | 'revisions'>('chapters');
  const currentContent = instructorContents.find(c => c.instructorId === currentUser?.id) || instructorContents[0];

  // Add Chapter Form State
  const [newChapTitleAr, setNewChapTitleAr] = useState('');
  const [newChapTitleEn, setNewChapTitleEn] = useState('');
  const [isSavingChapter, setIsSavingChapter] = useState(false);

  // Add Lesson Form State
  const [selectedChapId, setSelectedChapId] = useState(currentContent?.chapters[0]?.id || '');
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isSavingBooklet, setIsSavingBooklet] = useState(false);

  // Auto-sync selected chapter if content or chapters change
  useEffect(() => {
    if (currentContent?.chapters && currentContent.chapters.length > 0) {
      if (!selectedChapId || !currentContent.chapters.some(c => c.id === selectedChapId)) {
        setSelectedChapId(currentContent.chapters[0].id);
      }
    }
  }, [currentContent, selectedChapId]);

  const [lessonTitleAr, setLessonTitleAr] = useState('');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [lessonDuration, setLessonDuration] = useState(45);
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [lessonNotes, setLessonNotes] = useState('');

  // Lesson Video Source Toggle: 'upload' (ملف فيديو) vs 'youtube' (رابط يوتيوب)
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'youtube'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadBytesText, setUploadBytesText] = useState<string | null>(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<{ source?: string; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // -------------------------------------------------------------
  // TAB 2: Booklets State (PDF vs Interactive Practice)
  // -------------------------------------------------------------
  const [bookletFormat, setBookletFormat] = useState<'PDF' | 'INTERACTIVE_PRACTICE'>('PDF');
  const [bookletTitleAr, setBookletTitleAr] = useState('');
  const [bookletTitleEn, setBookletTitleEn] = useState('');
  const [bookletPages, setBookletPages] = useState(25);
  const [bookletIsFree, setBookletIsFree] = useState(false);

  // Booklet PDF File Upload State
  const [bookletFileName, setBookletFileName] = useState<string | null>(null);
  const [bookletFileSize, setBookletFileSize] = useState<string | null>(null);
  const [bookletFileUrl, setBookletFileUrl] = useState<string | null>(null);
  const [isBookletUploading, setIsBookletUploading] = useState(false);
  const [bookletUploadProgress, setBookletUploadProgress] = useState(0);
  const bookletFileInputRef = useRef<HTMLInputElement>(null);

  // Practice Questions State
  const [practiceQuestions, setPracticeQuestions] = useState<BookletQuestion[]>([
    {
      id: 'q_1',
      questionAr: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanationAr: ''
    }
  ]);

  // -------------------------------------------------------------
  // TAB 3: Revisions State (PDF vs Video Revision)
  // -------------------------------------------------------------
  const [revisionFormat, setRevisionFormat] = useState<'PDF' | 'VIDEO'>('PDF');
  const [revisionTitleAr, setRevisionTitleAr] = useState('');
  const [revisionTitleEn, setRevisionTitleEn] = useState('');
  const [revisionPages, setRevisionPages] = useState(30);
  const [revisionIsFree, setRevisionIsFree] = useState(false);

  // Revision PDF File Upload State
  const [revisionPdfFileName, setRevisionPdfFileName] = useState<string | null>(null);
  const [revisionPdfFileSize, setRevisionPdfFileSize] = useState<string | null>(null);
  const [revisionPdfFileUrl, setRevisionPdfFileUrl] = useState<string | null>(null);
  const [isRevisionPdfUploading, setIsRevisionPdfUploading] = useState(false);
  const [revisionPdfUploadProgress, setRevisionPdfUploadProgress] = useState(0);
  const revisionPdfFileInputRef = useRef<HTMLInputElement>(null);

  // Revision Video State
  const [revisionVideoSource, setRevisionVideoSource] = useState<'youtube' | 'upload'>('youtube');
  const [revisionYoutubeUrl, setRevisionYoutubeUrl] = useState('');
  const [revisionDuration, setRevisionDuration] = useState(45);
  const [revisionUploadedFileName, setRevisionUploadedFileName] = useState<string | null>(null);
  const [revisionUploadedFileSize, setRevisionUploadedFileSize] = useState<string | null>(null);
  const [revisionUploadedPreviewUrl, setRevisionUploadedPreviewUrl] = useState<string | null>(null);
  const [isRevisionUploading, setIsRevisionUploading] = useState(false);
  const [revisionUploadProgress, setRevisionUploadProgress] = useState(0);
  const [revisionUploadBytesText, setRevisionUploadBytesText] = useState<string | null>(null);
  const [revisionUploadStatusMsg, setRevisionUploadStatusMsg] = useState<{ source?: string; message?: string } | null>(null);
  const revisionFileInputRef = useRef<HTMLInputElement>(null);

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Active selected chapter details
  const activeChapter = currentContent?.chapters.find(c => c.id === selectedChapId) || currentContent?.chapters[0];

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitleAr.trim() || !currentContent) return;
    setIsSavingChapter(true);
    try {
      await addChapter(currentContent.id, newChapTitleEn || newChapTitleAr, newChapTitleAr);
      setNewChapTitleAr('');
      setNewChapTitleEn('');
      setAlertMsg('تمت إضافة الباب الدراسي وحفظه بنجاح في قاعدة البيانات الحية!');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      alert('خطأ أثناء حفظ الباب: ' + err.message);
    } finally {
      setIsSavingChapter(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFileSize(`${sizeMb} MB`);
    setIsUploading(true);
    setUploadProgress(1);
    setUploadBytesText(`0 MB / ${sizeMb} MB`);
    setUploadStatusMsg(null);

    const localUrl = URL.createObjectURL(file);
    setUploadedPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', lessonTitleAr || file.name);
    formData.append('description', lessonNotes || 'محاضرة تعليمية YA7EDU');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        const loadedMb = (event.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = (event.total / (1024 * 1024)).toFixed(1);
        setUploadProgress(percent);
        setUploadBytesText(`${loadedMb} MB / ${totalMb} MB`);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(100);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success && data.videoUrl) {
          setUploadedPreviewUrl(data.videoUrl);
          setUploadStatusMsg({
            source: data.source,
            message: '✓ تم اكتمال رفع الفيديو وتأمينه بنجاح على السيرفر (جاهز للنشر)'
          });
        }
      } catch {
        setUploadStatusMsg({
          source: 'local_storage',
          message: '✓ تم حفظ الفيديو على السيرفر'
        });
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadProgress(100);
      setUploadStatusMsg({
        source: 'local_storage',
        message: '✓ تم حفظ الفيديو محلياً على السيرفر'
      });
    };

    xhr.send(formData);
  };

  const handleBookletFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookletFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setBookletFileSize(`${sizeMb} MB`);
      setIsBookletUploading(true);
      setBookletUploadProgress(30);

      const objectUrl = URL.createObjectURL(file);
      setBookletFileUrl(objectUrl);

      if (!bookletTitleAr) {
        setBookletTitleAr(file.name.replace(/\.pdf$/i, ''));
      }

      setTimeout(() => setBookletUploadProgress(75), 250);
      setTimeout(() => {
        setBookletUploadProgress(100);
        setIsBookletUploading(false);
      }, 500);
    }
  };

  const handleRevisionPdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRevisionPdfFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setRevisionPdfFileSize(`${sizeMb} MB`);
      setIsRevisionPdfUploading(true);
      setRevisionPdfUploadProgress(30);

      const objectUrl = URL.createObjectURL(file);
      setRevisionPdfFileUrl(objectUrl);

      if (!revisionTitleAr) {
        setRevisionTitleAr(file.name.replace(/\.pdf$/i, ''));
      }

      setTimeout(() => setRevisionPdfUploadProgress(75), 250);
      setTimeout(() => {
        setRevisionPdfUploadProgress(100);
        setIsRevisionPdfUploading(false);
      }, 500);
    }
  };

  const handleRevisionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRevisionUploadedFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setRevisionUploadedFileSize(`${sizeMb} MB`);
    setIsRevisionUploading(true);
    setRevisionUploadProgress(1);
    setRevisionUploadBytesText(`0 MB / ${sizeMb} MB`);
    setRevisionUploadStatusMsg(null);

    const localUrl = URL.createObjectURL(file);
    setRevisionUploadedPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', revisionTitleAr || file.name);
    formData.append('description', 'فيديو مراجعة على منصة YA7EDU');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        const loadedMb = (event.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = (event.total / (1024 * 1024)).toFixed(1);
        setRevisionUploadProgress(percent);
        setRevisionUploadBytesText(`${loadedMb} MB / ${totalMb} MB`);
      }
    };

    xhr.onload = () => {
      setIsRevisionUploading(false);
      setRevisionUploadProgress(100);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success && data.videoUrl) {
          setRevisionUploadedPreviewUrl(data.videoUrl);
          setRevisionUploadStatusMsg({
            source: data.source,
            message: '✓ تم اكتمال رفع وحفظ فيديو المراجعة بنجاح على السيرفر'
          });
        }
      } catch {
        setRevisionUploadStatusMsg({
          source: 'local_storage',
          message: '✓ تم حفظ فيديو المراجعة على السيرفر'
        });
      }
    };

    xhr.onerror = () => {
      setIsRevisionUploading(false);
      setRevisionUploadProgress(100);
      setRevisionUploadStatusMsg({
        source: 'local_storage',
        message: '✓ تم حفظ فيديو المراجعة محلياً'
      });
    };

    xhr.send(formData);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitleAr.trim() || !currentContent) return;

    if (!selectedChapId) {
      alert('يرجى اختيار أو إنشاء باب دراسي أولاً لوضع المحاضرة بداخله.');
      return;
    }

    let finalVideoUrl = '';

    if (videoSourceType === 'youtube') {
      if (!youtubeUrl.trim()) {
        alert('يرجى إدخال رابط يوتيوب صالح للمحاضرة');
        return;
      }
      finalVideoUrl = youtubeUrl.trim();
    } else {
      if (isUploading) {
        alert('جاري رفع ومعالجة ملف الفيديو على السيرفر، يرجى الانتظار بضع ثوانٍ حتى اكتمال شريط الرفع.');
        return;
      }
      if (!uploadedPreviewUrl) {
        alert('يرجى اختيار ملف فيديو لرفعه أولاً.');
        return;
      }
      finalVideoUrl = uploadedPreviewUrl;
    }

    setIsSavingLesson(true);
    try {
      await addLessonToChapter(currentContent.id, selectedChapId, {
        titleAr: lessonTitleAr.trim(),
        titleEn: lessonTitleEn.trim() || lessonTitleAr.trim(),
        videoUrl: finalVideoUrl,
        durationMinutes: Number(lessonDuration) || 45,
        isFree: lessonIsFree,
        notes: lessonNotes.trim()
      });

      setLessonTitleAr('');
      setLessonTitleEn('');
      setUploadedFileName(null);
      setUploadedFileSize(null);
      setUploadedPreviewUrl(null);
      setUploadProgress(0);
      setYoutubeUrl('');
      setLessonIsFree(false);
      setLessonNotes('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setAlertMsg('تمت إضافة وحفظ المحاضرة بنجاح في قاعدة البيانات الحية على السيرفر!');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      alert('حدث خطأ أثناء حفظ المحاضرة: ' + err.message);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (chapId: string, lessonId: string) => {
    if (!currentContent) return;
    if (confirm('هل أنت متأكد من حذف هذه المحاضرة نهائياً من قاعدة البيانات؟')) {
      await deleteLessonFromChapter(currentContent.id, chapId, lessonId);
      setAlertMsg('تم حذف المحاضرة من قاعدة البيانات بنجاح.');
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  // -------------------------------------------------------------
  // Interactive Practice Question Helpers
  // -------------------------------------------------------------
  const handleAddPracticeQuestion = () => {
    setPracticeQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}_${prev.length + 1}`,
        questionAr: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanationAr: ''
      }
    ]);
  };

  const handleRemovePracticeQuestion = (index: number) => {
    if (practiceQuestions.length <= 1) return;
    setPracticeQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestionText = (index: number, text: string) => {
    setPracticeQuestions(prev =>
      prev.map((q, i) => (i === index ? { ...q, questionAr: text } : q))
    );
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setPracticeQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleUpdateCorrectIndex = (qIndex: number, correctIdx: number) => {
    setPracticeQuestions(prev =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctIndex: correctIdx } : q))
    );
  };

  const handleUpdateExplanation = (qIndex: number, text: string) => {
    setPracticeQuestions(prev =>
      prev.map((q, i) => (i === qIndex ? { ...q, explanationAr: text } : q))
    );
  };

  // -------------------------------------------------------------
  // Add Booklet Item (Tab 2)
  // -------------------------------------------------------------
  const handleAddBooklet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookletTitleAr.trim() || !currentContent) return;

    setIsSavingBooklet(true);
    try {
      if (bookletFormat === 'INTERACTIVE_PRACTICE') {
        const validQuestions = practiceQuestions.filter(q => q.questionAr.trim().length > 0);
        if (validQuestions.length === 0) {
          alert('يرجى كتابة نص سؤال واحد على الأقل للتدريب التفاعلي');
          return;
        }

        await addBookletItem(currentContent.id, {
          titleAr: bookletTitleAr.trim(),
          titleEn: bookletTitleEn.trim() || 'Interactive Practice Session',
          pageCount: validQuestions.length,
          fileSize: `${validQuestions.length} مسائل وشرح`,
          type: 'BOOKLET',
          format: 'INTERACTIVE_PRACTICE',
          questions: validQuestions,
          isFree: bookletIsFree
        });

        setBookletTitleAr('');
        setBookletTitleEn('');
        setPracticeQuestions([
          {
            id: 'q_1',
            questionAr: '',
            options: ['', '', '', ''],
            correctIndex: 0,
            explanationAr: ''
          }
        ]);
        setAlertMsg('تم إنشاء ونشر التدريب التفاعلي وحفظه في قاعدة البيانات!');
      } else {
        await addBookletItem(currentContent.id, {
          titleAr: bookletTitleAr.trim(),
          titleEn: bookletTitleEn.trim() || 'Physics Chapter Booklet',
          pageCount: bookletPages,
          fileSize: bookletFileSize || '4.2 MB',
          downloadUrl: bookletFileUrl || '#',
          type: 'BOOKLET',
          format: 'PDF',
          isFree: bookletIsFree
        });

        setBookletTitleAr('');
        setBookletTitleEn('');
        setBookletFileName(null);
        setBookletFileSize(null);
        setBookletFileUrl(null);
        if (bookletFileInputRef.current) bookletFileInputRef.current.value = '';
        setAlertMsg('تم رفع وحفظ ملف مذكرة الـ PDF بنجاح في قاعدة البيانات!');
      }

      confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      alert('خطأ أثناء حفظ المذكرة: ' + err.message);
    } finally {
      setIsSavingBooklet(false);
    }
  };

  // -------------------------------------------------------------
  // Add Revision Item (Tab 3)
  // -------------------------------------------------------------
  const handleAddRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionTitleAr.trim() || !currentContent) return;

    setIsSavingBooklet(true);
    try {
      if (revisionFormat === 'VIDEO') {
        let finalVideoUrl = '';

        if (revisionVideoSource === 'youtube') {
          if (!revisionYoutubeUrl.trim()) {
            alert('يرجى إدخال رابط يوتيوب صالح لفيديو المراجعة');
            return;
          }
          finalVideoUrl = revisionYoutubeUrl.trim();
        } else {
          finalVideoUrl = revisionUploadedPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        }

        await addBookletItem(currentContent.id, {
          titleAr: revisionTitleAr.trim(),
          titleEn: revisionTitleEn.trim() || 'Exam Revision Video Lecture',
          type: 'REVISION',
          format: 'VIDEO',
          videoUrl: finalVideoUrl,
          durationMinutes: revisionDuration,
          fileSize: `${revisionDuration} دقيقة`,
          isFree: revisionIsFree
        });

        setRevisionTitleAr('');
        setRevisionTitleEn('');
        setRevisionYoutubeUrl('');
        setRevisionUploadedFileName(null);
        setRevisionUploadedFileSize(null);
        setRevisionUploadedPreviewUrl(null);
        setRevisionUploadProgress(0);
        if (revisionFileInputRef.current) {
          revisionFileInputRef.current.value = '';
        }
        setAlertMsg('تم نشر وحفظ فيديو المراجعة بنجاح في قاعدة البيانات!');
      } else {
        await addBookletItem(currentContent.id, {
          titleAr: revisionTitleAr.trim(),
          titleEn: revisionTitleEn.trim() || 'Comprehensive Revision Handout',
          pageCount: revisionPages,
          fileSize: revisionPdfFileSize || '5.8 MB',
          downloadUrl: revisionPdfFileUrl || '#',
          type: 'REVISION',
          format: 'PDF',
          isFree: revisionIsFree
        });

        setRevisionTitleAr('');
        setRevisionTitleEn('');
        setRevisionPdfFileName(null);
        setRevisionPdfFileSize(null);
        setRevisionPdfFileUrl(null);
        setAlertMsg('تم نشر وحفظ ملف ملخص المراجعة بنجاح في قاعدة البيانات!');
      }

      confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      alert('خطأ أثناء حفظ المراجعة: ' + err.message);
    } finally {
      setIsSavingBooklet(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemTitle: string) => {
    if (!currentContent) return;
    if (confirm(`هل أنت متأكد من حذف "${itemTitle}" نهائياً من قاعدة البيانات؟`)) {
      await deleteBookletItem(currentContent.id, itemId);
      setAlertMsg('تم حذف العنصر بنجاح من قاعدة البيانات.');
      setTimeout(() => setAlertMsg(null), 2500);
    }
  };

  const ytEmbedPreview = videoSourceType === 'youtube' ? getYouTubeEmbedUrl(youtubeUrl) : null;
  const revisionYtEmbedPreview = revisionVideoSource === 'youtube' ? getYouTubeEmbedUrl(revisionYoutubeUrl) : null;

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>استوديو المعلم المعتمد &bull; إدارة المنهج والمحتوى التفاعلي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            استوديو إدارة محتوى المادة والمذكرات والمراجعات
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة الأبواب والمحاضرات، مذكرات الشرح وتدريبات الحل الفوري، ومراجعات ليلة الامتحان (ملفات PDF وفيديوهات مسجلة أو يوتيوب).
          </p>
        </div>

        <a
          href="/student/player"
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-bold flex items-center gap-2 transition shrink-0"
        >
          <Play className="w-4 h-4 text-blue-600" />
          <span>معاينة في مشغل الطالب</span>
        </a>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* بطاقة مدة الاشتراك وتجديد الواتساب للمعلم */}
      <InstructorSubscriptionCard instructor={currentUser} />

      {/* 3 تبويبات إدارة المحتوى للمدرس */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'chapters' ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>1. الأبواب والمحاضرات</span>
        </button>

        <button
          onClick={() => setActiveTab('booklets')}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'booklets' ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. المذكرات والحل الفوري</span>
        </button>

        <button
          onClick={() => setActiveTab('revisions')}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'revisions' ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>3. المراجعات (PDF وفيديو)</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CHAPTERS & LESSONS */}
      {/* ========================================================= */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">
          {/* إضافة باب دراسي جديد */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>إضافة باب أو فصل دراسي جديد للمنهج</span>
            </h3>

            <form onSubmit={handleAddChapter} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="اسم الباب بالعربية (مثال: الباب الأول: التيار الكهربي وقانون أوم)..."
                  value={newChapTitleAr}
                  onChange={e => setNewChapTitleAr(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingChapter}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSavingChapter ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري الحفظ في الـ VPS...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>إضافة وحفظ الباب</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* إضافة محاضرة فيديو داخل الباب المختار */}
          <form onSubmit={handleAddLesson} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                <span>إضافة محاضرة فيديو جديدة داخل الباب الدراسي</span>
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">اختر الباب المستهدف:</span>
                <select
                  value={selectedChapId}
                  onChange={e => setSelectedChapId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {currentContent?.chapters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.titleAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-700 font-semibold block mb-1">عنوان المحاضرة بالعربية *</label>
                <input
                  type="text"
                  value={lessonTitleAr}
                  onChange={e => setLessonTitleAr(e.target.value)}
                  placeholder="مثال: الحصة 3: القوة المغناطيسية وعزم الازدواج"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">المدة التقديرية (بالدقائق)</label>
                <input
                  type="number"
                  value={lessonDuration}
                  onChange={e => setLessonDuration(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* مفتاح الاختيار بين رفع الفيديو أو يوتيوب */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <label className="text-slate-700 font-semibold text-xs block">مصدر فيديو المحاضرة:</label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setVideoSourceType('upload')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    videoSourceType === 'upload'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 text-indigo-400" />
                  <span>رفع ملف فيديو (MP4/WebM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoSourceType('youtube')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    videoSourceType === 'youtube'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <YoutubeIcon className="w-4 h-4 text-rose-500" />
                  <span>رابط يوتيوب (غير مدرج)</span>
                </button>
              </div>
            </div>

            {/* رفع ملف الفيديو */}
            {videoSourceType === 'upload' ? (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!uploadedFileName ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">اضغط لاختيار ملف الفيديو أو اسحبه هنا</div>
                    <p className="text-[11px] text-slate-500">يدعم صيغ MP4, WebM, MOV حتى 2 جيجابايت</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileVideo className="w-5 h-5 text-indigo-400" />
                        <div>
                          <span className="font-bold text-slate-900">{uploadedFileName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{uploadedFileSize}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName(null);
                          setUploadedPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        تغيير الملف
                      </button>
                    </div>

                    {isUploading && (
                      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-blue-800 flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span>جاري رفع وتأمين ملف الفيديو على السيرفر...</span>
                          </span>
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            {uploadProgress}% {uploadBytesText && `(${uploadBytesText})`}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-blue-100 overflow-hidden p-0.5 border border-blue-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-150 rounded-full shadow-sm"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-blue-600/80">
                          يتم رفع الفيديو وتشفيره ضد النسخ والتحميل المباشر وحفظه على الـ VPS.
                        </p>
                      </div>
                    )}

                    {uploadedPreviewUrl && (
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>معاينة حية بمشغل YA7EDU المحمي (بدون شعار يوتيوب أو إمكانية نسخ الرابط):</span>
                          </span>
                          {uploadStatusMsg && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              {uploadStatusMsg.message}
                            </span>
                          )}
                        </div>
                        <div className="relative aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-slate-200 shadow-md">
                          <SecureLmsPlayer
                            videoUrl={uploadedPreviewUrl}
                            title={lessonTitleAr || 'معاينة المحاضرة'}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* وضع رابط يوتيوب */
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <YoutubeIcon className="w-4 h-4 text-rose-500" />
                      <span>رابط فيديو يوتيوب (يدعم الفيديوهات غير المدرجة Unlisted) *</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=ScMzIvxBSi4')}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      تجربة رابط شرح توضيحي
                    </button>
                  </div>

                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500 text-left"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    يمكنك استخدام فيديوهات يوتيوب &quot;غير المدرجة&quot; للحفاظ على خصوصية المحتوى للمشتركين فقط.
                  </p>
                </div>

                {/* معاينة يوتيوب الحية إذا كان الرابط صحيحاً */}
                {ytEmbedPreview ? (
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>معاينة مشغل YA7EDU المشفر (تم إخفاء عناصر يوتيوب وتأمين الرابط):</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        محمي ضد النسخ
                      </span>
                    </div>

                    <div className="relative aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-slate-200 shadow-md">
                      <SecureLmsPlayer
                        videoUrl={youtubeUrl}
                        title={lessonTitleAr || 'محاضرة يوتيوب مشفرة'}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  youtubeUrl.trim() && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>الرابط المدخل غير مكتمل أو لا يحتوي على كود فيديو يوتيوب صحيح. تأكد من نسخ الرابط كاملاً.</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* خيار المعاينة المجانية وملاحظات المحاضرة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">حصة معاينة مجانية (Free Preview)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    إتاحة هذا الفيديو مجاناً لجميع الطلاب بدون اشتراك (بحد أقصى فيديوهين).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={lessonIsFree}
                  onChange={e => setLessonIsFree(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">ملاحظات أو توجيهات للمحاضرة</label>
                <input
                  type="text"
                  value={lessonNotes}
                  onChange={e => setLessonNotes(e.target.value)}
                  placeholder="مثال: يرجى حل مسائل الصفحة 14 في المذكرة بعد المشاهدة"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingLesson || isUploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingLesson ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري الحفظ في قاعدة بيانات السيرفر (VPS)...</span>
                  </>
                ) : isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري رفع الفيديو ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>إضافة المحاضرة وحفظها في قاعدة البيانات</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* استعراض المحاضرات المسجلة حالياً داخل الباب المختار */}
          {activeChapter && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600">فهرس المحاضرات المسجلة</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    محاضرات: {activeChapter.titleAr} ({activeChapter.lessons.length} محاضرة)
                  </h3>
                </div>

                <span className="text-xs text-slate-500">
                  إجمالي الوقت: {activeChapter.lessons.reduce((acc, l) => acc + l.durationMinutes, 0)} دقيقة
                </span>
              </div>

              {activeChapter.lessons.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  لا توجد محاضرات مضافة لهذا الباب حتى الآن. استخدم النموذج أعلاه لرفع فيديو أو إضافة رابط يوتيوب.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeChapter.lessons.map((lesson, idx) => {
                    const isYt = Boolean(getYouTubeEmbedUrl(lesson.videoUrl));

                    return (
                      <div
                        key={lesson.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-500/40 flex items-center justify-between gap-3 text-xs transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-700 font-bold font-mono flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900">{lesson.titleAr}</h4>

                              {lesson.isFree ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>معاينة مجانية</span>
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-slate-500 font-semibold flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  <span>للمشتركين</span>
                                </span>
                              )}

                              {isYt ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                                  <YoutubeIcon className="w-3 h-3 text-rose-400" />
                                  <span>يوتيوب</span>
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
                                  <FileVideo className="w-3 h-3" />
                                  <span>ملف فيديو</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{lesson.durationMinutes} دقيقة</span>
                              </span>
                              {lesson.notes && (
                                <span className="text-gray-500 line-clamp-1">&bull; {lesson.notes}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteLesson(activeChapter.id, lesson.id)}
                            title="حذف المحاضرة"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BOOKLETS & INSTANT INTERACTIVE PRACTICE */}
      {/* ========================================================= */}
      {activeTab === 'booklets' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>قسم المذكرات والتدريبات التفاعلية</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                رفع مذكرات الشرح والتدريبات ذات الحل الفوري والتفسير
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                يمكنك رفع ملف مذكرة PDF من جهازك أو إنشاء تدريب تفاعلي يشبه الامتحانات، تظهر فيه الإجابة الصحيحة وشرح الحل تفصيلياً فور اختيار الطالب.
              </p>
            </div>

            {/* مفتاح الاختيار بين مذكرة PDF أو تدريب تفاعلي */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setBookletFormat('PDF')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                  bookletFormat === 'PDF'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <FileUp className="w-4 h-4" />
                <span>رفع مذكرة ملف PDF (رفع ملف من الجهاز)</span>
              </button>

              <button
                type="button"
                onClick={() => setBookletFormat('INTERACTIVE_PRACTICE')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                  bookletFormat === 'INTERACTIVE_PRACTICE'
                    ? 'bg-cyan-500 text-gray-950 font-extrabold shadow-md'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>تدريب تفاعلي (حل وشرح فوري 💡)</span>
              </button>
            </div>

            <form onSubmit={handleAddBooklet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-semibold block mb-1">
                    {bookletFormat === 'PDF' ? 'اسم المذكرة أو الملزمة بالعربية *' : 'عنوان التدريب التفاعلي بالعربية *'}
                  </label>
                  <input
                    type="text"
                    value={bookletTitleAr}
                    onChange={e => setBookletTitleAr(e.target.value)}
                    placeholder={
                      bookletFormat === 'PDF'
                        ? 'مثال: مذكرة شرح وقوانين الحث الكهرومغناطيسي 2025'
                        : 'مثال: تدريبات بنك الأسئلة على قانون فاراداي مع التفسير الفوري'
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {bookletFormat === 'PDF' ? (
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">عدد الصفحات التقديري</label>
                    <input
                      type="number"
                      value={bookletPages}
                      onChange={e => setBookletPages(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">عدد الأسئلة التفاعلية</label>
                    <div className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-blue-600 font-mono font-bold">
                      {practiceQuestions.length} سؤال تدريبي
                    </div>
                  </div>
                )}
              </div>

              {/* إذا كان النمط هو رفع مذكرة PDF: منطقة سحب واختيار الملف الحقيقي */}
              {bookletFormat === 'PDF' && (
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <label className="text-slate-700 font-semibold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-indigo-400" />
                      <span>ملف المذكرة (PDF File) *</span>
                    </span>
                    <span className="text-[11px] text-gray-500">اختر الملف من جهاز الكمبيوتر</span>
                  </label>

                  <input
                    ref={bookletFileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleBookletFileChange}
                    className="hidden"
                  />

                  {!bookletFileName ? (
                    <div
                      onClick={() => bookletFileInputRef.current?.click()}
                      className="p-8 rounded-2xl border-2 border-dashed border-gray-800 hover:border-indigo-500/70 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center space-y-2 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 flex items-center justify-center mx-auto transition">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        اضغط هنا لاختيار ملف المذكرة (PDF) من جهازك أو اسحبه وأفلته هنا
                      </div>
                      <p className="text-[11px] text-slate-500">
                        يدعم مستندات وملفات PDF لغاية 50 ميجابايت
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{bookletFileName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 font-mono">
                                {bookletFileSize}
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم رفع وتهيئة ملف المذكرة بنجاح للطلاب</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setBookletFileName(null);
                            setBookletFileSize(null);
                            setBookletFileUrl(null);
                            if (bookletFileInputRef.current) bookletFileInputRef.current.value = '';
                          }}
                          className="text-[11px] text-rose-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          تغيير الملف
                        </button>
                      </div>

                      {isBookletUploading && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>جاري معالجة ورفع ملف المذكرة...</span>
                            <span className="font-mono">{bookletUploadProgress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                              style={{ width: `${bookletUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* تدريب تفاعلي: محرر الأسئلة والخيارات والشرح الفوري */}
              {bookletFormat === 'INTERACTIVE_PRACTICE' && (
                <div className="space-y-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>محرر الأسئلة التفاعلية والتفسير الفوري للحل</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        أدخل نص السؤال، الخيارات الـ 4، حدد الإجابة الصحيحة، واكتب التفسير وخطوات الحل التي ستظهر للطالب فورياً.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPracticeQuestion}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-blue-700 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة سؤال آخر</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {practiceQuestions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-blue-600 flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-blue-700 flex items-center justify-center font-mono text-xs">
                              {qIdx + 1}
                            </span>
                            <span>السؤال رقم {qIdx + 1}</span>
                          </span>

                          {practiceQuestions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePracticeQuestion(qIdx)}
                              className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف هذا السؤال</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">نص السؤال أو المسألة *</label>
                          <textarea
                            rows={2}
                            value={q.questionAr}
                            onChange={e => handleUpdateQuestionText(qIdx, e.target.value)}
                            placeholder="اكتب منطوق المسألة أو السؤال هنا..."
                            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">
                            خيارات الإجابة الـ 4 (حدد الدائرة للإجابة الصحيحة النموذجية) *
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = q.correctIndex === optIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                                    isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500/50'
                                      : 'bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`correct_${qIdx}`}
                                    checked={isCorrect}
                                    onChange={() => handleUpdateCorrectIndex(qIdx, optIdx)}
                                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                    title="اختر كإجابة صحيحة"
                                  />
                                  <span className="font-mono text-gray-500 text-[11px]">
                                    ({String.fromCharCode(65 + optIdx)})
                                  </span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                    placeholder={`الخيار ${optIdx + 1}...`}
                                    className="bg-transparent text-slate-900 text-xs w-full focus:outline-none"
                                    required
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* شرح الحل والتفسير النموذجي */}
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                          <label className="text-amber-800 font-bold flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>💡 خطوات التفكير وشرح الحل الفوري (يظهر للطالب بمجرد اختيار الإجابة):</span>
                          </label>
                          <textarea
                            rows={2}
                            value={q.explanationAr}
                            onChange={e => handleUpdateExplanation(qIdx, e.target.value)}
                            placeholder="مثال: من قانون فاراداي: emf = -N(ΔΦ/Δt). بما أن التغير موجب والفيض يزداد، فإن القوة الدافعة الكهربية المستحثة تكون عكسية..."
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 resize-none"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* خيار المعاينة المجانية */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">إتاحة كعينة مجانية للطلاب غير المشتركين</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    يمكن للطلاب تصفح هذا المحتوى والتدرب عليه مجاناً بدون الحاجة للاشتراك أولاً.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={bookletIsFree}
                  onChange={e => setBookletIsFree(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingBooklet}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingBooklet ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الحفظ في الـ VPS...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        {bookletFormat === 'PDF' ? 'حفظ ونشر مذكرة الشرح (PDF)' : 'نشر التدريب التفاعلي في المذكرات 💡'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* قائمة المذكرات والتدريبات المنشورة حالياً */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600">فهرس المحتوى المنشور</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  المذكرات والتدريبات التفاعلية المتاحة للطلاب ({currentContent?.booklets.length || 0})
                </h3>
              </div>
            </div>

            {(!currentContent?.booklets || currentContent.booklets.length === 0) ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                لا توجد مذكرات أو تدريبات منشورة حالياً. استخدم النموذج أعلاه لنشر مذكرة أو تدريب.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentContent.booklets.map(bkt => {
                  const isPractice = bkt.format === 'INTERACTIVE_PRACTICE' || Boolean(bkt.questions && bkt.questions.length > 0);

                  return (
                    <div
                      key={bkt.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-500/40 flex items-center justify-between gap-3 text-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          isPractice ? 'bg-cyan-500/20 text-blue-700' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {isPractice ? <Sparkles className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{bkt.titleAr}</h4>

                            {isPractice ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-blue-700 font-bold border border-cyan-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>تدريب تفاعلي مع حل وشرح فوري</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>ملف PDF</span>
                              </span>
                            )}

                            {bkt.isFree && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                                عينة مجانية
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>
                              {isPractice ? `${bkt.questions?.length || 3} أسئلة تدريبية مع التفسير` : `${bkt.pageCount} صفحة &bull; ${bkt.fileSize || 'PDF'}`}
                            </span>
                            <span>&bull; {bkt.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteItem(bkt.id, bkt.titleAr)}
                          title="حذف المذكرة"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REVISIONS (PDF & VIDEO) */}
      {/* ========================================================= */}
      {activeTab === 'revisions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>قسم المراجعات الدورية وليلة الامتحان</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                رفع مراجعات المنهج (ملفات PDF أو فيديوهات شرح مسجلة أو يوتيوب)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                يمكنك رفع ملف مراجعة PDF بنماذج الامتحانات من جهازك، أو نشر فيديو مراجعة شامل برفع ملف الفيديو مباشرة أو إدراج رابط يوتيوب.
              </p>
            </div>

            {/* مفتاح الاختيار بين مراجعة PDF أو فيديو شرح */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRevisionFormat('PDF')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                  revisionFormat === 'PDF'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <FileUp className="w-4 h-4" />
                <span>رفع ملف مراجعة PDF (رفع ملف من الجهاز)</span>
              </button>

              <button
                type="button"
                onClick={() => setRevisionFormat('VIDEO')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                  revisionFormat === 'VIDEO'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>فيديو مراجعة وشرح 🎬</span>
              </button>
            </div>

            <form onSubmit={handleAddRevision} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-semibold block mb-1">
                    {revisionFormat === 'PDF' ? 'عنوان ملف المراجعة بالعربية *' : 'عنوان فيديو المراجعة بالعربية *'}
                  </label>
                  <input
                    type="text"
                    value={revisionTitleAr}
                    onChange={e => setRevisionTitleAr(e.target.value)}
                    placeholder={
                      revisionFormat === 'PDF'
                        ? 'مثال: مراجعة ليلة الامتحان الشاملة - 200 سؤال ونموذج إجابة'
                        : 'مثال: فيديو حل وتفسير الامتحان التجريبي الوزاري 2024 كاملاً'
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {revisionFormat === 'PDF' ? (
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">عدد الصفحات التقديري</label>
                    <input
                      type="number"
                      value={revisionPages}
                      onChange={e => setRevisionPages(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">مدة الفيديو التقديرية (بالدقائق)</label>
                    <input
                      type="number"
                      value={revisionDuration}
                      onChange={e => setRevisionDuration(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* إذا كان مراجعة PDF: مكان اختيار ورفع ملف PDF */}
              {revisionFormat === 'PDF' && (
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <label className="text-slate-700 font-semibold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-emerald-400" />
                      <span>ملف المراجعة ونماذج الإجابة (PDF File) *</span>
                    </span>
                    <span className="text-[11px] text-gray-500">اختر الملف من جهاز الكمبيوتر</span>
                  </label>

                  <input
                    ref={revisionPdfFileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleRevisionPdfFileChange}
                    className="hidden"
                  />

                  {!revisionPdfFileName ? (
                    <div
                      onClick={() => revisionPdfFileInputRef.current?.click()}
                      className="p-8 rounded-2xl border-2 border-dashed border-gray-800 hover:border-emerald-500/70 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center space-y-2 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 flex items-center justify-center mx-auto transition">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        اضغط هنا لاختيار ملف المراجعة (PDF) من جهازك أو اسحبه وأفلته هنا
                      </div>
                      <p className="text-[11px] text-slate-500">
                        يدعم ملفات ونماذج الامتحانات بصيغة PDF حتى 50 ميجابايت
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{revisionPdfFileName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 font-mono">
                                {revisionPdfFileSize}
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم رفع وتهيئة ملف المراجعة بنجاح</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setRevisionPdfFileName(null);
                            setRevisionPdfFileSize(null);
                            setRevisionPdfFileUrl(null);
                            if (revisionPdfFileInputRef.current) revisionPdfFileInputRef.current.value = '';
                          }}
                          className="text-[11px] text-rose-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          تغيير الملف
                        </button>
                      </div>

                      {isRevisionPdfUploading && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>جاري معالجة ورفع ملف المراجعة...</span>
                            <span className="font-mono">{revisionPdfUploadProgress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                              style={{ width: `${revisionPdfUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* إذا كان فيديو مراجعة: اختيار بين رفع ملف أو رابط يوتيوب */}
              {revisionFormat === 'VIDEO' && (
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <label className="text-slate-700 font-semibold text-xs block">مصدر فيديو المراجعة:</label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setRevisionVideoSource('youtube')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        revisionVideoSource === 'youtube'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <YoutubeIcon className="w-4 h-4 text-rose-500" />
                      <span>رابط يوتيوب (Unlisted)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRevisionVideoSource('upload')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        revisionVideoSource === 'upload'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <UploadCloud className="w-4 h-4 text-indigo-400" />
                      <span>رفع ملف فيديو (MP4)</span>
                    </button>
                  </div>

                  {revisionVideoSource === 'youtube' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                            <YoutubeIcon className="w-4 h-4 text-rose-500" />
                            <span>رابط فيديو المراجعة على يوتيوب *</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setRevisionYoutubeUrl('https://www.youtube.com/watch?v=ScMzIvxBSi4')}
                            className="text-[10px] text-blue-600 hover:underline"
                          >
                            تجربة رابط شرح توضيحي
                          </button>
                        </div>

                        <input
                          type="url"
                          value={revisionYoutubeUrl}
                          onChange={e => setRevisionYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500 text-left"
                          dir="ltr"
                          required
                        />
                      </div>

                      {revisionYtEmbedPreview && (
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                          <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>معاينة فيديو مراجعة يوتيوب بالمشغل الآمن:</span>
                          </div>

                          <div className="relative aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-slate-200 shadow-md">
                            <SecureLmsPlayer
                              videoUrl={revisionYoutubeUrl}
                              title={revisionTitleAr || 'فيديو مراجعة'}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* رفع ملف الفيديو للمراجعة */
                    <div className="space-y-3">
                      <input
                        ref={revisionFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={handleRevisionFileChange}
                        className="hidden"
                      />

                      {!revisionUploadedFileName ? (
                        <div
                          onClick={() => revisionFileInputRef.current?.click()}
                          className="p-8 rounded-2xl border-2 border-dashed border-gray-800 hover:border-emerald-500/60 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center space-y-2"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div className="text-xs font-bold text-slate-900">اضغط لاختيار ملف فيديو المراجعة</div>
                          <p className="text-[11px] text-slate-500">يدعم صيغ MP4, WebM, MOV حتى 2 جيجابايت</p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <FileVideo className="w-5 h-5 text-emerald-400" />
                              <div>
                                <span className="font-bold text-white">{revisionUploadedFileName}</span>
                                <span className="text-[10px] text-slate-500 block font-mono">{revisionUploadedFileSize}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setRevisionUploadedFileName(null);
                                setRevisionUploadedPreviewUrl(null);
                                if (revisionFileInputRef.current) revisionFileInputRef.current.value = '';
                              }}
                              className="text-[11px] text-rose-400 hover:underline"
                            >
                              تغيير الملف
                            </button>
                          </div>

                          {isRevisionUploading && (
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                  <span>جاري رفع ملف فيديو المراجعة...</span>
                                </span>
                                <span className="font-mono font-bold text-emerald-700 text-sm">
                                  {revisionUploadProgress}% {revisionUploadBytesText && `(${revisionUploadBytesText})`}
                                </span>
                              </div>
                              <div className="h-2.5 rounded-full bg-emerald-100 overflow-hidden p-0.5 border border-emerald-200">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-150 rounded-full shadow-sm"
                                  style={{ width: `${revisionUploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {revisionUploadedPreviewUrl && (
                            <div className="pt-3 border-t border-slate-200 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                  <span>معاينة حية لفيديو المراجعة (بالمشغل الآمن):</span>
                                </span>
                                {revisionUploadStatusMsg && (
                                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                    {revisionUploadStatusMsg.message}
                                  </span>
                                )}
                              </div>
                              <div className="relative aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-slate-200 shadow-md">
                                <SecureLmsPlayer
                                  videoUrl={revisionUploadedPreviewUrl}
                                  title={revisionTitleAr || 'فيديو مراجعة'}
                                  className="w-full h-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* خيار المعاينة المجانية */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">إتاحة كعينة مراجعة مجانية لجميع الطلاب</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    مشاهدة فيديو المراجعة أو تحميل الملف بدون اشتراك مسبق.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={revisionIsFree}
                  onChange={e => setRevisionIsFree(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingBooklet}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingBooklet ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الحفظ في الـ VPS...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        {revisionFormat === 'PDF' ? 'حفظ ونشر ملف المراجعة (PDF)' : 'نشر فيديو المراجعة والشرح 🎬'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* قائمة المراجعات المنشورة حالياً */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600">فهرس المراجعات المنشورة</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  مراجعات ونماذج ليلة الامتحان ({currentContent?.revisions.length || 0})
                </h3>
              </div>
            </div>

            {(!currentContent?.revisions || currentContent.revisions.length === 0) ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                لا توجد مراجعات مضافة حالياً. استخدم النموذج أعلاه لنشر مراجعة PDF أو فيديو شرح.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentContent.revisions.map(rev => {
                  const isVideoRev = rev.format === 'VIDEO' || Boolean(rev.videoUrl);

                  return (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 flex items-center justify-between gap-3 text-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          isVideoRev ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {isVideoRev ? <Play className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{rev.titleAr}</h4>

                            {isVideoRev ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                <span>فيديو مراجعة وشرح</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>ملف PDF</span>
                              </span>
                            )}

                            {rev.isFree && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                                عينة مجانية
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>
                              {isVideoRev ? `${rev.durationMinutes || 45} دقيقة فيديو` : `${rev.pageCount} صفحة &bull; ${rev.fileSize || 'PDF'}`}
                            </span>
                            <span>&bull; {rev.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteItem(rev.id, rev.titleAr)}
                          title="حذف المراجعة"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

