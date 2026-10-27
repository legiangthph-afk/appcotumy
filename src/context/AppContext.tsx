import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Group,
  PointLog,
  Assignment,
  RewardItem,
  ApprovedMaterial,
  Role,
  ActiveTab,
  GroupId,
  AttendanceStatus,
  Submission,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_GROUPS,
  INITIAL_POINT_LOGS,
  INITIAL_REWARDS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
} from '../data/initialData';
import { sound } from '../utils/audio';

interface AppContextType {
  // State
  role: Role;
  setRole: (role: Role) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isAiOnline: boolean;

  // Data
  students: Student[];
  groups: Group[];
  pointLogs: PointLog[];
  assignments: Assignment[];
  rewards: RewardItem[];
  approvedMaterials: ApprovedMaterial[];

  // Mutations
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  moveStudentToGroup: (studentId: string, targetGroupId: GroupId) => void;
  updateAttendance: (studentId: string, status: AttendanceStatus) => void;
  awardStars: (studentId: string, amount: number, reason: string) => void;
  undoPointLog: (logId: string) => void;
  createAssignment: (assignment: Assignment) => void;
  submitAssignment: (assignmentId: string, submission: Submission) => void;
  claimReward: (studentId: string, rewardId: string) => boolean;
  addReward: (reward: Omit<RewardItem, 'id' | 'claimedCount'>) => void;
  addApprovedMaterial: (material: Omit<ApprovedMaterial, 'id' | 'dateAdded'>) => void;
  deleteApprovedMaterial: (id: string) => void;
  exportStudentsCsv: () => void;
  importStudentsCsv: (text: string) => { success: boolean; message: string };
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'mam_tri_tue_students_v1',
  POINT_LOGS: 'mam_tri_tue_logs_v1',
  ASSIGNMENTS: 'mam_tri_tue_assignments_v1',
  REWARDS: 'mam_tri_tue_rewards_v1',
  MATERIALS: 'mam_tri_tue_materials_v1',
  CURRENT_STUDENT: 'mam_tri_tue_current_student_v1',
  ROLE: 'mam_tri_tue_role_v1',
  SOUND: 'mam_tri_tue_sound_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || 'teacher';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('classroom');
  const [currentStudentId, setCurrentStudentIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT) || 'HS01';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  const [isAiOnline, setIsAiOnline] = useState<boolean>(true);

