import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { EthnicGroup } from "@/types";

interface EthnicFlipCardProps {
  ethnic: EthnicGroup;
  activeTab: "culture" | "society" | "spirituality";
}

export default function EthnicFlipCard({
  ethnic,
  activeTab,
}: EthnicFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto flip to back when tab changes to show content
  useEffect(() => {
    setIsFlipped(true);
  }, [activeTab]);

  const getTabContent = () => {
    switch (activeTab) {
      case "culture":
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">👘</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">
                  Trang phục
                </h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.costume}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🍜</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Ẩm thực</h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.cuisine}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🗣️</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Ngôn ngữ</h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.language}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎉</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Lễ hội</h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.festivals}
                </p>
              </div>
            </div>
          </div>
        );
      case "society":
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">👨‍👩‍👧‍👦</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Gia đình</h4>
                <p className="text-sm text-default-600">
                  {ethnic.society.family}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📜</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">
                  Phong tục - Luật tục
                </h4>
                <p className="text-sm text-default-600">
                  {ethnic.society.customs}
                </p>
              </div>
            </div>
          </div>
        );
      case "spirituality":
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">🛕</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">
                  Tôn giáo - Tín ngưỡng
                </h4>
                <p className="text-sm text-default-600">
                  {ethnic.spirituality.religion}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🙏</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Thờ cúng</h4>
                <p className="text-sm text-default-600">
                  {ethnic.spirituality.worship}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">
                  Điều kiêng kỵ
                </h4>
                <p className="text-sm text-default-600">
                  {ethnic.spirituality.taboos}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "culture":
        return "🎭 Văn hóa";
      case "society":
        return "👥 Xã hội";
      case "spirituality":
        return "🙏 Tâm linh";
    }
  };

  return (
    <div
      className="relative w-full h-[320px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        className="relative w-full h-full"
        initial={false}
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      >
        {/* Front Side - Image */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          {ethnic.image ? (
            <div className="relative w-full h-full">
              <img
                alt={`Dân tộc ${ethnic.name}`}
                className="w-full h-full object-cover"
                src={ethnic.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  Dân tộc {ethnic.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {ethnic.provinces.slice(0, 2).join(", ")}
                  {ethnic.provinces.length > 2 && "..."}
                </p>
                <p className="text-primary-300 text-xs mt-2 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Click để xem {getTabTitle()}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex flex-col items-center justify-center p-4">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-4xl">👘</span>
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-1">
                Dân tộc {ethnic.name}
              </h3>

              <p className="text-default-500 text-center text-sm mb-2">
                {ethnic.provinces.slice(0, 2).join(", ")}
                {ethnic.provinces.length > 2 && "..."}
              </p>

              <p className="text-primary text-xs flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Click để xem {getTabTitle()}
              </p>
            </div>
          )}
        </div>

        {/* Back Side - Content based on tab */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden p-4 bg-gradient-to-br from-content1 to-content2 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-divider">
              <h3 className="text-lg font-bold text-foreground">
                {getTabTitle()}
              </h3>
              <span className="text-sm text-default-400">- {ethnic.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {getTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-2 border-t border-divider mt-2">
              <p className="text-xs text-default-400 text-center flex items-center justify-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Click để xem hình ảnh
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
