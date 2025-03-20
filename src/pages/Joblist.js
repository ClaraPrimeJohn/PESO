import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { toast } from "react-hot-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/companycolored.webp";
import PageLoader from "../components/PageLoader";
import { IoFilterSharp } from "react-icons/io5";
import TourGuideButton from "../components/TourGuideButton";

const Joblist = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [user, setUser] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTransition, setFilterTransition] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("latest");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobCollection = collection(db, "jobs");
        const snapshot = await getDocs(jobCollection);
        const fetchedJobs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(job => job.isOpen);
        setJobs(fetchedJobs);

        // Add this timeout to trigger the visibility transition after jobs are loaded
        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs.");
      }
    };

    fetchJobs();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleFilter = () => {
    if (isFilterOpen) {
      // If closing the filter
      setFilterTransition(false);
      setTimeout(() => {
        setIsFilterOpen(false);
      }, 300);
    } else {
      // If opening the filter
      setIsFilterOpen(true);
      setTimeout(() => {
        setFilterTransition(true);
      }, 10);
    }
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        if (!user || !user.email) {
          setIsLoading(false);
          return;
        }
        const applicationsRef = collection(db, "applications");
        const q = query(applicationsRef, where("applicant_email", "==", user.email));
        
        const querySnapshot = await getDocs(q);
        const appliedIds = querySnapshot.docs.map(doc => doc.data().job_id);
        
        setAppliedJobIds(appliedIds);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error("Failed to load your applied jobs.");
        setIsLoading(false);
      }
    };
    if (user) {
      fetchAppliedJobs();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleViewModeChange = (mode) => {
    if (viewMode !== mode) {
      // Hide content with smooth transition before changing view mode
      setIsVisible(false);
      setIsTransitioning(true);

      setTimeout(() => {
        setViewMode(mode);

        // After changing the view mode, show content again with smooth transition
        setTimeout(() => {
          setIsTransitioning(false);
          setIsVisible(true);
        }, 50);
      }, 300);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (currentPage !== pageNumber) {
      setIsVisible(false);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          setIsTransitioning(false);
          setIsVisible(true);
        }, 50);
      }, 300);
    }
  };

  const applyFilters = () => {
    const filteredJobs = jobs.filter((job) => {
      const jobDate = job.date_posted.toDate();
      const jobMonth = jobDate.toLocaleString("default", { month: "long" });

      return (
        (searchTerm === "" ||
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedJobType.length === 0 || selectedJobType.includes(job.job_type)) &&
        (selectedExperience.length === 0 || selectedExperience.includes(job.experience)) &&
        (selectedMonth === "" || jobMonth === selectedMonth)
      );
    });
    return filteredJobs;
  };

  const getDateFromJob = (job) => {
    return job.date_posted instanceof Date
      ? job.date_posted
      : new Date(job.date_posted.seconds * 1000);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy !== newSortBy) {
      setIsVisible(false);
      setTimeout(() => {
        setSortBy(newSortBy);
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 300);
    }
  };

  const sortJobs = (jobs) => {
    return [...jobs].sort((a, b) => {
      const dateA = getDateFromJob(a);
      const dateB = getDateFromJob(b);

      if (sortBy === "latest") {
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        return dateA - dateB;
      } else if (sortBy === "relevance") {
        // Simple relevance sorting based on search term matching job title
        if (searchTerm) {
          const titleMatchA = a.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
          const titleMatchB = b.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;

          if (titleMatchA !== titleMatchB) {
            return titleMatchB - titleMatchA;
          }

          // If title match is the same, sort by company match
          const companyMatchA = a.company.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
          const companyMatchB = b.company.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;

          if (companyMatchA !== companyMatchB) {
            return companyMatchB - companyMatchA;
          }
        }
        // Fall back to latest if no search term or equal matches
        return dateB - dateA;
      }

      return 0;
    });
  };

  const filteredJobs = sortJobs(applyFilters());

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleJobTypeChange = (type) => {
    setSelectedJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleExperienceChange = (level) => {
    setSelectedExperience((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handleApplyNow = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const JobStatusBadge = ({ type }) => {
    const bgColor =
      type === "Full-time" ? "bg-blue/10 text-blue" :
        type === "Part-time" ? "bg-yellow/10 text-yellow" :
          "bg-orange/10 text-orange";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {type}
      </span>
    );
  };

  const ExperienceBadge = ({ level }) => {
    const bgColor =
      level === "Beginner" ? "bg-darkblue/10 text-darkblue" :
        level === "Intermediate" ? "bg-orange/10 text-orange" :
          "bg-blue/10 text-blue";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {level}
      </span>
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedJobType([]);
    setSelectedExperience([]);
    setSelectedMonth("");
    setCurrentPage(1);
  };

  const PaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 mt-8 pagination-controls"> 
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-300 ${currentPage === 1
            ? 'text-gray-secondary cursor-not-allowed'
            : 'text-black-primary hover:text-blue hover:bg-blue/10'
            }`}
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`min-w-[2rem] h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${number === currentPage
                ? 'bg-blue text-white font-medium'
                : 'text-black-primary hover:bg-gray-100'
                }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-300 ${currentPage === totalPages
            ? 'text-gray-secondary cursor-not-allowed'
            : 'text-black-primary hover:text-blue hover:bg-blue/10'
            }`}
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  const ListViewJob = ({ job }) => (
    <div
      className={`bg-white rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-md border border-neutral-300 ${isTransitioning ? 'opacity-0 transform scale-95' :
        isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
        }`}
    >
      <div className="flex flex-col lg:flex-row items-start">
        <div className="flex items-center lg:w-2/3">
          <div className="bg-gray-100 p-3 rounded-xl">
            <img
              src={job.logo || placeholder}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
              alt={`${job.company} logo`}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="ml-5">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-blue font-semibold">{job.company}</h3>
            </div>
            <h2 className="text-xl font-bold text-black-primary">{job.job_title}</h2>

            <div className="flex flex-wrap items-center mt-3 space-x-4">
              <div className="flex items-center text-black-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{job.location}</span>
              </div>

              <div className="flex items-center text-black-secondary">
                <span className="text-sm">₱{job.salary_min.toLocaleString()} - ₱{job.salary_max.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.job_type && <JobStatusBadge type={job.job_type} />}
              {job.experience && <ExperienceBadge level={job.experience} />}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end justify-between lg:w-1/3 mt-6 lg:mt-0 w-full">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 w-full lg:w-auto apply-button ${
            appliedJobIds.includes(job.id)
              ? "bg-transparent text-green border border-green cursor-default"
              : job.isOpen
                ? "bg-blue text-white hover:bg-darkblue"
                : "bg-transparent border border-gray-600 text-gray-600 cursor-not-allowed"
            }`} 
          onClick={() => job.isOpen && !appliedJobIds.includes(job.id) && handleApplyNow(job.id)}
          disabled={!job.isOpen || appliedJobIds.includes(job.id)}
          title={
            appliedJobIds.includes(job.id)
              ? "Already applied to this job"
              : !job.isOpen
                ? "Not accepting applicants"
                : ""
          }
        >
        {appliedJobIds.includes(job.id)
          ? "Applied"
          : job.isOpen
            ? "Apply Now"
            : "Closed"}
      </button>

          <div className="mt-4 text-gray-secondary text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Posted:{" "}
            <span className="font-medium text-black-secondary ml-1">
              {job.date_posted instanceof Date
                ? job.date_posted.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : new Date(job.date_posted.seconds * 1000).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const GridViewJob = ({ job }) => (
    <div
      className={`bg-white rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-md border border-neutral-300 ${isTransitioning ? 'opacity-0 transform scale-95' :
        isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
        }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="bg-gray-100 p-3 rounded-xl">
            <img
              src={job.logo || placeholder}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
              alt={`${job.company} logo`}
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-blue font-semibold">{job.company}</h3>
          <h2 className="text-lg font-bold text-black-primary mt-1">{job.job_title}</h2>
        </div>

        <div className="flex flex-col mt-3 space-y-2">
          <div className="flex items-center text-black-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{job.location}</span>
          </div>

          <div className="flex items-center text-black-secondary px-1">
            <span className="text-sm">₱{job.salary_min.toLocaleString()} - ₱{job.salary_max.toLocaleString()}</span>
          </div>

          <div className="flex items-center text-gray-secondary text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Posted:{" "}
            <span className="font-medium text-black-secondary ml-1">
              {job.date_posted instanceof Date
                ? job.date_posted.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : new Date(job.date_posted.seconds * 1000).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {job.job_type && <JobStatusBadge type={job.job_type} />}
          {job.experience && <ExperienceBadge level={job.experience} />}
        </div>

        <button
        className={`mt-6 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 w-full apply-button ${job.isOpen
          ? "bg-blue text-white hover:bg-darkblue"
          : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`} // Added apply-button class
        onClick={() => job.isOpen && handleApplyNow(job.id)}
        disabled={!job.isOpen}
        title={!job.isOpen ? "Not accepting applicants" : ""}
      >
        {job.isOpen ? "Apply Now" : "Closed"}
      </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <PageLoader>
        <div className="relative bg-gradient-to-r from-blue to-darkblue text-white py-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold">
              Find Your Dream Job
            </h1>
            <p className="text-white/80 mt-3 max-w-2xl">
              Browse our curated list of positions and discover opportunities that match your skills and career goals.
            </p>

            <div className="mt-8 bg-white rounded-xl shadow-lg p-2 flex items-center">
              <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 bg-transparent text-black-primary focus:outline-none search-bar" // Added search-bar class
              />
              </div>
              <button
                onClick={toggleFilter}
                className="p-2 rounded-lg text-black-secondary hover:bg-gray-100 mr-2 border border-neutral-300 transition-all duration-300"
              >
                <IoFilterSharp className="font-bold text-lg filter-icon" /> {/* Added filter-icon class */}
              </button>
              <button className="bg-blue text-white px-6 text-sm py-2 rounded-lg font-medium hover:bg-darkblue transition-all duration-300">
                Search
              </button>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-full shadow-md py-2 px-5 flex items-center space-x-1">
              <span className="text-black-primary font-medium">{filteredJobs.length} jobs found</span>
            </div>
          </div>
        </div>

        {isFilterOpen && (
          <div className={`bg-white border border-neutral-300 rounded-xl p-6 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 mt-12 mb-6 transition-all duration-300 ease-in-out ${filterTransition
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4'
            }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-black-primary">Advanced Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-blue hover:text-darkblue text-sm font-medium transition-colors duration-300"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-base mb-3 text-black-secondary">Job Type</h3>
                <div className="flex flex-wrap gap-2">
                  {["Full-time", "Part-time", "Contract"].map((type, index) => (
                    <button
                      key={index}
                      onClick={() => handleJobTypeChange(type)}
                      className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${selectedJobType.includes(type)
                        ? "bg-blue text-white"
                        : "bg-gray-100 text-black-secondary hover:bg-gray-200"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-3 text-black-secondary">Experience Level</h3>
                <div className="flex flex-wrap gap-2">
                  {["Beginner", "Intermediate", "Expert"].map((level, index) => (
                    <button
                      key={index}
                      onClick={() => handleExperienceChange(level)}
                      className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${selectedExperience.includes(level)
                        ? "bg-orange text-white"
                        : "bg-gray-100 text-black-secondary hover:bg-gray-200"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-3 text-black-secondary">Posted Date</h3>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black-secondary bg-gray-50 transition-all duration-300"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Months</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="py-8 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
          <div className={`flex flex-col transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <div className="flex justify-between items-center text-black-secondary mb-6">
              <div className="font-medium">
                Showing <span className="font-bold text-blue">{currentJobs.length}</span> of{" "}
                <span className="font-bold text-blue">{filteredJobs.length}</span> jobs
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 view-controls">
                <button
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-blue/10 text-blue' : 'text-gray-secondary hover:bg-gray-100'}`}
                  onClick={() => handleViewModeChange('list')}
                  title="List view"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-blue/10 text-blue' : 'text-gray-secondary hover:bg-gray-100'}`}
                    onClick={() => handleViewModeChange('grid')}
                    title="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-base">Sort by:</span>
                  <select
                    className="bg-white border border-gray-200 text-sm text-black-secondary rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue transition-all duration-300 sort-dropdown"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="relevance">Relevance</option>
                  </select>
                </div>
              </div>
            </div>

            {currentJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-bold text-black-primary">No jobs found</h3>
                <p className="mt-2 text-black-secondary">
                  Try adjusting your search or filter criteria to find more opportunities.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 bg-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-darkblue transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}>
                {currentJobs.map((job) => (
                  viewMode === 'list' ? (
                    <ListViewJob key={job.id} job={job} />
                  ) : (
                    <GridViewJob key={job.id} job={job} />
                  )
                ))}
              </div>
            )}

            {filteredJobs.length > jobsPerPage && (
              <PaginationControls />
            )}
          </div>
        </div>
      </PageLoader>
      <TourGuideButton />
    </div>
  );
};

export default Joblist;