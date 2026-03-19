import { Link2, BarChart2, Pencil, LayoutDashboard, Share2, Zap } from 'lucide-react'

const features = [
    {
        icon: Link2,
        title: "Short Links",
        description: "Turn long URLs into clean, shareable links in seconds.",
    },
    {
        icon: BarChart2,
        title: "Click Analytics",
        description: "Track every click with device, browser, OS, country, and referrer data.",
    },
    {
        icon: Pencil,
        title: "Custom Aliases",
        description: "Create branded short links with your own custom alias.",
    },
    {
        icon: LayoutDashboard,
        title: "Link Management",
        description: "View, edit, and delete all your links from one simple dashboard.",
    },
    {
        icon: Share2,
        title: "Works Everywhere",
        description: "Share your links on any platform — social, email, or messages.",
    },
    {
        icon: Zap,
        title: "Fast Redirects",
        description: "Lightning-fast redirects optimized for speed and reliability.",
    },
]

export default function Features() {
    return (
        <section id="features" className="w-full py-20 px-4 bg-gray-50">
            <div className="mx-auto max-w-5xl">

                <div className="text-center mb-12">
                    <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        Features
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Everything you need
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                        Simple tools to shorten, track, and manage your links.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3"
                            >
                                <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-brand-primary" />
                                </div>
                                <h3 className="text-gray-900 font-semibold text-sm">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}