// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, ShieldAlert, Lock, Mail, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
// --- Import Component พื้นหลังใหม่ ---
import ParticlesBg from "@/components/ParticlesBg";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push("/admin");
            router.refresh();
        } catch (err: any) {
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // ใส่ overflow-hidden เพื่อไม่ให้จุดหลุดขอบจอ
        <div className="min-h-screen relative flex items-center justify-center bg-[#09090b] overflow-hidden font-sans">



            {/* --- 2. Background Glow Effects (เหมือนหน้า Splash - เก็บไว้เพื่อให้ดูมีมิติ) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse -z-10" />

            {/* --- Back to Home --- */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-8 left-8 z-20" // เพิ่ม z-index ให้สูงกว่า Particles
            >
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-white/5">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-sm font-medium">กลับหน้าหลัก</span>
                </Link>
            </motion.div>

            {/* --- Login Card --- */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[400px] px-6" // z-10 ให้อยู่เหนือพื้นหลัง
            >
                {/* เพิ่ม bg-black/40 และ backdrop-blur-xl เพื่อให้ Card ดูลอยเหนือจุดแสง */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.5 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-2xl mb-6 shadow-xl shadow-white/10"
                        >
                            <LogIn size={28} />
                        </motion.div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Admin Login</h1>
                        <p className="text-gray-500 text-sm">ยินดีต้อนรับกลับเข้าสู่ระบบจัดการข้อมูล</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2"
                                >
                                    <ShieldAlert size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/5 focus:border-white/20 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-sm"
                                    placeholder="admin-only@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/5 focus:border-white/20 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-white/5"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "เข้าสู่ระบบการจัดการ"
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* --- Footer Note ---
                <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[3px]">
                    Secured by Supabase Auth
                </p> */}
            </motion.div>
            {/* --- 1. NEW Animated Particle Background --- */}
            <ParticlesBg />
        </div>

    );
}