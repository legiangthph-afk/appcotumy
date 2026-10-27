import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment } from '../types';
import {
  ClipboardList,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const AssignmentManager: React.FC = () => {
  const { assignments, students, setActiveTab } = useApp();
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(assignments[0] || null);

  const completedCount = selectedAsg ? Object.keys(selectedAsg.submissions || {}).length : 0;
  const notCompletedCount = students.length - completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <ClipboardList className="w-3.5 h-3.5 text-yellow-300" />
            THEO DÕI & QUẢN LÝ NHIỆM VỤ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">GIÁO VIÊN GIAO & CHẤM BÀI</h2>
          <p className="text-xs sm:text-sm text-cyan-100 mt-0.5">
            Theo dõi tiến độ hoàn thành bài tập của 32 học sinh, tự động chấm và lưu kết quả.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ai_workshop')}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs rounded-2xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Tập Mới (AI)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: List of Assignments */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center justify-between">
            <span>Danh Sách Bài Đã Giao ({assignments.length})</span>
            <span className="text-xs text-slate-400">Lớp 1/2</span>
          </h3>

          {assignments.map(asg => {
            const isSel = selectedAsg?.id === asg.id;
            const subCount = Object.keys(asg.submissions || {}).length;

            return (
              <div
                key={asg.id}
                onClick={() => setSelectedAsg(asg)}
                className={`cursor-pointer p-4 rounded-3xl border transition-all ${
                  isSel
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                    {asg.subject} – {asg.week}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Hạn: {asg.deadline}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-800 text-sm mt-2">{asg.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gồm {asg.questions?.length || 0} câu hỏi • Mức độ: <strong>{asg.level}</strong>
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">
                    Tiến độ: <strong className="text-emerald-600">{subCount}/32</strong> đã nộp
                  </span>

                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(subCount / 32) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Details of Selected Assignment */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          {selectedAsg ? (
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      {selectedAsg.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{selectedAsg.level}</span>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mt-1">{selectedAsg.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Giao ngày: {selectedAsg.createdAt} • Hạn nộp: {selectedAsg.deadline}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('student_portal')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-xl shadow-xs"
                >
                  Làm Thử Với Tư Cách Học Sinh
                </button>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <span className="text-xs font-bold text-emerald-700 block">Đã Nộp Bài</span>
                  <span className="text-xl font-black text-emerald-700">{completedCount} em</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                  <span className="text-xs font-bold text-amber-700 block">Chưa Nộp</span>
                  <span className="text-xl font-black text-amber-700">{notCompletedCount} em</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
                  <span className="text-xs font-bold text-indigo-700 block">Tỷ Lệ Hoàn Thành</span>
                  <span className="text-xl font-black text-indigo-700">
                    {Math.round((completedCount / students.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Student Submission List */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Chi Tiết Danh Sách Học Sinh:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {students.map(s => {
                    const sub = selectedAsg.submissions?.[s.id];

                    return (
                      <div
                        key={s.id}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
                          sub
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{s.avatar}</span>
                          <div>
                            <span className="font-bold">{s.id}</span>
                            <span className="block text-[11px] text-slate-400">{s.name}</span>
                          </div>
                        </div>

                        {sub ? (
                          <div className="text-right">
                            <span className="text-emerald-700 font-black">
                              {sub.score}/{sub.totalQuestions} Điểm
                            </span>
                            <span className="text-[10px] text-amber-600 font-bold block">
                              +{sub.starsEarned} 🌸
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded-full bg-slate-100">
                            Chưa làm
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Hãy chọn bài tập để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
