import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import connectionsData from "@/data/connections.json";
import { ConnectionThread } from "@/types";

export default function ConnectionThreads() {
  const [selectedThread, setSelectedThread] = useState<ConnectionThread | null>(null);

  return (
    <div className="py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
          Sợi Dây Kết Nối
        </h1>
        <p className="text-default-500 mt-2 max-w-2xl mx-auto">
          Mạng lưới tư tưởng xuyên suốt của Chủ tịch Hồ Chí Minh về đoàn kết dân tộc
        </p>
      </motion.div>

      {/* Topic Selection */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {(connectionsData as ConnectionThread[]).map((thread) => (
          <motion.div
            key={thread.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              variant={selectedThread?.id === thread.id ? "solid" : "bordered"}
              color={selectedThread?.id === thread.id ? "warning" : "default"}
              onPress={() => setSelectedThread(selectedThread?.id === thread.id ? null : thread)}
              className="min-w-[150px]"
            >
              {thread.title}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Selected Thread Content */}
      <AnimatePresence mode="wait">
        {selectedThread && (
          <motion.div
            key={selectedThread.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            {/* Main Content Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">
                {selectedThread.title}
              </h2>
              <p className="text-default-600 mb-6">{selectedThread.description}</p>

              {/* Quote */}
              <blockquote className="pl-6 border-l-4 border-amber-500 bg-amber-500/10 p-4 rounded-r-xl">
                <p className="italic text-lg text-default-700 dark:text-default-300">
                  "{selectedThread.quote}"
                </p>
                <footer className="text-sm text-default-500 mt-2">
                  — {selectedThread.source}
                </footer>
              </blockquote>
            </div>

            {/* Regions Grid with Connection Lines */}
            <div className="relative">
              {/* Connection Lines SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Regions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {selectedThread.regions.map((region, index) => (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-content1 rounded-xl p-6 shadow-lg border-2 border-amber-500/30 hover:border-amber-500 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                        📍
                      </div>
                      <h3 className="font-bold text-lg">{region.name}</h3>
                    </div>
                    <p className="text-default-500 text-sm">{region.note}</p>

                    {/* Connection line indicator */}
                    {index < selectedThread.regions.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-amber-500 to-transparent origin-left"
                        style={{ transform: "translateY(-50%)" }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Connection Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-3 h-3 rounded-full bg-amber-500"
                />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Các vùng được kết nối bởi tư tưởng Hồ Chí Minh
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="w-3 h-3 rounded-full bg-amber-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!selectedThread && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔗</div>
          <p className="text-default-500">
            Chọn một chủ đề để xem mạng lưới kết nối
          </p>
        </motion.div>
      )}
    </div>
  );
}
