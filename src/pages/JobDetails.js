import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; // Added import
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoBriefcase, IoLocationSharp, IoCalendar } from "react-icons/io5";
import { FaMoneyBillWave, FaClock, FaFileUpload } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import placeholder from "../assets/companycolored.webp";
import PageLoader from "../components/PageLoader";

const CLOUD_NAME = "drg1csmnn";
const UPLOAD_PRESET = "ybbfcbyk";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [previousResumes, setPreviousResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedExistingResume, setSelectedExistingResume] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Added state for tracking current user
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: ""
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null); 
    setSelectedExistingResume(null);
    setIsDragging(false);
  };

  const getFieldDisplayName = (fieldName) => {
    const displayNames = {
      'name': 'Full Name',
      'email': 'Email Address',
      'contactNumber': 'Contact Number',
      'address': 'Address'
    };
    return displayNames[fieldName] || fieldName;
  };

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError("Job ID is missing");
        setLoading(false);
        return;
      }

      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
          setTimeout(() => setIsVisible(true), 100); 
        } else {
          setError("Job not found");
          toast.error("No such job found!");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details");
        toast.error("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data only when we have a confirmed user
        fetchUserData(user);
      } else {
        setLoadingProfile(false);
        setLoadingResumes(false);
        setProfileChecked(true);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Define the fetchUserData function outside of the useEffect
  const fetchUserData = async (user) => {
    try {
      // Fetch profile data
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        
        // Check for all required fields
        const requiredFields = ['address', 'contactNumber', 'email', 'name'];
        
        // Filter out fields that actually exist and have values
        const missing = requiredFields.filter(field => 
          !profileData[field] || profileData[field] === ""
        );
        
        setMissingFields(missing);
        setIsProfileComplete(missing.length === 0);
        
        setApplicationForm({
          name: profileData.name || "",
          email: profileData.email || user.email || "",
          contactNumber: profileData.contactNumber || "",
          address: profileData.address || ""
        });
      } else {
        setIsProfileComplete(false);
        setMissingFields(['address', 'contactNumber', 'email', 'name']);
      }

      // Fetch previous resumes from applications
      setLoadingResumes(true);
      const applicationsQuery = query(
        collection(db, "applications"), 
        where("applicant_id", "==", user.uid)
      );
      
      const applicationsSnap = await getDocs(applicationsQuery);
      
      const uniqueResumes = new Map();
      applicationsSnap.forEach(doc => {
        const data = doc.data();
        if (data.resume_link && !uniqueResumes.has(data.resume_link)) {
          uniqueResumes.set(data.resume_link, {
            url: data.resume_link,
            timestamp: data.timestamp,
            job_title: data.job_title || "Previous application"
          });
        }
      });
      
      // Sort by most recent first
      const sortedResumes = Array.from(uniqueResumes.values())
        .sort((a, b) => b.timestamp - a.timestamp);
      
      setPreviousResumes(sortedResumes);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user information");
      setIsProfileComplete(false);
    } finally {
      setLoadingProfile(false);
      setLoadingResumes(false);
      setProfileChecked(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setSelectedExistingResume(null); // Clear any selected existing resume
    } else {
      toast.error("Please upload a PDF file");
      e.target.value = null;
    }
  };

  const handleDrag = (e, isDragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setSelectedExistingResume(null); // Clear any selected existing resume
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const toggleExistingResume = (resumeUrl) => {
    if (selectedExistingResume === resumeUrl) {
      setSelectedExistingResume(null);
    } else {
      // If not selected or different resume selected, select this one
      setSelectedExistingResume(resumeUrl);
      setSelectedFile(null); // Clear any new file selection
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "resumes");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("Failed to upload resume");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedFile && !selectedExistingResume) {
      toast.error("Please select or upload a resume");
      return;
    }
  
    if (!currentUser) {  // Changed from auth.currentUser to currentUser
      toast.error("You need to be logged in to apply.");
      navigate("/login");
      return;
    }
  
    setUploading(true);
  
    try {
      // Use existing resume URL or upload new file
      const resumeUrl = selectedExistingResume || await uploadToCloudinary(selectedFile);
      const timestamp = new Date(); 
  
      await addDoc(collection(db, "applications"), {
        job_id: jobId,
        job_title: job.job_title,
        company: job.company,
        resume_link: resumeUrl,
        applicant_id: currentUser.uid,  // Changed from auth.currentUser.uid
        applicant_name: applicationForm.name,
        applicant_email: applicationForm.email,
        applicant_contact: applicationForm.contactNumber,
        applicant_address: applicationForm.address,
        timestamp: timestamp, 
      });
  
      if (selectedExistingResume) {
        setPreviousResumes(prevResumes => {
          const updatedResumes = prevResumes.map(resume => {
            if (resume.url === selectedExistingResume) {
              return {
                ...resume,
                timestamp: timestamp,
                job_title: job.job_title
              };
            }
            return resume;
          });
          
          return updatedResumes.sort((a, b) => b.timestamp - a.timestamp);
        });
      }
  
      toast.success("Application submitted successfully!");
      handleCloseModal();
      
      setTimeout(() => {
        navigate("/job-listing");
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(timestamp.seconds * 1000);
      
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="text-red text-5xl mb-4">⚠️</div>
            <p className="text-red text-xl mb-4 font-semibold">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="text-blue bg-blue/10 hover:bg-blue/20 px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              Go Back to Job Listings
            </button>
          </div>
        </div>
      );
    }

    if (!job) {
      return null; 
    }

    return (
      <div className={`min-h-screen transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Navigation Bar */}
        <div className="bg-white">
          <div className="container mx-auto px-4 md:px-8 pt-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-blue transition duration-300 group font-medium"
              title="Back to Job List"
            >
              <IoIosArrowBack className="text-lg mr-1 group-hover:text-blue" />
              <span>Back to Job Listings</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Responsive Job Header */}
              <div className="bg-white rounded-xl border border-neutral-300 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start">
                  <img
                    src={job.logo || placeholder}
                    alt={`${job.company} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md mb-4 sm:mb-0 sm:mr-6"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-black-primary ">{job.job_title}</h1>
                        <h2 className="text-lg font-semibold text-darkblue mb-1">{job.company}</h2>
                        <div className="flex items-center text-black-secondary">
                          <IoLocationSharp className="mr-1" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 items-start md:items-end mt-4 md:mt-0">
                        <div className="flex items-center text-black-secondary text-sm md:text-base">
                          <IoCalendar className="mr-1 text-lg" />
                          <span>
                            Posted:{" "}
                            {formatDate(job.date_posted)}
                          </span>
                        </div>
                        <div className="flex items-center text-darkblue font-semibold text-sm md:text-lg">
                          <FaMoneyBillWave className="mr-1 text-lg" />
                          <span>
                            ₱{job.salary_min.toLocaleString()} - ₱{job.salary_max.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue/10 text-blue px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                            {job.job_type}
                          </span>
                          <span className="bg-blue/10 text-blue px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                            {job.experience}
                          </span>
                          <span className="bg-blue/10 text-blue px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                            {job.job_category}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl border border-neutral-300 p-8">
                <h3 className="text-xl font-bold text-black-primary mb-6 flex items-center">
                  <IoBriefcase className="mr-2 text-blue" />Job Description
                </h3>

                <div className="prose max-w-none text-black-secondary">
                  <p className="whitespace-pre-line">
                    {job.job_description?.trim() || "No description available."}
                  </p>
                </div>
              </div>

              {/* Skills Required */}
              <div className="bg-white rounded-xl border border-neutral-300 p-8">
                <h3 className="text-xl font-bold text-black-primary mb-6 flex items-center">
                  <FaClock className="mr-2 text-blue" />
                  Required Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {job.skills ? (
                    job.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-black-secondary px-4 py-2 rounded-lg text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-secondary italic">No specific skills mentioned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Apply Now */}
            <div className="lg:col-span-1 space-y-6">
              {/* Apply Now Card */}
              <div className="bg-white rounded-xl border border-neutral-300 overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-blue to-darkblue p-6">
                  <h3 className="text-xl font-bold text-white">Apply Now</h3>
                  <p className="text-white/80 text-sm mt-1">Take the next step in your career</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-secondary">Job Type</span>
                      <span className="font-medium text-black-primary">{job.job_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-secondary">Experience</span>
                      <span className="font-medium text-black-primary">{job.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-secondary">Category</span>
                      <span className="font-medium text-black-primary">{job.job_category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-secondary">Salary Range</span>
                      <span className="font-medium text-darkblue">₱{job.salary_min.toLocaleString()} - ₱{job.salary_max.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {(loadingProfile || !profileChecked) ? (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <button
                        onClick={() => auth.currentUser && setIsModalOpen(true)}
                        disabled={!auth.currentUser}
                        className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition duration-300 shadow-md text-white ${
                          auth.currentUser
                          ? "bg-gradient-to-r from-blue to-darkblue hover:shadow-lg"
                          : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <span>Submit Application</span>
                      </button>
                    )}

                    {!auth.currentUser ? (
                      <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 mt-4">
                        <p className="text-sm text-center text-orange">
                          You need to be logged in to apply.{" "}
                          <button
                            className="text-blue font-semibold hover:underline"
                            onClick={() => navigate("/login")}
                          >
                            Log In Now
                          </button>
                        </p>
                      </div>
                    ) : !isProfileComplete && missingFields.length > 0 && (
                      <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 mt-4">
                        <p className="text-sm text-center text-orange">
                          Please complete your profile before applying. Missing: {" "}
                          <span className="font-semibold">
                          {missingFields.map(field => getFieldDisplayName(field)).join(', ')}
                          </span>
                          .{" "}
                          <button
                            className="text-blue font-semibold hover:underline"
                            onClick={() => navigate("/profile")}
                          >
                            Update profile
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-xl rounded-xl overflow-hidden shadow-2xl transition-opacity duration-300 opacity-100 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue to-darkblue px-6 py-4">
                <div className="flex justify-between items-start">
                  <div className="pr-8">
                    <h2 className="text-xl font-bold text-white mb-1">Job Application</h2>
                    <p className="text-white/90 text-base font-semibold line-clamp-1">{job?.job_title}</p>
                    <p className="text-white/75 text-xs line-clamp-1">{job?.company}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <IoClose size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  {/* Personal Details */}
                  <div>
                    <h3 className="font-bold text-black-primary mb-2 flex items-center text-sm">
                      <BsCheckCircleFill className="text-green mr-2" />
                      Personal Details
                    </h3>
                    <div className="rounded-lg p-3 border border-neutral-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["name", "email"].map((field) => (
                          <div key={field} className="flex flex-col">
                            <label className="text-gray-secondary text-xs uppercase tracking-wide mb-1">
                              {field}
                            </label>
                            <p className="text-black-primary bg-white px-3 py-2 rounded-md text-sm border border-neutral-300 truncate">
                              {applicationForm[field]}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="text-xs text-blue hover:text-darkblue font-medium"
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Previous Resumes Section */}
                  {previousResumes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-black-primary mb-2 flex items-center text-sm">
                        <BsCheckCircleFill className="text-green mr-2" />
                        Previous Resumes
                      </h3>
                      <div className="rounded-lg border border-neutral-300 divide-y max-h-32 overflow-y-auto">
                        {loadingResumes ? (
                          <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          previousResumes.slice(0, 3).map((resume, index) => (
                            <div 
                              key={index}
                              className={`p-3 cursor-pointer transition-colors ${
                                selectedExistingResume === resume.url 
                                  ? 'bg-blue/5 border-l-4 border-l-blue' 
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => toggleExistingResume(resume.url)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`p-1 rounded-full ${
                                    selectedExistingResume === resume.url 
                                      ? 'bg-blue/10 text-blue' 
                                      : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    <FaFileUpload size={14} />
                                  </div>
                                  <div className="max-w-[150px] sm:max-w-[200px]">
                                    <p className="text-xs font-medium text-black-primary truncate">Resume for {resume.job_title}</p>
                                    <p className="text-xs text-gray-secondary">{formatDate(resume.timestamp)}</p>
                                  </div>
                                </div>
                                {selectedExistingResume === resume.url && (
                                  <BsCheckCircleFill className="text-blue" size={16} />
                                )}
                              </div>
                            </div>
                          ))
                        )}

                        <div className="p-2 text-center">
                          <p className="text-xs text-gray-secondary">
                            {selectedExistingResume 
                              ? "Resume selected. You can upload a new one instead."
                              : "Select a previous resume or upload a new one."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resume Upload Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-black-primary flex items-center text-sm">
                        <FaFileUpload className="text-blue mr-2" />
                        {previousResumes.length > 0 ? "Upload New Resume" : "Resume Upload"}
                      </h3>
                      <span className="text-xs bg-red/10 text-red px-2 py-0.5 rounded-full font-medium">
                        PDF only
                      </span>
                    </div>
                    <div
                      className={`border-2 border-dashed rounded-xl transition-colors p-3 ${
                        isDragging
                        ? "border-blue bg-blue/5"
                        : selectedFile
                          ? "border-green bg-green/10"
                          : selectedExistingResume
                            ? "border-gray-200"
                            : "border-gray-200 hover:border-blue"
                      }`}
                      onDragOver={(e) => handleDrag(e, true)}
                      onDragLeave={(e) => handleDrag(e, false)}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className={`block ${selectedExistingResume ? "opacity-50" : "cursor-pointer"}`}
                      >
                        <div className="space-y-1 text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                            selectedFile ? "bg-green/10" : "bg-gray-100"
                          }`}>
                            {selectedFile ? (
                              <BsCheckCircleFill className="w-4 h-4 text-green" />
                            ) : (
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-xs">
                              {selectedFile ? (
                                <span className="text-green">
                                  New resume selected
                                </span>
                              ) : (
                                <span className="text-black-primary">
                                  {selectedExistingResume 
                                    ? "Using existing resume" 
                                    : "Upload your resume"}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-secondary">
                              {selectedFile ? (
                                <span className="truncate block max-w-full">"{selectedFile.name}" <span className="underline">Change</span></span>
                              ) : (
                                selectedExistingResume 
                                  ? "Click to upload a new resume instead" 
                                  : "Drag & drop or click to browse"
                              )}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={uploading || (!selectedFile && !selectedExistingResume)}
                    className={`w-full py-2 rounded-xl text-white font-medium transition-all duration-200 text-sm
                    ${uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : (!selectedFile && !selectedExistingResume)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue to-darkblue hover:opacity-90 hover:shadow-lg"
                      }
                  `}
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : ( "Submit Application"
                    )}
                  </button>

                  {(!selectedFile && !selectedExistingResume) && (
                    <p className="text-xs text-center text-gray-secondary">
                      Please select a resume to continue
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLoader isLoading={loading}>
      {renderContent()}
    </PageLoader>
  );
};

export default JobDetails;