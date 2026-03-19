import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-[#0F0A1E] flex flex-col items-center justify-center px-6">

            <div className="relative flex flex-col items-center text-center gap-6">

                <h1 className="text-8xl font-bold text-brand-primary">
                    404
                </h1>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">
                        Page Not Found
                    </h2>
                    <p className="text-gray-400 text-sm max-w-sm">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>

                <Link
                    href="/"
                    className="mt-2 bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Return Home
                </Link>

            </div>
        </div>
    )
}