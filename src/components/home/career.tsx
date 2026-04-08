import { Briefcase, Users, Rocket, Globe } from 'lucide-react'

export default function Careers() {
    const perks = [
        { icon: Rocket, title: "Fast growth", desc: "Work on a product used globally." },
        { icon: Users, title: "Remote culture", desc: "Collaborate from anywhere." },
        { icon: Globe, title: "Global impact", desc: "Users from 100+ countries." },
        { icon: Briefcase, title: "Open roles", desc: "Frontend, Backend & Product." },
    ]

    return (
        <section className="w-full py-40 px-4 bg-white">
            <div className="mx-auto max-w-6xl">


                <div className="text-center mb-14">
                    <p className="text-brand-primary text-xs font-semibold uppercase mb-3">
                        Careers
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Build the future with us
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                        Join a team focused on speed, simplicity, and real impact.
                    </p>
                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {perks.map((p) => {
                        const Icon = p.icon
                        return (
                            <div
                                key={p.title}
                                className="group bg-gray-50 border border-gray-200 rounded-xl p-6 transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <Icon className="w-6 h-6 text-brand-primary mb-3 group-hover:scale-110 transition" />
                                <p className="text-sm font-semibold text-gray-900">
                                    {p.title}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {p.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>


                <div className="mt-12 text-center">
                    <a href='https://www.linkedin.com/jobs/' target='_blank' className="border border-brand-primary text-brand-primary hover:bg-purple-50 px-6 py-3 rounded-lg text-sm font-semibold transition">
                        View Open Positions
                    </a>
                </div>

            </div>
        </section>
    )
}