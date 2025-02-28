import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";
import HowItWorks from "../components/HowItWorks";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/companycolored.png";
import PageLoader from "../components/PageLoader";
import { MdDone } from "react-icons/md";


const Joblist = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobCollection = collection(db, "jobs");
        const snapshot = await getDocs(jobCollection);
        const fetchedJobs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs.");
      }
    };

    fetchJobs();
  }, []);

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

  const applyFilters = () => {
    const filteredJobs = jobs.filter((job) => {
      const jobDate = job.date_posted?.toDate();
      const jobMonth = jobDate?.toLocaleString("default", { month: "long" });

      return (
        (searchTerm === "" ||
          job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedJobType.length === 0 || selectedJobType.includes(job.job_type)) &&
        (selectedExperience.length === 0 || selectedExperience.includes(job.experience)) &&
        (selectedMonth === "" || jobMonth === selectedMonth)
      );
    });
    return filteredJobs;
  };

  const filteredJobs = applyFilters().sort((a, b) => {
    const dateA = a.date_posted instanceof Date ? a.date_posted : new Date(a.date_posted?.seconds * 1000);
    const dateB = b.date_posted instanceof Date ? b.date_posted : new Date(b.date_posted?.seconds * 1000);
    return dateB - dateA;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const isJobApplied = (jobId) => {
    return appliedJobIds.includes(jobId);
  };

  const PaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue/10'
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
              onClick={() => paginate(number)}
              className={`min-w-[2rem] h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                number === currentPage
                  ? 'bg-blue text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue/10'
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

  return (
    <div>
      <PageLoader>
        <HowItWorks />

        <div className="text-center p-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 rounded-lg bg-cover bg-center bg-no-repeat bg-gray-100 border">
          <div className="mx-auto p-4">
            <h1 className="text-darkblue font-extrabold text-xl">
              Available Jobs for You
            </h1>
            <p className="text-gray-600 text-base pt-2">
              Browse our available positions and find the perfect job to match your skills and interests.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row py-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48">
          {/* Filter Component */}
          <div className="lg:w-1/4 w-full p-4 bg-gray-100 rounded-lg mb-6 lg:mb-0 h-full border">
            <h2 className="font-bold text-lg mb-4">Search Filter</h2>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by job title or company"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <h2 className="font-semibold text-base mb-2">Job Type</h2>
              <div className="flex flex-col space-y-2">
                {["Full-time", "Part-time", "Contract"].map((type, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedJobType.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-semibold text-base mb-2">Experience Level</h2>
              <div className="flex flex-wrap gap-2">
                {["Beginner", "Intermediate", "Expert"].map((level, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
                      selectedExperience.includes(level) ? "bg-orange text-white" : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleExperienceChange(level)}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-semibold text-base mb-2">Month</h2>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Job Listings */}
          <div className="w-full lg:w-3/4 lg:pl-6 pl-0">
            <div className="flex justify-between items-center text-gray-700 mb-4">
              <div>
                Showing <span className="font-bold">{currentJobs.length}</span> of{" "}
                <span className="font-bold">{filteredJobs.length}</span> jobs
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-base">Sort:</span>
                <select
                  className="bg-gray-100 border border-gray-300 text-sm text-gray-700 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  defaultValue="Latest"
                >
                  <option value="Latest">Latest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Relevance">Relevance</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
              </div>
            ) : (
              currentJobs.map((job) => {
                const applied = isJobApplied(job.id);
                
                return (
                  <div
                    key={job.id}
                    className="flex flex-col lg:flex-row justify-between border items-start lg:items-center p-6 bg-white shadow-sm rounded-lg mb-4 transition-transform transform hover:-translate-y-1 hover:scale-10 hover:shadow-md duration-300 ease-out"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-2/3">
                      <div className="flex items-center space-x-4">
                        <img
                          src={job.logo || placeholder}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholder;
                          }}
                          alt={`${job.company} logo`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                        <div className="flex items-center">
                          <h3 className="text-blue font-semibold">{job.company}</h3>
                        </div>
                        <div className="flex items-center">
                          <h2 className="text-xl font-bold">{job.job_title}</h2>
                          {!job.isOpen && (
                            <span className="ml-2 px-4 py-0.5 text-sm rounded-full text-red font-medium">
                             Closed
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">{job.location}</p>
                        <p className="text-gray-500 text-sm">
                          <strong>Salary:</strong> ₱{job.salary_min} - ₱{job.salary_max}
                        </p>
                      </div>
                      </div>
                      </div>

                      <div className="flex flex-col items-end mt-4 lg:mt-0 w-full lg:w-1/3">
                      <button
                          className={`px-4 py-2 rounded-lg ${
                            applied 
                              ? "bg-transparent text-green cursor-not-allowed"
                              : !job.isOpen
                                ? "bg-blue text-white cursor-not-allowed"
                                : "bg-blue text-white hover:bg-darkblue transition-all"
                          }`} 
                          onClick={() => !applied && job.isOpen && handleApplyNow(job.id)} 
                          disabled={!job.isOpen || applied} 
                          title={
                            applied 
                              ? "You have already applied to this job" 
                              : !job.isOpen 
                                ? "Not accepting applicants" 
                                : "Apply Now"
                          }
                        > 
                          {applied ? (
                            <span className="flex items-center justify-center">
                              Applied <MdDone className="ml-1 w-4 h-4" />
                            </span>
                          ) : "Apply Now"}
                        </button>
                      <div className="mt-2 text-gray-500 text-sm">
                        Date Posted:{" "}
                        <span className="font-medium text-gray-700">
                          {job.date_posted instanceof Date
                            ? job.date_posted.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : new Date(job.date_posted?.seconds * 1000).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {!isLoading && currentJobs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No jobs match your current filters.</p>
              </div>
            )}

            {!isLoading && currentJobs.length > 0 && <PaginationControls />}
          </div>
        </div>
      </PageLoader>
    </div>
  );
};

export default Joblist;