import React from "react";
import { Link } from "react-router-dom"; // Import the Link component

function CareerOpportunitiesBanner() {
  return (
    <div className="mx-48 bg-gradient-to-r from-blue to-green text-white py-16 mb-28 px-6 md:px-20 rounded-3xl text-center ">
      <h1 className="text-2xl md:text-4xl font-semibold mb-4">Discover Career Opportunities</h1>
      <p className="text-sm md:text-base mb-6">
        We help candidates know whether they’re qualified for a job – and allow you to see their match potential – giving you a better pool of qualified candidates to choose from.
      </p>
      <Link to="/job-listing">
        <button className="bg-blue hover:bg-darkblue text-white py-2 px-6 rounded-md text-sm md:text-base font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400">
          All Job Offer
        </button>
      </Link>
    </div>
  );
}

export default CareerOpportunitiesBanner;
