import React from "react";
import { motion } from "framer-motion";
import cityImage from "../assets/cityhall.webp";

const AboutCity = () => {
  return (
    <div className="bg-white py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-8 lg:px-12"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100">
          {/* Image Column */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <img
              src={cityImage}
              alt="Caloocan City Hall"
              className="w-full h-full object-cover transition-all duration-500 
                         group-hover:brightness-90 group-hover:contrast-125"
            />
            <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-500 mix-blend-multiply"></div>
          </motion.div>

          {/* Text Column */}
          <div className="p-8 lg:p-12">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-4xl md:text-5xl font-black text-black-primary mb-6 
              bg-gradient-to-r from-orange to-green
              bg-clip-text text-transparent"
            >
              About Caloocan
            </motion.h1>

            <motion.p
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="text-lg text-gray-700 leading-relaxed space-y-4"
            >
              <span className="block mb-4">
                Caloocan, a city with rich historical roots, was once a humble barrio of Tondo, known as
                <span className="font-bold text-orange-600 mx-1">
                  'Libis Espina'
                </span>
                or
                <span className="font-bold text-orange-600 mx-1">
                  'Aromahan'
                </span>.
              </span>

              <span className="block">
                Its name is believed to originate from Tagalog words:
                <span className="font-bold text-orange-600 mx-1">
                  'look'
                </span>
                (bay) or
                <span className="font-bold text-orange-600 mx-1">
                  'sulok'
                </span>
                (corner), reflecting its strategic location at the junction of old Tondo and Tambobong.
              </span>

              <span className="block mt-4 italic text-gray-500">
                In the late 18th century, resilient fishermen from Aromahan settled in its hills, transforming rocky terrain into farmland.
              </span>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutCity;