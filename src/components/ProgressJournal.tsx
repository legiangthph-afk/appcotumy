import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Undo2, Search, CheckCircle, AlertCircle, Filter } from 'lucide-react';

export const ProgressJournal: React.FC = () => {
  const { pointLogs, undoPointLog, role } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = pointLogs.filter(log =>
    log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-700 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold mb-1">
            <Clock className="w-3.5 h-3.5 text-yellow-300" />
            MINH BẠCH & CÔNG TÂM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">NHẬT KÝ TIẾN BỘ & HOÀN TÁC</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Lịch sử toàn bộ điểm cộng, điểm thưởng và nỗ lực của học sinh. Giáo viên có quyền Hoàn tác bất kỳ lúc nào nếu nhầm lẫn.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bé hoặc lý do..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="space-y-2.5">
          {filteredLogs.map(log => {
            const isPositive = log.deltaStars > 0;

            return (
              <div
                key={log.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  log.undone
                    ? 'bg-slate-100/60 border-slate-200 opacity-60 line-through'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      log.undone
                        ? 'bg-slate-200 text-slate-500'
                        : isPositive
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {isPositive ? `+${log.deltaStars}` : log.deltaStars}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-800">
                        {log.studentName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        ({log.timestamp})
                      </span>
                      {log.undone && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full not-italic">
                          Đã hoàn tác
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{log.reason}</p>
                  </div>
                </div>

                {/* Undo Button (For Teacher) */}
                {role === 'teacher' && !log.undone && (
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn hoàn tác lượt ghi này (${log.deltaStars} hoa cho ${log.studentName})?`)) {
                        undoPointLog(log.id);
                      }
                    }}
                    className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-colors"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Hoàn tác</span>
                  </button>
                )}
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs font-semibold">
              Chưa có dữ liệu nhật ký phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
