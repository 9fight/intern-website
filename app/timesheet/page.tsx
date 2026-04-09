"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, CalendarRange, CheckCircle2, Timer } from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

// ฟังก์ชันแปลงวันที่เป็นภาษาไทย
const formatDateThai = (date: Date) => {
    const months = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`; // แปลงเป็น พ.ศ. ให้ดูเป็นทางการ
};

// ฟังก์ชันคำนวณช่วงวันที่ 8 สัปดาห์ (9 มี.ค. 2026 - 30 เม.ย. 2026)
const generateTimesheetData = () => {
    const weeks = [];
    let currentDate = new Date(2026, 2, 9); // 9 มีนาคม 2026 (เดือนเริ่มที่ 0)
    const endDate = new Date(2026, 3, 30); // 30 เมษายน 2026

    for (let w = 1; w <= 8; w++) {
        const weekStartDate = new Date(currentDate);

        // บวกไป 6 วันเพื่อหาวันอาทิตย์ (จบสัปดาห์)
        let weekEndDate = new Date(currentDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);

        // ถ้าวันจบสัปดาห์เลยวันที่ 30 เมษา ให้ตัดจบแค่วันที่ 30 เมษา
        if (weekEndDate > endDate) {
            weekEndDate = new Date(endDate);
        }

        weeks.push({
            weekNum: w,
            dateRange: `${formatDateThai(weekStartDate)} - ${formatDateThai(weekEndDate)}`,
            image: `/image/timesheet/week${w}.jpg`,
            status: "ลงเวลาครบถ้วน" // ข้อความสถานะ (สามารถแก้ได้)
        });

        // เลื่อน currentDate ไปวันจันทร์ของสัปดาห์ถัดไป
        currentDate.setDate(weekStartDate.getDate() + 7);
        if (currentDate > endDate) break;
    }
    return weeks;
};

export default function TimesheetPage() {
    const timesheetData = useMemo(() => generateTimesheetData(), []);

    // ตัวแปรสำหรับกำหนดชั่วโมงรวม (คุณสามารถมาแก้ไขตัวเลขตรงนี้ได้เลย)
    const totalHours = "320";

    return (
        <main
            style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
            className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
        >
            {/* <Navbar /> */}

            {/* --- Hero Banner --- */}
            <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: "url('/image/office.png')" }}
                >
                    <div className="absolute inset-0 bg-white/70 dark:bg-black/80 backdrop-blur-sm transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F7] dark:from-[#09090b] to-transparent transition-colors duration-300"></div>
                </div>

                <div className="relative z-10 text-center px-6 mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-4 border border-black/10 dark:border-white/10 transition-colors duration-300">
                            <Clock size={16} className="text-black dark:text-white" />
                            <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white">
                                Attendance Record
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black dark:text-white transition-colors duration-300">
                            ตารางลงเวลาฝึกงาน
                        </h1>
                        <p className="text-lg md:text-xl text-[#424245] dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors duration-300">
                            บันทึกเวลาการเข้า-ออกสถานประกอบการในแต่ละสัปดาห์
                            เพื่อแสดงความตรงต่อเวลาและความรับผิดชอบ
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Timesheet Grid (สัปดาห์ 1-8) --- */}
            <section className="py-16 px-6 md:px-20 relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {timesheetData.map((week, index) => (
                        <motion.div
                            key={week.weekNum}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-[#111113] rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-white/5 group"
                        >
                            {/* รูปตารางเวลา */}
                            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 mb-4 relative">
                                <img
                                    src={week.image}
                                    alt={`Timesheet Week ${week.weekNum}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    // --- ส่วนที่แก้ไขใหม่ ---
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const currentSrc = target.src;

                                        // 1. ถ้า .jpg พัง ลองเปลี่ยนเป็น .png
                                        if (currentSrc.endsWith('.jpg')) {
                                            target.src = currentSrc.replace('.jpg', '.png');
                                            return; // ออกจากฟังก์ชันก่อน ไม่ต้องไปทำข้อ 2
                                        }

                                        // 2. ถ้าไม่ใช่ .jpg (อาจจะเป็น .png ที่พังแล้ว) ให้โชว์ Placeholder
                                        if (currentSrc.endsWith('.png') || !currentSrc.includes('placehold.co')) {
                                            const isDark = document.documentElement.classList.contains("dark");
                                            target.src = `https://placehold.co/600x800/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"
                                                }?text=Timesheet+W${week.weekNum}`;
                                        }
                                    }}
                                // ------------------------
                                />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-black dark:text-white shadow-sm transition-colors duration-300">
                                    สัปดาห์ที่ {week.weekNum}
                                </div>
                            </div>

                            {/* ข้อมูลวันที่ */}
                            <div className="px-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                                    <CalendarRange size={14} />
                                    <span>{week.dateRange}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                                    <CheckCircle2 size={16} />
                                    <span>{week.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- รวมชั่วโมงทั้งหมด --- */}
            <section className="pb-24 px-6 md:px-20 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-black dark:bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden transition-colors duration-300"
                >
                    {/* Background Pattern อ่อนๆ */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white dark:from-black to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/10 dark:bg-black/5 rounded-full flex items-center justify-center mb-6">
                            <Timer size={32} className="text-white dark:text-black" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-black mb-2 transition-colors duration-300">
                            รวมชั่วโมงปฏิบัติงานทั้งหมด
                        </h2>
                        <p className="text-gray-400 dark:text-gray-500 mb-6 transition-colors duration-300">
                            ตลอดระยะเวลาการฝึกประสบการณ์วิชาชีพ
                        </p>

                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-8xl font-black text-white dark:text-black tracking-tighter transition-colors duration-300">
                                {totalHours}
                            </span>
                            <span className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-500 transition-colors duration-300">
                                ชั่วโมง
                            </span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Theme />
            <Footer />
        </main>
    );
}