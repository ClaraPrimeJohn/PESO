import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { FaEye, FaSpinner, FaCalendarAlt, FaBriefcase, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const user = auth.currentUser;
                if (!user || !user.email) {
                    setIsLoading(false);
                    return;
                }

                const db = getFirestore();
                const applicationsRef = collection(db, "applications");
                const q = query(applicationsRef, where("applicant_email", "==", user.email));
                
                const querySnapshot = await getDocs(q);
                const jobs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        company: data.company || "Unknown Company",
                        jobTitle: data.job_title || "Unknown Job",
                        timestamp: data.timestamp?.toDate() || new Date(),
                        resumeLink: data.resume_link || null
                    };
                });
                
                // Sort by most recent applications first
                jobs.sort((a, b) => b.timestamp - a.timestamp);
                
                setAppliedJobs(jobs);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                toast.error("Failed to load your applied jobs.");
                setIsLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleViewResume = (resumeLink) => {
        window.open(resumeLink, "_blank");
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6 text-darkblue">Your Applications</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-3xl text-darkblue" />
                </div>
            ) : appliedJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
                    <div className="flex justify-center mb-4">
                        <FaBriefcase className="text-4xl text-gray-300" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-700 mb-2">No Applications Yet</h2>
                    <p className="text-gray-500 mb-6">You haven't applied to any jobs yet.</p>
                    <button 
                        onClick={() => window.location.href = "/job-listing"} 
                        className="text-darkblue px-6 py-2  hover:text-blue transition-colors"
                    >
                        -Browse Jobs-
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {/* Desktop view (table) - Hidden on mobile */}
                    <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resume
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appliedJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-darkblue">{job.jobTitle}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{job.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{formatDate(job.timestamp)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {job.resumeLink ? (
                                                <button
                                                    onClick={() => handleViewResume(job.resumeLink)}
                                                    className="inline-flex items-center px-3 py-1 text-darkblue hover:text-blue transition-colors text-sm"
                                                >
                                                    <FaEye className="mr-1" /> View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile view (cards) - Shown only on mobile */}
                    <div className="md:hidden space-y-3">
                        {appliedJobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="mb-3">
                                    <h3 className="text-lg font-medium text-darkblue">{job.jobTitle}</h3>
                                    <div className="flex items-center mt-1 text-gray-600">
                                        <FaBuilding className="text-gray-400 mr-2" />
                                        <span>{job.company}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <FaCalendarAlt className="text-gray-400 mr-2" />
                                    <span>Applied: {formatDate(job.timestamp)}</span>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-3 flex justify-end">
                                    {job.resumeLink ? (
                                        <button
                                            onClick={() => handleViewResume(job.resumeLink)}
                                            className="inline-flex items-center px-4 py-2 text-darkblue hover:text-blue transition-colors transition-colors text-sm"
                                        >
                                            <FaEye className="mr-2" /> View Resume
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Resume not available</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;