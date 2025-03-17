import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FaEye, FaSpinner, FaCalendarAlt, FaBriefcase, FaBuilding, FaSearch, FaFire, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({
        searchQuery: "",
        company: "",
        dateSort: "newest",
        popularity: "all", 
    });
    const [activeFilterMenu, setActiveFilterMenu] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user === null) return; 
        
        const fetchAppliedJobs = async () => {
            try {
                if (!user || !user.email) {
                    setIsLoading(false);
                    return;
                }

                const db = getFirestore();
                const applicationsRef = collection(db, "applications");
                const q = query(applicationsRef, where("applicant_email", "==", user.email));
                
                const querySnapshot = await getDocs(q);
                const jobsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        company: data.company || "Unknown Company",
                        jobTitle: data.job_title || "Unknown Job",
                        timestamp: data.timestamp?.toDate() || new Date(),
                        resumeLink: data.resume_link || null,
                        jobId: data.job_id || null,
                        applicantCount: 0,
                        isHot: false 
                    };
                });
                
                const uniqueCompanies = [...new Set(jobsData.map(job => job.company))];
                setCompanies(uniqueCompanies);
                
                const jobsWithApplicantCounts = await Promise.all(
                    jobsData.map(async (job) => {
                        if (!job.jobId) return job;
                        
                        const applicationsCountQuery = query(
                            collection(db, "applications"), 
                            where("job_id", "==", job.jobId)
                        );
                        const applicationsSnapshot = await getDocs(applicationsCountQuery);
                        const applicantCount = applicationsSnapshot.size;
                        
                        const isHot = applicantCount >= 3;
                        
                        return {
                            ...job,
                            applicantCount,
                            isHot
                        };
                    })
                );
                
                jobsWithApplicantCounts.sort((a, b) => b.timestamp - a.timestamp);
                
                setAppliedJobs(jobsWithApplicantCounts);
                setFilteredJobs(jobsWithApplicantCounts);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                toast.error("Failed to load your applied jobs.");
                setIsLoading(false);
            }
        };

        fetchAppliedJobs();
    }, [user]); 

    const applyFilters = () => {
        let result = [...appliedJobs];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(job => 
                job.jobTitle.toLowerCase().includes(query)
            );
        }

        if (filters.company) {
            result = result.filter(job => job.company === filters.company);
        }

        if (filters.popularity === "hot") {
            result = result.filter(job => job.isHot);
        }

        if (filters.dateSort === "newest") {
            result.sort((a, b) => b.timestamp - a.timestamp);
        } else if (filters.dateSort === "oldest") {
            result.sort((a, b) => a.timestamp - b.timestamp);
        }

        setFilteredJobs(result);
    };

    useEffect(() => {
        applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, appliedJobs]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setActiveFilterMenu(null);
    };

    const resetFilters = () => {
        setFilters({
            searchQuery: "",
            company: "",
            dateSort: "newest",
            popularity: "all"
        });
        setActiveFilterMenu(null);
    };

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

    const toggleFilterMenu = (filterName) => {
        if (filterName === 'company') {
            setActiveFilterMenu(activeFilterMenu === 'company' ? null : 'company');
        } else {
            if (activeFilterMenu === filterName) {
                setActiveFilterMenu(null);
            } else {
                setActiveFilterMenu(filterName);
            }
        }
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.searchQuery) count++;
        if (filters.company) count++;
        if (filters.dateSort !== "newest") count++;
        if (filters.popularity !== "all") count++;
        return count;
    };

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-gradient-to-r from-indigo-700 to-blue rounded-xl shadow-lg p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">Your Applications</h1>
                            <p className="text-indigo-100 mt-1">Track and manage your career opportunities</p>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <span className="text-lg font-semibold">{appliedJobs.length}</span>
                                <span className="ml-2 text-indigo-100">Total Applications</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Search Filter - Free flowing */}
                        <div className="relative">
                            <div className="flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium transition-colors bg-white text-gray-700">
                                <FaSearch className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search job titles..."
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 p-0 w-40 sm:w-auto"
                                />
                                {filters.searchQuery && (
                                    <FaTimes 
                                        className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" 
                                        onClick={() => handleFilterChange("searchQuery", "")}
                                    />
                                )}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => toggleFilterMenu('company')}
                                className={`flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium transition-colors ${filters.company ? 'bg-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaBuilding className="mr-2" />
                                {filters.company || 'Company'}
                                {filters.company && (
                                    <FaTimes 
                                        className="ml-2 text-white hover:text-gray-200" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFilterChange("company", "");
                                        }}
                                    />
                                )}
                            </button>
                            
                            {activeFilterMenu === 'company' && (
                                <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                    <div className="space-y-2">
                                        <div 
                                            className={`cursor-pointer rounded-md px-3 py-2 ${filters.company === "" ? "bg-indigo-50 text-blue" : "hover:bg-gray-50"}`}
                                            onClick={() => handleFilterChange("company", "")}
                                        >
                                            All Companies
                                        </div>
                                        {companies.map((company) => (
                                            <div 
                                                key={company} 
                                                className={`cursor-pointer rounded-md px-3 py-2 ${filters.company === company ? "bg-indigo-50 text-blue" : "hover:bg-gray-50"}`}
                                                onClick={() => handleFilterChange("company", company)}
                                            >
                                                {company}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => toggleFilterMenu('date')}
                                className={`flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium transition-colors ${filters.dateSort !== 'newest' ? 'bg-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaCalendarAlt className="mr-2" />
                                {filters.dateSort === 'newest' ? 'Newest First' : 'Oldest First'}
                            </button>
                            
                            {activeFilterMenu === 'date' && (
                                <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort by Date
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="newest"
                                                name="dateSort"
                                                value="newest"
                                                checked={filters.dateSort === 'newest'}
                                                onChange={() => handleFilterChange("dateSort", "newest")}
                                                className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                                            />
                                            <label htmlFor="newest" className="ml-2 block text-sm text-gray-700">
                                                Newest First
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="oldest"
                                                name="dateSort"
                                                value="oldest"
                                                checked={filters.dateSort === 'oldest'}
                                                onChange={() => handleFilterChange("dateSort", "oldest")}
                                                className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                                            />
                                            <label htmlFor="oldest" className="ml-2 block text-sm text-gray-700">
                                                Oldest First
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => toggleFilterMenu('popularity')}
                                className={`flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium transition-colors ${filters.popularity !== 'all' ? 'bg-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaFire className="mr-2" />
                                {filters.popularity === 'all' ? 'All Listings' : 'Hot Listings'}
                            </button>
                            
                            {activeFilterMenu === 'popularity' && (
                                <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter by Popularity
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="all"
                                                name="popularity"
                                                value="all"
                                                checked={filters.popularity === 'all'}
                                                onChange={() => handleFilterChange("popularity", "all")}
                                                className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                                            />
                                            <label htmlFor="all" className="ml-2 block text-sm text-gray-700">
                                                All Listings
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="hot"
                                                name="popularity"
                                                value="hot"
                                                checked={filters.popularity === 'hot'}
                                                onChange={() => handleFilterChange("popularity", "hot")}
                                                className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                                            />
                                            <label htmlFor="hot" className="ml-2 block text-sm text-gray-700">
                                                Hot Listings Only
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {getActiveFilterCount() > 0 && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-md text-sm font-medium"
                            >
                                <FaTimes className="mr-2" />
                                Reset Filters
                            </button>
                        )}
                    </div>
                    
                    {filteredJobs.length > 0 && (
                        <p className="text-gray-600 font-medium ml-2">
                            Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{appliedJobs.length}</span> applications
                        </p>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md border border-gray-100">
                        <div className="text-center">
                            <FaSpinner className="animate-spin text-3xl text-blue mx-auto mb-3" />
                            <p className="text-gray-600">Loading your applications...</p>
                        </div>
                    </div>
                ) : appliedJobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                            <FaBriefcase className="text-3xl text-blue" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your job search journey by browsing and applying to available positions.</p>
                        <button 
                            onClick={() => window.location.href = "/job-listing"} 
                            className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-amber-50 rounded-full mb-4">
                            <FaSearch className="text-2xl text-amber-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your filters or search criteria to find your applications.</p>
                        
                    </div>
                ) : (
                    <div>
                        <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-md border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicants
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Resume
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredJobs.map((job, index) => (
                                        <tr 
                                            key={job.id} 
                                            className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                                                    {job.isHot && (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red">
                                                            <FaFire className="mr-1" /> Hot
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700 font-medium">{job.company}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{formatDate(job.timestamp)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    {job.applicantCount > 0 ? (
                                                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-blue text-xs font-medium">
                                                            {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {job.resumeLink ? (
                                                    <button
                                                        onClick={() => handleViewResume(job.resumeLink)}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-blue hover:bg-indigo-100 transition-colors text-sm font-medium"
                                                    >
                                                        <FaEye className="mr-1.5" /> View Resume
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
                        <div className="md:hidden space-y-4">
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">{job.jobTitle}</h3>
                                            {job.isHot && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red">
                                                    <FaFire className="mr-1" /> Hot
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center mt-2 text-gray-700">
                                            <FaBuilding className="text-gray-400 mr-2" />
                                            <span className="font-medium">{job.company}</span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaCalendarAlt className="text-gray-400 mr-2" />
                                                <span>{formatDate(job.timestamp)}</span>
                                            </div>
                                            
                                            {job.applicantCount > 0 && (
                                                <div className="flex items-center">
                                                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-blue text-xs font-medium">
                                                        {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-end">
                                        {job.resumeLink ? (
                                            <button
                                                onClick={() => handleViewResume(job.resumeLink)}
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-blue hover:bg-indigo-100 transition-colors text-sm font-medium"
                                            >
                                                <FaEye className="mr-2" /> View Resume
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm px-4 py-2">Resume not available</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {activeFilterMenu && (
                <div 
                    className="fixed inset-0 bg-transparent z-0"
                    onClick={() => setActiveFilterMenu(null)}
                />
            )}
        </div>
    );
};

export default AppliedJobs;