import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const rawApiKey = process.env.GEMINI_API_KEY;
const isValidApiKey = !!rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && !rawApiKey.startsWith('MY_');
let aiClient: GoogleGenAI | null = null;

if (isValidApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: rawApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function timeoutPromise<T>(promise: Promise<T>, ms: number = 4500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timed out')), ms)),
  ]);
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: isValidApiKey,
    app: 'MẦM TRÍ TUỆ AI - Lớp 1/2',
    school: 'Tiểu học Hoà Sơn - TP Đà Nẵng',
    teacher: 'Nguyễn Thị Tú My',
  });
});

// Chatbot Bé Mầm AI
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], approvedMaterials = [], studentName = 'bạn nhỏ' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
      return;
    }

    // Safety checks for Grade 1 kids
    const lower = message.toLowerCase();
    const sensitiveWords = ['sdt', 'số điện thoại', 'địa chỉ nhà', 'mật khẩu', 'tiền'];
    for (const w of sensitiveWords) {
      if (lower.includes(w)) {
        res.json({
          reply: `Bé Mầm luôn bảo vệ an toàn cho ${studentName}! Chúng mình chỉ trò chuyện về bài học lớp 1 thôi nhé. Hôm nay em muốn học Toán hay Tiếng Việt nè?`,
          suggestedQuestions: ['Bé Mầm đố em phép tính 3 + 2 nhé!', 'Em muốn nghe kể chuyện chữ A', 'Giới thiệu trò chơi ghép vần'],
          gameRecommendation: 'ghepHinh',
        });
        return;
      }
    }

    if (!aiClient) {
      // Smart offline fallback for Bé Mầm AI
      const defaultReplies: Record<string, string> = {
        'toán': `Chào ${studentName}! Học Toán lớp 1 rất vui. Ví dụ: Em có 3 quả táo đỏ 🍎🍎🍎, bạn cho thêm 2 quả 🍎🍎. Cả thảy em có 3 + 2 = 5 quả táo nè! Em có muốn thử một câu đố khác không?`,
        'tiếng việt': `Chào ${studentName}! Bé Mầm yêu tiếng Việt lắm! Chữ "a" như chú gà con 🐣, dấu huyền như chiếc cầu trượt chéo xuống. Em đang học vần nào, nói cho Bé Mầm nghe nhé!`,
        'chào': `Bé Mầm AI xin chào ${studentName}! Chúc em một ngày học thật chăm ngoan và nhận thật nhiều Hoa Điểm Tốt cùng Lớp 1/2 nhé! Em muốn cùng Bé Mầm học bài gì nào?`,
        'trò chơi': `Tuyệt vời luôn! Trong lớp mình có tới 10 trò chơi như Vòng quay tri thức, Bé hái hoa điểm tốt, Giải cứu khu vườn. Em thích chơi trò nào nhất?`,
      };

      let matchedReply = '';
      for (const key of Object.keys(defaultReplies)) {
        if (lower.includes(key)) {
          matchedReply = defaultReplies[key];
          break;
        }
      }

      if (!matchedReply) {
        matchedReply = `Bé Mầm AI đã nghe rõ câu hỏi của ${studentName}: "${message}". Bé Mầm khuyên bạn nhỏ hãy cùng quan sát thật kĩ tranh ảnh, đếm que tính hoặc hỏi thêm cô giáo Tú My nhé. Cố lên, em học rất giỏi!`;
      }

      res.json({
        reply: matchedReply,
        suggestedQuestions: [
          'Em muốn học phép cộng trong phạm vi 10',
          'Em muốn luyện đọc vần an, at',
          'Em muốn chơi trò Hái hoa điểm tốt',
        ],
        gameRecommendation: 'haiHoa',
      });
      return;
    }

    // Prepare system instruction and context
    const materialsSummary = approvedMaterials.length > 0
      ? `Danh mục học liệu cô giáo Tú My đã duyệt:\n${approvedMaterials.map((m: any) => `- [${m.subject}] ${m.title}: ${m.summary || m.content?.slice(0, 150)}`).join('\n')}`
      : 'Hiện tại kho học liệu gồm các chủ đề GDPT 2018 Lớp 1: Toán (phép cộng trừ, hình học, số đếm), Tiếng Việt (chữ cái, âm vần), Tự nhiên xã hội, Đạo đức.';

    const systemPrompt = `Bạn là BÉ MẦM AI – Người bạn học tập của học sinh Lớp 1/2, Trường Tiểu học Hoà Sơn, Đà Nẵng (Cô giáo chủ nhiệm: Nguyễn Thị Tú My).
Đặc điểm:
- Giọng nói: Trong trẻo, ấm áp, hồn nhiên, vui tươi, ngắn gọn (1-3 đoạn ngắn dễ hiểu).
- Đối tượng: Học sinh lớp 1 (6-7 tuổi). Dùng từ ngữ đơn giản, khuyến khích, có biểu tượng cảm xúc vui nhộn (🌱, ⭐, 🌸, 🎈, 🐱, 🍎).
- Nhiệm vụ: Giải thích bài tập Toán, Tiếng Việt lớp 1 theo từng bước nhẹ nhàng; hướng dẫn em đếm, so sánh, ghép vần; cổ vũ, động viên em; gợi ý trò chơi học tập.
- Nguyên tắc an toàn: Không bao giờ hỏi thông tin cá nhân (địa chỉ, số điện thoại, mật khẩu). Nếu câu hỏi ngoài lề, khuyên em tập trung vào bài học.
- Dựa trên kho học liệu được phê duyệt:
${materialsSummary}
Nếu không có trong tài liệu hoặc câu hỏi quá khó với lớp 1, trả lời dịu dàng: "Bé Mầm chưa tìm thấy nội dung này trong bài học hôm nay. Em hãy giơ tay hỏi cô giáo Tú My nhé!".
Hãy xưng là "Bé Mầm" và gọi bé là "em" hoặc "bạn nhỏ".`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await timeoutPromise(
      aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
      4500
    );

    const replyText = response.text || `Bé Mầm AI rất vui được đồng hành cùng bạn nhỏ! Cố lên nhé!`;

    // Extract quick suggestions
    let suggestions = [
      'Em muốn học phép cộng phạm vi 10',
      'Em muốn đọc vần an, at',
      'Bé Mầm mở trò chơi nhé!',
    ];

    res.json({
      reply: replyText,
      suggestedQuestions: suggestions,
      gameRecommendation: lower.includes('toán') ? 'toanNhanh' : lower.includes('chữ') ? 'ghepChu' : 'haiHoa',
    });
  } catch (error: any) {
    console.error('Chat error/timeout:', error?.message);
    const studentName = req.body?.studentName || 'bạn nhỏ';
    const message = req.body?.message || '';
    const lower = message.toLowerCase();

    let reply = `Bé Mầm AI xin chào ${studentName}! Hôm nay cô giáo Tú My có rất nhiều bài tập hay và 10 trò chơi vui nhộn đang đợi em ở lớp 1/2 đó!`;
    if (lower.includes('toán') || lower.includes('cộng') || lower.includes('trừ')) {
      reply = `Chào ${studentName}! Học Toán lớp 1 rất vui. Ví dụ: Em có 3 quả táo đỏ 🍎🍎🍎, bạn cho thêm 2 quả 🍎🍎. Cả thảy em có 3 + 2 = 5 quả táo nè! Em có muốn thử sức với bài toán khác không?`;
    } else if (lower.includes('chữ') || lower.includes('vần') || lower.includes('đọc')) {
      reply = `Bé Mầm yêu tiếng Việt lắm! Chữ "a" như chú gà con 🐣, dấu huyền như chiếc cầu trượt chéo xuống. Em hãy chăm chỉ luyện đọc vần an, at cùng cô Tú My nhé!`;
    }

    res.json({
      reply,
      suggestedQuestions: [
        'Em muốn học phép cộng trong phạm vi 10',
        'Em muốn luyện đọc vần an, at',
        'Bé Mầm hướng dẫn em chơi trò chơi nhé!',
      ],
      gameRecommendation: 'haiHoa',
    });
  }
});

