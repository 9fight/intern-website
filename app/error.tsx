"use client"; // ไฟล์ error ต้องเป็น Client Component เสมอ

import ErrorState from "@/components/ErrorState";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        // ส่ง props ไปหา ErrorState ของคุณ
        <ErrorState
            message="ขออภัย เกิดข้อผิดพลาดบางอย่างภายในระบบ"
            onRetry={() => reset()} // reset คือฟังก์ชันให้หน้าเว็บลอง Render ใหม่อีกครั้ง
        />
    );
}