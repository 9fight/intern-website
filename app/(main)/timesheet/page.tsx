"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, CalendarRange, CheckCircle2, Timer, BarChart3,
    AlertCircle, FileX, X, CalendarDays, ArrowRight,
    Sparkles, LayoutGrid, FileText
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from "next/navigation";

// ==========================================
// 1. Custom Tooltip สำหรับกราฟ
// ==========================================
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10"
            >
                <p className="font-black text-sm text-gray-900 dark:text-white mb-2">{label}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
                        <Timer size={14} />
                        ชั่วโมงปฏิบัติงาน: <span className="text-black dark:text-white text-sm">{payload[0].value} ชม.</span>
                    </p>
                    {payload[0].value === 0 && (
                        <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase tracking-widest">ยังไม่มีข้อมูล</p>
                    )}
                </div>
            </motion.div>
        );
    }
    return null;
};

// ==========================================
// 2. Skeletons
// ==========================================
const DashboardSkeleton = () => (
    <div className="w-full flex flex-col lg:flex-row gap-6 mb-12 animate-pulse">
        <div className="w-full lg:w-1/3 h-[250px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
        <div className="w-full lg:w-2/3 h-[250px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
);

const CardSkeleton = () => (
    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-[2rem] border border-gray-300 dark:border-white/5 animate-pulse relative overflow-hidden">
        <div className="absolute top-4 left-4 w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="absolute bottom-4 left-4 right-4 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    </div>
);

