import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Plus, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardShop: React.FC = () => {
  const { rewards, students, currentStudentId, claimReward, addReward, role } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentStudentId || 'HS01');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCost, setNewCost] = useState<number>(20);
  const [newIcon, setNewIcon] = useState<string>('🎁');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleClaim = (rewardId: string, title: string) => {
    const success = claimReward(activeStudent.id, rewardId);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setClaimedNotice(`Chúc mừng ${activeStudent.name} đã đổi thành công: "${title}"!`);
      setTimeout(() => setClaimedNotice(null), 3000);
    } else {
      alert(`Bé chưa đủ hoa điểm tốt để đổi phần thưởng này (cần thêm hoa nhé)!`);
    }
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addReward({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Phần thưởng tinh thần đặc biệt của cô Tú My',
      cost: newCost,
      icon: newIcon,
    });
    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            PHẦN THƯỞNG PHI VẬT CHẤT & KỶ LUẬT TÍCH CỰC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">CỬA HÀNG ĐỔI QUÀ BÉ MẦM</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
            Dùng Hoa Điểm Tốt đổi những quyền lợi học tập thú vị: làm trợ lý của cô, chọn câu chuyện, chọn trò chơi!
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-2 rounded-2xl">
          <span className="text-xs font-bold text-white whitespace-nowrap">Đổi quà cho:</span>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            aria-label="Chọn học sinh để đổi quà"
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

      {/* Claimed Notification Toast */}
      {claimedNotice && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-md animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{claimedNotice}</span>
          </div>
          <button onClick={() => setClaimedNotice(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Student Star Balance Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeStudent.avatar}</span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">
              Học sinh: {activeStudent.name} ({activeStudent.id})
            </h4>
            <p className="text-xs text-slate-500">
              Số hoa hiện có:{' '}
              <strong className="text-amber-500 font-black text-sm">{activeStudent.stars} 🌸 Bông</strong>
            </p>
          </div>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Quà Mới</span>
          </button>
        )}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {rewards.map(reward => {
          const canAfford = activeStudent.stars >= reward.cost;

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-3xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                canAfford ? 'border-emerald-200 hover:shadow-md' : 'border-slate-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-4xl p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                    {reward.icon}
                  </span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                    <span>🌸</span>
                    <span>{reward.cost} Hoa</span>
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-800 mt-3">{reward.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reward.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  Đã đổi: <strong>{reward.claimedCount}</strong> lượt
                </span>

                <button
                  onClick={() => handleClaim(reward.id, reward.title)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Đổi Quà' : 'Chưa Đủ Hoa'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Reward Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base mb-3">Tạo Phần Thưởng Tinh Thần Mới</h3>
            <form onSubmit={handleCreateReward} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên phần thưởng:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chọn bài hát khởi động, Làm quản ca..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả chi tiết:</label>
                <input
                  type="text"
                  placeholder="Mô tả ý nghĩa phần thưởng cho bé..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chi phí (Hoa):</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newCost}
                    onChange={e => setNewCost(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Biểu tượng:</label>
                  <select
                    value={newIcon}
                    onChange={e => setNewIcon(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="👑">👑 Vương miện</option>
                    <option value="📚">📚 Sách truyện</option>
                    <option value="🎮">🎮 Trò chơi</option>
                    <option value="🎨">🎨 Tranh vẽ</option>
                    <option value="🎵">🎵 Âm nhạc</option>
                    <option value="🤝">🤝 Bạn thân</option>
                    <option value="⭐">⭐ Ngôi sao</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Tạo Quà
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
