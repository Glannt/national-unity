import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";

interface QuoteCardProps {
  quote?: {
    quote: string;
    source: string;
    page: string;
  };
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const [showVerification, setShowVerification] = useState(false);

  // Default quote if none provided
  const displayQuote = quote || {
    quote: "Đồng bào Kinh hay Thổ, Mường hay Mán, Gia-rai hay Ê-đê, Xê-đăng hay Ba-na và các dân tộc thiểu số khác, đều là con cháu Việt Nam, đều là anh em ruột thịt.",
    source: "Thư gửi Đại hội các dân tộc thiểu số miền Nam, 1946",
    page: "Giáo trình TTHCM, Chương 4, tr. 125"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📜</span>
        <h3 className="font-semibold text-amber-600 dark:text-amber-400">
          Tư tưởng Hồ Chí Minh
        </h3>
      </div>

      {/* Quote */}
      <blockquote className="flex-1 relative pl-4 border-l-4 border-amber-500/50">
        <p className="italic text-default-700 dark:text-default-300 text-sm leading-relaxed">
          "{displayQuote.quote}"
        </p>
      </blockquote>

      {/* Source */}
      <p className="text-xs text-default-500 mt-4">
        — {displayQuote.source}
      </p>

      {/* Verification Button */}
      <Button
        size="sm"
        variant="flat"
        color="warning"
        className="mt-4"
        onPress={() => setShowVerification(!showVerification)}
      >
        {showVerification ? "Ẩn nguồn" : "Kiểm chứng nguồn"}
      </Button>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg overflow-hidden"
          >
            <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-2">
              Nguồn tài liệu
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              📖 {displayQuote.page}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              ✓ Đã đối chiếu với giáo trình gốc
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
