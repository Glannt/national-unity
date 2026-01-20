import { useState } from "react";
import { motion } from "framer-motion";
import timelineData from "@/data/timeline.json";
import { TimelineEvent } from "@/types";

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
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
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* Content Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              className={`w-5/12 cursor-pointer ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
            >
              <div
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
                  selectedEvent?.id === event.id
                    ? "bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary"
                    : "bg-content1 hover:bg-content2"
                }`}
              >
                <span className="text-sm font-bold text-primary">{event.year}</span>
                <h3 className="text-lg font-bold mt-1">{event.title}</h3>
                <p className="text-sm text-default-500 mt-2 line-clamp-2">{event.description}</p>
              </div>
            </motion.div>

            {/* Year Marker */}
            <div className="w-2/12 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.3 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 ${
                  selectedEvent?.id === event.id
                    ? "bg-gradient-to-br from-primary to-secondary ring-4 ring-primary/30"
                    : "bg-gradient-to-br from-default-400 to-default-600"
                }`}
              >
                {event.year.toString().slice(-2)}
              </motion.div>
            </div>

            {/* Spacer */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>

      {/* Selected Event Detail */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-8 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/30"
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {selectedEvent.year}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <p className="text-default-600 mt-3">{selectedEvent.description}</p>
              <blockquote className="mt-4 pl-4 border-l-4 border-primary italic text-default-500">
                "{selectedEvent.quote}"
              </blockquote>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedEvent.relatedRegions.map((region) => (
                  <span
                    key={region}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
