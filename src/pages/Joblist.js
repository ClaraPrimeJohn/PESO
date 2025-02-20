import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import HowItWorks from "../components/HowItWorks";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/companycolored.png";

const Joblist = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState([]);
  const [filterTags, setFilterTags] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [, setUser] = useState(null);
  const navigate = useNavigate();

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

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const applyFilters = () => {
    const filteredJobs = jobs.filter((job) => {
      const jobDate = job.date_posted.toDate();
      const jobMonth = jobDate.toLocaleString("default", { month: "long" });

      return (
        (searchTerm === "" ||
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedJobType.length === 0 || selectedJobType.includes(job.job_type)) &&
        (filterTags.length === 0 || filterTags.every((tag) => job.skills?.includes(tag))) &&
        (selectedMonth === "" || jobMonth === selectedMonth)
      );
    });
    return filteredJobs;
  };

  const filteredJobs = applyFilters().sort((a, b) => {
    // Sort jobs by the `date_posted` field in descending order
    const dateA = a.date_posted instanceof Date ? a.date_posted : new Date(a.date_posted.seconds * 1000);
    const dateB = b.date_posted instanceof Date ? b.date_posted : new Date(b.date_posted.seconds * 1000);
    return dateB - dateA; // Sort in descending order
  });

  const handleJobTypeChange = (type) => {
    setSelectedJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApplyNow = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div>
      <HowItWorks />

      <div className="text-center p-4 mx-32 rounded-lg bg-cover bg-center bg-no-repeat bg-gray-100 border">
        <div className="mx-auto p-4">
          <h1 className="text-darkblue font-extrabold text-xl">
            Available Jobs for You
          </h1>
          <p className="text-gray-600 text-base pt-2">
            Browse our available positions and find the perfect job to match your skills and interests.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row py-10 lg:px-32 px-6">
        {/* Filter Component */}
        <div className="lg:w-1/4 w-full p-4 bg-gray-100 rounded-lg mb-6 lg:mb-0 h-full border">
          <h2 className="font-bold text-lg mb-4">Search Filter</h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by job title or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">Job Type</h2>
            <div className="flex flex-col space-y-2">
              {["Full-time", "Part-time", "Contract", "Internship"].map((type, index) => (
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
            <h2 className="font-semibold text-base mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {["YUMMY", "Creative", "Technical"].map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full ${filterTags.includes(tag) ? "bg-orange text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  onClick={() =>
                    setFilterTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                    )
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">Month</h2>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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
        <div className="lg:w-3/4 w-full pl-6">
          <div className="flex justify-between items-center text-gray-700 mb-4">
            <div>
              Showing <span className="font-bold">{filteredJobs.length}</span> jobs
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

          {filteredJobs.map((job) => (
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
                      e.target.src = placeholder; // Automatic fallback
                    }}
                    alt={`${job.company} logo`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-blue font-semibold">{job.company}</h3>
                    <h2 className="text-xl font-bold">{job.job_title}</h2>
                    <p className="text-gray-500">{job.location}</p>
                    <p className="text-gray-500 text-sm">
                      <strong>Salary:</strong> ₱{job.salary_min} - ₱{job.salary_max}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end mt-4 lg:mt-0 w-full lg:w-1/3">
                <button
                  className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-darkblue"
                  onClick={() => handleApplyNow(job.id)}
                >
                  Apply Now
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
                      : new Date(job.date_posted.seconds * 1000).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Joblist;