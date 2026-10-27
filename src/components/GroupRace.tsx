import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Flag, Sparkles, Users, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GroupRace: React.FC = () => {
  const { students, groups, awardStars } = useApp();

  // Compute group totals
  const groupStats = groups.map(group => {
    const groupStudents = students.filter(s => s.groupId === group.id);
    const totalStars = groupStudents.reduce((sum, s) => sum + s.stars, 0);
    const totalTasks = groupStudents.reduce((sum, s) => sum + s.completedTasks, 0);
    const avgAccuracy = Math.round(
      groupStudents.reduce((sum, s) => sum + (s.mathAccuracy + s.vietAccuracy) / 2, 0) /
        (groupStudents.length || 1)
    );

    return {
      ...group,
      students: groupStudents,
      totalStars,
      totalTasks,
      avgAccuracy,
    };
  });

  const maxStars = Math.max(...groupStats.map(g => g.totalStars), 300);

  const handleCheerGroup = (groupName: string) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Flag className="w-3.5 h-3.5 text-yellow-300" />
            ĐƯỜNG ĐUA THI ĐUA ĐOÀN KẾT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">THI ĐUA 4 TỔ – LỚP 1/2</h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
            4 Linh vật đại diện cho 4 Tổ cùng nhau tiến bước, rèn luyện chăm chỉ và giúp đỡ bạn bè!
          </p>
        </div>
      </div>

      {/* Interactive Race Track */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Bảng Đường Đua Điểm Hoa Tích Luỹ
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Vạch Đích 🏁</span>
        </div>

        <div className="space-y-4">
          {groupStats.map((group, idx) => {
            const percentage = Math.min(Math.round((group.totalStars / maxStars) * 100), 95);

            return (
              <div key={group.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{group.mascot}</span>
                    <span className="text-sm font-black" style={{ color: group.color }}>
                      {group.name}
                    </span>
                    <span className="text-slate-400 text-[11px]">({group.students.length} bạn)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-600 font-black text-sm">{group.totalStars} 🌸 Hoa</span>
                    <button
                      onClick={() => handleCheerGroup(group.name)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 transition-colors"
                    >
                      Cổ vũ 👏
                    </button>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="relative h-10 bg-slate-100 rounded-2xl p-1 overflow-hidden flex items-center border border-slate-200/60">
                  {/* Fill progress */}
                  <div
                    className="h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(percentage, 15)}%`,
                      backgroundColor: `${group.color}25`,
                      borderRight: `3px solid ${group.color}`,
                    }}
                  >
                    <span className="text-2xl animate-bounce-gentle transform -scale-x-100">
                      {group.mascot}
                    </span>
                  </div>
                  {/* Finish Line Flag */}
                  <div className="absolute right-3 top-2 bottom-2 w-0.5 bg-dashed border-r-2 border-slate-400 flex items-center">
                    <span className="absolute -top-1 -right-3 text-xs">🏁</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Group Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groupStats.map(group => (
          <div
            key={group.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                  style={{ backgroundColor: `${group.color}20` }}
                >
                  {group.mascot}
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                  {group.totalStars} 🌸
                </span>
              </div>

              <h4 className="text-base font-black text-slate-800 mt-3">{group.name}</h4>
              <p className="text-xs font-bold text-slate-500 italic mt-0.5">"{group.motto}"</p>

              {/* Roster list */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Danh sách thành viên ({group.students.length}):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.students.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <span>{s.avatar}</span>
                      <span className="font-bold text-slate-700 truncate">{s.id}</span>
                      <span className="text-[10px] text-amber-600 font-extrabold ml-auto">{s.stars}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Nhiệm vụ xong:</span>
                <strong className="text-indigo-600 font-bold">{group.totalTasks} bài</strong>
              </div>
              <div className="flex justify-between">
                <span>Độ chính xác TB:</span>
                <strong className="text-emerald-600 font-bold">{group.avgAccuracy}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
