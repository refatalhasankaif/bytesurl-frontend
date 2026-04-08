'use client'

import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

export default function FloatingAIButton() {
    const router = useRouter()
    const pathname = usePathname()

    if (pathname === '/ai') return null

    return (
        <button
            onClick={() => router.push('/ai')}
            className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-9999 group"
        >

            <span className="absolute inset-0 rounded-full bg-brand-primary opacity-30 animate-ping"></span>

            <div className="
                relative 
                w-11 h-11 
                sm:w-12 sm:h-12 
                md:w-14 md:h-14 
                rounded-full 
                border-2 border-brand-primary 
                bg-white 
                flex items-center justify-center 
                shadow-lg 
                transition-all duration-300 
                group-hover:scale-110 
                group-active:scale-95
                hover:cursor-pointer
            ">
                <Image
                    alt="ai-icon"
                    src="/aiIcon.png"
                    width={20}
                    height={20}
                    className="
                        w-4 h-4 
                        sm:w-5 sm:h-5 
                        md:w-6 md:h-6
                    "
                />
            </div>
        </button>
    )
}