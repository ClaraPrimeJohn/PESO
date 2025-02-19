import React from "react";
import { Link } from "react-router-dom"; 

function CareerOpportunitiesBanner() {
  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 bg-gradient-to-r from-blue to-green text-white py-10 sm:py-12 md:py-16 mb-14 sm:mb-20 md:mb-28 px-4 sm:px-6 md:px-10 lg:px-20 rounded-2xl sm:rounded-3xl text-center">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold mb-2 sm:mb-4">
        Discover Career Opportunities
      </h1>
      <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-relaxed">
        We help candidates know whether they’re qualified for a job – and allow you to see their match potential – giving you a better pool of qualified candidates to choose from.
      </p>
      <Link to="/job-listing">
        <button className="bg-blue hover:bg-darkblue text-white py-2 px-4 sm:px-6 rounded-md text-xs sm:text-sm md:text-base font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300">
          All Job Offers
        </button>
      </Link>
    </div>
  );
}

export default CareerOpportunitiesBanner;
