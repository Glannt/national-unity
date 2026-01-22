import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { ChatBot } from "@/components/ChatBot";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="relative flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/background/back_ground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay để nội dung dễ đọc hơn */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] px-3 md:px-6 flex-grow pt-8">
          {children}
        </main>
        <footer className="w-full flex flex-col items-center justify-center py-6 gap-2 border-t border-divider mt-8 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇻🇳</span>
            <span className="font-semibold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Đoàn Kết Dân Tộc
            </span>
          </div>
          <p className="text-sm text-default-400">
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
    </div>
  );
}
