"use client";
import { useEffect, useRef } from "react";

export default function ParticlesBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        let animId: number;
        const mouse = { x: -999, y: -999 };

        class Particle {
            x: number; y: number;
            vx: number; vy: number;
            r: number; alpha: number; da: number;
            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r = Math.random() * 1.5 + 0.8;
                this.alpha = Math.random() * 0.5 + 0.3;
                this.da = (Math.random() - 0.5) * 0.005;
            }
            update(w: number, h: number) {
                this.x += this.vx; this.y += this.vy;
                this.alpha += this.da;
                if (this.alpha > 0.8 || this.alpha < 0.2) this.da *= -1;
                if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
            }
            draw(ctx: CanvasRenderingContext2D) {
                // --- เพิ่ม Glow ให้จุด ---
                ctx.shadowBlur = 12;
                ctx.shadowColor = `rgba(160, 200, 255, ${this.alpha})`;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 225, 255, ${this.alpha})`;
                ctx.fill();

                // Reset shadow หลัง draw แต่ละจุด
                ctx.shadowBlur = 0;
            }
        }

        let particles: Particle[] = [];

        function init() {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
            const count = Math.floor((canvas!.width * canvas!.height) / 7000);
            particles = Array.from({ length: count }, () => new Particle(canvas!.width, canvas!.height));
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        const opacity = 0.15 * (1 - d / 120);
                        // --- เพิ่ม Glow ให้เส้นระหว่างจุด ---
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = `rgba(100, 160, 255, ${opacity * 2})`;

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(160, 200, 255, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                }

                // เส้นเชื่อมเมาส์
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 180) {
                    const opacity = 0.5 * (1 - d / 180);
                    // --- เพิ่ม Glow แรงๆ ให้เส้นเมาส์ ---
                    ctx.shadowBlur = 14;
                    ctx.shadowColor = `rgba(120, 180, 255, ${opacity})`;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(180, 220, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        function loop() {
            const W = canvas!.width, H = canvas!.height;
            ctx.clearRect(0, 0, W, H);
            drawLines();
            particles.forEach(p => { p.update(W, H); p.draw(ctx); });
            animId = requestAnimationFrame(loop);
        }

        const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onLeave = () => { mouse.x = -999; mouse.y = -999; };
        const onResize = () => init();

        window.addEventListener("mousemove", onMouse);
        window.addEventListener("mouseleave", onLeave);
        window.addEventListener("resize", onResize);
        init();
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("mouseleave", onLeave);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    );
}