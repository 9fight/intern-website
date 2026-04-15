"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, CalendarRange, CheckCircle2, Clock,
    FileX, AlertCircle, Timer, FileSearch
} from "lucide-react";

// --- Skeleton Component (สำหรับ UX โหลดข้อมูล) ---
const DetailSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start w-full animate-pulse">
        {/* Skeleton รูปภาพ */}
        <div className="w-full aspect-[3/4] rounded-[2rem] bg-gray-200 dark:bg-white/5" />

        {/* Skeleton เนื้อหา */}
        <div className="flex flex-col pt-4 md:pt-10 space-y-6">
            <div className="w-32 h-8 bg-gray-200 dark:bg-white/5 rounded-full" />
            <div className="w-48 md:w-64 h-12 md:h-16 bg-gray-200 dark:bg-white/5 rounded-2xl" />
            <div className="w-full h-40 bg-gray-200 dark:bg-white/5 rounded-[2rem]" />
            <div className="w-full h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
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
                    .single(); // ใช้ single() เพราะเลขสัปดาห์ไม่ซ้ำกัน

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
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <main className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 pb-20 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* --- Header / Back Button --- */}
            <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4 px-4 md:px-12 lg:px-20 transition-colors duration-300">
                <motion.button
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-sm font-bold transition-colors duration-300 group"
                >
                    <motion.div variants={{ hover: { x: -3 } }} transition={{ duration: 0.2 }}>
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </motion.div>
                    ย้อนกลับ
                </motion.button>
            </nav>

            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 md:mt-12">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <DetailSkeleton />
                        </motion.div>
                    ) : !weekData ? (
                        <motion.div
                            key="not-found"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="min-h-[60vh] flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <FileSearch size={40} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black mb-2 text-gray-900 dark:text-white tracking-tight">ไม่พบข้อมูลสัปดาห์นี้</h1>
                            <p className="text-gray-500 font-medium mb-8">อาจยังไม่มีการบันทึกข้อมูลสำหรับสัปดาห์ที่ {currentWeekNum}</p>
                            <button
                                onClick={() => router.push('/timesheet')}
                                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-transform"
                            >
                                กลับไปหน้าหลัก
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
                        >
                            {/* --- ฝั่งซ้าย: รูปภาพใบลงเวลา --- */}
                            <motion.div variants={itemVariants} className="w-full">
                                <div className="w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-[#111113] border border-black/5 dark:border-white/5 relative group flex items-center justify-center">
                                    {weekData.timesheet_image ? (
                                        <motion.img
                                            initial={{ scale: 1.05 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.8 }}
                                            src={weekData.timesheet_image}
                                            alt={`Timesheet Week ${weekData.week_num}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                                            <FileX size={64} strokeWidth={1.5} className="mb-4 opacity-50" />
                                            <span className="text-lg font-black uppercase tracking-widest opacity-50">ไม่มีเอกสารแนบ</span>
                                        </div>
                                    )}

                                    {/* Overlay ลายน้ำเล็กๆ ป้องกันความโล่ง */}
                                    <div className="absolute top-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black dark:text-white shadow-sm pointer-events-none">
                                        Week {weekData.week_num}
                                    </div>
                                </div>
                            </motion.div>

                            {/* --- ฝั่งขวา: รายละเอียด --- */}
                            <motion.div variants={itemVariants} className="flex flex-col lg:pt-8">

                                {/* Badge สถานะ (ด้านบนชื่อ) */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit mb-6 text-[11px] font-black tracking-widest uppercase ${isCompleted
                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <AlertCircle size={16} strokeWidth={2.5} />}
                                    {isCompleted ? 'Verified' : 'Pending Verification'}
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 text-gray-900 dark:text-white">
                                    สัปดาห์ที่ {weekData.week_num}
                                </h1>

                                {/* กล่องข้อมูล (Bento Box) */}
                                <div className="bg-white dark:bg-[#111113] rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-6 mb-8">
                                    {/* รอบการประเมิน */}
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <CalendarRange size={16} /> รอบการประเมิน
                                        </h3>
                                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                            {weekData.date_range || 'ยังไม่ระบุวันที่'}
                                        </p>
                                    </div>

                                    <div className="h-[1px] w-full bg-gray-100 dark:bg-white/5" />

                                    {/* สถานะการลงเวลา & ชั่วโมงรวม */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Clock size={16} /> สถานะ
                                            </h3>
                                            <p className={`text-lg md:text-xl font-black ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                                }`}>
                                                {weekData.status || 'รออัปเดต'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Timer size={16} /> ชั่วโมงรวม
                                            </h3>
                                            <p className="text-lg md:text-xl font-black text-blue-600 dark:text-blue-400">
                                                {weekData.total_hours || 0} <span className="text-sm font-bold text-gray-500">ชม.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* พื้นที่ข้อความเพิ่มเติม */}
                                <div className="bg-gray-50 dark:bg-white/[0.02] rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-white/5">
                                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm md:text-base">
                                        เอกสารฉบับนี้เป็นการสรุปข้อมูลการปฏิบัติงานและการลงเวลาในสัปดาห์ที่ <span className="font-bold text-gray-900 dark:text-white">{weekData.week_num}</span>
                                        {isCompleted
                                            ? " ซึ่งได้รับการตรวจสอบและลงนามรับรองอย่างครบถ้วนแล้ว"
                                            : " ขณะนี้กำลังรอการตรวจสอบความเรียบร้อย หรือการแนบเอกสารยืนยันจากผู้ที่เกี่ยวข้อง"}
                                    </p>
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}