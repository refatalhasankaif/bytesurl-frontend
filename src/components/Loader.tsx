'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

const Loader = () => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        let raf: number;

        const start = performance.now();
        const duration = 1800;

        const animate = (time: number) => {
            const elapsed = time - start;
            let t = Math.min(elapsed / duration, 1);


            t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const eased = Math.pow(t, 1.7);

            setProgress(eased * 100);

            if (t < 1) {
                raf = requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => setVisible(false), 400);
                }, 300);
            }
        };

        raf = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(raf);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center bg-white transition-opacity duration-500 ${
                isExiting ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="flex flex-col items-center gap-8 w-full max-w-xs px-6">

                <div className="flex items-center gap-2">
                        <Image height={24} width={24} src="/logo.png" alt="" />
                    <span className="text-gray-900 font-semibold text-lg">
                        BytesURL
                    </span>
                </div>


                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-brand-primary to-brand-secondary transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>


                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium">
                        Loading
                    </p>
                    <span className="text-4xl font-semibold text-gray-800 tabular-nums">
                        {Math.floor(progress)}%
                    </span>
                </div>

            </div>
        </div>
    );
};

export default Loader;