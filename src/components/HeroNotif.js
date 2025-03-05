import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import service4 from '../assets/service4.webp';

const HeroNotif = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-8 flex flex-col md:flex-row-reverse items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 p-6 md:p-10 lg:p-12 transition-all duration-300"
    >
      {/* Right Section - Image */}
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
            src={service4}
            alt="Program Updates and Notifications"
            className="w-[80px] md:w-[100px] lg:w-[110px] h-auto object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Left Section - Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full md:w-2/3 mt-6 md:mt-0 md:pr-8 text-center"
      >
        <motion.h4
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-orange text-xl md:text-2xl font-extrabold tracking-wide"
        >
          Program Updates and Notifications
        </motion.h4>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="mt-3 text-gray-700 text-base md:text-md leading-relaxed"
        >
          Stay updated with the latest PESO programs, employment-related policy changes, and announcements. Gain insights into new initiatives designed to support job seekers and employees alike. By staying informed, you can make better decisions and stay competitive in the ever-changing job market.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-5 flex justify-center"
        >
          <Link
            to="/announcement"
            className="inline-block text-darkblue text-sm md:text-base font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600"
          >
            View more →
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroNotif;