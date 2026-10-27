import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { Navigation } from './components/Navigation';
import { ClassroomManager } from './components/ClassroomManager';
import { FlowerBoard } from './components/FlowerBoard';
import { DailyRecognition } from './components/DailyRecognition';
import { GroupRace } from './components/GroupRace';
import { LuckyWheel } from './components/LuckyWheel';
import { RewardShop } from './components/RewardShop';
import { ProgressJournal } from './components/ProgressJournal';
import { CurriculumBank } from './components/CurriculumBank';
import { GamesArcade } from './components/GamesArcade';
import { AiWorkshop } from './components/AiWorkshop';
import { AssignmentManager } from './components/AssignmentManager';
import { StudentPortal } from './components/StudentPortal';
import { ParentPortal } from './components/ParentPortal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Top50Evidence } from './components/Top50Evidence';
import { ApprovedMaterials } from './components/ApprovedMaterials';
import { ChatbotWidget } from './components/ChatbotWidget';
import { School, Heart, Trophy, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <StatsBar />
        <Navigation />

        <div className="py-2">
          {activeTab === 'classroom' && <ClassroomManager />}
          {activeTab === 'flower_board' && <FlowerBoard />}
          {activeTab === 'recognition' && <DailyRecognition />}
          {activeTab === 'group_race' && <GroupRace />}
          {activeTab === 'lucky_wheel' && <LuckyWheel />}
          {activeTab === 'reward_shop' && <RewardShop />}
          {activeTab === 'activity_log' && <ProgressJournal />}
          {activeTab === 'curriculum' && <CurriculumBank />}
          {activeTab === 'games_arcade' && <GamesArcade />}
          {activeTab === 'ai_workshop' && <AiWorkshop />}
          {activeTab === 'assignments' && <AssignmentManager />}
          {activeTab === 'student_portal' && <StudentPortal />}
          {activeTab === 'parent_portal' && <ParentPortal />}
          {activeTab === 'analytics' && <TeacherDashboard />}
          {activeTab === 'top50_evidence' && <Top50Evidence />}
          {activeTab === 'materials' && <ApprovedMaterials />}
        </div>
      </div>

      {/* Floating Chatbot Widget: BÉ MẦM AI */}
      <ChatbotWidget />

      {/* Footer */}
      <footer className="mt-8 bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <School className="w-4 h-4 text-blue-600" />
              Trường Tiểu học Hoà Sơn – TP. Đà Nẵng
            </span>
            <span>•</span>
            <span>Lớp 1/2 (Sĩ số 32 học sinh)</span>
            <span>•</span>
            <span className="text-indigo-600 font-black">Giáo viên: Nguyễn Thị Tú My</span>
          </div>

          <p className="text-slate-400 text-[11px]">
            Ứng dụng lớp học thông minh – Học vui, tiến bộ mỗi ngày.
          </p>
          <p className="text-slate-400 text-[10px]">
            © 2026 MẦM TRÍ TUỆ AI. Tất cả quyền được bảo lưu. Phát triển vì sự tiến bộ và niềm vui học tập của học sinh tiểu học.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
