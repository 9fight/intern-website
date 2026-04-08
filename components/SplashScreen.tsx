"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ล็อกหน้าจอไม่ให้เลื่อน
        document.body.style.overflow = "hidden";

        // กำหนดเวลาโชว์หน้า Loading (2.2 วินาที) แล้วให้หายไป
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "auto";
        }, 2200);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="splash"
                    // แอนิเมชันตอนออก: สไลด์หน้าจอขึ้นไปเหมือนเปิดม่าน
                    exit={{ y: "-100vh" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-between py-24 px-6"
                >
                    {/* ส่วนบน (ปล่อยว่างไว้เพื่อดันให้โลโก้อยู่ตรงกลางจอ) */}
                    <div />

                    {/* ส่วนตรงกลาง: โลโก้และข้อความ */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <img
                                src="/image/it_loeitech.jpg"
                                alt="Logo"
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                            />
                        </motion.div>

                        {/* ข้อความสไลด์ขึ้นมาทีละคำ */}
                        <div className="overflow-hidden flex gap-2 md:gap-3">
                            <motion.span
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                                className="text-2xl md:text-4xl font-semibold text-white tracking-tight"
                            >
                                Internship
                            </motion.span>
                            <motion.span
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                                className="text-2xl md:text-4xl font-semibold text-white/40 tracking-tight"
                            >
                                Developer.
                            </motion.span>
                        </div>
                    </div>

                    {/* ส่วนล่าง: หลอดโหลดแบบเรียบหรู (1px) */}
                    <div className="w-full max-w-[200px] flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-[10px] font-medium tracking-[0.2em] text-white/30 uppercase"
                        >
                            Loading
                        </motion.div>

                        {/* เส้นโหลด */}
                        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
                                className="absolute inset-0 bg-white rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}