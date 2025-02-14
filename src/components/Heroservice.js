import React from 'react';
import { Link } from 'react-router-dom';
import service from '../assets/service.png';
import service2 from '../assets/service2.png';
import service3 from '../assets/service3.png';
import service4 from '../assets/service4.png';

const Heroservice = () => {
    return (
        <div className='py-24 lg:px-48 px-8'>
            <h1 className='text-center text-4xl text-darkblue font-extrabold'>PESO Services</h1>
            <p className='text-center mx-auto py-4 text-lg w-9/12'>
                Unlock your career potential with PESO's comprehensive services, thoughtfully crafted to empower job seekers and enhance employment opportunities. Discover a wide array of resources, from curated job listings and application guidance to activity announcements and program updates. PESO is your trusted partner in navigating the job market, providing reliable, accessible, and up-to-date support every step of the way.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-8">
                <div className="p-8 rounded-md shadow-lg">
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        <img src={service} alt="Job Listings" className="w-full h-full object-contain" />
                    </div>
                    <h4 className='text-orange py-2 text-lg font-bold text-center'>Job Listings</h4>
                    <p className="text-center mt-2">Explore a wide array of job openings tailored to your unique skills and career interests. Whether you're seeking your first job or looking to advance your career, stay informed with the most recent opportunities available in your area. Begin your journey to professional growth and success today!</p>
                    <div className="flex justify-center mt-4">
                        <Link to="/job-listing" className="text-darkblue nav-effects font-bold">View more</Link>
                    </div>
                </div>

                <div className="p-8 rounded-md shadow-lg">
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        <img src={service2} alt="Job Application Process" className="w-full h-full object-contain" />
                    </div>
                    <h4 className='text-orange py-2 text-lg font-bold text-center'>Job Application Process</h4>
                    <p className="text-center mt-2">Navigating the job market can be challenging, but we're here to help. Learn how to create standout resumes and write compelling cover letters that catch recruiters' attention. Gain confidence with practical tips on how to prepare for and excel in interviews. Your comprehensive guide to a successful application process is just a click away!</p>
                    <div className="flex justify-center mt-4">
                        <Link to="/job-listing" className="text-darkblue nav-effects font-bold">View more</Link>
                    </div>
                </div>

                <div className="p-8 rounded-md shadow-lg">
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        <img src={service3} alt="PESO Activity Announcements" className="w-full h-full object-contain" />
                    </div>
                    <h4 className='text-orange py-2 text-lg font-bold text-center'>PESO Activity Announcements</h4>
                    <p className="text-center mt-2">Stay ahead by participating in PESO-organized activities designed to enhance your career opportunities. From job fairs and networking events to skill development workshops, discover ways to grow personally and professionally. Don’t miss out on the chance to connect with potential employers and like-minded individuals!</p>
                    <div className="flex justify-center mt-4">
                        <Link to="/announcement" className="text-darkblue nav-effects font-bold">View more</Link>
                    </div>
                </div>

                <div className="p-8 rounded-md shadow-lg">
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        <img src={service4} alt="Program Updates and Notifications" className="w-full h-full object-contain" />
                    </div>
                    <h4 className='text-orange py-2 text-lg font-bold text-center'>Program Updates and Notifications</h4>
                    <p className="text-center mt-2">Stay updated with the latest PESO programs, employment-related policy changes, and announcements. Gain insights into new initiatives designed to support job seekers and employees alike. By staying informed, you can make better decisions and stay competitive in the ever-changing job market.</p>
                    <div className="flex justify-center mt-4">
                        <Link to="/announcement" className="text-darkblue nav-effects font-bold">View more</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Heroservice;
