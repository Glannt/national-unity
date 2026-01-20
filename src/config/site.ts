export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Đoàn Kết Dân Tộc",
  description: "Tư tưởng Hồ Chí Minh về Đoàn kết Dân tộc - Interactive Website",
  navItems: [
    {
      label: "Bản đồ Dân tộc",
      href: "/",
    },
    {
      label: "Trục thời gian",
      href: "/timeline",
    },
    {
      label: "Sợi dây kết nối",
      href: "/connections",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Bản đồ Dân tộc",
      href: "/",
    },
    {
      label: "Trục thời gian",
      href: "/timeline",
    },
    {
      label: "Sợi dây kết nối",
      href: "/connections",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com",
    docs: "https://heroui.com",
  },
};
