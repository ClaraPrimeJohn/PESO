import React from 'react';
import { Link } from 'react-router-dom';
import service3 from '../assets/service3.webp';

const HeroAnnouncement = () => {
  return (
    <div
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-3 flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 px-12 md:px-16 lg:px-20 py-8 md:py-10 lg:py-12 transition-all duration-300 hover:scale-[1.005]"
    >
      {/* left w/ image */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div
          className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative flex items-center justify-center animate-float"
        >
          <img
            src={service3}
            alt="PESO Activity Announcements"
            loading="lazy"
            className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
          />
        </div>
      </div>

      {/* right w/ description */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0 flex flex-col items-center text-center px-6 md:px-8">
        <h4 className="text-orange text-xl md:text-2xl font-extrabold tracking-wide">
          PESO Activity Announcements
        </h4>

        <p className="mt-3 text-gray-700 text-base md:text-md leading-relaxed">
          Stay ahead by participating in PESO-organized activities designed to enhance your career opportunities. From job fairs and networking events to skill development workshops, discover ways to grow personally and professionally. Don't miss out on the chance to connect with potential employers and like-minded individuals!
        </p>

        <div className="mt-5 flex justify-center">
          {/* route to announcement*/}
          <Link
            to="/announcement"
            className="inline-block text-darkblue font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600 hover:scale-[1.06] active:scale-[0.95]"
          >
            View more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroAnnouncement;