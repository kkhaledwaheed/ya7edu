import { AcademicGrade, Subject } from '../types';

export const mockAcademicGrades: AcademicGrade[] = [
  {
    id: 'grade_sec_1',
    nameEn: '1st Secondary',
    nameAr: 'الصف الأول الثانوي',
    stage: 'Secondary Stage',
    description: 'Foundational secondary curriculum & introductory sciences.'
  },
  {
    id: 'grade_sec_2',
    nameEn: '2nd Secondary',
    nameAr: 'الصف الثاني الثانوي',
    stage: 'Secondary Stage',
    description: 'Advanced secondary stream specialization (Scientific & Literary).'
  },
  {
    id: 'grade_sec_3',
    nameEn: '3rd Secondary (Thanawya Amma)',
    nameAr: 'الصف الثالث الثانوي (الثانوية العامة)',
    stage: 'Secondary Stage',
    description: 'Official Egyptian National High School Certificate curriculum.'
  }
];

export const mockSubjects: Subject[] = [
  // Grade 3 Secondary (Thanawya Amma)
  {
    id: 'subj_g3_phys',
    gradeId: 'grade_sec_3',
    nameEn: 'Physics',
    nameAr: 'الفيزياء',
    icon: 'Zap',
    color: '#6366f1',
    description: 'Classical electromagnetism, alternating current, modern atomic physics, and quantum logic.'
  },
  {
    id: 'subj_g3_chem',
    gradeId: 'grade_sec_3',
    nameEn: 'Chemistry',
    nameAr: 'الكيمياء',
    icon: 'FlaskConical',
    color: '#06b6d4',
    description: 'Transition elements, chemical equilibrium, electrochemistry, and organic chemistry.'
  },
  {
    id: 'subj_g3_math',
    gradeId: 'grade_sec_3',
    nameEn: 'Pure & Applied Mathematics',
    nameAr: 'الرياضيات (التفاضل والتكامل والجبر)',
    icon: 'Binary',
    color: '#10b981',
    description: 'Calculus, spatial geometry, dynamics, statics, and advanced algebraic structures.'
  },
  {
    id: 'subj_g3_bio',
    gradeId: 'grade_sec_3',
    nameEn: 'Biology & Genetics',
    nameAr: 'الأحياء والجيولوجيا',
    icon: 'Dna',
    color: '#f59e0b',
    description: 'Molecular genetics, DNA & RNA synthesis, human physiology, immunity, and endocrine systems.'
  },
  {
    id: 'subj_g3_arabic',
    gradeId: 'grade_sec_3',
    nameEn: 'Arabic Language & Literature',
    nameAr: 'اللغة العربية',
    icon: 'BookOpen',
    color: '#ec4899',
    description: 'Classical grammar (النحو والصرف), rhetoric (البلاغة), literature schools, and literary critique.'
  },
  {
    id: 'subj_g3_eng',
    gradeId: 'grade_sec_3',
    nameEn: 'English Language',
    nameAr: 'اللغة الإنجليزية',
    icon: 'Languages',
    color: '#8b5cf6',
    description: 'Advanced comprehension, essay writing, literary works, and structural syntax.'
  },

  // Grade 2 Secondary
  {
    id: 'subj_g2_phys',
    gradeId: 'grade_sec_2',
    nameEn: 'Physics',
    nameAr: 'الفيزياء',
    icon: 'Zap',
    color: '#6366f1',
    description: 'Wave motion, light refraction, hydrodynamics, and gas laws.'
  },
  {
    id: 'subj_g2_chem',
    gradeId: 'grade_sec_2',
    nameEn: 'Chemistry',
    nameAr: 'الكيمياء',
    icon: 'FlaskConical',
    color: '#06b6d4',
    description: 'Atomic structure, periodic table properties, and chemical bonding.'
  },
  {
    id: 'subj_g2_math',
    gradeId: 'grade_sec_2',
    nameEn: 'Mathematics',
    nameAr: 'الرياضيات',
    icon: 'Binary',
    color: '#10b981',
    description: 'Functions, limits, and trigonometry fundamentals.'
  },

  // Grade 1 Secondary
  {
    id: 'subj_g1_sci',
    gradeId: 'grade_sec_1',
    nameEn: 'Integrated Sciences',
    nameAr: 'العلوم المتكاملة',
    icon: 'Atom',
    color: '#06b6d4',
    description: 'Foundations of physical and biological principles.'
  },
  {
    id: 'subj_g1_math',
    gradeId: 'grade_sec_1',
    nameEn: 'Mathematics',
    nameAr: 'الرياضيات العامة',
    icon: 'Binary',
    color: '#10b981',
    description: 'Algebra, analytical geometry, and matrix theory.'
  }
];
