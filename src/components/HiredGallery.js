import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../assets/hired1.webp";
import img2 from "../assets/hired2.webp";
import img3 from "../assets/hired3.webp";
import img4 from "../assets/hired4.webp";
import img5 from "../assets/hired5.webp";
import img6 from "../assets/hired6.webp";
import img7 from "../assets/hired7.webp";
import img8 from "../assets/hired8.webp";
import img9 from "../assets/hired1.webp";
import img10 from "../assets/hired6.webp";

const HiredGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Define images with offset positions - adjusted for 5 columns
  // Columns 1, 3, and 5 will have the same offset pattern
  const images = [
    { src: img1, id: 1, offsetY: 0 },      // Column 1
    { src: img2, id: 2, offsetY: 40 },     // Column 2
    { src: img3, id: 3, offsetY: 0 },      // Column 3
    { src: img4, id: 4, offsetY: 40 },     // Column 4
    { src: img5, id: 5, offsetY: 0 },      // Column 5
    { src: img6, id: 6, offsetY: 60 },     // Column 1 (row 2)
    { src: img7, id: 7, offsetY: 20 },     // Column 2 (row 2)
    { src: img8, id: 8, offsetY: 60 },     // Column 3 (row 2)
    { src: img9, id: 9, offsetY: 60 },     // Column 4 (row 2)
    { src: img10, id: 10, offsetY: 60 },     // Column 5 (row 2)
  ];

  // Standard blue hover color
  const hoverColor = "#0835CA"; // blue

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm uppercase tracking-wider text-[#FF6D18] font-medium mb-2 inline-block"
        >
          Success Stories
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF6D18] mb-4"
        >
          Hired Job Seekers
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-[#525252] max-w-xl mx-auto"
        >
          Celebrating our community members who successfully landed their dream jobs through our platform.
        </motion.p>
      </div>

      {/* 5-column layout */}
      <div className="relative h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {images.map((img, index) => (
            <motion.div
              layout
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] mb-8 md:mb-0"
              onClick={() => setSelectedImage(img.src)}
              style={{ 
                boxShadow: `0 8px 24px rgba(0, 0, 0, 0.12)`,
                // Make columns 1, 3, and 5 have the same offset pattern
                marginTop: index % 5 === 0 || index % 5 === 2 || index % 5 === 4 ? "0px" : 
                         index % 5 === 1 || index % 5 === 3 ? "40px" : `${img.offsetY}px`,
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10"
                style={{ 
                  background: `linear-gradient(to top, ${hoverColor}CC, transparent)` 
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: hoverColor }}
                ></div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white"
                >
                  <h3 className="font-bold text-lg">Success Story</h3>
                  <p className="text-sm text-white/90">Job seeker #{index + 1}</p>
                </motion.div>
              </div>
              
              <div className="w-full h-full">
                <img
                  src={img.src}
                  alt={`Hired Professional ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ objectPosition: "center" }}
                />
              </div>
              
              <motion.div 
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                style={{ color: hoverColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full rounded-lg overflow-hidden bg-black/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center p-2 md:p-4">
                <img
                  src={selectedImage}
                  alt="Selected Success Story"
                  className="max-h-[70vh] max-w-full object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/40 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HiredGallery;