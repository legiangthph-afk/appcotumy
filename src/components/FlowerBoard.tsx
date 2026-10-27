import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Trophy, Award, Filter, Heart } from 'lucide-react';

export const FlowerBoard: React.FC = () => {
  const { students, groups, awardStars } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filtered = students.filter(
    s => selectedGroup === 'all' || s.groupId === selectedGroup
  );

  // Sort descending by stars
  const sortedStudents = [...filtered].sort((a, b) => b.stars - a.stars);

  const getGroup = (groupId: string) => groups.find(g => g.id === groupId) || groups[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            VƯỜN HOA THI ĐUA NỞ RỘ
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">BẢNG HOA ĐIỂM TỐT – LỚP 1/2</h2>
          <p className="text-pink-100 text-xs sm:text-sm mt-1 max-w-xl">
            Mỗi bông hoa là một việc làm tốt, một bài học chăm và một nỗ lực đáng khen của các em. Hãy cùng nhau thi đua tiến bộ mỗi ngày!
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md p-1 rounded-2xl">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Cả Lớp (32)
          </button>
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedGroup === g.id ? 'bg-white text-slate-800 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{g.mascot}</span>
              <span className="hidden sm:inline">{g.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {selectedGroup === 'all' && (
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 pb-2">
          {/* Rank 2 */}
          {sortedStudents[1] && (
            <div className="flex flex-col items-center justify-end">
              <span className="text-3xl mb-1">{sortedStudents[1].avatar}</span>
              <span className="text-xs font-bold text-slate-800">{sortedStudents[1].id}</span>
              <span className="text-xs font-black text-amber-600">{sortedStudents[1].stars} 🌸</span>
              <div className="w-full bg-slate-200 border-2 border-slate-300 rounded-t-2xl h-24 flex flex-col items-center justify-center text-slate-700 shadow-xs mt-2">
                <span className="text-2xl">🥈</span>
                <span className="text-[11px] font-black uppercase">Hạng 2</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {sortedStudents[0] && (
            <div className="flex flex-col items-center justify-end">
              <span className="text-4xl mb-1 animate-bounce-gentle">{sortedStudents[0].avatar}</span>
              <span className="text-xs font-extrabold text-indigo-700">{sortedStudents[0].id}</span>
              <span className="text-sm font-black text-amber-500">{sortedStudents[0].stars} 🌸</span>
              <div className="w-full bg-gradient-to-t from-amber-400 to-yellow-300 border-2 border-amber-300 rounded-t-2xl h-32 flex flex-col items-center justify-center text-slate-900 shadow-md mt-2">
                <span className="text-3xl">🥇</span>
                <span className="text-xs font-black uppercase tracking-wider">Hạng Nhất</span>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {sortedStudents[2] && (
            <div className="flex flex-col items-center justify-end">
              <span className="text-3xl mb-1">{sortedStudents[2].avatar}</span>
              <span className="text-xs font-bold text-slate-800">{sortedStudents[2].id}</span>
              <span className="text-xs font-black text-amber-600">{sortedStudents[2].stars} 🌸</span>
              <div className="w-full bg-amber-100 border-2 border-amber-300 rounded-t-2xl h-18 flex flex-col items-center justify-center text-amber-900 shadow-xs mt-2">
                <span className="text-xl">🥉</span>
                <span className="text-[11px] font-black uppercase">Hạng 3</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flower Grid for all 32 students */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {sortedStudents.map((student, index) => {
          const group = getGroup(student.groupId);

          // Flower blooming visual scale
          const flowerSize = Math.min(Math.max(student.stars / 10, 1.5), 3.5);

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-3 border border-pink-100 shadow-xs hover:shadow-lg transition-all text-center flex flex-col justify-between items-center group relative overflow-hidden"
            >
              {/* Badge Rank */}
              <span className="absolute top-2 left-2 text-[10px] font-black w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                #{index + 1}
              </span>

              <div className="mt-4 flex flex-col items-center">
                {/* Blooming Flower Graphic */}
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-100 to-rose-50 flex items-center justify-center relative transform group-hover:scale-110 transition-transform cursor-pointer"
                  style={{
                    boxShadow: `0 0 16px ${group.color}30`,
                  }}
                  title={`Bấm để xem bông hoa của ${student.name}`}
                >
                  <span className="text-3xl animate-pulse-subtle">🌸</span>
                  <span className="absolute -bottom-1 text-[10px] bg-amber-400 text-slate-900 font-black px-1.5 rounded-full shadow-xs">
                    {student.stars}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-xs font-extrabold text-slate-800 block truncate max-w-[90px]">
                    {student.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block truncate max-w-[90px]">
                    {group.mascot} {group.name.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Quick praise button */}
              <button
                onClick={() => awardStars(student.id, 1, 'Thưởng bông hoa khích lệ')}
                title="Tặng thêm 1 bông hoa khích lệ"
                className="mt-2.5 w-full py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
              >
                <Heart className="w-3 h-3 fill-pink-500" />
                <span>+1 Hoa</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
