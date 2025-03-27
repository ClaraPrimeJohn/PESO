import React from 'react';
import { Link } from 'react-router-dom';
import service from '../assets/service.webp';

const HeroJoblistings = () => {
  return (
    <div className="w-full mt-10 py-2">
      <h1 className="text-center text-4xl text-darkblue font-extrabold">
        PESO Services
      </h1>

      <p className="text-center mt-3 mb-8 mx-auto py-4 text-xl w-9/12 px-2 md:px-4">
        Unlock your career potential with PESO's comprehensive services, thoughtfully crafted to empower job seekers and enhance employment opportunities. Discover a wide array of resources, from curated job listings and application guidance to activity announcements and program updates. PESO is your trusted partner in navigating the job market, providing reliable, accessible, and up-to-date support every step of the way.
      </p>

      <div 
        className="mt-1 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-1 flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 transition-all duration-300 hover:scale-[1.01]"
      >
        {/* left w/ image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div
            className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative animate-float"
          >
            <img
              src={service}
              alt="Job Listings"
              loading="lazy"
              className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
            />
          </div>
        </div>

        {/* right w/ description*/}
        <div className="w-full md:w-2/3 mt-6 md:mt-0 flex flex-col items-center text-center px-2 md:px-4">
          <h4 className="text-orange text-xl md:text-2xl font-extrabold tracking-wide">
            Job Listings
          </h4>

          <p className="mt-3 text-gray-700 text-base md:text-md leading-relaxed">
            Explore a wide array of job openings tailored to your unique skills and career interests. Whether you're seeking your first job or looking to advance your career, stay informed with the most recent opportunities available in your area. Begin your journey to professional growth and success today!
          </p>

          <div className="mt-5 flex justify-center">
            <Link
              to="/job-listing"
              className="inline-block text-darkblue font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600 hover:scale-[1.05] active:scale-[0.95]"
            >
              View more →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroJoblistings;