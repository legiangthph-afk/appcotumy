import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CircleDot, Sparkles, Trophy, Users, RefreshCw, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

export const LuckyWheel: React.FC = () => {
  const { students, awardStars } = useApp();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [wheelMode, setWheelMode] = useState<'speak' | 'gift'>('speak');

  // We use 16 evenly distributed active candidates on the wheel ring for clear visual display
  const wheelItems = students.slice(0, 16);
  const numSlices = wheelItems.length;
  const sliceAngle = 360 / numSlices;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedStudent(null);

    // Play spinning sound
    sound.playWheelTick();

    // Random extra spins (between 5 and 9 full rotations + random slice)
    const extraRounds = Math.floor(Math.random() * 5) + 5;
    const winningIndex = Math.floor(Math.random() * numSlices);
    const targetSliceDegree = winningIndex * sliceAngle + sliceAngle / 2;
    const finalAngle = rotationAngle + extraRounds * 360 + (360 - (rotationAngle % 360)) + (360 - targetSliceDegree);

    setRotationAngle(finalAngle);

    // Tick audio loop
    let ticks = 0;
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
      ticks++;
      if (ticks > 15) clearInterval(tickInterval);
    }, 200);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = wheelItems[winningIndex];
      setSelectedStudent(winner);
      sound.playFanfare();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 4000);
  };

  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#06B6D4', '#6366F1', '#F43F5E',
    '#14B8A6', '#EAB308', '#A855F7', '#3B82F6',
    '#F97316', '#84CC16', '#06B6D4', '#EC4899',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            CÔNG BẰNG & HÀO HỨNG
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">VÒNG QUAY MAY MẮN – LỚP 1/2</h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
            Chọn ngẫu nhiên học sinh phát biểu hoặc trao tặng món quà bất ngờ của Bé Mầm AI!
          </p>
        </div>

        {/* Mode switcher */}
        <div className="flex bg-white/20 p-1 rounded-2xl">
          <button
            onClick={() => setWheelMode('speak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              wheelMode === 'speak' ? 'bg-white text-slate-800 shadow-sm' : 'text-white'
            }`}
          >
            🎤 Gọi bạn phát biểu
          </button>
          <button
            onClick={() => setWheelMode('gift')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              wheelMode === 'gift' ? 'bg-white text-slate-800 shadow-sm' : 'text-white'
            }`}
          >
            🎁 Tặng hoa may mắn
          </button>
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Wheel Graphic Container */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
          {/* Arrow Pointer on Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 filter drop-shadow-md" />

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-8 border-amber-300 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.9,0.2,1)]"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* SVG Slices */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {wheelItems.map((item, i) => {
                const startAngle = (i * 360) / numSlices;
                const endAngle = ((i + 1) * 360) / numSlices;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                return (
                  <path
                    key={item.id}
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={colors[i % colors.length]}
                  />
                );
              })}
            </svg>

            {/* Labels on each slice */}
            {wheelItems.map((item, i) => {
              const angle = i * sliceAngle + sliceAngle / 2;
              return (
                <div
                  key={item.id}
                  className="absolute top-1/2 left-1/2 w-32 -ml-16 h-8 -mt-4 flex items-center justify-end pr-3 origin-center text-white font-extrabold text-[11px] select-none pointer-events-none drop-shadow-sm"
                  style={{
                    transform: `rotate(${angle}deg) translate(80px)`,
                  }}
                >
                  <span className="truncate max-w-[70px]">{item.id}</span>
                </div>
              );
            })}
          </div>

          {/* Center Spin Button Hub */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`absolute z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 border-4 border-white shadow-xl flex flex-col items-center justify-center font-black transition-all ${
              isSpinning ? 'opacity-80 scale-95' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <span className="text-xl sm:text-2xl animate-spin-slow">⭐</span>
            <span className="text-xs sm:text-sm uppercase tracking-wider -mt-1">
              {isSpinning ? 'ĐANG QUAY' : 'QUAY!'}
            </span>
          </button>
        </div>

        {/* Right Info and Result Panel */}
        <div className="max-w-md w-full bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-indigo-600" />
              <span>{wheelMode === 'speak' ? 'Người Được Chọn Phát Biểu' : 'Vòng Quay Tặng Hoa'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống quay ngẫu nhiên 100% công bằng và minh bạch. Mọi bạn nhỏ đều có cơ hội toả sáng!
            </p>

            {/* Result Box */}
            {selectedStudent ? (
              <div className="mt-5 p-5 bg-white rounded-2xl border-2 border-amber-300 shadow-md text-center animate-in zoom-in-95">
                <span className="text-5xl block mb-2">{selectedStudent.avatar}</span>
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {selectedStudent.id}
                </span>
                <h4 className="text-xl font-black text-slate-800 mt-2">{selectedStudent.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {wheelMode === 'speak'
                    ? '🎉 Xin chúc mừng bạn nhỏ! Mời em tự tin đứng lên phát biểu hoặc đọc câu đố nhé!'
                    : '🎁 Tuyệt vời! Em nhận được 5 Bông Hoa May Mắn từ Bé Mầm AI!'}
                </p>

                {wheelMode === 'gift' && (
                  <button
                    onClick={() => {
                      awardStars(selectedStudent.id, 5, 'Vòng quay may mắn tặng hoa');
                      alert(`Đã cộng 5 Hoa Điểm Tốt cho ${selectedStudent.name}!`);
                    }}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-black rounded-xl text-xs shadow-xs"
                  >
                    🌸 Nhận 5 Hoa Ngay
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 p-8 bg-white/60 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
                <span className="text-3xl block mb-1">🎡</span>
                <p className="text-xs font-bold">Hãy bấm nút "QUAY!" ở giữa vòng quay để bắt đầu!</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Sĩ số trên vòng quay: 16 bạn</span>
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Quay Lại Lượt Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
