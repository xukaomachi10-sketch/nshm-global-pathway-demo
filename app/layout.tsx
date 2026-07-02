import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "NSHM Global Pathways",
    template: "%s | NSHM Global Pathways",
  },
  description:
    "International Counseling Office Portal - Trường Ngôi Sao Hoàng Mai",
  applicationName: "NSHM Global Pathways",
  icons: { icon: "/nshm-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#D21235",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
