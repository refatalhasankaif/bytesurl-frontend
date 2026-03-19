import Link from "next/link"

export default function TermsPage() {
    return (
        <main className="min-h-screen w-full bg-white px-6 py-16">
            <div className="mx-auto max-w-3xl">

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-sm">Last updated: March 19, 2026</p>
                    <div className="mt-4 h-0.5 w-12 bg-brand-primary rounded-full" />
                </div>

                <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">1. Acceptance of Terms</h2>
                        <p>By using BytesURL, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">2. Use of Service</h2>
                        <p>You agree not to use BytesURL to share illegal, harmful, or malicious content, spam or mislead users with shortened URLs, violate any applicable laws or regulations, or attempt to hack or disrupt our services.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">3. Account Responsibility</h2>
                        <p>You are responsible for maintaining the security of your account and all activity that occurs under it. Notify us immediately of any unauthorized use of your account.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">4. Subscription Plans</h2>
                        <p>BytesURL offers FREE, PRO, and ULTIMATE plans. Payments are one-time and non-refundable unless required by law. We reserve the right to change pricing with prior notice.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">5. URL Availability</h2>
                        <p>We reserve the right to disable any shortened URL that violates these terms or is reported as harmful. Custom URLs are available on a first-come, first-served basis.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">6. Termination</h2>
                        <p>We may suspend or terminate your account at any time for violations of these terms. You may delete your account at any time from your profile settings.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">7. Limitation of Liability</h2>
                        <p>BytesURL is provided as-is without any warranties. We are not liable for any damages arising from the use or inability to use our service.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">8. Contact</h2>
                        <p>
                            For any questions about these terms, please{" "}
                            <Link href="/#contact" className="text-brand-primary hover:underline">
                                contact us
                            </Link>.
                        </p>
                    </section>

                </div>

                <div className="mt-12 pt-6 border-t border-gray-100">
                    <Link href="/" className="text-sm text-brand-primary hover:underline">
                        Back to Home
                    </Link>
                </div>

            </div>
        </main>
    )
}