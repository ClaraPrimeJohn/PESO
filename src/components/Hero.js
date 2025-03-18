import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../assets/jobfair3.webp';
import heroImage1 from '../assets/jobfair1.webp';
import heroImage2 from '../assets/jobfair.webp';
import heroImage3 from '../assets/jobfair2.webp';
import Banner from '../assets/try.webp';
import { Link } from "react-router-dom";

const Hero = () => {
    const [animatedStats, setAnimatedStats] = useState({
        jobOpenings: 0,
        partnerAgencies: 0,
        placements: 0
    });
    
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out',
        });
        
        // Stats counter animation - FIXED to prevent infinite counting
        const finalStats = {
            jobOpenings: 5000,
            partnerAgencies: 300,
            placements: 10000
        };
        
        const duration = 2000; // 2 seconds for the animation
        const frameRate = 60;
        const totalFrames = duration / (1000 / frameRate);
        
        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const progress = Math.min(frame / totalFrames, 1); // Ensure progress never exceeds 1
            
            setAnimatedStats({
                jobOpenings: Math.floor(progress * finalStats.jobOpenings),
                partnerAgencies: Math.floor(progress * finalStats.partnerAgencies),
                placements: Math.floor(progress * finalStats.placements)
            });
            
            if (frame >= totalFrames) {
                clearInterval(timer);
                // Explicitly set final values to avoid any rounding issues
                setAnimatedStats({
                    jobOpenings: finalStats.jobOpenings,
                    partnerAgencies: finalStats.partnerAgencies,
                    placements: finalStats.placements
                });
            }
        }, 1000 / frameRate);
        
        // Cleanup function to clear interval if component unmounts
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="relative">
            {/* Hero section with background image - Modified positioning */}
            <div 
                className="bg-cover bg-center bg-no-repeat h-screen flex items-start pt-20 md:pt-28 justify-center" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${Banner})`,
                    minHeight: '600px'
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-8xl mx-auto text-center" data-aos="fade-up">
                        {/* Added new engaging text above the main heading */}
                        <div className="mb-4">
                            <span className="inline-block bg-yellow text-darkblue text-sm md:text-base px-4 py-1 rounded-full font-semibold mb-4">
                                Find Your Perfect Career Path
                            </span>
                        </div>
                        <p className="text-lg md:text-xl text-white mb-6 max-w-3xl mx-auto">
                            Connecting passionate professionals with meaningful careers in public service and government sectors across the nation.
                        </p>
                        
                        {/* Main heading - adjusted spacing */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            <span className="text-orange">Ready to Take</span> the Next Step?
                        </h1>
                        <p className="text-lg md:text-xl text-white mb-8">
                            Your dream job is waiting for you - let's make it happen!
                        </p>
                        
                        {/* Featured categories in hero section - improved responsiveness */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
                            {[
                                { img: heroImage, title: 'Professional Networks', count: '1,200+ Jobs' },
                                { img: heroImage1, title: 'Government Positions', count: '800+ Jobs' },
                                { img: heroImage2, title: 'Education Careers', count: '650+ Jobs' },
                                { img: heroImage3, title: 'Join Our Team', count: '2,350+ Jobs' }
                            ].map((item, index) => (
                                <div 
                                    key={index}
                                    className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="aspect-w-4 aspect-h-3">
                                        <img 
                                            src={item.img} 
                                            alt={item.title}
                                            className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                                        <h3 className="text-base md:text-xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-yellow text-xs md:text-sm font-medium">{item.count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Call to action buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-8" data-aos="fade-up" data-aos-delay="400">
                        <Link to="/job-listing">
                            <button className="px-6 py-3 bg-orange text-white rounded-md hover:bg-[#e05d10] transition duration-300 font-semibold text-sm md:text-base">
                                Browse All Jobs
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition duration-300 font-semibold text-sm md:text-base">
                                Create Account
                            </button>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
            
            {/* Quick stats section */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black-primary">Why Choose Us</h2>
                    <p className="text-gray-secondary text-base md:text-lg max-w-2xl mx-auto">
                        We connect talented individuals with top government and public service opportunities across the country.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div 
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                        data-aos="fade-up"
                    >
                        <div className="text-orange text-4xl md:text-5xl font-bold mb-2">
                            {animatedStats.jobOpenings.toLocaleString()}+
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-darkblue">Job Openings</h3>
                        <p className="text-gray-secondary text-sm md:text-base">Access thousands of positions across hundreds of government agencies and departments.</p>
                    </div>
                    
                    <div 
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="text-orange text-4xl md:text-5xl font-bold mb-2">
                            {animatedStats.partnerAgencies.toLocaleString()}+
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-darkblue">Partner Agencies</h3>
                        <p className="text-gray-secondary text-sm md:text-base">We work with federal, state, and local government agencies to bring you the best opportunities.</p>
                    </div>
                    
                    <div 
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="text-orange text-4xl md:text-5xl font-bold mb-2">
                            {animatedStats.placements.toLocaleString()}+
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-darkblue">Successful Placements</h3>
                        <p className="text-gray-secondary text-sm md:text-base">We've helped thousands of professionals find their ideal positions in public service.</p>
                    </div>
                </div>
            </div>
            
            {/* Call to action */}
            <div className="bg-darkblue py-10 md:py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4" data-aos="fade-up">Ready to Start Your Career Journey?</h2>
                    <p className="text-base md:text-lg max-w-xl mx-auto mb-6 md:mb-8" data-aos="fade-up" data-aos-delay="100">
                        Create your profile today and get personalized job recommendations based on your skills and interests.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
                        <Link to="/login">
                            <button className="px-6 py-3 bg-yellow text-darkblue rounded-md hover:bg-[#e09c20] transition duration-300 font-semibold text-sm md:text-base">
                                Register Now
                            </button>
                        </Link>
                        <Link to="/about-us">
                            <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition duration-300 font-semibold text-sm md:text-base">
                                Learn More
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;