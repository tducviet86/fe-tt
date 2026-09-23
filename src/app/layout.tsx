import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SupportDrawer } from "@/components/commercial/support-drawer";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  ),
  title: { default: "ABC Apartment Đà Nẵng", template: "%s | ABC Apartment" },
  description:
    "Căn hộ dịch vụ riêng tư tại Đà Nẵng — đầy đủ tiện nghi, đặt trực tiếp và hỗ trợ tận tâm.",
  openGraph: {
    title: "ABC Apartment Đà Nẵng",
    description: "Your private stay in Da Nang",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "ABC Apartment Đà Nẵng" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABC Apartment Đà Nẵng",
    description: "Your private stay in Da Nang",
    images: ["/og.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <ToastProvider>
          {children}
          <SupportDrawer />
        </ToastProvider>
      </body>
    </html>
  );
}
