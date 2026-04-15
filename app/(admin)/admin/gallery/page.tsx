"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Images, Trash2, Loader2, Calendar, X, FolderHeart,
    UploadCloud, Edit3, CheckCircle2, AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminGallery() {
    const [groupedImages, setGroupedImages] = useState<Record<string, any[]>>({
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('daily_tasks')
                .select('id, day_id, image_url, date_str, task_main, week_num, is_holiday')
                .order('week_num', { ascending: true })
                .order('day_id', { ascending: true });

            if (error) throw error;

            if (data) {
                const grouped: Record<string, any[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };
                data.forEach(task => {
                    if (grouped[task.week_num]) grouped[task.week_num].push(task);
                });
                setGroupedImages(grouped);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ไม่ถูกต้อง', text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น', confirmButtonColor: '#000' });
            return;
        }

        setUploadingId(taskId);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${taskId}-${Date.now()}.${fileExt}`;
            const filePath = `tasks/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

            const { error: dbError } = await supabase.from('daily_tasks').update({ image_url: publicUrl }).eq('id', taskId);
            if (dbError) throw dbError;

            Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', timer: 1000, showConfirmButton: false });
            fetchGallery();
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
        } finally {
            setUploadingId(null);
        }
    };

    const handleDelete = async (taskId: number, imageUrl: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบรูปภาพ?',
            text: "คุณต้องการลบรูปภาพประกอบงานชิ้นนี้ใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบทิ้ง',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const { error: dbError } = await supabase.from('daily_tasks').update({ image_url: null }).eq('id', taskId);
                if (dbError) throw dbError;
                fetchGallery();
            } catch (error: any) {
                Swal.fire({ icon: 'error', title: 'ลบล้มเหลว', text: error.message });
            }
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <div className="w-full relative min-h-screen font-sans pb-10">
            <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* Header Section */}
            <div className="mb-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
                        คลังรูปภาพ
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">จัดการรูปภาพหลักฐานการทำงานแต่ละสัปดาห์</p>
                </motion.div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-[2rem] bg-gray-100 dark:bg-white/5 animate-pulse border border-gray-200/50 dark:border-white/5" />
                    ))}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(groupedImages).map(([week, tasks]) => {
                        const hasImagesCount = tasks.filter(t => t.image_url).length;
                        return (
                            <motion.div
                                key={week} variants={itemVariants} onClick={() => setSelectedWeek(week)}
                                className="group cursor-pointer bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between aspect-square relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-500/5 transition-all duration-500" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <FolderHeart size={32} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Week {week}</span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">สัปดาห์ที่ {week}</h3>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                        <Images size={16} /> <span>{hasImagesCount} รูปภาพ</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modal Layer */}
            <AnimatePresence>
                {selectedWeek && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedWeek(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-6xl bg-white dark:bg-[#111113] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl">
                                <div>
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        <FolderHeart className="text-blue-500" /> อัลบั้มสัปดาห์ที่ {selectedWeek}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium mt-1">จัดการภาพประกอบรายวัน</p>
                                </div>
                                <button onClick={() => setSelectedWeek(null)} className="p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50 dark:bg-transparent">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                                    {groupedImages[selectedWeek].map((task) => (
                                        <div key={task.id} className="h-full bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm flex flex-col group">

                                            {/* Photo Area (แก้ไขให้ความสูงล็อกตายตัว 100%) */}
                                            <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-[#111113] shrink-0 overflow-hidden">
                                                {task.is_holiday ? (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                        <Calendar size={32} strokeWidth={1.5} className="mb-2" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">วันหยุด</span>
                                                    </div>
                                                ) : task.image_url ? (
                                                    <>
                                                        <img src={task.image_url} alt="task" className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${uploadingId === task.id ? 'opacity-50 grayscale' : ''}`} />

                                                        {/* Action Buttons Overlay */}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                            <label className="p-3 bg-white text-black rounded-[1rem] hover:bg-gray-200 transition-transform hover:scale-110 cursor-pointer shadow-lg active:scale-95">
                                                                {uploadingId === task.id ? <Loader2 size={18} className="animate-spin" /> : <Edit3 size={18} strokeWidth={2.5} />}
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, task.id)} disabled={uploadingId !== null} />
                                                            </label>
                                                            <button onClick={() => handleDelete(task.id, task.image_url)} disabled={uploadingId !== null} className="p-3 bg-red-500 text-white rounded-[1rem] hover:bg-red-600 transition-transform hover:scale-110 shadow-lg active:scale-95 disabled:opacity-50">
                                                                <Trash2 size={18} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="absolute inset-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-500/5 transition-colors border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[1.5rem]">
                                                        {uploadingId === task.id ? (
                                                            <Loader2 size={24} className="animate-spin text-blue-500" />
                                                        ) : (
                                                            <>
                                                                <UploadCloud size={28} strokeWidth={1.5} className="text-gray-400 mb-2" />
                                                                <span className="text-xs font-bold text-gray-500">เพิ่มรูปภาพ</span>
                                                            </>
                                                        )}
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, task.id)} disabled={uploadingId !== null} />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Detail Area */}
                                            <div className="p-5 flex-1 flex flex-col justify-start">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-md text-gray-500">{task.date_str}</span>
                                                    {task.image_url && <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-500" />}
                                                </div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                                                    {task.task_main || "ไม่มีรายละเอียดงาน"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {groupedImages[selectedWeek].length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <AlertCircle size={48} strokeWidth={1} className="mb-4" />
                                        <p className="font-bold">ยังไม่มีข้อมูลงานในสัปดาห์นี้</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}