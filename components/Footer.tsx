"use client";
import React, { useState, useEffect } from "react";

// กำหนด Type สำหรับ Toast
type ToastType = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  // ฟังก์ชันสำหรับซ่อน Toast อัตโนมัติใน 5 วินาที
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer); // ล้าง timer ถ้ามีการกดส่งใหม่รัวๆ
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "05f2e825-e2ee-45c4-859b-9d24b28f3606"); // Web3Forms Key ของคุณ

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          type: "success",
          title: "Success",
          message: "ส่งข้อเสนอแนะสำเร็จ! ขอบคุณสำหรับความคิดเห็นครับ",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setToast({
          type: "error",
          title: "Error",
          message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        title: "Connection Error",
        message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#050505] dark:bg-white border-t border-white/10 dark:border-black/10 text-white/60 dark:text-[#86868B] pt-16 pb-8 text-sm relative z-10 transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">

        {/* Top Section: Form & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

          {/* Left: Supervisor Feedback Form */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white/90 dark:text-black/90">
              Supervisor Feedback
            </h3>
            <p className="text-xs text-white/40 dark:text-[#86868B] mb-2">
              อาจารย์หรือ Supervisor สามารถฝากข้อเสนอแนะหรือคอมเมนต์ได้ที่นี่ครับ
            </p>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                required
                placeholder="ชื่อ / ตำแหน่ง"
                className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-lg px-4 py-2.5 text-white dark:text-black outline-none focus:border-white/30 dark:focus:border-black/30 focus:ring-1 focus:ring-white/30 dark:focus:ring-black/30 transition-all placeholder:text-white/30 dark:placeholder:text-black/30"
              />
              <textarea
                name="message"
                required
                placeholder="ข้อเสนอแนะเกี่ยวกับโปรเจกต์..."
                rows={3}
                className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-lg px-4 py-2.5 text-white dark:text-black outline-none focus:border-white/30 dark:focus:border-black/30 focus:ring-1 focus:ring-white/30 dark:focus:ring-black/30 transition-all resize-none placeholder:text-white/30 dark:placeholder:text-black/30"
              ></textarea>

              <div className="flex items-center gap-4 mt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 disabled:opacity-50 disabled:hover:-translate-y-0 text-white/90 dark:text-black/90 font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                >
                  {isSubmitting ? "กำลังส่ง..." : "ส่งคอมเมนต์"}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Contact Links */}
          <div className="flex flex-col gap-5 md:items-end">
            <div className="md:text-right">
              <h3 className="text-lg font-semibold text-white/90 dark:text-black/90">
                Connect With Me
              </h3>
              <p className="text-xs text-white/40 dark:text-[#86868B] mt-1">
                ช่องทางการติดต่อและติดตามผลงาน
              </p>
            </div>

            <div className="flex flex-col gap-4 md:items-end w-full mt-2">
              <a href="https://github.com/9fight" target="_blank" rel="noreferrer" className="flex items-center gap-4 group justify-start md:justify-end">
                <span className="font-medium group-hover:text-white dark:group-hover:text-black transition-colors duration-300">GitHub Profile</span>
                <div className="w-10 h-10 rounded-full bg-white/5 dark:bg-black/5 flex items-center justify-center border border-white/10 dark:border-black/10 group-hover:-translate-y-1 group-hover:bg-white/10 dark:group-hover:bg-black/10 group-hover:shadow-lg transition-all duration-300 shrink-0">
                  <svg className="w-5 h-5 text-white/70 dark:text-black/70 group-hover:text-white dark:group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </div>
              </a>
              <a href="mailto:68319010015@loeitech.ac.th" className="flex items-center gap-4 group justify-start md:justify-end">
                <span className="font-medium group-hover:text-white dark:group-hover:text-black transition-colors duration-300">Email Me</span>
                <div className="w-10 h-10 rounded-full bg-white/5 dark:bg-black/5 flex items-center justify-center border border-white/10 dark:border-black/10 group-hover:-translate-y-1 group-hover:bg-white/10 dark:group-hover:bg-black/10 group-hover:shadow-lg transition-all duration-300 shrink-0">
                  <svg className="w-5 h-5 text-white/70 dark:text-black/70 group-hover:text-white dark:group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </a>
              <a href="https://line.me/ti/p/LNd_byUkr7" target="_blank" rel="noreferrer" className="flex items-center gap-4 group justify-start md:justify-end">
                <span className="font-medium group-hover:text-[#00B900] transition-colors duration-300">Line ID</span>
                <div className="w-10 h-10 rounded-full bg-white/5 dark:bg-black/5 flex items-center justify-center border border-white/10 dark:border-black/10 group-hover:-translate-y-1 group-hover:border-[#00B900]/50 group-hover:bg-[#00B900]/10 group-hover:shadow-lg transition-all duration-300 shrink-0">
                  <svg className="w-5 h-5 text-white/70 dark:text-black/70 group-hover:text-[#00B900] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" /></svg>
                </div>
              </a>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 dark:bg-black/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-semibold text-white/80 dark:text-black/80">
            Copyright © All Right Reserved 2026
          </p>
          <p className="text-xs font-medium">
            Designed by Chetsada from IT Department, Loei Technical College.
          </p>
        </div>
      </div>

      {/* --- Toast Alert UI --- */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 min-w-[300px] p-4 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 ease-out ${toast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
          }`}
      >
        {/* Icon based on state */}
        <div className="shrink-0 mt-0.5">
          {toast?.type === "error" ? (
            // Error Icon (เหมือนในรูปเป๊ะๆ)
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" className="fill-black dark:fill-white" />
              <path d="M10 5V11" stroke="currentColor" className="stroke-white dark:stroke-black" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="14.5" r="1" className="fill-white dark:fill-black" />
            </svg>
          ) : (
            // Success Icon (ติ๊กถูกสีเขียว)
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" className="fill-green-500" />
              <path d="M6 10.5L8.5 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Title and Message */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {toast?.title}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {toast?.message}
          </span>
        </div>

        {/* Close Button (X) */}
        <button
          onClick={() => setToast(null)}
          className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

    </footer>
  );
}