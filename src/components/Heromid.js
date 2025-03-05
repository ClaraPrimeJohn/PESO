import React from 'react';
import pesoJob from '../assets/peso-jobs.webp';

const Heromid = () => {
    return (
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-48 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-gray-100">
            {/* Left Side Text */}
            <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold py-2">
                    What is{" "}
                    <span className="font-extrabold text-blue underline decoration-blue text-shadow-yellow">
                        PESO?
                    </span>
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold p-2 sm:p-4 text-gray-700">
                    PUBLIC EMPLOYMENT SERVICE OFFICE
                </h2>
                <p className="text-base sm:text-lg md:text-lg lg:text-xl px-2 sm:px-4 text-left leading-relaxed sm:leading-loose lg:leading-loose pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                    The Public Employment Service Office (PESO) is a non-fee charging multi-employment service facility or entity established or accredited pursuant to Republic Act No. 8759, otherwise known as the PESO Act of 1999.
                    <br className="hidden sm:block" /><br className="hidden sm:block" />
                    The PESO's are community-based and maintained largely by local government units (LGU's) and a number of non-governmental organizations (NGO's) or community-based organizations (CBO's) and state universities and colleges (SUC's).
                </p>
            </div>

            {/* Right Side Image */}
            <div className="flex justify-center items-center md:items-start">
                <img 
                    src={pesoJob} 
                    alt="Peso Jobs" 
                    className="max-w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
};

export default Heromid;