import React, { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import heroImage from '../assets/jobfair3.webp';
import heroImage1 from '../assets/jobfair1.webp';
import heroImage2 from '../assets/jobfair.webp';
import heroImage3 from '../assets/jobfair2.webp';
import Banner from '../assets/try.webp';

// Original animation styles
const styles = `
  .fade-up {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .bg-yellow { background-color: #FFB42C; }
  .text-darkblue { color: #001D7D; }
  .text-orange { color: #FF6D18; }
  .bg-orange { background-color: #FF6D18; }
  .hover\\:bg-orange:hover { background-color: #FF6D18; }
  .bg-darkblue { background-color: #001D7D; }
  .text-black-primary { color: #525252; }
  .text-gray-secondary { color: #737373; }
  .hover\\:bg-darkblue:hover { background-color: #001D7D; }
`;

const Hero = () => {
  const [animatedStats, setAnimatedStats] = useState({
    jobOpenings: 0,
    partnerAgencies: 0,
    placements: 0,
  });

  // Memoized Intersection Observer callback for fade-up effect
  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, []);

  useEffect(() => {
    // Add styles to document head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Initialize Intersection Observer for fade-up effect
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Trigger when 10% of element is visible
    });
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

    // Stat animation with requestAnimationFrame
    const finalStats = {
      jobOpenings: 5000,
      partnerAgencies: 300,
      placements: 10000,
    };
    let startTime;
    const duration = 2000;

    const animateStats = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setAnimatedStats({
        jobOpenings: Math.floor(progress * finalStats.jobOpenings),
        partnerAgencies: Math.floor(progress * finalStats.partnerAgencies),
        placements: Math.floor(progress * finalStats.placements),
      });
      if (progress < 1) {
        requestAnimationFrame(animateStats);
      } else {
        setAnimatedStats(finalStats); // Ensure final values are exact
      }
    };

    requestAnimationFrame(animateStats);

    // Cleanup
    return () => {
      observer.disconnect();
      document.head.removeChild(styleSheet);
    };
  }, [handleIntersection]);

  return (
    <div className="relative">
      {/* Banner Section */}
      <div
        className="bg-cover bg-center bg-no-repeat flex items-start justify-center h-auto sm:h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${Banner})`,
          minHeight: '500px',
          paddingTop: '60px',
          paddingBottom: '40px',
        }}
      >
        <div className="container mx-auto px-4 py-8 sm:py-0">
          <div className="max-w-8xl mx-auto text-center fade-up">
            <div className="mb-2 sm:mb-4">
              <span className="inline-block bg-yellow text-darkblue text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 rounded-full font-semibold">
                Find Your Perfect Career Path
              </span>
            </div>
            <p className="text-sm sm:text-lg md:text-xl text-white mb-4 sm:mb-6 max-w-3xl mx-auto">
              Connecting passionate professionals with meaningful careers in public service and government sectors across the nation.
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              <span className="text-orange">Ready to Take</span> the Next Step?
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-white mb-4 sm:mb-8">
              Your dream job is waiting for you - let's make it happen!
            </p>

            {/* Job Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mt-4 sm:mt-6">
              {[
                { img: heroImage, title: 'Professional Networks', count: '1,200+ Jobs' },
                { img: heroImage1, title: 'Government Positions', count: '800+ Jobs' },
                { img: heroImage2, title: 'Education Careers', count: '650+ Jobs' },
                { img: heroImage3, title: 'Join Our Team', count: '2,350+ Jobs' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer fade-up"
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-300 will-change-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold mb-0 sm:mb-1">{item.title}</h3>
                    <p className="text-yellow text-xs md:text-sm font-medium">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
              <Link to="/job-listing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-orange text-white rounded-md hover:bg-[#e05d10] transition-colors duration-200 font-semibold text-xs sm:text-sm md:text-base">
                  Browse All Jobs
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition-colors duration-200 font-semibold text-xs sm:text-sm md:text-base">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 fade-up">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 text-black-primary">Why Choose Us</h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-gray-secondary">
            We connect talented individuals with top government and public service opportunities across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { stat: animatedStats.jobOpenings, title: 'Job Openings', desc: 'Access thousands of positions across hundreds of government agencies and departments.' },
            { stat: animatedStats.partnerAgencies, title: 'Partner Agencies', desc: 'We work with federal, state, and local government agencies to bring you the best opportunities.' },
            { stat: animatedStats.placements, title: 'Successful Placements', desc: "We've helped thousands of professionals find their ideal positions in public service." },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-200 fade-up"
            >
              <div className="text-orange text-2xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">
                {item.stat.toLocaleString()}+
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-darkblue">{item.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-darkblue py-8 sm:py-10 md:py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 fade-up">Ready to Start Your Career Journey?</h2>
          <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-4 sm:mb-6 md:mb-8 fade-up">
            Create your profile today and get personalized job recommendations based on your skills and interests.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 fade-up">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-yellow text-darkblue rounded-md hover:bg-[#e09c20] transition-colors duration-200 font-semibold text-xs sm:text-sm md:text-base">
                Register Now
              </button>
            </Link>
            <Link to="/about-us" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition-colors duration-200 font-semibold text-xs sm:text-sm md:text-base">
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