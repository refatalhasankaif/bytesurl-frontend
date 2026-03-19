import Link from "next/link"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen w-full bg-white px-6 py-16">
            <div className="mx-auto max-w-3xl">

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-sm">Last updated: March 19, 2026</p>
                    <div className="mt-4 h-0.5 w-12 bg-brand-primary rounded-full" />
                </div>

                <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">1. Information We Collect</h2>
                        <p>When you use BytesURL, we collect information you provide directly, such as your name, email address, and any URLs you shorten. We also collect usage data including IP addresses, browser type, operating system, and click analytics for shortened URLs.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, process transactions and manage your subscription, send you technical notices and support messages, provide click analytics for your shortened URLs, and monitor and analyze usage patterns.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">3. Information Sharing</h2>
                        <p>We do not sell, trade, or share your personal information with third parties except as described in this policy. We may share your information with service providers who assist us in operating our platform, such as Firebase for authentication and Stripe for payments.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">4. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information. Your account is secured through Firebase Authentication, and all payment processing is handled securely by Stripe. However, no method of transmission over the Internet is 100% secure.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">5. Cookies</h2>
                        <p>BytesURL uses cookies to maintain your session and authentication state. These cookies are essential for the platform to function correctly. You can control cookie settings through your browser, but disabling cookies may affect your ability to use the service.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">6. Analytics Data</h2>
                        <p>When someone clicks your shortened URL, we collect anonymized data including the visitor&apos;s country, device type, browser, and referrer. This data is used solely to provide you with click analytics for your URLs.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">7. Data Retention</h2>
                        <p>We retain your personal information for as long as your account is active. If you delete your account, your personal data and URLs will be permanently deleted from our systems within 30 days. Payment records may be retained for legal and accounting purposes.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">8. Your Rights</h2>
                        <p>You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your account and data, and export your data at any time.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">10. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please{" "}
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