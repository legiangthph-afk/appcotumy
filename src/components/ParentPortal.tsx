import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  BookOpen,
  Send,
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const { students, currentStudentId, setCurrentStudentId, groups } = useApp();
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const group = groups.find(g => g.id === currentStudent.groupId) || groups[0];

  const [parentFeedback, setParentFeedback] = useState<string>('');
  const [sentNotice, setSentNotice] = useState<boolean>(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentFeedback.trim()) return;
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setParentFeedback('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-yellow-300" />
            ĐỒNG HÀNH CÙNG CON – GIA ĐÌNH & NHÀ TRƯỜNG
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">SỔ LIÊN LẠC ĐIỆN TỬ BÉ MẦM</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
            Cổng thông tin phụ huynh Lớp 1/2 – Giáo viên chủ nhiệm: Nguyễn Thị Tú My.
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-2 rounded-2xl">
          <span className="text-xs font-bold text-white">Xem con:</span>
          <select
            value={currentStudent.id}
            onChange={e => setCurrentStudentId(e.target.value)}
            aria-label="Chọn con em để xem thông tin"
            className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.avatar} {s.id} ({s.stars} 🌸)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Progress Overview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-2xl bg-amber-50">{currentStudent.avatar}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    {currentStudent.name} ({currentStudent.id})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thành viên {group.mascot} {group.name} – Lớp 1/2 Hoà Sơn
                  </p>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {currentStudent.attendanceToday === 'present' ? 'Đi học đầy đủ' : 'Cần lưu ý'}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-700 block">Hoa Điểm Tốt</span>
                <span className="text-2xl font-black text-amber-600">{currentStudent.stars} 🌸</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="text-xs font-bold text-indigo-700 block">Bài Học Đã Làm</span>
                <span className="text-2xl font-black text-indigo-600">{currentStudent.completedTasks} bài</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 block">Tiến Bộ Tổng Thể</span>
                <span className="text-2xl font-black text-emerald-600">
                  {Math.round((currentStudent.mathAccuracy + currentStudent.vietAccuracy) / 2)}%
                </span>
              </div>
            </div>

            {/* Teacher's Note */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <span>👩‍🏫 Lời Nhắn Từ Cô Giáo Tú My:</span>
              </h4>
              <p className="text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
                "{currentStudent.notes || 'Bé đi học ngoan, biết lắng nghe cô giáo và hòa đồng cùng các bạn.'}"
              </p>
            </div>

            {/* Parental Guidance for Grade 1 */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Gợi Ý Đồng Hành Cùng Con Tại Nhà (Không Gây Áp Lực):
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Dành 15 phút mỗi tối cùng con đọc sách tranh hoặc chơi trò chơi đố vần tiếng Việt.</li>
                <li>Dùng đồ vật gần gũi (que tính, cúc áo, quả táo) để con làm quen phép cộng trừ tự nhiên.</li>
                <li>Khen ngợi nỗ lực cố gắng của con thay vì chỉ nhìn vào điểm số tuyệt đối.</li>
                <li>Khuyến khích con tự soạn sách vở vào cặp trước khi đi ngủ để rèn tính tự lập.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Message to Teacher */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Gửi Tin Nhắn Cho Cô Tú My</span>
          </h3>

          <p className="text-xs text-slate-500">
            Phụ huynh có thể nhắn gửi lời nhắn, xin phép nghỉ hoặc trao đổi tình hình sức khoẻ của con.
          </p>

          <form onSubmit={handleSendFeedback} className="space-y-3">
            <textarea
              rows={5}
              required
              value={parentFeedback}
              onChange={e => setParentFeedback(e.target.value)}
              placeholder="Nhập nội dung tin nhắn gửi cô giáo..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />

            {sentNotice && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl text-center">
                ✅ Tin nhắn đã được gửi tới Cô giáo Tú My thành công!
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Tin Nhắn</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
