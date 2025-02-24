import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import placeholder from "../assets/companycolored.png";
import PageLoader from "../components/PageLoader";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: ""
  });

  const CLOUD_NAME = "drg1csmnn";
  const UPLOAD_PRESET = "ybbfcbyk";

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
        } else {
          toast.error("No such job found!");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details.");
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoadingProfile(false);
        return;
      }

      try {
        const profileRef = doc(db, "profiles", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          const isComplete = profileData.name && profileData.address && profileData.contactNumber;
          setIsProfileComplete(isComplete);
          
          setApplicationForm({
            name: profileData.name || "",
            email: profileData.email || currentUser.email || "",
            contactNumber: profileData.contactNumber || "",
            address: profileData.address || ""
          });
        } else {
          setIsProfileComplete(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsProfileComplete(false);
      }

      setLoadingProfile(false);
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a PDF file");
      e.target.value = null;
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
    
    if (!selectedFile) {
      toast.error("Please select a resume to upload");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You need to be logged in to apply.");
      return;
    }

    setUploading(true);
    
    try {
      const resumeUrl = await uploadToCloudinary(selectedFile);
      
      await addDoc(collection(db, "applications"), {
        job_id: jobId,
        job_title: job.job_title,
        company: job.company,
        resume_link: resumeUrl,
        applicant_id: currentUser.uid,
        applicant_name: applicationForm.name,
        applicant_email: applicationForm.email,
        applicant_contact: applicationForm.contactNumber,
        applicant_address: applicationForm.address,
        timestamp: new Date(),
        status: "pending"
      });

      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!job) return <p className="text-center text-gray-500">Loading job details...</p>;

  return (
    <PageLoader>
      <div className="relative">
        <div className="mx-auto py-16 px-8 lg:px-48 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <button
                onClick={() => navigate(-1)}
                className="-ml-2 bg-white hover:text-blue transition duration-300 flex items-center group"
                title="Back to Job List"
              >
                <div className="flex items-center group-hover:text-blue">
                  <IoIosArrowBack className="text-lg text-gray-700 group-hover:text-blue" />
                  <span className="text-sm">Back to Job List</span>
                </div>
              </button>
            </div>
            <div className="flex items-center mb-4 space-x-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-darkblue break-words">
                {job.job_title}
              </h1>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Skills Required:</strong> {job.skills || "Not specified"}
              </p>
              <div className="border-t border-gray-300 pt-4">
                <p className="whitespace-pre-line">
                  <strong>Job Description:</strong>{" "}
                  {job.job_description.trim() || "No description available."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 border rounded-lg p-6 flex flex-col space-y-6 min-h-auto self-start">
            <div className="flex flex-col items-center space-y-4 mb-4">
              <img
                src={job.logo || placeholder}
                alt={`${job.company} logo`}
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <h2 className="text-xl font-bold text-darkblue">{job.company}</h2>
            </div>

            <div className="space-y-4 border-t border-gray-300 pt-4">
              <p className="text-gray-700">
                <strong>Experience Level:</strong> {job.experience}
              </p>
              <p className="text-gray-700">
                <strong>Job Type:</strong> {job.job_type}
              </p>
              <p className="text-gray-600">
                <strong>Category:</strong> {job.job_category}
              </p>
            </div>

            <div className="space-y-4 border-t border-gray-300 pt-4">
              <p className="text-gray-600">
                <strong>Date Posted:</strong>{" "}
                {new Date(job.date_posted.seconds * 1000).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-600">
                <strong>Salary:</strong> ₱{job.salary_min} - ₱{job.salary_max}
              </p>
            </div>

            <div className="mt-6 w-full">
              {loadingProfile ? (
                <p className="text-center text-gray-500">Checking profile...</p>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`px-4 py-3 rounded-lg w-full transition duration-300 shadow-md ${
                    isProfileComplete
                      ? "bg-gradient-to-r from-blue to-darkblue text-white hover:opacity-90"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!isProfileComplete}
                >
                  Apply Now
                </button>
              )}
              {!auth.currentUser ? (
                <p className="text-black text-sm text-center mt-2">
                  Log in first to create an account.{" "}
                  <strong>
                    <span
                      className="text-blue font-bold cursor-pointer underline"
                      onClick={() => navigate("/login")}
                    >
                      LOG IN
                    </span>
                  </strong>
                </p>
              ) : !isProfileComplete && (
                <p className="text-black text-sm text-center mt-2">
                  Please complete your{" "}
                  <strong>
                    <span
                      className="text-blue font-bold cursor-pointer underline"
                      onClick={() => navigate("/profile")}
                    >
                      PROFILE
                    </span>
                  </strong>{" "}
                  to apply.
                </p>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
    <div className="bg-white w-full max-w-xl rounded-xl overflow-hidden shadow-lg">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue to-darkblue px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-start">
          <div className="pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Job Application</h2>
            <p className="text-white/90 text-sm sm:text-lg font-semibold line-clamp-1">{job?.job_title}</p>
            <p className="text-white/75 text-xs sm:text-sm line-clamp-1">{job?.company}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-200 flex-shrink-0"
          >
            <IoClose size={18} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Personal Details Section */}
          <div className="bg-gray p-3 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Personal Details</h3>
            <div className="grid gap-3 sm:gap-4">
              {["name", "email", "contactNumber", "address"].map((field) => (
                <div key={field}>
                  <label className="text-gray-700 text-sm sm:text-base font-medium mb-1 block capitalize">
                    {field.replace("Number", " Number")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={applicationForm[field] || ""}
                    className="w-full h-9 sm:h-10 px-3 rounded-lg border border-gray-200 text-gray-800 text-sm sm:text-base focus:border-blue focus:ring-0 disabled:bg-gray-50/50"
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Resume Upload</h3>
              <span className="text-xs text-red bg-gray-100 px-2 py-1 rounded-full">PDF files only</span>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-blue transition-colors">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <div className="space-y-2 sm:space-y-3">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    {selectedFile ? selectedFile.name : "Drop your resume here"}
                  </p>
                  <p className="text-xs text-gray-500">{selectedFile ? "Click to change file" : "or click to browse"}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className={`w-full py-2.5 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium transition-all duration-200 
              ${uploading || !selectedFile
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue to-darkblue hover:opacity-90'
              }
            `}
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <FaSpinner className="animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
        )}
      </div>
    </PageLoader>
  );
};

export default JobDetails;