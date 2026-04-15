"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, FileText, AlertCircle, CheckCircle,
    Briefcase, Plus, Search, Filter, Printer, Database
} from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

export default function ReportsPage() {
    const [weeksData, setWeeksData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "work" | "holiday">("all");

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('weekly_reports')
                    .select(`
                        *,
                        daily_tasks (*)
                    `)
                    .order('week_num', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    const formattedData = data.map((week: any) => ({
                        weekNum: week.week_num,
                        dateRange: week.date_range || "ไม่ระบุช่วงวันที่",
                        problem: week.problem || "-",
                        solution: week.solution || "-",
                        days: (week.daily_tasks || []).map((day: any) => ({
                            id: day.day_id || day.id,
                            dateStr: day.date_str,
                            dayName: day.day_name,
                            isHoliday: day.is_holiday,
                            image: day.image_url,
                            taskMain: day.task_main,
                            taskOther: day.task_other || "ไม่มี"
                        })).sort((a: any, b: any) => a.id - b.id)
                    }));

                    setWeeksData(formattedData);
                    if (formattedData.length > 0) {
                        setSelectedWeek(formattedData[0].weekNum);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching reports:", err);
                setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const currentWeekData = weeksData.find(w => w.weekNum === selectedWeek);

    const filteredDays = useMemo(() => {
        if (!currentWeekData) return [];
        return currentWeekData.days.filter((day: any) => {
            const matchesSearch = day.taskMain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                day.dateStr?.includes(searchQuery) ||
                day.dayName?.includes(searchQuery);

            if (filterType === "work" && day.isHoliday) return false;
            if (filterType === "holiday" && !day.isHoliday) return false;

            return matchesSearch;
        });
    }, [currentWeekData, searchQuery, filterType]);

    const handlePrint = () => {
        window.print();
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 } // ทำให้การ์ดทยอยแสดงผล
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    } as const;

    // --- State: โหลดข้อมูล (Skeleton UI) ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#09090b] w-full">
                {/* Hero Skeleton */}
                <div className="w-full h-[40vh] min-h-[350px] bg-gray-200 dark:bg-gray-800 animate-pulse" />

                {/* Timeline Skeleton */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
                    <div className="bg-white dark:bg-[#111113] rounded-3xl h-24 shadow-xl border border-gray-100 dark:border-white/10 animate-pulse" />
                </div>

                {/* Filters Skeleton */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
                    <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                </div>

                {/* Cards Skeleton */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#111113] p-6 rounded-3xl border border-gray-100 dark:border-white/5 animate-pulse">
                            <div className="w-full lg:w-1/3 aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                            <div className="w-full lg:w-2/3 space-y-4 py-4">
                                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2" />
                                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- State: Error ---
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-[#09090b] text-[#1D1D1F] dark:text-gray-100">
                <AlertCircle size={64} className="text-red-500 mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3">ไม่สามารถโหลดข้อมูลได้</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium hover:scale-105 transition-transform">
                    ลองใหม่อีกครั้ง
                </button>
            </div>
        );
    }

    // --- State: ไม่มีข้อมูลเลย ---
    if (!currentWeekData || weeksData.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-[#09090b] text-[#1D1D1F] dark:text-gray-100">
                <Database size={64} className="text-gray-400 mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3">ไม่พบข้อมูลรายงาน</h2>
                <p className="text-gray-500">ยังไม่มีข้อมูลในระบบ หรือรอการอัปเดตจากฐานข้อมูล</p>
            </div>
        );
    }

    return (
        <main
            style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
            className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black print:bg-white print:text-black"
        >
            {/* --- Hero Banner --- */}
            <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-10 print:h-auto print:min-h-fit print:pt-4 print:pb-4">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300 print:hidden"
                    style={{ backgroundImage: "url('/image/office.png')" }}
                >
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F7] dark:from-[#09090b] to-transparent transition-colors duration-300 print:hidden"></div>
                </div>

                <div className="relative z-10 text-center px-6 mt-10 print:mt-0">
                    <motion.div
                        key={`hero-${selectedWeek}`}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-4 border border-black/10 dark:border-white/10 print:border-gray-300 print:bg-white print:text-black">
                            <FileText size={16} className="text-black dark:text-white print:text-black" />
                            <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-black dark:text-white print:text-black">
                                Internship Report
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-black dark:text-white print:text-black">
                            รายงานสัปดาห์ที่ {currentWeekData.weekNum}
                        </h1>

                        <div className="flex items-center gap-2 text-sm md:text-base lg:text-lg text-[#424245] dark:text-gray-400 font-medium bg-white/50 dark:bg-black/50 px-5 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm print:bg-white print:border-gray-300 print:text-black print:shadow-none">
                            <Calendar size={18} />
                            <span>{currentWeekData.dateRange}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Roadmap / Timeline View --- */}
            <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 md:px-6 print:hidden">
                <div className="bg-white dark:bg-[#111113] rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-6 md:p-8 transition-colors duration-300 overflow-x-auto hide-scrollbar scroll-smooth">
                    <div className="relative min-w-max flex items-center justify-between gap-8 py-4 px-2">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 dark:bg-gray-800 rounded-full z-0"></div>

                        {weeksData.map((week) => {
                            const isActive = selectedWeek === week.weekNum;
                            const isPast = week.weekNum < (selectedWeek || 0);

                            return (
                                <button
                                    key={week.weekNum}
                                    onClick={() => setSelectedWeek(week.weekNum)}
                                    className="relative z-10 flex flex-col items-center group gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-lg p-2"
                                    aria-label={`เลือกสัปดาห์ที่ ${week.weekNum}`}
                                >
                                    <motion.div
                                        layout
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 
                                        ${isActive
                                                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg scale-110"
                                                : isPast
                                                    ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-300 dark:text-black dark:border-gray-300 group-hover:scale-105"
                                                    : "bg-white text-gray-400 border-gray-200 dark:bg-[#111113] dark:border-gray-700 hover:border-gray-400 group-hover:scale-105"
                                            }`}
                                    >
                                        W{week.weekNum}
                                    </motion.div>
                                    <div className={`text-xs md:text-sm font-semibold whitespace-nowrap transition-colors duration-300
                                        ${isActive ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
                                    `}>
                                        สัปดาห์ที่ {week.weekNum}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- Tools: Search, Filter & Print --- */}
            <section className="mt-8 max-w-7xl mx-auto px-4 md:px-6 print:hidden">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-gray-200 dark:border-white/10">

                    {/* Search Bar */}
                    <div className="relative w-full lg:w-1/3 flex items-center bg-white dark:bg-[#1a1a1c] rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-white/5 focus-within:ring-2 ring-black/10 dark:ring-white/20 transition-all">
                        <Search size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="ค้นหางานที่ทำ หรือวันที่..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm text-black dark:text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Filters & Print Button */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:w-auto flex items-center gap-1 bg-white dark:bg-[#1a1a1c] p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-x-auto hide-scrollbar">
                            <div className="pl-3 pr-1 flex items-center text-gray-400 flex-shrink-0">
                                <Filter size={16} />
                            </div>
                            {[
                                { id: "all", label: "ทั้งหมด" },
                                { id: "work", label: "วันทำงาน" },
                                { id: "holiday", label: "วันหยุด" }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilterType(filter.id as any)}
                                    className={`px-4 py-2.5 sm:py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-300 flex-1 sm:flex-none text-center ${filterType === filter.id
                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Print Button */}
                        <button
                            onClick={handlePrint}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <Printer size={18} />
                            พิมพ์รายงาน
                        </button>
                    </div>
                </div>
            </section>

            {/* --- รายละเอียดรายวัน --- */}
            <section className="py-8 px-4 md:px-6 max-w-7xl mx-auto print:py-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    {filteredDays.length === 0 ? (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="py-20 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-4 bg-white dark:bg-[#111113] rounded-3xl border border-gray-100 dark:border-white/5 print:hidden shadow-sm"
                        >
                            <Search size={48} className="opacity-20 mb-2" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">ไม่พบข้อมูล</h3>
                            <p>ไม่มีรายการที่ตรงกับการค้นหา หรือ ตัวกรองที่คุณเลือก</p>
                            <button
                                onClick={() => { setSearchQuery(""); setFilterType("all"); }}
                                className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                            >
                                ล้างการค้นหา
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`content-${selectedWeek}-${filterType}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="flex flex-col gap-6"
                        >
                            {filteredDays.map((day: any) => (
                                <motion.div
                                    layout
                                    variants={itemVariants}
                                    key={day.id}
                                    className={`flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#111113] p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md border 
                                        ${day.isHoliday ? "border-dashed border-gray-300 dark:border-gray-700 opacity-95 bg-gray-50/50 dark:bg-[#111113]/50" : "border-gray-100 dark:border-white/5"} 
                                        transition-all duration-300 
                                        print:break-inside-avoid print:shadow-none print:border-gray-300 print:bg-white print:mb-6`}
                                >
                                    {/* รูปภาพ */}
                                    <div className="w-full lg:w-1/3 aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 relative group flex-shrink-0 border border-gray-100 dark:border-white/10 print:border-gray-300">
                                        <img
                                            src={day.image}
                                            alt={`รูปภาพงานวันที่ ${day.dateStr}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 print:transform-none"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                const isDark = document.documentElement.classList.contains("dark");
                                                if (day.isHoliday) {
                                                    target.src = `https://placehold.co/800x600/${isDark ? "1e1e20/666666" : "f3f4f6/aaaaaa"}?text=Holiday`;
                                                } else {
                                                    target.src = `https://placehold.co/800x600/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"}?text=Image+Not+Found`;
                                                }
                                            }}
                                        />
                                        {day.isHoliday && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 group-hover:bg-black/20 print:hidden">
                                                <span className="bg-white/95 text-black px-6 py-2 rounded-full font-bold text-sm shadow-xl tracking-wide">
                                                    {day.taskMain?.includes('สงกรานต์') ? 'วันหยุดสงกรานต์' : day.taskMain?.includes('จักรี') ? 'วันจักรี' : 'วันหยุดประจำสัปดาห์'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* รายละเอียด */}
                                    <div className="w-full lg:w-2/3 flex flex-col justify-center">
                                        <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 print:border-gray-300">
                                            <span className={day.isHoliday ? "text-gray-400 print:text-gray-500" : "text-black dark:text-white print:text-black"}>
                                                {day.dayName}ที่ {day.dateStr}
                                            </span>
                                        </h3>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold flex items-center gap-2 text-base md:text-lg text-black dark:text-white mb-3 print:text-black">
                                                    <Briefcase size={18} className="text-blue-500 print:text-black" />
                                                    งานที่ได้ปฏิบัติ
                                                </h4>
                                                <div className="pl-6 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 print:bg-white print:border-gray-300 print:text-black print:p-0 print:border-none">
                                                    {day.taskMain}
                                                </div>
                                            </div>

                                            {!day.isHoliday && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <h4 className="font-bold flex items-center gap-2 text-base md:text-lg text-black dark:text-white mb-3 print:text-black">
                                                        <Plus size={18} className="text-emerald-500 print:text-black" />
                                                        งานอื่น ๆ
                                                    </h4>
                                                    <div className="pl-6 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed print:text-gray-700">
                                                        {day.taskOther}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- ปัญหาและอุปสรรค / ข้อเสนอแนะ --- */}
                {searchQuery === "" && filterType === "all" && filteredDays.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 print:break-inside-avoid"
                    >
                        <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 p-6 md:p-8 rounded-3xl transition-all hover:shadow-md print:bg-white print:border-gray-400">
                            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400 mb-4 print:text-black">
                                <AlertCircle size={22} />
                                ปัญหาและอุปสรรค
                            </h3>
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">
                                {currentWeekData?.problem}
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-6 md:p-8 rounded-3xl transition-all hover:shadow-md print:bg-white print:border-gray-400">
                            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4 print:text-black">
                                <CheckCircle size={22} />
                                แนวทางแก้ปัญหา
                            </h3>
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">
                                {currentWeekData?.solution}
                            </p>
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    );
}