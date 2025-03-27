import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from "react-router-dom";

// Direct image imports
import heroImage from '../assets/jobfair3.webp';
import heroImage1 from '../assets/jobfair1.webp';
import heroImage2 from '../assets/jobfair.webp';
import heroImage3 from '../assets/jobfair2.webp';
import Banner from '../assets/try.webp';

const Hero = React.memo(() => {
    const [animatedStats, setAnimatedStats] = useState({
        jobOpenings: 0,
        partnerAgencies: 0,
        placements: 0
    });

    // Memoize final stats to prevent unnecessary recalculations
    const finalStats = useMemo(() => ({
        jobOpenings: 5000,
        partnerAgencies: 300,
        placements: 10000
    }), []);

    // Optimize animation logic with useCallback
    const animateStats = useCallback(() => {
        const duration = 2000;
        const frameRate = 60;
        const totalFrames = duration / (1000 / frameRate);
        
        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const progress = Math.min(frame / totalFrames, 1); 
            
            setAnimatedStats({
                jobOpenings: Math.floor(progress * finalStats.jobOpenings),
                partnerAgencies: Math.floor(progress * finalStats.partnerAgencies),
                placements: Math.floor(progress * finalStats.placements)
            });
            
            if (frame >= totalFrames) {
                clearInterval(timer);
                setAnimatedStats(finalStats);
            }
        }, 1000 / frameRate);

        return () => clearInterval(timer);
    }, [finalStats]);

    // Optimize useEffect to minimize main thread work
    useEffect(() => {
        const cleanup = animateStats();
        return cleanup;
    }, [animateStats]);

    // Memoize job images to prevent unnecessary re-renders
    const jobImageData = useMemo(() => [
        { 
            img: heroImage, 
            title: 'Professional Networks', 
            count: '1,200+ Jobs' 
        },
        { 
            img: heroImage1, 
            title: 'Government Positions', 
            count: '800+ Jobs' 
        },
        { 
            img: heroImage2, 
            title: 'Education Careers', 
            count: '650+ Jobs' 
        },
        { 
            img: heroImage3, 
            title: 'Join Our Team', 
            count: '2,350+ Jobs' 
        }
    ], []);

    return (
        <div className="relative">
            <div 
                className="bg-cover bg-center bg-no-repeat h-screen flex items-start pt-20 md:pt-28 justify-center" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${Banner})`,
                    minHeight: '600px'
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-8xl mx-auto text-center">
                        <div className="mb-4">
                            <span className="inline-block bg-yellow text-darkblue text-sm md:text-base px-4 py-1 rounded-full font-semibold mb-4">
                                Find Your Perfect Career Path
                            </span>
                        </div>
                        <p className="text-lg md:text-xl text-white mb-6 max-w-3xl mx-auto">
                            Connecting passionate professionals with meaningful careers in public service and government sectors across the nation.
                        </p>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            <span className="text-orange">Ready to Take</span> the Next Step?
                        </h1>
                        <p className="text-lg md:text-xl text-white mb-8">
                            Your dream job is waiting for you - let's make it happen!
                        </p>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
                            {jobImageData.map((item, index) => (
                                <div 
                                    key={index}
                                    className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                                >
                                    <div className="aspect-w-4 aspect-h-3">
                                        <img 
                                            src={item.img} 
                                            alt={item.title}
                                            loading="lazy"
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
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-8">
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
            
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black-primary">Why Choose Us</h2>
                    <p className="text-gray-secondary text-base md:text-lg max-w-2xl mx-auto">
                        We connect talented individuals with top government and public service opportunities across the country.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { 
                            stat: animatedStats.jobOpenings, 
                            title: 'Job Openings', 
                            description: 'Access thousands of positions across hundreds of government agencies and departments.'
                        },
                        { 
                            stat: animatedStats.partnerAgencies, 
                            title: 'Partner Agencies', 
                            description: 'We work with federal, state, and local government agencies to bring you the best opportunities.'
                        },
                        { 
                            stat: animatedStats.placements, 
                            title: 'Successful Placements', 
                            description: 'We\'ve helped thousands of professionals find their ideal positions in public service.'
                        }
                    ].map((item, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-orange text-4xl md:text-5xl font-bold mb-2">
                                {item.stat.toLocaleString()}+
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 text-darkblue">
                                {item.title}
                            </h3>
                            <p className="text-gray-secondary text-sm md:text-base">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-darkblue py-10 md:py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Ready to Start Your Career Journey?
                    </h2>
                    <p className="text-base md:text-lg max-w-xl mx-auto mb-6 md:mb-8">
                        Create your profile today and get personalized job recommendations based on your skills and interests.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
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
});

export default Hero;