// ==========================================
// 3. Component Timesheet Card (Bento Style)
// ==========================================
const BentoCard = ({ week, onClick }: { week: any; onClick: (week: any) => void }) => {
    const hasImage = !!week.timesheet_image;
    const isComplete = week.status?.includes('เรียบร้อย') || week.status?.includes('ครบถ้วน');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onClick(week)}
            className="relative w-full aspect-[4/4] sm:aspect-[4/3] cursor-pointer group"
        >
            <motion.div
                variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.03, y: -5 },
                    tap: { scale: 0.97 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative z-10 w-full h-full bg-white dark:bg-[#111113] rounded-[2rem] shadow-sm hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col group"
            >
                {/* --- Image Area --- */}
                <div className="relative flex-1 bg-gray-50 dark:bg-[#1a1a1c] overflow-hidden">
                    {hasImage ? (
                        <img
                            src={week.timesheet_image}
                            alt={`Week ${week.week_num}`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                            <FileX size={40} strokeWidth={1.5} className="mb-2 opacity-50" />
                        </div>
                    )}

                    {/* Gradient & Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10" />

                    <motion.div
                        variants={{
                            initial: { left: "-100%", opacity: 0 },
                            hover: { left: "200%", opacity: 1 }
                        }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] z-20 pointer-events-none"
                    />

                    {/* Badge Top Left */}
                    <div className="absolute top-4 left-4 z-30">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                            W{week.week_num}
                        </span>
                    </div>

                    {/* Status Top Right */}
                    <div className="absolute top-4 right-4 z-30">
                        {isComplete ? (
                            <div className="bg-emerald-500/20 backdrop-blur-md p-1.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                            </div>
                        ) : (
                            <div className="bg-amber-500/20 backdrop-blur-md p-1.5 rounded-full border border-amber-500/30">
                                <AlertCircle size={16} className="text-amber-400" />
                            </div>
                        )}
                    </div>

                    {/* Details Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-bold mb-1">
                                <CalendarRange size={12} />
                                <span>{week.date_range}</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white leading-none drop-shadow-md">
                                {week.total_hours || 0} <span className="text-sm text-gray-300 font-bold">ชม.</span>
                            </h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// 4. Main Page Component
// ==========================================
export default function TimesheetPage() {
    const router = useRouter();
    const [timesheets, setTimesheets] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedWeek, setSelectedWeek] = useState<any | null>(null);

    useEffect(() => {
        const fetchTimesheets = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('weekly_reports')
                .select('week_num, date_range, status, timesheet_image, total_hours')
                .order('week_num', { ascending: true });

            if (data && !error) {
                setTimesheets(data);

                let tempTotalHours = 0;
                const formattedChartData = data.map((week) => {
                    const hours = week.total_hours || 0;
                    tempTotalHours += hours;
                    return { name: `W${week.week_num}`, hours: hours };
                });

                setChartData(formattedChartData);
                setTotalHours(tempTotalHours);
            }
            setIsLoading(false);
        };

        fetchTimesheets();
    }, []);

    useEffect(() => {
        if (selectedWeek) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedWeek]);

    return (
        <main className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 overflow-hidden">

            {/* --- Hero Banner (ปรับเป็นสไตล์เดียวกับหน้า Gallery) --- */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: "url('/image/office.png')" }}
                >
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-[4px] transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F7] dark:from-[#09090b] to-transparent transition-colors duration-300" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        {/* Pill Badge Style Gallery */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-6 border border-black/10 dark:border-white/10">
                            <Clock size={16} className="text-black dark:text-white" />
                            <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white">
                                Timesheet Records
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-black dark:text-white">
                            ตารางเวลาปฏิบัติงาน
                        </h1>
                        <p className="text-lg md:text-xl text-[#424245] dark:text-gray-400 max-w-2xl mx-auto font-medium">
                            ติดตามและสรุปชั่วโมงการทำงานรายสัปดาห์
                            พร้อมดูเอกสารบันทึกเวลาตลอดระยะเวลาการฝึกประสบการณ์วิชาชีพ
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Bento Layout Section --- */}
            <section className="py-10 pb-24 px-4 md:px-8 lg:px-12 xl:px-20 relative z-10 max-w-[1400px] mx-auto">

                {/* 1. Dashboard Highlights (Total Hours + Chart) */}
                {isLoading ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 mb-12">

                        {/* Total Hours Block */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-[35%] bg-black dark:bg-white rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col justify-between shadow-xl min-h-[280px]"
                        >
                            {/* Radial Light Hover Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_50%)] transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-md flex items-center justify-center border border-white/10 dark:border-black/10">
                                    <Sparkles size={24} className="text-white dark:text-black" />
                                </div>
                                <span className="text-white/50 dark:text-black/50 text-sm font-bold uppercase tracking-widest">Overview</span>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-2">รวมชั่วโมงปฏิบัติงานทั้งหมด</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl sm:text-8xl font-black text-white dark:text-black tracking-tighter leading-none">
                                        {totalHours}
                                    </span>
                                    <span className="text-xl font-bold text-white/50 dark:text-black/50">ชม.</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Chart Block */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-[65%] bg-white dark:bg-[#111113] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col min-h-[280px]"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 size={20} className="text-gray-400" />
                                <h2 className="text-lg font-black tracking-wide">สถิติรายสัปดาห์</h2>
                            </div>
                            <div className="flex-1 w-full min-h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.1} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888', fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888', fontWeight: 700 }} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#888', opacity: 0.05, radius: 12 }} />
                                        <Bar dataKey="hours" radius={[8, 8, 0, 0]} maxBarSize={32} animationDuration={1500}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} className="fill-black dark:fill-white hover:opacity-70 transition-opacity duration-300 cursor-pointer" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Document Grid (Bento Cards) */}
                <div className="flex items-center gap-3 mb-8">
                    <LayoutGrid className="text-black dark:text-white" size={28} />
                    <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">
                        Weekly Documents
                    </h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
                    </div>
                ) : timesheets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {timesheets.map((week) => (
                            <BentoCard
                                key={week.week_num}
                                week={week}
                                // เปลี่ยนจาก setSelectedWeek เป็น router.push
                                onClick={(week) => router.push(`/timesheet/${week.week_num}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 w-full flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-[#111113] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <FileX size={64} strokeWidth={1} className="mb-4 opacity-30" />
                        <p className="font-black text-xl">ยังไม่มีข้อมูลเอกสาร</p>
                    </div>
                )}
            </section>

            {/* ========================================== */}
            {/* 5. MODAL รายละเอียด */}
            {/* ========================================== */}
            <AnimatePresence>
                {selectedWeek && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                        onClick={() => setSelectedWeek(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#111113] w-full max-w-5xl rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200 dark:border-white/10 relative"
                        >
                            <button
                                onClick={() => setSelectedWeek(null)}
                                className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Image Viewer */}
                            <div className="w-full md:w-[60%] bg-[#f8f8f8] dark:bg-[#0a0a0a] relative flex items-center justify-center min-h-[300px] md:min-h-[600px] p-6">
                                {selectedWeek.timesheet_image ? (
                                    <img
                                        src={selectedWeek.timesheet_image}
                                        alt={`Document Week ${selectedWeek.week_num}`}
                                        className="max-h-[70vh] object-contain rounded-xl shadow-md border border-gray-200 dark:border-white/5"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <FileX size={64} className="mb-4 opacity-30" />
                                        <p className="font-bold">ไม่มีรูปเอกสารสัปดาห์นี้</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Bento Info Panel */}
                            <div className="w-full md:w-[40%] p-8 flex flex-col bg-white dark:bg-[#111113]">
                                <div className="mb-auto">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-black uppercase tracking-widest mb-6 text-black dark:text-white border border-black/5 dark:border-white/10">
                                        <FileText size={14} />
                                        Week {selectedWeek.week_num}
                                    </div>

                                    <h2 className="text-gray-500 dark:text-gray-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <CalendarRange size={16} /> Date Range
                                    </h2>
                                    <p className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight mb-8">
                                        {selectedWeek.date_range}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Hours Box */}
                                    <div className="p-6 rounded-[1.5rem] bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5">
                                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">Total Hours</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-black dark:text-white tracking-tighter">{selectedWeek.total_hours}</span>
                                            <span className="font-bold text-gray-500">ชม.</span>
                                        </div>
                                    </div>

                                    {/* Status Box */}
                                    <div className={`p-6 rounded-[1.5rem] border ${selectedWeek.status?.includes('เรียบร้อย') || selectedWeek.status?.includes('ครบถ้วน')
                                        ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10'
                                        : 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10'
                                        }`}>
                                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-3">Status</p>
                                        <div className="flex items-center gap-3">
                                            {selectedWeek.status?.includes('เรียบร้อย') || selectedWeek.status?.includes('ครบถ้วน') ? (
                                                <>
                                                    <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-full">
                                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                                    </div>
                                                    <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">{selectedWeek.status}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-full">
                                                        <AlertCircle size={24} className="text-amber-500" />
                                                    </div>
                                                    <span className="font-black text-lg text-amber-600 dark:text-amber-400">{selectedWeek.status || 'รอตรวจสอบ'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}