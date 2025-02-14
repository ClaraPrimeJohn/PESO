import React from 'react';
import pesoJob from '../assets/peso-jobs.png';

const Heromid = () => {
    return (
        <div className="py-24 lg:px-48 px-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-100">
            {/* Left Side Text */}
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold py-2">
                    What is{" "}
                    <span className="font-extrabold text-blue underline decoration-blue text-shadow-yellow">
                        PESO?
                    </span>
                </h1>
                <h2 className="text-3xl font-extrabold p-4 text-gray-700">
                    PUBLIC EMPLOYMENT SERVICE OFFICE
                </h2>
                <p className="text-xl px-4 text-left leading-10 pb-20">
                    The Public Employment Service Office (PESO) is a non-fee charging multi-employment service facility or entity established or accredited pursuant to Republic Act No. 8759, otherwise known as the PESO Act of 1999.
                    The PESO's are community-based and maintained largely by local government units (LGU's) and a number of non-governmental organizations (NGO's) or community-based organizations (CBO's) and state universities and colleges (SUC's).
                </p>
                {/* <h2 className="text-2xl font-extrabold p-4 text-gray-700">
                    What are the objectives of the{" "}
                    <span className="font-extrabold text-blue underline decoration-blue text-shadow-yellow">
                        PESO?
                    </span>
                </h2>
                <h4 className="text-xl font-extrabold p-4 text-black">General Objective</h4>
                <ul className="list-disc pl-12 text-lg">
                    <li>Ensure the prompt, timely and efficient delivery of employment service and provision of information on the other DOLE programs.</li>
                </ul>
                <h4 className="text-xl font-extrabold p-4 text-black">Specific Objectives</h4>
                <ul className="list-disc pl-12 text-lg">
                    <li>Provide a venue where people could explore simultaneously various employment options and actually seek assistance they prefer.</li>
                    <li>Serve as referral and information center for the various services and programs of DOLE and other government agencies present in the area.</li>
                    <li>Provide clients with adequate information on employment and labor market situation in the area.</li>
                    <li>Network with other PESO's within the region on employment for job exchange purposes.</li>
                </ul> */}
            </div>

            {/* Right Side Image */}
            <div className="flex justify-center items-start ">
                <img src={pesoJob}alt="Peso Jobs"/>
            </div>
        </div>
    );
};

export default Heromid;