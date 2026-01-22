import { useState } from "react";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";

import timelineData from "@/data/timeline.json";
import { TimelineEvent } from "@/types";

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <div className="py-12">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Trục Thời Gian Đoàn Kết
        </h1>
        <p className="text-default-500 mt-2 max-w-2xl mx-auto">
          Hành trình đoàn kết dân tộc trong lịch sử cách mạng Việt Nam
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary rounded-full" />

        {/* Events */}
        {(timelineData as TimelineEvent[]).map((event, index) => (
          <motion.div
            key={event.id}
            className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            {/* Content Card */}
            <motion.div
              className={`w-5/12 cursor-pointer ${
                index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleEventClick(event)}
            >
              <div className="p-6 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-content1 hover:bg-white dark:hover:bg-content2 hover:shadow-xl">
                <span className="text-sm font-bold text-red-600 dark:text-primary">
                  {event.year}
                </span>
                <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-default-400 mt-2 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </motion.div>

            {/* Year Marker */}
            <div className="w-2/12 flex justify-center">
              {/* Special styling for 1945 - Vietnam flag style */}
              {String(event.year) === "1945" ? (
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-lg ring-4 ring-yellow-400/50 cursor-pointer"
                  style={{ backgroundColor: "#da251d" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  onClick={() => handleEventClick(event)}
                >
                  <span className="text-yellow-400 text-2xl">★</span>
                </motion.div>
              ) : (
                <motion.div
                  className="min-w-12 h-12 px-2 rounded-full flex items-center justify-center text-white font-bold text-xs z-10 bg-gradient-to-br from-default-400 to-default-600 cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleEventClick(event)}
                >
                  {/* Hiển thị năm ngắn gọn */}
                  {(() => {
                    const yearStr = String(event.year);
                    const yearMatch = yearStr.match(/\d{4}/);

                    if (yearMatch) {
                      return "'" + yearMatch[0].slice(-2);
                    }

                    return yearStr.slice(0, 4);
                  })()}
                </motion.div>
              )}
            </div>

            {/* Spacer */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>

      {/* HeroUI Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-content1",
          header: "border-b border-divider",
          body: "py-6",
          footer: "border-t border-divider",
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {selectedEvent && (
                <>
                  {/* Custom Header with gradient */}
                  <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-red-600 to-red-700 dark:from-primary dark:to-secondary text-white rounded-t-lg">
                    <div className="flex items-center gap-4">
                      {String(selectedEvent.year) === "1945" ? (
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-2 ring-yellow-400 shrink-0"
                          style={{ backgroundColor: "#da251d" }}
                        >
                          <span className="text-yellow-400 text-2xl">★</span>
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                          {(() => {
                            const yearStr = String(selectedEvent.year);
                            const yearMatch = yearStr.match(/\d{4}/);

                            if (yearMatch) {
                              return "'" + yearMatch[0].slice(-2);
                            }

                            return yearStr.slice(0, 4);
                          })()}
                        </div>
                      )}
                      <div>
                        <p className="text-white/80 text-sm font-medium">
                          {selectedEvent.year}
                        </p>
                        <h2 className="text-xl font-bold text-white">
                          {selectedEvent.title}
                        </h2>
                      </div>
                    </div>
                  </ModalHeader>

                  <ModalBody>
                    {/* Description */}
                    <p className="text-gray-700 dark:text-default-300 text-base leading-relaxed">
                      {selectedEvent.description}
                    </p>

                    {/* Quote */}
                    <blockquote className="mt-4 p-4 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-primary/10 dark:to-secondary/10 rounded-xl border-l-4 border-red-600 dark:border-primary">
                      <p className="italic text-gray-700 dark:text-default-400">
                        &ldquo;{selectedEvent.quote}&rdquo;
                      </p>
                      <p className="text-right mt-2 text-sm text-gray-500 dark:text-default-500">
                        — Chủ tịch Hồ Chí Minh
                      </p>
                    </blockquote>

                    {/* Location */}
                    {selectedEvent.location && (
                      <div className="mt-4 flex items-center gap-3 p-4 bg-gray-100 dark:bg-content2 rounded-xl">
                        <span className="text-2xl">📍</span>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-default-500">
                            Địa điểm
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedEvent.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Related Regions */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-default-500 mb-3">
                        Vùng liên quan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.relatedRegions.map((region) => (
                          <span
                            key={region}
                            className="px-3 py-1.5 bg-red-100 dark:bg-primary/20 text-red-700 dark:text-primary rounded-full text-sm font-medium"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      className="w-full"
                      color="danger"
                      variant="flat"
                      onPress={onClose}
                    >
                      Đóng
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
