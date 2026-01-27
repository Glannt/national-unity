import { motion } from "framer-motion";

import { TeamMember } from "@/types";

// Demo team data - placeholder
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Võ Ánh Xuân",
    role: "Content Writer",
    email: "SS180749",
    image: "/anh_PBL_profile/anh_xuan.jpg",
  },
  {
    id: 2,
    name: "Tống Nguyễn Thành Đô",
    role: "Developer",
    email: "SE181697",
    image: "/anh_PBL_profile/do.jpg",
  },
  {
    id: 3,
    name: "Nguyễn Hoàng Đức Minh",
    role: "Developer",
    email: "SE181549",
    image: "/anh_PBL_profile/minh.jpg",
  },
  {
    id: 4,
    name: "Phan Thị Mỹ Linh",
    role: "Content Writer",
    email: "SS180602",
    image: "/anh_PBL_profile/my_linh.jpg",
  },
  {
    id: 5,
    name: "Nguyễn Phúc Nhật Nguyên",
    role: "Content Writer",
    email: "SS180586",
    image: "/anh_PBL_profile/nhat_nguyen.jpg",
  },
  {
    id: 6,
    name: "Nguyễn Lê Thảo Nguyên",
    role: "Content Writer",
    email: "SS180623",
    image: "/anh_PBL_profile/thao_nguyen.jpg",
  },
  {
    id: 7,
    name: "Nguyễn Minh Thư Kỳ",
    role: "Social Media",
    email: "SS180817",
    image: "/anh_PBL_profile/thu_ky.jpg",
  },
  {
    id: 8,
    name: "Lê Thị Thanh Trúc",
    role: "Social Media",
    email: "SE170367",
    image: "/anh_PBL_profile/truc.jpg",
  },
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
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
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
            animate={{ opacity: 1, scale: 1 }}
            className="bg-content1 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20">
              {member.image ? (
                <img
                  alt={member.name}
                  className="w-full h-full object-cover"
                  src={member.image}
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-primary">{member.role}</p>
            <p className="text-xs text-default-700 mt-1">{member.email}</p>
          </motion.div>
        ))}
      </div>

      {/* Academic Integrity */}
      <motion.div
        className="bg-gradient-to-br from-blue-500/30 to-yellow-500/50 border border-blue-500/30 rounded-2xl p-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-cyan-400 dark:text-cyan-400 mb-4 flex items-center gap-2">
          <span>📜</span> Cam Kết Học Thuật
        </h2>
        <div className="space-y-4 text-default-100 dark:text-black">
          <p>
            Nhóm chúng tôi cam kết tuân thủ các nguyên tắc liêm chính học thuật
            trong quá trình thực hiện dự án:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Toàn bộ nội dung được trích dẫn từ nguồn chính thống và có kiểm
              chứng
            </li>
            <li>
              Sử dụng công cụ AI có trách nhiệm và minh bạch (xem AI_USAGE.md)
            </li>
            <li>
              Nội dung AI sinh ra đều được thành viên nhóm duyệt và xác nhận
            </li>
            <li>Tất cả trích dẫn đều có ghi nguồn rõ ràng</li>
          </ul>
        </div>
      </motion.div>

      {/* References */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📚</span> Tài Liệu Tham Khảo
        </h2>
        <div className="space-y-4">
          {references.map((ref, index) => (
            <motion.div
              key={ref.id}
              className="bg-content1 rounded-xl p-4 flex items-start gap-4 hover:bg-content2 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
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
