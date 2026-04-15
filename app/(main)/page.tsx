"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  MapPin, ChevronRight, Briefcase, Zap, Smartphone,
  Download, Code2, GraduationCap, Mail, ChevronUp,
  Bell, QrCode, ArrowRightLeft, Wallet, Home, User, Clock, ShoppingBag, Coffee,
  Sun, Moon, Target // เพิ่ม Icon Target เข้ามา
} from "lucide-react";

// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

export default function Homes() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Dark Mode Logic ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const teamImages = [
    "/image/person/pic1.jpg",
    "/image/person/pic2.jpg",
    "/image/person/pic3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [teamImages.length]);

  const profile = {
    id: "68319010015",
    name: "Chetsada Suthongsa",
    group: "ปวส.1 IT กลุ่ม 2",
    role: "Mobile app & Web Developer Intern",
    image: "/image/profile.png",
  };

  // --- 3D Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // ==========================================
  // --- ระบบคำนวณ Progress Bar (ไม่ใช้ State) ---
  // ==========================================
  const startDate = new Date(2026, 2, 9); // 9 มีนาคม 2026
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let currentWeek = Math.floor(diffDays / 7) + 1;
  // ป้องกันไม่ให้เกินขอบเขต 1-8 สัปดาห์
  if (currentWeek < 1) currentWeek = 1;
  if (currentWeek > 8) currentWeek = 8;

  const progressPercent = (currentWeek / 8) * 100;
  // ==========================================

  return (
    <main
      style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
      className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#09090b] dark:text-gray-100 overflow-hidden relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300"
    >
      {/* <Navbar /> */}

      {/* --- 2. Hero Section --- */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-20 pt-24 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300"
          style={{ backgroundImage: "url('/image/office.png')" }}
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-black/80 backdrop-blur-[3px] transition-colors duration-300"></div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 lg:pr-16 text-center lg:text-left items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black mb-6 w-max transition-colors duration-300">
              <GraduationCap size={14} className="text-white dark:text-black" />
              <span className="text-xs font-bold tracking-wide uppercase">นักศึกษาฝึกประสบการณ์ 2026</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tighter mb-4 leading-[1.05] uppercase transition-colors duration-300"
              style={{
                color: isDarkMode ? "#ffffff" : "#1d1d1f",
                textShadow: "0 0 10px rgba(255, 123, 0, 0.8), 0 0 20px rgba(255, 149, 0, 0.8), 0 0 40px rgba(255, 170, 0, 0.6), 0 0 80px rgba(255, 170, 0, 0.4)"
              }}
            >
              HYPHEN <br className="hidden sm:block" />
              <span
                style={{
                  color: "#e62e2e",
                  textShadow: "0 0 10px rgba(230, 46, 46, 0.8), 0 0 20px rgba(230, 46, 46, 0.6), 0 0 40px rgba(230, 46, 46, 0.4)"
                }}
              >
                +
              </span>{" "}
              PLUS
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-[#2d2d30] dark:text-gray-400 mb-8 max-w-md font-medium transition-colors duration-300 text-center lg:text-left">
              Startup ด้าน Software Tech & AI <br />
              <span className="text-base sm:text-lg font-extrabold text-black dark:text-white transition-colors duration-300">Digital Innovation Solutions</span>
            </p>

            {/* --- Progress Bar Component --- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full max-w-[380px] mb-12 bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 p-5 rounded-3xl shadow-sm text-left"
            >
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-[#e62e2e]" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    ความคืบหน้าการฝึกงาน
                  </span>
                </div>
                <span className="text-xs font-black text-black dark:text-white bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full">
                  สัปดาห์ที่ {currentWeek}/8
                </span>
              </div>

              <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-[#e62e2e] rounded-full"
                />
              </div>
              <p className="text-right mt-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                สำเร็จแล้ว {progressPercent}%
              </p>
            </motion.div>

            <motion.button
              onClick={() => router.push("/reports")}
              whileHover={{ scale: 1.05 }}
              className="bg-black dark:bg-white text-white dark:text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold flex items-center gap-2 shadow-xl transition-colors duration-300"
            >
              สำรวจผลงานการฝึกงาน <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] relative mt-20 lg:mt-0 flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-full flex items-center justify-center scale-[0.85] sm:scale-100">
            {teamImages.map((img, index) => {
              let offset = index - currentIndex;
              const halfLength = Math.floor(teamImages.length / 2);

              if (offset < -halfLength) offset += teamImages.length;
              if (offset > halfLength) offset -= teamImages.length;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isVisible = Math.abs(offset) <= 1;

              return (
                <motion.div
                  key={img}
                  initial={false}
                  animate={{
                    opacity: isCenter ? 1 : isVisible ? 0.4 : 0,
                    scale: isCenter ? 1 : isVisible ? 0.8 : 0.6,
                    x: isCenter ? 0 : isLeft ? -100 : isRight ? 100 : offset < 0 ? -150 : 150,
                    zIndex: isCenter ? 30 : isVisible ? 10 : 0,
                    rotateY: isCenter ? 0 : isLeft ? 15 : isRight ? -15 : 0,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute w-[240px] sm:w-[280px] lg:w-[320px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{ pointerEvents: isCenter ? "auto" : "none" }}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Team" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 3. About Me Section --- */}
      <section className="relative py-20 sm:py-24 px-6 sm:px-10 lg:px-20 z-10 bg-[#090912] text-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col items-center mb-16 sm:mb-20 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6 w-full justify-center mb-3">
            <div className="h-[1px] bg-white/10 w-16 sm:w-24 lg:w-48"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold tracking-wide text-white whitespace-nowrap">About Me</h2>
            <div className="h-[1px] bg-white/10 w-16 sm:w-24 lg:w-48"></div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-center">Transforming ideas into digital experiences</p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 flex flex-col text-center lg:text-left items-center lg:items-start"
          >
            <p className="text-[#00E5FF] text-lg sm:text-xl font-medium mb-3 tracking-wide">Hello, I'm</p>
            <motion.h3
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%)",
                backgroundSize: "200% auto",
              }}
              animate={{ backgroundPosition: ["-200% center", "200% center"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              {profile.name}
            </motion.h3>
            <p className="text-[#A0A0AB] leading-relaxed text-sm sm:text-base mb-10 text-justify lg:text-left px-2 sm:px-0">
              นักศึกษาฝึกประสบการณ์วิชาชีพ ระดับชั้น {profile.group} ที่มีความทุ่มเทในการพัฒนาระบบหลังบ้าน (Backend) และออกแบบสถาปัตยกรรมเว็บไซต์ ผมมีความเชี่ยวชาญในการเชื่อมโยงความต้องการทางเทคนิคที่ซับซ้อน เข้ากับการออกแบบที่เน้นผู้ใช้งานเป็นหลัก (UI/UX) พร้อมส่งมอบโซลูชันแบบ Full-stack ด้วย Laravel และ Node.js เพื่อผลลัพธ์ที่ตอบโจทย์และมีประสิทธิภาพสูงสุด
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href="/Resume_chetsada_fullstack.pdf" download className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all rounded-xl text-white font-medium text-sm shadow-[0_4px_20px_rgba(139,92,246,0.3)] w-full sm:w-auto">
                <Download size={18} /> Download CV
              </a>
              <a href="https://github.com/9fight" target="_blank" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-[#3A3A4A] hover:bg-white/5 transition-all rounded-xl text-white font-medium text-sm w-full sm:w-auto">
                <Code2 size={18} /> View Projects
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-2/5 flex justify-center lg:justify-end"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] rounded-full p-2 border border-[#3A3A4A] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[90%] h-[90%] bg-purple-600/30 rounded-full blur-[60px]" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[110%] h-[110%] bg-purple-500/20 rounded-full blur-[100px]"
                />
                <div className="absolute w-[70%] h-[70%] bg-cyan-400/10 rounded-full blur-[80px] -translate-x-10 -translate-y-10" />
              </div>
              <div className="relative w-full h-full rounded-full overflow-hidden" style={{ transform: "translateZ(50px)" }}>
                <Image src={profile.image} alt={profile.name} fill className="object-cover" priority />
              </div>
              <motion.div
                style={{ transform: "translateZ(51px)", opacity: useTransform(mouseYSpring, [-0.5, 0.5], [0.1, 0]) }}
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 4. Company Info --- */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-20 relative z-10 bg-white dark:bg-[#111113] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 sm:mb-7 text-black dark:text-white transition-colors duration-300">OFFICE <br className="hidden lg:block" />LOCATION</h2>
              <p className="text-[#424245] dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-10 lg:mb-12 font-normal transition-colors duration-300 px-2 sm:px-0">
                บริษัทดำเนินธุรกิจ Startup ด้าน Software Tech และ AI เราทุ่มเทในการพัฒนาและประยุกต์ใช้เทคโนโลยีสมัยใหม่
                ผลิตสินค้าทั้งเว็บไซต์และแอปพลิเคชันเพื่อให้บริการลูกค้าด้วยโซลูชันที่ล้ำสมัย
              </p>
              <div className="space-y-4 sm:space-y-5 text-left">
                <div className="p-5 sm:p-6 bg-black dark:bg-[#1D1D1F] rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-xl shadow-black/10 text-white hover:bg-[#1D1D1F] dark:hover:bg-[#2C2C2E] transition-colors duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#1C1C1E] dark:bg-black flex items-center justify-center text-white shadow-inner"><MapPin size={24} /></div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 sm:mb-1.5">สำนักงานใหญ่</h4>
                    <p className="text-[#86868B] text-xs sm:text-sm">71 ซอยรังสิต-นครนายก 59 ต.ประชาธิปัตย์ อ.ธัญบุรี ปทุมธานี 12150</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6 bg-[#F5F5F7] dark:bg-[#1D1D1F] rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-[#EAEAEF] dark:hover:bg-[#2C2C2E] transition-colors duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-black dark:text-white shadow transition-colors duration-300"><Briefcase size={24} /></div>
                  <div>
                    <h4 className="text-black dark:text-white font-bold text-sm mb-1 sm:mb-1.5 transition-colors duration-300">เวลาทำการ</h4>
                    <p className="text-[#424245] dark:text-gray-400 text-xs sm:text-sm font-medium transition-colors duration-300">จันทร์ - ศุกร์ : 8:30 – 17:30</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[450px] relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.308732047814!2d100.65581971167448!3d13.999710386307374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d7fc48ba3fb9f%3A0xc3ec5c381c1955b2!2zNzEg4LiL4Lit4LiiIOC4o-C4seC4h-C4quC4tOC4lS3guJnguITguKPguJnguLLguKLguIEgNTk!5e0!3m2!1sth!2sth!4v1714494200000!5m2!1sth!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-[1.5rem] sm:rounded-[2rem]"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 5. Earnback Product Section --- */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-20 relative z-10 bg-[#F5F5F7] dark:bg-[#0a0a0c] overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 z-20 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 border border-gray-100">
                <img src="/image/logo.png" alt="Earnback Logo" className="w-full h-auto object-contain" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00d1b2] uppercase">Featured Project</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tighter text-black dark:text-white mb-4 sm:mb-5 leading-[1.1] transition-colors duration-300">
              Earnback App. <br className="hidden sm:block" />
              <span className="text-[#00d1b2]">Smart Rewards.</span>
            </h2>
            <p className="text-[#424245] dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-8 sm:mb-10 font-normal max-w-lg transition-colors duration-300">
              ผลงานการมีส่วนร่วมในทีมพัฒนาแอปพลิเคชัน <b>Earnback</b>
              แพลตฟอร์มสะสมคะแนนและคืนกำไร (Cashback) ที่เปลี่ยนทุกการใช้จ่ายให้เป็นเรื่องสนุก
              ตัวระบบใช้สถาปัตยกรรม <b>Laravel</b> ที่มีความปลอดภัยสูงและจัดการข้อมูลได้อย่างแม่นยำ
            </p>

            <a
              href="https://www.earn-back.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-black dark:bg-[#00d1b2] text-white dark:text-black font-bold px-8 py-4 rounded-full hover:bg-[#00d1b2] dark:hover:bg-white transition-all shadow-xl hover:shadow-[#00d1b2]/20 w-full sm:w-auto"
            >
              ไปที่เว็บไซต์ Earnback <Smartphone size={18} />
            </a>
          </motion.div>

          {/* --- Phone Mockup --- */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
            {/* Wrapper สำหรับสเกลมือถือลงเมื่อหน้าจอเล็กกว่า 380px */}
            <div className="scale-[0.85] sm:scale-100 origin-center flex justify-center w-full">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[320px] h-[640px] bg-white rounded-[3.5rem] border-[12px] border-[#1D1D1F] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden z-20 shrink-0"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40"></div>

                <div className="w-full h-full bg-[#f8fafc] flex flex-col relative">
                  <div className="pt-14 px-5 pb-5 bg-white shadow-sm rounded-b-3xl relative z-20">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center p-1.5 border border-gray-100 overflow-hidden">
                          <img src={profile.image} alt="User" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Welcome back</p>
                          <p className="text-sm font-extrabold text-gray-900">Chetsada S.</p>
                        </div>
                      </div>
                      <div className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pt-5 pb-24 overflow-y-auto hide-scrollbar space-y-6">
                    <div className="w-full h-36 bg-gradient-to-br from-[#00d1b2] to-[#009b84] rounded-[1.5rem] p-5 text-white shadow-lg shadow-[#00d1b2]/30 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
                      <div className="flex justify-between items-center z-10">
                        <span className="text-[11px] font-medium opacity-90 tracking-wider">ยอดเงินคืนสะสม (Balance)</span>
                        <img src="/image/logo.png" alt="logo" className="w-6 h-6 brightness-0 invert opacity-50" />
                      </div>
                      <div className="z-10">
                        <span className="text-4xl font-black tracking-tight">฿ 1,250<span className="text-xl opacity-80">.00</span></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                      {[
                        { icon: QrCode, label: "Scan & Pay", color: "text-blue-500", bg: "bg-blue-50" },
                        { icon: ArrowRightLeft, label: "Transfer", color: "text-purple-500", bg: "bg-purple-50" },
                        { icon: Wallet, label: "Top Up", color: "text-orange-500", bg: "bg-orange-50" },
                        { icon: ShoppingBag, label: "Rewards", color: "text-[#00d1b2]", bg: "bg-[#00d1b2]/10" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
                            <item.icon size={20} strokeWidth={2.5} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-sm font-extrabold text-gray-900">Recent Cashback</h3>
                        <span className="text-[11px] font-bold text-[#00d1b2] cursor-pointer">See All</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Starbucks", date: "Today, 09:41 AM", amount: "+฿ 15.50", icon: Coffee, color: "bg-green-100 text-green-600" },
                          { name: "Shopee", date: "Yesterday, 14:20 PM", amount: "+฿ 42.00", icon: ShoppingBag, color: "bg-orange-100 text-orange-600" },
                          { name: "GrabFood", date: "24 Mar, 11:30 AM", amount: "+฿ 8.00", icon: MapPin, color: "bg-emerald-100 text-emerald-600" }
                        ].map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tx.color}`}>
                                <tx.icon size={20} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{tx.name}</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-0.5">{tx.date}</p>
                              </div>
                            </div>
                            <span className="text-sm font-black text-[#00d1b2]">{tx.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-20 bg-white border-t border-gray-100 flex justify-around items-center px-4 pb-4 z-30">
                    <div className="flex flex-col items-center gap-1 text-[#00d1b2]">
                      <Home size={22} strokeWidth={2.5} />
                      <span className="text-[8px] font-bold">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Clock size={22} strokeWidth={2.5} />
                      <span className="text-[8px] font-bold">History</span>
                    </div>
                    <div className="relative -top-5">
                      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg shadow-black/20 border-4 border-[#f8fafc]">
                        <QrCode size={24} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Wallet size={22} strokeWidth={2.5} />
                      <span className="text-[8px] font-bold">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <User size={22} strokeWidth={2.5} />
                      <span className="text-[8px] font-bold">Profile</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-[#00d1b2]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      <Theme />

      {/* --- 6. Footer --- */}
      {/* <Footer /> */}
    </main>
  );
}