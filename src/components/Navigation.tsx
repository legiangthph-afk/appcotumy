import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Users,
  Flower2,
  Medal,
  Flag,
  CircleDot,
  Gift,
  Clock,
  BookOpen,
  Gamepad2,
  Sparkles,
  ClipboardList,
  BarChart3,
  FileCheck2,
  FolderOpen,
  UserCheck,
  HeartHandshake,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  roleFilter?: ('teacher' | 'student' | 'parent')[];
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, role, assignments, pointLogs } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'classroom',
      label: 'Lớp Học & Cộng Điểm',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'flower_board',
      label: 'Bảng Hoa Điểm Tốt',
      icon: <Flower2 className="w-4 h-4 text-pink-500" />,
    },
    {
      id: 'recognition',
      label: 'Vinh Danh Mỗi Ngày',
      icon: <Medal className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'group_race',
      label: 'Thi Đua 4 Tổ',
      icon: <Flag className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'lucky_wheel',
      label: 'Vòng Quay May Mắn',
      icon: <CircleDot className="w-4 h-4 text-purple-500 animate-spin-slow" />,
    },
    {
      id: 'reward_shop',
      label: 'Cửa Hàng Đổi Quà',
      icon: <Gift className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'activity_log',
      label: 'Nhật Ký & Hoàn Tác',
      icon: <Clock className="w-4 h-4 text-slate-500" />,
      badge: pointLogs.filter(l => !l.undone).length.toString(),
    },
    {
      id: 'curriculum',
      label: 'Kho Bài Học GDPT',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'games_arcade',
      label: '10 Trò Chơi AI',
      icon: <Gamepad2 className="w-4 h-4 text-rose-500" />,
      badge: 'HOT',
    },
    {
      id: 'ai_workshop',
      label: 'Xưởng Bài Tập AI',
      icon: <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />,
      badge: 'Gemini',
    },
    {
      id: 'assignments',
      label: 'Giao & Chấm Bài',
      icon: <ClipboardList className="w-4 h-4 text-cyan-600" />,
      badge: assignments.length.toString(),
    },
    {
      id: 'analytics',
      label: 'Dashboard Báo Cáo',
      icon: <BarChart3 className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'materials',
      label: 'Học Liệu Đã Duyệt',
      icon: <FolderOpen className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'top50_evidence',
      label: 'Hồ Sơ Sáng Kiến',
      icon: <FileCheck2 className="w-4 h-4 text-amber-600" />,
    },
  ];

  // Specific portal items
  if (role === 'student') {
    navItems.unshift({
      id: 'student_portal',
      label: 'Bàn Học Của Em',
      icon: <UserCheck className="w-4 h-4 text-amber-600" />,
      badge: 'Bé làm bài',
    });
  }

  if (role === 'parent') {
    navItems.unshift({
      id: 'parent_portal',
      label: 'Sổ Liên Lạc Điện Tử',
      icon: <HeartHandshake className="w-4 h-4 text-emerald-600" />,
      badge: 'Gia đình',
    });
  }

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center overflow-x-auto py-2.5 space-x-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200 scale-102'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-yellow-400 text-slate-900'
                        : item.badge === 'HOT'
                        ? 'bg-rose-500 text-white'
                        : item.badge === 'Gemini'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
