import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GAMES_METADATA } from '../data/initialData';
import { GameMetadata, ExerciseQuestion } from '../types';
import { sound, speakVietnamese, stopSpeaking } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Play,
  RotateCcw,
  ArrowLeft,
  Volume2,
  Clock,
  Sparkles,
  Award,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Flame,
  ChevronRight,
} from 'lucide-react';

export const GamesArcade: React.FC = () => {
  const { students, currentStudentId, awardStars, submitAssignment } = useApp();

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>(currentStudentId || 'HS01');

  // Game Play States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Special Game states
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryDeck, setMemoryDeck] = useState<{ id: number; content: string; pairKey: string; isMatched?: boolean }[]>([]);

  // Word building game states
  const [selectedOnset, setSelectedOnset] = useState<string>('');
  const [selectedRime, setSelectedRime] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('không dấu');

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const activeGame = GAMES_METADATA.find(g => g.id === activeGameId) || GAMES_METADATA[0];

  // Grade 1 Game Question Bank (7-10 questions per game)
  const gameQuestions: Record<string, ExerciseQuestion[]> = {
    haiHoa: [
      { id: 'h1', question: 'Có 4 bông hoa cúc vàng 🌼 và 3 bông hoa hồng đỏ 🌹. Hỏi có tất cả mấy bông hoa?', type: 'multiple_choice', options: ['7 bông hoa', '6 bông hoa', '8 bông hoa'], correctAnswer: '7 bông hoa', explanation: '4 + 3 = 7 bông hoa nở ngát hương!', hint: 'Em lấy 4 đếm thêm 3 nhé: 5, 6, 7.', points: 5, visualIcon: '🌸' },
      { id: 'h2', question: 'Bông hoa nào mang số lớn nhất: [5], [9], [2]?', type: 'multiple_choice', options: ['Bông số 9', 'Bông số 5', 'Bông số 2'], correctAnswer: 'Bông số 9', explanation: 'Số 9 là số lớn nhất trong các số có một chữ số.', hint: 'Số 9 đứng xa nhất trong dãy số đếm.', points: 5, visualIcon: '🌻' },
      { id: 'h3', question: 'Điền số thích hợp vào chỗ chấm: 8 - 3 = ...', type: 'multiple_choice', options: ['5', '6', '4'], correctAnswer: '5', explanation: '8 bớt đi 3 còn lại 5.', hint: 'Lấy 8 ngón tay gấp lại 3 ngón tay nha.', points: 5, visualIcon: '🌺' },
      { id: 'h4', question: 'Vần nào có trong tiếng "hoa"?', type: 'multiple_choice', options: ['vần oa', 'vần oe', 'vần an'], correctAnswer: 'vần oa', explanation: 'h - oa - hoa!', hint: 'Âm o đứng trước, âm a đứng sau.', points: 5, visualIcon: '🌷' },
      { id: 'h5', question: 'Có 10 quả dâu tây 🍓, bé ăn mất 2 quả. Còn lại mấy quả?', type: 'multiple_choice', options: ['8 quả', '7 quả', '9 quả'], correctAnswer: '8 quả', explanation: '10 - 2 = 8 quả dâu tây ngọt lành.', hint: '10 bớt đi 2 còn 8 em nhé.', points: 5, visualIcon: '🍓' },
      { id: 'h6', question: 'Từ nào viết đúng chính tả?', type: 'multiple_choice', options: ['Bông hoa', 'Bông hoaq', 'Bôg hoa'], correctAnswer: 'Bông hoa', explanation: '"Bông hoa" là từ viết chuẩn tiếng Việt.', hint: 'Bờ - ông - bông, h - oa - hoa.', points: 5, visualIcon: '💐' },
      { id: 'h7', question: 'Hình nào có 4 cạnh bằng nhau?', type: 'multiple_choice', options: ['Hình vuông ⏹️', 'Hình tam giác 🔺', 'Hình tròn 🔴'], correctAnswer: 'Hình vuông ⏹️', explanation: 'Hình vuông có 4 cạnh đều bằng nhau.', hint: 'Hình giống viên gạch hoa lát nền.', points: 5, visualIcon: '⏹️' },
    ],
    vongQuayTriThuc: [
      { id: 'vq1', question: 'Trong các số: 3, 7, 10, số nào là số tròn chục?', type: 'multiple_choice', options: ['Số 10', 'Số 7', 'Số 3'], correctAnswer: 'Số 10', explanation: 'Số 10 gồm 1 chục và 0 đơn vị.', hint: 'Số có số 0 ở sau cùng.', points: 5, visualIcon: '🎡' },
      { id: 'vq2', question: 'Tiếng "mẹ" có thanh gì?', type: 'multiple_choice', options: ['Thanh nặng', 'Thanh sắc', 'Thanh huyền'], correctAnswer: 'Thanh nặng', explanation: 'm - e - me - nặng - mẹ!', hint: 'Dấu chấm tròn nhỏ bên dưới chữ e.', points: 5, visualIcon: '👩‍👧' },
      { id: 'vq3', question: '5 cộng mấy bằng 9?', type: 'multiple_choice', options: ['4', '3', '5'], correctAnswer: '4', explanation: '5 + 4 = 9.', hint: 'Từ 5 đếm thêm: 6, 7, 8, 9 (4 bước).', points: 5, visualIcon: '🔢' },
      { id: 'vq4', question: 'Chim bồ câu tượng trưng cho điều gì?', type: 'multiple_choice', options: ['Hoà bình', 'Chiến tranh', 'Sấm sét'], correctAnswer: 'Hoà bình', explanation: 'Chim bồ câu trắng là biểu tượng của hoà bình và yêu thương.', hint: 'Chú chim trắng hiền lành mang cành ô liu.', points: 5, visualIcon: '🕊️' },
      { id: 'vq5', question: '7 - 7 bằng bao nhiêu?', type: 'multiple_choice', options: ['0', '1', '7'], correctAnswer: '0', explanation: 'Hai số giống nhau trừ cho nhau luôn bằng 0.', hint: 'Bé có 7 cái kẹo ăn hết cả 7 cái.', points: 5, visualIcon: '🍬' },
      { id: 'vq6', question: 'Khi vào lớp học, em cần làm gì?', type: 'multiple_choice', options: ['Ngồi ngay ngắn, trật tự', 'Chạy nhảy la hét', 'Vứt rác ra sàn'], correctAnswer: 'Ngồi ngay ngắn, trật tự', explanation: 'Học sinh chăm ngoan luôn ngồi học ngay ngắn và lắng nghe cô.', hint: 'Nét đẹp học sinh Lớp 1/2.', points: 5, visualIcon: '🏫' },
      { id: 'vq7', question: 'Hình nào không có góc nhọn?', type: 'multiple_choice', options: ['Hình tròn 🔴', 'Hình tam giác 🔺', 'Hình chữ nhật  прямоугольник'], correctAnswer: 'Hình tròn 🔴', explanation: 'Hình tròn cong tròn đều, không có cạnh và góc.', hint: 'Hình giống chiếc đồng hồ treo tường hoặc quả bóng.', points: 5, visualIcon: '🔴' },
    ],
    duongDuaTriTue: [
      { id: 'dd1', question: 'Chú thỏ nhảy 3 bước, rồi nhảy tiếp 4 bước. Hỏi chú thỏ nhảy được mấy bước?', type: 'multiple_choice', options: ['7 bước', '6 bước', '8 bước'], correctAnswer: '7 bước', explanation: '3 + 4 = 7 bước nhảy thần tốc!', hint: '3 thêm 4 bằng 7.', points: 5, visualIcon: '🐰' },
      { id: 'dd2', question: 'So sánh: 6 + 2 ... 9', type: 'multiple_choice', options: ['<', '>', '='], correctAnswer: '<', explanation: '6 + 2 = 8, mà 8 bé hơn 9 nên 8 < 9.', hint: 'Tính nhẩm vế trái trước nhé: 6 + 2 = 8.', points: 5, visualIcon: '⚡' },
      { id: 'dd3', question: 'Thỏ ăn gì để mắt sáng tinh anh?', type: 'multiple_choice', options: ['Củ cà rốt 🥕', 'Bánh kẹo ngọt 🍬', 'Đá sỏi'], correctAnswer: 'Củ cà rốt 🥕', explanation: 'Cà rốt chứa nhiều vitamin A rất tốt cho mắt!', hint: 'Củ màu cam ngọt giòn chú thỏ rất mê.', points: 5, visualIcon: '🥕' },
      { id: 'dd4', question: '10 bớt đi 5 còn lại mấy?', type: 'multiple_choice', options: ['5', '4', '6'], correctAnswer: '5', explanation: '10 - 5 = 5.', hint: '10 ngón tay cụp 1 bàn tay 5 ngón.', points: 5, visualIcon: '🖐️' },
      { id: 'dd5', question: 'Chữ nào viết hoa đúng tên địa danh: "Đà Nẵng"?', type: 'multiple_choice', options: ['Đà Nẵng', 'đà nẵng', 'Đà nẵng'], correctAnswer: 'Đà Nẵng', explanation: 'Tên thành phố thân yêu của chúng mình phải viết hoa cả hai chữ!', hint: 'Thành phố nơi có trường Tiểu học Hoà Sơn.', points: 5, visualIcon: '🏙️' },
      { id: 'dd6', question: '3 + 3 + 3 bằng bao nhiêu?', type: 'multiple_choice', options: ['9', '8', '10'], correctAnswer: '9', explanation: '3 + 3 = 6, 6 + 3 = 9.', hint: 'Cộng từng bước một nhé bé.', points: 5, visualIcon: '🏎️' },
      { id: 'dd7', question: 'Vạch đích còn cách 1 phép tính: 2 + 8 = ?', type: 'multiple_choice', options: ['10', '9', '8'], correctAnswer: '10', explanation: '2 + 8 = 10! Về đích thành công rực rỡ!', hint: 'Cặp số bạn thân tạo thành 10.', points: 5, visualIcon: '🏁' },
    ],
    toanNhanh: [
      { id: 'tn1', question: 'Nhanh mắt tìm phép tính có kết quả bằng 5:', type: 'multiple_choice', options: ['2 + 3', '1 + 5', '4 + 2'], correctAnswer: '2 + 3', explanation: '2 + 3 = 5!', hint: '2 ngón tay thêm 3 ngón tay.', points: 5, visualIcon: '⚡' },
      { id: 'tn2', question: 'Tính siêu tốc: 9 - 4 = ?', type: 'multiple_choice', options: ['5', '4', '6'], correctAnswer: '5', explanation: '9 - 4 = 5.', hint: 'Đếm lùi từ 9: 8, 7, 6, 5.', points: 5, visualIcon: '🎈' },
      { id: 'tn3', question: 'Số nào cộng với 6 để được 10?', type: 'multiple_choice', options: ['4', '3', '5'], correctAnswer: '4', explanation: '6 + 4 = 10!', hint: '10 ngón tay, 6 ngón mở thì 4 ngón cụp.', points: 5, visualIcon: '🔟' },
      { id: 'tn4', question: 'Tính nhẩm: 7 + 0 = ?', type: 'multiple_choice', options: ['7', '0', '8'], correctAnswer: '7', explanation: 'Bất kỳ số nào cộng với 0 vẫn bằng chính số đó.', hint: 'Có 7 cái kẹo không thêm cái nào nữa.', points: 5, visualIcon: '🍬' },
      { id: 'tn5', question: '8 bớt mấy bằng 2?', type: 'multiple_choice', options: ['6', '5', '7'], correctAnswer: '6', explanation: '8 - 6 = 2.', hint: '8 trừ 2 bằng 6 nên 8 trừ 6 bằng 2.', points: 5, visualIcon: '🎯' },
      { id: 'tn6', question: '5 + 2 + 1 = ?', type: 'multiple_choice', options: ['8', '7', '9'], correctAnswer: '8', explanation: '5 + 2 = 7, 7 + 1 = 8.', hint: '5 thêm 2 rồi thêm 1 nữa.', points: 5, visualIcon: '🚀' },
      { id: 'tn7', question: 'Bong bóng phép tính: 10 - 3 = ?', type: 'multiple_choice', options: ['7', '6', '8'], correctAnswer: '7', explanation: '10 - 3 = 7!', hint: '10 lùi 3 bước là 7.', points: 5, visualIcon: '🌟' },
    ],
    duoiHinhBatChu: [
      { id: 'dh1', question: 'Bức tranh vẽ ngôi nhà có lá cờ đỏ sao vàng và học sinh cắp sách. Đây là đâu?', type: 'multiple_choice', options: ['Trường học 🏫', 'Bệnh viện 🏥', 'Chợ 🏪'], correctAnswer: 'Trường học 🏫', explanation: 'Trường Tiểu học Hoà Sơn thân yêu của bé!', hint: 'Nơi có cô giáo Tú My và các bạn.', points: 5, visualIcon: '🏫' },
      { id: 'dh2', question: 'Bức tranh chú chim màu xanh ngậm cành cây. Tiếng tương ứng là gì?', type: 'multiple_choice', options: ['Chim 🐦', 'Cá 🐟', 'Chó 🐶'], correctAnswer: 'Chim 🐦', explanation: 'Chú chim bay lượn hót líu lo.', hint: 'Loài vật có cánh bay trên trời.', points: 5, visualIcon: '🐦' },
      { id: 'dh3', question: 'Hình ảnh cuốn tập có nhiều chữ cái và hình vẽ. Tên gọi là gì?', type: 'multiple_choice', options: ['Sách giáo khoa 📚', 'Cặp sách 🎒', 'Bút chì ✏️'], correctAnswer: 'Sách giáo khoa 📚', explanation: 'Sách giáo khoa lớp 1 mở ra chân trời tri thức.', hint: 'Vật dụng bé mở ra đọc mỗi ngày.', points: 5, visualIcon: '📚' },
      { id: 'dh4', question: 'Hình ảnh em bé khoanh tay cúi đầu trước bà. Em bé đang làm gì?', type: 'multiple_choice', options: ['Chào lễ phép 🙏', 'Khóc nhè 😭', 'Chạy nhảy 🏃'], correctAnswer: 'Chào lễ phép 🙏', explanation: 'Chào hỏi lễ phép là phẩm chất đáng quý của học sinh ngoan.', hint: 'Hành động đẹp khi gặp người lớn.', points: 5, visualIcon: '🙏' },
      { id: 'dh5', question: 'Hình ảnh đĩa cơm, bát canh và đôi đũa. Đây là hoạt động gì?', type: 'multiple_choice', options: ['Bữa ăn gia đình 🍲', 'Giờ ra chơi ⚽', 'Đi ngủ 🛏️'], correctAnswer: 'Bữa ăn gia đình 🍲', explanation: 'Bữa cơm gia đình ấm áp yêu thương!', hint: 'Cả nhà quây quần ăn cơm ngon miệng.', points: 5, visualIcon: '🍲' },
      { id: 'dh6', question: 'Hình ảnh cột đèn có 3 màu: Đỏ, Vàng, Xanh. Đây là gì?', type: 'multiple_choice', options: ['Đèn giao thông 🚦', 'Đèn ngủ 🛋️', 'Đèn pin 🔦'], correctAnswer: 'Đèn giao thông 🚦', explanation: 'Đèn đỏ dừng lại, đèn xanh được đi!', hint: 'Bảo đảm an toàn khi đi trên đường.', points: 5, visualIcon: '🚦' },
      { id: 'dh7', question: 'Hình chú robot nhỏ màu xanh lá mang mầm cây trên đầu. Chú là ai?', type: 'multiple_choice', options: ['Bé Mầm AI 🌱', 'Người máy sắt 🤖', 'Siêu nhân 🦸'], correctAnswer: 'Bé Mầm AI 🌱', explanation: 'Bé Mầm AI – Người bạn học tập của học sinh Lớp 1/2!', hint: 'Bạn robot thông minh đồng hành cùng em.', points: 5, visualIcon: '🌱' },
    ],
  };

  // Fallback questions for any game
  const currentQuestions = gameQuestions[activeGame.id] || gameQuestions.haiHoa;

  // Initialize Memory Game Cards when playing latTheBiMat
  useEffect(() => {
    if (activeGame.id === 'latTheBiMat' && isPlaying) {
      const items = [
        { pairKey: 'tao', content: '🍎 Quả táo' },
        { pairKey: 'tao', content: 'Chữ Táo' },
        { pairKey: 'meo', content: '🐱 Mèo con' },
        { pairKey: 'meo', content: 'Chữ Mèo' },
        { pairKey: 'toan', content: '3 + 2' },
        { pairKey: 'toan', content: '= 5' },
        { pairKey: 'truong', content: '🏫 Trường' },
        { pairKey: 'truong', content: 'Lớp 1/2' },
      ];
      // Shuffle
      const shuffled = items
        .map((item, idx) => ({ id: idx, ...item, isMatched: false }))
        .sort(() => Math.random() - 0.5);
      setMemoryDeck(shuffled);
      setFlippedCards([]);
      setMatchedPairs([]);
    }
  }, [activeGame.id, isPlaying]);

  // Start game
  const handleStartGame = (gameId: string) => {
    setActiveGameId(gameId);
    setIsPlaying(true);
    setCurrentQuestionIdx(0);
    setScore(0);
    setStarsEarned(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setIsFinished(false);
    setTimeLeft(30);

    // Speak welcome
    const targetGame = GAMES_METADATA.find(g => g.id === gameId);
    speakVietnamese(`Chào mừng ${currentStudent.name} đến với trò chơi ${targetGame?.title || ''}. Bé hãy sẵn sàng nhé!`);
  };

  // Read current question out loud
  const handleReadQuestion = () => {
    const q = currentQuestions[currentQuestionIdx];
    if (q) {
      speakVietnamese(`${q.question}. Đáp án là gì nào?`);
    }
  };

  // Handle Answer Selection
  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const q = currentQuestions[currentQuestionIdx];
    const isCorrect = opt === q.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      setScore(prev => prev + 1);
      const earned = q.points || 5;
      setStarsEarned(prev => prev + earned);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } else {
      sound.playGentleBoing();
      setShowHint(true);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < currentQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Finished game!
      setIsFinished(true);
      sound.playFanfare();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      // Save stars to student record
      if (starsEarned > 0) {
        awardStars(currentStudent.id, starsEarned, `Chơi trò chơi: ${activeGame.title} (đúng ${score + 1}/${currentQuestions.length} câu)`);
      }
    }
  };

  // Handle Card Flip for Memory Game
  const handleCardClick = (cardIndex: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedPairs.includes(cardIndex)) {
      return;
    }

    sound.playWheelTick();
    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const first = memoryDeck[newFlipped[0]];
      const second = memoryDeck[newFlipped[1]];

      if (first.pairKey === second.pairKey) {
        // Matched!
        sound.playCorrect();
        setMatchedPairs(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlippedCards([]);
        setScore(prev => prev + 1);
        setStarsEarned(prev => prev + 5);

        if (matchedPairs.length + 2 === memoryDeck.length) {
          setTimeout(() => {
            setIsFinished(true);
            sound.playFanfare();
            awardStars(currentStudent.id, 20, 'Hoàn thành xuất sắc trò chơi Lật Thẻ Bí Mật');
          }, 1000);
        }
      } else {
        // Not matched, flip back
        sound.playGentleBoing();
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Gamepad2 className="w-3.5 h-3.5 text-yellow-300" />
            HỌC VUI – CHƠI VUI – TIẾN BỘ MỖI NGÀY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">THƯ VIỆN 10 TRÒ CHƠI HỌC TẬP TƯƠNG TÁC</h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-0.5">
            100% trò chơi hoạt động thật, tích hợp âm thanh, giọng đọc tiếng Việt và thưởng Hoa Điểm Tốt!
          </p>
        </div>

        {/* Player Selector */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-2 rounded-2xl">
          <span className="text-xs font-bold text-white whitespace-nowrap">Người chơi:</span>
          <select
            value={activeStudentId}
            onChange={e => setActiveStudentId(e.target.value)}
            aria-label="Chọn người chơi"
            className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.avatar} {s.id} - {s.name} ({s.stars} 🌸)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: GAME CATALOG (When not in an active game) */}
      {!isPlaying && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {GAMES_METADATA.map((game, idx) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${game.color}18` }}
                >
                  {game.icon}
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider block mt-3" style={{ color: game.color }}>
                  {game.recommendedSubject}
                </span>
                <h4 className="text-sm font-black text-slate-800 mt-0.5 leading-snug">
                  {game.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600">
                  +35 🌸 Thưởng
                </span>

                <button
                  onClick={() => handleStartGame(game.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all"
                  style={{ backgroundColor: game.color }}
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Chơi Ngay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: ACTIVE GAME PLAY SCREEN */}
      {isPlaying && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <button
              onClick={() => {
                stopSpeaking();
                setIsPlaying(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Trở Về Kho Trò Chơi</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeGame.icon}</span>
              <div>
                <h3 className="font-black text-slate-800 text-base">{activeGame.title}</h3>
                <span className="text-xs text-slate-500">Người chơi: {currentStudent.avatar} {currentStudent.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Question progress */}
              <div className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black">
                Câu {currentQuestionIdx + 1} / {currentQuestions.length}
              </div>

              {/* Stars tally */}
              <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black flex items-center gap-1">
                <span>🌸</span>
                <span>+{starsEarned} Hoa</span>
              </div>
            </div>
          </div>

          {/* GAMEPLAY CONTAINER */}
          {!isFinished ? (
            activeGame.id === 'latTheBiMat' ? (
              /* SPECIAL GAME: LẬT THẺ BÍ MẬT (MEMORY MATCH) */
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-base font-black text-slate-800">
                    🃏 Hãy tìm các cặp thẻ tương ứng giữa hình ảnh và chữ/số!
                  </h4>
                  <p className="text-xs text-slate-500">Đã tìm thấy: {matchedPairs.length / 2} / 4 cặp</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
                  {memoryDeck.map((card, idx) => {
                    const isFlipped = flippedCards.includes(idx) || matchedPairs.includes(idx);
                    const isMatched = matchedPairs.includes(idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        disabled={isMatched}
                        className={`h-28 rounded-2xl font-black text-sm sm:text-base border-2 shadow-xs transition-all duration-300 flex items-center justify-center p-2 text-center select-none ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-98'
                            : isFlipped
                            ? 'bg-amber-50 border-amber-400 text-slate-800 transform rotate-y-180'
                            : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white hover:scale-102'
                        }`}
                      >
                        {isFlipped ? (
                          <span className="animate-in zoom-in-75">{card.content}</span>
                        ) : (
                          <span className="text-2xl">🌱 ?</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* STANDARD QUESTION-BASED GAMES */
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Visual Header / Animation for Game */}
                <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-xs font-bold">
                  {activeGame.id === 'duongDuaTriTue' ? (
                    <div className="flex items-center gap-4 text-base">
                      <span>🏁 Vạch Đích</span>
                      <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${((currentQuestionIdx + 1) / currentQuestions.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-2xl animate-bounce-gentle">🐰</span>
                    </div>
                  ) : activeGame.id === 'haiHoa' ? (
                    <div className="flex items-center gap-2 text-xl">
                      {Array.from({ length: currentQuestions.length }).map((_, i) => (
                        <span key={i} className={i <= currentQuestionIdx ? 'opacity-100 scale-110' : 'opacity-30'}>
                          🌸
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Thử thách Bé Mầm AI: Chọn đáp án đúng nhất</span>
                    </div>
                  )}
                </div>

                {/* Question Box */}
                <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 rounded-3xl p-6 border border-indigo-100 relative shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-4xl p-2 rounded-2xl bg-white shadow-xs">
                        {currentQuestions[currentQuestionIdx].visualIcon || '🌱'}
                      </span>
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">
                          Câu đố số {currentQuestionIdx + 1}
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-1 leading-snug">
                          {currentQuestions[currentQuestionIdx].question}
                        </h3>
                      </div>
                    </div>

                    {/* Audio read aloud button */}
                    <button
                      onClick={handleReadQuestion}
                      title="Bấm để nghe giọng đọc tiếng Việt"
                      className="p-2.5 rounded-2xl bg-white hover:bg-amber-100 text-indigo-600 shadow-xs transition-colors flex-shrink-0"
                    >
                      <Volume2 className="w-5 h-5 text-indigo-600" />
                    </button>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentQuestions[currentQuestionIdx].correctAnswer;

                    let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black ring-2 ring-emerald-300';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 line-through';
                      } else {
                        btnStyle = 'border-slate-200 bg-white opacity-50';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(opt)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-2xl border-2 text-left font-extrabold text-sm sm:text-base flex items-center justify-between transition-all duration-150 shadow-xs ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isAnswered && (
                          <span>
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-rose-500" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Hint Box */}
                {isAnswered && (
                  <div
                    className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold animate-in fade-in ${
                      selectedOption === currentQuestions[currentQuestionIdx].correctAnswer
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {selectedOption === currentQuestions[currentQuestionIdx].correctAnswer ? '🎉' : '💡'}
                      </span>
                      <strong className="font-extrabold">
                        {selectedOption === currentQuestions[currentQuestionIdx].correctAnswer
                          ? 'Bé trả lời xuất sắc!'
                          : 'Gợi ý từ Bé Mầm AI:'}
                      </strong>
                    </div>
                    <p className="mt-0.5">
                      {selectedOption === currentQuestions[currentQuestionIdx].correctAnswer
                        ? currentQuestions[currentQuestionIdx].explanation
                        : currentQuestions[currentQuestionIdx].hint}
                    </p>
                  </div>
                )}

                {/* Next Question Button */}
                {isAnswered && (
                  <div className="text-center pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 mx-auto"
                    >
                      <span>
                        {currentQuestionIdx + 1 < currentQuestions.length ? 'Câu Tiếp Theo' : 'Xem Tổng Kết Điểm'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            /* GAME SUMMARY SCREEN */
            <div className="max-w-md mx-auto text-center py-6 space-y-4 animate-in zoom-in-95">
              <span className="text-6xl block mb-2 animate-bounce-gentle">🏆</span>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                Hoàn Thành Trò Chơi!
              </span>
              <h3 className="text-2xl font-black text-slate-800">
                Chúc Mừng {currentStudent.name}!
              </h3>
              <p className="text-xs text-slate-500">
                Em đã vượt qua trò chơi <strong className="text-indigo-600 font-bold">{activeGame.title}</strong>
              </p>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 max-w-xs mx-auto">
                <span className="text-xs font-bold block">Tổng hoa nhận được:</span>
                <span className="text-3xl font-black text-amber-600 mt-1 block">
                  +{starsEarned} 🌸
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  (Đã tự động cộng vào hồ sơ {currentStudent.id})
                </span>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => handleStartGame(activeGame.id)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Lượt Mới</span>
                </button>

                <button
                  onClick={() => setIsPlaying(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Chọn Trò Chơi Khác
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
