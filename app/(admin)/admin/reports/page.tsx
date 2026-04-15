"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, FileText, Search, Inbox, X, Loader2, Save, Clock, CheckCircle2, Timer } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // อัปเดต formData ให้รองรับ total_hours
    const [formData, setFormData] = useState({
        id: null as any,
        week_num: "",
        date_range: "",
        problem: "",
        solution: "",
        status: "รออัปเดต",
        total_hours: 0
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('weekly_reports')
            .select('*, daily_tasks(count)')
            .order('week_num', { ascending: false });

        if (data) setReports(data);
        setIsLoading(false);
    };

    const handleOpenAdd = () => {
        setModalMode("add");
        setFormData({ id: null, week_num: "", date_range: "", problem: "", solution: "", status: "รออัปเดต", total_hours: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (report: any) => {
        setModalMode("edit");
        setFormData({
            id: report.id,
            week_num: report.week_num,
            date_range: report.date_range || "",
            problem: report.problem || "",
            solution: report.solution || "",
            status: report.status || "รออัปเดต",
            total_hours: report.total_hours || 0
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            week_num: Number(formData.week_num),
            date_range: formData.date_range,
            problem: formData.problem,
            solution: formData.solution,
            status: formData.status,
            total_hours: Number(formData.total_hours) // ส่งค่าชั่วโมงเข้าไปบันทึก
        };

        try {
            if (modalMode === "add") {
                const checkExist = reports.find(r => r.week_num === payload.week_num);
                if (checkExist) {
                    Swal.fire({ icon: 'error', title: 'ไม่สามารถเพิ่มได้', text: `สัปดาห์ที่ ${payload.week_num} มีอยู่แล้วในระบบ!`, confirmButtonColor: '#000' });
                    setIsSubmitting(false);
                    return;
                }

                const { error } = await supabase.from('weekly_reports').insert([payload]);
                if (error) throw error;

                Swal.fire({ icon: 'success', title: 'เพิ่มข้อมูลสำเร็จ!', timer: 1500, showConfirmButton: false });
            } else {
                const { error } = await supabase.from('weekly_reports').update(payload).eq('id', formData.id);
                if (error) throw error;

                Swal.fire({ icon: 'success', title: 'แก้ไขข้อมูลสำเร็จ!', timer: 1500, showConfirmButton: false });
            }

            setIsModalOpen(false);
            fetchReports();
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message, confirmButtonColor: '#000' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number, weekNum: number) => {
        const result = await Swal.fire({
            title: `ยืนยันการลบสัปดาห์ที่ ${weekNum}?`,
            text: "หากลบแล้ว งานรายวันในสัปดาห์นี้จะหายไปทั้งหมด!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ใช่, ลบทิ้งเลย',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase.from('weekly_reports').delete().eq('id', id);
                if (error) throw error;

                Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', text: 'ข้อมูลถูกลบออกจากระบบแล้ว', timer: 1500, showConfirmButton: false });
                fetchReports();
            } catch (error: any) {
                Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message, confirmButtonColor: '#000' });
            }
        }
    };

    const filteredReports = reports.filter(r =>
        r.date_range?.includes(searchTerm) ||
        r.status?.includes(searchTerm) ||
        r.week_num?.toString().includes(searchTerm)
    );

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } } as const;

    return (
        <div className="w-full relative min-h-screen font-sans pb-10">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
                        จัดการรายงาน
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">บันทึก จัดการ และตรวจสอบรายงานประจำสัปดาห์ของคุณ</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black dark:group-focus-within:text-white" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาวันที่, สถานะ หรือสัปดาห์..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-72 pl-11 pr-4 py-3 bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
                        />
                    </div>

                    <button
                        onClick={handleOpenAdd}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/5 dark:shadow-white/5 group w-full sm:w-auto"
                    >
                        <Plus size={18} strokeWidth={2.5} className="transition-transform group-hover:rotate-90 duration-300" />
                        เพิ่มรายงาน
                    </button>
                </motion.div>
            </div>

            {/* --- Content Section --- */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 w-full bg-white/50 dark:bg-[#111113]/50 backdrop-blur-sm border border-gray-100 dark:border-white/5 rounded-[2rem] animate-pulse flex items-center p-5 gap-5">
                            <div className="w-14 h-14 bg-gray-200 dark:bg-white/10 rounded-[1.25rem]"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-lg w-1/3"></div>
                                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                    <AnimatePresence>
                        {filteredReports.map((report) => (
                            <motion.div
                                layout
                                key={report.id}
                                variants={itemVariants}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                className="group p-4 md:p-5 rounded-[2rem] bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 dark:via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-[1.25rem] bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-500 transition-colors">Week</span>
                                        <span className="text-lg md:text-xl font-black leading-none mt-0.5">{report.week_num}</span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-2">
                                            {report.date_range || "ยังไม่กำหนดช่วงเวลา"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${report.status?.includes('ครบ')
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                                                : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                                                }`}>
                                                {report.status?.includes('ครบ') ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                {report.status || "รออัปเดต"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-gray-100 dark:border-white/5">
                                                <Timer size={12} />
                                                <span>{report.total_hours || 0} ชม.</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-gray-100 dark:border-white/5">
                                                <FileText size={12} />
                                                <span>{report.daily_tasks?.[0]?.count || 0} งาน</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 relative z-10 pt-2 md:pt-0 border-t border-gray-100 dark:border-white/5 md:border-t-0 mt-2 md:mt-0">
                                    <button
                                        onClick={() => handleOpenEdit(report)}
                                        className="p-2.5 md:p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200"
                                    >
                                        <Edit3 size={18} strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report.id, report.week_num)}
                                        className="p-2.5 md:p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                                    >
                                        <Trash2 size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredReports.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] bg-gray-50/50 dark:bg-[#111113]/50">
                            <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-white/5">
                                <Inbox className="text-gray-400" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">ไม่พบข้อมูล</h3>
                            <p className="text-sm text-gray-500">ลองค้นหาด้วยคำอื่น หรือกด "เพิ่มรายงาน" เพื่อสร้างข้อมูลใหม่</p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* --- Modal Add / Edit --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-[#111113] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-full"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {modalMode === "add" ? <Plus className="text-emerald-500" /> : <Edit3 className="text-blue-500" />}
                                    {modalMode === "add" ? "สร้างรายงานสัปดาห์ใหม่" : `แก้ไขสัปดาห์ที่ ${formData.week_num}`}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <form id="reportForm" onSubmit={handleSubmit} className="space-y-5">
                                    {/* Row 1: สัปดาห์ & ชั่วโมงรวม */}
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">สัปดาห์ที่</label>
                                            <input
                                                type="number" min="1" required
                                                value={formData.week_num}
                                                onChange={e => setFormData({ ...formData, week_num: e.target.value })}
                                                disabled={modalMode === "edit"}
                                                className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black/5 dark:ring-white/10 transition-all disabled:opacity-50"
                                                placeholder="เช่น 1, 2"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">ชั่วโมงรวม (สัปดาห์นี้)</label>
                                            <div className="relative">
                                                <input
                                                    type="number" min="0" required
                                                    value={formData.total_hours}
                                                    onChange={e => setFormData({ ...formData, total_hours: Number(e.target.value) })}
                                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-2 ring-black/5 dark:ring-white/10 transition-all"
                                                    placeholder="เช่น 40"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">ชม.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: ช่วงวันที่ */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">ช่วงวันที่</label>
                                        <input
                                            type="text" required
                                            value={formData.date_range}
                                            onChange={e => setFormData({ ...formData, date_range: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black/5 dark:ring-white/10 transition-all"
                                            placeholder="เช่น 9 มีนาคม 2026 - 15 มีนาคม 2026"
                                        />
                                    </div>

                                    {/* Row 3: สถานะ */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">สถานะการส่ง</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: "รออัปเดต" })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold ${formData.status === 'รออัปเดต'
                                                    ? 'bg-amber-50 border-amber-500 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500 dark:text-amber-400'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-[#1a1a1c] dark:border-white/5 dark:text-gray-400 dark:hover:bg-white/5'
                                                    }`}
                                            >
                                                <Clock size={16} /> รออัปเดต
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: "บันทึกครบถ้วน" })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold ${formData.status === 'บันทึกครบถ้วน'
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-400'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-[#1a1a1c] dark:border-white/5 dark:text-gray-400 dark:hover:bg-white/5'
                                                    }`}
                                            >
                                                <CheckCircle2 size={16} /> ครบถ้วน
                                            </button>
                                        </div>
                                    </div>

                                    {/* Row 4: ปัญหา */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">ปัญหาและอุปสรรค</label>
                                        <textarea
                                            rows={2}
                                            value={formData.problem}
                                            onChange={e => setFormData({ ...formData, problem: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black/5 dark:ring-white/10 transition-all resize-none"
                                            placeholder="ระบุปัญหาที่พบ (ถ้าไม่มีให้ใส่ -)"
                                        />
                                    </div>

                                    {/* Row 5: วิธีแก้ */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">แนวทางแก้ไข</label>
                                        <textarea
                                            rows={2}
                                            value={formData.solution}
                                            onChange={e => setFormData({ ...formData, solution: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black/5 dark:ring-white/10 transition-all resize-none"
                                            placeholder="ระบุแนวทางแก้ปัญหา (ถ้าไม่มีให้ใส่ -)"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    form="reportForm"
                                    disabled={isSubmitting}
                                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {modalMode === "add" ? "บันทึกรายงาน" : "อัปเดตข้อมูล"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}