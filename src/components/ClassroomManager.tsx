import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, GroupId, AttendanceStatus } from '../types';
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Sparkles,
  ArrowRightLeft,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle,
  Edit2,
  Trash2,
  X,
  Printer,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClassroomManager: React.FC = () => {
  const {
    students,
    groups,
    awardStars,
    updateAttendance,
    moveStudentToGroup,
    addStudent,
    updateStudent,
    deleteStudent,
    exportStudentsCsv,
    importStudentsCsv,
    setActiveTab,
  } = useApp();

  // Filters
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [awardModalStudent, setAwardModalStudent] = useState<Student | null>(null);
  const [awardAmount, setAwardAmount] = useState<number>(5);
  const [awardReason, setAwardReason] = useState<string>('Hoàn thành bài tập tốt');
  const [customReason, setCustomReason] = useState<string>('');

  const [profileModalStudent, setProfileModalStudent] = useState<Student | null>(null);
  const [moveModalStudent, setMoveModalStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // New Student State
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentGroup, setNewStudentGroup] = useState<GroupId>('to1');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentAvatar, setNewStudentAvatar] = useState<string>('🌟');

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const matchesGroup = selectedGroup === 'all' || student.groupId === selectedGroup;
    const matchesSearch =
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Handle Quick Award
  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardModalStudent) return;
    const finalReason = awardReason === 'custom' ? customReason || 'Thưởng nỗ lực rèn luyện' : awardReason;
    awardStars(awardModalStudent.id, awardAmount, finalReason);

    // Fire celebratory confetti if award >= 10
    if (awardAmount >= 10) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    setAwardModalStudent(null);
  };

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      name: newStudentName.trim() || `Học sinh mới`,
      gender: newStudentGender,
      groupId: newStudentGroup,
      stars: 20,
      completedTasks: 0,
      attendanceToday: 'present',
      avatar: newStudentAvatar,
      notes: 'Học sinh mới nhập lớp',
      mathAccuracy: 80,
      vietAccuracy: 80,
      skillsNeedSupport: [],
      badges: ['Bé Mới'],
    });
    setNewStudentName('');
    setIsAddModalOpen(false);
  };

  // Handle CSV Import
  const handleImportSubmit = () => {
    if (!csvInput.trim()) return;
    const result = importStudentsCsv(csvInput);
    setImportMessage(result.message);
    if (result.success) {
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportMessage(null);
        setCsvInput('');
      }, 1500);
    }
  };

  const getGroupObj = (gId: GroupId) => groups.find(g => g.id === gId) || groups[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Action Bar: Filter, Search, and Teacher Tools */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Group Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedGroup === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả (32)
          </button>
          {groups.map(group => {
            const count = students.filter(s => s.groupId === group.id).length;
            const isSel = selectedGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSel ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{ backgroundColor: isSel ? group.color : undefined }}
              >
                <span>{group.mascot}</span>
                <span>{group.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSel ? 'bg-black/20 text-white' : 'bg-white text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã HS..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Teacher Actions */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Bé</span>
          </button>

          <button
            onClick={exportStudentsCsv}
            title="Xuất bảng tổng hợp Excel/CSV"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            title="Nhập danh sách từ CSV/Excel"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Nhập File</span>
          </button>

          <button
            onClick={() => window.print()}
            title="In danh sách lớp hoặc lưu PDF"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredStudents.map(student => {
          const group = getGroupObj(student.groupId);

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent line by group color */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: group.color }}
              />

              <div>
                {/* Header: Avatar, Code, Name, Attendance */}
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-white shadow-xs flex items-center justify-center text-2xl">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                          {student.id}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {group.mascot} {group.name.split(' ')[0]}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm mt-0.5 group-hover:text-blue-600 transition-colors truncate max-w-[130px]">
                        {student.name}
                      </h4>
                    </div>
                  </div>

                  {/* Attendance Selector Dropdown */}
                  <select
                    value={student.attendanceToday}
                    onChange={e => updateAttendance(student.id, e.target.value as AttendanceStatus)}
                    aria-label={`Điểm danh học sinh ${student.name}`}
                    className={`text-[10px] font-bold px-2 py-0.8 rounded-lg outline-none cursor-pointer border ${
                      student.attendanceToday === 'present'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : student.attendanceToday === 'late'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : student.attendanceToday === 'absent_excused'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <option value="present">Có mặt</option>
                    <option value="late">Đi muộn</option>
                    <option value="absent_excused">Nghỉ phép</option>
                    <option value="absent_unexcused">Vắng</option>
                  </select>
                </div>

                {/* Stars and Tasks Stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌸</span>
                    <div>
                      <span className="text-xs font-black text-amber-600">{student.stars}</span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">Hoa điểm tốt</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
                    <span className="text-base">📝</span>
                    <div>
                      <span className="text-xs font-black text-indigo-600">{student.completedTasks}</span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">Nhiệm vụ</span>
                    </div>
                  </div>
                </div>

                {/* Accuracy bars */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>Đúng Toán: {student.mathAccuracy}%</span>
                    <span>Tiếng Việt: {student.vietAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${(student.mathAccuracy + student.vietAccuracy) / 2}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setAwardModalStudent(student)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-extrabold text-xs shadow-xs transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cộng Hoa</span>
                </button>

                <button
                  onClick={() => setProfileModalStudent(student)}
                  title="Xem hồ sơ và kỹ năng"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setMoveModalStudent(student)}
                  title="Chuyển tổ cho học sinh"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-400 text-sm font-semibold">Không tìm thấy học sinh nào phù hợp bộ lọc.</p>
        </div>
      )}

      {/* MODAL 1: CỘNG HOA ĐIỂM TỐT */}
      {awardModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{awardModalStudent.avatar}</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    Thưởng Hoa Điểm Tốt: {awardModalStudent.id}
                  </h3>
                  <p className="text-xs text-slate-500">{awardModalStudent.name}</p>
                </div>
              </div>
              <button
                onClick={() => setAwardModalStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAwardSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chọn mức hoa thưởng:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { pts: 3, label: '+3 Hoa', desc: 'Phát biểu' },
                    { pts: 5, label: '+5 Hoa', desc: 'Vượt khó' },
                    { pts: 10, label: '+10 Hoa', desc: 'Bài học' },
                    { pts: 15, label: '+15 Hoa', desc: 'Tuần tốt' },
                  ].map(item => (
                    <button
                      key={item.pts}
                      type="button"
                      onClick={() => setAwardAmount(item.pts)}
                      className={`p-2 rounded-2xl border text-center transition-all ${
                        awardAmount === item.pts
                          ? 'border-amber-400 bg-amber-50 text-amber-800 font-black shadow-xs ring-2 ring-amber-300'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-sm font-extrabold block">{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Lý do khen thưởng:
                </label>
                <select
                  value={awardReason}
                  onChange={e => setAwardReason(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Hoàn thành bài tập tốt">Hoàn thành xuất sắc bài tập</option>
                  <option value="Cố gắng vượt khó, đọc chữ tiến bộ">Cố gắng vượt khó, đọc chữ tiến bộ</option>
                  <option value="Giúp đỡ bạn cùng bàn">Biết chia sẻ và giúp đỡ bạn</option>
                  <option value="Tích cực giơ tay phát biểu">Tích cực hăng hái phát biểu</option>
                  <option value="Hoàn thành nhiệm vụ tuần">Hoàn thành đầy đủ nhiệm vụ tuần</option>
                  <option value="custom">-- Lý do tùy chỉnh khác --</option>
                </select>

                {awardReason === 'custom' && (
                  <input
                    type="text"
                    placeholder="Nhập lý do khen thưởng..."
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    className="mt-2 w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAwardModalStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Xác Nhận Thưởng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HỒ SƠ CHI TIẾT HỌC SINH */}
      {profileModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                  {profileModalStudent.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg text-sm">
                      {profileModalStudent.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {getGroupObj(profileModalStudent.groupId).mascot} {getGroupObj(profileModalStudent.groupId).name}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mt-0.5">{profileModalStudent.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setProfileModalStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                  <span className="text-xs font-bold text-amber-700 block">Hoa Điểm Tốt</span>
                  <span className="text-xl font-black text-amber-600">{profileModalStudent.stars} 🌸</span>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-2xl border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-700 block">Nhiệm Vụ Đã Xong</span>
                  <span className="text-xl font-black text-indigo-600">{profileModalStudent.completedTasks}</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 block">Chuyên Cần</span>
                  <span className="text-xs font-black text-emerald-700 mt-1 block">
                    {profileModalStudent.attendanceToday === 'present' ? 'Có mặt' : 'Cần lưu ý'}
                  </span>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Năng Lực Môn Học GDPT 2018:
                </h4>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Môn Toán: Số đếm, phép tính phạm vi 10</span>
                    <span className="text-blue-600">{profileModalStudent.mathAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${profileModalStudent.mathAccuracy}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Môn Tiếng Việt: Chữ cái, âm vần, đọc câu</span>
                    <span className="text-pink-600">{profileModalStudent.vietAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${profileModalStudent.vietAccuracy}%` }} />
                  </div>
                </div>
              </div>

              {/* Skills needing reinforcement */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Kỹ Năng Cần Hỗ Trợ Rèn Thêm:
                </h4>
                {profileModalStudent.skillsNeedSupport && profileModalStudent.skillsNeedSupport.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profileModalStudent.skillsNeedSupport.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-xl font-bold"
                      >
                        🌱 {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl">
                    ✨ Bé đang nắm rất vững kiến thức và tiến bộ đều các môn!
                  </p>
                )}
              </div>

              {/* Badges */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Huy Hiệu Đã Đạt Được:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profileModalStudent.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-xl shadow-2xs flex items-center gap-1"
                    >
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhận xét của Cô giáo Tú My:
                </label>
                <textarea
                  defaultValue={profileModalStudent.notes}
                  onBlur={e => {
                    updateStudent({
                      ...profileModalStudent,
                      notes: e.target.value,
                    });
                  }}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xoá học sinh ${profileModalStudent.id}?`)) {
                    deleteStudent(profileModalStudent.id);
                    setProfileModalStudent(null);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xoá học sinh</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalStudent(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHUYỂN TỔ CHO HỌC SINH */}
      {moveModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">
              Chuyển Tổ: {moveModalStudent.id}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dữ liệu hoa điểm tốt và tiến độ học tập của bé vẫn được giữ nguyên vẹn.
            </p>

            <div className="space-y-2">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    moveStudentToGroup(moveModalStudent.id, g.id);
                    setMoveModalStudent(null);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    moveModalStudent.groupId === g.id
                      ? 'border-indigo-500 bg-indigo-50/70 font-black'
                      : 'border-slate-200 hover:bg-slate-50 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{g.mascot}</span>
                    <span className="text-sm">{g.name}</span>
                  </div>
                  {moveModalStudent.groupId === g.id && (
                    <span className="text-xs text-indigo-600 font-bold">Hiện tại</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMoveModalStudent(null)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: THÊM HỌC SINH MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base mb-3">Thêm Hồ Sơ Học Sinh Mới</h3>
            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Học sinh HS33 hoặc Họ tên thật"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phân vào Tổ:</label>
                  <select
                    value={newStudentGroup}
                    onChange={e => setNewStudentGroup(e.target.value as GroupId)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.mascot} {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Giới tính:</label>
                  <select
                    value={newStudentGender}
                    onChange={e => setNewStudentGender(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Biểu tượng avatar:</label>
                <div className="flex gap-2 text-2xl p-2 bg-slate-50 rounded-xl overflow-x-auto">
                  {['🦁', '🐱', '🐰', '🐼', '🦊', '🐻', '🦄', '🐣', '🌸', '⭐'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewStudentAvatar(emoji)}
                      className={`p-1.5 rounded-xl border ${
                        newStudentAvatar === emoji ? 'border-amber-400 bg-amber-100 ring-2 ring-amber-300' : 'border-transparent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
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
                  Lưu Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NHẬP CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Nhập Danh Sách Từ File CSV</h3>
            <p className="text-xs text-slate-500 mb-3">
              Dán nội dung CSV theo định dạng: Mã HS, Tên học sinh, Tổ (Rồng Vàng, Phượng Hoàng, Kỳ Lân, Rùa Thần), Hoa điểm tốt.
            </p>

            <textarea
              rows={6}
              value={csvInput}
              onChange={e => setCsvInput(e.target.value)}
              placeholder={`Mã HS,Tên học sinh,Tổ,Hoa điểm tốt\nHS01,Học sinh HS01,Rồng Vàng,30\nHS02,Học sinh HS02,Rồng Vàng,35`}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {importMessage && (
              <p className="text-xs font-bold mt-2 text-indigo-600 bg-indigo-50 p-2 rounded-xl">
                {importMessage}
              </p>
            )}

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportMessage(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
              >
                Xác Nhận Nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