// AI Exercise Generation
app.post('/api/generate-exercises', async (req: Request, res: Response) => {
  try {
    const {
      subject = 'Toán',
      topic = 'Phép cộng trong phạm vi 10',
      grade = 'Lớp 1',
      week = 'Tuần 12',
      skill = 'Cộng nhẩm không nhớ',
      level = 'Cơ bản',
      count = 8,
      exerciseType = 'Trắc nghiệm 3 lựa chọn',
      gameType = 'AI Hái hoa điểm tốt',
    } = req.body;

    const numQuestions = Math.min(Math.max(Number(count) || 8, 5), 10);

    if (!aiClient) {
      // Fallback pre-designed high-quality exercises
      const sampleFallback = getFallbackExercises(subject, topic, numQuestions, level);
      res.json({
        success: true,
        source: 'built-in-curriculum',
        exercises: sampleFallback,
      });
      return;
    }

    const prompt = `Bạn là chuyên gia sư phạm tiểu học Chương trình GDPT 2018 Việt Nam.
Hãy tạo một bộ gồm ${numQuestions} câu hỏi bài tập tương tác cho học sinh ${grade}, môn ${subject}.
- Chủ đề: ${topic}
- Tuần học: ${week}
- Kỹ năng cần rèn: ${skill}
- Mức độ: ${level} (Củng cố, Cơ bản, hoặc Mở rộng)
- Dạng câu hỏi ưu tiên: ${exerciseType}
- Trò chơi ứng dụng: ${gameType}

YÊU CẦU ĐẶC BIỆT CHO HỌC SINH LỚP 1:
1. Câu hỏi ngắn, từ ngữ trong sáng, chuẩn chính tả tiếng Việt.
2. Với môn Toán: dùng tình huống gần gũi (quả táo, bạn nhỏ, bút chì, con thỏ, xe đạp). Mỗi câu trắc nghiệm có 3 lựa chọn (A, B, C).
3. Với Tiếng Việt: chữ cái, âm đầu, vần, tiếng, ghép từ, điền từ đơn giản.
4. Trả về đúng định dạng JSON có cấu trúc chính xác.`;

    const response = await timeoutPromise(
      aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING, description: 'Nội dung câu hỏi ngắn' },
                    type: { type: Type.STRING, description: 'multiple_choice | boolean | fill_in | matching' },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Danh sách 2-3 đáp án lựa chọn cho học sinh lớp 1',
                    },
                    correctAnswer: { type: Type.STRING, description: 'Đáp án chính xác' },
                    explanation: { type: Type.STRING, description: 'Lời giải thích siêu ngắn, dễ hiểu cho trẻ lớp 1' },
                    hint: { type: Type.STRING, description: 'Gợi ý nhẹ nhàng khi bé trả lời chưa đúng' },
                    points: { type: Type.INTEGER, description: 'Số hoa thưởng (3-5 hoa)' },
                    visualIcon: { type: Type.STRING, description: 'Icon minh họa như 🍎, 🐱, 🌸, 🚗, ✏️, ⭐' },
                  },
                  required: ['id', 'question', 'type', 'options', 'correctAnswer', 'explanation', 'hint', 'points'],
                },
              },
            },
            required: ['exercises'],
          },
        },
      }),
      4500
    );

    const parsed = JSON.parse(response.text || '{"exercises": []}');
    if (parsed.exercises && parsed.exercises.length > 0) {
      res.json({
        success: true,
        source: 'gemini-3.8-flash',
        exercises: parsed.exercises,
      });
    } else {
      res.json({
        success: true,
        source: 'built-in-curriculum',
        exercises: getFallbackExercises(subject, topic, numQuestions, level),
      });
    }
  } catch (error) {
    console.error('Error generating exercises:', error);
    const fallback = getFallbackExercises(req.body.subject, req.body.topic, 8, req.body.level);
    res.json({
      success: true,
      source: 'offline-safety-bank',
      exercises: fallback,
    });
  }
});

