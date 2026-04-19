"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, CalendarRange, CheckCircle2, Clock,
    FileX, AlertCircle, Timer, FileSearch,
    Sparkles, FileText
} from "lucide-react";

import { Variants } from "framer-motion"; // <--- 1. Import Variants

// 2. กำหนด Type ให้ตัวแปร
const Variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring", // <--- แบบนี้ไม่ต้องใส่ as const แล้ว
            stiffness: 100,
            damping: 10
        }
    }
};

// ==========================================
// 1. Skeleton Loading สไตล์ Bento Box
// ==========================================
const DetailBentoSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-pulse">
        {/* ฝั่งซ้าย: กล่องรูปภาพ */}
        <div className="col-span-1 lg:col-span-5 aspect-[3/4] lg:aspect-auto lg:h-[650px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />

        {/* ฝั่งขวา: กล่องข้อมูลย่อย (Bento) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <div className="h-[120px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="h-[220px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
                <div className="h-[220px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
            </div>
            <div className="h-[140px] flex-1 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
        </div>
    </div>
);

export default function TimesheetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const currentWeekNum = Number(params.weekNum);

    const [weekData, setWeekData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- ดึงข้อมูลจาก Supabase ---
    useEffect(() => {
        const fetchWeekData = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('weekly_reports')
                    .select('week_num, date_range, status, timesheet_image, total_hours')
                    .eq('week_num', currentWeekNum)
                    .single();

                if (data && !error) setWeekData(data);
            } catch (err) {
                console.error("Error fetching timesheet detail:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentWeekNum) fetchWeekData();
    }, [currentWeekNum]);

    // --- ตรวจสอบสถานะ ---
    const isCompleted = weekData?.status?.includes('เรียบร้อย') || weekData?.status?.includes('ครบถ้วน');

    // --- Framer Motion Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <main className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 pb-24 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* ========================================== */}
            {/* Minimal Header (เน้นความต่อเนื่องจากหน้าหลัก) */}
            {/* ========================================== */}
            <nav className="sticky top-0 z-50 bg-[#F5F5F7]/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4 px-4 md:px-8 lg:px-12 transition-colors duration-300">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.02, x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111113] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-bold transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        กลับหน้ารวม
                    </motion.button>

                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timesheet Details</span>
                        <span className="text-sm font-bold">สัปดาห์ที่ {currentWeekNum}</span>
                    </div>
                </div>
            </nav>

            {/* ========================================== */}
            {/* Main Content (Bento Grid Layout) */}
            {/* ========================================== */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mt-8 md:mt-12 relative z-20">

                <div className="mb-8 md:mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
                        รายละเอียดสัปดาห์ที่ {currentWeekNum}
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <DetailBentoSkeleton />
                        </motion.div>
                    ) : !weekData ? (
                        <motion.div
                            key="not-found"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center bg-white dark:bg-[#111113] rounded-[3rem] border border-gray-200 dark:border-white/5 py-20 shadow-sm"
                        >
                            <div className="w-24 h-24 bg-gray-50 dark:bg-[#1a1a1c] rounded-full flex items-center justify-center mb-6">
                                <FileSearch size={40} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">ไม่พบข้อมูลสัปดาห์นี้</h2>
                            <p className="text-gray-500 font-medium mb-8">อาจยังไม่มีการบันทึกเอกสารสำหรับสัปดาห์ที่ {currentWeekNum}</p>
                            <button
                                onClick={() => router.push('/timesheet')}
                                className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-transform"
                            >
                                กลับไปหน้ารวม
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                        >
                            {/* --- BENTO 1: รูปภาพเอกสาร (ฝั่งซ้าย) --- */}
                            <motion.div variants={itemVariants} className="col-span-1 lg:col-span-5 h-full">
                                <div className="w-full h-full min-h-[500px] lg:min-h-[650px] rounded-[2.5rem] overflow-hidden shadow-lg bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/10 relative group flex items-center justify-center p-2">
                                    {weekData.timesheet_image ? (
                                        <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-[#1a1a1c]">
                                            <img
                                                src={weekData.timesheet_image}
                                                alt={`Timesheet Week ${weekData.week_num}`}
                                                className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-[#1a1a1c] w-full h-full rounded-[2rem]">
                                            <FileX size={64} strokeWidth={1} className="mb-4 opacity-50" />
                                            <span className="text-sm font-black uppercase tracking-widest opacity-50">ไม่มีภาพเอกสารแนบ</span>
                                        </div>
                                    )}

                                    {/* Glass Badge */}
                                    <div className="absolute top-6 left-6 bg-white/60 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black dark:text-white border border-black/5 dark:border-white/10 shadow-sm z-30">
                                        <div className="flex items-center gap-1.5">
                                            <FileText size={14} />
                                            Document View
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* --- ฝั่งขวา: Grid ข้อมูลย่อย --- */}
                            <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7 flex flex-col gap-6">

                                {/* BENTO 2: วันที่ (Date Range) */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white dark:bg-[#111113] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between group gap-4"
                                >
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CalendarRange size={16} /> Date Range
                                        </h3>
                                        <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                            {weekData.date_range || 'ยังไม่ระบุวันที่'}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shrink-0">
                                        <Sparkles size={24} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* BENTO 3: ชั่วโมงการทำงาน (ดำดุดัน) */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-black dark:bg-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group border border-black dark:border-white"
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)] transition-opacity duration-500 pointer-events-none" />

                                        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-md flex items-center justify-center border border-white/10 dark:border-black/10 mb-8">
                                            <Timer size={24} className="text-white dark:text-black" />
                                        </div>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest">
                                            Total Hours
                                        </p>
                                        <div className="flex items-baseline gap-2 relative z-10">
                                            <span className="text-6xl sm:text-7xl font-black text-white dark:text-black tracking-tighter leading-none">
                                                {weekData.total_hours || 0}
                                            </span>
                                            <span className="text-xl font-bold text-white/50 dark:text-black/50">ชม.</span>
                                        </div>
                                    </motion.div>

                                    {/* BENTO 4: สถานะ (สีตามเงื่อนไข) */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden border ${isCompleted
                                            ? 'bg-emerald-50 dark:bg-[#111113] border-emerald-100 dark:border-emerald-500/20'
                                            : 'bg-amber-50 dark:bg-[#111113] border-amber-100 dark:border-amber-500/20'
                                            }`}
                                    >
                                        <div className="absolute -right-6 -top-6 opacity-10 dark:opacity-5 transform rotate-12 transition-transform duration-500 group-hover:rotate-0">
                                            {isCompleted ? <CheckCircle2 size={160} /> : <AlertCircle size={160} />}
                                        </div>

                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-inner relative z-10 ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                            }`}>
                                            <Clock size={24} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest relative z-10">
                                            Status
                                        </p>
                                        <p className={`text-2xl sm:text-3xl font-black tracking-tight relative z-10 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                            }`}>
                                            {weekData.status || 'รออัปเดต'}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* BENTO 5: กล่องข้อความสรุป */}
                                <motion.div
                                    className="bg-white dark:bg-[#111113] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 flex-1 flex flex-col justify-center shadow-sm"
                                >
                                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm md:text-base">
                                        เอกสารฉบับนี้สรุปข้อมูลการลงเวลาใน<span className="text-black dark:text-white font-black mx-1">สัปดาห์ที่ {weekData.week_num}</span>
                                        {isCompleted
                                            ? "ได้รับการตรวจสอบและรับรองอย่างครบถ้วนเรียบร้อยแล้ว"
                                            : "ขณะนี้กำลังรอการตรวจสอบความเรียบร้อย โปรดติดตามสถานะอีกครั้ง"}
                                    </p>
                                </motion.div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}