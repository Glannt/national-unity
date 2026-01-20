import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Sample responses about Ho Chi Minh's ideology on national unity
const sampleResponses: Record<string, string> = {
  default: "Xin chào! Tôi là trợ lý AI về Tư tưởng Hồ Chí Minh về Đoàn kết Dân tộc. Bạn có thể hỏi tôi về các dân tộc Việt Nam, lịch sử đoàn kết dân tộc, hoặc tư tưởng Bác Hồ.",
  "đoàn kết": "Theo Chủ tịch Hồ Chí Minh: \"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.\" Đoàn kết dân tộc là truyền thống quý báu và là nguồn sức mạnh vô địch của cách mạng Việt Nam.",
  "dân tộc": "Việt Nam có 54 dân tộc anh em. Mỗi dân tộc đều có bản sắc văn hóa riêng, đóng góp vào sự đa dạng và phong phú của văn hóa Việt Nam. Bác Hồ luôn coi trọng quyền bình đẳng giữa các dân tộc.",
  "bác hồ": "Chủ tịch Hồ Chí Minh (1890-1969) là vị lãnh tụ vĩ đại của dân tộc Việt Nam. Người đã dành cả cuộc đời cho sự nghiệp giải phóng dân tộc và xây dựng khối đại đoàn kết toàn dân.",
  "văn hóa": "Bác Hồ dạy: \"Văn hóa soi đường cho quốc dân đi.\" Người luôn đề cao việc bảo tồn và phát huy bản sắc văn hóa của các dân tộc, coi đó là nguồn lực quan trọng trong sự nghiệp xây dựng đất nước.",
  "bình đẳng": "Tư tưởng Hồ Chí Minh khẳng định: Các dân tộc trong đại gia đình Việt Nam đều bình đẳng về quyền lợi và nghĩa vụ. Không có sự phân biệt đối xử giữa dân tộc đa số và thiểu số.",
};

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(sampleResponses)) {
    if (keyword !== "default" && lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return sampleResponses.default;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! 👋 Tôi là trợ lý AI về Tư tưởng Hồ Chí Minh. Hãy hỏi tôi về đoàn kết dân tộc!",
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
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        )}
      </motion.button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-red-500/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-content1 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-divider"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-content1 text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-content1 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-default-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-default-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-default-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Hỏi về đoàn kết dân tộc..."
                  size="sm"
                  classNames={{
                    inputWrapper: "bg-content2",
                  }}
                />
                <Button
                  isIconOnly
                  color="primary"
                  size="sm"
                  onPress={handleSend}
                  isDisabled={!inputValue.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
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