// Helper for fallback curriculum exercises
function getFallbackExercises(subject: string, topic: string, count: number, level: string) {
  const isMath = (subject || '').toLowerCase().includes('toán');
  const list = [];

  if (isMath) {
    const mathTemplates = [
      { q: 'Có 3 chú thỏ con 🐰🐰🐰, thêm 2 chú thỏ nữa chạy tới 🐰🐰. Hỏi có tất cả mấy chú thỏ?', opts: ['5 chú thỏ', '4 chú thỏ', '6 chú thỏ'], ans: '5 chú thỏ', exp: '3 + 2 = 5 chú thỏ con đáng yêu!', hint: 'Em đếm lần lượt 3 rồi đếm tiếp 4, 5 nhé.', icon: '🐰' },
      { q: 'Phép tính nào dưới đây có kết quả bằng 6?', opts: ['4 + 2', '3 + 2', '5 + 2'], ans: '4 + 2', exp: '4 thêm 2 bằng 6.', hint: 'Em hãy thử giơ 4 ngón tay rồi thêm 2 ngón tay nữa xem nào.', icon: '⭐' },
      { q: 'Điền dấu thích hợp: 5 ... 8', opts: ['<', '>', '='], ans: '<', exp: '5 bé hơn 8.', hint: 'Số 5 đứng trước số 8 trong dãy số đếm nên 5 bé hơn 8.', icon: '🔢' },
      { q: 'Bác nông dân có 7 củ cà rốt 🥕, bác tặng bạn gấu 3 củ. Bác còn lại mấy củ?', opts: ['4 củ', '5 củ', '3 củ'], ans: '4 củ', exp: '7 - 3 = 4 củ cà rốt.', hint: 'Em lấy 7 bớt đi 3 nhé.', icon: '🥕' },
      { q: 'Hình nào dưới đây là hình tam giác?', opts: ['Hình có 3 cạnh 🔺', 'Hình tròn 🔴', 'Hình vuông ⏹️'], ans: 'Hình có 3 cạnh 🔺', exp: 'Hình tam giác có 3 cạnh và 3 góc!', hint: 'Hãy tìm hình giống mái nhà nhọn nhé.', icon: '🔺' },
      { q: 'Số liền sau của số 9 là số nào?', opts: ['Số 10', 'Số 8', 'Số 7'], ans: 'Số 10', exp: 'Sau số 9 là số 10 tròn trĩnh.', hint: 'Đếm 8, 9 rồi đến số mấy nhỉ?', icon: '🔟' },
      { q: 'Tính nhẩm: 6 + 3 = ?', opts: ['9', '8', '10'], ans: '9', exp: '6 thêm 3 bằng 9.', hint: 'Từ 6 em đếm tiếp 3 bước: 7, 8, 9!', icon: '🎈' },
      { q: 'Có 10 quả bóng bay 🎈, bay mất 4 quả. Còn lại mấy quả bóng?', opts: ['6 quả', '5 quả', '7 quả'], ans: '6 quả', exp: '10 - 4 = 6 quả.', hint: 'Em lấy 10 trừ đi 4.', icon: '🎈' },
      { q: 'Số bé nhất có một chữ số là số nào?', opts: ['0', '1', '2'], ans: '0', exp: 'Số 0 là số tự nhiên bé nhất.', hint: 'Dãy số tự nhiên bắt đầu từ số 0 em nhé.', icon: '🌱' },
      { q: '5 + 5 bằng bao nhiêu?', opts: ['10', '9', '8'], ans: '10', exp: '5 + 5 = 10, như hai bàn tay của bé!', hint: 'Hai bàn tay em có 10 ngón tay xinh.', icon: '✋' },
    ];
    for (let i = 0; i < Math.min(count, mathTemplates.length); i++) {
      const item = mathTemplates[i];
      list.push({
        id: `fb_math_${i + 1}`,
        question: item.q,
        type: 'multiple_choice',
        options: item.opts,
        correctAnswer: item.ans,
        explanation: item.exp,
        hint: item.hint,
        points: level === 'Mở rộng' ? 5 : 3,
        visualIcon: item.icon,
      });
    }
  } else {
    // Tiếng Việt / Môn khác
    const vietTemplates = [
      { q: 'Từ nào dưới đây chứa âm "b"?', opts: ['Bé', 'Cá', 'Gà'], ans: 'Bé', exp: 'Tiếng "Bé" có âm b đứng trước!', hint: 'Bờ - e - be - sắc - bé.', icon: '👶' },
      { q: 'Tiếng nào dưới đây có vần "an"?', opts: ['Bạn', 'Bát', 'Bóng'], ans: 'Bạn', exp: 'Tiếng "bạn" có âm b và vần an!', hint: 'b - an - ban - nặng - bạn.', icon: '👫' },
      { q: 'Con vật nào gáy "Ò ó o o" đánh thức mọi người vào buổi sáng?', opts: ['Gà trống 🐓', 'Mèo con 🐱', 'Cún con 🐶'], ans: 'Gà trống 🐓', exp: 'Chú gà trống chăm chỉ gáy vang gọi ban mai.', hint: 'Chú có chiếc mào đỏ rực rất đẹp.', icon: '🐓' },
      { q: 'Điền từ còn thiếu vào câu: "Em yêu ... và thầy cô."', opts: ['trường', 'đường', 'xe'], ans: 'trường', exp: 'Em yêu trường và thầy cô!', hint: 'Nơi có lớp 1/2 và cô Tú My thân yêu.', icon: '🏫' },
      { q: 'Từ nào viết đúng chính tả?', opts: ['Cô giáo', 'Coo giáo', 'Cô jáo'], ans: 'Cô giáo', exp: '"Cô giáo" là từ viết chuẩn tiếng Việt.', hint: 'Âm "gi" trong từ cô giáo em nhé.', icon: '👩‍🏫' },
      { q: 'Tiếng "hoa" có vần gì?', opts: ['oa', 'oe', 'ai'], ans: 'oa', exp: 'h - oa - hoa!', hint: 'O - A - OA tròn xoe.', icon: '🌸' },
      { q: 'Khi gặp người lớn, em cần làm gì?', opts: ['Khoanh tay chào lễ phép', 'Chạy đi chỗ khác', 'Không nói gì'], ans: 'Khoanh tay chào lễ phép', exp: 'Bé ngoan luôn chào hỏi lễ phép với ông bà, cha mẹ và thầy cô.', hint: 'Một nét đẹp đạo đức của học sinh lớp 1.', icon: '🙏' },
      { q: 'Cây xanh cần gì để lớn lên?', opts: ['Nước và ánh nắng ☀️', 'Kẹo ngọt 🍬', 'Đồ chơi 🧸'], ans: 'Nước và ánh nắng ☀️', exp: 'Cây cần đất màu, nước tưới và ánh mặt trời ấm áp.', hint: 'Giống như bé Mầm xanh cần tưới nước mỗi ngày.', icon: '🌱' },
      { q: 'Biển báo nào nhắc nhở em đội mũ bảo hiểm khi đi xe máy?', opts: ['Hình chiếc mũ bảo hiểm ⛑️', 'Hình cái thìa', 'Hình chiếc ô'], ans: 'Hình chiếc mũ bảo hiểm ⛑️', exp: 'Đội mũ bảo hiểm bảo vệ an toàn cho đầu của bé.', hint: 'Bé luôn nhớ đội mũ khi bố mẹ chở đi học nhé.', icon: '⛑️' },
      { q: 'Dòng nào là câu hoàn chỉnh?', opts: ['Bé chăm học bài.', 'Bé chăm.', 'Học bài.'], ans: 'Bé chăm học bài.', exp: 'Câu có đầy đủ người và hành động, kết thúc bằng dấu chấm.', hint: 'Câu kể đầy đủ ý về bạn nhỏ.', icon: '📖' },
    ];
    for (let i = 0; i < Math.min(count, vietTemplates.length); i++) {
      const item = vietTemplates[i];
      list.push({
        id: `fb_viet_${i + 1}`,
        question: item.q,
        type: 'multiple_choice',
        options: item.opts,
        correctAnswer: item.ans,
        explanation: item.exp,
        hint: item.hint,
        points: level === 'Mở rộng' ? 5 : 3,
        visualIcon: item.icon,
      });
    }
  }

  return list;
}

// Dev server or static files setup
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MẦM TRÍ TUỆ AI] Server is running on port ${PORT}`);
  });
}

startServer();
