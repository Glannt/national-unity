import { useState } from "react";
import { motion } from "framer-motion";

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

  const getTabContent = () => {
    switch (activeTab) {
      case "culture":
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👘</span>
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
              <span className="text-2xl">🍜</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Ẩm thực</h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.cuisine}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗣️</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Ngôn ngữ</h4>
                <p className="text-sm text-default-600">
                  {ethnic.culture.language}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
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
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Gia đình</h4>
                <p className="text-sm text-default-600">
                  {ethnic.society.family}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📜</span>
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
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛕</span>
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
              <span className="text-2xl">🙏</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">Thờ cúng</h4>
                <p className="text-sm text-default-600">
                  {ethnic.spirituality.worship}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
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
      className="relative w-full min-h-[320px] cursor-pointer"
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
        {/* Front Side - Image Placeholder */}
        <div
          className="absolute inset-0 w-full rounded-xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex flex-col items-center justify-center p-6">
            {/* Ethnic Avatar */}
            <motion.div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-5xl">👘</span>
            </motion.div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              Dân tộc {ethnic.name}
            </h3>

            <p className="text-default-500 text-center mb-4">
              {ethnic.provinces.slice(0, 3).join(", ")}
              {ethnic.provinces.length > 3 && "..."}
            </p>

            <div className="flex items-center gap-2 text-sm text-primary">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Click để xem thông tin {getTabTitle()}</span>
            </div>
          </div>
        </div>

        {/* Back Side - Content based on tab */}
        <div
          className="absolute inset-0 w-full rounded-xl overflow-hidden p-5 bg-gradient-to-br from-content1 to-content2 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-divider">
              <h3 className="text-xl font-bold text-foreground">
                {getTabTitle()}
              </h3>
              <span className="text-sm text-default-400">- {ethnic.name}</span>
            </div>

            {getTabContent()}

            <div className="mt-4 pt-3 border-t border-divider">
              <p className="text-xs text-default-400 text-center flex items-center justify-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Click để xem mặt trước
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
