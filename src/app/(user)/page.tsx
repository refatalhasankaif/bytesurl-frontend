
import About from '@/components/home/about';
import Careers from '@/components/home/career';
import Contact from '@/components/home/contact';
import Features from '@/components/home/features';
import Follow from '@/components/home/follow';
import Hero from '@/components/home/hero';
import Partners from '@/components/home/partners';
import Pricing from '@/components/home/pricing';
import Reviews from '@/components/home/reviews';
import Stats from '@/components/home/statistics';

const page = () => {
    return (
        <div>
            <Hero />
            <Features />
            <Pricing />
            <Reviews />
            <About />
            <Stats />
            <Partners />
            <Follow />
            <Careers />
            <Contact />
        </div>
    );
};

export default page;