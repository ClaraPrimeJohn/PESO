import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import service3 from '../assets/service3.webp';

const HeroAnnouncement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.005 }}
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-3 flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 px-12 md:px-16 lg:px-20 py-8 md:py-10 lg:py-12 transition-all duration-300"
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
          className="bg-gradient-to-b from-gray-100 to-gray-300 shadow-xl p-10 rounded-full border border-gray-300 relative flex items-center justify-center"
        >
          <img
            src={service3}
            alt="PESO Activity Announcements"
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
        className="w-full md:w-2/3 mt-6 md:mt-0 flex flex-col items-center text-center px-6 md:px-8"
      >
        <motion.h4
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-orange text-xl md:text-2xl font-extrabold tracking-wide"
        >
          PESO Activity Announcements
        </motion.h4>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="mt-3 text-gray-700 text-base md:text-md leading-relaxed"
        >
          Stay ahead by participating in PESO-organized activities designed to enhance your career opportunities. From job fairs and networking events to skill development workshops, discover ways to grow personally and professionally. Don’t miss out on the chance to connect with potential employers and like-minded individuals!
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-5 flex justify-center"
        >
          <Link
            to="/announcement"
            className="inline-block text-darkblue font-bold border-2 border-darkblue px-4 py-2 rounded-md transition duration-300 transform hover:text-white hover:bg-blue hover:border-orange-600"
          >
            View more →
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroAnnouncement;