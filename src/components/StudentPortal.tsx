import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment, ExerciseQuestion } from '../types';
import { sound, speakVietnamese, stopSpeaking } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  Sparkles,
  BookOpen,
  Award,
  Volume2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { students, currentStudentId, setCurrentStudentId, assignments, submitAssignment, setActiveTab } = useApp();

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  // Active quiz session states
  const [activeQuizAsg, setActiveQuizAsg] = useState<Assignment | null>(null);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Start doing an assignment
  const handleStartQuiz = (asg: Assignment) => {
    setActiveQuizAsg(asg);
    setQuizIdx(0);
    setUserAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
    setFeedback(null);

    const firstQ = asg.questions[0];
    if (firstQ) {
      speakVietnamese(`Bé ${currentStudent.name} ơi, câu số 1: ${firstQ.question}`);
    }
  };

  const handleSelectAnswer = (option: string) => {
    if (!activeQuizAsg) return;
    const q = activeQuizAsg.questions[quizIdx];
    setUserAnswers(prev => ({ ...prev, [q.id]: option }));

    const isCorrect = option === q.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      setQuizScore(prev => prev + 1);
      setFeedback('Chính xác! Bé giỏi quá! 🎉');
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    } else {
      sound.playGentleBoing();
      setFeedback(`Gợi ý: ${q.hint}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (quizIdx + 1 < activeQuizAsg.questions.length) {
        setQuizIdx(prev => prev + 1);
        const nextQ = activeQuizAsg.questions[quizIdx + 1];
        if (nextQ) {
          speakVietnamese(`Câu ${quizIdx + 2}: ${nextQ.question}`);
        }
      } else {
        // Finish assignment
        finishQuiz(quizScore + (isCorrect ? 1 : 0));
      }
    }, 1800);
  };

  const finishQuiz = (finalScore: number) => {
    if (!activeQuizAsg) return;
    setQuizFinished(true);
    sound.playFanfare();

    const starsToEarn = finalScore * 5;
    submitAssignment(activeQuizAsg.id, {
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: finalScore,
      totalQuestions: activeQuizAsg.questions.length,
      starsEarned: starsToEarn,
      tries: 1,
      answers: userAnswers,
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl p-6 text-slate-900 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-18 h-18 rounded-3xl bg-white p-2 shadow-lg flex items-center justify-center text-4xl transform hover:rotate-6 transition-transform">
            {currentStudent.avatar}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black bg-indigo-900 text-white px-2 py-0.5 rounded-lg">
                {currentStudent.id}
              </span>
              <span className="text-xs font-bold text-slate-800">Lớp 1/2 Hoà Sơn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Chào Bạn Nhỏ {currentStudent.name}!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Hôm nay em đã đạt được <strong className="text-indigo-950 font-black">{currentStudent.stars} 🌸 Bông Hoa Điểm Tốt</strong>!
            </p>
          </div>
        </div>

        {/* Quick Student Switcher for Testing */}
        <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl">
          <span className="text-xs font-bold text-slate-800">Chọn bé:</span>
          <select
            value={currentStudent.id}
            onChange={e => setCurrentStudentId(e.target.value)}
            aria-label="Chọn tài khoản học sinh"
            className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.avatar} {s.id} ({s.stars} 🌸)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUIZ TAKING MODAL */}
      {activeQuizAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-amber-300">
            {!quizFinished ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    <div>
                      <h3 className="font-black text-slate-800 text-base">{activeQuizAsg.title}</h3>
                      <span className="text-xs text-slate-500">
                        Câu {quizIdx + 1} trên {activeQuizAsg.questions.length} câu
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      stopSpeaking();
                      setActiveQuizAsg(null);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg"
                  >
                    Đóng
                  </button>
                </div>

                {/* Question */}
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">
                      {activeQuizAsg.questions[quizIdx].visualIcon || '🍎'}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                      {activeQuizAsg.questions[quizIdx].question}
                    </h4>
                  </div>
                  <button
                    onClick={() => speakVietnamese(activeQuizAsg.questions[quizIdx].question)}
                    title="Nghe cô đọc câu hỏi"
                    className="p-2 rounded-xl bg-white text-indigo-600 shadow-xs hover:bg-amber-100"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {activeQuizAsg.questions[quizIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(opt)}
                      className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-left font-black text-sm sm:text-base flex items-center gap-3 transition-all active:scale-98 shadow-xs"
                    >
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-black">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-bold text-xs text-center animate-in fade-in">
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Finished */
              <div className="text-center py-6 space-y-4">
                <span className="text-6xl block animate-bounce-gentle">🌸</span>
                <h3 className="text-2xl font-black text-slate-800">
                  Hoàn Thành Bài Tập Xuất Sắc!
                </h3>
                <p className="text-xs text-slate-600">
                  Em đã trả lời đúng <strong className="text-emerald-600 font-bold">{quizScore}/{activeQuizAsg.questions.length}</strong> câu!
                </p>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-xs mx-auto text-amber-800 font-black">
                  <span>Số Hoa Điểm Tốt Nhận Được:</span>
                  <span className="text-3xl block text-amber-600 mt-1">+{quizScore * 5} 🌸</span>
                </div>

                <button
                  onClick={() => setActiveQuizAsg(null)}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Tuyệt Vời! Về Bàn Học
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment List for Student */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Bài Tập Cô Giáo Tú My Giao Cho Em</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map(asg => {
            const mySubmission = asg.submissions?.[currentStudent.id];

            return (
              <div
                key={asg.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  mySubmission
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-amber-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      {asg.subject} – {asg.week}
                    </span>
                    {mySubmission ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã Hoàn Thành</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Hạn: {asg.deadline}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-800 mt-2">{asg.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Gồm {asg.questions.length} câu hỏi vui nhộn có giọng đọc hỗ trợ.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {mySubmission ? (
                    <div className="text-xs font-bold text-slate-600">
                      Kết quả: <strong className="text-emerald-700">{mySubmission.score}/{mySubmission.totalQuestions}</strong> câu •{' '}
                      <span className="text-amber-600 font-black">+{mySubmission.starsEarned} 🌸</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-amber-600">
                      Phần thưởng: +{asg.questions.length * 5} 🌸 Hoa
                    </span>
                  )}

                  <button
                    onClick={() => handleStartQuiz(asg)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                      mySubmission
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs active:scale-95'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{mySubmission ? 'Làm Lại Luyện Tập' : 'Làm Bài Ngay'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Jump to Games Arcade */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg">Em Muốn Vừa Học Vừa Chơi?</h3>
          <p className="text-xs text-purple-100 mt-0.5">
            10 Trò chơi giáo dục hấp dẫn đang chờ em khám phá và nhận thật nhiều Hoa Điểm Tốt!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('games_arcade')}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs rounded-2xl shadow-lg transition-transform active:scale-95"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Vào Phòng Trò Chơi</span>
        </button>
      </div>
    </div>
  );
};
