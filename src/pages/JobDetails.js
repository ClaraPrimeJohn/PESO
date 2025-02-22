import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
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
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

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
    setResume(e.target.files[0]);
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
      const resumeUrl = response.data.secure_url;
      toast.success("Resume uploaded successfully!");
      return resumeUrl;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast.error("Failed to upload resume.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please upload your resume before submitting.");
      return;
    }
  
    setUploading(true);
  
    const resumeUrl = await uploadToCloudinary(resume);
    if (!resumeUrl) {
      setUploading(false);
      return;
    }
  
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You need to be logged in to apply.");
      setUploading(false);
      return;
    }
  
    // Fetch the user's profile from Firestore
    let profileData = {};
    try {
      const profileRef = doc(db, "profiles", currentUser.uid);
      const profileSnap = await getDoc(profileRef);
  
      if (profileSnap.exists()) {
        profileData = profileSnap.data();
      } else {
        toast.error("Profile not found. Please complete your profile first.");
        setUploading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile. Try again.");
      setUploading(false);
      return;
    }
  
    try {
      await addDoc(collection(db, "applications"), {
        job_id: jobId,
        job_title: job.job_title,
        company: job.company,
        resume_link: resumeUrl,
        applicant_id: currentUser.uid,
        applicant_name: profileData.name || "N/A",
        applicant_address: profileData.address || "N/A",
        applicant_contact: profileData.contactNumber || "N/A",
        applicant_email: profileData.email || "N/A",
        timestamp: new Date(),
      });
  
      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Failed to submit application. Try again.");
    }
  
    setUploading(false);
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
          <div className="flex items-center space-x-1 group-hover:text-blue">
            <IoIosArrowBack className="text-3xl text-gray-700 group-hover:text-blue" />
            <span className="text-lg">Back to Job List</span>
          </div>
        </button>
      </div>
      <div className="flex items-center mb-4 space-x-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-darkblue break-words">
          {job.job_title}
        </h1>
      </div>
    
          <div className="space-y-4 text-gray-700 pl-0 md:pl-12">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Skills Required:</strong> {job.skills || "Not specified"}
              </p>
              <div className="border-t border-gray-300 pt-4">
                <p className="whitespace-pre-line">
                  <strong>Job Description:</strong> {job.job_description.trim() || "No description available."}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-3xl font-semibold p-2 mb-4 text-center text-darkblue">Apply for {job.job_title}</h2>
            <p className="text-sm p-4 text-orange text-center mb-4">
              Please upload your resume and standby on the announcement page for interview schedules.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-gray-700 font-medium">
                Upload Resume (PDF only):
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border p-2 rounded-md"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full bg-darkblue text-white py-2 rounded-md"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </PageLoader>
  );
};

export default JobDetails;