
-- YA7EDU Comprehensive Database Setup & Schema
-- Target: MySQL 8.0 on VPS (107.173.52.132)

USE ya7edu_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS StudentExamAttempt;
DROP TABLE IF EXISTS InstructorExamQuestion;
DROP TABLE IF EXISTS InstructorExam;
DROP TABLE IF EXISTS BookletQuestion;
DROP TABLE IF EXISTS BookletItem;
DROP TABLE IF EXISTS LessonVideo;
DROP TABLE IF EXISTS Chapter;
DROP TABLE IF EXISTS InstructorContent;
DROP TABLE IF EXISTS VoucherCode;
DROP TABLE IF EXISTS TeacherSubscription;
DROP TABLE IF EXISTS AuditLog;
DROP TABLE IF EXISTS Payout;
DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Progress;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS QuizSubmission;
DROP TABLE IF EXISTS Quiz;
DROP TABLE IF EXISTS Lesson;
DROP TABLE IF EXISTS Section;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Profile;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISTS AcademicGrade;
DROP TABLE IF EXISTS SystemConfig;

-- 1. Academic Grades
CREATE TABLE AcademicGrade (
  id VARCHAR(191) PRIMARY KEY,
  nameEn VARCHAR(191) NOT NULL,
  nameAr VARCHAR(191) NOT NULL,
  stage VARCHAR(191) NOT NULL DEFAULT 'SECONDARY',
  description TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Subjects
CREATE TABLE Subject (
  id VARCHAR(191) PRIMARY KEY,
  nameEn VARCHAR(191) NOT NULL,
  nameAr VARCHAR(191) NOT NULL,
  gradeId VARCHAR(191) NOT NULL,
  icon VARCHAR(191) NOT NULL DEFAULT 'BookOpen',
  color VARCHAR(191) NOT NULL DEFAULT 'blue',
  description TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX (gradeId),
  CONSTRAINT fk_subject_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users
CREATE TABLE User (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  name VARCHAR(191) NOT NULL,
  phone VARCHAR(191),
  passwordHash VARCHAR(191),
  role VARCHAR(191) NOT NULL DEFAULT 'STUDENT',
  status VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  avatar TEXT,
  headline VARCHAR(191),
  bio TEXT,
  gradeId VARCHAR(191),
  validityType VARCHAR(191) NOT NULL DEFAULT 'LIFETIME',
  validityDurationLabel VARCHAR(191),
  validityExpiresAt DATETIME(3),
  joinedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX (role),
  INDEX (status),
  INDEX (gradeId),
  CONSTRAINT fk_user_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Profile
CREATE TABLE Profile (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL UNIQUE,
  website VARCHAR(191),
  twitter VARCHAR(191),
  github VARCHAR(191),
  linkedin VARCHAR(191),
  payoutMethod VARCHAR(191) DEFAULT 'INSTAPAY',
  payoutAccount VARCHAR(191),
  notificationsEnabled BOOLEAN NOT NULL DEFAULT TRUE,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_profile_user FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Instructor Content
CREATE TABLE InstructorContent (
  id VARCHAR(191) PRIMARY KEY,
  instructorId VARCHAR(191) NOT NULL,
  instructorName VARCHAR(191) NOT NULL,
  instructorTitle VARCHAR(191) NOT NULL,
  instructorAvatar TEXT NOT NULL,
  subjectId VARCHAR(191) NOT NULL,
  subjectName VARCHAR(191) NOT NULL,
  gradeId VARCHAR(191) NOT NULL,
  term VARCHAR(191) NOT NULL DEFAULT 'Full Year',
  priceMonthly DOUBLE NOT NULL DEFAULT 150.0,
  priceTerm DOUBLE NOT NULL DEFAULT 400.0,
  priceYear DOUBLE NOT NULL DEFAULT 900.0,
  rating DOUBLE NOT NULL DEFAULT 4.9,
  totalSubscribers INT NOT NULL DEFAULT 0,
  bioAr TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX (instructorId),
  INDEX (subjectId),
  INDEX (gradeId),
  CONSTRAINT fk_ic_user FOREIGN KEY (instructorId) REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_ic_subj FOREIGN KEY (subjectId) REFERENCES Subject(id) ON DELETE CASCADE,
  CONSTRAINT fk_ic_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Chapters
CREATE TABLE Chapter (
  id VARCHAR(191) PRIMARY KEY,
  contentId VARCHAR(191) NOT NULL,
  chapterNumber INT NOT NULL DEFAULT 1,
  titleEn VARCHAR(191) NOT NULL,
  titleAr VARCHAR(191) NOT NULL,
  description TEXT,
  INDEX (contentId),
  CONSTRAINT fk_chapter_content FOREIGN KEY (contentId) REFERENCES InstructorContent(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Lesson Videos
CREATE TABLE LessonVideo (
  id VARCHAR(191) PRIMARY KEY,
  chapterId VARCHAR(191) NOT NULL,
  titleEn VARCHAR(191) NOT NULL,
  titleAr VARCHAR(191) NOT NULL,
  durationMinutes INT NOT NULL DEFAULT 45,
  videoUrl TEXT NOT NULL,
  `order` INT NOT NULL DEFAULT 1,
  isFree BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX (chapterId),
  CONSTRAINT fk_lessonvideo_chapter FOREIGN KEY (chapterId) REFERENCES Chapter(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Booklet Items (PDFs, Interactive Practice, Revision Videos)
CREATE TABLE BookletItem (
  id VARCHAR(191) PRIMARY KEY,
  contentId VARCHAR(191) NOT NULL,
  titleEn VARCHAR(191) NOT NULL,
  titleAr VARCHAR(191) NOT NULL,
  chapterTitle VARCHAR(191),
  pageCount INT DEFAULT 24,
  fileSize VARCHAR(191) DEFAULT '14.2 MB',
  downloadUrl TEXT,
  type VARCHAR(191) NOT NULL DEFAULT 'BOOKLET',
  uploadDate VARCHAR(191) NOT NULL,
  isExclusive BOOLEAN NOT NULL DEFAULT FALSE,
  isFree BOOLEAN NOT NULL DEFAULT FALSE,
  format VARCHAR(191) NOT NULL DEFAULT 'PDF',
  videoUrl TEXT,
  durationMinutes INT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX (contentId),
  INDEX (type),
  CONSTRAINT fk_booklet_content FOREIGN KEY (contentId) REFERENCES InstructorContent(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Booklet Interactive Questions
CREATE TABLE BookletQuestion (
  id VARCHAR(191) PRIMARY KEY,
  bookletId VARCHAR(191) NOT NULL,
  questionAr TEXT NOT NULL,
  options TEXT NOT NULL,
  correctIndex INT NOT NULL DEFAULT 0,
  explanationAr TEXT NOT NULL,
  INDEX (bookletId),
  CONSTRAINT fk_booklet_q FOREIGN KEY (bookletId) REFERENCES BookletItem(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Center Vouchers (كروت شحن السناتر)
CREATE TABLE VoucherCode (
  code VARCHAR(191) PRIMARY KEY,
  instructorId VARCHAR(191) NOT NULL,
  instructorName VARCHAR(191) NOT NULL,
  subjectId VARCHAR(191) NOT NULL,
  subjectName VARCHAR(191) NOT NULL,
  gradeId VARCHAR(191) NOT NULL,
  duration VARCHAR(191) NOT NULL DEFAULT '1_MONTH',
  durationLabelEn VARCHAR(191) NOT NULL,
  durationLabelAr VARCHAR(191) NOT NULL,
  priceLabel VARCHAR(191) NOT NULL DEFAULT '150 ج.م',
  batchId VARCHAR(191),
  status VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',
  redeemedByUserId VARCHAR(191),
  redeemedByStudentName VARCHAR(191),
  redeemedAt DATETIME(3),
  expiresAt DATETIME(3) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX (instructorId),
  INDEX (subjectId),
  INDEX (gradeId),
  INDEX (status),
  INDEX (batchId),
  CONSTRAINT fk_voucher_inst FOREIGN KEY (instructorId) REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_voucher_subj FOREIGN KEY (subjectId) REFERENCES Subject(id) ON DELETE CASCADE,
  CONSTRAINT fk_voucher_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE CASCADE,
  CONSTRAINT fk_voucher_redeemer FOREIGN KEY (redeemedByUserId) REFERENCES User(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Teacher Subscriptions (اشتراكات الطلاب لدى المعلمين)
CREATE TABLE TeacherSubscription (
  id VARCHAR(191) PRIMARY KEY,
  studentId VARCHAR(191) NOT NULL,
  instructorId VARCHAR(191) NOT NULL,
  instructorName VARCHAR(191) NOT NULL,
  instructorAvatar TEXT,
  subjectId VARCHAR(191) NOT NULL,
  subjectName VARCHAR(191) NOT NULL,
  gradeId VARCHAR(191) NOT NULL,
  activatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expiresAt DATETIME(3) NOT NULL,
  durationLabel VARCHAR(191) NOT NULL,
  paymentMethod VARCHAR(191) NOT NULL DEFAULT 'VOUCHER_CARD',
  voucherCodeUsed VARCHAR(191),
  status VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  INDEX (studentId),
  INDEX (instructorId),
  INDEX (subjectId),
  INDEX (gradeId),
  INDEX (status),
  CONSTRAINT fk_sub_student FOREIGN KEY (studentId) REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_inst FOREIGN KEY (instructorId) REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_subj FOREIGN KEY (subjectId) REFERENCES Subject(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Instructor Exams & Embargo System (الامتحانات وحجب النتيجة)
CREATE TABLE InstructorExam (
  id VARCHAR(191) PRIMARY KEY,
  instructorId VARCHAR(191) NOT NULL,
  instructorName VARCHAR(191) NOT NULL,
  instructorAvatar TEXT,
  subjectId VARCHAR(191) NOT NULL,
  subjectName VARCHAR(191) NOT NULL,
  gradeId VARCHAR(191) NOT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  durationMinutes INT NOT NULL DEFAULT 60,
  startDate VARCHAR(191),
  startTime VARCHAR(191),
  endDate VARCHAR(191),
  endTime VARCHAR(191),
  passingPercent INT NOT NULL DEFAULT 60,
  totalMarks INT NOT NULL DEFAULT 50,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  hideResultUntilDurationEnds BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX (instructorId),
  INDEX (subjectId),
  INDEX (gradeId),
  CONSTRAINT fk_exam_inst FOREIGN KEY (instructorId) REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_subj FOREIGN KEY (subjectId) REFERENCES Subject(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_grade FOREIGN KEY (gradeId) REFERENCES AcademicGrade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE InstructorExamQuestion (
  id VARCHAR(191) PRIMARY KEY,
  examId VARCHAR(191) NOT NULL,
  questionText TEXT NOT NULL,
  options TEXT NOT NULL,
  correctOptionIndex INT NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL,
  marks INT NOT NULL DEFAULT 2,
  INDEX (examId),
  CONSTRAINT fk_examq_exam FOREIGN KEY (examId) REFERENCES InstructorExam(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE StudentExamAttempt (
  id VARCHAR(191) PRIMARY KEY,
  examId VARCHAR(191) NOT NULL,
  studentId VARCHAR(191) NOT NULL,
  studentName VARCHAR(191) NOT NULL,
  startedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  submittedAt DATETIME(3),
  answers TEXT NOT NULL,
  scorePercent DOUBLE NOT NULL DEFAULT 0.0,
  totalScore DOUBLE NOT NULL DEFAULT 0.0,
  maxScore DOUBLE NOT NULL DEFAULT 50.0,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  isUnlocked BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX (examId),
  INDEX (studentId),
  CONSTRAINT fk_attempt_exam FOREIGN KEY (examId) REFERENCES InstructorExam(id) ON DELETE CASCADE,
  CONSTRAINT fk_attempt_user FOREIGN KEY (studentId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. System Configuration
CREATE TABLE SystemConfig (
  id VARCHAR(191) PRIMARY KEY DEFAULT 'default',
  platformCommissionRate DOUBLE NOT NULL DEFAULT 15.0,
  payoutMinimumThreshold DOUBLE NOT NULL DEFAULT 50.0,
  bannerAnnouncement TEXT,
  isMaintenanceMode BOOLEAN NOT NULL DEFAULT FALSE,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================
-- SEED DATA (بيانات المنظومة والسناتر 2026)
-- ====================================================

-- 1. Insert Academic Grades
INSERT INTO AcademicGrade (id, nameEn, nameAr, stage, description) VALUES
('grade_sec_1', '1st Secondary', 'الصف الأول الثانوي', 'Secondary Stage', 'Foundational secondary curriculum & introductory sciences.'),
('grade_sec_2', '2nd Secondary', 'الصف الثاني الثانوي', 'Secondary Stage', 'Advanced secondary stream specialization (Scientific & Literary).'),
('grade_sec_3', '3rd Secondary (Thanawya Amma)', 'الصف الثالث الثانوي (الثانوية العامة)', 'Secondary Stage', 'Official Egyptian National High School Certificate curriculum.');

-- 2. Insert Subjects
INSERT INTO Subject (id, nameEn, nameAr, gradeId, icon, color, description) VALUES
('subj_g3_phys', 'Physics', 'الفيزياء', 'grade_sec_3', 'Zap', '#2563eb', 'التيار الكهربي وقانون أوم وكيرشوف والفيزياء الحديثة.'),
('subj_g3_chem', 'Chemistry', 'الكيمياء', 'grade_sec_3', 'FlaskConical', '#0284c7', 'العناصر الانتقالية والاتزان الكيميائي والكيمياء العضوية.'),
('subj_g3_math', 'Mathematics', 'الرياضيات', 'grade_sec_3', 'Binary', '#3b82f6', 'التفاضل والتكامل والجبر والهندسة الفراغية والاستاتيكا.'),
('subj_g3_bio', 'Biology', 'الأحياء والجيولوجيا', 'grade_sec_3', 'Dna', '#10b981', 'الدعامة والحركة والمناعة والبيولوجيا الجزيئية DNA.'),
('subj_g3_arabic', 'Arabic', 'اللغة العربية', 'grade_sec_3', 'BookOpen', '#6366f1', 'النحو والبلاغة والأدب والنصوص والقراءة المتحررة.'),
('subj_g3_eng', 'English', 'اللغة الإنجليزية', 'grade_sec_3', 'Languages', '#8b5cf6', 'Advanced comprehension, essay writing, and structural grammar.'),
('subj_g2_phys', 'Physics G2', 'فيزياء تانية ثانوي', 'grade_sec_2', 'Zap', '#2563eb', 'الحركة الموجية والضوء وخواص الموائع وقوانين الغازات.'),
('subj_g1_phys', 'Physics G1', 'فيزياء أولى ثانوي', 'grade_sec_1', 'Zap', '#2563eb', 'القياس الفيزيائي والكميات القياسية والمتجهة والحركة في خط مستقيم.');

-- 3. Insert Users (Admin, Instructors, Students)
INSERT INTO User (id, email, name, phone, passwordHash, role, status, avatar, headline, bio, gradeId) VALUES
('user_admin_1', 'admin@ya7edu.com', 'المهندس يحيى عادل (مدير المنظومة)', '01090138676', '$2b$10$dummyHashAdminYA7EDU', 'ADMIN', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Senior Platform Architect & EduTech Director', 'المشرف العام على منظومة YA7EDU وحوكمة سناتر الجمهورية.', 'grade_sec_3'),
('inst_ahmed_samy', 'ahmed.samy@ya7edu.com', 'الأستاذ أحمد سامي', '01011122233', '$2b$10$dummyHashInstAhmed', 'INSTRUCTOR', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'خبير تدريس الفيزياء للثانوية العامة ومؤلف سلسلة التميز', 'خبرة أكثر من 18 عاماً في تدريس فيزياء الثانوية العامة ومدرب أوائل الجمهورية.', 'grade_sec_3'),
('inst_khaled_chem', 'khaled.chem@ya7edu.com', 'الدكتور خالد عبد العزيز', '01022233344', '$2b$10$dummyHashInstKhaled', 'INSTRUCTOR', 'ACTIVE', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'دكتوراه الكيمياء العضوية ومعد البرامج التعليمية بالتلفزيون المصري', 'مبتكر أسلوب الخرائط الذهنية في حل معادلات الكيمياء العضوية.', 'grade_sec_3'),
('inst_mohamed_abdel', 'mohamed.math@ya7edu.com', 'الأستاذ محمد عبد المقصود', '01033344455', '$2b$10$dummyHashInstMohamed', 'INSTRUCTOR', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'كبير معلمي الرياضيات بالوزارة وخبير التفاضل والتكامل', 'تبسيط أقوى أفكار بنك المعرفة ومسائل التفكير العليا في الرياضيات.', 'grade_sec_3'),
('inst_hassan_bio', 'hassan.bio@ya7edu.com', 'الأستاذ حسن المحلاوي', '01044455566', '$2b$10$dummyHashInstHassan', 'INSTRUCTOR', 'ACTIVE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'كبير معلمي الأحياء والجيولوجيا والمشرف على تدريب أوائل المحافظات', 'شرح تفاعلي بالرسوم ثلاثية الأبعاد لنواتج تعلم الأحياء والـ DNA.', 'grade_sec_3'),
('user_student_1', 'student@ya7edu.com', 'محمد جمال فؤاد', '01099887766', '$2b$10$dummyHashStudentMohamed', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'طالب ثانوية عامة (علمي علوم) 2026', 'طالب مجتهد يسعى للالتحاق بكلية الطب البشري عبر منظومة YA7EDU.', 'grade_sec_3');

-- 4. Insert Profiles
INSERT INTO Profile (id, userId, payoutMethod, payoutAccount) VALUES
('prof_admin', 'user_admin_1', 'BANK_TRANSFER', 'EG50000200010000000123456789'),
('prof_ahmed', 'inst_ahmed_samy', 'INSTAPAY', 'ahmed.samy@instapay'),
('prof_khaled', 'inst_khaled_chem', 'VODAFONE_CASH', '01022233344'),
('prof_mohamed', 'inst_mohamed_abdel', 'INSTAPAY', 'mohamed.math@instapay'),
('prof_hassan', 'inst_hassan_bio', 'INSTAPAY', 'hassan.bio@instapay');

-- 5. Insert InstructorContent
INSERT INTO InstructorContent (id, instructorId, instructorName, instructorTitle, instructorAvatar, subjectId, subjectName, gradeId, term, priceMonthly, priceTerm, priceYear, rating, totalSubscribers, bioAr) VALUES
('content_ahmed_phys', 'inst_ahmed_samy', 'الأستاذ أحمد سامي', 'خبير تدريس الفيزياء ومؤلف سلسلة التميز للثانوية العامة', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'subj_g3_phys', 'الفيزياء', 'grade_sec_3', 'Full Year', 160.0, 420.0, 950.0, 4.98, 1420, 'رحلة متكاملة في مادة الفيزياء تشمل كروت الشحن، مذكرات التأسيس الحصرية، وامتحانات بنك الأسئلة الدورية.'),
('content_khaled_chem', 'inst_khaled_chem', 'الدكتور خالد عبد العزيز', 'دكتوراه الكيمياء ومعد المناهج بالوزارة', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'subj_g3_chem', 'الكيمياء', 'grade_sec_3', 'Full Year', 150.0, 400.0, 900.0, 4.95, 1180, 'كورس الكيمياء الشامل من الصفر حتى الـ 60/60 بإذن الله مع بنك أسئلة نواتج التعلم.'),
('content_mohamed_math', 'inst_mohamed_abdel', 'الأستاذ محمد عبد المقصود', 'كبير معلمي الرياضيات والاشتقاق الضمني', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'subj_g3_math', 'الرياضيات', 'grade_sec_3', 'Full Year', 180.0, 480.0, 1100.0, 4.92, 940, 'تغطية تفصيلية لجميع أفكار الرياضيات والمفاهيم الوزارية الحديثة.'),
('content_hassan_bio', 'inst_hassan_bio', 'الأستاذ حسن المحلاوي', 'كبير معلمي الأحياء والمشرف على أوائل الجمهورية', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'subj_g3_bio', 'الأحياء والجيولوجيا', 'grade_sec_3', 'Full Year', 150.0, 400.0, 900.0, 4.97, 1650, 'أقوى كورس تفاعلي للأحياء مع نماذج تجريبية ثلاثية الأبعاد وشروحات حصرية للـ DNA.');

-- 6. Insert Chapters
INSERT INTO Chapter (id, contentId, chapterNumber, titleEn, titleAr, description) VALUES
('chap_phy_1', 'content_ahmed_phys', 1, 'Chapter 1: Electric Current & Ohm Law', 'الباب الأول: التيار الكهربي وقانون أوم وقانونا كيرشوف', 'دراسة تفصيلية للمقاومة الكهربية والتوصيل على التوالي والتوازي وشبكات كيرشوف المعقدة.'),
('chap_phy_2', 'content_ahmed_phys', 2, 'Chapter 2: Magnetic Effects & Forces', 'الباب الثاني: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس', 'المجال المغناطيسي لسلك وملف دائري ولولبي، عزم الازدواج، والجلفانومتر والأميتر والفولتميتر.'),
('chap_chem_1', 'content_khaled_chem', 1, 'Chapter 1: Transition Elements', 'الباب الأول: العناصر الانتقالية والسلسلة الانتقالية الأولى', 'خواص الحديد واستخلاصه من خاماته ومعادلات الأكاسيد وألوان الأيونات.'),
('chap_math_1', 'content_mohamed_math', 1, 'Unit 1: Differential Calculus', 'الوحدة الأولى: تفاضل الدوال المثلثية والاشتقاق البارامتري', 'معادلة المماس والعمودي، ومعدلات التغير المرتبطة بالزمن.');

-- 7. Insert Lesson Videos (Including 2 Free Preview Lessons per business rules)
INSERT INTO LessonVideo (id, chapterId, titleEn, titleAr, durationMinutes, videoUrl, `order`, isFree, notes) VALUES
('les_phy_1_1', 'chap_phy_1', 'Lesson 1: Electric Current & Potential Difference', 'الحصة (1): شدة التيار الكهربي وفرق الجهد والمقاومة النوعية (معاينة مجانية)', 52, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1, TRUE, 'حصة تأسيسية مجانية متاحة لجميع الطلاب بدون الحاجة لكود شحن للتعرف على طريقة الشرح المميزة.'),
('les_phy_1_2', 'chap_phy_1', 'Lesson 2: Series & Parallel Resistors', 'الحصة (2): التوصيل على التوالي والتوازي وحالات إلغاء المقاومة (معاينة مجانية)', 64, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 2, TRUE, 'حصة مجانية لشرح حالات انعدام فرق الجهد وإلغاء المقاومات بسلك عديم المقاومة.'),
('les_phy_1_3', 'chap_phy_1', 'Lesson 3: Kirchhoff First & Second Law', 'الحصة (3): تطبيقات متقدمة على قانوني كيرشوف وشبكات الجهد', 78, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 3, FALSE, 'شرح مسارات الدوائر المعقدة بطريقة الجدول والجهد العقدي.'),
('les_phy_2_1', 'chap_phy_2', 'Lesson 1: Magnetic Field of Straight Wire', 'الحصة (1): المجال المغناطيسي لسلك مستقيم وقاعدة اليد اليمنى لأمبير', 55, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 1, FALSE, 'شرح تفصيلي لتحديد اتجاه خطوط الفيض المغناطيسي وكثافة الفيض B.'),
('les_chem_1_1', 'chap_chem_1', 'Lesson 1: Electron Configuration of Transition Elements', 'الحصة (1): التوزيع الإلكتروني وحالات التأكسد الشائعة (معاينة مجانية)', 48, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1, TRUE, 'حصة مجانية لمعاينة كورس الكيمياء والتوزيع الإلكتروني لعناصر السلسلة 3d.');

-- 8. Insert Booklet Items (PDFs, Interactive Practice, Revision Videos)
INSERT INTO BookletItem (id, contentId, titleEn, titleAr, chapterTitle, pageCount, fileSize, downloadUrl, type, uploadDate, isExclusive, isFree, format, durationMinutes) VALUES
('bk_phy_free_preview', 'content_ahmed_phys', 'Chapter 1 Free Sample Booklet', 'مذكرة المعاينة المجانية: ملخص قوانين التيار الكهربي وأوم', 'الباب الأول', 16, '6.4 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'BOOKLET', '2026-10-01', FALSE, TRUE, 'PDF', NULL),
('bk_phy_ch1_full', 'content_ahmed_phys', 'Chapter 1 Ultimate Booklet', 'مذكرة الشرح والواجب الشاملة: التيار الكهربي وقوانين كيرشوف 2026', 'الباب الأول', 48, '18.2 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'BOOKLET', '2026-10-02', FALSE, FALSE, 'PDF', NULL),
('bk_phy_interactive_ch1', 'content_ahmed_phys', 'Chapter 1 Interactive Practice Engine', 'تدريب تفاعلي ذاتي: 10 مسائل تطبيقية على المقاومة المكافئة مع الشرح الفوري', 'الباب الأول', NULL, NULL, NULL, 'BOOKLET', '2026-10-05', FALSE, TRUE, 'INTERACTIVE_PRACTICE', NULL),
('bk_phy_ya7edu_exclusive', 'content_ahmed_phys', 'YA7EDU Exclusive Golden Cheat-Sheet', 'كتيب YA7EDU الماسي: خرائط قوانين ومفاتيح حل الفيزياء للثانوية العامة', 'كتيب المنظومة الحصري', 32, '12.0 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'YA7EDU_EXCLUSIVE', '2026-10-10', TRUE, FALSE, 'PDF', NULL);

-- 9. Insert Booklet Interactive Questions
INSERT INTO BookletQuestion (id, bookletId, questionAr, options, correctIndex, explanationAr) VALUES
('bq_1', 'bk_phy_interactive_ch1', 'سلكان من نفس المادة طول الأول ضعف طول الثاني ونصف قطر الأول ضعف نصف قطر الثاني، فإن النسبة بين مقاومة الأول إلى الثاني (R1 : R2) تساوي:', '["1 : 2", "2 : 1", "1 : 1", "1 : 4"]', 0, 'بما أن R = ρe * L / (π * r^2)، فإن R1/R2 = (L1/L2) * (r2/r1)^2 = (2/1) * (1/2)^2 = 2 * (1/4) = 1/2.'),
('bq_2', 'bk_phy_interactive_ch1', 'عند سحب سلك معدني بانتظام ليزداد طوله بمقدار 100% (أي تضاعف طوله)، فإن مقاومته الكهربية تصبح:', '["ضعف قيمتها الأصلية", "أربعة أمثال قيمتها الأصلية", "نصف قيمتها الأصلية", "ثابتة"]', 1, 'عند سحب السلك يظل الحجم V ثابتاً، فإذا تضاعف الطول L للضعف، تقل المساحة A للنصف، فتزداد المقاومة إلى 4 أمثالها.');

-- 10. Insert Voucher Codes (كروت شحن السناتر)
INSERT INTO VoucherCode (code, instructorId, instructorName, subjectId, subjectName, gradeId, duration, durationLabelEn, durationLabelAr, priceLabel, batchId, status, expiresAt) VALUES
('YA7-PHY-9821-X9', 'inst_ahmed_samy', 'الأستاذ أحمد سامي', 'subj_g3_phys', 'الفيزياء', 'grade_sec_3', '1_MONTH', '1 Month Full Access', 'اشتراك شهر كامل شامل الحصص والمذكرات', '160 ج.م', 'BATCH_CAIRO_OCT_2026', 'AVAILABLE', '2026-12-31 23:59:59'),
('YA7-PHY-4512-B2', 'inst_ahmed_samy', 'الأستاذ أحمد سامي', 'subj_g3_phys', 'الفيزياء', 'grade_sec_3', '1_MONTH', '1 Month Full Access', 'اشتراك شهر كامل شامل الحصص والمذكرات', '160 ج.م', 'BATCH_CAIRO_OCT_2026', 'AVAILABLE', '2026-12-31 23:59:59'),
('YA7-CHEM-3321-K1', 'inst_khaled_chem', 'الدكتور خالد عبد العزيز', 'subj_g3_chem', 'الكيمياء', 'grade_sec_3', '1_MONTH', '1 Month Full Access', 'اشتراك شهر كامل', '150 ج.م', 'BATCH_GIZA_OCT_2026', 'AVAILABLE', '2026-12-31 23:59:59'),
('YA7-MATH-7711-M3', 'inst_mohamed_abdel', 'الأستاذ محمد عبد المقصود', 'subj_g3_math', 'الرياضيات', 'grade_sec_3', '3_MONTHS', 'Full Term Access', 'اشتراك فصل دراسي كامل', '480 ج.م', 'BATCH_ALEX_OCT_2026', 'AVAILABLE', '2026-12-31 23:59:59'),
('YA7-BIO-8822-H5', 'inst_hassan_bio', 'الأستاذ حسن المحلاوي', 'subj_g3_bio', 'الأحياء والجيولوجيا', 'grade_sec_3', 'FULL_YEAR', 'Full Year Comprehensive', 'اشتراك سنوي شامل مراجعات ليلة الامتحان', '900 ج.م', 'BATCH_DELTA_OCT_2026', 'AVAILABLE', '2027-06-30 23:59:59');

-- 11. Insert Teacher Subscriptions (Active subscription for the student)
INSERT INTO TeacherSubscription (id, studentId, instructorId, instructorName, instructorAvatar, subjectId, subjectName, gradeId, activatedAt, expiresAt, durationLabel, paymentMethod, voucherCodeUsed, status) VALUES
('sub_mohamed_ahmed_phys', 'user_student_1', 'inst_ahmed_samy', 'الأستاذ أحمد سامي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'subj_g3_phys', 'الفيزياء', 'grade_sec_3', '2026-10-01 10:00:00', '2026-11-30 23:59:59', 'اشتراك شهري مفعل', 'VOUCHER_CARD', 'YA7-PHY-PAID-001', 'ACTIVE');

-- 12. Insert Instructor Exams (With Exam Embargo System - حجب النتيجة)
INSERT INTO InstructorExam (id, instructorId, instructorName, instructorAvatar, subjectId, subjectName, gradeId, title, description, durationMinutes, startDate, startTime, endDate, endTime, passingPercent, totalMarks, isPublished, hideResultUntilDurationEnds, createdAt) VALUES
('exam_phys_ahmed_1', 'inst_ahmed_samy', 'الأستاذ أحمد سامي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'subj_g3_phys', 'الفيزياء', 'grade_sec_3', 'امتحان التميز الشامل: قانون أوم وتوصيل المقاومات وقانونا كيرشوف', 'اختبار دوري يقيس نواتج التعلم لمفاهيم شدة التيار وفرق الجهد وحساب المقاومة المكافئة وحل شبكات كيرشوف.', 20, '2026-10-01', '09:00', '2026-12-31', '23:59', 60, 20, TRUE, TRUE, '2026-10-01 10:00:00'),
('exam_math_abdel_1', 'inst_mohamed_abdel', 'الأستاذ محمد عبد المقصود', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'subj_g3_math', 'الرياضيات', 'grade_sec_3', 'اختبار تفكير عليا: تفاضل الدوال المثلثية والاشتقاق الضمني', 'اختبار دقيق على قواعد مشتقات القا والظا والظتا ومعادلة المماس والعمودي للمنحنيات.', 25, '2026-10-01', '10:00', '2026-12-31', '23:59', 65, 20, TRUE, TRUE, '2026-10-01 11:00:00');

-- 13. Insert Exam Questions
INSERT INTO InstructorExamQuestion (id, examId, questionText, options, correctOptionIndex, explanation, marks) VALUES
('q_p1', 'exam_phys_ahmed_1', 'سلك مقاومته النوعية 4 × 10^-7 أوم.م وطوله 20 متر ومساحة مقطعه 2 × 10^-6 م^2، فإن مقاومته الكهربية تساوي:', '["4 أوم", "8 أوم", "2 أوم", "0.4 أوم"]', 0, 'القانون R = (ρe * L) / A = (4 × 10^-7 * 20) / (2 × 10^-6) = 4 أوم.', 5),
('q_p2', 'exam_phys_ahmed_1', 'ثلاث مقاومات متماثلة قيمة كل منها 6 أوم، وُصلت معاً على التوازي، فإن المقاومة المكافئة للمجموعة تساوي:', '["18 أوم", "2 أوم", "3 أوم", "0.5 أوم"]', 1, 'في التوصيل على التوازي لمقاومات متماثلة: R_eq = R / n = 6 / 3 = 2 أوم.', 5),
('q_p3', 'exam_phys_ahmed_1', 'في قانون كيرشوف الأول (نقطة التفرع)، يعتمد القانون فيزيائياً على مبدأ أساسي هو:', '["قانون بقاء الطاقة", "قانون بقاء الشحنة الكهربية", "قانون بقاء كمية الحركة", "قانون الجاذبية الكونية"]', 1, 'قانون كيرشوف الأول ΣI_in = ΣI_out يعبر عن قانون حفظ وبقاء الشحنة الكهربية.', 5),
('q_p4', 'exam_phys_ahmed_1', 'إذا زاد طول موصل للضعف وقُلت مساحة مقطعه للنصف مع ثبوت درجة الحرارة، فإن مقاومته الكهربية:', '["تزداد إلى الضعف", "تظل ثابتة لا تتغير", "تزداد إلى أربعة أمثالها", "تقل إلى الربع"]', 2, 'R ∝ L / A => عند مضاعفة L مرتين وقسمة A على 2 تصبح المقاومة (2 / 0.5) = 4 أمثال قيمتها الأصلية.', 5);

-- 14. Insert Student Exam Attempt
INSERT INTO StudentExamAttempt (id, examId, studentId, studentName, startedAt, submittedAt, answers, scorePercent, totalScore, maxScore, passed, isUnlocked) VALUES
('att_demo_01', 'exam_phys_ahmed_1', 'user_student_1', 'محمد جمال فؤاد', '2026-10-15 14:00:00', '2026-10-15 14:18:30', '{"q_p1":0,"q_p2":1,"q_p3":1,"q_p4":2}', 100.0, 20.0, 20.0, TRUE, FALSE);

-- 15. System Config
INSERT INTO SystemConfig (id, platformCommissionRate, payoutMinimumThreshold, bannerAnnouncement, isMaintenanceMode) VALUES
('default', 15.0, 50.0, '🚀 مرحباً بكم في منصة YA7EDU الرقمية الذكية - العام الدراسي 2026 | حوكمة سناتر الجمهورية وكروت الشحن الفورية', FALSE);
