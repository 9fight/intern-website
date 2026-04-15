import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
// import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Internship Website",
  description: "รายงานผลการฝึกประสบการณ์วิชาชีพ...",
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="...">
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children} {/* ลบ <Navbar /> ออกจากบรรทัดนี้ */}
      </body>
    </html>
  );
}
