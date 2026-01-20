import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";

import EthnicFlipCard from "./EthnicFlipCard";
import QuoteCard from "./QuoteCard";

import { EthnicGroup } from "@/types";

interface EthnicDetailPanelProps {
  ethnics: EthnicGroup[];
  selectedEthnic: EthnicGroup | null;
  onClose: () => void;
  onSelectEthnic: (ethnic: EthnicGroup) => void;
}

export default function EthnicDetailPanel({
  ethnics,
  selectedEthnic,
  onClose,
  onSelectEthnic,
}: EthnicDetailPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "culture" | "society" | "spirituality"
  >("culture");

  // Sync currentIndex with selectedEthnic
  useEffect(() => {
    if (selectedEthnic) {
      const index = ethnics.findIndex((e) => e.id === selectedEthnic.id);

      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedEthnic, ethnics]);

  const currentEthnic = ethnics[currentIndex] || selectedEthnic;

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? ethnics.length - 1 : currentIndex - 1;

    setCurrentIndex(newIndex);
    onSelectEthnic(ethnics[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex === ethnics.length - 1 ? 0 : currentIndex + 1;

    setCurrentIndex(newIndex);
    onSelectEthnic(ethnics[newIndex]);
  };

  if (!currentEthnic) return null;

  return (
    <motion.div
      animate={{ scale: 1, opacity: 1 }}
      className="h-full bg-gradient-to-br from-content1 to-content2 rounded-xl p-6 shadow-2xl overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }}
    >
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <motion.h2
            key={currentEthnic.id}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ y: -20, opacity: 0 }}
          >
            Dân tộc {currentEthnic.name}
          </motion.h2>
          <p className="text-default-500 text-sm mt-1">
            Dân số: {currentEthnic.population.toLocaleString("vi-VN")} người
          </p>
        </div>
        <Button
          isIconOnly
          className="shrink-0"
          color="danger"
          size="lg"
          variant="flat"
          onPress={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      {/* Carousel Navigation - Show when multiple ethnics */}
      {ethnics.length > 1 && (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-4 p-3 bg-default-100 rounded-xl"
          initial={{ opacity: 0 }}
        >
          <Button
            color="primary"
            size="sm"
            variant="flat"
            onPress={handlePrevious}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 19.5L8.25 12l7.5-7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Trước
          </Button>

          <div className="flex items-center gap-2">
            {ethnics.map((ethnic, idx) => (
              <button
                key={ethnic.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-default-300 hover:bg-default-400"
                }`}
                onClick={() => {
                  setCurrentIndex(idx);
                  onSelectEthnic(ethnic);
                }}
              />
            ))}
          </div>

          <Button color="primary" size="sm" variant="flat" onPress={handleNext}>
            Tiếp
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </motion.div>
      )}

      {/* Info Banner for multiple ethnics */}
      {ethnics.length > 1 && (
        <div className="mb-4 p-2 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-primary">
            📍 Vùng này có <strong>{ethnics.length} dân tộc</strong> sinh sống.
            Sử dụng carousel để xem.
          </p>
        </div>
      )}

      {/* Main Content - Reversed Layout (Quote left, FlipCard right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side: Quote Card (1/3) */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <QuoteCard quote={currentEthnic.hoChiMinhQuote} />
        </div>

        {/* Right Side: Flip Card + Tabs (2/3) */}
        <div className="lg:col-span-2 space-y-3 order-1 lg:order-2">
          {/* Tab Navigation */}
          <div className="flex gap-2 flex-wrap">
            {(["culture", "society", "spirituality"] as const).map((tab) => (
              <Button
                key={tab}
                className="flex-1 min-w-[80px]"
                color={activeTab === tab ? "primary" : "default"}
                size="sm"
                variant={activeTab === tab ? "solid" : "flat"}
                onPress={() => setActiveTab(tab)}
              >
                {tab === "culture" && "🎭 Văn hóa"}
                {tab === "society" && "👥 Xã hội"}
                {tab === "spirituality" && "🙏 Tâm linh"}
              </Button>
            ))}
          </div>

          {/* Flip Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentEthnic.id}-${activeTab}`}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              initial={{ opacity: 0, rotateY: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EthnicFlipCard activeTab={activeTab} ethnic={currentEthnic} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* History Section */}
      <motion.div
        key={`history-${currentEthnic.id}`}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 p-4 bg-default-100 rounded-xl"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <span>📜</span> Lịch sử
        </h3>
        <p className="text-default-600 text-sm">{currentEthnic.history}</p>
      </motion.div>

      {/* Provinces Tags */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-default-500 mb-2">
          Phân bố địa lý:
        </h4>
        <div className="flex flex-wrap gap-2">
          {currentEthnic.provinces.map((province) => (
            <motion.span
              key={province}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              initial={{ scale: 0.8, opacity: 0 }}
            >
              📍 {province}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
