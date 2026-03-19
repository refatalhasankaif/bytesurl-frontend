
import About from '@/components/home/about';
import Contact from '@/components/home/contact';
import Features from '@/components/home/features';
import Hero from '@/components/home/hero';
import Pricing from '@/components/home/pricing';
import Reviews from '@/components/home/reviews';

const page = () => {
    return (
        <div>
            <Hero/>
            <Features/>
            <Pricing/>
            <Reviews/>
            <About/>
            <Contact/> 
        </div>
    );
};

export default page;