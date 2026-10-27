import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CheckCircle2,
  Sparkles,
  Trophy,
  AlertCircle,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';

export const StatsBar: React.FC = () => {
  const { students, groups, setActiveTab } = useApp();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Real calculations
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.attendanceToday === 'present').length;
  const lateCount = students.filter(s => s.attendanceToday === 'late').length;
  const absentExcusedCount = students.filter(s => s.attendanceToday === 'absent_excused').length;
  const absentUnexcusedCount = students.filter(s => s.attendanceToday === 'absent_unexcused').length;

  const totalStars = students.reduce((acc, s) => acc + (s.stars || 0), 0);
  const totalCompletedTasks = students.reduce((acc, s) => acc + (s.completedTasks || 0), 0);

  // Group with highest total stars
  const groupScores = groups.map(g => {
    const groupStudents = students.filter(s => s.groupId === g.id);
    const score = groupStudents.reduce((sum, s) => sum + s.stars, 0);
    return { ...g, totalScore: score, studentCount: groupStudents.length };
  });

  const topGroup = [...groupScores].sort((a, b) => b.totalScore - a.totalScore)[0] || groupScores[0];

  // Students needing learning support (accuracy < 75% or has listed support skills)
  const studentsNeedSupport = students.filter(
    s => (s.skillsNeedSupport && s.skillsNeedSupport.length > 0) || s.mathAccuracy < 75 || s.vietAccuracy < 75
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {/* Card 1: Tổng sĩ số */}
          <div
            onClick={() => setActiveTab('classroom')}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-blue-100 shadow-xs hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sĩ số lớp</span>
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800">{totalStudents}</span>
              <span className="text-xs font-semibold text-slate-400">em</span>
            </div>
            <p className="text-[10px] text-blue-600 font-bold mt-0.5 flex items-center">
              Lớp 1/2 Hoà Sơn <ChevronRight className="w-3 h-3" />
            </p>
          </div>

          {/* Card 2: Chuyên cần hôm nay */}
          <div
            onClick={() => setShowAttendanceModal(true)}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Có mặt hôm nay</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">{presentCount + lateCount}</span>
              <span className="text-xs font-semibold text-slate-400">/{totalStudents}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              {absentExcusedCount + absentUnexcusedCount > 0 ? (
                <span className="text-amber-600 font-bold">Vắng: {absentExcusedCount + absentUnexcusedCount} (Bấm xem)</span>
              ) : (
                <span className="text-emerald-600 font-bold">Đi học đủ 100% ✨</span>
              )}
            </p>
          </div>

          {/* Card 3: Tổng hoa điểm tốt */}
          <div
            onClick={() => setActiveTab('flower_board')}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hoa Điểm Tốt</span>
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-500">{totalStars}</span>
              <span className="text-xs font-semibold text-amber-600">bông 🌸</span>
            </div>
            <p className="text-[10px] text-amber-600 font-bold mt-0.5 flex items-center">
              Bảng vàng thi đua <ChevronRight className="w-3 h-3" />
            </p>
          </div>

          {/* Card 4: Nhiệm vụ hoàn thành */}
          <div
            onClick={() => setActiveTab('assignments')}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-indigo-100 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đã hoàn thành</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-600">{totalCompletedTasks}</span>
              <span className="text-xs font-semibold text-slate-400">lượt nộp</span>
            </div>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5 flex items-center">
              Kho bài tập GDPT <ChevronRight className="w-3 h-3" />
            </p>
          </div>

          {/* Card 5: Tổ dẫn đầu */}
          <div
            onClick={() => setActiveTab('group_race')}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổ nổi bật</span>
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 truncate">
              <span className="text-xl">{topGroup?.mascot}</span>
              <span className="text-base font-black text-purple-700 truncate">{topGroup?.name}</span>
            </div>
            <p className="text-[10px] text-purple-600 font-bold mt-0.5">
              {topGroup?.totalScore} bông hoa đạt được
            </p>
          </div>

          {/* Card 6: Cần hỗ trợ */}
          <div
            onClick={() => setActiveTab('classroom')}
            className="cursor-pointer bg-white rounded-2xl p-3 border border-rose-100 shadow-xs hover:shadow-md hover:border-rose-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cần hỗ trợ</span>
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-600">{studentsNeedSupport.length}</span>
              <span className="text-xs font-semibold text-slate-400">em</span>
            </div>
            <p className="text-[10px] text-rose-600 font-bold mt-0.5">
              Bài tập củng cố cá nhân hoá
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Detail Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  📋
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Tình Hình Chuyên Cần Hôm Nay</h3>
                  <p className="text-xs text-slate-500">Lớp 1/2 – Giáo viên: Nguyễn Thị Tú My</p>
                </div>
              </div>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 my-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                <span className="text-xs font-bold text-emerald-700 block">Có mặt</span>
                <span className="text-xl font-black text-emerald-700">{presentCount}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
                <span className="text-xs font-bold text-amber-700 block">Đi muộn</span>
                <span className="text-xl font-black text-amber-700">{lateCount}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center">
                <span className="text-xs font-bold text-blue-700 block">Có phép</span>
                <span className="text-xl font-black text-blue-700">{absentExcusedCount}</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-center">
                <span className="text-xs font-bold text-rose-700 block">Không phép</span>
                <span className="text-xl font-black text-rose-700">{absentUnexcusedCount}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Học sinh cần lưu ý:</h4>
              {students
                .filter(s => s.attendanceToday !== 'present')
                .map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{s.avatar}</span>
                      <div>
                        <span className="font-bold text-sm text-slate-800">{s.id} - {s.name}</span>
                        <p className="text-xs text-slate-500">{s.notes || 'Không có ghi chú'}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        s.attendanceToday === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : s.attendanceToday === 'absent_excused'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.attendanceToday === 'late'
                        ? 'Đi muộn'
                        : s.attendanceToday === 'absent_excused'
                        ? 'Nghỉ có phép'
                        : 'Vắng không phép'}
                    </span>
                  </div>
                ))}
              {students.filter(s => s.attendanceToday !== 'present').length === 0 && (
                <div className="text-center py-6 text-emerald-600 font-bold text-sm">
                  🎉 Toàn bộ 32 học sinh Lớp 1/2 hôm nay đều đi học đầy đủ và đúng giờ!
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
