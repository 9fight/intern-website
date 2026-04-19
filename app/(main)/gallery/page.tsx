"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, Camera, CalendarDays,
    X, ZoomIn, Images, FolderOpen, Sparkles, Layers
} from "lucide-react";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Theme from "@/components/Theme";

// ==========================================
// 1. Skeleton Loading สำหรับรูปแบบ Album
// ==========================================
const AlbumSkeleton = () => (
    <div className="relative w-full aspect-[4/3] group">
        {/* Stack Backgrounds */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-3xl transform -rotate-6 scale-95 opacity-50 animate-pulse"></div>
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-3xl transform rotate-3 scale-95 opacity-50 animate-pulse" style={{ animationDelay: '0.1s' }}></div>

        {/* Main Card */}
        <div className="relative z-10 w-full h-full bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden animate-pulse flex flex-col justify-end p-6">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </div>
    </div>
);

// ==========================================
// 2. Component Album Card (รูปซ้อนกัน)
// ==========================================
const WeekAlbumCard = ({
    weekNum,
    images,
    onClick
}: {
    weekNum: number;
    images: string[];
    onClick: () => void;
}) => {
    const hasImages = images.length > 0;
    const coverImage = hasImages ? images[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={hasImages ? "hover" : "initial"}
            whileTap={hasImages ? "tap" : "initial"}
            onClick={hasImages ? onClick : undefined}
            className={`relative w-full aspect-[4/3] ${hasImages ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} group perspective-1000`}
        >
            {/* --- Stacked Cards Effect (ใบที่อยู่ด้านหลัง) --- */}
            {hasImages && (
                <>
                    <motion.div
                        variants={{
                            initial: { rotate: -3, scale: 0.95, x: -10, y: 10 },
                            hover: { rotate: -8, scale: 0.95, x: -25, y: 15 }
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 bg-white dark:bg-[#1a1a1c] rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 z-0 origin-bottom-left"
                    >
                        {images[1] && <img src={images[1]} className="w-full h-full object-cover rounded-3xl opacity-50 grayscale" alt="stack-back-1" />}
                    </motion.div>

                    <motion.div
                        variants={{
                            initial: { rotate: 3, scale: 0.95, x: 10, y: 10 },
                            hover: { rotate: 8, scale: 0.95, x: 25, y: 15 }
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 bg-gray-50 dark:bg-[#222225] rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 z-0 origin-bottom-right"
                    >
                        {images[2] && <img src={images[2]} className="w-full h-full object-cover rounded-3xl opacity-50 grayscale" alt="stack-back-2" />}
                    </motion.div>
                </>
            )}

            {/* --- Main Front Card --- */}
            <motion.div
                variants={{
                    initial: { y: 0, scale: 1 },
                    hover: { y: -10, scale: 1.02 },
                    tap: { scale: 0.98 }
                }}
                className="relative z-10 w-full h-full bg-white dark:bg-[#111113] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/10"
            >
                {hasImages ? (
                    <>
                        <img
                            src={coverImage}
                            alt={`Week ${weekNum} Cover`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Shimmer Light Effect */}
                        <motion.div
                            variants={{
                                initial: { left: "-100%" },
                                hover: { left: "200%" }
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                            className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] z-20"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 z-30 flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                                        <FolderOpen size={20} />
                                    </div>
                                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                        WEEK {weekNum}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                                    สัปดาห์ที่ {weekNum}
                                </h3>
                                <div className="flex items-center gap-1.5 text-gray-200 text-sm font-medium">
                                    <Images size={16} />
                                    <span>{images.length} รูปภาพ</span>
                                </div>
                            </div>

                            <motion.div
                                variants={{
                                    initial: { opacity: 0, x: -10 },
                                    hover: { opacity: 1, x: 0 }
                                }}
                                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            >
                                <ChevronRight size={24} />
                            </motion.div>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1a1a1c] border-2 border-dashed border-gray-200 dark:border-white/10 m-4 rounded-2xl">
                        <Layers size={48} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1} />
                        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-1">สัปดาห์ที่ {weekNum}</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-600">ยังไม่มีรูปภาพ</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};


export default function PhotosPage() {
    const [weeksData, setWeeksData] = useState<{ weekNum: number, images: string[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State สำหรับ Modal รวมรูปประจำสัปดาห์
    const [selectedWeek, setSelectedWeek] = useState<{ weekNum: number, images: string[] } | null>(null);

    // State สำหรับ Lightbox ดูรูปเต็ม
    const [lightbox, setLightbox] = useState<{ images: string[]; currentIndex: number } | null>(null);

    // --- ดึงข้อมูล ---
    useEffect(() => {
        const fetchGalleryData = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('daily_tasks')
                    .select('week_num, image_url')
                    .not('image_url', 'is', null)
                    .eq('is_holiday', false)
                    .order('week_num', { ascending: true })
                    .order('day_id', { ascending: true });

                if (error) throw error;

                const grouped: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };

                if (data) {
                    data.forEach(task => {
                        if (task.week_num >= 1 && task.week_num <= 8 && task.image_url) {
                            grouped[task.week_num].push(task.image_url);
                        }
                    });
                }

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

    // --- จัดการ Scroll Lock สำหรับทั้ง Modal และ Lightbox ---
    useEffect(() => {
        if (selectedWeek || lightbox) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedWeek, lightbox]);

    // --- Lightbox Controls ---
    const openLightbox = (images: string[], index: number) => setLightbox({ images, currentIndex: index });
    const closeLightbox = () => setLightbox(null);
    const lightboxNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightbox) setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length });
    }, [lightbox]);
    const lightboxPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightbox) setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length });
    }, [lightbox]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightbox) {
                if (e.key === "Escape") closeLightbox();
                if (e.key === "ArrowRight") lightboxNext();
                if (e.key === "ArrowLeft") lightboxPrev();
            } else if (selectedWeek && e.key === "Escape") {
                setSelectedWeek(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightbox, selectedWeek, lightboxNext, lightboxPrev]);

    const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        if (target.src.endsWith('.jpg')) target.src = target.src.replace('.jpg', '.png');
    };

    return (
        <main
            style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
            className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 transition-colors duration-300"
        >
            {/* --- Hero Banner (คงเดิม) --- */}
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md mb-6 border border-black/10 dark:border-white/10">
                            <Sparkles size={16} className="text-black dark:text-white" />
                            <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white">
                                Internship Gallery
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-black dark:text-white">
                            ประมวลภาพการปฏิบัติงาน
                        </h1>
                        <p className="text-lg md:text-xl text-[#424245] dark:text-gray-400 max-w-2xl mx-auto font-medium">
                            รวบรวมภาพบรรยากาศการทำงาน การเรียนรู้ และกิจกรรมต่างๆ
                            ตลอดระยะเวลาการฝึกประสบการณ์วิชาชีพที่ HYPHEN + PLUS
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Album Grid Section --- */}
            <section className="py-10 pb-32 px-6 md:px-20 relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                    <CalendarDays className="text-black dark:text-white" size={32} />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white">
                        Weekly Albums
                    </h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <AlbumSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
                        {weeksData.map((week) => (
                            <WeekAlbumCard
                                key={week.weekNum}
                                weekNum={week.weekNum}
                                images={week.images}
                                onClick={() => setSelectedWeek(week)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- MODAL อัลบั้มประจำสัปดาห์ (Grid รูปทั้งหมด) --- */}
            <AnimatePresence>
                {selectedWeek && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center sm:p-6"
                        onClick={() => setSelectedWeek(null)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#111113] w-full max-w-5xl h-[85vh] md:h-[80vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-white/10"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                                        W{selectedWeek.weekNum}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">อัลบั้มสัปดาห์ที่ {selectedWeek.weekNum}</h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">ทั้งหมด {selectedWeek.images.length} รูปภาพ</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedWeek(null)}
                                    className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body (Grid รูปภาพ) */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50 dark:bg-[#09090b]/50">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {selectedWeek.images.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.05, zIndex: 10 }}
                                            onClick={() => openLightbox(selectedWeek.images, idx)}
                                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl border border-gray-200 dark:border-white/10"
                                        >
                                            <img
                                                src={img}
                                                alt={`Week ${selectedWeek.weekNum} - ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={handleImageFallback}
                                            />
                                            {/* Hover Zoom Icon */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                                    <ZoomIn size={24} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LIGHTBOX (ดูรูปเต็มจอ) --- */}
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
                        <button onClick={closeLightbox} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110]">
                            <X size={24} />
                        </button>

                        <button onClick={lightboxPrev} className="absolute left-4 md:left-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden sm:block">
                            <ChevronLeft size={32} />
                        </button>

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
                                onError={handleImageFallback}
                            />
                        </motion.div>

                        <button onClick={lightboxNext} className="absolute right-4 md:right-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-[110] hidden sm:block">
                            <ChevronRight size={32} />
                        </button>

                        {/* Mobile Controls */}
                        <div className="absolute bottom-16 flex gap-10 sm:hidden z-[110]">
                            <button onClick={lightboxPrev} className="p-3 bg-white/10 text-white rounded-full"><ChevronLeft size={24} /></button>
                            <button onClick={lightboxNext} className="p-3 bg-white/10 text-white rounded-full"><ChevronRight size={24} /></button>
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-medium tracking-widest text-sm z-[110] bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                            {lightbox.currentIndex + 1} / {lightbox.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}