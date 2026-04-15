"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronUp } from "lucide-react";

export default function Theme() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // 1. ตรวจสอบโหมดมืดตอนโหลดหน้าแรก
    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        }
    }, []);

    // 2. ฟังก์ชันสลับ Theme
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    };

    // 3. จัดการการ Scroll เพื่อโชว์ปุ่ม Top
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        // วางปุ่มไว้ที่ "ซ้าย-ล่าง" (bottom-8 left-8) เพื่อไม่ให้ทับ Alert ที่อยู่ขวาล่าง
        <div className="fixed bottom-8 left-8 z-[100] flex flex-col-reverse items-center gap-3">
            <AnimatePresence>

                {/* ปุ่ม Theme Toggle (โชว์ตลอดเวลา อยู่ล่างสุด) */}
                <motion.button
                    key="theme.btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors border ${isDarkMode
                            ? "bg-[#1D1D1F] text-yellow-400 border-gray-700 hover:shadow-yellow-400/20"
                            : "bg-white text-gray-800 border-gray-200 hover:shadow-black/5"
                        }`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                {/* ปุ่ม Scroll to Top (จะโผล่มาทับอยู่ด้านบนปุ่ม Theme เมื่อเลื่อนจอลงมา) */}
                {showScrollTop && (
                    <motion.button
                        key="scroll.btn"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-xl border border-white/10 dark:border-black/10 transition-colors"
                    >
                        <ChevronUp size={24} />
                    </motion.button>
                )}

            </AnimatePresence>
        </div>
    );
}