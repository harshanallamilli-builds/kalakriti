// import type { Metadata } from "next";
// import { AuthProvider } from "@/context/AuthProvider";
// import { Footer } from "@/components/layout/Footer";
// import { Navbar } from "@/components/layout/Navbar";
// import { MobileNav } from "@/components/layout/MobileNav";
// import { FeedbackModal } from "@/components/ui/FeedbackModal";
// import { Toaster } from "@/components/ui/Toaster";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: {
//     default: "Kalakriti — Indian Handmade Marketplace",
//     template: "%s · Kalakriti",
//   },
//   description:
//     "Discover authentic handmade crafts from independent Indian artisans. Shop pottery, textiles, woodwork, metal craft, and more — or open your studio on Kalakriti.",
//   keywords: ["handmade", "Indian crafts", "artisan marketplace", "pottery", "textiles", "handicrafts", "India"],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html
//       lang="en"
//       className={`h-full antialiased`}
//     >
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         {/* eslint-disable-next-line @next/next/no-page-custom-font */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <style>{`
//           :root {
//             --font-cormorant: 'Cormorant Garamond', Georgia, serif;
//             --font-dm-sans: 'DM Sans', system-ui, sans-serif;
//           }
//         `}</style>
//       </head>
//       <body className="flex min-h-full flex-col">
//         <AuthProvider>
//           <Navbar />
//           {/* pb-16 on mobile reserves space for the sticky bottom nav */}
//           <main className="flex-1 pb-16 md:pb-0">{children}</main>
//           <Footer />
//           <MobileNav />
//           <FeedbackModal />
//           <Toaster />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


// import type { Metadata } from "next";
// import { AuthProvider } from "@/context/AuthProvider";
// import { Footer } from "@/components/layout/Footer";
// import { Navbar } from "@/components/layout/Navbar";
// import { MobileNav } from "@/components/layout/MobileNav";
// import { FeedbackModal } from "@/components/ui/FeedbackModal";
// import { Toaster } from "@/components/ui/Toaster";
// import { LenisProvider } from "@/components/layout/LenisProvider";
// import { MainWrapper } from "@/components/layout/MainWrapper";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: {
//     default: "Kalakriti — Indian Handmade Marketplace",
//     template: "%s · Kalakriti",
//   },
//   description:
//     "Discover authentic handmade crafts from independent Indian artisans. Shop pottery, textiles, woodwork, metal craft, and more — or open your studio on Kalakriti.",
//   keywords: ["handmade", "Indian crafts", "artisan marketplace", "pottery", "textiles", "handicrafts", "India"],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html
//       lang="en"
//       className="h-full antialiased"
//     >
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         {/* eslint-disable-next-line @next/next/no-page-custom-font */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <style>{`
//           :root {
//             --font-cormorant: 'Cormorant Garamond', Georgia, serif;
//             --font-dm-sans: 'DM Sans', system-ui, sans-serif;
//           }
//         `}</style>
//       </head>
//       <body className="flex min-h-full flex-col">
//         <AuthProvider>
//           <LenisProvider>
//             <Navbar />
//             <MainWrapper>{children}</MainWrapper>
//             <Footer />
//             <MobileNav />
//             <FeedbackModal />
//             <Toaster />
//           </LenisProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }



// import type { Metadata } from "next";
// import { AuthProvider } from "@/context/AuthProvider";
// import { Footer } from "@/components/layout/Footer";
// import { Navbar } from "@/components/layout/Navbar";
// import { MobileNav } from "@/components/layout/MobileNav";
// // import { Toaster } from "@/components/ui/Toaster";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: {
//     default: "Kalakriti — Indian Handmade Marketplace",
//     template: "%s · Kalakriti",
//   },
//   description:
//     "Discover authentic handmade crafts from independent Indian artisans. Shop pottery, textiles, woodwork, metal craft, and more — or open your studio on Kalakriti.",
//   keywords: ["handmade", "Indian crafts", "artisan marketplace", "pottery", "textiles", "handicrafts", "India"],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html
//       lang="en"
//       className={`h-full antialiased`}
//     >
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         {/* eslint-disable-next-line @next/next/no-page-custom-font */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <style>{`
//           :root {
//             --font-cormorant: 'Cormorant Garamond', Georgia, serif;
//             --font-dm-sans: 'DM Sans', system-ui, sans-serif;
//           }
//         `}</style>
//       </head>
//       <body className="flex min-h-full flex-col">
//         <AuthProvider>
//           <Navbar />
//           {/* pb-16 on mobile reserves space for the sticky bottom nav */}
//           <main className="flex-1 pb-16 md:pb-0">{children}</main>
//           <Footer />
//           <MobileNav />
//           //           <Toaster />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/Toaster";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { MainWrapper } from "@/components/layout/MainWrapper";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Kalakriti — Indian Handmade Marketplace",
    template: "%s · Kalakriti",
  },
  description:
    "Discover authentic handmade crafts from independent Indian artisans. Shop pottery, textiles, woodwork, metal craft, and more — or open your studio on Kalakriti.",
  keywords: [
    "handmade crafts India",
    "Indian artisan marketplace",
    "buy handmade online India",
    "pottery artisan India",
    "Banarasi weave online",
    "blue pottery Jaipur",
    "dokra craft buy",
    "pattachitra paintings",
    "warli art online",
    "handmade gifts India",
    "independent artisans India",
    "Kalakriti",
  ],
  metadataBase: new URL("https://kalakrithi.vercel.app"),
  openGraph: {
    siteName: "Kalakriti",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/logo.png", width: 400, height: 400, alt: "Kalakriti" }],
  },
  twitter: {
    card: "summary",
    site: "@kalakriti",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
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
          <LenisProvider>
            <Navbar />
            <MainWrapper>{children}</MainWrapper>
            <Analytics />
            <Footer />
            <MobileNav />
            <Toaster />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}