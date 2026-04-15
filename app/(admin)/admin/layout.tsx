// app/(admin)/layout.tsx
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar ลอยตัวอยู่ด้านซ้าย */}
            <Sidebar />

            {/* พื้นที่เนื้อหาหลัก 
                1. ลบ ml-64 ออก 
                2. ใช้ md:pl-[312px] แทน เพื่อเว้นที่ให้ Sidebar ลอยตัวเฉพาะบนจอคอม (Sidebar 280px + เว้นขอบ)
                3. บนมือถือไม่ต้องเว้นซ้าย แต่เว้นด้านบน (pt-24) เพื่อหลบปุ่ม Hamburger Menu
            */}
            <main className="flex-1 min-h-screen relative w-full md:pl-[312px] transition-all duration-300 max-w-[100vw] overflow-hidden">

                {/* Background Blob Effect */}
                <div className="fixed top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="fixed bottom-0 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                {/* เนื้อหาด้านใน ปรับ Padding ให้พอดีกับทุกขนาดจอ */}
                <div className="p-4 pt-24 md:p-6 lg:p-8 md:pt-6 lg:pt-8 w-full min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}