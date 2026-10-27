import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speakVietnamese, stopSpeaking } from '../utils/audio';
import {
  Bot,
  Send,
  Volume2,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Gamepad2,
  BookOpen,
  HelpCircle,
  Loader2,
  MessageCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  gameRecommendation?: string;
  suggestedQuestions?: string[];
}

export const ChatbotWidget: React.FC = () => {
  const { students, currentStudentId, approvedMaterials, setActiveTab } = useApp();
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Chào bạn nhỏ ${currentStudent.name}! 🌱 Bé Mầm AI rất vui được làm bạn học cùng em tại Lớp 1/2. Hôm nay em muốn cùng Bé Mầm học Toán, ghép vần Tiếng Việt hay chơi trò chơi nào nè?`,
      timestamp: 'Vừa xong',
      suggestedQuestions: [
        'Em muốn học phép cộng phạm vi 10',
        'Em muốn luyện đọc vần an, at',
        'Bé Mầm hướng dẫn em chơi trò chơi nhé!',
      ],
      gameRecommendation: 'haiHoa',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          approvedMaterials,
          studentName: currentStudent.name,
        }),
      });

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Bé Mầm luôn ở bên em! Em cố gắng học thật giỏi nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: data.suggestedQuestions,
        gameRecommendation: data.gameRecommendation,
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      const fallbackReply: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: `Bé Mầm đã nhận được câu hỏi của ${currentStudent.name}! Em hãy nhớ quan sát kỹ hình vẽ, đếm từng ngón tay hoặc hỏi cô giáo Tú My nhé! Cố lên, em làm được mà!`,
        timestamp: 'Vừa xong',
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    speakVietnamese(text, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <>
      {/* Floating Action Button on Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-white/60"
        >
          <div className="relative">
            <span className="text-2xl animate-bounce-gentle">🌱</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black block leading-none">BÉ MẦM AI</span>
            <span className="text-[10px] text-yellow-200 font-bold block">Bạn học Lớp 1/2</span>
          </div>
        </button>
      )}

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border-2 border-indigo-200 rounded-3xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[550px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/30 shadow-xs">
                🌱
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm">BÉ MẦM AI</h3>
                  <span className="text-[10px] bg-yellow-400 text-slate-900 font-black px-1.5 py-0.2 rounded-md">
                    Lớp 1/2
                  </span>
                </div>
                <p className="text-[11px] text-blue-100">Người bạn học tập của em</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 transition-colors"
                title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {messages.map(msg => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-300 to-yellow-200 text-slate-800 flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                      🌱
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isBot
                          ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                          : 'bg-indigo-600 text-white rounded-tr-xs font-semibold'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {isBot && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            title="Nghe Bé Mầm đọc"
                            className="p-1 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 flex items-center gap-1 font-bold"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe đọc</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bot suggested questions */}
                    {isBot && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedQuestions.map((sq, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sq)}
                            className="text-[11px] bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-xl font-bold transition-colors shadow-2xs text-left"
                          >
                            💡 {sq}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Game recommendation button */}
                    {isBot && msg.gameRecommendation && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setActiveTab('games_arcade');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-xs"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Mở Trò Chơi Luyện Tập Ngay!</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs font-bold text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Bé Mầm đang suy nghĩ lời giải thích cho em nè...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Big Search & Input: "Em muốn học gì hôm nay?" */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Em muốn học gì hôm nay? (Toán, Tiếng Việt...)"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 transition-all shadow-xs flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
