"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Component หยดแสงสีชมพู (ลดปัญหา Hydration โดยการสุ่มค่าตอน Client Mount)
const FallingParticle = () => {
    const [style, setStyle] = useState<any>(null);

    useEffect(() => {
        setStyle({
            x: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 4 + Math.random() * 5,
            size: 2 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.5,
        });
    }, []);

    if (!style) return null;

    return (
        <motion.div
            initial={{ y: "-10vh", x: `${style.x}vw`, opacity: 0 }}
            animate={{
                y: "110vh",
                opacity: [0, style.opacity, style.opacity, 0],
                x: [`${style.x}vw`, `${style.x - 2}vw`, `${style.x + 2}vw`]
            }}
            transition={{
                duration: style.duration,
                repeat: Infinity,
                delay: style.delay,
                ease: "easeInOut",
            }}
            className="fixed top-0 rounded-full bg-pink-300 pointer-events-none z-[9998]"
            style={{
                width: style.size,
                height: style.size,
                boxShadow: "0 0 15px 2px rgba(244, 114, 182, 0.6)"
            }}
        />
    );
};

// 2. Component แสงระยิบระยับ
const Sparkle = () => {
    const [style, setStyle] = useState<any>(null);

    useEffect(() => {
        setStyle({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 4,
            duration: 1.5 + Math.random() * 2.5,
        });
    }, []);

    if (!style) return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0], rotate: [0, 90, 180] }}
            transition={{ duration: style.duration, repeat: Infinity, delay: style.delay, ease: "easeInOut" }}
            className="absolute bg-rose-200 pointer-events-none z-[9997]"
            style={{
                left: `${style.x}vw`,
                top: `${style.y}vh`,
                width: 3,
                height: 3,
                clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                filter: "drop-shadow(0 0 10px rgba(225, 29, 72, 0.8))"
            }}
        />
    );
};

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "auto";
        }, 3500); // 3.5 วินาที เพื่อให้เห็น Animation ครบถ้วนและไม่นานเกินไป

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "auto";
        };
    }, []);

    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-[#050103] flex flex-col justify-between p-6 sm:p-10 md:p-16 lg:p-20 overflow-hidden font-sans"
                >
                    {/* Glowing Orbs (ปรับขนาดให้เหมาะกับมือถือ) */}
                    <div className="absolute top-0 right-0 w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[70vw] md:w-[40vw] h-[70vw] md:h-[40vw] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

                    {/* Render Particles */}
                    {Array.from({ length: 25 }).map((_, i) => <FallingParticle key={`particle-${i}`} />)}
                    {Array.from({ length: 12 }).map((_, i) => <Sparkle key={`sparkle-${i}`} />)}

                    {/* Top Section: Status */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 flex items-center gap-3 w-full max-w-7xl mx-auto"
                    >
                        <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)]" />
                        </div>
                        <span className="text-[10px] sm:text-xs md:text-sm text-pink-200/80 font-black tracking-[0.4em] uppercase">
                            Initializing System
                        </span>
                    </motion.div>

                    {/* Middle Section: Main Title (Fluid Typography) */}
                    <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-7xl mx-auto py-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="text-[13vw] sm:text-7xl md:text-[6rem] lg:text-[8rem] font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl"
                        >
                            INFORMATION
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            className="text-[13vw] sm:text-7xl md:text-[6rem] lg:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 tracking-tighter leading-[0.9] drop-shadow-[0_0_40px_rgba(244,114,182,0.25)]"
                        >
                            TECHNOLOGY
                        </motion.h1>
                    </div>

                    {/* Bottom Section: Progress Line */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto mt-auto flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex justify-between items-end text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.3em] text-pink-300/60 uppercase"
                        >
                            <span>Core Modules</span>
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                Loading...
                            </motion.span>
                        </motion.div>

                        <div className="h-[2px] sm:h-[3px] w-full bg-white/5 relative overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                                className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_25px_rgba(244,114,182,1)]"
                            />
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}