import Image from "next/image"

export default function Follow() {
    const socials = [
        {
            name: "Facebook",
            desc: "Community updates",
            href: "https://facebook.com",
            icon: "/socials/facebook.svg",
        },
        {
            name: "X (Twitter)",
            desc: "Latest news & threads",
            href: "https://x.com",
            icon: "/socials/x.svg",
        },
        {
            name: "LinkedIn",
            desc: "Professional updates",
            href: "https://linkedin.com",
            icon: "/socials/linkedin.svg",
        },
        {
            name: "GitHub",
            desc: "Open source & code",
            href: "https://github.com",
            icon: "/socials/github.svg",
        },
        {
            name: "Instagram",
            desc: "Behind the scenes",
            href: "https://instagram.com",
            icon: "/socials/instagram.svg",
        },
        {
            name: "YouTube",
            desc: "Tutorials & content",
            href: "https://youtube.com",
            icon: "/socials/youtube.svg",
        },
    ]

    return (
        <section className="w-full py-40 px-4 bg-gray-50">
            <div className="mx-auto max-w-6xl">


                <div className="text-center mb-14">
                    <p className="text-brand-primary text-xs font-semibold uppercase mb-3">
                        Follow Us
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Stay connected with BytesURL
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                        Get product updates, tips, and announcements across our platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {socials.map((s) => (
                        <a
                            key={s.name}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg"
                        >

                            <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                                <Image
                                    src={s.icon}
                                    alt={s.name}
                                    width={26}
                                    height={26}
                                    className="object-contain group-hover:scale-110 transition"
                                />
                            </div>


                            <div>
                                <p className="text-gray-900 text-sm font-semibold">
                                    {s.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    {s.desc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    )
}