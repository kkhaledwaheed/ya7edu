import { InstructorContent } from '../types';
import { mockInstructorExams } from './exams';

export const mockInstructorContents: InstructorContent[] = [
  // 1. Mr. Ahmed Samy - Physics (3rd Secondary Thanawya Amma)
  {
    id: 'content_phys_ahmed_samy',
    instructorId: 'inst_ahmed_samy',
    instructorName: 'الأستاذ أحمد سامي',
    instructorTitle: 'كبير معلمي ومعدي مادة الفيزياء للثانوية العامة',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_phys',
    subjectName: 'الفيزياء (Physics)',
    gradeId: 'grade_sec_3',
    term: 'Full Year',
    priceMonthly: 180,
    priceTerm: 450,
    priceYear: 800,
    rating: 4.96,
    totalSubscribers: 4820,
    bioAr: 'خبرة أكثر من 16 عاماً في تدريس فيزياء الثانوية العامة، تخريج أوائل الجمهورية سنوياً، ومؤلف سلسلة "الكتيب الذهبي في الفيزياء".',
    chapters: [
      {
        id: 'chap_phys_1',
        chapterNumber: 1,
        titleEn: 'Chapter 1: Electric Current, Resistance & Kirchhoff Laws',
        titleAr: 'الباب الأول: التيار الكهربائي وقانون أوم وقانونا كيرشوف',
        description: 'مفاهيم شدة التيار وفرق الجهد والمقاومة النوعية والتوصيلية الكهربية وحل دوائر كيرشوف المعقدة.',
        lessons: [
          {
            id: 'les_p1_1',
            titleEn: '1.1 Electric Current Intensity & Potential Difference (Free Preview 1)',
            titleAr: 'الدرس الأول: شدة التيار الكهربي وفرق الجهد (معاينة مجانية 1 من 2)',
            durationMinutes: 45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            order: 1,
            isCompleted: true,
            isFree: true, // معاينة مجانية أولى
            notes: 'تعريف شدة التيار: كمية الشحنة الكهربية المارة عبر مقطع من موصل في وحدة الزمن. Q = I * t.'
          },
          {
            id: 'les_p1_2',
            titleEn: '1.2 Ohm Law & Resistor Combination (Free Preview 2)',
            titleAr: 'الدرس الثاني: قانون أوم وتوصيل المقاومات (معاينة مجانية 2 من 2)',
            durationMinutes: 52,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            order: 2,
            isCompleted: false,
            isFree: true, // معاينة مجانية ثانية
            notes: 'في التوالي: التيار ثابت والجهد يتجزأ. في التوازي: الجهد ثابت والتيار يتجزأ.'
          },
          {
            id: 'les_p1_3',
            titleEn: '1.3 Kirchhoff First & Second Laws (Subscription Required)',
            titleAr: 'الدرس الثالث: قانونا كيرشوف وتحليل الشبكات الكهربية (يتطلب اشتراك)',
            durationMinutes: 60,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            order: 3,
            isCompleted: false,
            isFree: false, // يتطلب اشتراك
            notes: 'قانون كيرشوف الأول (حفظ الشحنة) ΣI_in = ΣI_out. قانون كيرشوف الثاني (حفظ الطاقة) ΣV = 0.'
          }
        ]
      },
      {
        id: 'chap_phys_2',
        chapterNumber: 2,
        titleEn: 'Chapter 2: Magnetic Effect of Electric Current & Measuring Devices',
        titleAr: 'الباب الثاني: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس',
        description: 'المجال المغناطيسي لسلك مستقيم وملف دائري ولولبي، وأجهزة القياس التناظرية (الجلفانومتر، الأميتر، الفولتميتر، الأوميتر).',
        lessons: [
          {
            id: 'les_p2_1',
            titleEn: '2.1 Magnetic Field of Straight Wire & Circular Loop',
            titleAr: 'الدرس الأول: المجال المغناطيسي لسلك مستقيم وملف دائري',
            durationMinutes: 48,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            order: 1,
            isCompleted: false,
            isFree: false
          },
          {
            id: 'les_p2_2',
            titleEn: '2.2 Magnetic Force, Torque & Galvanometer',
            titleAr: 'الدرس الثاني: القوة المغناطيسية وعزم الازدواج والجلفانومتر',
            durationMinutes: 55,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            order: 2,
            isCompleted: false,
            isFree: false
          }
        ]
      }
    ],
    // Tab 2: قسم المذكرات
    booklets: [
      {
        id: 'bkt_1',
        titleEn: 'Chapter 1 Theory & Formulas Compendium (Free Sample)',
        titleAr: 'مذكرة شرح الباب الأول: الكهربية وقوانين كيرشوف بالتفصيل (عينة مجانية)',
        chapterTitle: 'الباب الأول',
        pageCount: 38,
        fileSize: '4.8 MB',
        downloadUrl: '#',
        type: 'BOOKLET',
        uploadDate: '2024-01-15',
        format: 'PDF',
        isFree: true // عينة مجانية متاحة للجميع
      },
      {
        id: 'bkt_2',
        titleEn: 'Chapter 1 Interactive Practice with Instant Solutions',
        titleAr: 'تدريب تفاعلي: بنك أسئلة قوانين كيرشوف والمقاومات (مع الحل والتفسير الفوري)',
        chapterTitle: 'الباب الأول',
        pageCount: 3,
        fileSize: 'تدريب تفاعلي',
        downloadUrl: '#',
        type: 'BOOKLET',
        format: 'INTERACTIVE_PRACTICE',
        uploadDate: '2024-01-20',
        isFree: true, // متاح للتجربة الفورية
        questions: [
          {
            id: 'q_kirch_1',
            questionAr: 'في دائرة كهربية تحتوي على مقاومتين متصلتين على التوازي (R1 = 6Ω و R2 = 3Ω) ومصدر جهد 12V، ما هي شدة التيار الكلي المار في الدائرة؟',
            options: ['2 أمبير', '4 أمبير', '6 أمبير', '8 أمبير'],
            correctIndex: 2,
            explanationAr: 'طريقة الحل: المقاومة المكافئة للتوازي Req = (6 × 3) / (6 + 3) = 18 / 9 = 2Ω. بتطبيق قانون أوم للدائرة المغلقة: I = V / Req = 12 / 2 = 6 أمبير.'
          },
          {
            id: 'q_kirch_2',
            questionAr: 'وفقاً لقانون كيرشوف الأول (حفظ الشحنة الكهربية)، فإن المجموع الجبري للتيارات الكهربية الداخلة والخارجة عند أي نقطة تفرع يساوي:',
            options: ['القوة الدافعة الكهربية للبطارية', 'صفر دائماً', 'مجموع فروق الجهد', 'مقاومة السلك'],
            correctIndex: 1,
            explanationAr: 'طريقة الحل: ينص قانون كيرشوف الأول (Σ I = 0) على أن مجموع التيارات الداخلة لنقطة تفرع يساوي مجموع التيارات الخارجة منها تطبيقاً لقانون بقاء الشحنة.'
          },
          {
            id: 'q_kirch_3',
            questionAr: 'سلكان من نفس المادة، طول الأول ضعف طول الثاني ونصف قطر الأول ضعف نصف قطر الثاني. النسبة بين مقاومة الأول إلى مقاومة الثاني (R1 : R2) تساوي:',
            options: ['1 : 2', '2 : 1', '1 : 4', '4 : 1'],
            correctIndex: 0,
            explanationAr: 'طريقة الحل: قانون المقاومة R = ρ * L / (π r²). إذن R1 / R2 = (L1 / L2) × (r2 / r1)² = 2 × (1 / 2)² = 2 × (1 / 4) = 1 / 2. أي النسبة 1 : 2.'
          }
        ]
      },
      {
        id: 'bkt_3',
        titleEn: 'Chapter 2 Magnetic Force & Measuring Instruments Booklet',
        titleAr: 'مذكرة الباب الثاني: التأثير المغناطيسي وأجهزة القياس التناظرية',
        chapterTitle: 'الباب الثاني',
        pageCount: 42,
        fileSize: '5.4 MB',
        downloadUrl: '#',
        type: 'BOOKLET',
        format: 'PDF',
        uploadDate: '2024-02-05',
        isFree: false
      }
    ],
    // Tab 3: قسم المراجعات
    revisions: [
      {
        id: 'rev_1',
        titleEn: 'Comprehensive Mid-Term 1 Physics Revision Video (YouTube)',
        titleAr: 'فيديو مراجعة ليلة الامتحان: حل وشرح أهم 50 فكرة مسألة متوقعة',
        pageCount: 1,
        fileSize: 'فيديو يوتيوب',
        downloadUrl: '#',
        type: 'REVISION',
        format: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        durationMinutes: 45,
        uploadDate: '2024-02-15',
        isFree: true // عينة مجانية
      },
      {
        id: 'rev_2',
        titleEn: 'Exam Night (Layali El-Emtehan) Comprehensive Physics Summary',
        titleAr: 'مذكرة ليلة الامتحان: أهم 100 فكرة وسؤال لن يخرج عنها الامتحان',
        pageCount: 35,
        fileSize: '6.2 MB',
        downloadUrl: '#',
        type: 'REVISION',
        uploadDate: '2024-02-25',
        isFree: false
      },
      {
        id: 'rev_3',
        titleEn: 'Solved Official Ministry Model Exams (2021-2024)',
        titleAr: 'حل نماذج امتحانات الثانوية العامة التجريبية والرسمية السابقة',
        pageCount: 50,
        fileSize: '8.1 MB',
        downloadUrl: '#',
        type: 'REVISION',
        uploadDate: '2024-03-01',
        isFree: false
      }
    ],
    // Tab 4: قسم مذكرات YA7EDU
    ya7eduBooklets: [
      {
        id: 'ya7_1',
        titleEn: 'YA7EDU Exclusive Golden Formula & Law Tables',
        titleAr: 'كتيب YA7EDU الذهبي: خلاصة قوانين ومخططات فيزياء الثانوية العامة',
        pageCount: 16,
        fileSize: '2.5 MB',
        downloadUrl: '#',
        type: 'YA7EDU_EXCLUSIVE',
        uploadDate: '2024-03-02',
        isExclusive: true,
        isFree: false
      },
      {
        id: 'ya7_2',
        titleEn: 'YA7EDU High-Yield Problem Bank (Thanawya Top 1%)',
        titleAr: 'بنك أسئلة YA7EDU الفائقة للمتفوقين وأفكار الربط بين الأبواب',
        pageCount: 32,
        fileSize: '4.7 MB',
        downloadUrl: '#',
        type: 'YA7EDU_EXCLUSIVE',
        uploadDate: '2024-03-05',
        isExclusive: true,
        isFree: false
      }
    ],
    exams: [mockInstructorExams[0]]
  },

  // 2. Mr. Mohamed Abdel Maqsoud - Mathematics (3rd Secondary Thanawya Amma)
  {
    id: 'content_math_abdel_maqsoud',
    instructorId: 'inst_mohamed_abdel',
    instructorName: 'الأستاذ محمد عبد المقصود',
    instructorTitle: 'كبير خبراء الرياضيات البحتة والتطبيقية والتفاضل والتكامل',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_math',
    subjectName: 'الرياضيات (Mathematics)',
    gradeId: 'grade_sec_3',
    term: 'Full Year',
    priceMonthly: 170,
    priceTerm: 430,
    priceYear: 750,
    rating: 4.94,
    totalSubscribers: 3650,
    bioAr: 'مؤلف سلسلة التميز في التفاضل والتكامل، خبير إعداد أسئلة التفكير العليا والنماذج الوزارية المطورة.',
    chapters: [
      {
        id: 'chap_math_1',
        chapterNumber: 1,
        titleEn: 'Chapter 1: Differentiation of Trigonometric Functions & Chain Rule',
        titleAr: 'الباب الأول: تفاضل الدوال المثلثية والاشتقاق الضمني والبارامتري',
        description: 'مشتقات الدوال المثلثية والاشتقاق الضمني والبارامتري والمشتقات العليا.',
        lessons: [
          {
            id: 'les_m1_1',
            titleEn: '1.1 Derivatives of Trigonometric Functions (Free Preview 1)',
            titleAr: 'الدرس الأول: تفاضل الدوال المثلثية المقلوبة والأساسية (معاينة مجانية 1 من 2)',
            durationMinutes: 50,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            order: 1,
            isCompleted: true,
            isFree: true
          },
          {
            id: 'les_m1_2',
            titleEn: '1.2 Implicit & Parametric Differentiation (Free Preview 2)',
            titleAr: 'الدرس الثاني: الاشتقاق الضمني والبارامتري وتطبيقاته (معاينة مجانية 2 من 2)',
            durationMinutes: 55,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            order: 2,
            isCompleted: false,
            isFree: true
          },
          {
            id: 'les_m1_3',
            titleEn: '1.3 Higher Derivatives & Geometric Tangents (Subscription Required)',
            titleAr: 'الدرس الثالث: المشتقات العليا ومعادلة المماس والعمودي (يتطلب اشتراك)',
            durationMinutes: 60,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            order: 3,
            isCompleted: false,
            isFree: false
          }
        ]
      }
    ],
    booklets: [
      {
        id: 'bkt_m1',
        titleEn: 'Calculus Chapter 1 Mastery Booklet (Free Sample)',
        titleAr: 'مذكرة تفاضل الباب الأول: الاشتقاق وتطبيقاته الهندسية (عينة مجانية)',
        pageCount: 30,
        fileSize: '3.8 MB',
        downloadUrl: '#',
        type: 'BOOKLET',
        uploadDate: '2024-01-10',
        isFree: true
      }
    ],
    revisions: [
      {
        id: 'rev_m1',
        titleEn: 'Calculus Exam Night Formula Sheet & 100 Solved Problems',
        titleAr: 'مراجعة ليلة الامتحان: 100 مسألة تفاضل وتكامل متوقعة بالخطوات',
        pageCount: 40,
        fileSize: '5.1 MB',
        downloadUrl: '#',
        type: 'REVISION',
        uploadDate: '2024-02-20',
        isFree: false
      }
    ],
    ya7eduBooklets: [
      {
        id: 'ya7_m1',
        titleEn: 'YA7EDU Math Elite Shortcuts & Graphing Hacks',
        titleAr: 'كتيب YA7EDU السري: مهارات الحل السريع بالآلة الحاسبة وبدائل الاختيارات',
        pageCount: 20,
        fileSize: '3.0 MB',
        downloadUrl: '#',
        type: 'YA7EDU_EXCLUSIVE',
        uploadDate: '2024-03-01',
        isExclusive: true,
        isFree: false
      }
    ],
    exams: [mockInstructorExams[1]]
  },

  // 3. Dr. Ehab El-Sayed - Chemistry (3rd Secondary)
  {
    id: 'content_chem_ehab',
    instructorId: 'inst_ehab_chem',
    instructorName: 'الدكتور إيهاب السيد',
    instructorTitle: 'مستشار وخبير الكيمياء العامة والعضوية للثانوية العامة',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_chem',
    subjectName: 'الكيمياء (Chemistry)',
    gradeId: 'grade_sec_3',
    term: 'Full Year',
    priceMonthly: 160,
    priceTerm: 420,
    priceYear: 750,
    rating: 4.92,
    totalSubscribers: 3100,
    bioAr: 'مؤسس منصة تبسيط الكيمياء العضوية، ومطور خرائط المفاهيم والتفاعلات الكيميائية لطلاب الثانوية العامة.',
    chapters: [
      {
        id: 'chap_chem_1',
        chapterNumber: 1,
        titleEn: 'Chapter 1: First Transition Series & Iron Metallurgy',
        titleAr: 'الباب الأول: العناصر الانتقالية وتعدين الحديد وخاماته',
        description: 'الخواص العامة لعناصر السلسلة الانتقالية الأولى، حالات التأكسد، وأكاسيد الحديد وتفاعلاتها.',
        lessons: [
          {
            id: 'les_c1_1',
            titleEn: '1.1 Transition Elements Properties & Oxidation States (Free Preview 1)',
            titleAr: 'الدرس الأول: السلسلة الانتقالية الأولى والخواص المغناطيسية والألوان (معاينة مجانية 1 من 2)',
            durationMinutes: 46,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            order: 1,
            isCompleted: false,
            isFree: true
          },
          {
            id: 'les_c1_2',
            titleEn: '1.2 Iron Extraction & Blast / Midrex Furnaces (Free Preview 2)',
            titleAr: 'الدرس الثاني: استخلاص الحديد من خاماته والفرن العالي ومدركس (معاينة مجانية 2 من 2)',
            durationMinutes: 52,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            order: 2,
            isCompleted: false,
            isFree: true
          },
          {
            id: 'les_c1_3',
            titleEn: '1.3 Iron Oxides Reactions & Properties (Subscription Required)',
            titleAr: 'الدرس الثالث: خواص وتفاعلات أكاسيد الحديد المغناطيسية والثنائية (يتطلب اشتراك)',
            durationMinutes: 58,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            order: 3,
            isCompleted: false,
            isFree: false
          }
        ]
      }
    ],
    booklets: [
      {
        id: 'bkt_c1',
        titleEn: 'Transition Metals & Chemical Equations Chart (Free Sample)',
        titleAr: 'مخطط كيمياء الباب الأول: معادلات خامات الحديد وتفاعلات الأكاسيد (عينة مجانية)',
        pageCount: 22,
        fileSize: '3.4 MB',
        downloadUrl: '#',
        type: 'BOOKLET',
        uploadDate: '2024-01-12',
        isFree: true
      }
    ],
    revisions: [
      {
        id: 'rev_c1',
        titleEn: 'Organic Chemistry Conversions Master Sheet',
        titleAr: 'مراجعة تحويلات الكيمياء العضوية في صفحتين: من الميثان إلى الأسبرين',
        pageCount: 15,
        fileSize: '2.8 MB',
        downloadUrl: '#',
        type: 'REVISION',
        uploadDate: '2024-02-18',
        isFree: false
      }
    ],
    ya7eduBooklets: [
      {
        id: 'ya7_c1',
        titleEn: 'YA7EDU Chemistry Diagnostic Flowcharts',
        titleAr: 'مخططات YA7EDU الحصرية: كيف تميز بالمعادلات والألوان بين الكواشف',
        pageCount: 18,
        fileSize: '2.6 MB',
        downloadUrl: '#',
        type: 'YA7EDU_EXCLUSIVE',
        uploadDate: '2024-03-03',
        isExclusive: true,
        isFree: false
      }
    ],
    exams: [mockInstructorExams[2]]
  }
];
