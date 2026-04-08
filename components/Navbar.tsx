"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // เอา ChevronDown ออกเพราะไม่ได้ใช้แล้ว

export default function Navbar() {
  const pathname = usePathname();

  // States สำหรับ Desktop
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // States สำหรับ Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ปิดเมนูมือถืออัตโนมัติเมื่อมีการเปลี่ยนหน้า
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // เอา subItems ออกจาก รายงาน เหลือแค่ลิงก์ปกติ
  const navItems = [
    { name: "หน้าแรก", path: "/" },
    { name: "เวลาปฏิบัติงาน", path: "/timesheet" },
    { name: "ภาพถ่าย", path: "/gallery" },
    { name: "รายงาน", path: "/reports" },
  ];

  return (
    <>
      {/* --- ตัวแคปซูล Navbar หลัก --- */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50 w-auto flex justify-center items-center px-4 py-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all duration-300"
      >
        {/* =========================================
            DESKTOP MENU (แสดงเฉพาะจอใหญ่ md ขึ้นไป)
        ========================================= */}
        <div className="hidden md:flex gap-1 md:gap-2 text-sm font-semibold relative">
          {navItems.map((item) => {
            const isActive = item.path === pathname || pathname.startsWith(`${item.path}/`);
            const isHovered = item.path === hoveredPath;

            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <Link
                  href={item.path}
                  className={`relative px-5 py-2 rounded-full transition-colors duration-300 flex items-center gap-1 ${isActive ? "text-white" : "text-black hover:text-black/70"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-black rounded-full z-0 shadow-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 bg-black/5 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* =========================================
            MOBILE HEADER (แสดงเฉพาะจอเล็ก)
        ========================================= */}
        <div className="md:hidden flex items-center justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-black flex items-center justify-center transition-transform active:scale-95"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* =========================================
          MOBILE MENU OVERLAY (แสดงตอนกด Hamburger)
      ========================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-[90%] bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-2xl p-2 flex flex-col md:hidden max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => {
              const isActive = item.path === pathname || pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-4 rounded-2xl text-sm font-semibold transition-colors ${isActive ? "bg-black text-white" : "hover:bg-black/5 text-black"
                    }`}
                >
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