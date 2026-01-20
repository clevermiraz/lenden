import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/contexts/AppContext";
import "./globals.css";

// Configure Hind Siliguri font with all weights for Bangla text
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "লেনদেন - ডিজিটাল বাকি খাতা",
  description: "আপনার দোকানের বাকি হিসাব সহজ, স্বচ্ছ ও বিশ্বাসযোগ্য করুন। দোকানদার ও গ্রাহক উভয়ই বাকি ও পেমেন্ট নিশ্চিত করে।",
  keywords: ["বাকি খাতা", "লেনদেন", "দোকান", "হিসাব", "বাংলাদেশ", "baki khata", "lenden"],
  authors: [{ name: "Lenden" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3d8b7a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={`${hindSiliguri.className} antialiased`}>
        <AppProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AppProvider>
      </body>
    </html>
  );
}
