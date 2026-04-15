"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    Plus, Clock, TrendingUp, Sparkles, Image as ImageIcon,
    Zap, ChevronRight, Loader2, Target, Timer, FileText, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Skeleton สำหรับ Dashboard ---
const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-2 w-full">
        <div className="lg:col-span-2 h-[200px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />
        <div className="h-[200px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />
        <div className="h-[200px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />

        <div className="lg:col-span-2 lg:row-span-2 min-h-[300px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />
        <div className="h-[200px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />
        <div className="h-[200px] bg-gray-200 dark:bg-[#111113] rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/5" />
    </div>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [weeks, setWeeks] = useState<any[]>([]);

    // Dynamic Stats
    const [stats, setStats] = useState({
        totalWeeks: 0,
        totalTasks: 0,
        totalHours: 0,
        completedWeeks: 0
    });

    const [isLoading, setIsLoading] = useState(true);

    // ค่าคงที่เป้าหมาย (เปลี่ยนได้ตามต้องการ)
    const TARGET_WEEKS = 8;
    const TARGET_HOURS = 320;

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // ถ้ามีระบบ Login ให้เปิดใช้ 
                // router.push("/login");
                fetchDashboardData(); // สำหรับตอนนี้ให้ดึงข้อมูลเลย
            } else {
                fetchDashboardData();
            }
        };
        checkUser();
    }, [router]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const { data: weeksData, error } = await supabase
                .from('weekly_reports')
                .select('*, daily_tasks(count)')
                .order('week_num', { ascending: false });

            if (error) throw error;

            if (weeksData) {
                setWeeks(weeksData);

                // คำนวณสถิติต่างๆ แบบ Real-time จาก Database
                const totalTasksCalc = weeksData.reduce((acc, week) => acc + (week.daily_tasks?.[0]?.count || 0), 0);
                const totalHoursCalc = weeksData.reduce((acc, week) => acc + (week.total_hours || 0), 0);
                const completedCount = weeksData.filter(w => w.status?.includes('ครบ') || w.status?.includes('เรียบร้อย')).length;

                setStats({
                    totalWeeks: weeksData.length,
                    totalTasks: totalTasksCalc,
                    totalHours: totalHoursCalc,
                    completedWeeks: completedCount
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    // คำนวณ % ความคืบหน้าของชั่วโมงรวม
    const progressPercent = Math.min(Math.round((stats.totalHours / TARGET_HOURS) * 100), 100);

    return (
        <div className="w-full relative min-h-screen pb-20">
            {/* Background Blob */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 tracking-tight mb-1">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm font-bold">
                        ภาพรวมการจัดการรายงานประจำสัปดาห์
                    </p>
                </motion.div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/admin/reports')}
                    className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-black/5 dark:shadow-white/5 group"
                >
                    <Plus size={18} strokeWidth={2.5} className="transition-transform group-hover:rotate-90 duration-300" /> เพิ่มรายงานใหม่
                </motion.button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DashboardSkeleton />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-2"
                    >
                        {/* 1. Latest Status (Hero Box) */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-[2rem] bg-gray-900 dark:bg-white p-6 md:p-8 text-white dark:text-black relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
                            <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/5 border border-white/10 dark:border-black/5 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Sparkles size={12} className="text-[#00d1b2]" /> System Active
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                                        {weeks.length > 0 ? `รายงานสัปดาห์ที่ ${weeks[0]?.week_num}` : 'ยังไม่มีรายงาน'}
                                    </h2>
                                    <p className="text-white/60 dark:text-black/60 text-sm font-bold flex items-center gap-1.5">
                                        {weeks.length > 0 ? (
                                            <>
                                                <div className={`w-2 h-2 rounded-full ${weeks[0]?.status?.includes('ครบ') ? 'bg-[#00d1b2]' : 'bg-orange-400'}`} />
                                                {weeks[0]?.status}
                                            </>
                                        ) : 'กรุณาเพิ่มรายงานสัปดาห์แรกของคุณ'}
                                    </p>
                                </div>
                                <div className="flex items-end justify-between mt-8">
                                    <div>
                                        <p className="text-white/40 dark:text-black/40 text-[10px] font-black uppercase tracking-widest mb-1">ช่วงวันที่ล่าสุด</p>
                                        <p className="text-sm font-bold">{weeks[0]?.date_range || 'ยังไม่กำหนด'}</p>
                                    </div>
                                    <button
                                        onClick={() => weeks.length > 0 ? router.push(`/admin/reports`) : handleAddReport()}
                                        className="p-3 rounded-xl bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors group-hover:translate-x-1 duration-300"
                                    >
                                        <ChevronRight size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Total Weeks Target */}
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-center items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                <Target size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                                {stats.totalWeeks} <span className="text-xl text-gray-300 dark:text-gray-700">/ {TARGET_WEEKS}</span>
                            </h3>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5">สัปดาห์ที่บันทึก</p>

                            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((stats.totalWeeks / TARGET_WEEKS) * 100, 100)}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full"
                                />
                            </div>
                        </motion.div>

                        {/* 3. Performance (Total Hours) */}
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-center items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <Timer size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                                {stats.totalHours} <span className="text-xl text-gray-300 dark:text-gray-700">ชม.</span>
                            </h3>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">ชั่วโมงปฏิบัติงานรวม</p>

                            <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg ${progressPercent >= 100 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                }`}>
                                <TrendingUp size={14} strokeWidth={2.5} /> สำเร็จ {progressPercent}%
                            </div>
                        </motion.div>

                        {/* 4. Recent Feed */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2 rounded-[2rem] bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="text-blue-500" size={20} strokeWidth={2.5} /> อัปเดตล่าสุด
                                </h2>
                                <button onClick={() => router.push('/admin/reports')} className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                                    ดูทั้งหมด <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="space-y-3 flex-1">
                                {weeks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                                        <AlertCircle size={32} strokeWidth={1.5} className="mb-2 opacity-50" />
                                        <p className="text-sm font-bold">ยังไม่มีประวัติการอัปเดต</p>
                                    </div>
                                ) : (
                                    weeks.slice(0, 4).map((week) => (
                                        <div key={week.id} onClick={() => router.push('/admin/reports')} className="p-4 rounded-[1.5rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100/50 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-[#1a1a1c] flex items-center justify-center text-gray-900 dark:text-white font-black text-lg border border-gray-100 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                                                    {week.week_num}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{week.date_range || 'ไม่ได้ระบุวันที่'}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className={`text-xs font-bold ${week.status?.includes('ครบ') ? 'text-emerald-500' : 'text-orange-400'}`}>
                                                            {week.status || 'รอระบุสถานะ'}
                                                        </p>
                                                        <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                                                            <FileText size={10} strokeWidth={2.5} /> {week.daily_tasks?.[0]?.count || 0} งาน
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} strokeWidth={2.5} className="text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* 5. Gallery Access */}
                        <motion.div variants={itemVariants} onClick={() => router.push('/admin/gallery')} className="rounded-[2rem] bg-[#00d1b2] p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                    <ImageIcon size={22} strokeWidth={2.5} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">แกลเลอรี</h3>
                                <p className="text-white/80 text-xs font-bold leading-relaxed max-w-[80%]">
                                    จัดการรูปภาพกิจกรรมและการทำงานในแต่ละสัปดาห์
                                </p>
                            </div>
                            <div className="mt-6 flex items-center text-sm font-black tracking-wide gap-1 group-hover:gap-2 transition-all">
                                เปิดดู <ChevronRight size={16} strokeWidth={2.5} />
                            </div>
                        </motion.div>

                        {/* 6. Tasks Info & Tip */}
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-center gap-4 group">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    <FileText size={20} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">งานรายวันทั้งหมด</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.totalTasks} <span className="text-sm text-gray-400">งาน</span></p>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-gray-100 dark:bg-white/5 my-1" />
                            <p className="text-xs font-bold text-gray-500 leading-relaxed">ตรวจเช็ค <span className="text-indigo-500">งานรายวัน</span> และรูปภาพประกอบให้ครบถ้วนก่อนประเมินเสมอ</p>
                            <button onClick={() => router.push('/admin/daily-tasks')} className="text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 w-fit transition-colors group/btn mt-1">
                                จัดการงานรายวัน <ChevronRight size={14} strokeWidth={2.5} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}