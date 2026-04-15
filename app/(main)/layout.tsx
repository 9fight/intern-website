// app/(main)/layout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Theme from "@/components/Theme";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Theme />
            <Footer />
        </>
    );
}