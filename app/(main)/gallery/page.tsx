"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera, CalendarDays, X, ZoomIn, Images } from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

// --- คอมโพเนนต์สำหรับ Carousel ในแต่ละสัปดาห์ ---
const WeekCarousel = ({
    weekNum,
    images,
    onOpenLightbox
}: {
    weekNum: number;
    images: string[];
    onOpenLightbox: (images: string[], index: number) => void;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        const currentSrc = target.src;

        if (currentSrc.endsWith('.jpg')) {
            target.src = currentSrc.replace('.jpg', '.png');
        } else {
            const isDark = document.documentElement.classList.contains("dark");
            target.src = `https://placehold.co/800x450/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"}?text=Week+${weekNum}+-+${currentIndex + 1}`;
        }
    };

    useEffect(() => {
        if (isHovered || images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length, isHovered]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

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
                        {images.length > 0 ? `บันทึกการปฏิบัติงาน (${images.length} รูป)` : "ยังไม่มีรูปภาพ"}
                    </p>
                </div>
            </div>

            {/* พื้นที่แสดงรูปภาพ */}
            {images.length > 0 ? (
                <div
                    className="relative w-full aspect-video rounded-2xl overflow-hidden group bg-gray-100 dark:bg-[#1a1a1c] transition-colors duration-300 cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => onOpenLightbox(images, currentIndex)}
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
                            onError={handleImageError}
                        />
                    </AnimatePresence>

                    {/* Overlay แว่นขยายตอน Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform scale-90 group-hover:scale-100 transition-all duration-300">
                            <ZoomIn size={28} />
                        </div>
                    </div>

                    {/* ปุ่มเลื่อนซ้าย-ขวา (แสดงเฉพาะเมื่อมีรูปมากกว่า 1 รูป) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg z-20"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg z-20"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* จุดนำทาง (Dots) */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        : "bg-white/50 hover:bg-white/80"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Empty State (ยังไม่มีรูปภาพในสัปดาห์นี้) */
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-400">
                    <Images size={40} className="mb-3 opacity-30" strokeWidth={1.5} />
                    <span className="text-xs font-bold tracking-widest uppercase">No Photos Yet</span>
                </div>
            )}
        </motion.div>
    );
};

export default function PhotosPage() {
    const [weeksData, setWeeksData] = useState<{ weekNum: number, images: string[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lightbox, setLightbox] = useState<{ images: string[]; currentIndex: number } | null>(null);

    // --- ดึงข้อมูลรูปภาพจาก Supabase ---
    useEffect(() => {
        const fetchGalleryData = async () => {
            setIsLoading(true);
            try {
                // ดึงเฉพาะงานที่มีรูปภาพ และ สเตตัส is_holiday ต้องเป็น false (ไม่ใช่วันหยุด)
                const { data, error } = await supabase
                    .from('daily_tasks')
                    .select('week_num, image_url')
                    .not('image_url', 'is', null)
                    .eq('is_holiday', false) // 👉 เพิ่มเงื่อนไขกรองวันหยุดตรงนี้
                    .order('week_num', { ascending: true })
                    .order('day_id', { ascending: true });

                if (error) throw error;

                // สร้างโครงสร้างพื้นฐาน 8 สัปดาห์
                const grouped: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };

                if (data) {
                    data.forEach(task => {
                        // ป้องกันข้อมูลหลุดขอบเขต 1-8
                        if (task.week_num >= 1 && task.week_num <= 8 && task.image_url) {
                            grouped[task.week_num].push(task.image_url);
                        }
                    });
                }

                // แปลงข้อมูลให้อยู่ในรูปแบบ Array เพื่อส่งให้ Component
                const formattedWeeks = Object.keys(grouped).map(key => ({
                    weekNum: Number(key),
                    images: grouped[Number(key)]
                }));

                setWeeksData(formattedWeeks);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    // --- ฟังก์ชันควบคุม Lightbox ---
    const openLightbox = (images: string[], index: number) => {
        setLightbox({ images, currentIndex: index });
    };

    const closeLightbox = () => setLightbox(null);

    const lightboxNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightbox) {
            setLightbox({
                ...lightbox,
                currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length
            });
        }
    }, [lightbox]);

    const lightboxPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightbox) {
            setLightbox({
                ...lightbox,
                currentIndex: (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length
            });
        }
    }, [lightbox]);

    // จัดการ Event Keyboard & Scroll Lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightbox) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") lightboxNext();
            if (e.key === "ArrowLeft") lightboxPrev();
        };

        if (lightbox) {
            document.body.style.overflow = "hidden"; // ล็อกหน้าจอไม่ให้เลื่อน
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [lightbox, lightboxNext, lightboxPrev]);

    const handleLightboxImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        const currentSrc = target.src;
        if (currentSrc.endsWith('.jpg')) {
            target.src = currentSrc.replace('.jpg', '.png');
        } else {
            const isDark = document.documentElement.classList.contains("dark");
            target.src = `https://placehold.co/1200x800/${isDark ? "1e1e20/ffffff" : "e2e8f0/000000"}?text=Image+Not+Found`;
        }
    };

    return (
        <main
            style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
            className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
        >
            {/* <Navbar /> */}

            {/* --- Hero Banner --- */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: "url('/image/office.png')" }}
                >
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-[4px] transition-colors duration-300"></div>
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

            {/* --- สไลด์รูปภาพ 8 สัปดาห์ --- */}
            <section className="py-20 px-6 md:px-20 relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                    <CalendarDays className="text-black dark:text-white transition-colors duration-300" size={32} />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white transition-colors duration-300">
                        Timeline (8 Weeks)
                    </h2>
                </div>

                {isLoading ? (
                    /* --- Skeleton Loading (UX ที่เนียนตากับ Grid เดิม) --- */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white/50 dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 animate-pulse">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                                    <div className="space-y-3 flex-1">
                                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md" />
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
                                    </div>
                                </div>
                                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {weeksData.map((week) => (
                            <WeekCarousel
                                key={week.weekNum}
                                weekNum={week.weekNum}
                                images={week.images}
                                onOpenLightbox={openLightbox}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- LIGHTBOX COMPONENT --- */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* ปุ่มปิด */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110]"
                        >
                            <X size={24} />
                        </button>

                        {/* ปุ่ม Prev */}
                        <button
                            onClick={lightboxPrev}
                            className="absolute left-4 md:left-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden sm:block"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* รูปภาพ Fullscreen */}
                        <motion.div
                            key={lightbox.currentIndex}
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={lightbox.images[lightbox.currentIndex]}
                                alt={`Gallery Image ${lightbox.currentIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                                onError={handleLightboxImageError}
                            />
                        </motion.div>

                        {/* ปุ่ม Next */}
                        <button
                            onClick={lightboxNext}
                            className="absolute right-4 md:right-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden sm:block"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* การคุมผ่านมือถือ (กรณีจอเล็ก) */}
                        <div className="absolute bottom-16 flex gap-10 sm:hidden z-[110]">
                            <button onClick={lightboxPrev} className="p-3 bg-white/10 text-white rounded-full"><ChevronLeft size={24} /></button>
                            <button onClick={lightboxNext} className="p-3 bg-white/10 text-white rounded-full"><ChevronRight size={24} /></button>
                        </div>

                        {/* ตัวบอกจำนวนรูปด้านล่าง */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-medium tracking-widest text-sm z-[110] bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                            {lightbox.currentIndex + 1} / {lightbox.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* <Theme />
            <Footer /> */}
        </main>
    );
}