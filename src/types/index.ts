/**
 * Data types for Mầm Trí Tuệ AI - Lớp 1/2
 */

export type Role = 'teacher' | 'student' | 'parent';

export type GroupId = 'to1' | 'to2' | 'to3' | 'to4';

export type AttendanceStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'late';

export interface Student {
  id: string; // HS01 -> HS32
  name: string; // e.g. "Học sinh HS01" or real name if edited
  gender: 'male' | 'female';
  groupId: GroupId;
  stars: number; // Hoa điểm tốt
  completedTasks: number;
  attendanceToday: AttendanceStatus;
  avatar: string; // cute avatar emoji or portrait
  notes: string;
  mathAccuracy: number; // 0 - 100%
  vietAccuracy: number; // 0 - 100%
  skillsNeedSupport: string[];
  badges: string[];
  parentName?: string;
  parentPhone?: string;
}

export interface Group {
  id: GroupId;
  name: string; // RỒNG VÀNG, PHƯỢNG HOÀNG, KỲ LÂN, RÙA THẦN
  mascot: string; // 🐉, 🦅, 🦄, 🐢
  motto: string;
  color: string;
  bgGradient: string;
}

export interface PointLog {
  id: string;
  studentId: string;
  studentName: string;
  deltaStars: number;
  reason: string;
  timestamp: string;
  undone: boolean;
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'boolean' | 'fill_in' | 'matching' | 'drag_drop';
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  points: number;
  visualIcon?: string;
  audioText?: string;
}

export interface Submission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  starsEarned: number;
  tries: number;
  answers: Record<string, string>;
}

export interface Assignment {
  id: string;
  title: string;
  subject: 'Toán' | 'Tiếng Việt' | 'Tự nhiên & Xã hội' | 'Đạo đức' | 'Hoạt động trải nghiệm' | 'Môn khác';
  topic: string;
  week: string;
  level: 'Củng cố' | 'Cơ bản' | 'Mở rộng';
  targetType: 'all' | 'group' | 'individual';
  targetGroupId?: GroupId;
  targetStudentId?: string;
  questions: ExerciseQuestion[];
  deadline: string;
  createdAt: string;
  gameMode?: string;
  submissions: Record<string, Submission>;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  claimedCount: number;
  isCustom?: boolean;
}

export interface ApprovedMaterial {
  id: string;
  title: string;
  subject: string;
  topic: string;
  week: string;
  summary: string;
  content: string;
  tags: string[];
  approvedBy: string;
  dateAdded: string;
}

export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  recommendedSubject: string;
}

export type ActiveTab =
  | 'classroom'
  | 'flower_board'
  | 'recognition'
  | 'group_race'
  | 'lucky_wheel'
  | 'reward_shop'
  | 'activity_log'
  | 'curriculum'
  | 'games_arcade'
  | 'ai_workshop'
  | 'assignments'
  | 'student_portal'
  | 'parent_portal'
  | 'analytics'
  | 'top50_evidence'
  | 'materials'
  | 'settings';
