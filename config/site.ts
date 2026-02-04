import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openclaw.ai";

export const siteConfig: SiteConfig = {
  name: "OpenClaw",
  tagLine: "Make OpenClaw accessible to everyone",
  description:
    "OpenClaw aggregates installation, model configuration, chat integration, web search, and skills into a guided path.",
  url: BASE_URL,
  authors: [
    {
      name: "OpenClaw",
      url: BASE_URL,
    }
  ],
  creator: "@openclaw",
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  defaultNextTheme: 'system', // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
}
