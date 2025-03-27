import React from 'react';
import { Link } from 'react-router-dom';
import service4 from '../assets/service4.webp';

const HeroNotif = () => {
  return (
    <div
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-8 flex flex-col md:flex-row-reverse items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 p-6 md:p-10 lg:p-12 transition-all duration-300 hover:scale-[1.01]"
    >
      {/* right w/ image */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div
          className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative animate-float"
        >
          <img
            src={service4}
            alt="Program Updates and Notifications"
            loading="lazy"
            className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
          />
        </div>
      </div>

      {/* left w/ description */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0 md:pr-8 text-center">
        <h4 className="text-orange text-xl md:text-2xl font-extrabold tracking-wide">
          Program Updates and Notifications
        </h4>

        <p className="mt-3 text-gray-700 text-base md:text-md leading-relaxed">
          Stay updated with the latest PESO programs, employment-related policy changes, and announcements. Gain insights into new initiatives designed to support job seekers and employees alike. By staying informed, you can make better decisions and stay competitive in the ever-changing job market.
        </p>

        <div className="mt-5 flex justify-center"> 
          <Link
            to="/announcement"
            className="inline-block text-darkblue text-sm md:text-base font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600 hover:scale-[1.08] active:scale-[0.95]"
          >
            View more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroNotif;