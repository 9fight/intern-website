"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, AlertCircle, CheckCircle, Briefcase, Plus, Image as ImageIcon } from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

// ฟังก์ชันแปลงวันที่เป็นภาษาไทย
const formatDateThai = (date: Date) => {
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// ฟังก์ชันสร้างข้อมูล 8 สัปดาห์อัตโนมัติ (9 มี.ค. 2026 - 30 เม.ย. 2026)
const generateWeeksData = () => {
    const weeks = [];
    let currentDate = new Date(2026, 2, 9); // 9 มีนาคม 2026 (เดือนเริ่มที่ 0)
    const endDate = new Date(2026, 3, 30); // 30 เมษายน 2026

    for (let w = 1; w <= 8; w++) {
        const days = [];
        const weekStartDate = new Date(currentDate);

        // สร้างข้อมูล 7 วันในแต่ละสัปดาห์
        for (let d = 1; d <= 7; d++) {
            if (currentDate > endDate) break; // ถ้าเลย 30 เมษา ให้หยุด

            const dayOfWeek = currentDate.getDay(); // 0 = อา, 1 = จ, ..., 6 = ส
            const isHoliday = dayOfWeek === 0 || dayOfWeek === 6; // เสาร์-อาทิตย์เป็นวันหยุด

            days.push({
                id: d,
                dateStr: formatDateThai(currentDate),
                dayName: ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"][dayOfWeek],
                isHoliday,
                image: isHoliday ? `/image/holiday.jpg` : `/image/gallery/week${w}-${d}.jpg`,
                // Placeholder สำหรับแก้ไขภายหลัง
                taskMain: isHoliday ? "วันหยุดพักผ่อน" : "/* ใส่รายละเอียดงานที่ปฏิบัติ ตรงกับภาระงานของอาชีพที่นี่ */",
                taskOther: isHoliday ? "-" : "ไม่มี",
            });

            currentDate.setDate(currentDate.getDate() + 1); // บวกไปทีละวัน
        }

        if (days.length > 0) {
            const weekEndDate = new Date(currentDate);
            weekEndDate.setDate(weekEndDate.getDate() - 1); // ถอยกลับ 1 วันเพื่อหาจุดจบของสัปดาห์

            weeks.push({
                weekNum: w,
                dateRange: `${formatDateThai(weekStartDate)} - ${formatDateThai(weekEndDate)}`,
                days,
                problem: "/* ใส่รายละเอียด ปัญหา / อุปสรรค ที่พบในสัปดาห์นี้ */",
                solution: "/* ใส่รายละเอียด แนวทางแก้ปัญหา / เสนอแนะ ในสัปดาห์นี้ */"
            });
        }
    }
    return weeks;
};

export default function ReportsPage() {
    const weeksData = useMemo(() => generateWeeksData(), []);
    const [selectedWeek, setSelectedWeek] = useState(1);

    const currentWeekData = weeksData.find(w => w.weekNum === selectedWeek) || weeksData[0];

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
                        key={selectedWeek} // ให้แอนิเมชันเล่นใหม่ตอนเปลี่ยนสัปดาห์
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-4 border border-black/10 dark:border-white/10">
                            <FileText size={16} className="text-black dark:text-white" />
                            <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white">
                                Weekly Report
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black dark:text-white">
                            รายงานการฝึกงานสัปดาห์ที่ {currentWeekData.weekNum}
                        </h1>

                        <div className="flex items-center gap-2 text-lg md:text-xl text-[#424245] dark:text-gray-400 font-medium bg-white/50 dark:bg-black/50 px-6 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                            <Calendar size={20} />
                            <span>{currentWeekData.dateRange}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Tabs เลือกสัปดาห์ --- */}
            <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-6">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 p-2 bg-white dark:bg-[#111113] rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 transition-colors duration-300">
                    {weeksData.map((week) => (
                        <button
                            key={week.weekNum}
                            onClick={() => setSelectedWeek(week.weekNum)}
                            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all duration-300 flex-1 min-w-[120px] text-center ${selectedWeek === week.weekNum
                                ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                }`}
                        >
                            สัปดาห์ที่ {week.weekNum}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- รายละเอียดรายวัน --- */}
            <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedWeek}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-8"
                    >
                        {currentWeekData.days.map((day, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col lg:flex-row gap-8 bg-white dark:bg-[#111113] p-8 rounded-3xl shadow-sm border ${day.isHoliday ? "border-dashed border-gray-300 dark:border-gray-700 opacity-80" : "border-gray-100 dark:border-white/5"
                                    } transition-colors duration-300`}
                            >
                                {/* รูปภาพ */}
                                <div className="w-full lg:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 relative group flex-shrink-0">
                                    <img
                                        src={day.image}
                                        alt={`Day ${day.id}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            const currentSrc = target.src;
                                            const isDark = document.documentElement.classList.contains("dark");

                                            // 1. ถ้าหารูป .jpg ไม่เจอ ให้ลองเปลี่ยนเป็น .png
                                            if (currentSrc.endsWith('.jpg')) {
                                                target.src = currentSrc.replace('.jpg', '.png');
                                                return;
                                            }

                                            // 2. ถ้า .png ก็ยังไม่เจอ หรือไฟล์เสีย ให้ใช้ Placeholder
                                            if (currentSrc.endsWith('.png') || !currentSrc.includes('placehold.co')) {
                                                // แยกสี Placeholder ระหว่างวันหยุด กับ วันทำงานปกติ
                                                if (day.isHoliday) {
                                                    target.src = `https://placehold.co/800x600/${isDark ? "1e1e20/666666" : "f3f4f6/aaaaaa"}?text=Holiday`;
                                                } else {
                                                    target.src = `https://placehold.co/800x600/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"}?text=Week+${currentWeekData.weekNum}+-+Day+${day.id}`;
                                                }
                                            }
                                        }}
                                    />
                                    {day.isHoliday && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <span className="bg-white/90 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                                วันหยุด
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* รายละเอียด */}
                                <div className="w-full lg:w-2/3 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <span className={day.isHoliday ? "text-gray-400" : "text-black dark:text-white"}>
                                            {day.dayName}ที่ {day.dateStr}
                                        </span>
                                    </h3>

                                    <div className="space-y-6">
                                        {/* หัวข้อ 1 */}
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2 text-lg text-black dark:text-white mb-2">
                                                <Briefcase size={18} className="text-blue-500" />
                                                1. งานที่ได้ปฏิบัติและตรงกับภาระงานของอาชีพ
                                            </h4>
                                            <div className="pl-6 text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                                {day.taskMain}
                                            </div>
                                        </div>

                                        {/* หัวข้อ 2 */}
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2 text-lg text-black dark:text-white mb-2">
                                                <Plus size={18} className="text-green-500" />
                                                2. งานอื่น ๆ ที่ได้ปฏิบัติ
                                            </h4>
                                            <div className="pl-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {day.taskOther}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* --- ปัญหาและอุปสรรค / ข้อเสนอแนะ --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* ปัญหา */}
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                                    <AlertCircle size={24} />
                                    ปัญหา / อุปสรรค
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {currentWeekData.problem}
                                </p>
                            </div>

                            {/* ข้อเสนอแนะ */}
                            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4">
                                    <CheckCircle size={24} />
                                    แนวทางแก้ปัญหา / เสนอแนะ
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {currentWeekData.solution}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            <Theme />
            <Footer />
        </main>
    );
}