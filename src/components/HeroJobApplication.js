import React from 'react';
import { Link } from 'react-router-dom';
import service2 from '../assets/service2.webp';

const HeroJobApplications = () => {
  return (
    <div
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-3 flex flex-col md:flex-row-reverse items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 p-6 md:p-10 lg:p-12 transition-all duration-300 hover:scale-[1.005]"
    >
      {/* right w/ image  */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div
          className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative animate-float"
        >
          <img
            src={service2}
            alt="Job Application Process"
            loading="lazy"
            className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
          />
        </div>
      </div>

      {/* left w/ description */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0 flex flex-col items-center text-center">
        <h4 className="text-orange text-xl md:text-2xl font-extrabold tracking-wide">
          Job Application Process
        </h4>

        <p className="mt-3 text-gray-700 text-base md:text-md leading-relaxed">
          Navigating the job market can be challenging, but we're here to help. Learn how to create standout resumes and write compelling cover letters that catch recruiters' attention. Gain confidence with practical tips on how to prepare for and excel in interviews. Your comprehensive guide to a successful application process is just a click away!
        </p>

        <div className="mt-5 flex justify-center">
          {/* route to job listing*/}
          <Link
            to="/job-listing"
            className="inline-block text-darkblue font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600 hover:scale-[1.08] active:scale-[0.95]"
          >
            View more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroJobApplications;