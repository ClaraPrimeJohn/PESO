import { useEffect } from "react";
import history from "../assets/history.jpg";
import history1 from "../assets/history1.jpg";
import history2 from "../assets/history2.jpg";

const PESOHistory = () => {
  useEffect(() => {
    const handleScroll = () => {
      const revealElements = document.querySelectorAll(".history-item");
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          element.classList.add("opacity-100", "translate-y-0");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="py-24 lg:px-48 px-8 bg-gray-100 text-center relative">
      <h2 className="text-3xl font-bold text-blue border-b-2 pb-4">OUR HISTORY</h2>
      <div className="relative w-full max-w-6xl mx-auto mt-8">
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-2 bg-blue h-full shadow-xl z-0"></div>
        
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 relative history-item opacity-0 transition-all duration-700 ease-in-out ">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue/30 backdrop-blur-lg border border-white/60 rounded-full shadow-lg z-10 hidden md:block"></div>

          <div className="w-full md:w-5/12 px-6 text-center md:text-right z-10">
            <h3 className="text-2xl font-bold text-blue">2000 - 2005</h3>
            <p className="text-gray-700 mt-2">
              <strong>November 13, 2000</strong> - PESO was formally established to provide employment services to the community. It started with a few job matching programs and career guidance sessions.
            </p>
          </div>
          <div className="w-full md:w-5/12 mt-4 md:mt-0 flex justify-center z-10">
            <img src={history} alt="PESO History" className="w-90 h-60 shadow-xl object-cover transition-all duration-700 ease-in-out" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse items-start justify-between mb-16 relative history-item opacity-0 transition-all duration-700 ease-in-out">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue/30 backdrop-blur-lg border border-white/60 rounded-full shadow-lg z-10 hidden md:block"></div>

          <div className="w-full md:w-5/12 px-6 text-center md:text-left z-10">
            <h3 className="text-2xl font-bold text-blue">2005 - 2010</h3>
            <p className="text-gray-700 mt-2">
              <strong>March 8, 2006</strong> - Expansion of PESO services, including skills training and overseas employment assistance, to cater to more job seekers.
            </p>
          </div>
          <div className="w-full md:w-5/12 mt-4 md:mt-0 flex justify-center z-10">
            <img src={history1} alt="PESO History" className="w-90 h-60 shadow-xl object-cover transition-all duration-700 ease-in-out" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 relative history-item opacity-0 transition-all duration-700 ease-in-out ">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue/30 backdrop-blur-lg border border-white/60 rounded-full shadow-lg z-10 hidden md:block"></div>

          <div className="w-full md:w-5/12 px-6 text-center md:text-right z-10">
            <h3 className="text-2xl font-bold text-blue">2010 - 2015</h3>
            <p className="text-gray-700 mt-2">
              <strong>July 22, 2012</strong> - PESO adopted digital employment facilitation, introducing an online job-matching system to improve accessibility for job seekers and employers.
            </p>
          </div>
          <div className="w-full md:w-5/12 mt-4 md:mt-0 flex justify-center z-10">
            <img src={history2} alt="PESO History" className="w-90 h-60 shadow-xl object-cover transition-all duration-700 ease-in-out" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PESOHistory;
