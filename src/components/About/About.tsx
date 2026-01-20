import { motion } from "framer-motion";
import { TeamMember } from "@/types";

// Demo team data - placeholder
const teamMembers: TeamMember[] = [
  { id: 1, name: "Thành viên 1", role: "Team Leader", email: "tv1@example.com", image: "" },
  { id: 2, name: "Thành viên 2", role: "Developer", email: "tv2@example.com", image: "" },
  { id: 3, name: "Thành viên 3", role: "Designer", email: "tv3@example.com", image: "" },
  { id: 4, name: "Thành viên 4", role: "Content Writer", email: "tv4@example.com", image: "" },
  { id: 5, name: "Thành viên 5", role: "Researcher", email: "tv5@example.com", image: "" },
  { id: 6, name: "Thành viên 6", role: "Developer", email: "tv6@example.com", image: "" },
  { id: 7, name: "Thành viên 7", role: "QA Tester", email: "tv7@example.com", image: "" },
  { id: 8, name: "Thành viên 8", role: "Presenter", email: "tv8@example.com", image: "" },
];

const references = [
  {
    id: 1,
    title: "Giáo trình Tư tưởng Hồ Chí Minh",
    author: "Bộ Giáo dục và Đào tạo",
    publisher: "NXB Chính trị Quốc gia Sự thật",
    year: 2021,
  },
  {
    id: 2,
    title: "Hồ Chí Minh toàn tập (15 tập)",
    author: "Hồ Chí Minh",
    publisher: "NXB Chính trị Quốc gia",
    year: 2011,
  },
  {
    id: 3,
    title: "Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc",
    author: "Viện Hồ Chí Minh",
    publisher: "NXB Chính trị Quốc gia",
    year: 2015,
  },
  {
    id: 4,
    title: "Các dân tộc thiểu số Việt Nam thế kỷ XX",
    author: "Viện Dân tộc học",
    publisher: "NXB Khoa học xã hội",
    year: 2018,
  },
];

export default function About() {
  return (
    <div className="py-12 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
          Nhóm Thực Hiện
        </h1>
        <p className="text-default-500 mt-2">
          Dự án môn học HCM202 - Tư tưởng Hồ Chí Minh
        </p>
      </motion.div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-content1 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {member.name.charAt(0)}
            </div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-primary">{member.role}</p>
            <p className="text-xs text-default-400 mt-1">{member.email}</p>
          </motion.div>
        ))}
      </div>

      {/* Academic Integrity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 mb-16"
      >
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
          <span>📜</span> Cam Kết Học Thuật
        </h2>
        <div className="space-y-4 text-default-600">
          <p>
            Nhóm chúng tôi cam kết tuân thủ các nguyên tắc liêm chính học thuật trong quá trình thực hiện dự án:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Toàn bộ nội dung được trích dẫn từ nguồn chính thống và có kiểm chứng</li>
            <li>Sử dụng công cụ AI có trách nhiệm và minh bạch (xem AI_USAGE.md)</li>
            <li>Nội dung AI sinh ra đều được thành viên nhóm duyệt và xác nhận</li>
            <li>Tất cả trích dẫn đều có ghi nguồn rõ ràng</li>
          </ul>
        </div>
      </motion.div>

      {/* References */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📚</span> Tài Liệu Tham Khảo
        </h2>
        <div className="space-y-4">
          {references.map((ref, index) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-content1 rounded-xl p-4 flex items-start gap-4 hover:bg-content2 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold">{ref.title}</h3>
                <p className="text-sm text-default-500">
                  {ref.author} • {ref.publisher}, {ref.year}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
