import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import service from '../assets/service.webp';

const HeroJoblistings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full mt-10 py-2"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="text-center text-4xl text-darkblue font-extrabold"
      >
        PESO Services
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="text-center mt-3 mb-8 mx-auto py-4 text-xl w-9/12 px-2 md:px-4"
      >
        Unlock your career potential with PESO's comprehensive services, thoughtfully crafted to empower job seekers and enhance employment opportunities. Discover a wide array of resources, from curated job listings and application guidance to activity announcements and program updates. PESO is your trusted partner in navigating the job market, providing reliable, accessible, and up-to-date support every step of the way.
      </motion.p>

      {/* Job Listings Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        className="mt-1 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-1 flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 transition-all duration-300"
      >
        {/* Left Section - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full md:w-1/3 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative"
          >
            <img
              src={service}
              alt="Job Listings"
              className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Right Section - Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full md:w-2/3 mt-6 md:mt-0 flex flex-col items-center text-center px-2 md:px-4"
        >
          <motion.h4
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-orange text-xl md:text-2xl font-extrabold tracking-wide"
          >
            Job Listings
          </motion.h4>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="mt-3 text-gray-700 text-base md:text-md leading-relaxed"
          >
            Explore a wide array of job openings tailored to your unique skills and career interests. Whether you're seeking your first job or looking to advance your career, stay informed with the most recent opportunities available in your area. Begin your journey to professional growth and success today!
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-5 flex justify-center"
          >
            <Link
              to="/job-listing"
              className="inline-block text-darkblue font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600"
            >
              View more →
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroJoblistings;