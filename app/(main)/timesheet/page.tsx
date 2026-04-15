"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Clock, CalendarRange, CheckCircle2, Timer, BarChart3, Eye, AlertCircle, FileX } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

// --- Custom Tooltip สำหรับกราฟ ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-black/5 dark:border-white/10"
            >
                <p className="font-black text-sm text-gray-900 dark:text-white mb-2">{label}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
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

// --- Skeleton Components ---
const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#111113] rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-white/5 animate-pulse">
        <div className="w-full aspect-[3/4] rounded-[1.5rem] bg-gray-100 dark:bg-white/5 mb-4" />
        <div className="px-2 space-y-3">
            <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-3/4" />
            <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-1/2" />
        </div>
    </div>
);

const SkeletonChart = () => (
    <div className="w-full h-[300px] bg-gray-50 dark:bg-white/5 rounded-[1.5rem] animate-pulse" />
);

export default function TimesheetPage() {
    const [timesheets, setTimesheets] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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

                    return {
                        name: `สัปดาห์ ${week.week_num}`,
                        hours: hours,
                    };
                });

                setChartData(formattedChartData);
                setTotalHours(tempTotalHours);
            }
            setIsLoading(false);
        };

        fetchTimesheets();
    }, []);

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <main className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">

            {/* --- Hero Banner --- */}
            <section className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: "url('/image/office.png')" }}
                >
                    <div className="absolute inset-0 bg-white/70 dark:bg-black/80 backdrop-blur-sm transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F7] dark:from-[#09090b] to-transparent transition-colors duration-300" />
                </div>

                <div className="relative z-10 text-center px-4 md:px-6 mt-6 md:mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-4 border border-black/10 dark:border-white/10 transition-colors duration-300 cursor-default"
                        >
                            <Clock size={16} className="text-black dark:text-white" strokeWidth={2.5} />
                            <span className="text-xs md:text-sm font-black tracking-widest uppercase text-black dark:text-white">
                                Attendance Record
                            </span>
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-black dark:text-white transition-colors duration-300">
                            ตารางลงเวลาฝึกงาน
                        </h1>
                        <p className="text-sm md:text-lg text-[#424245] dark:text-gray-400 max-w-2xl mx-auto font-bold transition-colors duration-300">
                            บันทึกเวลาการเข้า-ออกสถานประกอบการในแต่ละสัปดาห์ เพื่อแสดงความตรงต่อเวลาและความรับผิดชอบ
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Timesheet Grid --- */}
            <section className="py-10 md:py-16 px-4 md:px-8 lg:px-20 relative z-10 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : timesheets.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {timesheets.map((week) => (
                            <motion.div
                                key={week.week_num}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-[#111113] rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white/5 group"
                            >
                                <Link href={`/timesheet/${week.week_num}`} className="block relative">
                                    <div className="w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-gray-50 dark:bg-[#1a1a1c] mb-4 relative flex items-center justify-center border border-gray-100 dark:border-white/5">
                                        {week.timesheet_image ? (
                                            <img
                                                src={week.timesheet_image}
                                                alt={`Timesheet Week ${week.week_num}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform duration-500">
                                                <FileX size={48} strokeWidth={1.5} className="mb-2" />
                                                <span className="text-xs font-black uppercase tracking-widest">No Document</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                                            <div className="px-5 py-3 bg-white dark:bg-[#111113] rounded-2xl text-black dark:text-white font-black text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                                <Eye size={18} strokeWidth={2.5} />
                                                <span>ดูรายละเอียด</span>
                                            </div>
                                        </div>

                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-black dark:text-white shadow-sm transition-colors duration-300 z-30">
                                            Week {week.week_num}
                                        </div>
                                    </div>
                                </Link>

                                <div className="px-2">
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 font-bold">
                                        <CalendarRange size={14} strokeWidth={2.5} className="shrink-0" />
                                        <span className="truncate">{week.date_range}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs md:text-sm font-black ${week.status?.includes('เรียบร้อย') || week.status?.includes('ครบถ้วน')
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {week.status?.includes('เรียบร้อย') || week.status?.includes('ครบถ้วน') ? (
                                            <CheckCircle2 size={16} strokeWidth={2.5} className="shrink-0" />
                                        ) : (
                                            <AlertCircle size={16} strokeWidth={2.5} className="shrink-0" />
                                        )}
                                        <span className="truncate">{week.status || 'รอระบุสถานะ'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-[#111113] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <FileX size={48} strokeWidth={1.5} className="mb-4 opacity-30" />
                        <p className="font-black text-lg">ยังไม่มีข้อมูลการลงเวลา</p>
                    </div>
                )}
            </section>

            {/* --- Attendance Chart Section --- */}
            <section className="pb-10 md:pb-16 px-4 md:px-8 lg:px-20 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-[#111113] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-gray-100 dark:border-white/5"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                            <BarChart3 size={24} strokeWidth={2.5} className="text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                สถิติการเข้าปฏิบัติงาน
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 font-bold mt-1">
                                แสดงชั่วโมงการทำงานรวมในแต่ละสัปดาห์
                            </p>
                        </div>
                    </div>

                    <div className="h-[250px] md:h-[300px] w-full">
                        {isLoading ? (
                            <SkeletonChart />
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.15} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#888', fontWeight: 900 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#888', fontWeight: 900 }}
                                        domain={[0, 45]}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#888', opacity: 0.1, radius: 12 }} />
                                    <Bar dataKey="hours" radius={[12, 12, 0, 0]} maxBarSize={40} animationDuration={1500}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} className="fill-black dark:fill-white hover:opacity-70 transition-opacity duration-300 cursor-pointer" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-bold text-sm bg-gray-50 dark:bg-white/5 rounded-[1.5rem] border border-dashed border-gray-200 dark:border-white/10">
                                <BarChart3 size={32} className="opacity-20 mb-2" />
                                ไม่มีข้อมูลสถิติ
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* --- รวมชั่วโมงทั้งหมด --- */}
            <section className="pb-24 px-4 md:px-8 lg:px-20 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-black dark:bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white dark:from-black to-transparent transition-opacity duration-500 group-hover:opacity-20" />

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 bg-white/10 dark:bg-black/5 rounded-2xl flex items-center justify-center mb-6 cursor-pointer"
                        >
                            <Timer size={32} strokeWidth={2.5} className="text-white dark:text-black" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-black text-white dark:text-black mb-2 tracking-tight">
                            รวมชั่วโมงปฏิบัติงานทั้งหมด
                        </h2>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 font-bold">
                            ตลอดระยะเวลาการฝึกประสบการณ์วิชาชีพ
                        </p>

                        <div className="flex items-baseline gap-3">
                            {isLoading ? (
                                <div className="h-20 w-40 bg-white/20 dark:bg-black/10 rounded-3xl animate-pulse" />
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-9xl font-black text-white dark:text-black tracking-tighter leading-none"
                                >
                                    {totalHours}
                                </motion.span>
                            )}
                            <span className="text-xl md:text-2xl font-black text-gray-400 dark:text-gray-500">
                                ชั่วโมง
                            </span>
                        </div>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}