import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/jobfair.jpg";
import img2 from "../assets/jobfair1.jpg";
import img3 from "../assets/jobfair2.jpg";
import img4 from "../assets/jobfair3.jpg";
import img5 from "../assets/jobfair2.jpg";
import img6 from "../assets/jobfair3.jpg";
import img7 from "../assets/jobfair.jpg";
import img8 from "../assets/jobfair1.jpg";

const HiredGallery = () => {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 py-20 text-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-orange mb-4 md:mb-6 uppercase"
      >
        Hired Job Seekers
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="text-base md:text-lg text-gray-700 mb-8 md:mb-10"
      >
        Congratulations to our successful job seekers!
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
            className="relative group overflow-hidden rounded-xl shadow-lg transition-shadow duration-300"
          >
            <img
              src={img}
              alt={`Hired ${index + 1}`}
              className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HiredGallery;