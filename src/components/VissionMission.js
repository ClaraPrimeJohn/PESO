import React from 'react';
import pesoLogo from '../assets/about-6.png';

const VisionMission = () => {
    return (
        <div className="bg-white text-white py-12">
            <div className="mx-auto px-6 lg:px-20">
                <div className="lg:flex lg:items-center lg:gap-10 mt-8 justify-center">
                    <div className="lg:w-1/2">
                        <img
                            src={pesoLogo}
                            alt="PESO"
                            className='p-2'
                        />
                    </div>

                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <div className='text-left'>
                            <h2 className="text-sm uppercase text-blue tracking-wide">Vision & Mission</h2>
                            <h1 className="text-2xl text-darkblue font-bold my-4">
                                Empowering Growth through Innovative Employment and Technological Solutions
                            </h1>
                        </div>


                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800">Our Vision</h3>
                            <p className="mt-2 text-base text-gray-600">
                                Creating the Province of Bulacan as a Province that provides reliable and sustainable employment facilitation services that contribute to poverty alleviation and economic development in commitment and accordance with the People's Agenda 10.
                            </p>
                        </div>
                   
                        <div className='mb-8'>
                            <h3 className="text-lg font-bold text-gray-800">Our Mission</h3>
                            <p className="mt-2 text-base text-gray-600">
                                To facilitate equal employment opportunities to the province's constituents through Job Matching and Coaching employability enhancement and referrals for livelihood or training, and promotion  of industrial peace through tripartism.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionMission;
