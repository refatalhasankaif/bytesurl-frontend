'use client'

import { useEffect, useState } from 'react'

function Counter({ target }: { target: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const step = target / 60

        const interval = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(interval)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(interval)
    }, [target])

    return <>{count.toLocaleString()}</>
}

export default function Stats() {
    const stats = [
        { value: 1000000, label: "Links created", sub: "Across all users" },
        { value: 500000, label: "Monthly clicks", sub: "Tracked in real-time" },
        { value: 10000, label: "Active users", sub: "Growing every day" },
        { value: 99, label: "Uptime %", sub: "Reliable infrastructure" },
    ]

    return (
        <section className="w-full py-40 px-4 bg-gray-50">
            <div className="mx-auto max-w-6xl">


                <div className="text-center mb-14">
                    <p className="text-brand-primary text-xs font-semibold uppercase mb-3">
                        Statistics
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Built for scale & performance
                    </h2>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="group relative aspect-square rounded-xl p-px bg-linear-to-br from-purple-200 via-transparent to-purple-200 hover:from-brand-primary hover:to-brand-secondary transition-all duration-300"
                        >

                            <div className="relative h-full w-full bg-white rounded-xl flex flex-col items-center justify-center text-center p-4 overflow-hidden">


                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-2xl" />
                                </div>


                                <p className="text-2xl md:text-3xl font-bold bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent z-10">
                                    {s.label.includes('%')
                                        ? '99.9%'
                                        : <Counter target={s.value} />}+
                                </p>


                                <p className="text-gray-900 text-sm font-semibold mt-2 z-10">
                                    {s.label}
                                </p>

                                <p className="text-gray-500 text-xs mt-1 z-10">
                                    {s.sub}
                                </p>


                                <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent group-hover:left-full transition-all duration-700" />

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}