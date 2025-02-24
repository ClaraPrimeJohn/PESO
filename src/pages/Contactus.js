import React, { useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import Banner from '../assets/banner.jpg';
import PageLoader from '../components/PageLoader';
import FaqIllustration from '../assets/contactus.png';

const Contactus = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PageLoader>
        <div className="py-16 px-6 lg:px-20">
            {/* Banner */}
            <div className="relative -mx-6 lg:-mx-20 -mt-20 mb-10">
                <img src={Banner} alt="banner" className="w-full object-cover rounded-lg shadow-lg" />
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl font-extrabold text-orange text-center mb-4">We’d Love to Hear from You</h1>
            <p className="text-lg text-gray-600 text-center mb-10">
                Whether you have questions about job applications, employer services, or training programs—we’re here to help.
            </p>

            {/* Contact Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {[
                    { 
                        icon: <FaLocationDot className="text-green text-5xl mb-4" />, 
                        title: "PESO South", 
                        details: "8th Ave, Grace Park East, Caloocan", 
                        buttonText: "Get Directions", 
                        link: "https://maps.app.goo.gl/nXWY6xv4tTmZoeN78"
                    },
                    { 
                        icon: <FaLocationDot className="text-green text-5xl mb-4" />, 
                        title: "PESO North", 
                        details: "887-1519 Zapote Rd, Caloocan", 
                        buttonText: "Get Directions", 
                        link: "https://maps.app.goo.gl/QKC7B8i4wWcqKUR29"
                    },
                    { 
                        icon: <IoCall className="text-green text-5xl mb-4" />, 
                        title: "Phone Support", 
                        details: "Globe: 0994-586-5688\nSmart: 0932-384-9283", 
                        buttonText: "Call Us" 
                    },
                    { 
                        icon: <IoIosMail className="text-green text-5xl mb-4" />, 
                        title: "Email Support", 
                        details: "peso@gmail.com", 
                        buttonText: "Send Email", 
                        link: "mailto:peso@gmail.com"
                    }
                ].map((item, index) => (
                    <div key={index} className="shadow-lg rounded-xl p-6 flex flex-col items-center text-center bg-white hover:shadow-xl transition-all">
                        {item.icon}
                        <h4 className="text-lg font-semibold text-darkblue mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{item.details}</p>
                        {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-blue border border-blue rounded-lg hover:bg-blue hover:text-white transition">{item.buttonText}</a>
                        ) : (
                            <button className="px-4 py-2 text-blue border border-blue rounded-lg hover:bg-blue hover:text-white transition">{item.buttonText}</button>
                        )}
                    </div>
                ))}
            </div>

            {/* FAQ & Illustration Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* FAQ Section */}
                <div className="bg-white rounded-xl p-6">
                    <h2 className="text-orange text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <ul className="space-y-4">
                        {[
                            { question: "How do I apply for a job?", answer: "Log in, search for a job, click 'Apply Now,' and upload your resume." },
                            { question: "Are there any fees?", answer: "No, PESO is free for both job seekers and employers." },
                            { question: "How is my data protected?", answer: "PESO follows the Data Privacy Act, encrypting and securing all user data." },
                            { question: "What if I encounter issues?", answer: "Visit 'Contact Us' and describe the issue. Our team will assist you." }
                        ].map((faq, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => toggleAccordion(index)} 
                                    className="flex items-center justify-between w-full text-lg font-semibold text-darkblue py-3"
                                >
                                    {faq.question}
                                    <MdKeyboardArrowDown className={`text-2xl transform transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 py-2" : "max-h-0"}`}>
                                    <p className="text-gray-600 px-2">{faq.answer}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Illustration / Icons */}
                <div className="flex justify-center">
                    <img src={FaqIllustration} alt="FAQ Illustration" className="w-full max-w-md object-cover" />
                </div>
            </div>
        </div>
        </PageLoader>
    );
};

export default Contactus;
