"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    title = "เกิดข้อผิดพลาดบางอย่าง",
    message = "ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex flex-col items-center text-center max-w-md w-full bg-white dark:bg-[#111113] p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-red-100 dark:border-red-900/30"
            >
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner"
                >
                    <AlertCircle size={40} strokeWidth={1.5} className="text-red-500" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-black mb-3 text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed text-sm md:text-base">
                    {message}
                </p>

                {onRetry && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRetry}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        <RefreshCw size={18} strokeWidth={2.5} />
                        ลองใหม่อีกครั้ง
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}