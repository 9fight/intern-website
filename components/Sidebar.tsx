"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, FileText, Briefcase, Images,
    Clock, LogOut, Menu, X, ChevronRight, UserCircle
} from "lucide-react";
import Swal from "sweetalert2";

// --- รายการเมนู ---
const menuItems = [
    { name: "แดชบอร์ด", href: "/admin", icon: LayoutDashboard },
    { name: "จัดการรายงาน (Weekly)", href: "/admin/reports", icon: FileText },
    { name: "จัดการงานรายวัน (Daily)", href: "/admin/daily", icon: Briefcase }, // เพิ่มเมนู Daily แล้ว
    { name: "คลังรูปภาพ", href: "/admin/gallery", icon: Images },
    { name: "ตารางลงเวลา", href: "/admin/timesheet", icon: Clock },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // ดึงข้อมูล User (ถ้ามี)
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserEmail(session.user.email || "Admin User");
            }
        };
        getUser();
    }, []);

    // ปิด Sidebar อัตโนมัติเมื่อเปลี่ยนหน้า (สำหรับมือถือ)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // ฟังก์ชันออกจากระบบ
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "ออกจากระบบ?",
            text: "คุณต้องการออกจากระบบใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ออกจากระบบ",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            setIsLoggingOut(true);
            await supabase.auth.signOut();
            router.push("/login");
        }
    };

    // --- Components ย่อย ---
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl md:shadow-sm overflow-hidden relative">
            {/* Header / Logo */}
            <div className="p-8 pb-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg">
                        <Briefcase size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                            Intern<span className="text-pink-500">Sys</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Menu Links */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-4 mt-2">Main Menu</p>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="block relative group">
                            {/* Active Indicator (Micro-interaction) */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-bg"
                                    className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                ? "text-dark-600 dark:text-dark-400 font-bold"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 font-medium hover:text-gray-900 dark:hover:text-white"
                                }`}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "scale-110 transition-transform" : ""} />
                                <span className="text-sm">{item.name}</span>
                                {isActive && <ChevronRight size={16} className="absolute right-4 opacity-50" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout (Bottom) */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <UserCircle size={32} strokeWidth={1.5} className="text-gray-400" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">ผู้ดูแลระบบ</p>
                        <p className="text-xs text-gray-500 font-medium truncate">{userEmail || "กำลังโหลด..."}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout} disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    {isLoggingOut ? "กำลังออก..." : "ออกจากระบบ"}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* --- Hamburger Menu Button (เฉพาะจอมือถือ) --- */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-5 left-5 z-40 p-3 bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                <Menu size={24} strokeWidth={2.5} />
            </button>

            {/* --- Sidebar Desktop (ซ่อนบนมือถือ) --- */}
            {/* อิงจาก layout ที่เว้นซ้าย 312px ตัว Sidebar นี้กว้าง 280px + margin 16px (m-4) พอดีเป๊ะ */}
            <div className="hidden md:block fixed top-4 left-4 bottom-4 w-[280px] z-30">
                <SidebarContent />
            </div>

            {/* --- Sidebar Mobile (Slide-in) --- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Mobile Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="md:hidden fixed top-4 left-4 bottom-4 w-[280px] z-50"
                        >
                            <SidebarContent />
                            {/* ปุ่มปิดบนมือถือ (อยู่นอกกล่องนิดนึง) */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 -right-14 p-3 bg-white dark:bg-[#111113] text-gray-900 dark:text-white rounded-full shadow-xl border border-gray-100 dark:border-white/5"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}