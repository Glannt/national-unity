import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { ChatBot } from "@/components/ChatBot";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-background to-content2">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-8">
        {children}
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-6 gap-2 border-t border-divider mt-8">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇻🇳</span>
          <span className="font-semibold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Đoàn Kết Dân Tộc
          </span>
        </div>
        <p className="text-sm text-default-500">
          Dự án môn học HCM202 - Tư tưởng Hồ Chí Minh
        </p>
        <Link
          isExternal
          className="flex items-center gap-1 text-xs text-default-400"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span>Powered by</span>
          <span className="text-primary">HeroUI</span>
        </Link>
      </footer>
      
      {/* Global ChatBot - appears on all pages */}
      <ChatBot />
    </div>
  );
}
