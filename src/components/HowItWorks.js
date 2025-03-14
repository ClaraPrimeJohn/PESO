import React from 'react';
import { FaRegClipboard, FaRegQuestionCircle, FaUserAlt, FaGraduationCap } from 'react-icons/fa';

const HowItWorks = () => {
    // Custom color palette
    const colors = {
        'yellow': "#FFB42C",
        'darkblue': "#001D7D",
        'red': "#F20000",
        'green': "#5FD35F",
        'orange': "#FF6D18", 
        'blue': "#0835CA",
        'black-primary': "#525252",
        'black-secondary': "#404040",
        'gray-secondary': "#737373",
    };

    return (
        <div className="py-20 px-6 lg:px-16 rounded-3xl mx-4 sm:mx-8 md:mx-16 lg:mx-32">
            <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-3">THE JOURNEY</span>
                <h2 className="text-4xl font-bold text-gray-800 leading-tight">Your Path to Success</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">We've simplified the process to help you find your dream job or perfect candidate in just four easy steps.</p>
            </div>
            
            <div className="relative">
                {/* Connection line */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-200 via-orange-400 to-yellow-200 transform -translate-y-1/2 z-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                    {/* Step 1 */}
                    <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl bg-white p-8 shadow-md">
                        <div className="flex justify-center">
                            <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-blue to-darkblue rounded-2xl rotate-3 shadow-lg mb-6" style={{ background: `linear-gradient(to bottom right, ${colors.blue}, ${colors.darkblue})` }}>
                                <FaRegClipboard className="text-white text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors['black-primary'] }}>Create Your Account</h3>
                        <p className="text-center" style={{ color: colors['gray-secondary'] }}>
                            Sign up in seconds and unlock a world of opportunities tailored to your skills and ambitions.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl bg-white p-8 shadow-md">
                        <div className="flex justify-center">
                            <div className="flex justify-center items-center w-20 h-20 rounded-2xl -rotate-3 shadow-lg mb-6" style={{ background: `linear-gradient(to bottom right, ${colors.yellow}, ${colors.orange})` }}>
                                <FaRegQuestionCircle className="text-white text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors['black-primary'] }}>Personalized Guidance</h3>
                        <p className="text-center" style={{ color: colors['gray-secondary'] }}>
                            Our AI-powered system learns your preferences to recommend the perfect matches and provide tailored advice.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl bg-white p-8 shadow-md">
                        <div className="flex justify-center">
                            <div className="flex justify-center items-center w-20 h-20 rounded-2xl rotate-3 shadow-lg mb-6" style={{ background: `linear-gradient(to bottom right, ${colors.green}, ${colors.darkblue})` }}>
                                <FaUserAlt className="text-white text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors['black-primary'] }}>Showcase Your Talents</h3>
                        <p className="text-center" style={{ color: colors['gray-secondary'] }}>
                            Build a compelling profile that highlights your unique skills, experience, and career aspirations.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl bg-white p-8 shadow-md">
                        <div className="flex justify-center">
                            <div className="flex justify-center items-center w-20 h-20 rounded-2xl -rotate-3 shadow-lg mb-6" style={{ background: `linear-gradient(to bottom right, ${colors.red}, ${colors.orange})` }}>
                                <FaGraduationCap className="text-white text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors['black-primary'] }}>Connect & Succeed</h3>
                        <p className="text-center" style={{ color: colors['gray-secondary'] }}>
                            Apply with confidence or find your ideal candidate through our streamlined, transparent process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;