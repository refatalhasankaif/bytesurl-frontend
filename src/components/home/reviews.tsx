import Image from 'next/image'

const reviews = [
    {
        name:   "Rafiqul Islam",
        role:   "Digital Marketer",
        image:  "/reviewer-avatar/profile1.jpg",
        review: "BytesURL makes sharing links so much easier. The analytics show exactly where my clicks are coming from.",
        rating: 5,
    },
    {
        name:   "Nusrat Jahan",
        role:   "Content Creator",
        image:  "/reviewer-avatar/profile2.jpg",
        review: "I love the custom alias feature. My links look clean and professional now. Worth every taka!",
        rating: 5,
    },
    {
        name:   "Tanvir Ahmed",
        role:   "Software Engineer",
        image:  "/reviewer-avatar/profile3.jpg",
        review: "Fast, reliable, and the analytics dashboard is really useful. The free plan is generous too.",
        rating: 5,
    },
    {
        name:   "Sumaiya Akter",
        role:   "Small Business Owner",
        image:  "/reviewer-avatar/profile4.jpg",
        review: "Using BytesURL for all my product links. The click tracking helps me understand my customers better.",
        rating: 5,
    },
    {
        name:   "Mehedi Hasan",
        role:   "Freelancer",
        image:  "/reviewer-avatar/profile5.jpg",
        review: "Clean UI, fast redirects, and the PRO plan is a great deal. Highly recommend it.",
        rating: 5,
    },
    {
        name:   "Farida Khanam",
        role:   "Blogger",
        image:  "/reviewer-avatar/profile6.jpg",
        review: "Finally a URL shortener with real analytics. I can see which countries my readers are from.",
        rating: 5,
    },
]

export default function Reviews() {
    return (
        <section id="reviews" className="w-full py-40 px-4 bg-gray-50">
            <div className="mx-auto max-w-5xl">

                <div className="text-center mb-12">
                    <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        Reviews
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        What users say
                    </h2>
                    <p className="text-gray-500 text-sm mt-3">
                        Trusted by people who share links every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.name}
                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
                        >

                            <div className="flex gap-0.5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                {review.review}
                            </p>

                            <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                                <div className="w-9 h-9 rounded-full border border-purple-100 overflow-hidden shrink-0 bg-purple-50">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-gray-900 text-xs font-semibold">{review.name}</p>
                                    <p className="text-gray-400 text-xs">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}