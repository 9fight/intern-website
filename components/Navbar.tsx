"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Clock,
  Image as ImageIcon,
  FileText
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // -----------------------------------------------------
  // 💡 เช็คว่ากำลังอยู่หน้า Detail หรือไม่ (เช่น /timesheet/1)
  // ถ้า pathname เริ่มด้วย "/timesheet/" และไม่ใช่ "/timesheet" เฉยๆ
  const isTimesheetDetail = pathname.startsWith("/timesheet/") && pathname !== "/timesheet";

  // ถ้าใช่หน้า Detail ให้ซ่อน Navbar โดยการ return null ทิ้งไปเลย
  if (isTimesheetDetail) {
    return null;
  }
  // -----------------------------------------------------

  // States สำหรับ Desktop
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // States สำหรับ Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ปิดเมนูมือถืออัตโนมัติเมื่อมีการเปลี่ยนหน้า
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // เพิ่ม icon เข้าไปใน Object
  const navItems = [
    { name: "หน้าแรก", path: "/", icon: Home },
    { name: "เวลาปฏิบัติงาน", path: "/timesheet", icon: Clock },
    { name: "ภาพถ่าย", path: "/gallery", icon: ImageIcon },
    { name: "รายงาน", path: "/reports", icon: FileText },
  ];

  return (
    <>
      {/* --- ตัวแคปซูล Navbar หลัก (Glassmorphism สไตล์ iOS) --- */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50 w-auto flex justify-center items-center px-3 py-2 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        {/* =========================================
            DESKTOP MENU (แสดงเฉพาะจอใหญ่ md ขึ้นไป)
        ========================================= */}
        <div className="hidden md:flex gap-1 md:gap-2 text-sm font-medium relative">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            const isHovered = item.path === hoveredPath;
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <Link
                  href={item.path}
                  className={`relative px-5 py-2.5 rounded-full transition-colors duration-300 flex items-center gap-2 ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-zinc-900 rounded-full z-0 shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 bg-zinc-100/80 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  {/* Icon & Text */}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* =========================================
            MOBILE HEADER (แสดงเฉพาะจอเล็ก)
        ========================================= */}
        <div className="md:hidden flex items-center justify-center px-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-zinc-700 flex items-center justify-center transition-transform active:scale-90 rounded-full hover:bg-zinc-100"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* =========================================
          MOBILE MENU OVERLAY (แสดงตอนกด Hamburger)
      ========================================= */}
      <AnimatePresence >
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 w-[92%] bg-white/80 backdrop-blur-3xl backdrop-saturate-150 border border-white/50 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-3 flex flex-col md:hidden max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => {
              const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-4 rounded-2xl text-base font-medium transition-all flex items-center gap-3 ${isActive
                    ? "bg-zinc-900 text-white shadow-md"
                    : "hover:bg-zinc-100 text-zinc-600 active:bg-zinc-200"
                    }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-zinc-500"} />
                  {item.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}