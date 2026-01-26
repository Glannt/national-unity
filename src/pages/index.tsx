import { motion } from "framer-motion";

import DefaultLayout from "@/layouts/default";
import { EthnicMap } from "@/components/EthnicMap";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col gap-4 py-4">
        {/* Hero Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Đoàn Kết Dân Tộc
            </span>
          </h1>
          <p className="text-xl text-default mt-3 max-w-2xl mx-auto">
            Tư tưởng Hồ Chí Minh về Đoàn kết các Dân tộc Việt Nam
          </p>
          <motion.p
            animate={{ opacity: 1 }}
            className="text-md text-default-300 mt-2"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Nhấn vào các điểm trên bản đồ để khám phá
          </motion.p>
        </motion.div>

        {/* Map Section */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EthnicMap />
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
