import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";
import { FaCamera, FaSpinner, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPencilAlt, FaSave, FaTimes, FaExclamationCircle } from "react-icons/fa";

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        address: "",
        contactNumber: "",
        profileImage: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [originalProfile, setOriginalProfile] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                const profileRef = doc(db, "profiles", currentUser.uid);
                const profileSnap = await getDoc(profileRef);

                if (!profileSnap.exists()) {
                    setIsNewUser(true);
                    const newProfile = {
                        name: "",
                        email: currentUser.email || "",
                        profileImage: "",
                        address: "",
                        contactNumber: ""
                    };

                    try {
                        await setDoc(profileRef, newProfile);
                        setProfile(newProfile);
                        setOriginalProfile(newProfile);
                        setIsEditing(true);
                        toast.success("Please complete your profile information.");
                    } catch (error) {
                        console.error("Error initializing profile:", error);
                        toast.error("Failed to initialize profile.");
                    }
                } else {
                    setIsNewUser(false);
                    await fetchProfileData(currentUser.uid);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchProfileData = async (uid) => {
        try {
            const profileRef = doc(db, "profiles", uid);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                const data = profileSnap.data();
                setProfile(data);
                setOriginalProfile(data);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Failed to fetch profile data.");
        }
    };

    useEffect(() => {
        if (originalProfile) {
            const hasChanges = Object.keys(profile).some(
                (key) => key !== "email" && originalProfile[key] !== profile[key]
            ) || selectedFile !== null;
            setIsDirty(hasChanges);
        }
    }, [profile, originalProfile, selectedFile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    // Generate a simple hash from a string
    const generateSimpleHash = async (str) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Generate a hash from file content
    const getFileHash = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const hash = await generateSimpleHash(e.target.result);
                    resolve(hash);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);  // Read as data URL to get content
        });
    };

    const uploadImageToCloudinary = async (file) => {
        try {
            // Generate hash from file content
            const contentHash = await getFileHash(file);
            
            // Create a unique identifier including user ID and content hash
            const uniqueId = `${user.uid}_${contentHash}`;
            
            // Check if this is the same as the current image
            if (profile.profileImage && profile.profileImage.includes(contentHash)) {
                // Same image already uploaded, return the existing URL
                return profile.profileImage;
            }
            
            // Create formData for Cloudinary upload
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", "profiles");
            formData.append("public_id", uniqueId);  // Use our unique ID for the file
            
            // Upload to Cloudinary
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            
            const data = await res.json();
            
            if (!data.secure_url) {
                throw new Error("Image upload failed");
            }
            
            return data.secure_url;
        } catch (error) {
            console.error("Error in image upload:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isDirty) {
            toast.info("No changes to save.");
            setIsEditing(false);
            return;
        }

        // Check if the user has a profile image or has selected a new one
        const hasImage = profile.profileImage || selectedFile;
        if (!hasImage) {
            toast.error("Please upload a profile image before saving changes.");
            return;
        }

        try {
            if (!user) return;
            setLoading(true);

            let updatedProfile = {
                name: profile.name,
                address: profile.address,
                contactNumber: profile.contactNumber,
                profileImage: profile.profileImage
            };

            if (selectedFile) {
                setUploadingImage(true);
                try {
                    // Before uploading, check if it's a duplicate by content
                    const isDuplicate = await checkIfImageIsDuplicate(selectedFile);
                    
                    if (isDuplicate) {
                        toast.error(`This appears to be a duplicate image. Please choose a different image.`);
                        setLoading(false);
                        setUploadingImage(false);
                        return;
                    }
                    
                    const imageUrl = await uploadImageToCloudinary(selectedFile);
                    updatedProfile.profileImage = imageUrl;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Failed to upload image.");
                    setLoading(false);
                    setUploadingImage(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const profileRef = doc(db, "profiles", user.uid);
            await updateDoc(profileRef, updatedProfile);

            if (profile.name && profile.name !== originalProfile.name) {
                await updateProfile(auth.currentUser, {
                    displayName: profile.name
                });
            }

            await fetchProfileData(user.uid);

            setSelectedFile(null);
            setPreviewImage(null);
            setIsDirty(false);
            setIsEditing(false);
            setIsNewUser(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    // Check if the image is a duplicate based on content
    const checkIfImageIsDuplicate = async (file) => {
        try {
            // Get hash of file being uploaded
            const newFileHash = await getFileHash(file);
            
            // Extract content hash from the current profile image if it exists
            if (profile.profileImage) {
                // Extract hash from the image URL if the URL contains our hash format
                const urlParts = profile.profileImage.split('/');
                const filenamePart = urlParts[urlParts.length - 1];
                
                // If the filename includes our hash pattern, compare hashes
                if (filenamePart.includes(user.uid)) {
                    const existingHash = filenamePart.split('_')[1]?.split('.')[0];
                    if (existingHash === newFileHash) {
                        return true; // Same content, it's a duplicate
                    }
                }
            }
            
            return false; // Not a duplicate
        } catch (error) {
            console.error("Error checking for duplicate image:", error);
            return false; // In case of error, allow upload
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
            return;
        }

        // Validate file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image is too large. Please select an image under 5MB");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setPreviewImage(null);
        setSelectedFile(null);
        setIsEditing(false);
        setIsDirty(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Check if profile has an image (either existing or new one selected)
    const hasProfileImage = Boolean(profile.profileImage || selectedFile);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-8 h-8 animate-spin text-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {isNewUser && (
                    <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-green-800 text-center">
                            Please complete your profile information below.
                        </p>
                    </div>
                )}
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    {/* Header Section */}
                    <div className="relative h-40 bg-gradient-to-r from-blue to-blue">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white 
                                    ${isEditing && !hasProfileImage ? 'border-yellow animate-pulse' : 'border-white'}`}>
                                    {(previewImage || profile.profileImage) ? (
                                        <img 
                                            src={previewImage || profile.profileImage} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                                            <FaUser className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <FaSpinner className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                                {isEditing && (
                                    <label 
                                        htmlFor="image-upload" 
                                        className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors duration-200 ${!hasProfileImage ? 'bg-blue animate-pulse' : 'bg-blue hover:bg-blue'}`}
                                    >
                                        <FaCamera className="w-6 h-6 text-white" />
                                        <input 
                                            id="image-upload"
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                               {isEditing && !hasProfileImage && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full 
                                    text-yellow text-sm px-3 py-1 rounded-full flex items-center 
                                    max-w-[90vw] whitespace-nowrap overflow-hidden text-ellipsis shadow-sm z-10">
                                    <FaExclamationCircle className="mr-1 flex-shrink-0" />
                                    <span className="truncate">Image required before saving</span>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {profile.name || "Your Profile"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaUser className="w-4 h-4 mr-2 text-blue" />
                                        Full Name
                                    </label>
                                    <input
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                            ${isEditing 
                                                ? 'border-blue focus:ring-darkblue bg-white' 
                                                : 'border-gray-200 bg-gray-50'
                                            } transition-all duration-200`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaPhone className="w-4 h-4 mr-2 text-blue" />
                                        Contact Number
                                    </label>
                                    <input
                                        name="contactNumber"
                                        value={profile.contactNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter your contact number"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                            ${isEditing 
                                                ? 'border-blue focus:ring-darkblue bg-white' 
                                                : 'border-gray-200 bg-gray-50'
                                            } transition-all duration-200`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue" />
                                    Address
                                </label>
                                <input
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter your address"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                                        ${isEditing 
                                            ? 'border-blue focus:ring-darkblue bg-white' 
                                            : 'border-gray-200 bg-gray-50'
                                        } transition-all duration-200`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <FaEnvelope className="w-4 h-4 mr-2 text-blue" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email || ""}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div className="pt-6 flex justify-center gap-4">
                                {isEditing ? (
                                    <>
                                        <button 
                                            type="submit" 
                                            disabled={!isDirty || uploadingImage || !hasProfileImage}
                                            className={`flex items-center px-6 py-2 rounded-lg text-white
                                                ${isDirty && !uploadingImage && hasProfileImage
                                                    ? 'bg-blue hover:bg-darkblue' 
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                } transition-colors duration-200`}
                                        >
                                            <FaSave className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleCancel}
                                            className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 
                                                hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <FaTimes className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={handleEditClick}
                                        className="flex items-center px-6 py-2 bg-blue text-white rounded-lg 
                                            hover:bg-blue transition-colors duration-200"
                                    >
                                        <FaPencilAlt className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;