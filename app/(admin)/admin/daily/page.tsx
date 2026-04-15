"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Search, Inbox, X, Loader2, Save, Briefcase, SunMedium, Image as ImageIcon, UploadCloud, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminDailyTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWeek, setSelectedWeek] = useState<string>("1");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [formData, setFormData] = useState({
        id: null as any, week_num: "", day_id: "", date_str: "", day_name: "วันจันทร์",
        is_holiday: false, image_url: "", task_main: "", task_other: ""
    });

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('daily_tasks').select('*').order('week_num', { ascending: true }).order('day_id', { ascending: true });
        if (data) {
            setTasks(data);
            if (data.length > 0) setSelectedWeek(data[data.length - 1].week_num.toString()); // เลือกสัปดาห์ล่าสุด
        }
        setIsLoading(false);
    };

    // --- Search & Grouping Logic ---
    const filteredTasks = useMemo(() => tasks.filter(t => t.date_str?.includes(searchTerm) || t.task_main?.includes(searchTerm) || t.week_num?.toString().includes(searchTerm)), [tasks, searchTerm]);
    const groupedTasks = useMemo(() => filteredTasks.reduce((acc: any, curr: any) => {
        if (!acc[curr.week_num]) acc[curr.week_num] = [];
        acc[curr.week_num].push(curr);
        return acc;
    }, {}), [filteredTasks]);
    const currentWeekTasks = groupedTasks[selectedWeek] || [];

    // --- CRUD Handlers ---
    const handleOpenModal = (mode: "add" | "edit", task?: any) => {
        setModalMode(mode); setImageFile(null);
        if (mode === "edit" && task) {
            setFormData({ ...task, week_num: task.week_num || "", day_id: task.day_id || "" }); setPreviewUrl(task.image_url || "");
        } else {
            setFormData({ id: null, week_num: selectedWeek || "", day_id: "", date_str: "", day_name: "วันจันทร์", is_holiday: false, image_url: "", task_main: "", task_other: "" }); setPreviewUrl("");
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) { setImageFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true);
        try {
            let finalImageUrl = formData.image_url;
            if (imageFile) {
                const fileName = `${Date.now()}.${imageFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('task_images').upload(fileName, imageFile);
                if (uploadError) throw new Error("อัปโหลดรูปภาพไม่สำเร็จ");
                finalImageUrl = supabase.storage.from('task_images').getPublicUrl(fileName).data.publicUrl;
            }
            const payload = { ...formData, image_url: finalImageUrl, week_num: Number(formData.week_num), day_id: Number(formData.day_id) }; delete payload.id;
            if (modalMode === "add") {
                const { error } = await supabase.from('daily_tasks').insert([payload]); if (error) throw error;
            } else {
                const { error } = await supabase.from('daily_tasks').update(payload).eq('id', formData.id); if (error) throw error;
            }
            Swal.fire({ icon: 'success', title: 'บันทึกข้อมูลสำเร็จ!', timer: 1500, showConfirmButton: false });
            setIsModalOpen(false); setSelectedWeek(payload.week_num.toString()); fetchTasks();
        } catch (error: any) { Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message, confirmButtonColor: '#000' }); } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({ title: "ยืนยันการลบ?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'ลบทิ้ง', cancelButtonText: 'ยกเลิก' });
        if (result.isConfirmed) {
            const { error } = await supabase.from('daily_tasks').delete().eq('id', id);
            if (!error) { Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', timer: 1500, showConfirmButton: false }); setTasks(tasks.filter(t => t.id !== id)); }
        }
    };

    return (
        <div className="w-full relative min-h-screen font-sans pb-20">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 px-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">จัดการงานรายวัน</h1>
                    <p className="text-gray-500 text-sm font-medium">บันทึกและแก้ไขรายละเอียดงานแยกตามสัปดาห์</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white" size={18} />
                        <input type="text" placeholder="ค้นหางาน, วันที่..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                    <button onClick={() => handleOpenModal("add")} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
                        <Plus size={18} strokeWidth={2.5} /> เพิ่มงานใหม่
                    </button>
                </motion.div>
            </div>

            {/* --- Week Selector Tabs --- */}
            <div className="px-4">
                {!isLoading && Object.keys(groupedTasks).length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-6 mb-2">
                        {Object.keys(groupedTasks).map((weekNum) => (
                            <button key={weekNum} onClick={() => setSelectedWeek(weekNum)}
                                className={`flex-shrink-0 px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 flex items-center gap-2 ${selectedWeek === weekNum ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-white text-gray-500 dark:bg-[#111113] border border-gray-200 dark:border-white/5 hover:bg-gray-50'
                                    }`}
                            >
                                <Calendar size={16} strokeWidth={2.5} /> สัปดาห์ที่ {weekNum}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* --- Timeline Content (Admin Layout) --- */}
            <div className="px-4 max-w-5xl mx-auto">
                {isLoading ? (
                    <div className="border-l-2 border-gray-200 ml-8 space-y-8 animate-pulse pt-4">
                        {[1, 2].map(i => <div key={i} className="pl-10 h-32 bg-white dark:bg-[#111113] rounded-[2rem] border border-gray-100 dark:border-white/5" />)}
                    </div>
                ) : Object.keys(groupedTasks).length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/50 dark:bg-[#111113]/50">
                        <Inbox className="text-gray-300 dark:text-gray-600 mb-4" size={40} />
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">ยังไม่มีบันทึกงาน</h3>
                    </div>
                ) : currentWeekTasks.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 font-bold bg-white dark:bg-[#111113] rounded-[2rem] border border-gray-100 dark:border-white/5">ไม่พบข้อมูลที่ค้นหาในสัปดาห์นี้</div>
                ) : (
                    <motion.div key={selectedWeek} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="relative border-l-2 border-gray-200 dark:border-white/10 ml-4 md:ml-8 space-y-6 md:space-y-10 pb-10">
                        {currentWeekTasks.map((task: any) => (
                            <motion.div key={task.id} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="relative pl-8 md:pl-12 group">
                                <div className="absolute -left-[11px] top-8 w-5 h-5 rounded-full bg-indigo-500 border-4 border-[#F5F5F7] dark:border-[#09090b] shadow-sm transition-transform group-hover:scale-125" />

                                <div className={`bg-white dark:bg-[#111113] rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-xl flex flex-col lg:flex-row gap-6 relative ${task.is_holiday ? 'opacity-90 bg-gray-50/50' : ''}`}>
                                    {/* Action Buttons (Edit / Delete) มุมขวาบน */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal("edit", task)} className="p-2.5 bg-white/90 dark:bg-black/50 backdrop-blur text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-xl shadow-sm border border-gray-100 dark:border-white/10"><Edit3 size={16} strokeWidth={2.5} /></button>
                                        <button onClick={() => handleDelete(task.id)} className="p-2.5 bg-white/90 dark:bg-black/50 backdrop-blur text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl shadow-sm border border-gray-100 dark:border-white/10"><Trash2 size={16} strokeWidth={2.5} /></button>
                                    </div>

                                    {/* Image */}
                                    <div className="w-full lg:w-64 aspect-[4/3] rounded-[1.25rem] bg-gray-100 dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                        {task.image_url ? <img src={task.image_url} alt="Task" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /> : <div className="flex flex-col items-center text-gray-400"><ImageIcon size={32} strokeWidth={1.5} /><span className="text-[10px] font-black uppercase tracking-widest mt-1">No Image</span></div>}
                                        {task.is_holiday && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><span className="bg-white text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase flex items-center gap-1.5"><SunMedium size={12} /> วันหยุด</span></div>}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-center pr-12">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{task.day_name}ที่ {task.date_str || "-"}</h3>
                                            <span className="bg-gray-100 dark:bg-white/10 text-gray-500 px-2.5 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1"><MapPin size={10} strokeWidth={2.5} /> Day {task.day_id}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle2 size={12} strokeWidth={2.5} /> งานหลัก</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed bg-gray-50 dark:bg-white/[0.02] p-3 rounded-xl border border-gray-100 dark:border-white/5">{task.task_main || "-"}</p>
                                            </div>
                                            {!task.is_holiday && task.task_other && task.task_other !== "-" && (
                                                <div>
                                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Briefcase size={12} strokeWidth={2.5} /> งานอื่นๆ</h4>
                                                    <p className="text-sm text-gray-500 font-medium leading-relaxed pl-2 border-l-2 border-gray-200 dark:border-white/10">{task.task_other}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* --- Modal Form (Split-pane Layout คงเดิม) --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white dark:bg-[#111113] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col max-h-[95vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                <h2 className="text-xl font-black flex items-center gap-3">{modalMode === "add" ? <Plus className="text-indigo-500" /> : <Edit3 className="text-blue-500" />} {modalMode === "add" ? "เพิ่มงานรายวันใหม่" : "แก้ไขข้อมูลงาน"}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full"><X size={18} strokeWidth={2.5} /></button>
                            </div>

                            <form id="taskForm" onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-1 p-6 md:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                    <div className="lg:col-span-2 space-y-3">
                                        <label className="text-sm font-black">รูปภาพประกอบ (ถ้ามี)</label>
                                        <div className="relative w-full aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-indigo-500 bg-gray-50 dark:bg-[#1a1a1c] flex flex-col items-center justify-center overflow-hidden transition-all group cursor-pointer">
                                            {previewUrl ? (
                                                <><img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2"><UploadCloud size={16} /> เปลี่ยนรูปภาพ</span></div></>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors"><div className="w-16 h-16 bg-white dark:bg-white/5 rounded-[1.25rem] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"><UploadCloud size={28} strokeWidth={1.5} /></div><span className="font-bold text-sm">คลิกเพื่ออัปโหลด</span><span className="text-[10px] font-bold mt-1 uppercase tracking-widest opacity-60">PNG, JPG (Max 5MB)</span></div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3 space-y-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1.5"><label className="text-sm font-bold ml-1">สัปดาห์ที่</label><input type="number" required value={formData.week_num} onChange={e => setFormData({ ...formData, week_num: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 font-bold" placeholder="เช่น 1" /></div>
                                            <div className="space-y-1.5"><label className="text-sm font-bold ml-1">วันที่ของสัปดาห์ (1-7)</label><input type="number" min="1" max="7" required value={formData.day_id} onChange={e => setFormData({ ...formData, day_id: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 font-bold" placeholder="เช่น 1" /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1.5"><label className="text-sm font-bold ml-1">วันที่ (Date)</label><input type="text" required value={formData.date_str} onChange={e => setFormData({ ...formData, date_str: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 font-bold" placeholder="เช่น 9 มี.ค. 2026" /></div>
                                            <div className="space-y-1.5"><label className="text-sm font-bold ml-1">วันในสัปดาห์</label><input type="text" required value={formData.day_name} onChange={e => setFormData({ ...formData, day_name: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 font-bold" placeholder="เช่น วันจันทร์" /></div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold ml-1">ประเภทวัน</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setFormData({ ...formData, is_holiday: false })} className={`flex-1 flex justify-center gap-2 py-3.5 rounded-xl border text-xs font-black uppercase ${!formData.is_holiday ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-[#1a1a1c] dark:border-white/5'}`}><Briefcase size={16} strokeWidth={2.5} /> วันทำงาน</button>
                                                <button type="button" onClick={() => setFormData({ ...formData, is_holiday: true })} className={`flex-1 flex justify-center gap-2 py-3.5 rounded-xl border text-xs font-black uppercase ${formData.is_holiday ? 'bg-amber-50 border-amber-500 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-[#1a1a1c] dark:border-white/5'}`}><SunMedium size={16} strokeWidth={2.5} /> วันหยุด</button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5"><label className="text-sm font-bold ml-1">รายละเอียดงานหลัก</label><textarea rows={2} value={formData.task_main} onChange={e => setFormData({ ...formData, task_main: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 resize-none font-bold" placeholder="กรอกรายละเอียด..." /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-bold ml-1">งานอื่นๆ (ถ้ามี)</label><textarea rows={2} value={formData.task_other} onChange={e => setFormData({ ...formData, task_other: e.target.value })} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3.5 outline-none focus:ring-2 ring-indigo-500/50 resize-none font-bold" placeholder="งานเพิ่มเติม..." /></div>
                                    </div>
                                </div>
                            </form>
                            <div className="p-6 md:px-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">ยกเลิก</button>
                                <button type="submit" form="taskForm" disabled={isSubmitting} className="bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50">
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={2.5} />} {modalMode === "add" ? "บันทึกข้อมูล" : "อัปเดตการเปลี่ยนแปลง"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}