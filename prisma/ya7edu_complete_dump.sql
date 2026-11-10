-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: ya7edu_db
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AcademicGrade`
--

DROP TABLE IF EXISTS `AcademicGrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AcademicGrade` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SECONDARY',
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AcademicGrade`
--

LOCK TABLES `AcademicGrade` WRITE;
/*!40000 ALTER TABLE `AcademicGrade` DISABLE KEYS */;
INSERT INTO `AcademicGrade` VALUES ('grade_sec_1','1st Secondary','الصف الأول الثانوي','Secondary Stage','Foundational secondary curriculum & introductory sciences.','2026-11-10 12:52:03.332'),('grade_sec_2','2nd Secondary','الصف الثاني الثانوي','Secondary Stage','Advanced secondary stream specialization (Scientific & Literary).','2026-11-10 12:52:03.332'),('grade_sec_3','3rd Secondary (Thanawya Amma)','الصف الثالث الثانوي (الثانوية العامة)','Secondary Stage','Official Egyptian National High School Certificate curriculum.','2026-11-10 12:52:03.332');
/*!40000 ALTER TABLE `AcademicGrade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookletItem`
--

DROP TABLE IF EXISTS `BookletItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookletItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapterTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageCount` int DEFAULT '24',
  `fileSize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '14.2 MB',
  `downloadUrl` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BOOKLET',
  `uploadDate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isExclusive` tinyint(1) NOT NULL DEFAULT '0',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `format` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PDF',
  `videoUrl` text COLLATE utf8mb4_unicode_ci,
  `durationMinutes` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `contentId` (`contentId`),
  KEY `type` (`type`),
  CONSTRAINT `fk_booklet_content` FOREIGN KEY (`contentId`) REFERENCES `InstructorContent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookletItem`
--

LOCK TABLES `BookletItem` WRITE;
/*!40000 ALTER TABLE `BookletItem` DISABLE KEYS */;
INSERT INTO `BookletItem` VALUES ('bk_phy_ch1_full','content_ahmed_phys','Chapter 1 Ultimate Booklet','مذكرة الشرح والواجب الشاملة: التيار الكهربي وقوانين كيرشوف 2026','الباب الأول',48,'18.2 MB','https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf','BOOKLET','2026-10-02',0,0,'PDF',NULL,NULL,'2026-11-10 12:52:03.377'),('bk_phy_free_preview','content_ahmed_phys','Chapter 1 Free Sample Booklet','مذكرة المعاينة المجانية: ملخص قوانين التيار الكهربي وأوم','الباب الأول',16,'6.4 MB','https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf','BOOKLET','2026-10-01',0,1,'PDF',NULL,NULL,'2026-11-10 12:52:03.377'),('bk_phy_interactive_ch1','content_ahmed_phys','Chapter 1 Interactive Practice Engine','تدريب تفاعلي ذاتي: 10 مسائل تطبيقية على المقاومة المكافئة مع الشرح الفوري','الباب الأول',NULL,NULL,NULL,'BOOKLET','2026-10-05',0,1,'INTERACTIVE_PRACTICE',NULL,NULL,'2026-11-10 12:52:03.377'),('bk_phy_ya7edu_exclusive','content_ahmed_phys','YA7EDU Exclusive Golden Cheat-Sheet','كتيب YA7EDU الماسي: خرائط قوانين ومفاتيح حل الفيزياء للثانوية العامة','كتيب المنظومة الحصري',32,'12.0 MB','https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf','YA7EDU_EXCLUSIVE','2026-10-10',1,0,'PDF',NULL,NULL,'2026-11-10 12:52:03.377');
/*!40000 ALTER TABLE `BookletItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookletQuestion`
--

DROP TABLE IF EXISTS `BookletQuestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookletQuestion` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bookletId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionAr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `correctIndex` int NOT NULL DEFAULT '0',
  `explanationAr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookletId` (`bookletId`),
  CONSTRAINT `fk_booklet_q` FOREIGN KEY (`bookletId`) REFERENCES `BookletItem` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookletQuestion`
--

LOCK TABLES `BookletQuestion` WRITE;
/*!40000 ALTER TABLE `BookletQuestion` DISABLE KEYS */;
INSERT INTO `BookletQuestion` VALUES ('bq_1','bk_phy_interactive_ch1','سلكان من نفس المادة طول الأول ضعف طول الثاني ونصف قطر الأول ضعف نصف قطر الثاني، فإن النسبة بين مقاومة الأول إلى الثاني (R1 : R2) تساوي:','[\"1 : 2\", \"2 : 1\", \"1 : 1\", \"1 : 4\"]',0,'بما أن R = ρe * L / (π * r^2)، فإن R1/R2 = (L1/L2) * (r2/r1)^2 = (2/1) * (1/2)^2 = 2 * (1/4) = 1/2.'),('bq_2','bk_phy_interactive_ch1','عند سحب سلك معدني بانتظام ليزداد طوله بمقدار 100% (أي تضاعف طوله)، فإن مقاومته الكهربية تصبح:','[\"ضعف قيمتها الأصلية\", \"أربعة أمثال قيمتها الأصلية\", \"نصف قيمتها الأصلية\", \"ثابتة\"]',1,'عند سحب السلك يظل الحجم V ثابتاً، فإذا تضاعف الطول L للضعف، تقل المساحة A للنصف، فتزداد المقاومة إلى 4 أمثالها.');
/*!40000 ALTER TABLE `BookletQuestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chapter` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapterNumber` int NOT NULL DEFAULT '1',
  `titleEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `contentId` (`contentId`),
  CONSTRAINT `fk_chapter_content` FOREIGN KEY (`contentId`) REFERENCES `InstructorContent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chapter`
--

LOCK TABLES `Chapter` WRITE;
/*!40000 ALTER TABLE `Chapter` DISABLE KEYS */;
INSERT INTO `Chapter` VALUES ('chap_chem_1','content_khaled_chem',1,'Chapter 1: Transition Elements','الباب الأول: العناصر الانتقالية والسلسلة الانتقالية الأولى','خواص الحديد واستخلاصه من خاماته ومعادلات الأكاسيد وألوان الأيونات.'),('chap_math_1','content_mohamed_math',1,'Unit 1: Differential Calculus','الوحدة الأولى: تفاضل الدوال المثلثية والاشتقاق البارامتري','معادلة المماس والعمودي، ومعدلات التغير المرتبطة بالزمن.'),('chap_phy_1','content_ahmed_phys',1,'Chapter 1: Electric Current & Ohm Law','الباب الأول: التيار الكهربي وقانون أوم وقانونا كيرشوف','دراسة تفصيلية للمقاومة الكهربية والتوصيل على التوالي والتوازي وشبكات كيرشوف المعقدة.'),('chap_phy_2','content_ahmed_phys',2,'Chapter 2: Magnetic Effects & Forces','الباب الثاني: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس','المجال المغناطيسي لسلك وملف دائري ولولبي، عزم الازدواج، والجلفانومتر والأميتر والفولتميتر.');
/*!40000 ALTER TABLE `Chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InstructorContent`
--

DROP TABLE IF EXISTS `InstructorContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InstructorContent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorAvatar` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `term` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Full Year',
  `priceMonthly` double NOT NULL DEFAULT '150',
  `priceTerm` double NOT NULL DEFAULT '400',
  `priceYear` double NOT NULL DEFAULT '900',
  `rating` double NOT NULL DEFAULT '4.9',
  `totalSubscribers` int NOT NULL DEFAULT '0',
  `bioAr` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `instructorId` (`instructorId`),
  KEY `subjectId` (`subjectId`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `fk_ic_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ic_subj` FOREIGN KEY (`subjectId`) REFERENCES `Subject` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ic_user` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InstructorContent`
--

LOCK TABLES `InstructorContent` WRITE;
/*!40000 ALTER TABLE `InstructorContent` DISABLE KEYS */;
INSERT INTO `InstructorContent` VALUES ('content_ahmed_phys','inst_ahmed_samy','الأستاذ أحمد سامي','خبير تدريس الفيزياء ومؤلف سلسلة التميز للثانوية العامة','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','subj_g3_phys','الفيزياء','grade_sec_3','Full Year',160,420,950,4.98,1420,'رحلة متكاملة في مادة الفيزياء تشمل كروت الشحن، مذكرات التأسيس الحصرية، وامتحانات بنك الأسئلة الدورية.','2026-11-10 12:52:03.362','2026-11-10 12:52:03.362'),('content_hassan_bio','inst_hassan_bio','الأستاذ حسن المحلاوي','كبير معلمي الأحياء والمشرف على أوائل الجمهورية','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80','subj_g3_bio','الأحياء والجيولوجيا','grade_sec_3','Full Year',150,400,900,4.97,1650,'أقوى كورس تفاعلي للأحياء مع نماذج تجريبية ثلاثية الأبعاد وشروحات حصرية للـ DNA.','2026-11-10 12:52:03.362','2026-11-10 12:52:03.362'),('content_khaled_chem','inst_khaled_chem','الدكتور خالد عبد العزيز','دكتوراه الكيمياء ومعد المناهج بالوزارة','https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80','subj_g3_chem','الكيمياء','grade_sec_3','Full Year',150,400,900,4.95,1180,'كورس الكيمياء الشامل من الصفر حتى الـ 60/60 بإذن الله مع بنك أسئلة نواتج التعلم.','2026-11-10 12:52:03.362','2026-11-10 12:52:03.362'),('content_mohamed_math','inst_mohamed_abdel','الأستاذ محمد عبد المقصود','كبير معلمي الرياضيات والاشتقاق الضمني','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','subj_g3_math','الرياضيات','grade_sec_3','Full Year',180,480,1100,4.92,940,'تغطية تفصيلية لجميع أفكار الرياضيات والمفاهيم الوزارية الحديثة.','2026-11-10 12:52:03.362','2026-11-10 12:52:03.362');
/*!40000 ALTER TABLE `InstructorContent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InstructorExam`
--

DROP TABLE IF EXISTS `InstructorExam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InstructorExam` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorAvatar` text COLLATE utf8mb4_unicode_ci,
  `subjectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `durationMinutes` int NOT NULL DEFAULT '60',
  `startDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passingPercent` int NOT NULL DEFAULT '60',
  `totalMarks` int NOT NULL DEFAULT '50',
  `isPublished` tinyint(1) NOT NULL DEFAULT '1',
  `hideResultUntilDurationEnds` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `instructorId` (`instructorId`),
  KEY `subjectId` (`subjectId`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `fk_exam_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exam_inst` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exam_subj` FOREIGN KEY (`subjectId`) REFERENCES `Subject` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InstructorExam`
--

LOCK TABLES `InstructorExam` WRITE;
/*!40000 ALTER TABLE `InstructorExam` DISABLE KEYS */;
INSERT INTO `InstructorExam` VALUES ('exam_math_abdel_1','inst_mohamed_abdel','الأستاذ محمد عبد المقصود','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','subj_g3_math','الرياضيات','grade_sec_3','اختبار تفكير عليا: تفاضل الدوال المثلثية والاشتقاق الضمني','اختبار دقيق على قواعد مشتقات القا والظا والظتا ومعادلة المماس والعمودي للمنحنيات.',25,'2026-10-01','10:00','2026-12-31','23:59',65,20,1,1,'2026-10-01 11:00:00.000'),('exam_phys_ahmed_1','inst_ahmed_samy','الأستاذ أحمد سامي','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','subj_g3_phys','الفيزياء','grade_sec_3','امتحان التميز الشامل: قانون أوم وتوصيل المقاومات وقانونا كيرشوف','اختبار دوري يقيس نواتج التعلم لمفاهيم شدة التيار وفرق الجهد وحساب المقاومة المكافئة وحل شبكات كيرشوف.',20,'2026-10-01','09:00','2026-12-31','23:59',60,20,1,1,'2026-10-01 10:00:00.000');
/*!40000 ALTER TABLE `InstructorExam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InstructorExamQuestion`
--

DROP TABLE IF EXISTS `InstructorExamQuestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InstructorExamQuestion` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `examId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `correctOptionIndex` int NOT NULL DEFAULT '0',
  `explanation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `marks` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  KEY `examId` (`examId`),
  CONSTRAINT `fk_examq_exam` FOREIGN KEY (`examId`) REFERENCES `InstructorExam` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InstructorExamQuestion`
--

LOCK TABLES `InstructorExamQuestion` WRITE;
/*!40000 ALTER TABLE `InstructorExamQuestion` DISABLE KEYS */;
INSERT INTO `InstructorExamQuestion` VALUES ('q_p1','exam_phys_ahmed_1','سلك مقاومته النوعية 4 × 10^-7 أوم.م وطوله 20 متر ومساحة مقطعه 2 × 10^-6 م^2، فإن مقاومته الكهربية تساوي:','[\"4 أوم\", \"8 أوم\", \"2 أوم\", \"0.4 أوم\"]',0,'القانون R = (ρe * L) / A = (4 × 10^-7 * 20) / (2 × 10^-6) = 4 أوم.',5),('q_p2','exam_phys_ahmed_1','ثلاث مقاومات متماثلة قيمة كل منها 6 أوم، وُصلت معاً على التوازي، فإن المقاومة المكافئة للمجموعة تساوي:','[\"18 أوم\", \"2 أوم\", \"3 أوم\", \"0.5 أوم\"]',1,'في التوصيل على التوازي لمقاومات متماثلة: R_eq = R / n = 6 / 3 = 2 أوم.',5),('q_p3','exam_phys_ahmed_1','في قانون كيرشوف الأول (نقطة التفرع)، يعتمد القانون فيزيائياً على مبدأ أساسي هو:','[\"قانون بقاء الطاقة\", \"قانون بقاء الشحنة الكهربية\", \"قانون بقاء كمية الحركة\", \"قانون الجاذبية الكونية\"]',1,'قانون كيرشوف الأول ΣI_in = ΣI_out يعبر عن قانون حفظ وبقاء الشحنة الكهربية.',5),('q_p4','exam_phys_ahmed_1','إذا زاد طول موصل للضعف وقُلت مساحة مقطعه للنصف مع ثبوت درجة الحرارة، فإن مقاومته الكهربية:','[\"تزداد إلى الضعف\", \"تظل ثابتة لا تتغير\", \"تزداد إلى أربعة أمثالها\", \"تقل إلى الربع\"]',2,'R ∝ L / A => عند مضاعفة L مرتين وقسمة A على 2 تصبح المقاومة (2 / 0.5) = 4 أمثال قيمتها الأصلية.',5);
/*!40000 ALTER TABLE `InstructorExamQuestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LessonVideo`
--

DROP TABLE IF EXISTS `LessonVideo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LessonVideo` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapterId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `durationMinutes` int NOT NULL DEFAULT '45',
  `videoUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '1',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `chapterId` (`chapterId`),
  CONSTRAINT `fk_lessonvideo_chapter` FOREIGN KEY (`chapterId`) REFERENCES `Chapter` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LessonVideo`
--

LOCK TABLES `LessonVideo` WRITE;
/*!40000 ALTER TABLE `LessonVideo` DISABLE KEYS */;
INSERT INTO `LessonVideo` VALUES ('les_chem_1_1','chap_chem_1','Lesson 1: Electron Configuration of Transition Elements','الحصة (1): التوزيع الإلكتروني وحالات التأكسد الشائعة (معاينة مجانية)',48,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',1,1,'حصة مجانية لمعاينة كورس الكيمياء والتوزيع الإلكتروني لعناصر السلسلة 3d.','2026-11-10 12:52:03.371'),('les_phy_1_1','chap_phy_1','Lesson 1: Electric Current & Potential Difference','الحصة (1): شدة التيار الكهربي وفرق الجهد والمقاومة النوعية (معاينة مجانية)',52,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',1,1,'حصة تأسيسية مجانية متاحة لجميع الطلاب بدون الحاجة لكود شحن للتعرف على طريقة الشرح المميزة.','2026-11-10 12:52:03.371'),('les_phy_1_2','chap_phy_1','Lesson 2: Series & Parallel Resistors','الحصة (2): التوصيل على التوالي والتوازي وحالات إلغاء المقاومة (معاينة مجانية)',64,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',2,1,'حصة مجانية لشرح حالات انعدام فرق الجهد وإلغاء المقاومات بسلك عديم المقاومة.','2026-11-10 12:52:03.371'),('les_phy_1_3','chap_phy_1','Lesson 3: Kirchhoff First & Second Law','الحصة (3): تطبيقات متقدمة على قانوني كيرشوف وشبكات الجهد',78,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',3,0,'شرح مسارات الدوائر المعقدة بطريقة الجدول والجهد العقدي.','2026-11-10 12:52:03.371'),('les_phy_2_1','chap_phy_2','Lesson 1: Magnetic Field of Straight Wire','الحصة (1): المجال المغناطيسي لسلك مستقيم وقاعدة اليد اليمنى لأمبير',55,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',1,0,'شرح تفصيلي لتحديد اتجاه خطوط الفيض المغناطيسي وكثافة الفيض B.','2026-11-10 12:52:03.371');
/*!40000 ALTER TABLE `LessonVideo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Profile`
--

DROP TABLE IF EXISTS `Profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Profile` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payoutMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'INSTAPAY',
  `payoutAccount` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profile`
--

LOCK TABLES `Profile` WRITE;
/*!40000 ALTER TABLE `Profile` DISABLE KEYS */;
INSERT INTO `Profile` VALUES ('prof_admin','user_admin_1',NULL,NULL,NULL,NULL,'BANK_TRANSFER','EG50000200010000000123456789',1,'2026-11-10 12:52:03.357'),('prof_ahmed','inst_ahmed_samy',NULL,NULL,NULL,NULL,'INSTAPAY','ahmed.samy@instapay',1,'2026-11-10 12:52:03.357'),('prof_hassan','inst_hassan_bio',NULL,NULL,NULL,NULL,'INSTAPAY','hassan.bio@instapay',1,'2026-11-10 12:52:03.357'),('prof_khaled','inst_khaled_chem',NULL,NULL,NULL,NULL,'VODAFONE_CASH','01022233344',1,'2026-11-10 12:52:03.357'),('prof_mohamed','inst_mohamed_abdel',NULL,NULL,NULL,NULL,'INSTAPAY','mohamed.math@instapay',1,'2026-11-10 12:52:03.357');
/*!40000 ALTER TABLE `Profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StudentExamAttempt`
--

DROP TABLE IF EXISTS `StudentExamAttempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StudentExamAttempt` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `examId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `submittedAt` datetime(3) DEFAULT NULL,
  `answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `scorePercent` double NOT NULL DEFAULT '0',
  `totalScore` double NOT NULL DEFAULT '0',
  `maxScore` double NOT NULL DEFAULT '50',
  `passed` tinyint(1) NOT NULL DEFAULT '0',
  `isUnlocked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `examId` (`examId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `fk_attempt_exam` FOREIGN KEY (`examId`) REFERENCES `InstructorExam` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attempt_user` FOREIGN KEY (`studentId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StudentExamAttempt`
--

LOCK TABLES `StudentExamAttempt` WRITE;
/*!40000 ALTER TABLE `StudentExamAttempt` DISABLE KEYS */;
INSERT INTO `StudentExamAttempt` VALUES ('att_demo_01','exam_phys_ahmed_1','user_student_1','محمد جمال فؤاد','2026-10-15 14:00:00.000','2026-10-15 14:18:30.000','{\"q_p1\":0,\"q_p2\":1,\"q_p3\":1,\"q_p4\":2}',100,20,20,1,0);
/*!40000 ALTER TABLE `StudentExamAttempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subject`
--

DROP TABLE IF EXISTS `Subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subject` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BookOpen',
  `color` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `fk_subject_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subject`
--

LOCK TABLES `Subject` WRITE;
/*!40000 ALTER TABLE `Subject` DISABLE KEYS */;
INSERT INTO `Subject` VALUES ('subj_g1_phys','Physics G1','فيزياء أولى ثانوي','grade_sec_1','Zap','#2563eb','القياس الفيزيائي والكميات القياسية والمتجهة والحركة في خط مستقيم.','2026-11-10 12:52:03.347'),('subj_g2_phys','Physics G2','فيزياء تانية ثانوي','grade_sec_2','Zap','#2563eb','الحركة الموجية والضوء وخواص الموائع وقوانين الغازات.','2026-11-10 12:52:03.347'),('subj_g3_arabic','Arabic','اللغة العربية','grade_sec_3','BookOpen','#6366f1','النحو والبلاغة والأدب والنصوص والقراءة المتحررة.','2026-11-10 12:52:03.347'),('subj_g3_bio','Biology','الأحياء والجيولوجيا','grade_sec_3','Dna','#10b981','الدعامة والحركة والمناعة والبيولوجيا الجزيئية DNA.','2026-11-10 12:52:03.347'),('subj_g3_chem','Chemistry','الكيمياء','grade_sec_3','FlaskConical','#0284c7','العناصر الانتقالية والاتزان الكيميائي والكيمياء العضوية.','2026-11-10 12:52:03.347'),('subj_g3_eng','English','اللغة الإنجليزية','grade_sec_3','Languages','#8b5cf6','Advanced comprehension, essay writing, and structural grammar.','2026-11-10 12:52:03.347'),('subj_g3_math','Mathematics','الرياضيات','grade_sec_3','Binary','#3b82f6','التفاضل والتكامل والجبر والهندسة الفراغية والاستاتيكا.','2026-11-10 12:52:03.347'),('subj_g3_phys','Physics','الفيزياء','grade_sec_3','Zap','#2563eb','التيار الكهربي وقانون أوم وكيرشوف والفيزياء الحديثة.','2026-11-10 12:52:03.347');
/*!40000 ALTER TABLE `Subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemConfig`
--

DROP TABLE IF EXISTS `SystemConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemConfig` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `platformCommissionRate` double NOT NULL DEFAULT '15',
  `payoutMinimumThreshold` double NOT NULL DEFAULT '50',
  `bannerAnnouncement` text COLLATE utf8mb4_unicode_ci,
  `isMaintenanceMode` tinyint(1) NOT NULL DEFAULT '0',
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemConfig`
--

LOCK TABLES `SystemConfig` WRITE;
/*!40000 ALTER TABLE `SystemConfig` DISABLE KEYS */;
INSERT INTO `SystemConfig` VALUES ('default',15,50,'🚀 مرحباً بكم في منصة YA7EDU الرقمية الذكية - العام الدراسي 2026 | حوكمة سناتر الجمهورية وكروت الشحن الفورية',0,'2026-11-10 12:52:03.406');
/*!40000 ALTER TABLE `SystemConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeacherSubscription`
--

DROP TABLE IF EXISTS `TeacherSubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeacherSubscription` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorAvatar` text COLLATE utf8mb4_unicode_ci,
  `subjectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` datetime(3) NOT NULL,
  `durationLabel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VOUCHER_CARD',
  `voucherCodeUsed` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `instructorId` (`instructorId`),
  KEY `subjectId` (`subjectId`),
  KEY `gradeId` (`gradeId`),
  KEY `status` (`status`),
  CONSTRAINT `fk_sub_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_inst` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_student` FOREIGN KEY (`studentId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_subj` FOREIGN KEY (`subjectId`) REFERENCES `Subject` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeacherSubscription`
--

LOCK TABLES `TeacherSubscription` WRITE;
/*!40000 ALTER TABLE `TeacherSubscription` DISABLE KEYS */;
INSERT INTO `TeacherSubscription` VALUES ('sub_mohamed_ahmed_phys','user_student_1','inst_ahmed_samy','الأستاذ أحمد سامي','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','subj_g3_phys','الفيزياء','grade_sec_3','2026-10-01 10:00:00.000','2026-11-30 23:59:59.000','اشتراك شهري مفعل','VOUCHER_CARD','YA7-PHY-PAID-001','ACTIVE');
/*!40000 ALTER TABLE `TeacherSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENT',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `headline` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validityType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LIFETIME',
  `validityDurationLabel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validityExpiresAt` datetime(3) DEFAULT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  KEY `status` (`status`),
  KEY `gradeId` (`gradeId`),
  CONSTRAINT `fk_user_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('inst_ahmed_samy','ahmed.samy@ya7edu.com','الأستاذ أحمد سامي','01011122233','$2b$10$dummyHashInstAhmed','INSTRUCTOR','ACTIVE','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80','خبير تدريس الفيزياء للثانوية العامة ومؤلف سلسلة التميز','خبرة أكثر من 18 عاماً في تدريس فيزياء الثانوية العامة ومدرب أوائل الجمهورية.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352'),('inst_hassan_bio','hassan.bio@ya7edu.com','الأستاذ حسن المحلاوي','01044455566','$2b$10$dummyHashInstHassan','INSTRUCTOR','ACTIVE','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80','كبير معلمي الأحياء والجيولوجيا والمشرف على تدريب أوائل المحافظات','شرح تفاعلي بالرسوم ثلاثية الأبعاد لنواتج تعلم الأحياء والـ DNA.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352'),('inst_khaled_chem','khaled.chem@ya7edu.com','الدكتور خالد عبد العزيز','01022233344','$2b$10$dummyHashInstKhaled','INSTRUCTOR','ACTIVE','https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80','دكتوراه الكيمياء العضوية ومعد البرامج التعليمية بالتلفزيون المصري','مبتكر أسلوب الخرائط الذهنية في حل معادلات الكيمياء العضوية.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352'),('inst_mohamed_abdel','mohamed.math@ya7edu.com','الأستاذ محمد عبد المقصود','01033344455','$2b$10$dummyHashInstMohamed','INSTRUCTOR','ACTIVE','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80','كبير معلمي الرياضيات بالوزارة وخبير التفاضل والتكامل','تبسيط أقوى أفكار بنك المعرفة ومسائل التفكير العليا في الرياضيات.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352'),('user_admin_1','admin@ya7edu.com','المهندس يحيى عادل (مدير المنظومة)','01090138676','$2b$10$dummyHashAdminYA7EDU','ADMIN','ACTIVE','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80','Senior Platform Architect & EduTech Director','المشرف العام على منظومة YA7EDU وحوكمة سناتر الجمهورية.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352'),('user_student_1','student@ya7edu.com','محمد جمال فؤاد','01099887766','$2b$10$dummyHashStudentMohamed','STUDENT','ACTIVE','https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80','طالب ثانوية عامة (علمي علوم) 2026','طالب مجتهد يسعى للالتحاق بكلية الطب البشري عبر منظومة YA7EDU.','grade_sec_3','LIFETIME',NULL,NULL,'2026-11-10 12:52:03.352','2026-11-10 12:52:03.352','2026-11-10 12:52:03.352');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VoucherCode`
--

DROP TABLE IF EXISTS `VoucherCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VoucherCode` (
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gradeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1_MONTH',
  `durationLabelEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `durationLabelAr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceLabel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '150 ج.م',
  `batchId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `redeemedByUserId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeemedByStudentName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeemedAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`code`),
  KEY `instructorId` (`instructorId`),
  KEY `subjectId` (`subjectId`),
  KEY `gradeId` (`gradeId`),
  KEY `status` (`status`),
  KEY `batchId` (`batchId`),
  KEY `fk_voucher_redeemer` (`redeemedByUserId`),
  CONSTRAINT `fk_voucher_grade` FOREIGN KEY (`gradeId`) REFERENCES `AcademicGrade` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_voucher_inst` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_voucher_redeemer` FOREIGN KEY (`redeemedByUserId`) REFERENCES `User` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_voucher_subj` FOREIGN KEY (`subjectId`) REFERENCES `Subject` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VoucherCode`
--

LOCK TABLES `VoucherCode` WRITE;
/*!40000 ALTER TABLE `VoucherCode` DISABLE KEYS */;
INSERT INTO `VoucherCode` VALUES ('YA7-BIO-8822-H5','inst_hassan_bio','الأستاذ حسن المحلاوي','subj_g3_bio','الأحياء والجيولوجيا','grade_sec_3','FULL_YEAR','Full Year Comprehensive','اشتراك سنوي شامل مراجعات ليلة الامتحان','900 ج.م','BATCH_DELTA_OCT_2026','AVAILABLE',NULL,NULL,NULL,'2027-06-30 23:59:59.000','2026-11-10 12:52:03.385'),('YA7-CHEM-3321-K1','inst_khaled_chem','الدكتور خالد عبد العزيز','subj_g3_chem','الكيمياء','grade_sec_3','1_MONTH','1 Month Full Access','اشتراك شهر كامل','150 ج.م','BATCH_GIZA_OCT_2026','AVAILABLE',NULL,NULL,NULL,'2026-12-31 23:59:59.000','2026-11-10 12:52:03.385'),('YA7-MATH-7711-M3','inst_mohamed_abdel','الأستاذ محمد عبد المقصود','subj_g3_math','الرياضيات','grade_sec_3','3_MONTHS','Full Term Access','اشتراك فصل دراسي كامل','480 ج.م','BATCH_ALEX_OCT_2026','AVAILABLE',NULL,NULL,NULL,'2026-12-31 23:59:59.000','2026-11-10 12:52:03.385'),('YA7-PHY-4512-B2','inst_ahmed_samy','الأستاذ أحمد سامي','subj_g3_phys','الفيزياء','grade_sec_3','1_MONTH','1 Month Full Access','اشتراك شهر كامل شامل الحصص والمذكرات','160 ج.م','BATCH_CAIRO_OCT_2026','AVAILABLE',NULL,NULL,NULL,'2026-12-31 23:59:59.000','2026-11-10 12:52:03.385'),('YA7-PHY-9821-X9','inst_ahmed_samy','الأستاذ أحمد سامي','subj_g3_phys','الفيزياء','grade_sec_3','1_MONTH','1 Month Full Access','اشتراك شهر كامل شامل الحصص والمذكرات','160 ج.م','BATCH_CAIRO_OCT_2026','AVAILABLE',NULL,NULL,NULL,'2026-12-31 23:59:59.000','2026-11-10 12:52:03.385');
/*!40000 ALTER TABLE `VoucherCode` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-10 12:52:29