  // Data states
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_STUDENTS;
  });

  const [groups] = useState<Group[]>(INITIAL_GROUPS);

  const [pointLogs, setPointLogs] = useState<PointLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_POINT_LOGS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ASSIGNMENTS;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REWARDS;
  });

  const [approvedMaterials, setApprovedMaterials] = useState<ApprovedMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MATERIALS;
  });

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsAiOnline(data.hasApiKey);
      })
      .catch(() => {
        setIsAiOnline(false);
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINT_LOGS, JSON.stringify(pointLogs));
  }, [pointLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(approvedMaterials));
  }, [approvedMaterials]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    if (newRole === 'student') {
      setActiveTab('student_portal');
    } else if (newRole === 'parent') {
      setActiveTab('parent_portal');
    } else {
      setActiveTab('classroom');
    }
  };

  const setCurrentStudentId = (id: string) => {
    setCurrentStudentIdState(id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, id);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.setEnabled(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const nextNum = students.length + 1;
    const newId = `HS${nextNum.toString().padStart(2, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const moveStudentToGroup = (studentId: string, targetGroupId: GroupId) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, groupId: targetGroupId };
        }
        return s;
      })
    );
  };

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, attendanceToday: status };
        }
        return s;
      })
    );
  };

  const awardStars = (studentId: string, amount: number, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newStars = Math.max(0, student.stars + amount);
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, stars: newStars };
        }
        return s;
      })
    );

    const newLog: PointLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      studentName: student.name,
      deltaStars: amount,
      reason,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      undone: false,
    };

    setPointLogs(prev => [newLog, ...prev]);

    if (amount > 0) {
      sound.playStarSparkle();
    } else {
      sound.playGentleBoing();
    }
  };

  const undoPointLog = (logId: string) => {
    const targetLog = pointLogs.find(l => l.id === logId);
    if (!targetLog || targetLog.undone) return;

    // Reverse the stars on the student
    const student = students.find(s => s.id === targetLog.studentId);
    if (student) {
      const reversedStars = Math.max(0, student.stars - targetLog.deltaStars);
      setStudents(prev =>
        prev.map(s => (s.id === targetLog.studentId ? { ...s, stars: reversedStars } : s))
      );
    }

    setPointLogs(prev =>
      prev.map(l => (l.id === logId ? { ...l, undone: true } : l))
    );
  };

  const createAssignment = (assignment: Assignment) => {
    setAssignments(prev => [assignment, ...prev]);
  };

  const submitAssignment = (assignmentId: string, submission: Submission) => {
    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            submissions: {
              ...asg.submissions,
              [submission.studentId]: submission,
            },
          };
        }
        return asg;
      })
    );

    // Update student's completed tasks & awarded stars
    setStudents(prev =>
      prev.map(s => {
        if (s.id === submission.studentId) {
          const newCompleted = (s.completedTasks || 0) + 1;
          const newStars = s.stars + submission.starsEarned;
          return {
            ...s,
            completedTasks: newCompleted,
            stars: newStars,
          };
        }
        return s;
      })
    );

    // Add to point log
    const newLog: PointLog = {
      id: `log_${Date.now()}`,
      studentId: submission.studentId,
      studentName: submission.studentName,
      deltaStars: submission.starsEarned,
      reason: `Hoàn thành bài tập: đạt ${submission.score}/${submission.totalQuestions} câu`,
      timestamp: 'Vừa xong',
      undone: false,
    };
    setPointLogs(prev => [newLog, ...prev]);
  };

  const claimReward = (studentId: string, rewardId: string): boolean => {
    const student = students.find(s => s.id === studentId);
    const reward = rewards.find(r => r.id === rewardId);
    if (!student || !reward || student.stars < reward.cost) return false;

    // Deduct stars
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, stars: s.stars - reward.cost };
        }
        return s;
      })
    );

    // Increase claim count
    setRewards(prev =>
      prev.map(r => (r.id === rewardId ? { ...r, claimedCount: r.claimedCount + 1 } : r))
    );

    // Add log
    const newLog: PointLog = {
      id: `log_${Date.now()}`,
      studentId,
      studentName: student.name,
      deltaStars: -reward.cost,
      reason: `Đổi phần thưởng: ${reward.title} ${reward.icon}`,
      timestamp: 'Vừa xong',
      undone: false,
    };
    setPointLogs(prev => [newLog, ...prev]);
    sound.playStarSparkle();
    return true;
  };

  const addReward = (rewardData: Omit<RewardItem, 'id' | 'claimedCount'>) => {
    const newReward: RewardItem = {
      ...rewardData,
      id: `rew_${Date.now()}`,
      claimedCount: 0,
      isCustom: true,
    };
    setRewards(prev => [newReward, ...prev]);
  };

  const addApprovedMaterial = (data: Omit<ApprovedMaterial, 'id' | 'dateAdded'>) => {
    const newMaterial: ApprovedMaterial = {
      ...data,
      id: `mat_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setApprovedMaterials(prev => [newMaterial, ...prev]);
  };

  const deleteApprovedMaterial = (id: string) => {
    setApprovedMaterials(prev => prev.filter(m => m.id !== id));
  };

  const exportStudentsCsv = () => {
    const headers = ['Mã HS', 'Tên học sinh', 'Tổ', 'Hoa điểm tốt', 'Nhiệm vụ xong', 'Chuyên cần', 'Đúng Toán (%)', 'Đúng Tiếng Việt (%)', 'Ghi chú'];
    const rows = students.map(s => {
      const groupName = groups.find(g => g.id === s.groupId)?.name || s.groupId;
      const attMap: Record<AttendanceStatus, string> = {
        present: 'Có mặt',
        absent_excused: 'Vắng có phép',
        absent_unexcused: 'Vắng không phép',
        late: 'Đi muộn',
      };
      return [
        s.id,
        `"${s.name}"`,
        `"${groupName}"`,
        s.stars,
        s.completedTasks,
        `"${attMap[s.attendanceToday]}"`,
        `${s.mathAccuracy}%`,
        `${s.vietAccuracy}%`,
        `"${s.notes || ''}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Lop_1_2_MamTriTueAI_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importStudentsCsv = (text: string): { success: boolean; message: string } => {
    try {
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, message: 'File CSV không đủ dữ liệu hoặc không có dòng tiêu đề.' };
      }

      const newStudents: Student[] = [];
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const id = parts[0] || `HS${(i).toString().padStart(2, '0')}`;
          const name = parts[1] || `Học sinh ${id}`;
          const groupRaw = parts[2]?.toLowerCase() || '';
          let gId: GroupId = 'to1';
          if (groupRaw.includes('2') || groupRaw.includes('phượng')) gId = 'to2';
          else if (groupRaw.includes('3') || groupRaw.includes('kỳ')) gId = 'to3';
          else if (groupRaw.includes('4') || groupRaw.includes('rùa')) gId = 'to4';

          const stars = parseInt(parts[3], 10) || 20;
          const completedTasks = parseInt(parts[4], 10) || 0;

          newStudents.push({
            id,
            name,
            gender: i % 2 === 0 ? 'female' : 'male',
            groupId: gId,
            stars,
            completedTasks,
            attendanceToday: 'present',
            avatar: '🌟',
            notes: parts[8] || 'Đã nhập từ file CSV',
            mathAccuracy: 85,
            vietAccuracy: 85,
            skillsNeedSupport: [],
            badges: ['Học Chăm'],
          });
        }
      }

      if (newStudents.length > 0) {
        setStudents(newStudents);
        return { success: true, message: `Đã nhập thành công ${newStudents.length} hồ sơ học sinh!` };
      }
      return { success: false, message: 'Không tìm thấy dòng học sinh hợp lệ nào.' };
    } catch (err: any) {
      return { success: false, message: `Lỗi đọc file: ${err.message}` };
    }
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setPointLogs(INITIAL_POINT_LOGS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setRewards(INITIAL_REWARDS);
    setApprovedMaterials(INITIAL_MATERIALS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        currentStudentId,
        setCurrentStudentId,
        soundEnabled,
        setSoundEnabled,
        isAiOnline,
        students,
        groups,
        pointLogs,
        assignments,
        rewards,
        approvedMaterials,
        addStudent,
        updateStudent,
        deleteStudent,
        moveStudentToGroup,
        updateAttendance,
        awardStars,
        undoPointLog,
        createAssignment,
        submitAssignment,
        claimReward,
        addReward,
        addApprovedMaterial,
        deleteApprovedMaterial,
        exportStudentsCsv,
        importStudentsCsv,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
