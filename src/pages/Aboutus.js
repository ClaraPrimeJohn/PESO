import React from 'react';
import VisionMission from '../components/VissionMission';
import aboutBanner from "../assets/about-us-banner.webp";
import LogoCarousel from '../components/LogoCarousel';
import PESOHistory from '../components/History';
import AboutCity from '../components/AboutCity';
import HowItWorks from "../components/HowItWorks";
import HiredGallery from '../components/HiredGallery';
import PageLoader from '../components/PageLoader'

const Aboutus = () => {
  return (
    <PageLoader>
      <div>
        <div className="w-full">
          <img src={aboutBanner} alt="About Us Banner" className="w-full h-auto" />
        </div>
    
        <HowItWorks />
        <AboutCity />
      
        <div className='lg:px-32 px-8 py-16'>
          <VisionMission />
        </div>
        <PESOHistory />
        <HiredGallery />
        <LogoCarousel />
      </div>
    </PageLoader>
  );
};

export default Aboutus;