import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApprovedMaterial } from '../types';
import {
  FolderOpen,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  BookOpen,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ApprovedMaterials: React.FC = () => {
  const { approvedMaterials, addApprovedMaterial, deleteApprovedMaterial, role } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [subject, setSubject] = useState<string>('Toán');
  const [topic, setTopic] = useState<string>('');
  const [week, setWeek] = useState<string>('Tuần 12');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('Lớp 1, GDPT 2018');

  const filtered = approvedMaterials.filter(
    m =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addApprovedMaterial({
      title: title.trim(),
      subject,
      topic: topic.trim() || title.trim(),
      week,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      approvedBy: 'Cô Nguyễn Thị Tú My',
    });

    setTitle('');
    setTopic('');
    setSummary('');
    setContent('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <FolderOpen className="w-3.5 h-3.5 text-yellow-300" />
            HỌC LIỆU SỐ PHÊ DUYỆT CHUẨN MỰC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">KHO TÀI LIỆU GIÁO VIÊN ĐÃ DUYỆT</h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
            Các bài học, quy tắc và nội dung đã được Cô giáo Tú My kiểm duyệt. Chatbot Bé Mầm AI sẽ ưu tiên trích dẫn từ kho này.
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-2xl shadow-md hover:bg-yellow-300 transition-colors"
          >
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Thêm Tài Liệu Mới</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài học, môn học, chủ đề..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Tổng số: <strong>{filtered.length}</strong> bài học
        </span>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(mat => (
          <div
            key={mat.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-lg">
                  {mat.subject} – {mat.week}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Đã kiểm duyệt</span>
                </span>
              </div>

              <h4 className="font-extrabold text-slate-800 text-sm mt-2">{mat.title}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{mat.summary}</p>

              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                {mat.content}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Phê duyệt bởi: <strong className="text-slate-600">{mat.approvedBy}</strong> ({mat.dateAdded})</span>
              {role === 'teacher' && (
                <button
                  onClick={() => {
                    if (confirm(`Xoá tài liệu "${mat.title}"?`)) {
                      deleteApprovedMaterial(mat.id);
                    }
                  }}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-800 text-base mb-3">Thêm Tài Liệu Vào Kho Học Liệu Số</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên bài học/tài liệu:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài 15: Phép cộng trong phạm vi 10"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Môn học:</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="Toán">Toán Lớp 1</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
                    <option value="Đạo đức">Đạo đức</option>
                    <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tuần học:</label>
                  <input
                    type="text"
                    value={week}
                    onChange={e => setWeek(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tóm tắt ngắn gọn:</label>
                <input
                  type="text"
                  placeholder="Quy tắc, ghi nhớ chính..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung chi tiết bài học:</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Nhập nội dung bài học, ví dụ, quy tắc ghi nhớ để Bé Mầm AI trích dẫn cho học sinh..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
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
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs"
                >
                  Lưu & Phê Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
