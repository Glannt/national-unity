import { motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { EthnicMap } from "@/components/EthnicMap";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col gap-4 py-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Đoàn Kết Dân Tộc
            </span>
          </h1>
          <p className="text-xl text-default-500 mt-3 max-w-2xl mx-auto">
            Tư tưởng Hồ Chí Minh về Đoàn kết các Dân tộc Việt Nam
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-default-400 mt-2"
          >
            Nhấn vào các điểm trên bản đồ để khám phá
          </motion.p>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EthnicMap />
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
