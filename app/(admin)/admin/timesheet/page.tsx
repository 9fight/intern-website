"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, UploadCloud, Loader2, Image as ImageIcon, AlertCircle, Trash2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminTimesheet() {
    const [timesheets, setTimesheets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingWeek, setUploadingWeek] = useState<number | null>(null);

    useEffect(() => {
        fetchTimesheets();
    }, []);

    // --- [READ] ดึงข้อมูล ---
    const fetchTimesheets = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('weekly_reports')
                .select('week_num, date_range, timesheet_image')
                .order('week_num', { ascending: true });

            if (error) throw error;
            if (data) setTimesheets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- [CREATE / UPDATE] อัปโหลดหรือเปลี่ยนรูปภาพ ---
    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, weekNum: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // เช็คประเภทและขนาดไฟล์ (ไม่เกิน 5MB)
        if (!file.type.startsWith('image/')) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ไม่ถูกต้อง', text: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', confirmButtonColor: '#000' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB', confirmButtonColor: '#000' });
            return;
        }

        setUploadingWeek(weekNum);
        try {
            // 1. อัปโหลดไปที่ Supabase Storage (Bucket 'timesheets')
            const fileExt = file.name.split('.').pop();
            const fileName = `week-${weekNum}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('timesheets')
                .upload(`public/${fileName}`, file);

            if (uploadError) throw uploadError;

            // 2. ดึง URL รูปภาพ
            const { data: { publicUrl } } = supabase.storage
                .from('timesheets')
                .getPublicUrl(`public/${fileName}`);

            // 3. อัปเดตข้อมูลลงตาราง weekly_reports
            const { error: dbError } = await supabase
                .from('weekly_reports')
                .update({ timesheet_image: publicUrl })
                .eq('week_num', weekNum);

            if (dbError) throw dbError;

            fetchTimesheets(); // โหลดข้อมูลใหม่
            Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'อัปโหลดล้มเหลว', text: error.message, confirmButtonColor: '#000' });
        } finally {
            setUploadingWeek(null);
            e.target.value = ''; // รีเซ็ต input
        }
    };

    // --- [DELETE] ลบรูปลงเวลา ---
    const handleDeleteImage = async (weekNum: number) => {
        const result = await Swal.fire({
            title: `ลบใบลงเวลาสัปดาห์ที่ ${weekNum}?`,
            text: "รูปภาพจะถูกลบออกจากการรายงาน แต่ข้อมูลสัปดาห์ยังคงอยู่",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ลบทิ้ง',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from('weekly_reports')
                    .update({ timesheet_image: null })
                    .eq('week_num', weekNum);

                if (error) throw error;
                fetchTimesheets();
                Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', timer: 1500, showConfirmButton: false });
            } catch (error: any) {
                Swal.fire({ icon: 'error', title: 'ลบล้มเหลว', text: error.message, confirmButtonColor: '#000' });
            }
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } } as const;

    return (
        <div className="w-full relative min-h-screen pb-10">
            {/* Background Glow */}
            <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 px-2">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 tracking-tight mb-2">
                        ใบลงเวลา
                    </h1>
                    <p className="text-gray-500 text-sm font-bold">อัปโหลดและตรวจสอบหลักฐานการลงเวลา</p>
                </motion.div>
            </div>

            {/* Content & Skeleton Loader */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 px-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/50 dark:bg-[#111113]/50 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 h-[320px] animate-pulse flex flex-col p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded-full mb-3" />
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded-md" />
                                </div>
                                <div className="h-10 w-10 bg-gray-200 dark:bg-white/10 rounded-2xl" />
                            </div>
                            <div className="flex-1 bg-gray-200 dark:bg-white/10 rounded-[1.5rem] w-full mt-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 px-2">
                    {timesheets.map((ts) => (
                        <motion.div key={ts.week_num} variants={itemVariants} className="bg-white dark:bg-[#111113] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">

                            {/* Card Header */}
                            <div className="p-6 md:p-8 pb-4 flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">
                                        Week {ts.week_num}
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-base">{ts.date_range || "ยังไม่กำหนดช่วงเวลา"}</p>
                                </div>
                                <div className={`p-3 rounded-2xl transition-colors ${ts.timesheet_image ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-gray-50 dark:bg-white/5 text-gray-400'}`}>
                                    {ts.timesheet_image ? <ImageIcon size={20} strokeWidth={2.5} /> : <AlertCircle size={20} strokeWidth={2.5} />}
                                </div>
                            </div>

                            {/* Dropzone / Image Viewer */}
                            <div className="p-6 md:p-8 pt-0 flex-1">
                                {ts.timesheet_image ? (
                                    <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/10 group-hover:shadow-md transition-all">
                                        <img src={ts.timesheet_image} alt={`Timesheet Week ${ts.week_num}`} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />

                                        {/* Hover Actions (Mobile: always show a bit, Desktop: hover) */}
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">

                                            <label className="bg-white text-black px-5 py-3 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer w-36 justify-center">
                                                {uploadingWeek === ts.week_num ? <Loader2 size={18} className="animate-spin" /> : <><Edit3 size={18} strokeWidth={2.5} /> เปลี่ยนรูป</>}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadImage(e, ts.week_num)} disabled={uploadingWeek !== null} />
                                            </label>

                                            <button
                                                onClick={() => handleDeleteImage(ts.week_num)}
                                                className="bg-red-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all w-36 justify-center"
                                            >
                                                <Trash2 size={18} strokeWidth={2.5} /> ลบรูปภาพ
                                            </button>

                                        </div>
                                    </div>
                                ) : (
                                    <label className={`w-full aspect-[4/3] border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${uploadingWeek === ts.week_num
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
                                        : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'
                                        }`}>
                                        {uploadingWeek === ts.week_num ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 size={32} className="animate-spin mb-2" />
                                                <span className="text-sm font-bold">กำลังอัปโหลด...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-500">
                                                    <UploadCloud size={24} strokeWidth={2.5} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">คลิกเพื่ออัปโหลด</span>
                                                <span className="text-[11px] font-bold mt-1 text-gray-400 uppercase tracking-widest">JPG, PNG (Max 5MB)</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadImage(e, ts.week_num)} disabled={uploadingWeek !== null} />
                                    </label>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}