import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment, ExerciseQuestion } from '../types';
import { speakVietnamese } from '../utils/audio';
import {
  BookOpen,
  Filter,
  Search,
  Sparkles,
  Send,
  Volume2,
  CheckCircle,
  Play,
} from 'lucide-react';

interface SubjectTopic {
  id: string;
  subject: string;
  title: string;
  week: string;
  level: 'Củng cố' | 'Cơ bản' | 'Mở rộng';
  icon: string;
  color: string;
  questions: ExerciseQuestion[];
}

export const CurriculumBank: React.FC = () => {
  const { createAssignment, setActiveTab } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [previewTopic, setPreviewTopic] = useState<SubjectTopic | null>(null);

  // Curriculum bank for Grade 1 (GDPT 2018)
  const curriculumData: SubjectTopic[] = [
    {
      id: 'cb_toan_1',
      subject: 'Toán',
      title: 'Đếm và Nhận Biết Số Từ 1 Đến 10',
      week: 'Tuần 3',
      level: 'Cơ bản',
      icon: '🔢',
      color: '#3B82F6',
      questions: [
        { id: 'ct1', question: 'Có 5 chú vịt con 🐥, thêm 1 chú vịt nữa. Hỏi có tất cả mấy chú vịt?', type: 'multiple_choice', options: ['6 chú vịt', '5 chú vịt', '7 chú vịt'], correctAnswer: '6 chú vịt', explanation: '5 thêm 1 bằng 6.', hint: 'Đếm tiếp từ 5 thêm 1 bước.', points: 5, visualIcon: '🐥' },
        { id: 'ct2', question: 'Số nào đứng liền trước số 7?', type: 'multiple_choice', options: ['Số 6', 'Số 8', 'Số 5'], correctAnswer: 'Số 6', explanation: 'Số 6 đứng ngay trước số 7.', hint: 'Đếm: 5, 6, 7.', points: 5, visualIcon: '⭐' },
        { id: 'ct3', question: 'Chọn dấu thích hợp: 9 ... 4', type: 'multiple_choice', options: ['>', '<', '='], correctAnswer: '>', explanation: '9 lớn hơn 4.', hint: '9 quả nhiều hơn 4 quả.', points: 5, visualIcon: '🍎' },
      ],
    },
    {
      id: 'cb_toan_2',
      subject: 'Toán',
      title: 'Phép Cộng Và Phép Trừ Trong Phạm Vi 10',
      week: 'Tuần 12',
      level: 'Cơ bản',
      icon: '➕',
      color: '#2563EB',
      questions: [
        { id: 'ct4', question: 'Tính nhẩm: 4 + 4 = ?', type: 'multiple_choice', options: ['8', '7', '9'], correctAnswer: '8', explanation: '4 + 4 = 8.', hint: 'Hai nhóm 4 que tính gộp lại.', points: 5, visualIcon: '✏️' },
        { id: 'ct5', question: '10 - 6 bằng bao nhiêu?', type: 'multiple_choice', options: ['4', '5', '3'], correctAnswer: '4', explanation: '10 - 6 = 4.', hint: '10 ngón tay cụp đi 6 ngón.', points: 5, visualIcon: '🖐️' },
        { id: 'ct6', question: 'Điền số: 3 + ... = 10', type: 'multiple_choice', options: ['7', '6', '8'], correctAnswer: '7', explanation: '3 + 7 = 10.', hint: 'Cặp bạn thân tạo thành 10.', points: 5, visualIcon: '🔟' },
      ],
    },
    {
      id: 'cb_viet_1',
      subject: 'Tiếng Việt',
      title: 'Nhận Diện Chữ Cái Và Dấu Thanh',
      week: 'Tuần 5',
      level: 'Cơ bản',
      icon: '🅰️',
      color: '#EC4899',
      questions: [
        { id: 'cv1', question: 'Chữ cái nào bắt đầu trong từ "Bố"?', type: 'multiple_choice', options: ['Chữ B', 'Chữ C', 'Chữ D'], correctAnswer: 'Chữ B', explanation: 'Bờ - ô - bô - sắc - bố!', hint: 'Chữ B có bụng to.', points: 5, visualIcon: '👨' },
        { id: 'cv2', question: 'Dấu thanh nào có trong tiếng "bà"?', type: 'multiple_choice', options: ['Thanh huyền (\\)', 'Thanh sắc (/)', 'Thanh hỏi (?)'], correctAnswer: 'Thanh huyền (\\)', explanation: 'Tiếng "bà" có thanh huyền đi từ trái sang phải nghiêng xuống.', hint: 'Dấu như chiếc cầu trượt.', points: 5, visualIcon: '👵' },
      ],
    },
    {
      id: 'cb_viet_2',
      subject: 'Tiếng Việt',
      title: 'Luyện Vần an, at Và Đọc Hiểu Đoạn Ngắn',
      week: 'Tuần 12',
      level: 'Mở rộng',
      icon: '📖',
      color: '#DB2777',
      questions: [
        { id: 'cv3', question: 'Tiếng "hát" có vần gì?', type: 'multiple_choice', options: ['vần at', 'vần an', 'vần am'], correctAnswer: 'vần at', explanation: 'h - at - hat - sắc - hát!', hint: 'Có âm a và âm t.', points: 5, visualIcon: '🎤' },
        { id: 'cv4', question: 'Đọc câu: "Bé ngoan giúp bà quét nhà." Hỏi bé giúp ai?', type: 'multiple_choice', options: ['Giúp bà', 'Giúp bạn', 'Giúp cô'], correctAnswer: 'Giúp bà', explanation: 'Trong câu nói rõ: "Bé ngoan giúp bà quét nhà".', hint: 'Đọc kỹ câu chuyện ngắn nhé.', points: 5, visualIcon: '🧹' },
      ],
    },
    {
      id: 'cb_tnxh_1',
      subject: 'Tự nhiên & Xã hội',
      title: 'Chủ Đề Gia Đình & Trường Học Của Em',
      week: 'Tuần 8',
      level: 'Cơ bản',
      icon: '🏡',
      color: '#10B981',
      questions: [
        { id: 'cs1', question: 'Trong gia đình, ai là người sinh ra bố mẹ của em?', type: 'multiple_choice', options: ['Ông bà', 'Cô chú', 'Bạn bè'], correctAnswer: 'Ông bà', explanation: 'Ông bà sinh ra cha mẹ của chúng mình.', hint: 'Người lớn tuổi nhất và yêu thương em trong nhà.', points: 5, visualIcon: '👴👵' },
        { id: 'cs2', question: 'Khi ở trường, em nên giữ gìn vệ sinh lớp học như thế nào?', type: 'multiple_choice', options: ['Bỏ rác vào thùng rác', 'Vứt rác dưới gầm bàn', 'Xé giấy vứt ra sân'], correctAnswer: 'Bỏ rác vào thùng rác', explanation: 'Bỏ rác đúng nơi quy định giúp lớp 1/2 luôn sạch đẹp!', hint: 'Hành vi văn minh trong trường học.', points: 5, visualIcon: '🗑️' },
      ],
    },
    {
      id: 'cb_daoduc_1',
      subject: 'Đạo đức',
      title: 'Yêu Thương Gia Đình & Chăm Ngoan Lễ Phép',
      week: 'Tuần 9',
      level: 'Củng cố',
      icon: '🙏',
      color: '#8B5CF6',
      questions: [
        { id: 'cd1', question: 'Khi được người khác tặng quà, em cần nói lời gì?', type: 'multiple_choice', options: ['Cháu cảm ơn ạ!', 'Không nói gì', 'Lấy rồi chạy đi'], correctAnswer: 'Cháu cảm ơn ạ!', explanation: 'Biết nói lời cảm ơn khi nhận quà là bé ngoan lễ phép.', hint: 'Hai bàn tay đón nhận và nói cảm ơn.', points: 5, visualIcon: '🎁' },
      ],
    },
  ];

  const filteredTopics = curriculumData.filter(topic => {
    const matchSubj = selectedSubject === 'all' || topic.subject === selectedSubject;
    const matchLvl = selectedLevel === 'all' || topic.level === selectedLevel;
    return matchSubj && matchLvl;
  });

  const handleAssignTopic = (topic: SubjectTopic) => {
    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      title: `${topic.subject}: ${topic.title}`,
      subject: topic.subject as any,
      topic: topic.title,
      week: topic.week,
      level: topic.level,
      targetType: 'all',
      deadline: '2026-11-10',
      createdAt: new Date().toISOString().split('T')[0],
      gameMode: 'haiHoa',
      questions: topic.questions,
      submissions: {},
    };

    createAssignment(newAsg);
    alert(`Đã giao bài tập "${topic.title}" cho cả lớp 1/2!`);
    setActiveTab('assignments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
            CHƯƠNG TRÌNH GIÁO DỤC PHỔ THÔNG 2018
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">KHO BÀI HỌC GDPT 2018 – LỚP 1/2</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
            Học liệu chuẩn hóa gồm Toán, Tiếng Việt, Tự nhiên & Xã hội, Đạo đức. Phân hóa 3 mức (Củng cố, Cơ bản, Mở rộng).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-1.5 rounded-2xl">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            <option value="all">Tất cả môn học</option>
            <option value="Toán">Toán Lớp 1</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
            <option value="Đạo đức">Đạo đức</option>
          </select>

          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="Củng cố">1. Củng cố</option>
            <option value="Cơ bản">2. Cơ bản</option>
            <option value="Mở rộng">3. Mở rộng</option>
          </select>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                  style={{ backgroundColor: `${topic.color}15` }}
                >
                  {topic.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {topic.week}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      topic.level === 'Củng cố'
                        ? 'bg-amber-100 text-amber-800'
                        : topic.level === 'Cơ bản'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {topic.level}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-black uppercase tracking-wider block mt-3" style={{ color: topic.color }}>
                {topic.subject}
              </span>
              <h4 className="text-base font-black text-slate-800 mt-0.5">{topic.title}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Bộ gồm {topic.questions.length} câu hỏi chuẩn hóa kèm giọng đọc tiếng Việt.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewTopic(topic)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Xem Câu Hỏi
              </button>

              <button
                onClick={() => handleAssignTopic(topic)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Giao Cho Lớp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{previewTopic.icon}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-base">{previewTopic.title}</h3>
                  <span className="text-xs text-slate-500">{previewTopic.subject} – {previewTopic.week}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewTopic(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-4">
              {previewTopic.questions.map((q, i) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800">
                      Câu {i + 1}: {q.question}
                    </p>
                    <button
                      onClick={() => speakVietnamese(q.question)}
                      title="Nghe đọc"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {q.options.map((opt, oi) => (
                      <span
                        key={oi}
                        className={`p-1 rounded-lg text-center font-semibold ${
                          opt === q.correctAnswer ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-white text-slate-600'
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic">💡 {q.explanation}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewTopic(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleAssignTopic(previewTopic);
                  setPreviewTopic(null);
                }}
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Giao Bài Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
