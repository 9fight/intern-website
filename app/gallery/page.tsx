"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera, CalendarDays } from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

// --- คอมโพเนนต์สำหรับ Carousel ในแต่ละสัปดาห์ ---
const WeekCarousel = ({ weekNum, images }: { weekNum: number; images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // --- ส่วนที่เพิ่ม/แก้ไขใหม่ ---
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        const currentSrc = target.src;

        if (currentSrc.endsWith('.jpg')) {
            // ถ้า .jpg พัง ลองเปลี่ยนเป็น .png
            target.src = currentSrc.replace('.jpg', '.png');
        } else {
            // ถ้าไม่ใช่ .jpg (อาจจะเป็น .png ที่พังแล้ว) ให้โชว์ Placeholder เดิมของคุณ
            const isDark = document.documentElement.classList.contains("dark");
            target.src = `https://placehold.co/800x450/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"
                }?text=Week+${weekNum}+-+${currentIndex + 1}`;
        }
    };



    // ระบบเลื่อนรูปอัตโนมัติ (หยุดเมื่อเอาเมาส์ชี้)
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000); // เปลี่ยนรูปทุกๆ 4 วินาที
        return () => clearInterval(timer);
    }, [images.length, isHovered]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-[#111113] rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/5 transition-all duration-300"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-bold text-xl transition-colors duration-300 shadow-inner">
                    W{weekNum}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">
                        สัปดาห์ที่ {weekNum}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">
                        บันทึกการปฏิบัติงานและการเรียนรู้
                    </p>
                </div>
            </div>

            {/* พื้นที่แสดงรูปภาพ */}
            <div
                className="relative w-full aspect-video rounded-2xl overflow-hidden group bg-gray-100 dark:bg-[#1a1a1c] transition-colors duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Week ${weekNum} - Image ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        // ใส่รูป Placeholder เผื่อว่าหารูปไม่เจอ
                        onError={handleImageError}
                    />
                </AnimatePresence>

                {/* ปุ่มเลื่อนซ้าย */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* ปุ่มเลื่อนขวา */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                    <ChevronRight size={24} />
                </button>

                {/* จุดนำทาง (Dots) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "bg-white/50 hover:bg-white/80"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function PhotosPage() {
    // สร้างข้อมูลสัปดาห์ 1-8 อัตโนมัติ พร้อมตั้งชื่อไฟล์ภาพ weekX-Y.jpg
    const weeksData = Array.from({ length: 8 }, (_, i) => {
        const weekNum = i + 1;
        return {
            weekNum,
            images: [
                `/image/gallery/week${weekNum}-1.jpg`,
                `/image/gallery/week${weekNum}-2.jpg`,
                `/image/gallery/week${weekNum}-3.jpg`,
            ],
        };
    });

    return (
        <main
            style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
            className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
        >
            {/* 1. Navbar */}

            {/* 2. Hero Banner */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: "url('/image/office.png')" }} // ใช้รูปออฟฟิศเป็นพื้นหลัง
                >
                    {/* ปรับสี Overlay ใน Dark Mode ให้เข้มขึ้นเป็น /80 เพื่อให้ตัวหนังสือโดดเด่น */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-[4px] transition-colors duration-300"></div>
                    {/* Gradient เฟดลงกลืนกับพื้นหลังของหน้าหลัก */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F7] dark:from-[#09090b] to-transparent transition-colors duration-300"></div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-6 border border-black/10 dark:border-white/10 transition-colors duration-300">
                            <Camera size={16} className="text-black dark:text-white transition-colors duration-300" />
                            <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white transition-colors duration-300">
                                Internship Gallery
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-black dark:text-white transition-colors duration-300">
                            ประมวลภาพการปฏิบัติงาน
                        </h1>
                        <p className="text-lg md:text-xl text-[#424245] dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors duration-300">
                            รวบรวมภาพบรรยากาศการทำงาน การเรียนรู้ และกิจกรรมต่างๆ
                            ตลอดระยะเวลาการฝึกประสบการณ์วิชาชีพที่ HYPHEN + PLUS
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3. สไลด์รูปภาพ 8 สัปดาห์ */}
            <section className="py-20 px-6 md:px-20 relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                    <CalendarDays className="text-black dark:text-white transition-colors duration-300" size={32} />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white transition-colors duration-300">
                        Timeline (8 Weeks)
                    </h2>
                </div>

                {/* ใช้ CSS Grid ในการจัดเรียง (ถ้าจอกว้างจะโชว์ 2 คอลัมน์) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {weeksData.map((week) => (
                        <WeekCarousel
                            key={week.weekNum}
                            weekNum={week.weekNum}
                            images={week.images}
                        />
                    ))}
                </div>
            </section>

            {/* Theme Toggle Component */}
            <Theme />

            {/* 4. Footer */}
            <Footer />
        </main>
    );
}