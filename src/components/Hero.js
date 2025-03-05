import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../assets/jobfair3.webp';
import heroImage1 from '../assets/jobfair1.webp';
import heroImage2 from '../assets/jobfair.webp';
import heroImage3 from '../assets/jobfair2.webp';
import Banner from '../assets/try.webp';

const Hero = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div className="text-center py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${Banner})` }}>
            <div className="py-12 px-8 mx-auto rounded-lg max-w-4xl">
                <h1 className="text-6xl text-orange font-extrabold">
                    Ready to Take the Next Step?
                </h1>
                <p className="p-8 text-xl text-blue">
                    Your dream job is waiting for you - let’s make it happen!
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:px-48 px-8 pt-20">

                <div className="image-container" style={{ transition: 'transform 0.3s ease' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                    <img
                        src={heroImage}
                        alt="Hero 1"
                        data-aos="fade-right"
                        data-aos-delay="0"
                        className="w-full h-full object-cover rounded-md shadow-md"
                    />
                </div>
                <div className="image-container" style={{ transition: 'transform 0.3s ease' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                    <img
                        src={heroImage1}
                        alt="Hero 2"
                        data-aos="fade-right"
                        data-aos-delay="200"
                        className="w-full h-full object-cover rounded-md shadow-md"
                    />
                </div>
                <div className="image-container" style={{ transition: 'transform 0.3s ease' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                    <img
                        src={heroImage2}
                        alt="Hero 3"
                        data-aos="fade-right"
                        data-aos-delay="400"
                        className="w-full h-full object-cover rounded-md shadow-md"
                    />
                </div>
                <div className="image-container" style={{ transition: 'transform 0.3s ease' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                    <img
                        src={heroImage3}
                        alt="Hero 4"
                        data-aos="fade-right"
                        data-aos-delay="600"
                        className="w-full h-full object-cover rounded-md shadow-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
