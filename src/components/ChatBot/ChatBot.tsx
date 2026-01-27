import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Gemini API configuration using SDK
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const SYSTEM_PROMPT = `Bạn là một trợ lý AI chuyên về Tư tưởng Hồ Chí Minh về Đoàn kết Dân tộc. 
Nhiệm vụ của bạn là:
1. Trả lời các câu hỏi về tư tưởng đoàn kết dân tộc của Chủ tịch Hồ Chí Minh
2. Cung cấp thông tin về 54 dân tộc Việt Nam và sự đa dạng văn hóa
3. Chia sẻ các câu nói nổi tiếng của Bác Hồ về đoàn kết
4. Giải thích ý nghĩa của khối đại đoàn kết toàn dân tộc
5. Hướng dẫn về lịch sử và truyền thống đoàn kết của dân tộc Việt Nam

Quy tắc trả lời:
- Trả lời bằng tiếng Việt, thân thiện và dễ hiểu
- Đưa ra các trích dẫn từ Bác Hồ nếu phù hợp
- Giữ câu trả lời ngắn gọn nhưng đầy đủ thông tin
- Nếu câu hỏi không liên quan đến chủ đề, hãy nhẹ nhàng hướng người dùng về chủ đề chính`;

interface ChatHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

async function callGeminiAPI(
  userMessage: string,
  chatHistory: ChatHistoryItem[],
): Promise<string> {
  try {
    // Check if API key is configured
    if (!ai || !GEMINI_API_KEY) {
      return "⚠️ API Key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env";
    }

    // Build conversation context
    const conversationContext = chatHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.parts[0].text}`,
      )
      .join("\n");

    const fullPrompt = conversationContext
      ? `${SYSTEM_PROMPT}\n\nLịch sử cuộc trò chuyện:\n${conversationContext}\n\nNgười dùng: ${userMessage}\n\nTrợ lý:`
      : `${SYSTEM_PROMPT}\n\nNgười dùng: ${userMessage}\n\nTrợ lý:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return (
      response.text ||
      "Xin lỗi, tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại!"
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Gemini API error:", error);

    return "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau!";
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào! 👋 Tôi là trợ lý AI về Tư tưởng Hồ Chí Minh. Hãy hỏi tôi về đoàn kết dân tộc!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;

    setInputValue("");
    setIsTyping(true);

    try {
      // Build chat history for context
      const chatHistory: ChatHistoryItem[] = messages
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

      // Call Gemini API
      const responseText = await callGeminiAPI(currentInput, chatHistory);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="white"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-red-500/30"
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-content1 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-divider"
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🇻🇳</span>
                </div>
                <div>
                  <h3 className="font-bold">Trợ lý Đoàn Kết</h3>
                  <p className="text-xs opacity-80">Tư tưởng Hồ Chí Minh</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-content2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-content1 text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    <p className="text-[10px] opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                >
                  <div className="bg-content1 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        className="w-2 h-2 bg-default-400 rounded-full"
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        className="w-2 h-2 bg-default-400 rounded-full"
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: 0.1,
                        }}
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        className="w-2 h-2 bg-default-400 rounded-full"
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-divider bg-content1">
              <div className="flex gap-2">
                <Input
                  classNames={{
                    inputWrapper: "bg-content2",
                  }}
                  placeholder="Hỏi về đoàn kết dân tộc..."
                  size="sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  isIconOnly
                  color="primary"
                  isDisabled={!inputValue.trim()}
                  size="sm"
                  onPress={handleSend}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
              <p className="text-[10px] text-default-400 mt-2 text-center">
                💡 Thử hỏi: "Bác Hồ nói gì về đoàn kết?"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
