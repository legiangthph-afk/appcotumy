import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExerciseQuestion, Assignment } from '../types';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  Send,
  Save,
  BookOpen,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiWorkshop: React.FC = () => {
  const { createAssignment, setActiveTab, isAiOnline } = useApp();

  // Generator form inputs
  const [subject, setSubject] = useState<string>('Toán');
  const [topic, setTopic] = useState<string>('Phép cộng trong phạm vi 10');
  const [week, setWeek] = useState<string>('Tuần 12');
  const [skill, setSkill] = useState<string>('Tính nhẩm không nhớ và đếm tiếp');
  const [level, setLevel] = useState<'Củng cố' | 'Cơ bản' | 'Mở rộng'>('Cơ bản');
  const [count, setCount] = useState<number>(8);
  const [exerciseType, setExerciseType] = useState<string>('Trắc nghiệm 3 lựa chọn');
  const [gameType, setGameType] = useState<string>('AI Hái hoa điểm tốt');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<ExerciseQuestion[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [targetType, setTargetType] = useState<'all' | 'group' | 'individual'>('all');
  const [deadline, setDeadline] = useState<string>('2026-11-10');
  const [notification, setNotification] = useState<string | null>(null);

  // Editing question state
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setNotification(null);

    try {
      const res = await fetch('/api/generate-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          grade: 'Lớp 1',
          week,
          skill,
          level,
          count,
          exerciseType,
          gameType,
        }),
      });

      const data = await res.json();
      if (data.exercises && data.exercises.length > 0) {
        setGeneratedQuestions(data.exercises);
        setAssignmentTitle(`Bài tập ${subject}: ${topic} (${week})`);
        setNotification(`Đã tạo thành công ${data.exercises.length} câu hỏi theo chuẩn GDPT 2018! Cô giáo hãy kiểm duyệt nội dung trước khi giao nhé.`);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setNotification('Có lỗi khi tạo bài tập, xin thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setNotification('Không thể kết nối máy chủ AI lúc này.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndAssign = () => {
    if (generatedQuestions.length === 0) return;

    const newAssignment: Assignment = {
      id: `asg_${Date.now()}`,
      title: assignmentTitle || `Bài tập ${subject} - ${topic}`,
      subject: subject as any,
      topic,
      week,
      level,
      targetType,
      deadline,
      createdAt: new Date().toISOString().split('T')[0],
      gameMode: gameType === 'AI Hái hoa điểm tốt' ? 'haiHoa' : 'duongDuaTriTue',
      questions: generatedQuestions,
      submissions: {},
    };

    createAssignment(newAssignment);
    alert('Đã lưu bài tập và giao thành công cho học sinh Lớp 1/2!');
    setActiveTab('assignments');
  };

  const handleDeleteQuestion = (idx: number) => {
    setGeneratedQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestion = (idx: number, updated: ExerciseQuestion) => {
    setGeneratedQuestions(prev => prev.map((q, i) => (i === idx ? updated : q)));
    setEditingIdx(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            CÔNG NGHỆ GEMINI 3.8 FLASH & CHƯƠNG TRÌNH GDPT 2018
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">XƯỞNG TẠO BÀI TẬP AI TỰ ĐỘNG</h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
            Tạo bộ 7–10 câu hỏi tương tác phân hóa theo 3 mức (Củng cố, Cơ bản, Mở rộng). Giáo viên có toàn quyền kiểm tra, duyệt trước khi giao.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-bold">
          <Bot className="w-4 h-4 text-yellow-300" />
          <span>{isAiOnline ? 'Gemini 3.8 Online' : 'Bộ Đề Chuẩn GDPT Sẵn Có'}</span>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Form and Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Setup Parameters */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Thiết Lập Yêu Cầu Bài Tập</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            {/* Subject */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Môn học:</label>
              <select
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  if (e.target.value === 'Toán') {
                    setTopic('Phép cộng trong phạm vi 10');
                    setSkill('Tính nhẩm không nhớ và so sánh số');
                  } else if (e.target.value === 'Tiếng Việt') {
                    setTopic('Vần an, at và phân biệt dấu thanh');
                    setSkill('Ghép tiếng, đọc từ và chính tả');
                  } else {
                    setTopic('Trường học thân thiện của em');
                    setSkill('Quan sát tranh ảnh và nhận thức');
                  }
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              >
                <option value="Toán">Toán Lớp 1</option>
                <option value="Tiếng Việt">Tiếng Việt Lớp 1</option>
                <option value="Tự nhiên & Xã hội">Tự nhiên và Xã hội</option>
                <option value="Đạo đức">Đạo đức</option>
                <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
                <option value="Âm nhạc & Mĩ thuật">Âm nhạc & Mĩ thuật</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề bài học:</label>
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Ví dụ: Phép cộng trong phạm vi 10..."
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Week & Skill */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tuần học:</label>
                <select
                  value={week}
                  onChange={e => setWeek(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {Array.from({ length: 35 }).map((_, i) => (
                    <option key={i} value={`Tuần ${i + 1}`}>
                      Tuần {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mức độ phân hóa:</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as any)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="Củng cố">1. Củng cố (Nhẹ nhàng)</option>
                  <option value="Cơ bản">2. Cơ bản (Chuẩn GDPT)</option>
                  <option value="Mở rộng">3. Mở rộng (Phát triển)</option>
                </select>
              </div>
            </div>

            {/* Skill */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kỹ năng trọng tâm:</label>
              <input
                type="text"
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Question count & Game */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số câu (7–10):</label>
                <input
                  type="number"
                  min={5}
                  max={10}
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dạng câu hỏi:</label>
                <select
                  value={exerciseType}
                  onChange={e => setExerciseType(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="Trắc nghiệm 3 lựa chọn">Trắc nghiệm 3 lựa chọn</option>
                  <option value="Đúng / Sai">Đúng / Sai</option>
                  <option value="Điền số hoặc chữ">Điền số hoặc chữ</option>
                  <option value="Ghép đôi">Ghép đôi tương ứng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loại trò chơi áp dụng:</label>
              <select
                value={gameType}
                onChange={e => setGameType(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="AI Hái hoa điểm tốt">1. AI Hái hoa điểm tốt</option>
                <option value="Vòng quay tri thức">2. Vòng quay tri thức</option>
                <option value="Đường đua trí tuệ">3. Đường đua trí tuệ</option>
                <option value="Bé làm toán nhanh">8. Bé làm toán nhanh</option>
                <option value="Đuổi hình bắt chữ">9. Đuổi hình bắt chữ</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Đang Soạn Bài Tập...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Tạo Bộ Bài Tập Bằng AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Inspection, Review, and Assign Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kiểm Duyệt & Giao Bài ({generatedQuestions.length} câu)</span>
              </h3>
              {generatedQuestions.length > 0 && (
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                  {level}
                </span>
              )}
            </div>

            {generatedQuestions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <span className="text-4xl block">✨</span>
                <p className="text-xs font-bold">
                  Chưa có bài tập nào được tạo. Hãy điền thông tin bên trái và bấm nút "Tạo Bộ Bài Tập Bằng AI"!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 mt-3">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-black text-slate-800">{q.question}</p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Điểm hoa: +{q.points || 5} 🌸 | Minh họa: {q.visualIcon || '🍎'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        title="Xoá câu hỏi này"
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-3 gap-1.5 pl-8">
                      {q.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded-lg text-[11px] font-bold border text-center ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-black'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="pl-8 text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Assign bar */}
          {generatedQuestions.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phạm vi giao bài:</label>
                  <select
                    value={targetType}
                    onChange={e => setTargetType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="all">Toàn bộ 32 học sinh Lớp 1/2</option>
                    <option value="group">Theo từng Tổ</option>
                    <option value="individual">Cá nhân học sinh cần củng cố</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hạn hoàn thành:</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAndAssign}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Duyệt & Giao Bài Cho Học Sinh Lớp 1/2</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
