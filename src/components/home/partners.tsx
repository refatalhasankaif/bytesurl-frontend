'use client'

import Image from "next/image"

const partners = [
    { name: "Google", logo: "/partners/google.svg", desc: "Cloud & Search" },
    { name: "Microsoft", logo: "/partners/microsoft.svg", desc: "Enterprise tools" },
    { name: "Amazon", logo: "/partners/amazon.svg", desc: "Infrastructure" },
    { name: "Vercel", logo: "/partners/vercel.svg", desc: "Deployment" },
    { name: "Cloudflare", logo: "/partners/cloudflare.svg", desc: "Security & CDN" },
    { name: "OpenAI", logo: "/partners/openai.svg", desc: "AI Platform" },
]

export default function Partners() {
    return (
        <section className="w-full py-40 px-4 bg-white">
            <div className="mx-auto max-w-6xl">


                <div className="text-center mb-14">
                    <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        Partners
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Powered by trusted platforms
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
                        We integrate with industry-leading tools to deliver speed, reliability, and scale.
                    </p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((p) => (
                        <div
                            key={p.name}
                            className="group bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg">
                                <Image
                                    src={p.logo}
                                    alt={p.name}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-gray-900 text-sm font-semibold">
                                    {p.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    {p.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="mt-12 overflow-hidden">
                    <div className="flex gap-10 animate-scroll whitespace-nowrap opacity-60">
                        {[...partners, ...partners].map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                <Image src={p.logo} alt={p.name} width={18} height={18} />
                                {p.name}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}