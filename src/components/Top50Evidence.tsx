import React from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  FileText,
  School,
  Sparkles,
  Users,
  Printer,
  Heart,
  Quote,
} from 'lucide-react';

export const Top50Evidence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-6 text-slate-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-yellow-300 text-xs font-black mb-1">
            <Award className="w-3.5 h-3.5" />
            HỒ SƠ SÁNG KIẾN KINH NGHIỆM SƯ PHẠM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            MẦM TRÍ TUỆ AI – MINH CHỨNG SÁNG KIẾN
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
            Ứng Dụng Trí Tuệ Nhân Tạo & Bảng Thi Đua Số Trong Quản Lý Lớp Học Lớp 1/2 – Tiểu Học Hoà Sơn
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In Hồ Sơ Báo Cáo</span>
        </button>
      </div>

      {/* Main Dossier Summary Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        {/* Project Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 font-bold block">Tác giả sáng kiến:</span>
            <strong className="text-slate-800 text-sm font-black">Cô Nguyễn Thị Tú My</strong>
            <span className="text-slate-500 block">Giáo viên Tiểu học</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block">Đơn vị công tác:</span>
            <strong className="text-slate-800 text-sm font-black">Trường Tiểu học Hoà Sơn</strong>
            <span className="text-slate-500 block">Thành phố Đà Nẵng</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block">Đối tượng áp dụng:</span>
            <strong className="text-slate-800 text-sm font-black">Lớp 1/2 (Sĩ số: 32 học sinh)</strong>
            <span className="text-slate-500 block">Chương trình GDPT 2018</span>
          </div>
        </div>

        {/* Section 1: Tính Cấp Thiết & Mục Tiêu */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>1. Tính Cấp Thiết & Mục Tiêu Của Đề Tài</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
            Bước vào lớp 1, học sinh trải qua bước chuyển tiếp tâm lý lớn từ hoạt động "vui chơi là chính" ở mầm non sang hoạt động "học tập có chủ đích". Nhiều em còn bỡ ngỡ, khó tập trung, e dè và ngại phát biểu. Giải pháp <strong>MẦM TRÍ TUỆ AI</strong> ra đời nhằm số hoá bảng thi đua khen thưởng không áp lực, xây dựng 10 trò chơi học tập tương tác bám sát Chương trình GDPT 2018 và tích hợp Trợ lý học tập thân thiện <strong>Bé Mầm AI</strong> hỗ trợ giải thích bài tập bằng giọng đọc tiếng Việt gần gũi.
          </p>
        </div>

        {/* Section 2: Điểm Mới & Tính Sáng Tạo */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>2. Điểm Mới & Tính Sáng Tạo Nổi Bật</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-indigo-700 block font-black">🌱 Thi đua tích cực - Không bêu tên phạt:</strong>
              <p className="text-slate-600">
                Chỉ tôn vinh sự tiến bộ của từng cá nhân qua "Hoa Điểm Tốt". Đổi quà phi vật chất (làm trợ lý lớp, chọn truyện) khích lệ động lực nội tại.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-indigo-700 block font-black">🤖 Trợ lý Bé Mầm AI bám sát GDPT 2018:</strong>
              <p className="text-slate-600">
                Ứng dụng mô hình Gemini giải thích phép tính, âm vần bằng đồ vật trực quan (que tính, quả táo), an toàn 100% cho trẻ nhỏ.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-indigo-700 block font-black">🎮 Hệ sinh thái 10 trò chơi thực thụ:</strong>
              <p className="text-slate-600">
                Hoạt động mượt mà trên điện thoại, máy tính bảng và máy tính, tự động ghi nhận hoa thưởng vào hồ sơ riêng của 32 học sinh.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-indigo-700 block font-black">📊 Phân hóa bài tập & Củng cố cá nhân hóa:</strong>
              <p className="text-slate-600">
                Hệ thống nhận diện kỹ năng học sinh còn lúng túng (như cặp số cộng 10, phân biệt vần an/at) để gợi ý bài luyện tập bổ trợ kịp thời.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Phản Hồi Từ Phụ Huynh & Nhà Trường */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Quote className="w-5 h-5 text-emerald-600" />
            <span>3. Ý Kiến Đánh Giá Của Phụ Huynh & Ban Giám Hiệu</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩‍👧</span>
                <div>
                  <strong className="text-slate-800 font-black block">Phụ huynh học sinh HS06 (Lớp 1/2)</strong>
                  <span className="text-emerald-700 font-semibold text-[11px]">Đã tham gia thử nghiệm 8 tuần</span>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">
                "Từ ngày lớp 1/2 có ứng dụng Mầm Trí Tuệ AI, cháu đi học về là tự giác mở điện thoại của mẹ để làm bài và khoe được cô Tú My cộng hoa điểm tốt. Cháu không còn sợ môn Toán nữa vì có bạn Bé Mầm giảng bài rất dễ thương!"
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏫</span>
                <div>
                  <strong className="text-slate-800 font-black block">Ban Giám Hiệu Trường Tiểu Học Hoà Sơn</strong>
                  <span className="text-blue-700 font-semibold text-[11px]">Đánh giá chuyên môn sư phạm</span>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">
                "Sáng kiến của cô giáo Nguyễn Thị Tú My bám rất sát đổi mới phương pháp dạy học theo GDPT 2018. Ứng dụng mang tính thực tiễn cao, giao diện trong sáng, bảo mật thông tin học sinh tốt và tạo được sự hứng khởi học tập rõ rệt cho học sinh lớp 1."
              </p>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Minh chứng xác thực tại Lớp 1/2 – Tiểu học Hoà Sơn, Đà Nẵng</span>
          <span className="font-extrabold text-indigo-700">Sáng kiến kinh nghiệm ứng dụng công nghệ số Lớp 1/2</span>
        </div>
      </div>
    </div>
  );
};
