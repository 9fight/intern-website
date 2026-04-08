"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Mail, ChevronUp } from "lucide-react";

export default function Theme() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // 1. ตรวจสอบว่าตอนโหลดหน้าเว็บมาครั้งแรก มันเป็นโหมดมืดอยู่หรือเปล่า
    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        }
    }, []);

    // 2. ปรับปรุงฟังก์ชันสลับ Theme ให้ไปใส่/ถอดคลาส 'dark' ที่แท็ก <html> ด้วย
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    };

    // จัดการการ Scroll เพื่อโชว์ปุ่ม Top
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
        <>
            {/* --- Floating Contact & Scroll to Top --- */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
                <AnimatePresence>
                    {/* Facebook */}
                    <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://www.facebook.com/finally2006ontop"
                        target="_blank"
                        className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[#1877F2]/30 transition-shadow"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </motion.a>

                    {/* Theme Toggle */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
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

                    {/* Mail */}
                    <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="mailto:68319010015@loeitech.ac.th"
                        className="w-12 h-12 bg-white text-black border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-black/5 transition-shadow"
                    >
                        <Mail size={20} />
                    </motion.a>

                    {/* Scroll to Top */}
                    {showScrollTop && (
                        <motion.button
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
        </>
    );
}