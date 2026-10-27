import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Star, Sparkles, Award, Printer, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyRecognition: React.FC = () => {
  const { students, groups } = useApp();
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<string>('HS06');
  const [certificateTitle, setCertificateTitle] = useState<string>('BÉ NGOAN XUẤT SẮC TOÀN DIỆN');

  const certStudent = students.find(s => s.id === selectedStudentForCert) || students[0];

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Find standout students
  const mathStar = [...students].sort((a, b) => b.mathAccuracy - a.mathAccuracy)[0];
  const vietStar = [...students].sort((a, b) => b.vietAccuracy - a.vietAccuracy)[0];
  const flowerMaster = [...students].sort((a, b) => b.stars - a.stars)[0];
  const hardWorker = [...students].sort((a, b) => b.completedTasks - a.completedTasks)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-6 text-slate-900 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 text-xs font-black uppercase mb-1">
            <Trophy className="w-3.5 h-3.5 text-indigo-900" />
            Bảng Vàng Danh Dự
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">VINH DANH MỖI NGÀY – LỚP 1/2</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
            Ghi nhận mọi cố gắng, tôn vinh từng bước trưởng thành của học sinh Lớp 1/2 Hoà Sơn!
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className="px-5 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transform active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Bắn Pháo Hoa Chúc Mừng 🎉</span>
        </button>
      </div>

      {/* 4 Recognition Spotlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Math Star */}
        <div className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xs hover:shadow-md transition-all text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <span className="text-3xl block mt-2">📐</span>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
            Ngôi Sao Toán Học
          </span>
          <h4 className="text-base font-black text-slate-800 mt-1">{mathStar.name}</h4>
          <p className="text-xs text-slate-500">Độ chính xác phép tính: <strong className="text-blue-600 font-bold">{mathStar.mathAccuracy}%</strong></p>
          <div className="mt-3 text-xs bg-blue-50 text-blue-800 font-bold p-2 rounded-xl">
            🏆 Tính nhẩm nhanh nhẹn, đếm số chuẩn xác!
          </div>
        </div>

        {/* Vietnamese Star */}
        <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-xs hover:shadow-md transition-all text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
          <span className="text-3xl block mt-2">📖</span>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black uppercase">
            Bậc Thầy Chữ Đẹp & Âm Vần
          </span>
          <h4 className="text-base font-black text-slate-800 mt-1">{vietStar.name}</h4>
          <p className="text-xs text-slate-500">Độ chuẩn xác đọc câu: <strong className="text-pink-600 font-bold">{vietStar.vietAccuracy}%</strong></p>
          <div className="mt-3 text-xs bg-pink-50 text-pink-800 font-bold p-2 rounded-xl">
            🌸 Đọc to, rõ ràng, ghép tiếng thuần thục!
          </div>
        </div>

        {/* Flower Master */}
        <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-xs hover:shadow-md transition-all text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <span className="text-3xl block mt-2">🌸</span>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase">
            Vua Hoa Điểm Tốt
          </span>
          <h4 className="text-base font-black text-slate-800 mt-1">{flowerMaster.name}</h4>
          <p className="text-xs text-slate-500">Tích lũy xuất sắc: <strong className="text-amber-600 font-bold">{flowerMaster.stars} bông</strong></p>
          <div className="mt-3 text-xs bg-amber-50 text-amber-800 font-bold p-2 rounded-xl">
            ✨ Tích cực rèn luyện và gương mẫu!
          </div>
        </div>

        {/* Hard Worker */}
        <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs hover:shadow-md transition-all text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <span className="text-3xl block mt-2">🐝</span>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">
            Chú Ong Chăm Chỉ
          </span>
          <h4 className="text-base font-black text-slate-800 mt-1">{hardWorker.name}</h4>
          <p className="text-xs text-slate-500">Nhiệm vụ hoàn thành: <strong className="text-emerald-600 font-bold">{hardWorker.completedTasks} bài</strong></p>
          <div className="mt-3 text-xs bg-emerald-50 text-emerald-800 font-bold p-2 rounded-xl">
            🌱 Luôn hoàn thành đúng hạn mọi bài học!
          </div>
        </div>
      </div>

      {/* Printable Certificate Generator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Tạo Giấy Khen Điện Tử "BÉ MẦM DANH DỰ"
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cô giáo có thể in tặng học sinh dán vào góc học tập hoặc gửi phụ huynh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStudentForCert}
              onChange={e => setSelectedStudentForCert(e.target.value)}
              aria-label="Chọn học sinh nhận giấy khen"
              className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name} ({s.stars} 🌸)
                </option>
              ))}
            </select>

            <select
              value={certificateTitle}
              onChange={e => setCertificateTitle(e.target.value)}
              aria-label="Chọn danh hiệu khen thưởng"
              className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50"
            >
              <option value="BÉ NGOAN XUẤT SẮC TOÀN DIỆN">Bé Ngoan Xuất Sắc Toàn Diện</option>
              <option value="NGÔI SAO TOÁN HỌC NHÍ">Ngôi Sao Toán Học Nhí</option>
              <option value="BẬC THẦY CHỮ ĐẸP VÀ ÂM VẦN">Bậc Thầy Chữ Đẹp Và Âm Vần</option>
              <option value="BÉ CHĂM CHỈ VƯỢT KHÓ">Bé Chăm Chỉ Vượt Khó</option>
              <option value="NGƯỜI BẠN TỐT BỤNG VÀ THÂN THIỆN">Người Bạn Tốt Bụng & Thân Thiện</option>
            </select>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Giấy Khen</span>
            </button>
          </div>
        </div>

        {/* Certificate Preview Canvas Box */}
        <div className="mt-6 max-w-2xl mx-auto p-8 rounded-3xl border-8 border-double border-amber-300 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 text-center shadow-md relative">
          <div className="absolute top-3 left-4 text-3xl">🌱</div>
          <div className="absolute top-3 right-4 text-3xl">⭐</div>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            TRƯỜNG TIỂU HỌC HOÀ SƠN – LỚP 1/2
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-600 tracking-wide mt-2">
            GIẤY KHEN BÉ MẦM DANH DỰ
          </h1>
          <p className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider mt-1">
            {certificateTitle}
          </p>

          <div className="my-5">
            <span className="text-5xl block mb-2">{certStudent.avatar}</span>
            <p className="text-sm text-slate-600">Thân ái khen tặng em:</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 underline decoration-yellow-400">
              {certStudent.name} ({certStudent.id})
            </h3>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              Đã có thành tích xuất sắc, đạt <strong className="text-amber-600 font-bold">{certStudent.stars} Hoa Điểm Tốt</strong> và luôn chăm ngoan, lễ phép, đoàn kết cùng các bạn Lớp 1/2.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-amber-200/60 flex items-end justify-between px-6 text-xs">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block">Đà Nẵng, tháng 10 năm 2026</span>
              <span className="font-extrabold text-slate-700">Dự án Mầm Trí Tuệ AI</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Giáo viên chủ nhiệm</span>
              <span className="font-black text-indigo-700 text-sm">Nguyễn Thị Tú My</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
