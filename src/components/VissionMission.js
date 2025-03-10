import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaLightbulb } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const VisionMission = () => {
  return (
    <motion.div
      
    >
      {/* Dark Overlay for Readability */}
      <div className="relative inset-0 bg-white"></div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative max-w-4xl mx-auto text-center text-white"
          variants={fadeInUp}
        >
          <motion.h2
            className="text-sm uppercase tracking-wide text-orange"
            variants={fadeInUp}
          >
            Mission & Vision
          </motion.h2>
          <motion.h1
            className="text-3xl sm:text-3xl font-bold mt-3 mb-6 drop-shadow-lg text-darkblue px-3 py-2 rounded-lg"
            variants={fadeInUp}
          >
            Empowering Growth through Innovative Employment
            and <br /> Technological Solutions
          </motion.h1>
        </motion.div>

        {/* Card Container */}
        <motion.div
          className="grid mt-10 grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Mission Card */}
          <motion.div
            className="bg-orange p-6 rounded-2xl shadow-lg border-red backdrop-blur-md transform transition-all hover:scale-105 hover:shadow-xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.08, y: -3 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange p-3 rounded-full">
                <FaBullseye className="text-white text-3xl" />
              </div>
              <h3 className="text-xl text-white font-semibold">Mission</h3>
            </div>
            <p className="mt-3 text-white text-left ml-5 text-base text-opacity-90 leading-relaxed">
              To facilitate equal employment opportunities through Job Matching,
              Coaching, and livelihood training for economic development.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            className="bg-blue p-6 rounded-2xl shadow-lg border-blue backdrop-blur-md transform transition-all hover:scale-105 hover:shadow-xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.08, y: -3 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue p-3 rounded-full">
                <FaLightbulb className="text-white text-3xl" />
              </div>
              <h3 className="text-xl text-white font-semibold">Vision</h3>
            </div>
            <p className="mt-3 text-white text-left ml-5 text-base text-opacity-90 leading-relaxed">
              A province that provides reliable and sustainable employment
              facilitation services, contributing to poverty alleviation and
              industrial growth.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VisionMission;