import React from "react";
import { motion } from "framer-motion";
import cityImage from "../assets/cityhall.jpg"; // Import image

const AboutCity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
      className="mt-8 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mb-8 flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
    >
      {/* Image Column */}
      <div className="w-full md:w-1/2 p-4 flex justify-center">
      <motion.img
  src={cityImage} 
  alt="Caloocan City"
  className="w-full h-auto max-w-md rounded-xl shadow-lg cursor-pointer 
             transition-transform duration-500 ease-out hover:scale-110 
             hover:shadow-[0_0_15px_rgba(255,165,0,0.5)] hover:brightness-110 hover:contrast-105"
  whileHover={{ scale: 1.1, rotate: 2 }} 
  transition={{ type: "spring", stiffness: 120 }} 
/>

      </div>
      
      {/* Text Column */}
      <div className="w-full md:w-1/2 p-6">
      <h1
  className="text-4xl pb-8 font-extrabold text-orange mb-4 rotate"
>
  About the City
</h1>

        <p className="text-lg text-gray-700 leading-relaxed">
  Caloocan, once a humble barrio of Tondo, was known as 
  <span className="font-bold text-orange"> ‘Libis Espina’ </span> or 
  <span className="font-bold text-orange"> ‘Aromahan.’ </span> Its name likely comes from the Tagalog words 
  <span className="font-bold text-orange"> ‘look’ </span> (bay) or 
  <span className="font-bold text-orange"> ‘sulok’ </span> (corner), as it sits at the junction of old Tondo and Tambobong (now Malabon). In the late 18th century, fishermen from 
  <span className="font-bold text-orange"> Aromahan </span> settled in its hills, clearing thorny plants and adapting to farming despite the rocky terrain.
</p>

      </div>
    </motion.div>
  );
};

export default AboutCity;