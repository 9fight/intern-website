"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Component หยดแสงสีชมพู
const FallingParticle = ({ id }: { id: number }) => {
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 3;
    const randomDuration = 4 + Math.random() * 5;
    const randomSize = 2 + Math.random() * 3;
    const randomOpacity = 0.3 + Math.random() * 0.6;

    return (
        <motion.div
            initial={{ y: "-10vh", x: `${randomX}vw`, opacity: 0 }}
            animate={{
                y: "110vh",
                opacity: [0, randomOpacity, randomOpacity, 0],
                x: [`${randomX}vw`, `${randomX - 2}vw`, `${randomX + 2}vw`]
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
            }}
            className="fixed top-0 rounded-full bg-pink-300 pointer-events-none z-[9998]"
            style={{
                width: randomSize,
                height: randomSize,
                boxShadow: "0 0 10px 2px rgba(244, 114, 182, 0.6)"
            }}
        />
    );
};

// 2. Component แสงระยิบระยับ
const Sparkle = ({ id }: { id: number }) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDelay = Math.random() * 4;
    const randomDuration = 1.5 + Math.random() * 2.5;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 90, 180]
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut"
            }}
            className="absolute bg-rose-200 pointer-events-none z-[9997]"
            style={{
                left: `${randomX}vw`,
                top: `${randomY}vh`,
                width: 4,
                height: 4,
                clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                filter: "drop-shadow(0 0 6px rgba(225, 29, 72, 0.8))"
            }}
        />
    );
};

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);
    // เพิ่ม State เช็ค Client Side
    const [isMounted, setIsMounted] = useState(false);

    const particles = Array.from({ length: 40 });
    const sparkles = Array.from({ length: 20 });

    useEffect(() => {
        // บอกให้ระบบรู้ว่า Mount บน Client เรียบร้อยแล้ว
        setIsMounted(true);

        document.body.style.overflow = "hidden";
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "auto";
        }, 4000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "auto";
        };
    }, []);

    // ป้องกัน Hydration Error: ถ้ายังไม่ Mount จะยังไม่ Render กราฟิกที่ใช้ Math.random()
    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="splash"
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    // จัด Layout แบบ Flex Column และดันเนื้อหาไปอยู่ด้านล่างซ้าย
                    className="fixed inset-0 z-[9999] bg-[#0a0206] flex flex-col justify-end p-8 md:p-16 lg:p-24 overflow-hidden font-sans"
                >
                    {/* Background Glowing Orbs แบบจัดมุม */}
                    <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

                    {/* Renders */}
                    {particles.map((_, i) => <FallingParticle key={`particle-${i}`} id={i} />)}
                    {sparkles.map((_, i) => <Sparkle key={`sparkle-${i}`} id={i} />)}

                    {/* Content Section */}
                    <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start gap-4">

                        {/* Internship Badge (แบบมีไฟกระพริบด้านหน้า) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                            </div>
                            <span className="text-sm md:text-lg text-pink-200 font-medium tracking-[0.3em] uppercase">
                                Web Developer Intern
                            </span>
                        </motion.div>

                        {/* Main Typography แบบ Cinematic Stack */}
                        <div className="flex flex-col leading-[1.1]">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter"
                            >
                                INFORMATION
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 tracking-tighter drop-shadow-[0_0_20px_rgba(244,114,182,0.2)]"
                            >
                                TECHNOLOGY
                            </motion.span>
                        </div>

                        {/* Progress Line & Loading Text แบบยาวชิดขอบ */}
                        <div className="w-full max-w-md mt-8 flex flex-col gap-3">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex justify-between items-end text-[11px] md:text-xs font-bold tracking-[0.2em] text-pink-300/70 uppercase"
                            >
                                <span>System Loading</span>
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Please Wait...
                                </motion.span>
                            </motion.div>

                            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 3.5, ease: "circOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-pink-600 via-pink-400 to-white shadow-[0_0_15px_rgba(244,114,182,1)]"
                                />
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}