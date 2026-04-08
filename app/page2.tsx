"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Briefcase, Zap } from "lucide-react";

// นำเข้า Component ที่คุณสร้างไว้ (ถ้ามี)
// import Navbar from "@/components/Navbar"; 
// import Footer from "@/components/Footer";

export default function Home() {
  // Mockup Data (ปรับ Role ให้ดู Tech ขึ้น)
  const trainees = [
    {
      id: "65309010043",
      name: "นางสาวฮานีรา คิม",
      group: "ปวส.1 IT กลุ่ม 2",
      role: "Frontend Developer (Next.js)",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "65309010029",
      name: "นางสาวนารีรัตน์ จันทนา",
      group: "ปวส.1 IT กลุ่ม 2",
      role: "Product Designer (UI/UX)",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "65309010030",
      name: "นางสาวประกายดาว ผลสอน",
      group: "ปวส.1 IT กลุ่ม 2",
      role: "Backend Developer (Node.js)",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    // เปลี่ยน Selection สีให้ดูดุดันขึ้นเป็นสีดำสนิท
    <main style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }} className="min-h-screen font-sans bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden relative selection:bg-black selection:text-white">

      {/* --- 1. iOS Glass Navbar (ปรับให้ตัวอักษรเป็นสีดำเข้ม) --- */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] md:w-auto flex justify-center items-center px-8 py-3 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      >
        <div className="flex gap-6 md:gap-8 text-sm font-semibold text-black">
          <a href="#" className="hover:text-[#424245] transition-colors">หน้าแรก</a>
          <a href="#" className="hover:text-[#424245] transition-colors">เวลาปฏิบัติงาน</a>
          <a href="#" className="hover:text-[#424245] transition-colors">ภาพถ่าย</a>
          <a href="#" className="hover:text-[#424245] transition-colors">รายงาน</a>
        </div>
      </motion.nav>

      {/* --- 2. Hero Section (Keep Light, but use black accents) --- */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-24 pb-20 bg-white">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10 md:pr-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge ปรับเป็นสีดำตัดแรง (Black Badge with Yellow Icon) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white mb-6 w-max shadow-lg shadow-black/10">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-xs font-bold tracking-wide uppercase">นักศึกษาฝึกประสบการณ์ 2023</span>
            </div>
            
            {/* Title หนาและดำสนิท (Extrabold Black Text) */}
            <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-tighter mb-4 leading-[1.05] text-black">
              Hyphen <br />
              <span className="text-black">Plus<span className="text-[#424245]">.</span></span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#424245] mb-12 max-w-md font-normal leading-relaxed">
              Startup ด้าน Software Tech & AI <br/> 
              <span className="text-base font-semibold text-black/70">Digital Innovation Solutions</span>
            </p>
            
            {/* ปุ่มดำสนิท (Solid Black Button) */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center gap-2 hover:bg-[#333336] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-max"
            >
              สำรวจผลงานการฝึกงาน <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 h-[500px] relative mt-16 md:mt-0 hidden md:flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md aspect-[4/5] z-20"
          >
            {/* กรอบรูปดำขอบมนแบบ iPhone (Black Border Card) */}
            <div className="absolute inset-0 bg-black rounded-[2.5rem] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop" 
                className="relative w-full h-full object-cover rounded-[2rem]"
                alt="Coding Team"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Divider ดำบางๆ (Subtle Black Divider) --- */}
      <div className="w-full"><hr className="border-black/10" /></div>

      {/* --- 3. Trainees Section (TURN TO DARK MODE) --- */}
      <section className="relative py-28 px-6 md:px-20 z-10 bg-black text-white">
        
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Innovation Team.
          </h2>
          <p className="text-[#86868B] text-lg font-medium">นักศึกษาฝึกงานระดับอาชีวศึกษาชั้นสูง (ปวส.)</p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10"
        >
          {trainees.map((trainee, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              // การ์ดดำตัดขอบเทาอ่อน (Dark Grey Cards with Border)
              className="bg-[#1C1C1E] rounded-[2.5rem] p-9 flex flex-col items-center group transition-all duration-300 hover:bg-[#2C2C2E] hover:-translate-y-2 cursor-pointer border border-[#3A3A3C]"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-7 ring-4 ring-[#3A3A3C] group-hover:ring-white/50 transition-all duration-300">
                <img src={trainee.image} alt={trainee.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"/>
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5">{trainee.name}</h3>
              {/* Role สีขาวเด่น (Bold White Role) */}
              <p className="text-white font-semibold text-sm mb-3 tracking-wide">{trainee.role}</p>
              <p className="text-[#86868B] text-xs mb-5 font-medium">{trainee.group}</p>
              {/* Badge ID ในการ์ดดำ (Dark ID Badge) */}
              <div className="text-white/70 text-xs px-4 py-1.5 rounded-full bg-white/5 font-mono shadow-inner border border-white/10">
                ID: {trainee.id}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- Divider --- */}
      <div className="w-full"><hr className="border-black/10" /></div>

      {/* --- 4. Company Info & Map (Back to Light, but use black elements) --- */}
      <section className="py-28 px-6 md:px-20 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-7 text-black">
                Inside Hyphen Plus.
              </h2>
              <p className="text-[#424245] leading-relaxed text-lg mb-12 font-normal">
                บริษัทดำเนินธุรกิจ Startup ด้าน Software Tech และ AI เราทุ่มเทในการพัฒนาและประยุกต์ใช้เทคโนโลยีสมัยใหม่ ผลิตสินค้าทั้งเว็บไซต์และแอปพลิเคชันเพื่อให้บริการลูกค้าด้วยโซลูชันที่ล้ำสมัย
              </p>
              
              <div className="space-y-5">
                {/* Info Block สีดำตัดแรง (Solid Black Info Block) */}
                <div className="p-6 bg-black rounded-[2rem] flex items-center gap-6 shadow-xl shadow-black/10 text-white border border-black hover:bg-[#1D1D1F] transition-colors">
                  <div className="w-14 h-14 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white shadow-inner">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1.5">สำนักงานใหญ่</h4>
                    <p className="text-[#86868B] text-xs md:text-sm">71 ซอยรังสิต-นครนายก 59 ต.ประชาธิปัตย์ อ.ธัญบุรี ปทุมธานี 12150</p>
                  </div>
                </div>

                {/* Info Block สีเทาอ่อนตัด (Subtle Info Block) */}
                <div className="p-6 bg-[#F5F5F7] rounded-[2rem] flex items-center gap-6 border border-[#E5E5E5] hover:bg-[#EAEAEF] transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="text-black font-bold text-sm mb-1.5">เวลาทำการ</h4>
                    <p className="text-[#424245] text-xs md:text-sm font-medium">จันทร์ - ศุกร์ : 8:30 – 17:30</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Google Map (ปรับกรอบให้เข้มขึ้น) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2 h-[450px] relative rounded-[2.5rem] p-2 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.9348981602986!2d100.65242437604473!3d13.997260586331908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d7f6ef03eedp7%3A0x289f61b0a7761609!2zSFlQSEVOIFBMVVMgQ28uLEx0ZC4gKOC4muC4o-C4tOC4qeC4seC4lCDguYTguK7guYDguJ_guJnguJ7guKXguLHguKog4LiI4Liz4LiB4Lix4LiUKQ!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover rounded-[2rem]"
                title="Hyphen Plus Location"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Divider --- */}
      <div className="w-full"><hr className="border-black/10" /></div>

      {/* --- 5. Products Section (Keep Light, but use black elements) --- */}
      <section className="py-28 px-6 md:px-20 relative z-10 bg-[#F5F5F7] overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 z-20"
          >
            <h2 className="text-[3rem] font-extrabold tracking-tighter text-black mb-5 leading-tight">
              Tech Stack & Services. <br/>
              <span className="text-black/60">We Build. We Test.</span>
            </h2>
            <p className="text-[#424245] leading-relaxed text-lg mb-10 font-normal max-w-lg">
              มีส่วนร่วมในการออกแบบ พัฒนา และทดสอบระบบซอฟต์แวร์ทั้งเว็บไซต์และแอปพลิเคชัน ด้วยเทคโนโลยีสมัยใหม่ เช่น Laravel และเครื่องมืออื่นๆ เพื่อตอบโจทย์ธุรกิจ
            </p>
            <a 
              href="https://hyphen-plus.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              // ปุ่มดำตัดสนิท (Solid Black Button)
              className="inline-block bg-black text-white font-bold border border-black px-8 py-4 rounded-full hover:bg-[#333336] transition-all"
            >
              เยี่ยมชมเว็บไซต์บริษัท <ChevronRight size={18} className="inline"/>
            </a>
          </motion.div>

          {/* Clean Light-Mode Mockup (Reinforce Black Frame) */}
          <div className="w-full md:w-1/2 relative h-[500px] flex justify-center items-center">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              // กรอบดำแบบ Apple ปราณีต (Refined Black Frame)
              className="relative w-[300px] h-[610px] bg-white rounded-[3rem] border-[12px] border-black shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden z-20"
            >
               {/* iPhone Dynamic Island Mock */}
               <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30"></div>
               
               {/* Screen Content (Light Mode with subtle frame) */}
               <div className="w-full h-full bg-[#FAFAFA] p-6 pt-16 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-8 px-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-[#1D1D1F] self-start px-2 mb-6 tracking-tight">App Interface</h4>
                  
                  {/* เปลี่ยน Mock Card ให้มีสีสัน */}
                  <div className="w-full h-32 bg-white rounded-[1.5rem] mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-4">
                    <div className="w-1/2 h-4 bg-indigo-50 rounded-full mb-3"></div>
                    <div className="w-3/4 h-8 bg-indigo-100/50 rounded-lg"></div>
                  </div>
                  <div className="w-full h-24 bg-white rounded-[1.5rem] mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-4"></div>
                  
                  {/* ฐานแอปสี Gradient */}
                  <div className="w-full h-full bg-gradient-to-t from-blue-100 to-indigo-50 rounded-t-[1.5rem] border border-indigo-100 p-4"></div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 6. Footer (Minimal Text with Dark Border) --- */}
      <footer className="bg-white border-t border-black/10 text-[#86868B] py-12 text-center text-sm relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <p className="font-semibold text-black/80">Copyright © 2023. Hyphen Plus Co., Ltd.</p>
          <p className="text-xs font-medium">Designed by Trainee from IT Department, Loei Technical College.</p>
        </div>
      </footer>
    </main>
  );
}