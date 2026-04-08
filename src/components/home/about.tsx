import { Link2, Shield, BarChart2 } from 'lucide-react'

const values = [
    {
        icon: Link2,
        title: 'Simple by design',
        description: 'No bloat, no complexity. Just paste a link and get a short one.',
    },
    {
        icon: BarChart2,
        title: 'Data you can use',
        description: 'Real analytics that help you understand your audience.',
    },
    {
        icon: Shield,
        title: 'Private and secure',
        description: 'Your data stays yours. We never sell or share your information.',
    },
]

export default function About() {
    return (
        <section id="about" className="w-full py-40 px-4 bg-white">
            <div className="mx-auto max-w-5xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                                About
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                Built for people
                                <br />
                                who share links
                            </h2>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            BytesURL was built to solve a simple problem — long, ugly URLs.
                            Whether you&apos;re a marketer, creator, or developer, we give you
                            the tools to shorten, brand, and track your links with ease.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            No complicated setup. No monthly fees. Just a clean tool
                            that does exactly what you need.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {values.map((value) => {
                            const Icon = value.icon
                            return (
                                <div
                                    key={value.title}
                                    className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-brand-primary" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-gray-900 text-sm font-semibold">
                                            {value.title}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>

            </div>
        </section>
    )
}