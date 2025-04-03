import React, { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import heroImage from '../assets/jobfair3.webp';
import heroImage1 from '../assets/jobfair1.webp';
import heroImage2 from '../assets/jobfair.webp';
import heroImage3 from '../assets/jobfair2.webp';
import Banner from '../assets/try.webp';

// CSS for lightweight fade-up animation (add this to your CSS file or a <style> tag)
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
  
  /* Mobile-specific improvements */
  @media (max-width: 640px) {
    .mobile-hero-title {
      font-size: 2.25rem;
      line-height: 1.2;
    }
    .mobile-hero-text {
      font-size: 1rem;
      line-height: 1.5;
    }
    .mobile-category-card {
      margin-bottom: 1rem;
    }
    .mobile-category-image {
      height: 160px;
    }
    .mobile-stat-card {
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    .mobile-cta-section {
      padding: 2rem 1rem;
    }
    .mobile-button {
      width: 100%;
      margin-bottom: 0.75rem;
    }
  }
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
      rootMargin: '0px 0px -50px 0px', // Trigger earlier on mobile
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
      {/* Banner Section - Improved for mobile */}
      <div
        className="bg-cover bg-center bg-no-repeat min-h-screen flex items-start pt-16 md:pt-28 justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Banner})`,
          minHeight: '500px',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-8xl mx-auto text-center fade-up">
            <div className="mb-4">
              <span className="inline-block bg-yellow text-darkblue text-sm md:text-base px-4 py-1 rounded-full font-semibold mb-4">
                Find Your Perfect Career Path
              </span>
            </div>
            <p className="text-base md:text-xl text-white mb-6 max-w-3xl mx-auto mobile-hero-text">
              Connecting passionate professionals with meaningful careers in public service and government sectors across the nation.
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 mobile-hero-title">
              <span className="text-orange">Ready to Take</span> the Next Step?
            </h1>
            <p className="text-base md:text-xl text-white mb-6 mobile-hero-text">
              Your dream job is waiting for you - let's make it happen!
            </p>

            {/* Job Categories Grid - Improved for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {[
                { img: heroImage, title: 'Professional Networks', count: '1,200+ Jobs' },
                { img: heroImage1, title: 'Government Positions', count: '800+ Jobs' },
                { img: heroImage2, title: 'Education Careers', count: '650+ Jobs' },
                { img: heroImage3, title: 'Join Our Team', count: '2,350+ Jobs' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer fade-up mobile-category-card"
                  style={{ marginBottom: '0.75rem' }}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-300 will-change-transform mobile-category-image"
                      loading="lazy" // Lazy load images
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-yellow text-sm font-medium">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons - Improved for mobile */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-8 fade-up">
              <Link to="/job-listing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-orange text-white rounded-md hover:bg-[#e05d10] transition-colors duration-200 font-semibold text-base mobile-button">
                  Browse All Jobs
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition-colors duration-200 font-semibold text-base mobile-button">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Improved for mobile */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12 fade-up">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black-primary">Why Choose Us</h2>
          <p className="text-gray-secondary text-base md:text-lg max-w-2xl mx-auto">
            We connect talented individuals with top government and public service opportunities across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { stat: animatedStats.jobOpenings, title: 'Job Openings', desc: 'Access thousands of positions across hundreds of government agencies and departments.' },
            { stat: animatedStats.partnerAgencies, title: 'Partner Agencies', desc: 'We work with federal, state, and local government agencies to bring you the best opportunities.' },
            { stat: animatedStats.placements, title: 'Successful Placements', desc: 'Weve helped thousands of professionals find their ideal positions in public service.' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 md:p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-200 fade-up mobile-stat-card"
              style={{ marginBottom: '1rem' }}
            >
              <div className="text-orange text-3xl md:text-5xl font-bold mb-2">
                {item.stat.toLocaleString()}+
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-darkblue">{item.title}</h3>
              <p className="text-gray-secondary text-sm md:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section - Improved for mobile */}
      <div className="bg-darkblue py-8 md:py-16 text-white text-center mobile-cta-section">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 fade-up">Ready to Start Your Career Journey?</h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-6 md:mb-8 fade-up">
            Create your profile today and get personalized job recommendations based on your skills and interests.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 fade-up">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3 bg-yellow text-darkblue rounded-md hover:bg-[#e09c20] transition-colors duration-200 font-semibold text-base mobile-button">
                Register Now
              </button>
            </Link>
            <Link to="/about-us" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-darkblue transition-colors duration-200 font-semibold text-base mobile-button">
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