import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kalakriti — Indian Handmade Marketplace",
    template: "%s · Kalakriti",
  },
  description:
    "Discover authentic handmade crafts from independent Indian artisans. Shop pottery, textiles, woodwork, metal craft, and more — or open your studio on Kalakriti.",
  keywords: ["handmade", "Indian crafts", "artisan marketplace", "pottery", "textiles", "handicrafts", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            --font-dm-sans: 'DM Sans', system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Navbar />
          {/* pb-16 on mobile reserves space for the sticky bottom nav */}
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
          <FeedbackModal />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
