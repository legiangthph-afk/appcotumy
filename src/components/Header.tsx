import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  Volume2,
  VolumeX,
  Sparkles,
  GraduationCap,
  UserCheck,
  HeartHandshake,
  Bot,
  School,
  Trophy,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    currentStudentId,
    setCurrentStudentId,
    students,
    soundEnabled,
    setSoundEnabled,
    isAiOnline,
    setActiveTab,
  } = useApp();

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-48 h-48 rounded-full bg-yellow-400/20 blur-xl pointer-events-none" />

      {/* Top Banner: Competition Badge & Controls */}
      <div className="border-b border-white/15 bg-black/10 backdrop-blur-xs px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[11px] shadow-xs">
              <School className="w-3.5 h-3.5 text-yellow-300" />
              Trường Tiểu học Hoà Sơn – TP. Đà Nẵng
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status */}
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                isAiOnline
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <Bot className="w-3 h-3" />
              <span>{isAiOnline ? 'Gemini 3.8 Flash Sẵn Sàng' : 'Bé Mầm Học Liệu'}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 text-xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="hidden md:inline">Âm thanh: Bật</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden md:inline">Âm thanh: Tắt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Title & Identity */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          {/* Animated Robot Mascot */}
          <div
            onClick={() => setActiveTab('games_arcade')}
            className="cursor-pointer group relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-200 to-white p-1 shadow-lg shadow-black/20 transform hover:scale-105 transition-all"
            title="Bé Mầm AI - Chạm để chơi trò chơi!"
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-b from-blue-500 to-indigo-700 flex flex-col items-center justify-center text-white relative overflow-hidden">
              <span className="text-3xl sm:text-4xl filter drop-shadow animate-bounce-gentle">🌱</span>
              <span className="absolute bottom-1 text-[9px] font-black uppercase tracking-wider text-amber-300 bg-blue-900/80 px-1 rounded">
                BÉ MẦM AI
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 text-[9px] text-slate-900 font-bold items-center justify-center">★</span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                MẦM TRÍ TUỆ AI
              </h1>
              <span className="bg-amber-400 text-slate-900 text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg shadow-xs transform rotate-2">
                LỚP 1/2
              </span>
            </div>
            <p className="text-yellow-200 text-xs sm:text-sm font-bold tracking-wide mt-0.5">
              QUẢN LÝ LỚP HỌC THÔNG MINH – HỌC VUI, TIẾN BỘ MỖI NGÀY
            </p>
            <p className="text-blue-100 text-[11px] sm:text-xs mt-0.5 font-medium flex items-center justify-center md:justify-start gap-1">
              <span>Giáo viên chủ nhiệm:</span>
              <strong className="text-white font-bold underline decoration-yellow-400 decoration-2">NGUYỄN THỊ TÚ MY</strong>
              <span>– Trường Tiểu học Hoà Sơn</span>
            </p>
          </div>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-inner">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                role === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-md transform scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Cô Giáo Tú My</span>
            </button>

            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                role === 'student'
                  ? 'bg-amber-400 text-slate-900 shadow-md transform scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Góc Học Sinh</span>
            </button>

            <button
              onClick={() => setRole('parent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                role === 'parent'
                  ? 'bg-emerald-400 text-slate-900 shadow-md transform scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Cổng Phụ Huynh</span>
            </button>
          </div>

          {/* Quick Student Selector when in student or parent role */}
          {role !== 'teacher' && (
            <div className="flex items-center gap-1.5 pl-2 border-t sm:border-t-0 sm:border-l border-white/20 pt-1.5 sm:pt-0">
              <span className="text-[11px] text-blue-200 whitespace-nowrap">Chọn bé:</span>
              <select
                value={currentStudentId}
                onChange={e => setCurrentStudentId(e.target.value)}
                aria-label="Chọn học sinh đang đăng nhập"
                className="bg-white text-slate-800 text-xs font-bold rounded-lg px-2 py-1 outline-none border-none shadow-xs focus:ring-2 focus:ring-yellow-400"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.avatar} {s.id} - {s.name} ({s.stars} ⭐)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
