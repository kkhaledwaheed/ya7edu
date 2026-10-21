import { InstructorExam, StudentExamAttempt } from '../types';

export const mockInstructorExams: InstructorExam[] = [
  // 1. Mr. Ahmed Samy (Physics)
  {
    id: 'exam_phys_ahmed_1',
    instructorId: 'inst_ahmed_samy',
    instructorName: 'الأستاذ أحمد سامي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_phys',
    subjectName: 'الفيزياء',
    gradeId: 'grade_sec_3',
    title: 'امتحان التميز الشامل: قانون أوم وتوصيل المقاومات وقانونا كيرشوف',
    description: 'اختبار دوري يقيس نواتج التعلم لمفاهيم شدة التيار وفرق الجهد وحساب المقاومة المكافئة وحل شبكات كيرشوف.',
    durationMinutes: 20, // 20 دقيقة
    startDate: '2026-10-01',
    startTime: '09:00',
    endDate: '2026-12-31',
    endTime: '23:59',
    passingPercent: 60,
    totalMarks: 20,
    isPublished: true,
    hideResultUntilDurationEnds: true, // ميزة حجب النتيجة حتى انتهاء الوقت الكلي
    createdAt: '2024-03-01T10:00:00Z',
    questions: [
      {
        id: 'q_p1',
        questionText: 'سلك مقاومته النوعية 4 × 10^-7 أوم.م وطوله 20 متر ومساحة مقطعه 2 × 10^-6 م^2، فإن مقاومته الكهربية تساوي:',
        options: [
          '4 أوم',
          '8 أوم',
          '2 أوم',
          '0.4 أوم'
        ],
        correctOptionIndex: 0,
        explanation: 'القانون R = (ρe * L) / A = (4 × 10^-7 * 20) / (2 × 10^-6) = 4 أوم.',
        marks: 5
      },
      {
        id: 'q_p2',
        questionText: 'ثلاث مقاومات متماثلة قيمة كل منها 6 أوم، وُصلت معاً على التوازي، فإن المقاومة المكافئة للمجموعة تساوي:',
        options: [
          '18 أوم',
          '2 أوم',
          '3 أوم',
          '0.5 أوم'
        ],
        correctOptionIndex: 1,
        explanation: 'في التوصيل على التوازي لمقاومات متماثلة: R_eq = R / n = 6 / 3 = 2 أوم.',
        marks: 5
      },
      {
        id: 'q_p3',
        questionText: 'في قانون كيرشوف الأول (نقطة التفرع)، يعتمد القانون فيزيائياً على مبدأ أساسي هو:',
        options: [
          'قانون بقاء الطاقة',
          'قانون بقاء الشحنة الكهربية',
          'قانون بقاء كمية الحركة',
          'قانون الجاذبية الكونية'
        ],
        correctOptionIndex: 1,
        explanation: 'قانون كيرشوف الأول ΣI_in = ΣI_out يعبر عن قانون حفظ وبقاء الشحنة الكهربية لأن الشحنة لا تفنى ولا تستحدث عند نقطة التفرع.',
        marks: 5
      },
      {
        id: 'q_p4',
        questionText: 'إذا زاد طول موصل للضعف وقُلت مساحة مقطعه للنصف مع ثبوت درجة الحرارة، فإن مقاومته الكهربية:',
        options: [
          'تزداد إلى الضعف',
          'تظل ثابتة لا تتغير',
          'تزداد إلى أربعة أمثالها',
          'تقل إلى الربع'
        ],
        correctOptionIndex: 2,
        explanation: 'R ∝ L / A => عند مضاعفة L مرتين وقسمة A على 2 تصبح المقاومة (2 / 0.5) = 4 أمثال قيمتها الأصلية.',
        marks: 5
      }
    ]
  },

  // 2. Mr. Mohamed Abdel Maqsoud (Math)
  {
    id: 'exam_math_abdel_1',
    instructorId: 'inst_mohamed_abdel',
    instructorName: 'الأستاذ محمد عبد المقصود',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_math',
    subjectName: 'الرياضيات',
    gradeId: 'grade_sec_3',
    title: 'اختبار تفكير عليا: تفاضل الدوال المثلثية والاشتقاق الضمني',
    description: 'اختبار دقيق على قواعد مشتقات القا والظا والظتا ومعادلة المماس والعمودي للمنحنيات.',
    durationMinutes: 25,
    startDate: '2026-10-01',
    startTime: '10:00',
    endDate: '2026-12-31',
    endTime: '23:59',
    passingPercent: 65,
    totalMarks: 20,
    isPublished: true,
    hideResultUntilDurationEnds: true,
    createdAt: '2024-03-05T12:00:00Z',
    questions: [
      {
        id: 'q_m1',
        questionText: 'إذا كانت ص = ظا(2س)، فإن دص / دس تساوي:',
        options: [
          'قا^2(2س)',
          '2 قا^2(2س)',
          '2 ظتا(2س)',
          '-2 قا(2س) ظا(2س)'
        ],
        correctOptionIndex: 1,
        explanation: 'مشتقة ظا(د(س)) هي د\'(س) * قا^2(د(س))، وبالتالي المشتقة = 2 قا^2(2س).',
        marks: 10
      },
      {
        id: 'q_m2',
        questionText: 'ميل المماس للمنحنى س^2 + ص^2 = 25 عند النقطة (3، 4) هو:',
        options: [
          '-3 / 4',
          '3 / 4',
          '-4 / 3',
          '4 / 3'
        ],
        correctOptionIndex: 0,
        explanation: 'بالاشتقاق الضمني: 2س + 2ص (دص/دس) = 0 => دص/دس = -س / ص = -3 / 4.',
        marks: 10
      }
    ]
  },

  // 3. Dr. Ehab El-Sayed (Chemistry)
  {
    id: 'exam_chem_ehab_1',
    instructorId: 'inst_ehab_chem',
    instructorName: 'الدكتور إيهاب السيد',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_chem',
    subjectName: 'الكيمياء',
    gradeId: 'grade_sec_3',
    title: 'امتحان كيمياء الباب الأول: السلسلة الانتقالية وخامات الحديد',
    description: 'تقييم شامل على حالات التأكسد والتوزيع الإلكتروني ومعادلات أفران الاختزال.',
    durationMinutes: 15,
    startDate: '2026-10-01',
    startTime: '08:00',
    endDate: '2026-12-31',
    endTime: '23:59',
    passingPercent: 60,
    totalMarks: 20,
    isPublished: true,
    hideResultUntilDurationEnds: true,
    createdAt: '2024-03-08T09:00:00Z',
    questions: [
      {
        id: 'q_c1',
        questionText: 'العنصر الانتقالي الوحيد في السلسلة الأولى الذي يعطي حالة تأكسد +7 هو:',
        options: [
          'الكروم (Cr)',
          'المنجنيز (Mn)',
          'الحديد (Fe)',
          'الفاناديوم (V)'
        ],
        correctOptionIndex: 1,
        explanation: 'المنجنيز 25Mn تركيبه [Ar] 4s2 3d5 يفقد جميع إلكترونات s و d ليعطي أقصى حالة تأكسد +7.',
        marks: 10
      },
      {
        id: 'q_c2',
        questionText: 'الغاز المستخدم كعامل مختزل في فرن مدركس هو:',
        options: [
          'أول أكسيد الكربون فقط',
          'الهيدروجين فقط',
          'الغاز المائي (خليط CO و H2)',
          'غاز الميثان الطبيعي'
        ],
        correctOptionIndex: 2,
        explanation: 'في فرن مدركس يتم استخدام الغاز المائي المحضر من الميثان كعامل مختزل لخامات الحديد.',
        marks: 10
      }
    ]
  }
];

export const mockStudentExamAttempts: StudentExamAttempt[] = [
  {
    id: 'att_demo_1',
    examId: 'exam_phys_ahmed_1',
    studentId: 'usr_student_1',
    studentName: 'عمر خالد المنشاوي',
    startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // بدأ منذ 5 دقائق
    submittedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // سلم منذ دقيقتين
    answers: {
      q_p1: 0,
      q_p2: 1,
      q_p3: 1,
      q_p4: 2
    },
    totalScore: 20,
    maxScore: 20,
    scorePercent: 100,
    passed: true,
    isUnlocked: false // محجوب لأن مدة الـ 20 دقيقة لم تنتهِ بعد!
  }
];
