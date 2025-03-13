import React, { useState } from 'react';
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";


import Banner from '../assets/banner.webp';
import PageLoader from '../components/PageLoader';
import FaqImage1 from '../assets/Job hunt-amico.webp';
import FaqImage2 from '../assets/Job hunt-pana.webp';
import FaqImage3 from '../assets/brand communication-pana.webp';

const ContactUs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const contactOptions = [
        {
            icon: <FaLocationDot className="text-green text-2xl" />,
            title: "PESO South",
            details: "8th Ave, Grace Park East, Caloocan",
            link: "https://maps.app.goo.gl/nXWY6xv4tTmZoeN78"
        },
        {
            icon: <FaLocationDot className="text-green text-2xl" />,
            title: "PESO North",
            details: "887-1519 Zapote Rd, Caloocan",
            link: "https://maps.app.goo.gl/QKC7B8i4wWcqKUR29"
        },
        {
            icon: <FaPhone className="text-green text-2xl" />,
            title: "Phone Support",
            details: (
                <>
                    Globe: <a href="tel:+639945865688" className="text-blue hover:underline">0995-557-4478</a>
                    <br />
                    Smart: <a href="tel:+639323849283" className="text-blue hover:underline">0961-035-0529</a>
                </>
            )
        },
        {
            icon: <FaEnvelope className="text-green text-2xl" />,
            title: "Email Support",
            details: <a href="mailto:peso@gmail.com" className="text-blue hover:underline">peso@gmail.com</a>
        }
    ];

    const faqs = [
        {
            question: "How do I apply for a job?",
            answer: "Log in to your PESO account, search for jobs that match your skills and qualifications, click the 'Apply Now' button on any job listing, and follow the prompts to upload your resume and any additional documents requested by the employer."
        },
        {
            question: "Are there any fees for using PESO services?",
            answer: "No, all PESO services are completely free of charge for both job seekers and employers. We're committed to providing accessible employment opportunities and services to all Caloocan residents without any financial barriers."
        },
        {
            question: "How is my personal data protected on the PESO platform?",
            answer: "PESO strictly adheres to the Data Privacy Act of 2012. We implement robust encryption technologies and secure protocols to safeguard all user information. Your data is only accessible to authorized PESO staff and potential employers you apply to."
        },
        {
            question: "What if I encounter technical issues while using the platform?",
            answer: "If you experience any technical difficulties, please try refreshing your browser or clearing your cache first. If problems persist, contact our technical support team using the email or phone numbers listed on this page."
        },
        {
            question: "Does PESO offer skills training or workshops?",
            answer: "Yes, PESO regularly conducts free skills training programs, career development workshops, and job fairs. Check the 'Events' section of our website for upcoming schedules, or visit either of our physical offices to inquire about the latest training opportunities."
        },
        {
            question: "How can employers post job openings on PESO?",
            answer: "Employers can register for an account on our platform, verify their business information, and then post job openings through their dashboard. Our team reviews all listings to ensure they meet our guidelines before they become visible to job seekers."
        },
        {
            question: "How can I apply for a job?",
            answer: "First, create an account and complete your profile with the required information. Then, upload your resume and apply to the job you want."
        },
        {
            question: "Is PESO only for Caloocan residents?",
            answer: "While our primary focus is serving Caloocan residents, our job listings and services are available to all. However, some specific programs and priority placements may be reserved for Caloocan citizens as part of our local employment initiatives."
        },
        {
            question: "How often are new job listings posted?",
            answer: "New job listings are posted daily. Our team works closely with local businesses and national companies to ensure a steady stream of employment opportunities. We recommend checking the platform regularly or setting up job alerts to stay updated on the latest openings."
        }
    ];

    const officeLocations = [
        {
            title: "PESO South Office",
            address: "8th Ave, Grace Park East, Caloocan",
            directions: "https://maps.app.goo.gl/nXWY6xv4tTmZoeN78",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.4121094576016!2d120.99025817580905!3d14.643679476897379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b6df9c248abd%3A0xa14947ea380b33d1!2sCaloocan%20City%20Hall!5e0!3m2!1sen!2sph!4v1709817775390!5m2!1sen!2sph",
            hours: "Monday - Friday: 8:00 AM - 5:00 PM"
        },
        {
            title: "PESO North Office",
            address: "887-1519 Zapote Rd, Caloocan",
            directions: "https://maps.app.goo.gl/QKC7B8i4wWcqKUR29",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.975626777158!2d120.97382587580933!3d14.6661609768562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b44d6bbf8ba3%3A0xb8ca5613a98f039c!2sZapote%20Rd%2C%20Caloocan%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1709823456789!5m2!1sen!2sph",
            hours: "Monday - Friday: 8:00 AM - 5:00 PM"
        }
    ];

    return (
        <PageLoader>
            <div className="w-full">
                {/* Medium-sized Hero Banner */}
                <div className="relative w-full h-[400px]">
                    <img src={Banner} alt="Contact Us" className="w-full h-full object-cover brightness-75" />
                      <div className="absolute inset-0 bg-gradient-to-r from-darkblue/90 to-green/90 flex flex-col items-center justify-center text-white p-8">
                        <div className="bg-darkblue/60 px-8 py-8 rounded-lg backdrop-blur-sm">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-md">Get in touch</h1>
                            <p className="text-lg md:text-2xl max-w-3xl font-medium text-center drop-shadow-md">
                                Find answers to your questions about job applications, employer services, and more.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content - increased max width */}
                <div className="max-w-8xl mx-auto py-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                        {contactOptions.map((option, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 flex items-start space-x-4 border border-gray-100">
                                <div className="bg-green/10 p-4 rounded-full">
                                    {option.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-darkblue mb-3">{option.title}</h3>
                                    <div className="text-gray-600 text-sm">
                                        {option.link ? (
                                            <a href={option.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue">
                                                {option.details}
                                            </a>
                                        ) : (
                                            option.details
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <h2 className="text-3xl font-bold text-darkblue mb-16 text-center">Frequently Asked Questions</h2>

                    <div className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                            <div className="md:col-span-3 space-y-2">
                                {faqs.slice(0, 3).map((faq, index) => (
                                    <div key={index}>
                                        <div className="py-5">
                                            <button
                                                onClick={() => toggleAccordion(index)}
                                                className="flex items-center justify-between w-full text-left group focus:outline-none"
                                            >
                                                <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue transition-colors">
                                                    {faq.question}
                                                </h3>
                                                <span className="ml-6 flex-shrink-0">
                                                    {openIndex === index ? (
                                                        <CiCircleMinus className="h-6 w-6 text-blue" />
                                                    ) : (
                                                        <CiCirclePlus className="h-6 w-6 text-black-secondary group-hover:text-blue" />
                                                    )}
                                                </span>
                                            </button>
                                            <div
                                                className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <p className="text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <img src={FaqImage1} alt="FAQ Illustration" className="h-80 w-80 object-contain" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                            <div className="flex items-center justify-center md:order-first">
                                <img src={FaqImage2} alt="FAQ Illustration" className="h-80 w-80 object-contain" />
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                {faqs.slice(3, 6).map((faq, index) => (
                                    <div key={index + 3}>
                                        <div className="py-5">
                                            <button
                                                onClick={() => toggleAccordion(index + 3)}
                                                className="flex items-center justify-between w-full text-left group focus:outline-none"
                                            >
                                                <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue transition-colors">
                                                    {faq.question}
                                                </h3>
                                                <span className="ml-6 flex-shrink-0">
                                                    {openIndex === index + 3 ? (
                                                        <CiCircleMinus className="h-6 w-6 text-blue" />
                                                    ) : (
                                                        <CiCirclePlus className="h-6 w-6 text-black-secondary group-hover:text-blue" />
                                                    )}
                                                </span>
                                            </button>
                                            <div
                                                className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index + 3 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <p className="text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            <div className="md:col-span-3 space-y-2">
                                {faqs.slice(6, 9).map((faq, index) => (
                                    <div key={index + 6}>
                                        <div className="py-5">
                                            <button
                                                onClick={() => toggleAccordion(index + 6)}
                                                className="flex items-center justify-between w-full text-left group focus:outline-none"
                                            >
                                                <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue transition-colors">
                                                    {faq.question}
                                                </h3>
                                                <span className="ml-6 flex-shrink-0">
                                                    {openIndex === index + 6 ? (
                                                        <CiCircleMinus className="h-6 w-6 text-blue" />
                                                    ) : (
                                                        <CiCirclePlus className="h-6 w-6 text-black-secondary group-hover:text-blue" />
                                                    )}
                                                </span>
                                            </button>
                                            <div
                                                className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index + 6 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <p className="text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <img src={FaqImage3} alt="FAQ Illustration" className="h-80 w-80 object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* Additional Help Button */}

                    {/* Two-column Map Section */}
                    <h2 className="text-3xl font-bold text-darkblue mb-12 text-center">Visit Our Offices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        {officeLocations.map((office, index) => (
                            <div key={index} className="bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <div className="h-72">
                                    <iframe
                                        src={office.mapEmbed}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`${office.title} Location`}
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-semibold text-darkblue mb-3">{office.title}</h3>
                                    <p className="text-gray-600 mb-3">{office.address}</p>
                                    <p className="text-gray-600 mb-6">{office.hours}</p>
                                    <a
                                        href={office.directions}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 mb-6">Can't find what you're looking for?</p>
                        <a
                            href="mailto:peso@gmail.com"
                            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-orange hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-colors duration-300"
                        >
                            Contact Support Team
                        </a>
                    </div>

                </div>
            </div>
        </PageLoader>
    );
};

export default ContactUs;